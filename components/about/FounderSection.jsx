"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Instagram, X } from "lucide-react";
import { useState } from "react";

export default function FounderSection() {
  const [modal, setModal] = useState(null); // { type: "call" | "sms" | "insta", person: "Ankit" | "Pankaj" }

  const handleModal = (type, person) => {
    setModal({ type, person });
  };

  const founderData = {
    ankit: {
      name: "Dr. Ankit Chourasiya",
      role: "Founder and CEO, DoctorDesk",
      details: "Founder & Product Lead",
      phone: "+91 81094 24356",
      phoneRaw: "8109424356",
      insta: "https://www.instagram.com/dr.ankit_chourasiya_/",
      image: "/about/founder.jpg",
    },
    pankaj: {
      name: "Er. Pankaj Chourasiya",
      role: "Co-Founder, DoctorDesk",
     
      phone: "+91 81094 24356", // Using same as provided previously or placeholder
      phoneRaw: "8109424356",
      insta: "https://www.instagram.com/",
      image: "/about/p1.jpg",
    }
  };

  const activePerson = modal?.person === "Pankaj" ? founderData.pankaj : founderData.ankit;

  return (
    <>
      <section className="py-20 bg-[#fbf7f4]">
        <div className="container mx-auto px-6 lg:px-20 space-y-24">
          
          {/* FOUNDER SECTION */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
               <h3 className="text-4xl font-bold mb-6 leading-tight">
                The Visionary <br />
                <span className="text-client">Founder</span>
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                India doesn’t suffer from a shortage of experts; it suffers from a shortage of access. Rural reach, affordability, fragmented workflow, and time constraints are the real problems. Doctor Desk is my vision to bridge this gap—connecting users with verified professionals and scheduling tools on one trusted platform, at a cost every Indian can afford.
              </p>

              <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-client">
                <p className="font-bold text-xl">{founderData.ankit.name}</p>
                <p className="text-client font-medium">{founderData.ankit.role}</p>
               
                
                <div className="flex gap-4 mt-6">
                  <button onClick={() => handleModal("call", "Ankit")} className="social-btn"><Phone className="w-4 h-4" /> Call</button>
                  <button onClick={() => handleModal("sms", "Ankit")} className="social-btn"><MessageCircle className="w-4 h-4" /> SMS</button>
                  <button onClick={() => handleModal("insta", "Ankit")} className="social-btn"><Instagram className="w-4 h-4" /> Insta</button>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-client to-[#6ba49f] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Image
                  src={founderData.ankit.image}
                  alt={founderData.ankit.name}
                  width={500}
                  height={600}
                  className="relative rounded-3xl object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* CO-FOUNDER SECTION */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6ba49f] to-client rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Image
                  src={founderData.pankaj.image}
                  alt={founderData.pankaj.name}
                  width={500}
                  height={600}
                  className="relative rounded-3xl object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div>
               <h3 className="text-4xl font-bold mb-6 leading-tight">
                Tech Behind <br />
                <span className="text-[#6ba49f]">The Platform</span>
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                With deep expertise in technology and system architecture, Er. Pankaj Chourasiya is the backbone of Doctor Desk’s digital framework. He leads platform development, workflow automation, and system scalability—ensuring Doctor Desk remains robust, user-friendly, and future-ready for India’s growing digital needs.
              </p>

              <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-[#6ba49f]">
                <p className="font-bold text-xl">{founderData.pankaj.name}</p>
                <p className="text-[#6ba49f] font-medium">{founderData.pankaj.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{founderData.pankaj.details}</p>
                
                <div className="flex gap-4 mt-6">
                  <button onClick={() => handleModal("call", "Pankaj")} className="social-btn"><Phone className="w-4 h-4" /> Call</button>
                  <button onClick={() => handleModal("sms", "Pankaj")} className="social-btn"><MessageCircle className="w-4 h-4" /> SMS</button>
                  <button onClick={() => handleModal("insta", "Pankaj")} className="social-btn"><Instagram className="w-4 h-4" /> Insta</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style jsx>{`
        .social-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
      `}</style>

      {/* ================= MODAL ================= */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* CALL MODAL */}
            {modal.type === "call" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Call {activePerson.name}</h4>
                <p className="text-muted-foreground mb-4">Direct contact</p>
                <p className="text-xl font-semibold mb-6 text-client">{activePerson.phone}</p>
                <Link
                  href={`tel:${activePerson.phoneRaw}`}
                  className="block w-full text-center rounded-xl bg-green-600 py-3 text-white font-medium hover:bg-green-700 transition"
                >
                  Call Now
                </Link>
              </>
            )}

            {/* SMS MODAL */}
            {modal.type === "sms" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Send SMS to {activePerson.name}</h4>
                <p className="text-muted-foreground mb-4">Quick message</p>
                <p className="text-xl font-semibold mb-6 text-client">{activePerson.phone}</p>
                <Link
                  href={`sms:${activePerson.phoneRaw}`}
                  className="block w-full text-center rounded-xl bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition"
                >
                  Send SMS
                </Link>
              </>
            )}

            {/* INSTA MODAL */}
            {modal.type === "insta" && (
              <>
                <h4 className="text-lg font-semibold mb-2">Instagram Profile</h4>
                <p className="text-muted-foreground mb-6">Connect on social media</p>
                <Link
                  href={activePerson.insta}
                  target="_blank"
                  className="block w-full text-center rounded-xl bg-pink-600 py-3 text-white font-medium hover:bg-pink-700 transition"
                >
                  Open Instagram
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
