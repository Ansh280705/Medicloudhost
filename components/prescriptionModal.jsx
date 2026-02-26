"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPrescription } from "@/actions/prescription";
import { useRouter } from "next/navigation";

export default function PrescriptionModal({ appointment, doctor, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    instructions: "",
    followUpDate: "",
    medicalHistory: "",
  });

  const handleSubmit = async () => {
    if (!form.diagnosis || !form.medicines) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await createPrescription({
        appointmentId: appointment.id,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        instructions: form.instructions,
        followUpDate: form.followUpDate,
        medicalHistory: form.medicalHistory,
      });

      toast.success("Notes saved successfully");
      onClose();
      router.push("/doctor?tab=appointments");
    
    } catch (err) {
      toast.error(err.message || "Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Session Notes</h2>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-3 rounded">
          <div>
            <p className="font-medium">Client Name</p>
            <p className="text-gray-600">{appointment.patientName}</p>
          </div>

          <div>
            <p className="font-medium">Age</p>
            <p className="text-gray-600">{appointment.patientAge} yrs</p>
          </div>

          <div>
            <p className="font-medium">Gender</p>
            <p className="text-gray-600">{appointment.patientGender}</p>
          </div>

          <div>
            <p className="font-medium">Phone</p>
            <p className="text-gray-600">{appointment.patientPhone}</p>
          </div>

          <div>
            <p className="font-medium">Professional</p>
            <p className="text-gray-600">{doctor?.name}</p>
          </div>

          <div>
            <p className="font-medium">Date</p>
            <p className="text-gray-600">
              {new Date(appointment.startTime).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* FORM INPUTS */}

        <textarea
          placeholder="Summary / Topic"
          className="w-full border p-2 rounded mb-3"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
        />
        <textarea
          placeholder="Background / Context"
          className="w-full border p-2 rounded mb-3"
          value={form.medicalHistory}
          onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
        />
        <textarea
          placeholder="Recommendations / Action Items"
          className="w-full border p-2 rounded mb-3"
          value={form.medicines}
          onChange={(e) => setForm({ ...form, medicines: e.target.value })}
        />

        <textarea
          placeholder="Next Steps"
          className="w-full border p-2 rounded mb-3"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded mb-4 w-full"
          value={form.followUpDate}
          onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
        />

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
