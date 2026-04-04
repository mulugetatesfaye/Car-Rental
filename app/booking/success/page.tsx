"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle, ArrowRight } from "lucide-react";
import { verifyCheckoutSession, createRide } from "@/lib/convex/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/pricing";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = React.useState<"verifying" | "success" | "error" | "already_processed">("verifying");
  const [rideId, setRideId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<number | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  React.useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No session ID provided.");
      return;
    }

    const verifyAndCreate = async () => {
      try {
        const result = await verifyCheckoutSession(sessionId);

        if (result.status === "already_processed") {
          setStatus("already_processed");
          setRideId(result.rideId);
          return;
        }

        if (result.status === "unpaid") {
          setStatus("error");
          setErrorMessage("Payment was not completed. Please try booking again.");
          return;
        }

        if (result.status === "paid") {
          const rideData = result.rideData;
          const createdRideId = await createRide({
            pickupAddress: rideData.pickupAddress,
            destinationAddress: rideData.destinationAddress,
            pickupLat: rideData.pickupLat,
            pickupLng: rideData.pickupLng,
            destLat: rideData.destLat,
            destLng: rideData.destLng,
            distance: rideData.distance,
            duration: rideData.duration,
            carTypeName: rideData.carTypeName,
            carTypeMultiplier: rideData.carTypeMultiplier,
            price: rideData.price,
            passengers: rideData.passengers,
            luggage: rideData.luggage,
            accessible: rideData.accessible,
            serviceType: rideData.serviceType,
            hourlyDuration: rideData.hourlyDuration,
            pickupDate: rideData.pickupDate,
            pickupTime: rideData.pickupTime,
            customerName: rideData.customerName,
            customerEmail: rideData.customerEmail || "paid@stripe.com",
            customerPhone: rideData.customerPhone,
            stripeCheckoutSessionId: sessionId,
          });

          setRideId(createdRideId);
          setAmount(result.amount);
          setStatus("success");
        }
      } catch (error) {
        console.error("Error verifying checkout session:", error);
        setStatus("error");
        setErrorMessage("Failed to process your booking. Please contact support if your payment was successful.");
      }
    };

    verifyAndCreate();
  }, [sessionId]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto" />
          <h2 className="font-serif text-3xl font-black italic uppercase">
            Processing <span className="text-gold">Payment</span>
          </h2>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
            Please wait while we confirm your booking...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8 px-4">
          <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center mx-auto border border-red-800">
            <XCircle className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="font-serif text-3xl font-black italic uppercase">
            Payment <span className="text-red-400">Failed</span>
          </h2>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
            {errorMessage}
          </p>
          <Button
            onClick={() => router.push("/booking")}
            className="bg-gold hover:bg-gold-dark text-white rounded-none px-12 py-8 text-xs font-sans font-black uppercase tracking-[0.2em] shadow-lg"
          >
            Return to Booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (status === "already_processed") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8 px-4">
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto border border-gold/20">
            <CheckCircle className="h-12 w-12 text-gold" />
          </div>
          <h2 className="font-serif text-3xl font-black italic uppercase">
            Booking <span className="text-gold">Confirmed</span>
          </h2>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
            Your booking has already been processed. Our concierge will contact you shortly.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gold hover:bg-gold-dark text-white rounded-none px-12 py-8 text-xs font-sans font-black uppercase tracking-[0.2em] shadow-lg"
          >
            Return Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <main className="max-w-4xl mx-auto py-20 px-4 sm:px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8 border border-gold/20">
          <CheckCircle className="h-12 w-12 text-gold" />
        </div>
        <h2 className="font-serif text-4xl md:text-6xl font-black italic uppercase mb-4 text-white">
          Booking <span className="text-gold">Confirmed</span>
        </h2>
        <p className="text-neutral-400 mb-12 font-bold uppercase tracking-widest text-xs">
          Payment successful. Your luxury ride has been reserved. Our concierge will contact you shortly.
        </p>

        <Card className="max-w-md mx-auto p-8 mb-12 border-neutral-800 shadow-2xl bg-neutral-900 text-left rounded-none">
          <h3 className="font-serif font-black italic uppercase text-xl mb-6 pb-2 border-b border-neutral-800 text-gold">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Status</span>
              <span className="text-sm font-bold text-gold">PAID</span>
            </div>
            {rideId && (
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Booking ID</span>
                <span className="text-sm font-bold text-gold">{rideId}</span>
              </div>
            )}
            {amount && (
              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-500 font-black uppercase text-[11px] tracking-widest">Total Paid</span>
                <span className="text-2xl font-serif font-black italic text-gold">
                  {formatPrice(amount)}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Button
          onClick={() => router.push("/")}
          className="bg-gold hover:bg-gold-dark text-white rounded-none px-12 py-8 text-xs font-sans font-black uppercase tracking-[0.2em] shadow-lg"
        >
          Return Home
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </main>
    </div>
  );
}
