"use client";

import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ShieldCheck } from "lucide-react";

export default function DynamicBackLink() {
  const pathname = usePathname() || "";

  // Determine dynamic link and label
  let backLink = "/";
  let backLabel = "Back TO Home";

  if (pathname.startsWith("/admin/blogs/new")) {
    backLink = "/admin";
    backLabel = "Back To Admin";
  } else if (pathname.startsWith("/admin")) {
    backLink = "/";
    backLabel = "Back To Home";
  }

  return (
    <PageHeader
      icon={<ShieldCheck />}
      title="Admin Settings"
      backLink={backLink}   // <-- correct prop
      backLabel={backLabel} // <-- correct prop
    />
  );
}
