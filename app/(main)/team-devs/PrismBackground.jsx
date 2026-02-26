"use client";

export default function PrismBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Main prism glow */}
      <div className="absolute inset-0 animate-prism bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.25),transparent_60%)]" />

      {/* Secondary depth layer */}
      <div className="absolute inset-0 animate-prismSlow bg-[radial-gradient(circle_at_30%_70%,rgba(16,185,129,0.15),transparent_55%)]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.9)_85%)]" />
    </div>
  );
}
