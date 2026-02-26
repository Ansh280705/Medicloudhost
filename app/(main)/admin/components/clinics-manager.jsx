"use client";

import { useState } from "react";
import {
  Building2, Plus, Trash2, ToggleLeft, ToggleRight,
  Phone, MapPin, Clock, User, Stethoscope, Loader2,
  CheckCircle2, XCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { addClinic, deleteClinic, toggleClinicStatus } from "@/actions/clinics";
import { toast } from "sonner";

const SPECIALTIES = [
  "General Physician", "Dentist", "Cardiologist", "Dermatologist",
  "Orthopedic", "Pediatrician", "Gynecologist", "Neurologist",
  "Ophthalmologist", "ENT Specialist", "Psychiatrist", "Physiotherapist",
  "Diabetologist", "Urologist", "Gastroenterologist", "Other",
];

const EMPTY_FORM = {
  name: "", doctorName: "", specialty: "General Physician",
  phone: "", email: "", address: "", city: "", state: "", pincode: "", timing: "",
};

export function ClinicsManager({ clinics: initialClinics }) {
  const [clinics, setClinics] = useState(initialClinics);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    // Validate required fields
    const required = ["name", "doctorName", "specialty", "phone", "address", "city", "state", "pincode", "timing"];
    for (const field of required) {
      if (!form[field].trim()) return toast.error(`Please fill in: ${field}`);
    }

    setSaving(true);
    const res = await addClinic(form);
    setSaving(false);

    if (res.success) {
      toast.success(
        res.geocoded
          ? "✅ Clinic added & location auto-detected!"
          : "✅ Clinic added. Location could not be auto-detected — you may update coordinates manually."
      );
      setClinics((prev) => [res.clinic, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } else {
      toast.error(res.error || "Failed to add clinic");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this clinic? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await deleteClinic(id);
    setDeletingId(null);
    if (res.success) {
      setClinics((prev) => prev.filter((c) => c.id !== id));
      toast.success("Clinic removed");
    } else {
      toast.error(res.error);
    }
  };

  const handleToggle = async (id, current) => {
    setTogglingId(id);
    const res = await toggleClinicStatus(id, !current);
    setTogglingId(null);
    if (res.success) {
      setClinics((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !current } : c));
      toast.success(!current ? "Clinic activated" : "Clinic deactivated");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-client" /> Offline Clinics
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {clinics.length} clinic{clinics.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-client text-white rounded-xl text-sm font-semibold hover:bg-client/90 transition-all"
        >
          {showForm ? <><ChevronUp className="w-4 h-4" /> Hide Form</> : <><Plus className="w-4 h-4" /> Add Clinic</>}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <h3 className="font-bold text-base mb-2">Register New Clinic</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Clinic Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Yashoda Dental Care" />
            <Field label="Doctor Name *" name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="e.g. Dr. Ankit Chourasiya" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Specialty *</label>
              <select name="specialty" value={form.specialty} onChange={handleChange} className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-client/50">
                {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <Field label="Phone *" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            <Field label="Email (optional)" name="email" type="email" value={form.email} onChange={handleChange} placeholder="clinic@example.com" />
            <Field label="Timing *" name="timing" value={form.timing} onChange={handleChange} placeholder="Mon–Sat, 9am–6pm" />
          </div>

          <Field label="Full Address *" name="address" value={form.address} onChange={handleChange} placeholder="Plot No. 17, Above New Globas Medical..." />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="City *" name="city" value={form.city} onChange={handleChange} placeholder="Indore" />
            <Field label="State *" name="state" value={form.state} onChange={handleChange} placeholder="Madhya Pradesh" />
            <Field label="Pincode *" name="pincode" value={form.pincode} onChange={handleChange} placeholder="452010" />
          </div>

          <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
            📍 Lat/Long will be <strong>auto-detected</strong> from the address using OpenStreetMap — no manual entry needed.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-client text-white rounded-xl font-semibold text-sm hover:bg-client/90 transition-all disabled:opacity-60"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving & Geocoding...</> : <><Plus className="w-4 h-4" /> Add Clinic</>}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Clinics Table */}
      {clinics.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No clinics added yet</p>
          <p className="text-sm mt-1">Click "Add Clinic" to register the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clinics.map((clinic) => (
            <div key={clinic.id} className={`bg-card border rounded-2xl p-4 transition-all ${clinic.isActive ? "border-border" : "border-border/40 opacity-60"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base truncate">{clinic.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${clinic.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {clinic.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">{clinic.specialty}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{clinic.doctorName}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{clinic.phone}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{clinic.city}, {clinic.state} – {clinic.pincode}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{clinic.timing}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">📍 {clinic.address}</p>
                  {clinic.latitude !== 0 && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      ✅ Location: {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
                    </p>
                  )}
                  {clinic.latitude === 0 && (
                    <p className="text-[10px] text-orange-500 mt-0.5">⚠️ Location not detected — distance won't be shown to patients</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggle(clinic.id, clinic.isActive)}
                    disabled={togglingId === clinic.id}
                    className="p-2 rounded-xl hover:bg-muted transition-all"
                    title={clinic.isActive ? "Deactivate" : "Activate"}
                  >
                    {togglingId === clinic.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : clinic.isActive ? (
                      <ToggleRight className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(clinic.id)}
                    disabled={deletingId === clinic.id}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                    title="Delete clinic"
                  >
                    {deletingId === clinic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable field
function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-client/50 transition-all"
      />
    </div>
  );
}
