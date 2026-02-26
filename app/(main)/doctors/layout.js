import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: "Find Doctors - DoctorDesk",
  description: "Browse and book sessions with top professionals",
};

export default async function DoctorsLayout({ children }) {
  return (
    <PageLoader><div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div></PageLoader>
    
  );
}