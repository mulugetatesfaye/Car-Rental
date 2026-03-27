"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBookingsPage() {
  const rides = useQuery(api.rides.list);
  const updateStatus = useMutation(api.rides.updateStatus);

  if (rides === undefined) {
    return <div className="p-12 text-center text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">Loading reservations...</div>;
  }

  const handleStatusChange = async (id: Id<"rides">, status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled") => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12">
      <header className="space-y-4">
        <h1 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight">
          Reservation <span className="text-gold">Management</span>
        </h1>
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Review and process all upcoming journeys
        </p>
      </header>

      <section className="bg-neutral-900 border border-neutral-800">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <CalendarDays className="h-4 w-4" /> 
               All Reservations
            </h2>
        </div>

        <div className="divide-y divide-neutral-800">
          {rides.length === 0 ? (
             <div className="p-12 text-center text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em]">
               No reservations found
             </div>
          ) : (
            rides.map((ride) => (
              <div key={ride._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-800/20 transition-colors">
                
                {/* Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-4">
                     <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${
                       ride.status === "pending" ? "bg-amber-950 text-amber-500" 
                       : ride.status === "confirmed" ? "bg-blue-950 text-blue-500" 
                       : ride.status === "in_progress" ? "bg-indigo-950 text-indigo-500"
                       : ride.status === "completed" ? "bg-emerald-950 text-emerald-500"
                       : "bg-red-950 text-red-500"
                     }`}>
                       {ride.status.replace("_", " ")}
                     </span>
                     <p className="text-white font-bold text-sm">{ride.pickupDate} at {ride.pickupTime || "TBD"}</p>
                     <div className="h-4 w-px bg-neutral-800" />
                     <p className="text-gold font-serif text-sm font-black italic uppercase tracking-tighter">{ride.customerName}</p>
                     <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{ride.carTypeName}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] font-bold text-neutral-400">
                     <p className="flex items-center gap-1.5 border-r border-neutral-800 pr-4">
                       <span className="text-neutral-600 uppercase tracking-widest text-[8px]">EMAIL</span>
                       <span className="text-white">{ride.customerEmail}</span>
                     </p>
                     <p className="flex items-center gap-1.5 p-1 bg-neutral-900/50 border border-neutral-800/50">
                       <span className="text-neutral-600 uppercase tracking-widest text-[8px]">PHONE</span>
                       <span className="text-white">{ride.customerPhone}</span>
                     </p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold">
                       <MapPin className="h-3 w-3 text-gold" />
                       <span className="truncate max-w-sm">{ride.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold pl-1 pt-1 border-l border-neutral-800 ml-1">
                       <span className="h-1 w-1 bg-neutral-600 rounded-full inline-block ml-[2px]" />
                       <span className="truncate max-w-sm">{ride.destinationAddress}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                     <p className="text-gold font-serif text-lg font-black italic">${ride.price.toFixed(2)}</p>
                     <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                       {ride.passengers} Pax • {ride.luggage} Lgg • {ride.distance.toFixed(1)} km
                     </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                   {ride.status === "pending" && (
                      <>
                        <Button 
                          onClick={() => handleStatusChange(ride._id, "confirmed")}
                          variant="outline" 
                          size="sm" 
                          className="bg-emerald-950/20 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest"
                        >
                          Confirm
                        </Button>
                        <Button 
                          onClick={() => handleStatusChange(ride._id, "cancelled")}
                          variant="outline" 
                          size="sm" 
                          className="bg-red-950/20 text-red-500 border-red-900/50 hover:bg-red-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest"
                        >
                          Decline
                        </Button>
                      </>
                   )}
                   {ride.status === "confirmed" && (
                      <Button 
                        onClick={() => handleStatusChange(ride._id, "in_progress")}
                        variant="outline" 
                        size="sm" 
                        className="bg-indigo-950/20 text-indigo-500 border-indigo-900/50 hover:bg-indigo-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest"
                      >
                        Start Ride
                      </Button>
                   )}
                   {ride.status === "in_progress" && (
                      <Button 
                        onClick={() => handleStatusChange(ride._id, "completed")}
                        variant="outline" 
                        size="sm" 
                        className="bg-emerald-950/20 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest"
                      >
                        Complete
                      </Button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
