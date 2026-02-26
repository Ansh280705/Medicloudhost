import { getDoctorAppointments, getDoctorAvailability, getRecentDoctorAppointments } from "@/actions/doctor";
import AvailabilitySettings from "./_components/availability-settings";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";
import DoctorAppointmentsList from "./_components/appointments-list";
import RecentAppointmentsList from "./_components/recent-appointments-list";
import { getDoctorEarnings, getDoctorPayouts } from "@/actions/payout";
import { DoctorEarnings } from "./_components/doctor-earnings";
import { DoctorTabsSection } from "./_components/doctor-tabs-section";
import { TabAnimatedContent } from "@/components/tab-animated-content";
import { TabsContent } from "@/components/ui/tabs";


export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();

  const [appointmentsData, availabilityData, earningsData, payoutsData, recentAppointmentsData] =
    await Promise.all([
      getDoctorAppointments(),
      getDoctorAvailability(),
      getDoctorEarnings(),
      getDoctorPayouts(),
      getRecentDoctorAppointments(),
    ]);

  //   // Redirect if not a doctor
  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  // If already verified, redirect to dashboard
  if (user?.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <DoctorTabsSection>
        <TabsContent value="sessions" className="border-none p-0">
          <TabAnimatedContent>
            <DoctorAppointmentsList
              appointments={appointmentsData.appointments || []}
            />
            <RecentAppointmentsList
              appointments={recentAppointmentsData.appointments || []}
            />
          </TabAnimatedContent>
        </TabsContent>
        <TabsContent value="availability" className="border-none p-0">
          <TabAnimatedContent>
            <AvailabilitySettings slots={availabilityData.slots || []} />
          </TabAnimatedContent>
        </TabsContent>
        <TabsContent value="earnings" className="border-none p-0">
          <TabAnimatedContent>
            <DoctorEarnings
              earnings={earningsData.earnings || {}}
              payouts={payoutsData.payouts || []}
            />
          </TabAnimatedContent>
        </TabsContent>
      </DoctorTabsSection>
    </div>
  );
}