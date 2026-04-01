"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, MessageSquare, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GenerateInvoiceButton } from "@/components/admin/GenerateInvoiceButton";

export default function RideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rideId = params.rideId as Id<"rides">;
  
  const ride = useQuery(api.rides.getById, { id: rideId });
  const updateStatus = useMutation(api.rides.updateStatus);
  const addNote = useMutation(api.rides.addNote);
  
  const [noteText, setNoteText] = useState("");

  if (!ride) {
    return (
      <div className="p-12 text-center text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em]">
        Loading ride details...
      </div>
    );
  }

  const handleStatusChange = async (status: "pending" | "confirmed" | "cancelled") => {
    await updateStatus({ id: rideId, status });
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote({ id: rideId, note: noteText });
    setNoteText("");
  };

  return (
    <div className="p-4 sm:p-8 md:p-12 space-y-8 pb-24">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-400 hover:text-gold transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </button>

      <header className="space-y-4">
        <h1 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight">
          Ride <span className="text-gold">Details</span>
        </h1>
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
          {ride.customerName} &middot; {ride.pickupDate}
        </p>
      </header>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
          ride.status === "pending" ? "bg-amber-950 text-amber-500 border border-amber-900" 
          : ride.status === "confirmed" ? "bg-blue-950 text-blue-500 border border-blue-900"
          : "bg-red-950 text-red-500 border border-red-900"
        }`}>
          {ride.status.replace("_", " ")}
        </span>
        <GenerateInvoiceButton ride={ride} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Route */}
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Route Details
            </h2>
            <div className="space-y-4">
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">PICKUP</p>
                <p className="text-white font-bold text-sm">{ride.pickupAddress}</p>
                <p className="text-neutral-600 text-[10px] mt-1">
                  {ride.pickupLat.toFixed(4)}, {ride.pickupLng.toFixed(4)}
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-gold/30" />
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">DESTINATION</p>
                <p className="text-white font-bold text-sm">{ride.destinationAddress}</p>
                <p className="text-neutral-600 text-[10px] mt-1">
                  {ride.destLat.toFixed(4)}, {ride.destLng.toFixed(4)}
                </p>
              </div>
            </div>
          </section>

          {/* Ride Details */}
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Ride Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">DATE</p>
                <p className="text-white font-bold text-sm">{ride.pickupDate}</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">TIME</p>
                <p className="text-white font-bold text-sm">{ride.pickupTime || "TBD"}</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">DISTANCE</p>
                <p className="text-white font-bold text-sm">{ride.distance.toFixed(1)} km</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">DURATION</p>
                <p className="text-white font-bold text-sm">{ride.duration.toFixed(0)} min</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">VEHICLE</p>
                <p className="text-white font-bold text-sm">{ride.carTypeName}</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">SERVICE</p>
                <p className="text-white font-bold text-sm">{ride.serviceType === "hourly" ? "Hourly" : "Point-to-Point"}</p>
              </div>
              {ride.serviceType === "hourly" && ride.hourlyDuration && (
                <div className="bg-black p-4 border border-neutral-800">
                  <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">HOURS</p>
                  <p className="text-gold font-bold text-sm">{ride.hourlyDuration}h</p>
                </div>
              )}
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">PASSENGERS</p>
                <p className="text-white font-bold text-sm">{ride.passengers}</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">LUGGAGE</p>
                <p className="text-white font-bold text-sm">{ride.luggage}</p>
              </div>
              <div className="bg-black p-4 border border-neutral-800">
                <p className="text-neutral-500 text-[8px] font-black uppercase tracking-widest mb-1">PRICE</p>
                <p className="text-gold font-serif text-lg font-black italic">${ride.price.toFixed(2)}</p>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Internal Notes
            </h2>
            {ride.notes && (
              <div className="text-sm text-neutral-300 whitespace-pre-wrap font-medium border-l-2 border-gold/30 pl-4 py-2 mb-4">
                {ride.notes}
              </div>
            )}
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Add internal staff note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 bg-black border border-neutral-800 px-4 py-3 text-xs text-white focus:border-gold outline-none"
              />
              <Button onClick={handleAddNote} className="bg-gold hover:bg-gold-dark text-white rounded-none text-[9px] font-black uppercase px-6">
                Add
              </Button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Customer Info */}
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">Customer</h2>
            <div className="space-y-4">
              <p className="text-white font-serif text-lg font-black italic">{ride.customerName}</p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-neutral-400 text-xs">
                  <Mail className="h-3 w-3 text-neutral-600" /> {ride.customerEmail}
                </p>
                <p className="flex items-center gap-2 text-neutral-400 text-xs">
                  <Phone className="h-3 w-3 text-neutral-600" /> {ride.customerPhone}
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">Actions</h2>
            <div className="space-y-2">
              {ride.status === "pending" && (
                <>
                  <Button onClick={() => handleStatusChange("confirmed")} className="w-full bg-emerald-950/20 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900 hover:text-white rounded-none py-4 text-[9px] font-black uppercase tracking-widest">
                    Confirm Booking
                  </Button>
                  <Button onClick={() => handleStatusChange("cancelled")} className="w-full bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white rounded-none py-4 text-[9px] font-black uppercase tracking-widest">
                    Decline
                  </Button>
                </>
              )}
              {ride.status === "confirmed" && (
                <Button onClick={() => handleStatusChange("cancelled")} className="w-full bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white rounded-none py-4 text-[9px] font-black uppercase tracking-widest">
                  Cancel Booking
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
