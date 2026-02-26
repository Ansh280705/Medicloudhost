
import HomeClient from "@/components/HomeClient";

// SEO Metadata for Home Page
export const metadata = {
  title: "Medicloud - Video Consultation with Doctors, Book Doctor",
  description:
    "Medicloud helps doctors and independent professionals manage appointments, patient records, bills, and practice workflows effortlessly. Join India's top healthcare SaaS platform today.",
  alternates: {
    canonical: "https://Medicloud.co.in",
  },
};

export default function Home() {
  return <HomeClient />;
}
