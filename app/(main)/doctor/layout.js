import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: "Doctor Dashboard - DoctorDesk",
  description: "Manage your appointments and availability",
};

export default async function DoctorDashboardLayout({ children }) {
  return (
    <PageLoader>
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Stethoscope />} title="Professional Dashboard" />

      {children}
    </div>
    </PageLoader>
  );
}