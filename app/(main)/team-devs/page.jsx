"use client";

import PrismBackground from "./PrismBackground";
import LanyardFlipCard from "./LanyardFlipCard";
import { devs } from "./data";

export default function TeamDevsPage() {
  return (
    <>
      {/* Background */}
      <PrismBackground />

      {/* Content */}
      <section className="relative z-10 min-h-screen py-28 text-white">
        <div className="container mx-auto px-6 lg:px-20">

          <div className="text-center mb-20">
            <h1 className="text-4xl font-bold">The Dev Team</h1>
            <p className="text-white/70 mt-2">
              People behind DoctorDesk
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-16">
            {devs.map((dev) => (
              <LanyardFlipCard key={dev.name} {...dev} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
