import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/lib/convex/provider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], variable: "--font-serif", weight: "400" });

export const metadata: Metadata = {
  title: "Luna Limo | Luxury Chauffeurs",
  description: "Experience luxury travel in Seattle with Luna Limo. Professional chauffeurs, real-time routing, and exceptional service.",
};

import { Header } from "@/components/global/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased dark`}>
      <body className="h-full min-h-screen bg-background text-foreground font-sans">
        <ConvexProvider>
          <Header />
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}