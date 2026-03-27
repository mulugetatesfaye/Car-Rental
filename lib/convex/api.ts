import { getApiKey } from "@/lib/tomtom/config";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function createRide(rideData: {
  pickupAddress: string;
  destinationAddress: string;
  pickupLat: number;
  pickupLng: number;
  destLat: number;
  destLng: number;
  distance: number;
  duration: number;
  carTypeName: string;
  carTypeMultiplier: number;
  price: number;
  passengers: number;
  luggage: number;
  accessible: boolean;
  pickupDate: string;
  pickupTime?: string;
}) {
  if (!CONVEX_URL) {
    console.error("Convex URL not configured");
    throw new Error("Backend not configured");
  }

  const response = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: "rides:create",
      args: rideData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Convex error:", error);
    throw new Error(error.message || "Failed to create ride");
  }

  return response.json();
}