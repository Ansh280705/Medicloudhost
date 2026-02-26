"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  ArrowRight,
  Mail,
  X,
  Phone,
  MailIcon,
  Link2,
  MapPin,
  User,
  Building2,
  AlertCircle,
  Plus,
  Trash,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getEmergencyContacts, updateEmergencyContacts } from "@/actions/safety";
import { toast } from "sonner";

export default function Footer() {
  const [modal, setModal] = useState(null);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (modal === "sos") {
      getEmergencyContacts().then((res) => {
        if (res.emails) setEmails(res.emails);
      });
    }
  }, [modal]);

  const handleAddEmail = () => {
    if (!newEmail.includes("@")) return toast.error("Invalid email");
    if (emails.includes(newEmail)) return toast.success("Email already in list");
    setEmails([...emails, newEmail]);
    setNewEmail("");
  };

  const handleRemoveEmail = (idx) => {
    setEmails(emails.filter((_, i) => i !== idx));
  };

  const handleSaveContacts = async () => {
    setSaving(true);
    const res = await updateEmergencyContacts(emails);
    setSaving(false);
    if (res.success) {
      toast.success("Secondary contacts updated ✅");
      setModal(null);
    } else {
      toast.error(res.error || "Failed to update");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[rgb(238,239,248)]">
      {/* ================= CTA SECTION ================= */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 ">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-10 md:p-14">
          {/* ECG BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="ecg-wrapper">
              <svg
                viewBox="0 0 500 200"
                className="ecg-svg"
                preserveAspectRatio="none"
              >
                <polyline
                  className="ecg-line"
                  points="486.6,113.8 328.2,113.8 310.3,132.3 296,70.7 246.8,127.4 241.6,120.2
                    233.9,166.4 227,27.6 213.2,118.3 211.8,112.3 205.1,126.1
                    198.2,108.5 194.1,124.4 184.5,92.9 174.1,113 4.3,113"
                />
              </svg>
            </div>
          </div>

          {/* CONTENT */}
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
              Consult trusted experts online using a simple credit-based system.
            </h2>

            <div className="flex items-center gap-4 md:justify-end">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-6 py-2 text-white"
              >
                <Link href="/onboarding">
                  Get Started <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER CONTENT ================= */}
      <div className="relative mt-24 pb-16">
        {/* Watermark */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none translate-y-24">
          <span className="text-[12rem] md:text-[16rem] font-bold tracking-tight text-client/10 select-none whitespace-nowrap">
            MediCloud
          </span>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-20 grid grid-cols-2 md:grid-cols-6 gap-10 text-sm text-muted-foreground">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center ">
              <Image
                src="/medi-cloud-logo.png"
                alt="MediCloud Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h3 className="text-lg font-semibold text-foreground">
                Medi<span className="text-client">Cloud</span>
              </h3>
            </div>
            <p className="mt-3 max-w-sm">
              Online session scheduling made simple, secure, and accessible for
              everyone.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="hover:text-client">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/credits" className="hover:text-client">
                  Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-client"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-client">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-client"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/ContactUs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-client"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team-devs?coffee=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-client"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-information"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-client"
                >
                  Legal Information
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModal("sos")}
                className="btn group relative"
                title="SOS Settings"
              >
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <AlertCircle className="w-6 h-6 text-red-500" />
              </button>

              <button onClick={() => setModal("email")} className="btn">
                <Mail className="w-6 h-6" />
              </button>

              <button onClick={() => setModal("insta")} className="btn">
                <Instagram className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-20">
          <div className="container mx-auto px-6 lg:px-20 border-t border-border/60 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>🟢 All systems operational</span>

            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-client">
                Privacy-Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-client">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-client">
                Returns & Refunds
              </Link>
            </div>
          </div>
          <div className="container mx-auto px-6 lg:px-20 py-4 text-xs text-muted-foreground text-center border-t border-border/60 flex flex-col items-center gap-2">
            <span>© {new Date().getFullYear()} MediCloud</span>
            <p className="mt-2">
              <strong>Refund Policy:</strong> If we approve your refund, we will process and credit it to your bank account within 3-5 days.
            </p>
            <p className="mt-2">
              MediCloud is a technology platform and does not provide medical
              consultation, diagnosis, treatment, or prescriptions. All services
              are provided independently by professionals using the platform.
            </p>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* SOS SETTINGS */}
            {modal === "sos" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">SOS Settings</h4>
                    <p className="text-xs text-muted-foreground">Emergency Alerts for Family & Friends</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Secondary Emails</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Add family/friend email"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                      />
                      <button
                        onClick={handleAddEmail}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {emails.length === 0 ? (
                      <p className="text-center py-4 text-xs text-muted-foreground italic bg-gray-50 rounded-lg border border-dashed">
                        No secondary contacts added yet.
                      </p>
                    ) : (
                      emails.map((email, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-red-50/30 border border-red-100 rounded-xl group animate-in slide-in-from-left-2 duration-300">
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">{email}</span>
                          <button
                            onClick={() => handleRemoveEmail(i)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSaveContacts}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-md shadow-red-200 transition-all font-semibold"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </span>
                    ) : (
                      "Save Emergency Contacts"
                    )}
                  </Button>
                  <p className="text-[10px] text-center mt-3 text-muted-foreground italic">
                    When you trigger SOS, a high-priority alert will be sent to these emails with your location.
                  </p>
                </div>
              </div>
            )}

            {/* SMS */}
            {modal === "sms" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Send SMS</h4>
                <p className="text-muted-foreground mb-4 flex items-center gap-2">
                  Send a quick message at
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Phone className="w-4 h-4" />
                    +91 81094 24356
                  </span>
                </p>
                <Link
                  href="sms:8109424356"
                  className="block text-center rounded-xl bg-client py-3 text-white font-medium hover:bg-client/80 "
                >
                  Send SMS
                </Link>
              </>
            )}

            {/* EMAIL */}
            {modal === "email" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Send Email</h4>
                <p className="text-muted-foreground mb-4 flex items-center gap-2">
                  Send Email At
                  <span className="flex items-center gap-1 font-medium text-foreground ">
                    <MailIcon className="w-4 h-4" />
                    Medicloudofficial@gmail.com
                  </span>
                </p>
                <Link
                  href="mailto:Medicloud@gmail.com"
                  className="block text-center rounded-xl bg-client py-3 text-white font-medium hover:bg-client/80 transition-all duration-700"
                >
                  Send Email
                </Link>
              </>
            )}

            {/* INSTAGRAM */}
            {modal === "insta" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Instagram</h4>
                <p className="text-muted-foreground mb-4 flex flex-col items-center gap-2">
                  Follow On Instagram <Link2 className="w-4 h-4" />
                  <span className="flex items-center gap-1 font-medium text-foreground  transition-all duration-700"></span>
                </p>
                <Link
                  href="https://www.instagram.com/dr.ankit_chourasiya_/"
                  target="_blank"
                  className="block text-center rounded-xl bg-client py-3 text-white font-medium hover:bg-client/80 transition-all duration-700"
                >
                  Open Instagram
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
