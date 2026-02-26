"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Head from "next/head";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HelpCard from "./HelpCard";
import { helpArticles } from "./data";

export default function HelpCenterPage() {
  const { user } = useUser();
  const [query, setQuery] = useState("");

  // Determine role (default patient)
  const role = user?.publicMetadata?.role || "patient";

  const filteredArticles = useMemo(() => {
    return helpArticles.filter((item) => {
      const roleMatch =
        item.role === "common" || item.role === role;

      const searchMatch =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      return roleMatch && searchMatch;
    });
  }, [query, role]);

  return (
    <>
      {/* ---------------- SEO ---------------- */}
      <Head>
        <title>Help Center | DoctorDesk</title>
        <meta
          name="description"
          content="Find answers to common questions about DoctorDesk consultations, credits, payments, doctors, and security."
        />
      </Head>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-20 max-w-6xl">

          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold">Help Center</h1>
            <p className="text-muted-foreground mt-2">
              Find quick answers to common questions about DoctorDesk.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-14">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search help articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item, index) => (
              <HelpCard
                key={index}
                category={item.category}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <p className="text-muted-foreground mb-4">
              Still need help?
            </p>
            <Button asChild className="bg-client">
              <a href="/ContactUs">Contact Support</a>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
}
