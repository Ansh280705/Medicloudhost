import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/labs",
          "/pricing",
          "/about",
          "/ContactUs",
          "/help-center",
          "/privacy-policy",
          "/terms-and-conditions",
          "/refund-policy",
          "/cancellation-policy",
          "/shipping-and-delivery",
          "/legal-information",
          "/team-devs",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/doctor",
          "/doctor/",
          "/onboarding",
          "/appointments",
          "/prescriptions",
          "/video-call",
          "/doctors/",
        ],
      },
    ],
    sitemap: "https://www.doctordesk.co.in/sitemap.xml",
  };
}