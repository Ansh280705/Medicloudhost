"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPrescription({
  appointmentId,
  diagnosis,
  medicines,
  instructions,
  medicalHistory,
  followUpDate,
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Map Clerk → Prisma user
  const prismaUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!prismaUser) throw new Error("User not found");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.doctorId !== prismaUser.id) {
    throw new Error("Not allowed");
  }

  const exists = await db.prescription.findUnique({
    where: { appointmentId },
  });

  if (exists) throw new Error("Prescription already submitted");

  const prescription = await db.prescription.create({
    data: {
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      diagnosis,
      medicines,
      instructions,
      medicalHistory,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    },
    include: {
      appointment: {
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialty: true,
              qualifications: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // ✅ Ensure doctor specialty and qualifications have fallback values
  if (prescription.appointment.doctor) {
    prescription.appointment.doctor.specialty =
      prescription.appointment.doctor.specialty || "N/A";

    prescription.appointment.doctor.qualifications =
      prescription.appointment.doctor.qualifications?.length
        ? prescription.appointment.doctor.qualifications
        : ["N/A"];
  }

  // 🔁 refresh patient prescription page
  revalidatePath("/prescriptions");

  return prescription;
}
