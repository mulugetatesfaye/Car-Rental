import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/lib/convex/provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"], display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], variable: "--font-serif", weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Luna Limo | Luxury Chauffeur & Executive Car Service Seattle",
    template: "%s | Luna Limo"
  },
  description: "Experience the pinnacle of luxury travel with Luna Limo. Seattle's premier chauffeur service for executive airport transfers, corporate events, and bespoke private journeys. 24/7 reliability and professional service.",
  keywords: ["Seattle Limo", "Chauffeur Service Seattle", "Airport Transfer Seattle", "Luxury Car Service", "Executive Transportation", "Black Car Service", "Sea-Tac Limo"],
  authors: [{ name: "Luna Limo" }],
  creator: "Luna Limo",
  publisher: "Luna Limo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Luna Limo | Elite Chauffeur & Executive Car Service",
    description: "Seattle's premier luxury transportation provider. Professional chauffeurs and a high-end fleet for every journey.",
    url: "https://lunalimoz.com",
    siteName: "Luna Limo",
    locale: "en_US",
    type: "website",
    images: ["/luna-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Limo | Luxury Chauffeur Service",
    description: "Experience luxury travel in Seattle with Luna Limo. Professional, reliable, and elegant.",
    images: ["/luna-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Luna Limo",
  "image": "https://lunalimoz.com/luna-logo.png",
  "@id": "https://lunalimoz.com",
  "url": "https://lunalimoz.com",
  "telephone": "+12063274411",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1100 2nd Avenue, Suite 400",
    "addressLocality": "Seattle",
    "addressRegion": "WA",
    "postalCode": "98101",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.6062,
    "longitude": -122.3321
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://facebook.com/lunalimo",
    "https://instagram.com/lunalimo"
  ]
};

import { Header } from "@/components/global/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased dark`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="h-full min-h-screen bg-background text-foreground font-sans">
          <ConvexProvider>
            <Header />
            {children}
          </ConvexProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}