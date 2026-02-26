import { db } from "@/lib/prisma";
import VideoCall from "./video-call";

export default async function VideoCallPage({ searchParams }) {
  const { sessionId, token, appointmentId } = await searchParams;

  // Basic guard
  if (!sessionId || !token || !appointmentId) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Invalid video call link
      </div>
    );
  }

  // Fetch appointment including doctor
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      endTime: true,
      startTime: true, // ✅ Fetch start time
      doctor: {
        select: { name: true },
      },
    },
  });

  if (!appointment) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Appointment not found
      </div>
    );
  }

  return (
    <VideoCall
      sessionId={sessionId}
      token={token}
      appointmentStartTime={appointment.startTime} // ✅ Pass start time
      appointmentEndTime={appointment.endTime}
      appointmentId={appointmentId}
      doctorName={appointment.doctor?.name || "Doctor"} // fallback
    />
  );
}
