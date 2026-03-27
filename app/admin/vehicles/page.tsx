"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminVehiclesPage() {
  const cars = useQuery(api.carTypes.list);

  if (cars === undefined) {
    return <div className="p-12 text-center text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">Loading fleet data...</div>;
  }

  return (
    <div className="p-8 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight">
            Fleet <span className="text-gold">Configuration</span>
          </h1>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Manage vehicle classes and pricing structures
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-dark text-white rounded-none py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <Plus className="h-4 w-4" />
            Add Vehicle Class
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
           <div key={car._id} className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="font-serif text-xl font-black italic uppercase text-white">{car.name}</h3>
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">Class Multiplier: {car.multiplier}x</p>
                 </div>
                 <Car className="h-6 w-6 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="space-y-4 flex-1">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black border border-neutral-800 p-3">
                       <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Base Fare</p>
                       <p className="text-white font-serif font-black italic">${car.baseFare}</p>
                    </div>
                    <div className="bg-black border border-neutral-800 p-3">
                       <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Per KM</p>
                       <p className="text-white font-serif font-black italic">${car.perKmRate}</p>
                    </div>
                 </div>
                 <div className="bg-black border border-neutral-800 p-3 flex justify-between items-center">
                    <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Capacity</span>
                    <span className="text-white font-bold text-sm">{car.capacity} Passengers</span>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-800 flex justify-between items-center">
                 <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${car.isActive ? "bg-emerald-950 text-emerald-500" : "bg-neutral-800 text-neutral-500"}`}>
                    {car.isActive ? "Active" : "Inactive"}
                 </span>
                 <Button variant="outline" size="sm" className="bg-transparent text-gold border-gold/30 hover:bg-gold hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest">
                    Edit Settings
                 </Button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
