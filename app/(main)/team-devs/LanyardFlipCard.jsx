"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin } from "lucide-react";

export default function LanyardFlipCard({
  name,
  role,
  tech,
  bio,
  power,
  isLead,
  linkedin,
  github,
  stack,
}) {
  const [flipped, setFlipped] = useState(false);

  const handleToggle = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col items-center perspective">

      {/* Rope */}
      <svg width="6" height="110" className="mb-4">
        <line
          x1="3"
          y1="0"
          x2="3"
          y2="110"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
        />
      </svg>

      {/* Flip Wrapper */}
      <div
        onClick={handleToggle}
        className={`relative w-80 h-[26rem] cursor-pointer
        [transform-style:preserve-3d]
        transition-transform
        ${
          isLead ? "duration-[1200ms]" : "duration-700"
        }
        ${flipped ? "rotate-y-180" : ""}
        md:hover:rotate-y-180`}
      >

        {/* ================= FRONT ================= */}
        <div
          className={`absolute inset-0 backface-hidden rounded-3xl border p-6 flex flex-col
          ${
            isLead
              ? "border-indigo-400/30 bg-white/10 backdrop-blur-xl shadow-[0_40px_120px_rgba(99,102,241,0.35)]"
              : "border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          }`}
        >

          {/* Avatar */}
          <div className="mx-auto mb-4 h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {name.charAt(0)}
          </div>

          {/* Name + Lead Badge */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-semibold text-white">
                {name}
              </h3>
              

              {isLead && (
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Lead
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-white/60">
              {role}
            </p>
          </div>

          {/* Tech */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {tech.map((t) => (
              <Badge
                key={t}
                className="bg-white/10 text-white/80 border-white/10"
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Hint */}
          <p className="mt-auto text-center text-xs text-white/40 md:hidden">
            Tap to flip
          </p>
          <p className="mt-auto text-center text-xs text-white/40 hidden md:block">
            Hover to flip
          </p>
        </div>

        {/* ================= BACK ================= */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-3xl border border-white/15 bg-black/70 backdrop-blur-xl p-6 flex flex-col justify-center text-white shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

          <p className="text-sm italic text-white/80 text-center mb-6">
            “{bio}”
          </p>

          <div className="text-center mb-6">
            <p className="text-xs text-white/40 mb-1">
              ⚡ Core Strength
            </p>
            <p className="font-mono text-sm text-white">
              {power}
            </p>
          </div>

          {/* Social */}
          {(linkedin || github) && (
            <div className="flex justify-center gap-4 text-white/70">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-5 w-5 hover:text-white transition" />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer">
                  <Github className="h-5 w-5 hover:text-white transition" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
