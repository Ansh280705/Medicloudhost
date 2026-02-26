import React from "react";

export const metadata = {
  title: "Refund Policy - DoctorDesk",
  description: "Refund policy for platform usage on DoctorDesk.",
};

const RefundPage = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          At DoctorDesk, we strive to provide a seamless experience for our users. Since our
          services are digital SaaS tools, refunds and cancellations are governed by the
          following policy:
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Refund Timeline</h2>
          <p>
            If we approve your refund, we will process and credit it to your bank account
            within <strong>3-5 days</strong>. Approved refunds will be credited back to the
            original payment method used during the transaction.
          </p>
        </section>



        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Consultation Sessions</h2>
          <p>
            DoctorDesk is a technology platform and does not offer refunds for sessions
            scheduled or conducted with independent professionals. Any disputes regarding
            the quality of the session must be resolved directly with the professional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Technical Issues</h2>
          <p>
            If a user experiences a technical issue related to platform access (e.g., system
            downtime or payment failure where credits were not assigned), they may contact
            support at <strong>doctordeskOfficial@gmail.com</strong> within 48 hours for
            review and resolution.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPage;
