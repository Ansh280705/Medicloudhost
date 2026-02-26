export default function WhoWeAre() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-20">
        
        <h2 className="text-3xl font-semibold mb-6">
          Who We Are
        </h2>

        <p className="mb-6">
          DoctorDesk is a software-as-a-service (SaaS) platform that provides appointment
          booking and practice management tools for independent professionals and their clients.
        </p>

        <h3 className="text-2xl font-semibold mb-4">Our Services</h3>
        <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground text-lg">
          <li><strong>Online Appointment Scheduling:</strong> Effortlessly book and manage sessions with professionals.</li>
          <li><strong>Digital Consultations:</strong> Secure video and audio consultation tools for seamless interaction.</li>
          <li><strong>Digital Records Management:</strong> Maintain and access professional records securely online.</li>
          <li><strong>Workflow Automation:</strong> Streamlined scheduling and session management for providers.</li>
          <li><strong>Practice Management Tools:</strong> Comprehensive dashboard for professionals to manage their practice.</li>
        </ul>

        <p className="mb-6">
          The platform enables scheduling, workflow management, session coordination,
          and communication through secure software systems.
        </p>

        <p>
          DoctorDesk does not provide medical services or professional advice and does not
          employ practitioners. All services are delivered independently by professionals
          using the platform.
        </p>

      </div>
      <div className="container mx-auto px-6 lg:px-20 mt-8 pt-6 border-t border-border/20 text-xs text-muted-foreground text-center">
         <p>DoctorDesk is a technology platform and does not provide medical consultation, diagnosis, treatment, or prescriptions. All services are provided independently by professionals using the platform.</p>
      </div>
    </section>
  );
}
