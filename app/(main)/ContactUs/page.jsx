"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Mail, Phone, MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  /* ---------------- HOOKS (ALWAYS AT TOP) ---------------- */
  const { user, isLoaded, isSignedIn } = useUser();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  /* ---------------- AUTO-FILL FROM CLERK ---------------- */
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  /* ---------------- LOADING STATE ---------------- */
  // Render immediately (don't block while Clerk loads). If the user is signed in
  // Clerk will fill the form via the effect above.

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.message) {
      toast.error("Name, email and message are required");
      return;
    }

    // basic email check
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
        }),
      });

      if (res.ok) {
        toast.success("Message sent successfully 📩");
        setForm((prev) => ({ ...prev, message: "" }));
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold">Contact Our Team</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Have questions about online professional sessions, credits, or
            appointments? Our team is here to help you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>

              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Textarea
                rows={4}
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <Button
                className="w-full bg-client"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send message"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We usually respond within 24 hours.
              </p>
            </CardContent>
          </Card>

          {/* INFO */}
          <div className="space-y-6">
            <Card>
              <CardContent className="flex gap-4 p-6">
                <MessageSquare className="h-6 w-6 text-client" />
                <div>
                  <h3 className="font-semibold">Chat with us</h3>
                  <p className="text-sm text-muted-foreground">
                    Live chat (coming soon)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4 p-6">
                <Mail className="h-6 w-6 text-client" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-client mt-1">
                    doctordeskOfficial@gmail.com doctordesk.team@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4 p-6">
                <Phone className="h-6 w-6 text-client" />
                <div>
                  <h3 className="font-semibold">Call us</h3>
                  <p className="text-sm text-muted-foreground">
                    Mon – Fri, 9am to 6pm
                  </p>
                  {/* <p className="text-sm text-client mt-1">+91 81094-24356</p> */}
                  <p className="text-sm text-client mt-1">+91 81094-24356</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COMPANY DETAILS */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground">
                  Registered Entity
                </h4>
                <p className="text-client mt-1 font-medium">DoctorDesk</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Clinic Name
                </h4>
                <p className="text-client mt-1 font-medium">Yashoda Dental Care</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Owner Name</h4>
                <p className="text-client mt-1 font-medium">Dr. Ankit Chourasiya</p>
                {/* <p className="text-muted-foreground mt-1">Abhiraj Jaiswal</p> */}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Contact Phone Number</h4>
                <p className="text-client mt-1">+91 81094-24356</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Business Type</h4>
                <p className="text-muted-foreground mt-1">
                  Individual / Proprietorship
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Service Type</h4>
                <p className="text-client mt-1 font-medium">SaaS / IT Services</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Platform Category
                </h4>
                <p className="text-muted-foreground mt-1">
                  Appointment Booking & Practice Management Software
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Support Email</h4>
                <p className="text-client mt-1">doctordeskOfficial@gmail.com</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-foreground">
                  Registered Address
                </h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  First Floor, Plot No. 17, Above New Globas Medical, Opposite
                  Satish Kirana, Gori Nagar, New Gouri Nagar, Sukhliya, Indore,
                  Madhya Pradesh – 452010
                </p>
                {/* <p className="text-muted-foreground mt-1 text-xs">
                  513, Vynaktesh Vihar Chota Bangarda Road Indore, Madhya
                  Pradesh – 452005 India
                </p> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
