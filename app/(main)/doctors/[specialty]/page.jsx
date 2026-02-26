import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import { DoctorCard } from "@/components/doctor-card";
import { PageHeader } from "@/components/page-header";

export default async function DoctorSpecialtyPage({ params }) {
  const { specialty } = await params; 

  // Redirect if specialty is missing
  if (!specialty) {
    redirect("/doctors");
  }

  const decodedSpecialty = decodeURIComponent(specialty);

  // Fetch doctors
  const { doctors, error } = await getDoctorsBySpecialty(decodedSpecialty);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={decodedSpecialty}
        backLink="/doctors"
        backLabel="All Specialties"
      />

      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-client mb-2">
            No experts available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified professionals in this specialty.
          </p>
        </div>
      )}
    </div>
  );
}
