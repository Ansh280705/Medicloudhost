"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { creditBenefits, features } from "@/lib/data";

import TypingText from "@/components/ui/typingtext";
import Pricing from "./pricing";

import { ArrowRight, BadgeCheck, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useReveal from "@/components/ui/useReveal";
import HeroCarousel from "@/components/HeroCarousel";
import { NewsCarousel } from "@/components/news-carousel";

import Feature from "@/components/Feature";
import Counter from "@/components/Counter";
import TestimonialMarquee from "@/components/TestimonialMarquee";

export default function HomeClient() {
    useReveal();

    return (
        <div className="bg-background overflow-x-hidden ">
            {/* ================= HERO ================= */}
            <section className="relative min-h-[100svh] pt-15  md:pt-25 ">
                <div
                    className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20
          flex flex-col-reverse md:flex-row
          items-center justify-between
           md:gap-16"
                >
                    {/* TEXT */}
                    <div className="flex-1 flex flex-col reveal text-center md:text-left">
                        <Badge
                            variant="outline"
                            className="bg-client border-2 border-[#4b736f] 
              px-4 py-1 text-sm sm:text-base text-white mb-1 w-max mx-auto md:mx-0"
                        >
                            HealthCare Made Simple
                        </Badge>

                        <h1
                            className="text-xl sm:text-4xl md:text-4xl lg:text-5xl
               leading-tight font-bold"
                        >
                            Consult India's Top Doctors
                            Online

                        </h1>

                        <div className="mt-3 min-h-[40px]">
                            <TypingText />
                        </div>

                        {/* DoctorDesk is a SaaS-based scheduling and workflow management platform that helps
              independent professionals manage appointments, sessions, and daily operations
              through a secure software system. */}
                        DoctorDesk is a secure scheduling and workflow platform for independent professionals.

                        <div
                            className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-5
              justify-center md:justify-start"
                        >
                            <Button asChild size="lg" className="bg-client btn-shine font-bold">
                                <Link href="/onboarding">
                                    Book Appointment <ArrowRight className="h-5 w-5 ml-1" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-[#f8f8ff] border-1 border-client font-bold"
                            >
                                <Link href="/doctors">Schedule Session</Link>
                            </Button>
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div
                        className="flex-1 w-full max-w-xs sm:max-w-xl md:max-w-xl
          aspect-square relative reveal"
                    >
                        <Image
                            src="/heroimg.png"
                            alt="Session Scheduling"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* STATS */}
                <div className="py-10 sm:py-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto text-center px-4">
                        {[
                            ["10 min", "Avg Response"],
                            ["10000+", "Users"],
                            ["365", "Days Active"],
                            ["24×7", "Support"],
                        ].map(([value, label]) => (
                            <div
                                key={label}
                                className="relative overflow-hidden rounded-xl border border-client/30 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
                            >
                                {/* Decorative circle / accent */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-client/20 rounded-full blur-xl"></div>

                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-client z-10">
                                    {label === "Satisfaction" || label === "Days Active" ? (
                                        <Counter value={value} />
                                    ) : (
                                        value
                                    )}
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground mt-2 z-10 font-bold">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 mt-10">
                <NewsCarousel />
            </section>

            <Feature features={features} />

            <HeroCarousel />

            {/* ================= PRICING ================= */}
            <section id="pricing" className="py-14">
                <div className="container mx-auto px-6 lg:px-20 max-w-6xl">
                    <div className="text-center mb-10">
                        <Badge className="bg-[#6ba49f] text-white mb-3">
                            Affordable Management
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            Subscription Packages
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Choose a plan that fits your needs
                        </p>
                    </div>

                    <Pricing showHistory={false} />

                    <Card className="mt-10 border-[#6ba49f]/40 hover:border-[#6ba49f]/80 transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                                <span className="flex items-center justify-center rounded-full bg-client/10 p-1.5 sm:p-2">
                                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-[#6ba49f]" />
                                </span>

                                <span>How Our Booking System Works</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 sm:space-y-4">
                                {creditBenefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3 sm:gap-4">
                                        <span className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 rounded-full ">
                                            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-client" />
                                        </span>

                                        <p
                                            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: benefit }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <TestimonialMarquee />
        </div>
    );
}
