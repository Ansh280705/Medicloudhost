import React from "react";

export const metadata = {
  title: "Cancellation Policy - DoctorDesk",
  description: "Cancellation policy for services booked on DoctorDesk.",
};

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return d;
  }
};

const CancellationPolicyPage = () => {
  const lastUpdated = formatDate(new Date());

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Cancellation Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              How cancellations and refunds are handled for services booked on
              DoctorDesk.
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <div className="mb-1">Last updated</div>
            <div className="font-semibold">{lastUpdated}</div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        <nav className="hidden md:block md:col-span-1 sticky top-32">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#customer" className="hover:text-client">
                1. Cancellation by Customer
              </a>
            </li>
            <li>
              <a href="#late" className="hover:text-client">
                2. Late Cancellation / No-Show
              </a>
            </li>
            <li>
              <a href="#platform" className="hover:text-client">
                3. Cancellation by DoctorDesk
              </a>
            </li>
            <li>
              <a href="#refund" className="hover:text-client">
                4. Refund for Cancelled Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-client">
                5. Contact Us
              </a>
            </li>
          </ul>
        </nav>

        <main className="md:col-span-3 space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              <strong>DoctorDesk</strong> believes in helping customers as far
              as possible. This page explains how cancellations are handled for
              services booked on our platform.
            </p>
          </div>

          <section
            id="customer"
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              1. Cancellation by Customer
            </h2>
            <p>
              Appointments or services can be cancelled up to{" "}
              <strong>24 hours</strong> before the scheduled time.
            </p>
            <p className="mt-3">Cancellation requests must be made through:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Email: <strong>doctordeskOfficial@gmail.com</strong>
              </li>
              <li>The platform where the service was booked.</li>
            </ul>
          </section>

          <section
            id="late"
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              2. Late Cancellation / No-Show
            </h2>
            <p>
              If a cancellation is made less than 24 hours before the scheduled
              service, no cancellation request will be accepted.
            </p>
            <p className="mt-2">
              In case of a no-show, the booking amount will not be refunded.
            </p>
          </section>

          <section
            id="platform"
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              3. Cancellation by DoctorDesk
            </h2>
            <p>
              DoctorDesk reserves the right to cancel any booking due to
              unavoidable circumstances such as technical issues or
              unavailability.
            </p>
            <p className="mt-2">
              In such cases, customers will be fully refunded or offered a
              reschedule.
            </p>
          </section>

          <section
            id="refund"
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              4. Refund for Cancelled Services
            </h2>
            <p>
              Approved cancellations will be refunded within{" "}
              <strong>5–7 working days</strong>.
            </p>
            <p className="mt-2">
              Refunds will be processed through the original payment method used
              at the time of booking.
            </p>
          </section>

          <section
            id="contact"
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
            <p>For cancellation-related queries, please contact us at:</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Email: <strong>doctordeskOfficial@gmail.com</strong>
              </li>
              <li>
                Phone: <strong>+91 81094-24356</strong>
              </li>
            </ul>

            <div className="mt-4">
              <a
                href="/ContactUs"
                className="inline-block rounded-full bg-client px-4 py-2 text-white font-medium"
              >
                Contact Support
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;
