import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/lib/convex/provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${montserrat.variable} h-full antialiased dark`}>
      <body className="h-full min-h-screen bg-background text-foreground font-sans">
        <ConvexProvider>
          <Header />
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}