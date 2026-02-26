
import HomeClient from "@/components/HomeClient";

// SEO Metadata for Home Page
export const metadata = {
  title: "DoctorDesk - Best Clinic Management & Appointment Software",
  description:
    "DoctorDesk helps doctors and independent professionals manage appointments, patient records, bills, and practice workflows effortlessly. Join India's top healthcare SaaS platform today.",
  alternates: {
    canonical: "https://doctordesk.co.in",
  },
};

export default function Home() {
  return <HomeClient />;
}
