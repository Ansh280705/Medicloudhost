import React from "react";

export const metadata = {
  title: "Terms & Conditions - DoctorDesk",
  description: "Terms and conditions for using the DoctorDesk SaaS platform.",
};

const TermsPage = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          DoctorDesk is a SaaS-based technology platform that provides appointment booking
          and practice management software tools.
        </p>

        <p>
          DoctorDesk does not provide medical consultation, diagnosis, treatment, or
          prescriptions. The platform only facilitates scheduling, communication, and
          workflow management between users and independent professionals.
        </p>

        <p>
          All payments made on the platform are for software usage and platform access.
          DoctorDesk is not responsible for the outcome, quality, or nature of sessions
          conducted by independent professionals.
        </p>

        <section className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg mt-8">
          <h3 className="font-semibold text-foreground mb-3">Prohibited Use</h3>
          <p className="text-sm mb-3">
            Users and professionals agree not to use the platform for any of the following prohibited activities:
          </p>
          <ul className="grid md:grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc pl-5">
            <li>Adult goods and services or sexually explicit material</li>
            <li>Sale of alcohol, tobacco, or drugs</li>
            <li>Weapons, ammunition, or hazardous materials</li>
            <li>Financial schemes (Ponzi, Pyramid, Cryptocurrency trading)</li>
            <li>Fake IDs, government documents, or impersonation</li>
            <li>Illegal hacking/cracking materials</li>
            <li>Gambling or miracle cures</li>
            <li>Any activity violating Indian or international laws</li>
          </ul>
        </section>

        <div className="bg-muted/40 p-6 rounded-lg border border-border/50 mt-8">
          <h3 className="font-semibold text-foreground mb-2">Disclaimer</h3>
          <p className="text-sm">
            DoctorDesk is a technology platform and does not provide medical consultation,
            diagnosis, treatment, or prescriptions. All services are provided independently
            by professionals using the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
