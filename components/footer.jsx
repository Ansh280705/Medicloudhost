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
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [modal, setModal] = useState(null);
  return (
    <footer className="relative  overflow-hidden bg-[rgb(238,239,248)]">
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
            DoctorDesk
          </span>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-20 grid grid-cols-2 md:grid-cols-6 gap-10 text-sm text-muted-foreground">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center ">
              <Image
                src="/final-logo.png"
                alt="DoctorDesk Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h3 className="text-lg font-semibold text-foreground">
                Doctor<span className="text-client">Desk</span>
              </h3>
            </div>
            <p className="mt-3 max-w-sm">
              Online session scheduling made simple, secure, and accessible for
              everyone.
            </p>
            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-client shrink-0" />
                <p className="font-semibold text-foreground">Yashoda Dental Care</p>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-client shrink-0" />
                <p>Dr. Ankit Chourasiya</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-client shrink-0" />
                <p>+91 81094-24356</p>
                {/* <p>+91 7987109645</p> */}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-client shrink-0" />
                <p>doctordeskofficial@gmail.com</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-client shrink-0 mt-0.5" />
                <p>
                  First Floor, Plot No. 17, Above New Globas Medical, Opposite
                  Satish Kirana, Gori Nagar, New Gouri Nagar, Sukhliya, Indore,
                  Madhya Pradesh – 452010
                  {/* 513, Vynaktesh Vihar Chota Bangarda Road <br /> Indore, Madhya
                  Pradesh – 452005 <br /> India */}
                </p>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                {/* <Link href="#" className="hover:text-client">
                  Features
                </Link> */}
              </li>
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
                {/* <Link href="#" className="hover:text-client">
                  Docs
                </Link> */}
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

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex items-center gap-4">
              <button onClick={() => setModal("sms")} className="btn">
                <MessageCircle className="w-6 h-6" />
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
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div>
        <div className="container mx-auto px-6 lg:px-20 border-t border-border/60 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>🟢 All systems operational</span>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-client">
              Privacy-Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-client">
              Terms & Conditions
            </Link>
            {/* <Link href="/shipping-and-delivery" className="hover:text-client">
              Shipping
            </Link>
            <Link href="/cancellation-policy" className="hover:text-client">
              Cancellation
            </Link> */}
            <Link href="/refund-policy" className="hover:text-client">
              Returns & Refunds
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-6 lg:px-20 py-4 text-xs text-muted-foreground text-center border-t border-border/60 flex flex-col items-center gap-2">
          <span>© {new Date().getFullYear()} DoctorDesk</span>
          <p>
            <strong>Company Name:</strong> DoctorDesk | <strong>Clinic:</strong> Yashoda Dental Care | <strong>Owner:</strong>{" "}
            Dr. Ankit Chourasiya | <strong>Business Type:</strong> Individual /
            Proprietorship | <strong>Service Type:</strong> SaaS / IT Services
          </p>
          <p>
            <strong>Support:</strong> doctordeskOfficial@gmail.com
          </p>
          <p className="mt-2">
            <strong>Refund Policy:</strong> If we approve your refund, we will process and credit it to your bank account within 3-5 days.
          </p>
          {/* <p className="mt-2">
            DoctorDesk is a technology platform and does not provide medical
            consultation, diagnosis, treatment, or prescriptions. All services
            are provided independently by professionals using the platform.
          </p> */}
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
                    doctordeskofficial@gmail.com
                  </span>
                </p>
                <Link
                  href="mailto:doctordesk@gmail.com"
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
function SocialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

        <div className="space-y-4">
          <a
            href="https://instagram.com/yourpage"
            target="_blank"
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
          >
            <Instagram /> Instagram
          </a>

          <a
            href="mailto:doctordeskofficial@gmail.com"
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
          >
            <Mail /> Email Us
          </a>

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
          >
            <MessageCircle /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
