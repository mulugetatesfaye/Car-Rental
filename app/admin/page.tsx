"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, Car, CalendarDays, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  // We'll fetch recent rides and car types as dashboard metrics
  const recentRides = useQuery(api.rides.getRecent, { limit: 5 }) || [];
  const carTypes = useQuery(api.carTypes.list) || [];
  
  const pendingRides = recentRides.filter((r) => r.status === "pending").length;
  const activeFleet = carTypes.filter((c) => c.isActive).length;

  const stats = [
    { label: "Pending Reservations", value: pendingRides, icon: CalendarDays },
    { label: "Active Fleet Vehicles", value: activeFleet, icon: Car },
    { label: "System Status", value: "Operational", icon: Activity },
    { label: "Total Bookings (Recent)", value: recentRides.length, icon: Users },
  ];

  return (
    <div className="p-8 md:p-12 space-y-12">
      <header className="space-y-4">
        <h1 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight">
          System <span className="text-gold">Overview</span>
        </h1>
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Luna Limo Executive Dashboard
        </p>
      </header>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="h-6 w-6 text-gold" />
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-serif text-3xl font-black italic">{stat.value}</h3>
              <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="bg-neutral-900 border border-neutral-800 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
          <h2 className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">Recent Reservations</h2>
        </div>
        
        {recentRides.length === 0 ? (
           <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest text-center py-12">No recent activity detected</p>
        ) : (
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <div key={ride._id} className="flex justify-between items-center p-4 bg-black border border-neutral-800">
                <div className="space-y-1">
                   <p className="text-gold font-serif text-xs font-black italic uppercase tracking-widest">{ride.customerName}</p>
                   <p className="text-white text-sm font-bold truncate max-w-md">{ride.pickupAddress} <span className="text-gold mx-2">→</span> {ride.destinationAddress}</p>
                   <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.1em]">{ride.pickupDate} • {ride.carTypeName}</p>
                </div>
                <div>
                   <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                     ride.status === "pending" ? "bg-amber-950 text-amber-500 border border-amber-900" 
                     : ride.status === "confirmed" ? "bg-emerald-950 text-emerald-500 border border-emerald-900"
                     : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                   }`}>
                     {ride.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
