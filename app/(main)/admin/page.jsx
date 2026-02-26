import {
  getPendingDoctors,
  getVerifiedDoctors,
  getPendingPayouts,
  getAllBlogs,
  getAllSOSAlerts,
} from "@/actions/admin";
import { getPaymentRequests } from "@/actions/payment";
import { TabsContent } from "@radix-ui/react-tabs";
import { PendingDoctors } from "./components/pending-doctors";
import { VerifiedDoctors } from "./components/verified-doctors";
import { PendingPayouts } from "./components/pending-payouts";
import { AdminBlogs } from "./components/admin-blogs";
import { LabsManager } from "./components/labs-manager";
import { PaymentRequests } from "./components/payment-requests";
import { getLabs } from "@/actions/labs";
import { getNews } from "@/actions/news";
import { SOSAlertsPanel } from "./components/sos-alerts-panel";
import { ClinicsManager } from "./components/clinics-manager";
import { getAllClinics } from "@/actions/clinics";
import { TabAnimatedContent } from "./components/tab-animated-content";
import { NewsManager } from "./components/news-manager";

export default async function AdminPage() {
  const [pendingDoctorsData, verifiedDoctorsData, pendingPayoutsData, blogsData, labsData, paymentData, newsData, sosData, clinicsData] =
    await Promise.all([
      getPendingDoctors(),
      getVerifiedDoctors(),
      getPendingPayouts(),
      getAllBlogs(),
      getLabs(),
      getPaymentRequests(),
      getNews(),
      getAllSOSAlerts(),
      getAllClinics(),
    ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0">
        <TabAnimatedContent>
          <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="doctors" className="border-none p-0">
        <TabAnimatedContent>
          <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="payouts" className="border-none p-0">
        <TabAnimatedContent>
          <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="payment-requests" className="border-none p-0">
        <TabAnimatedContent>
          <PaymentRequests 
            requests={paymentData.requests || []} 
            history={paymentData.history || []}
          />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="blogs" className="border-none p-0">
        <TabAnimatedContent>
          <AdminBlogs blogs={blogsData.blogs || []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="news" className="border-none p-0">
        <TabAnimatedContent>
          <NewsManager news={newsData.data || []} />
        </TabAnimatedContent>
      </TabsContent>

       <TabsContent value="labs" className="border-none p-0">
        <TabAnimatedContent>
          <LabsManager labs={labsData|| []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="sos" className="border-none p-0">
        <TabAnimatedContent>
          <SOSAlertsPanel alerts={sosData.alerts || []} />
        </TabAnimatedContent>
      </TabsContent>

      <TabsContent value="clinics" className="border-none p-0">
        <TabAnimatedContent>
          <ClinicsManager clinics={clinicsData.clinics || []} />
        </TabAnimatedContent>
      </TabsContent>
    </>
  );
}
