"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpotlightCard from "@/components/ui/SpotlightCard";

export default function Feature({ features }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-14 bg-accent">
      <div className="container mx-auto px-6 lg:px-20">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="text-muted-foreground mt-2">
            Workflow management in just a few clicks
          </p>
        </div>

        {/* Conditionally render carousel or grid */}
        {isMobile ? (
          <Swiper
            modules={[Autoplay, Pagination]}
  loop
  speed={4000}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  spaceBetween={20}
  slidesPerView={1}
  breakpoints={{
    640: { slidesPerView: 3 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 },
  }}
  className="px-4 pb-50" // <- add padding-bottom so dots have space below
          >
            {features.map((f, i) => (
              <SwiperSlide key={i}>
                <FeatureCard feature={f} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} feature={f} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// FeatureCard component
function FeatureCard({ feature }) {
  return (
   
      <Card className="h-full min-h-[250px] flex flex-col justify-between">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{feature.icon}</div>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          {feature.description}
        </CardContent>
      </Card>
  
  );
}
