"use client";

import { useRef, useEffect } from "react";
import { testimonials } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, User2 } from "lucide-react";

export default function TestimonialMarquee() {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    if (row1Ref.current) row1Ref.current.style.animationPlayState = "running";
    if (row2Ref.current) row2Ref.current.style.animationPlayState = "running";
  }, []);

  const pause = (ref) => ref.current && (ref.current.style.animationPlayState = "paused");
  const play = (ref) => ref.current && (ref.current.style.animationPlayState = "running");

  const half = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, half);
  const secondRow = testimonials.slice(half);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2">
          What Our Patients Say
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm sm:text-base">
          Real reviews from Google
        </p>

        {/* ROW 1 */}
        <div className="relative overflow-hidden">
          {/* Blur (desktop only) */}
          <div className="hidden sm:block pointer-events-none absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="hidden sm:block pointer-events-none absolute right-0 top-0 z-20 h-full w-24 bg-gradient-to-l from-background via-background/80 to-transparent" />

          <div
            ref={row1Ref}
            className="flex gap-4 sm:gap-6 animate-marquee"
            onMouseEnter={() => pause(row1Ref)}
            onMouseLeave={() => play(row1Ref)}
          >
            {[...firstRow, ...firstRow].map((t, i) => (
              <TestimonialCard key={`row1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="relative overflow-hidden mt-8 sm:mt-12">
          <div className="hidden sm:block pointer-events-none absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="hidden sm:block pointer-events-none absolute right-0 top-0 z-20 h-full w-24 bg-gradient-to-l from-background via-background/80 to-transparent" />

          <div
            ref={row2Ref}
            className="flex gap-4 sm:gap-6 animate-marquee-reverse"
            onMouseEnter={() => pause(row2Ref)}
            onMouseLeave={() => play(row2Ref)}
          >
            {[...secondRow, ...secondRow].map((t, i) => (
              <TestimonialCard key={`row2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  return (
    <Card
      className="
        min-w-[220px] sm:min-w-[300px]
        max-w-[260px] sm:max-w-[300px]
        rounded-xl
        border border-white/10
        bg-[#F8f8ff]
        transition-transform duration-300
        hover:scale-[1.03]
        flex flex-col
      "
    >
      <CardContent className="p-3 sm:p-6 flex flex-col h-full">
        
        {/* ⭐ Stars */}
        <div className="flex gap-1 mb-2 sm:mb-3 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                i < t.rating ? "text-yellow-400" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* 📝 Review (fixed height area) */}
        <p className="text-xs sm:text-base text-muted-foreground leading-snug sm:leading-relaxed mb-4 min-h-[60px] sm:min-h-[80px]">
          “{t.quote}”
        </p>

        {/* 👤 Name + Role always bottom aligned */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-client">
            <User2 className="w-4 h-4" />
            {t.name}
          </div>
          <div className="text-[11px] sm:text-sm text-muted-foreground">
            {t.role}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
