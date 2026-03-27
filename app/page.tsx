import { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Luna Limo | Seattle's Premier Luxury Chauffeur & Black Car Service",
  description: "Bespoke executive transportation in Seattle. Reliable airport transfers, corporate travel, and special event chauffeur services with a premium fleet.",
  keywords: ["Seattle Limo", "Seattle Chauffeur", "Sea-Tac Airport Transfer", "Corporate Car Service", "Luxury Travel Seattle"],
};

export default function Page() {
  return <HomeClient />;
}
