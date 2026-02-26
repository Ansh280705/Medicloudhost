
"use server"
import { VerificationStatus } from "@/lib/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { deductCreditsForAppointment } from "./credit";
import { revalidatePath } from "next/cache";
import { Vonage } from "@vonage/server-sdk";
import { addDays, addMinutes, isBefore, endOfDay, format } from "date-fns";
import { auth } from "@clerk/nextjs/server";

// Initialize Vonage Video API client
// const vonage = new Vonage({
//   applicationId: process.env.VONAGE_APPLICATION_ID,      // Server-only
//   privateKey: process.env.VONAGE_PRIVATE_KEY.replace(/\\n/g, "\n"),            // Server-only
// });

if (!process.env.VONAGE_PRIVATE_KEY) {
  throw new Error("VONAGE_PRIVATE_KEY is missing in environment variables");
}

// const vonage = new Vonage({
//   applicationId: process.env.VONAGE_APPLICATION_ID,
//   privateKey: process.env.VONAGE_PRIVATE_KEY.replace(/\\n/g, "\n"),
// });
const VONAGE_PRIVATE_KEY = process.env.VONAGE_PRIVATE_KEY
  .replace(/\\n/g, "\n")
  .trim();

const vonage = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: VONAGE_PRIVATE_KEY,
});


export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return { doctor };
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    throw new Error("Failed to fetch doctor details");
  }
}

export async function getAvailableTimeSlots(doctorId) {

    const Slot_duration=2;
  try {
    // Validate doctor existence and verification
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Fetch a single availability record
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    // if (!availability) {
    //   throw new Error("No availability set by doctor");
    // }
if (!availability) {
  return {
    days: [],
    message: "Doctor has not set availability yet",
  };
}
    // Get the next 4 days
    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    // Fetch existing appointments for the doctor over the next 4 days
    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay = {};

    // For each of the next 4 days, generate available slots
    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      // Create a copy of the availability start/end times for this day
      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      // Set the day to the current day we're processing
      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, Slot_duration), end) ||
        +addMinutes(current, Slot_duration) === +end
      ) {
        const next = addMinutes(current, Slot_duration);

        // Skip past slots
        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    // Convert to array of slots grouped by day for easier consumption by the UI
    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}

export async function bookAppointment(formData){
 const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const patient = await db.user.findUnique({
      where: { clerkUserId: userId, role: "PATIENT" },
    });
    if (!patient) throw new Error("Patient not found");

    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    // New patient info fields
  const patientName = formData.get("patientName");
const patientPhone = formData.get("patientPhone");
const patientAge = parseInt(formData.get("patientAge"));
const patientGender = formData.get("patientGender");

    if (!doctorId || !startTime || !endTime || !patientName || !patientPhone || !patientAge || !patientGender) {
      throw new Error("All fields are required");
    }

    // Check if the doctor exists and is verified
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Check if the patient has enough credits (1 credit per appointment)
    if (patient.credits < 1) {
      throw new Error("Insufficient credits to book an appointment");
    }

    // Check if the requested time slot is available
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            // New appointment ends during an existing appointment
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            // New appointment completely overlaps an existing appointment
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    // Create a new Vonage Video API session
    const sessionId = await createVideoSession();

    const { success, error } = await deductCreditsForAppointment(patient.id, doctorId);
    if (!success) throw new Error(error || "Failed to deduct credits");

    // Create appointment and save patient info
    const appointment = await db.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        startTime,
        endTime,
        patientDescription,
        patientName,
        patientPhone,
        patientAge,
        patientGender,
        status: "SCHEDULED",
        videoSessionId: sessionId,
      },
    });

    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw new Error("Failed to book appointment: " + error.message);
  }
}



async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    return session.sessionId;
  } catch (error) {
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Generate a token for a video session
 * This will be called when either doctor or patient is about to join the call
 */
export async function generateVideoToken(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // 1️⃣ Fetch logged-in user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2️⃣ Get appointment ID
    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // 3️⃣ Fetch appointment
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // 4️⃣ Validate user belongs to appointment
    if (
      appointment.doctorId !== user.id &&
      appointment.patientId !== user.id
    ) {
      throw new Error("You are not authorized to join this call");
    }

    // 5️⃣ Allow joining only 5 minutes before start
    const now = new Date();
    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);

    const minutesBeforeStart =
      (appointmentStart.getTime() - now.getTime()) / (1000 * 60);

    if (minutesBeforeStart > 2) {
      throw new Error(
        "You can join the call only 2 minutes before the scheduled time"
      );
    }

    // 6️⃣ Create Vonage video token
    const token = vonage.video.generateClientToken(
      appointment.videoSessionId,
      {
        role: "publisher",
        expireTime: Math.floor(appointmentEnd.getTime() / 1000), // token expires when call ends
        data: JSON.stringify({
          userId: user.id,
          name: user.name,
          role: user.role,
        }),
      }
    );

    // 7️⃣ Save token (optional but useful for debugging)
    await db.appointment.update({
      where: { id: appointmentId },
      data: { videoSessionToken: token },
    });

    // 8️⃣ AUTO-END CALL AT EXACT APPOINTMENT END TIME
    const millisecondsUntilEnd = appointmentEnd.getTime() - Date.now();

    if (millisecondsUntilEnd > 0) {
  setTimeout(async () => {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    console.log("Session marked as completed");
  } catch (err) {
    console.error("Failed to end session:", err);
  }
}, millisecondsUntilEnd);
    }

    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    throw new Error(error.message);
  }
}

export async function getAppointmentById(id) {
 const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
          qualifications: true,
        },
      },
      prescription: true, // if you want prescription data too
    },
  });

  if (!appointment) throw new Error("Appointment not found");

  return appointment;
}