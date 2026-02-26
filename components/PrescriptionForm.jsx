"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPrescription } from "@/actions/prescription";

export default function PrescriptionForm({ appointment, doctor }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    instructions: "",
    followUpDate: "",
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
      });
      toast.success("Notes saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">📝 Session Notes</h2>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="font-medium">Client</p>
          <p className="text-gray-600">{appointment.patient.name}</p>
        </div>
        <div>
          <p className="font-medium">Professional</p>
          <p className="text-gray-600">{doctor.name}</p>
        </div>
        <div>
          <p className="font-medium">Date</p>
          <p className="text-gray-600">{new Date(appointment.startTime).toLocaleDateString()}</p>
        </div>
      </div>

      <textarea
        placeholder="Summary / Topic"
        className="w-full border p-2 rounded mb-3"
        value={form.diagnosis}
        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
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
        className="border p-2 rounded mb-4"
        value={form.followUpDate}
        onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
      />

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Notes"}
      </button>
    </div>
  );
}
