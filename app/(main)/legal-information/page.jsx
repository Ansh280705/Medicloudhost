import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building } from "lucide-react";

export default function LegalInformationPage() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold">Legal Information</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Official company details and registration information for
            DoctorDesk.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-client" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Legal Business Name
                  </h4>
                  <p className="text-muted-foreground mt-1">DoctorDesk</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Clinic Name
                  </h4>
                  <p className="text-muted-foreground mt-1">Yashoda Dental Care</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Owner Name
                  </h4>
                  <p className="text-muted-foreground mt-1">Dr. Ankit Chourasiya</p>
                  {/* <p className="text-muted-foreground mt-1">Abhiraj Jaiswal</p> */}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Business Type
                  </h4>
                  <p className="text-muted-foreground mt-1">
                    Individual / Proprietorship
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Service Type
                  </h4>
                  <p className="text-muted-foreground mt-1">
                    SaaS / IT Services
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-client" />
                  Registered Address
                </h4>
                <p className="text-muted-foreground">
                  First Floor, Plot No. 17,<br />
                  Above New Globas Medical,<br />
                  Opposite Satish Kirana,<br />
                  Gori Nagar, New Gouri Nagar,<br />
                  Sukhliya, Indore,<br />
                  Madhya Pradesh – 452010
                </p>
                {/* <p className="text-muted-foreground">
                  513, Vynaktesh Vihar Chota Bangarda Road Indore, Madhya
                  Pradesh – 452005 India
                </p> */}
              </div>

              <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-client" />
                    Contact Email
                  </h4>
                  <p className="text-client">doctordeskOfficial@gmail.com</p>
                  {/* <p className="text-client">Abhirajjaiswal500@gmail.com</p> */}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5 text-client" />
                    Contact Phone Number
                  </h4>
                  {/* <p className="text-client">+91 79871-09645</p> */}
                  <p className="text-client">+91 81094-24356</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            <p>
              DoctorDesk is a technology platform and does not provide medical
              consultation, diagnosis, treatment, or prescriptions. All services
              are provided independently by professionals using the platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
