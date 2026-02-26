import Link from "next/link";
import { ArrowLeft, Coins, Clock, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/pricing";

export const metadata = {
    title: "Credits | DoctorDesk",
    description: "Understand how DoctorDesk credits work. Simple, transparent, and flexible payment for your medical consultations.",
};

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* ================= HERO SECTION ================= */}
            <section className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-20 lg:pb-28">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                        <div className="flex justify-start w-full md:hidden mb-2">
                            <Link
                                href="/"
                                className="flex items-center text-muted-foreground hover:text-client transition-colors text-sm"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-client/10 text-client text-sm font-medium">
                            <Coins className="w-4 h-4" />
                            <span>Simple Virtual Currency</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                            Pay for what you use, <br className="hidden md:block" />
                            <span className="text-client">nothing more.</span>
                        </h1>

                        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                            DoctorDesk Credits are the simple way to pay for consultations.
                            No hidden fees, no subscriptions—just top up and book your expert instantly.
                        </p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-client/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
            </section>

            {/* ================= FEATURES GRID ================= */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-client" />}
                        title="Instant Booking"
                        description="Credits are deducted immediately upon booking. No need to enter card details for every single appointment."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6 text-client" />}
                        title="Secure & Refundable"
                        description="Your credits are safe. If an appointment is cancelled, credits are instantly refunded to your wallet."
                    />
                    <FeatureCard
                        icon={<Clock className="w-6 h-6 text-client" />}
                        title="Never Expires"
                        description="Purchased credits stay in your wallet forever. Use them whenever you need a consultation."
                    />
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
                        <p className="text-slate-600">Three simple steps to start your health journey</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0" />

                        <StepCard
                            step="01"
                            title="Buy Credits"
                            description="Choose a pack that suits your needs. Basic, Standard, or Premium."
                        />
                        <StepCard
                            step="02"
                            title="Book Doctor"
                            description="Browse specialists and select a time slot. 1 Credit = 1 Consultation usually."
                        />
                        <StepCard
                            step="03"
                            title="Get Consulted"
                            description="Join the video call or chat at the scheduled time. Simple as that."
                        />
                    </div>
                </div>
            </section>

            {/* ================= PURCHASE SECTION ================= */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Top Up Your Wallet</h2>
                    <p className="text-slate-600 mt-2">Choose a flexible plan. 100% money-back guarantee.</p>
                </div>

                {/* Reusing existing Pricing component */}
                <Pricing showHistory={false} />

                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help with payments? <Link href="/ContactUs" className="text-client hover:underline">Contact Support</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function StepCard({ step, title, description }) {
    return (
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-2xl font-bold text-client mb-6">
                {step}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 max-w-xs">{description}</p>
        </div>
    );
}
