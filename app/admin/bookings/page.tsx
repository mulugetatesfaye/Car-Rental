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
              <div key={ride._id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-800/20 transition-colors">
                
                {/* Info */}
                <div className="space-y-4 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                     <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${
                       ride.status === "pending" ? "bg-amber-950 text-amber-500" 
                       : ride.status === "confirmed" ? "bg-blue-950 text-blue-500" 
                       : ride.status === "in_progress" ? "bg-indigo-950 text-indigo-500"
                       : ride.status === "completed" ? "bg-emerald-950 text-emerald-500"
                       : "bg-red-950 text-red-500"
                     }`}>
                       {ride.status.replace("_", " ")}
                     </span>
                     <p className="text-white font-bold text-xs md:text-sm whitespace-nowrap">{ride.pickupDate} at {ride.pickupTime || "TBD"}</p>
                     <div className="hidden md:block h-4 w-px bg-neutral-800" />
                     <p className="text-gold font-serif text-sm font-black italic uppercase tracking-tighter truncate">{ride.customerName}</p>
                     <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest ml-auto md:ml-0">{ride.carTypeName}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-neutral-400">
                     <p className="flex items-center gap-1.5 border-r border-neutral-800 pr-4">
                       <span className="text-neutral-600 uppercase tracking-widest text-[8px]">EMAIL</span>
                       <span className="text-white truncate max-w-[150px] md:max-w-none">{ride.customerEmail}</span>
                     </p>
                     <p className="flex items-center gap-1.5 p-1 bg-neutral-900/50 border border-neutral-800/50">
                       <span className="text-neutral-600 uppercase tracking-widest text-[8px]">PHONE</span>
                       <span className="text-white">{ride.customerPhone}</span>
                     </p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-neutral-400 text-[11px] md:text-xs font-bold">
                       <MapPin className="h-3 w-3 text-gold mt-0.5 shrink-0" />
                       <span className="truncate">{ride.pickupAddress}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-400 text-[11px] md:text-xs font-bold pl-1 pt-1 border-l border-neutral-800 ml-1">
                       <span className="h-1 w-1 bg-neutral-600 rounded-full mt-1.5 shrink-0 ml-[2px]" />
                       <span className="truncate">{ride.destinationAddress}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                     <p className="text-gold font-serif text-xl font-black italic">${ride.price.toFixed(2)}</p>
                     <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest bg-neutral-900 px-2 py-1">
                       {ride.passengers} Pax • {ride.luggage} Lgg • {ride.distance.toFixed(1)} km
                     </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap md:flex-col gap-2 md:items-end border-t border-neutral-800 pt-4 md:border-none md:pt-0">
                   {ride.status === "pending" && (
                      <>
                        <Button 
                          onClick={() => handleStatusChange(ride._id, "confirmed")}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 md:flex-none bg-emerald-950/20 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest h-10 md:h-8"
                        >
                          Confirm
                        </Button>
                        <Button 
                          onClick={() => handleStatusChange(ride._id, "cancelled")}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 md:flex-none bg-red-950/20 text-red-500 border-red-900/50 hover:bg-red-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest h-10 md:h-8"
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
                        className="w-full md:w-auto bg-indigo-950/20 text-indigo-500 border-indigo-900/50 hover:bg-indigo-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest h-10 md:h-8"
                      >
                        Start Ride
                      </Button>
                   )}
                   {ride.status === "in_progress" && (
                      <Button 
                        onClick={() => handleStatusChange(ride._id, "completed")}
                        variant="outline" 
                        size="sm" 
                        className="w-full md:w-auto bg-emerald-950/20 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900 hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest h-10 md:h-8"
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
