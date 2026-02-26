import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { CreditsProvider } from "@/context/CreditsContext";
import Script from "next/script";
import { checkUser } from "@/lib/checkUser";
import PageLoader from "@/components/PageLoader";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsAppButton";
import PaymentToast from "@/components/payment-toast";

/* =========================
   FONT SETUP
   ========================= */
const inter = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

/* =========================
   SEO / METADATA (NEXT.JS)
   ========================= */
export const metadata = {
  title: {
    default: "DoctorDesk",
    template: "%s | DoctorDesk",
  },

  description:
    "DoctorDesk is a smart clinic and patient management platform for modern healthcare professionals, enabling online doctor appointments, digital patient records, scheduling, billing, and seamless clinic workflows in one secure system.",

  keywords: [
      // Brand
  "DoctorDesk",
  "Doctor Desk",

  // Core product
  "doctor appointment app",
  "online doctor appointment",
  "clinic management software",
  "patient management system",
  "doctor scheduling software",
  "healthcare workflow platform",

  // Comparison / intent-based (Practo / Apollo type)
  "online doctor consultation app",
  "doctor booking app like practo",
  "apollo 24/7 doctor appointment app",
  "practo online doctor appointment",
  "best doctor appointment app in india",

  // Feature based
  "appointment booking for doctors",
  "clinic appointment management",
  "medical practice management software",
  "healthcare saas platform",
  "digital clinic software",

  // Geo / market
  "doctor appointment app india",
  "online clinic management india",
  ],

  metadataBase: new URL("https://doctordesk.co.in"),

  manifest: "/manifest.json",

  /* --------- FAVICON --------- */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  /* --------- OPEN GRAPH --------- */
  openGraph: {
    title: "DoctorDesk",
    description:
      "Smart clinic & patient management platform for modern healthcare professionals.",
    url: "https://doctordesk.co.in",
    siteName: "DoctorDesk",
    images: [
      {
        url: "https://doctordesk.co.in/logo.png",
        width: 1200,
        height: 630,
        alt: "DoctorDesk Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  /* --------- TWITTER --------- */
  twitter: {
    card: "summary_large_image",
    title: "DoctorDesk",
    description:
      "Secure scheduling and workflow platform for doctors & clinics.",
    images: ["https://doctordesk.co.in/logo.png"],
  },

  /* --------- ROBOTS --------- */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* =========================
   VIEWPORT
   ========================= */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6ba49f" },
    { media: "(prefers-color-scheme: dark)", color: "#6ba49f" },
  ],
};

/* =========================
   ROOT LAYOUT
   ========================= */
export default async function RootLayout({ children }) {
  const user = await checkUser(); // Server-side user check

  return (
    <ClerkProvider
      appearance={{
        theme: "simple",
        layout: {
          showLogo: false,
          logoText: "Medi-App",
          socialButtonsVariant: "none",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>

          {/* =========================
             GOOGLE ANALYTICS
             ========================= */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-GXCHKJRJ01"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GXCHKJRJ01');
            `}
          </Script>

          {/* =========================
             🔥 GOOGLE LOGO FIX (IMPORTANT)
             This makes logo appear in Google search
             ========================= */}
          <Script
            id="organization-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DoctorDesk",
              url: "https://doctordesk.co.in",
              logo: "https://doctordesk.co.in/logo.png",
            })}
          </Script>

          {/* =========================
             WEBSITE SCHEMA (OPTIONAL)
             ========================= */}
          <Script
            id="website-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DoctorDesk",
              url: "https://doctordesk.co.in",
            })}
          </Script>

          {/* =========================
             APP PROVIDERS
             ========================= */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <CreditsProvider initialCredits={user?.credits || 0}>
              <PageLoader user={user}>
                <Header user={user} />

                <Toaster richColors position="top-center" />

                <main className="min-h-screen">
                  {children}
                </main>

                <Footer />
                <WhatsAppButton />
                <PaymentToast />
              </PageLoader>
            </CreditsProvider>
          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
