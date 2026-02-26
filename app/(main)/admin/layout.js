// app/(main)/admin/layout.js

import { redirect } from "next/navigation";
import { verifyAdmin } from "@/actions/admin";
import DynamicBackLink from "@/components/DynamicBackLink"; 
import { AdminTabsSection } from "./components/admin-tabs-section";
import { SOSAlertPulse } from "./components/sos-pulse";

export const metadata = {
  title: "Admin Settings - Medicloud",
  description: "Manage doctors, patients, blogs, and platform settings",
};

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) redirect("/onboarding");

  return (
    <div className="container mx-auto px-4 py-5">
      <SOSAlertPulse />
      <DynamicBackLink/>
      <AdminTabsSection>{children}</AdminTabsSection>
    </div>
  );
}
