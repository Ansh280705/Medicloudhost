import React from "react";

export const metadata = {
  title: "Shipping & Delivery Policy - DoctorDesk",
  description: "Shipping and delivery policy for DoctorDesk SaaS platform services.",
};

const ShippingDeliveryPage = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Shipping & Delivery Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          DoctorDesk is a SaaS-based technology platform. All services provided on our platform, 
          including software usage, appointment scheduling tools, and platform access, are 
          delivered digitally.
        </p>

        <p>
          <strong>Delivery Timeline:</strong> Upon successful payment or subscription, access 
          to the relevant digital tools or credits is granted immediately or within a few 
          minutes. Users will receive a confirmation email or notification on the platform 
          once the transaction is processed.
        </p>

        <p>
          <strong>No Physical Shipping:</strong> Since our services are purely digital, there 
          is no physical shipping or handling involved. No physical products will be 
          delivered to your residence or business address.
        </p>

        <p>
          <strong>Service Access:</strong> Your access to the platform tools is managed through 
          your secure dashboard. If you encounter any delays or technical issues in accessing 
          your services, please contact our support team at <strong>doctordeskOfficial@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
};

export default ShippingDeliveryPage;
