import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import PrescriptionCard from "./PrescriptionCard";
import { Notebook } from "lucide-react";

export default async function PrescriptionsPage() {
  const user = await currentUser();

  if (!user) {
    return <p className="p-4">Please login to see your prescriptions.</p>;
  }

  // STEP 1: Get Prisma user using Clerk ID
  const prismaUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!prismaUser) {
    return <p className="p-4">User not found.</p>;
  }

  // STEP 2: Fetch prescriptions using prisma user ID
  const prescriptions = await db.prescription.findMany({
    where: {
      patientId: prismaUser.id,
    },
    include: {
      appointment: {
        include: {
          doctor: {
            select: { name: true, specialty: true, qualifications: true },
          },
          patient: { select: { name: true } },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (prescriptions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No prescriptions found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-client/10 text-client">
            <Notebook className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Prescriptions
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {prescriptions.map((p) => (
          <PrescriptionCard key={p.id} prescription={p} />
        ))}
      </div>
    </div>
  );
}
