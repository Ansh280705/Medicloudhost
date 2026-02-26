"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";

export default function HeroCarousel() {
  return (
    <section className="w-full py-12 relative">

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-client">
          Explore Our Medical Specialities
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Find the right doctor for your health needs
        </p>
      </div>

      {/* Carousel */}
    <Swiper
  modules={[Autoplay, Pagination]}
  loop
  speed={3000}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
  }}
  spaceBetween={16}
  slidesPerView={2}
  breakpoints={{
    640: { slidesPerView: 3 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 },
  }}
  className="px-4"
>
  {SPECIALTIES.map((item) => (
    <SwiperSlide key={item.name}>
      <Link href={`/doctors/${encodeURIComponent(item.name)}`}>
        <div className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 cursor-pointer transition-all">

          {/* Background Image */}
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
            <div className="text-white text-2xl mb-2">
              {item.icon}
            </div>
            <p className="text-white text-xl  font-semibold leading-tight">
              {item.name}
            </p>
          </div>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>
    </section>
  );
}
