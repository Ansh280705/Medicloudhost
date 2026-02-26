"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getEmergencyContacts,
  updateEmergencyContacts,
} from "@/actions/safety";
import { toast } from "sonner";
import {
  UserPlus,
  Trash2,
  ShieldAlert,
  Mail,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function EmergencyContactsPage() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getEmergencyContacts().then((res) => {
      if (res.emails) setEmails(res.emails);
      setLoading(false);
    });
  }, []);

  const addEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (emails.includes(trimmed)) {
      toast.error("This email is already added.");
      return;
    }
    if (emails.length >= 5) {
      toast.error("Maximum 5 emergency contacts allowed.");
      return;
    }
    setEmails((prev) => [...prev, trimmed]);
    setNewEmail("");
  };

  const removeEmail = (email) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateEmergencyContacts(emails);
      if (res.success) {
        toast.success("Emergency contacts saved!", {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        });
      } else {
        toast.error(res.error || "Failed to save contacts.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Emergency Contacts</h1>
            <p className="text-sm text-muted-foreground">
              These people get emailed instantly when you press SOS.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div className="text-sm text-red-700">
            <strong>How it works:</strong> When you tap the SOS button, all contacts below receive an email with your live location and emergency details immediately.
            <br />
            <span className="text-xs text-red-500 mt-1 inline-block">
              Add trusted family members, friends, or caregivers (max 5).
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-6">

          {/* Add Email */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
              Add Contact Email
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEmail()}
                  placeholder="familymember@gmail.com"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={addEmail}
                disabled={!newEmail.trim()}
                className="flex items-center gap-1.5 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Contact List */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
              Your Contacts ({emails.length}/5)
            </label>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-red-200" />
                <p className="text-sm">No emergency contacts added yet.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add at least one contact so someone is alerted in an emergency.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {emails.map((email, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-xl group hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-black text-red-600">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700 break-all">
                        {email}
                      </span>
                    </div>
                    <button
                      onClick={() => removeEmail(email)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isPending || loading}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Save Emergency Contacts</>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Medicloud will never share these emails for marketing purposes.
        </p>
      </div>
    </div>
  );
}
