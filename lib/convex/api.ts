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
  serviceType: "point_to_point" | "hourly";
  hourlyDuration?: number;
  pickupDate: string;
  pickupTime?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  stripeCheckoutSessionId?: string;
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

export async function createCheckoutSession(data: {
  carTypeName: string;
  distance: number;
  duration: number;
  serviceType: "point_to_point" | "hourly";
  hourlyDuration?: number;
  carTypeMultiplier: number;
  price: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLat: number;
  pickupLng: number;
  destLat: number;
  destLng: number;
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

  const response = await fetch(`${CONVEX_URL}/api/run/payments_actions:createCheckoutSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ args: data }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Checkout session error:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }

  return response.json() as Promise<{ url: string | null }>;
}

export async function verifyCheckoutSession(sessionId: string) {
  if (!CONVEX_URL) {
    console.error("Convex URL not configured");
    throw new Error("Backend not configured");
  }

  const response = await fetch(`${CONVEX_URL}/api/run/payments_actions:verifyCheckoutSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ args: { sessionId } }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Verification error:", error);
    throw new Error(error.message || "Failed to verify checkout session");
  }

  return response.json();
}