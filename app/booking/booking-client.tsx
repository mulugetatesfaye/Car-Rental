"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  CheckCircle,
  Clock,
  Car,
  Users,
  Star,
  Calendar,
  Luggage,
  Accessibility,
  Plus,
  Minus,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";
import { LocationInput } from "@/components/booking/location-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/map/map-wrapper";
import { useRideStore } from "@/lib/store/rideStore";
import { createRide } from "@/lib/convex/api";
import { calculateRouteBetween } from "@/lib/tomtom/routing";
import { formatDuration, formatDistance } from "@/lib/utils";
import { formatPrice, calculatePrice } from "@/lib/pricing";
import type { CarType } from "@/lib/pricing";
import { useSearchParams } from "next/navigation";
import { geocodeAddress } from "@/lib/tomtom/search";
import type { SearchResult } from "@/lib/tomtom/search";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


interface BookingOptions {
  passengers: number;
  luggage: number;
  accessible: boolean;
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function BookingClient() {
  const searchParams = useSearchParams();
  const dbCarTypes = useQuery(api.carTypes.list);
  
  // Filter active car types
  const activeCarTypes = React.useMemo(() => {
    return dbCarTypes?.filter((car: CarType) => car.isActive) || [];
  }, [dbCarTypes]);

  const {
    pickup,
    destination,
    route,
    selectedCar,
    isLoadingRoute,
    isBooking,
    step,
    setPickup,
    setDestination,
    setRoute,
    setSelectedCar,
    setLoadingRoute,
    setBooking,
    setStep,
  } = useRideStore();

  const [options, setOptions] = React.useState<BookingOptions>({
    passengers: 1,
    luggage: 1,
    accessible: false,
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [bookingStep, setBookingStep] = React.useState<"trip" | "vehicle" | "payment">("trip");

  const fetchRoute = async (pickupLoc: SearchResult, destLoc: SearchResult) => {
    setLoadingRoute(true);
    const routeResult = await calculateRouteBetween(
      { lat: pickupLoc.position.lat, lng: pickupLoc.position.lon },
      { lat: destLoc.position.lat, lng: destLoc.position.lon },
    );
    setRoute(routeResult);
    setLoadingRoute(false);
    return routeResult;
  };

  const hasInitializedFromParams = React.useRef(false);

  // Handle deep links from Home Page
  React.useEffect(() => {
    if (hasInitializedFromParams.current) return;
    
    const initFromParams = async () => {
      const pParam = searchParams.get("p");
      const dParam = searchParams.get("d");
      const dateParam = searchParams.get("date");
      const timeParam = searchParams.get("time");

      if (!pParam && !dParam && !dateParam && !timeParam) return;
      
      hasInitializedFromParams.current = true;

      // Update basic options
      setOptions(prev => ({
        ...prev,
        pickupDate: dateParam || prev.pickupDate,
        pickupTime: timeParam || prev.pickupTime,
      }));

      try {
        let resolvedPickup = null;
        let resolvedDestination = null;

        if (pParam) {
          resolvedPickup = await geocodeAddress(pParam);
          if (resolvedPickup) {
            setPickup(resolvedPickup);
          }
        }

        if (dParam) {
          resolvedDestination = await geocodeAddress(dParam);
          if (resolvedDestination) {
            setDestination(resolvedDestination);
          }
        }

        // If both resolved, trigger route calculation
        if (resolvedPickup && resolvedDestination) {
          await fetchRoute(resolvedPickup, resolvedDestination);
        }
      } catch (error) {
        console.error("Initialization from params failed:", error);
      }
    };

    initFromParams();
  }, [searchParams]);

  React.useEffect(() => {
    if (activeCarTypes.length > 0 && !selectedCar) {
      setSelectedCar(activeCarTypes[0]);
    }
  }, [activeCarTypes, selectedCar, setSelectedCar]);

  const handlePickupSelect = async (location: SearchResult | null) => {
    setPickup(location);
    if (location && destination) {
      await fetchRoute(location, destination);
    }
  };

  const handleDestinationSelect = async (location: SearchResult | null) => {
    setDestination(location);
    if (pickup && location) {
      await fetchRoute(pickup, location);
    }
  };

  const handleCarSelect = (car: CarType) => {
    setSelectedCar(car);
  };

  const handleConfirm = async () => {
    if (!pickup || !destination || !route || !selectedCar || !pricing) return;

    setBooking(true);

    try {
      await createRide({
        pickupAddress: pickup.address.freeformAddress,
        destinationAddress: destination.address.freeformAddress,
        pickupLat: pickup.position.lat,
        pickupLng: pickup.position.lon,
        destLat: destination.position.lat,
        destLng: destination.position.lon,
        distance: route.distanceInKm,
        duration: route.durationInMinutes,
        carTypeName: selectedCar.name,
        carTypeMultiplier: selectedCar.multiplier,
        price: pricing.totalPrice,
        passengers: options.passengers,
        luggage: options.luggage,
        accessible: options.accessible,
        pickupDate: options.pickupDate,
        pickupTime: options.pickupTime || undefined,
        customerName: options.customerName,
        customerEmail: options.customerEmail,
        customerPhone: options.customerPhone,
      });

      setStep("complete");
    } catch (error) {
      console.error("Error creating ride:", error);
    } finally {
      setBooking(false);
    }
  };

  const handleReset = () => {
    setPickup(null);
    setDestination(null);
    setRoute(null);
    setSelectedCar(activeCarTypes[0] || null);
    setStep("pickup");
    setBookingStep("trip");
    setOptions({
      passengers: 1,
      luggage: 1,
      accessible: false,
      pickupDate: new Date().toISOString().split("T")[0],
      pickupTime: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    });
  };

  const updateOption = (
    key: keyof BookingOptions,
    value: string | number | boolean,
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const pricing =
    selectedCar && route
      ? calculatePrice(selectedCar, route.distanceInKm, route.durationInMinutes)
      : null;

  if (step === "complete") {
    // Keep confirmation UI similar but styled
     return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden w-full">
        <main className="max-w-4xl mx-auto py-20 px-4 sm:px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8 border border-gold/20">
              <CheckCircle className="h-12 w-12 text-gold" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black italic uppercase mb-4 text-white">
              Booking <span className="text-gold">Confirmed</span>
            </h2>
            <p className="text-neutral-400 mb-12 font-bold uppercase tracking-widest text-xs">
              Your luxury ride has been reserved. Our concierge will contact you shortly.
            </p>

            <Card className="max-w-md mx-auto p-8 mb-12 border-neutral-800 shadow-2xl bg-neutral-900 text-left rounded-none">
              <h3 className="font-serif font-black italic uppercase text-xl mb-6 pb-2 border-b border-neutral-800 text-gold">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Pickup</span>
                  <span className="text-sm font-bold text-right truncate max-w-[200px]">{pickup?.address.freeformAddress}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Destination</span>
                  <span className="text-sm font-bold text-right truncate max-w-[200px]">{destination?.address.freeformAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Vehicle</span>
                  <span className="text-sm font-bold italic">{selectedCar?.name}</span>
                </div>
                {pricing && (
                  <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                    <span className="text-neutral-900 font-black uppercase text-[11px] tracking-widest">Total Paid</span>
                    <span className="text-2xl font-serif font-black italic text-gold">
                      {formatPrice(pricing.totalPrice)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Button onClick={handleReset} className="bg-gold hover:bg-gold-dark text-white rounded-none px-12 py-8 text-xs font-sans font-black uppercase tracking-[0.2em] shadow-lg">
              Book Another Ride
            </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden w-full">

      <div className="bg-[#111111] py-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between md:justify-center gap-2 md:gap-0">
            <Step 
              num="1" 
              title="Trip" 
              active={bookingStep === "trip"} 
              complete={bookingStep === "vehicle" || bookingStep === "payment"} 
            />
            <div className="flex-1 h-px bg-white/5 md:mx-4" />
            <Step 
              num="2" 
              title="Vehicle" 
              active={bookingStep === "vehicle"} 
              complete={bookingStep === "payment"} 
            />
            <div className="flex-1 h-px bg-white/5 md:mx-4" />
            <Step 
              num="3" 
              title="Payment" 
              active={bookingStep === "payment"} 
              complete={false} 
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-full">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 order-first min-w-0">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black italic uppercase text-white border-b-2 border-gold inline-block pb-1">
                    Trip Details
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Pickup Location</label>
                    <LocationInput
                      placeholder="Enter pickup location (e.g. SEA Airport)"
                      value={pickup}
                      onChange={handlePickupSelect}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Drop-off Location</label>
                    <LocationInput
                      placeholder="Enter destination (e.g. Hotel or Address)"
                      value={destination}
                      onChange={handleDestinationSelect}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={options.pickupDate}
                          onChange={(e) => updateOption("pickupDate", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 rounded-none text-sm font-bold text-white outline-none focus:border-gold transition-colors appearance-none"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Time</label>
                      <div className="relative">
                        <input
                          type="time"
                          value={options.pickupTime}
                          onChange={(e) => updateOption("pickupTime", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 rounded-none text-sm font-bold text-white outline-none focus:border-gold transition-colors"
                        />
                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Service Type</label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => updateOption("accessible", false)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${!options.accessible ? "border-gold bg-gold/10" : "border-neutral-800 bg-neutral-900"}`}>
                          {!options.accessible && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                        </div>
                        <span className={`text-sm font-bold uppercase tracking-tight ${!options.accessible ? "text-gold" : "text-neutral-400"}`}>Point-to-Point</span>
                      </div>
                      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => updateOption("accessible", true)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${options.accessible ? "border-gold bg-gold/10" : "border-neutral-800 bg-neutral-900"}`}>
                          {options.accessible && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                        </div>
                        <span className={`text-sm font-bold uppercase tracking-tight ${options.accessible ? "text-gold" : "text-neutral-400"}`}>Hourly Service</span>
                        {options.accessible && (
                           <div className="flex items-center gap-2 ml-4">
                             <input type="number" defaultValue="1" className="w-12 bg-neutral-900 border border-neutral-800 text-center py-1 text-xs font-bold text-white focus:border-gold outline-none" />
                             <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">HOURS</span>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {pickup && destination && route && (
                <section className="animate-fade-in">
                   <h2 className="text-2xl sm:text-3xl font-serif font-black italic uppercase mb-8 pb-1 border-b-2 border-gold inline-block">
                    Select Vehicle
                  </h2>
                   <div className="space-y-2 sm:space-y-4">
                    {activeCarTypes.length === 0 ? (
                      <div className="py-20 text-center border border-neutral-800 bg-neutral-900/30">
                        <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Retrieving Elite Fleet...</p>
                      </div>
                    ) : (
                      activeCarTypes.map((car) => (
                        <button
                          key={car.name}
                          onClick={() => setSelectedCar(car)}
                          className={`w-full flex items-center gap-3 sm:gap-6 p-3 sm:p-5 transition-all border border-neutral-800 hover:bg-neutral-900/50 ${
                            selectedCar?.name === car.name ? "bg-neutral-900 border-l-4 border-l-gold border-neutral-700" : "opacity-60"
                          }`}
                        >
                           {/* Compact icon for mobile, image card for desktop */}
                           <div className="hidden sm:flex w-28 h-20 bg-neutral-800/50 items-center justify-center flex-shrink-0 border border-neutral-800 relative overflow-hidden group">
                             <Image 
                               src={car.image || "/fleet_black_bg.png"}
                               alt={car.name}
                               fill
                               className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                             <Car className="h-8 w-8 text-white relative z-10 opacity-80" />
                           </div>
                           <div className="flex sm:hidden w-10 h-10 bg-neutral-800/60 items-center justify-center flex-shrink-0 border border-neutral-800">
                             <Car className="h-5 w-5 text-gold" />
                           </div>

                           <div className="flex-1 text-left min-w-0">
                              <h4 className="font-serif text-sm sm:text-lg text-white truncate">{car.name}</h4>
                              <p className="hidden sm:block text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mt-0.5 whitespace-normal line-clamp-1">{car.description}</p>
                              <div className="flex items-center gap-3 sm:gap-6 mt-1 sm:mt-2">
                                 <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                   <Users className="h-3 w-3 text-gold inline mr-1" />{car.capacity}
                                 </span>
                                 <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                   <Luggage className="h-3 w-3 text-gold inline mr-1" />{car.capacity}
                                 </span>
                              </div>
                           </div>
                           <div className="text-right flex-shrink-0">
                              <p className="hidden sm:block text-[9px] font-semibold uppercase tracking-widest text-neutral-500 mb-1">From</p>
                              <p className="font-serif text-lg sm:text-2xl text-gold">{formatPrice(car.baseFare)}</p>
                           </div>
                        </button>
                      ))
                    )}
                  </div>
                </section>
              )}

              {pickup && destination && route && selectedCar && (
                <section className="animate-fade-in py-12">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black italic uppercase mb-8 pb-1 border-b-2 border-gold inline-block">
                    Passenger Details
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Full Name</label>
                       <input 
                         value={options.customerName} 
                         onChange={(e) => updateOption("customerName", e.target.value)}
                         placeholder="Enter your full name" 
                         required 
                         className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 rounded-none text-sm font-bold text-white outline-none focus:border-gold transition-colors placeholder:text-neutral-700 font-sans" 
                       />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email Address</label>
                         <input 
                           type="email"
                           value={options.customerEmail} 
                           onChange={(e) => updateOption("customerEmail", e.target.value)}
                           placeholder="email@example.com" 
                           required 
                           className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 rounded-none text-sm font-bold text-white outline-none focus:border-gold transition-colors placeholder:text-neutral-700 font-sans" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Phone Number</label>
                         <input 
                           type="tel"
                           value={options.customerPhone} 
                           onChange={(e) => updateOption("customerPhone", e.target.value)}
                           placeholder="(555) 000-0000" 
                           required 
                           className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 rounded-none text-sm font-bold text-white outline-none focus:border-gold transition-colors placeholder:text-neutral-700 font-sans" 
                         />
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 order-last lg:order-last min-w-0">
            <div className="lg:sticky lg:top-28 max-w-full">
              <Card className="rounded-none shadow-2xl border border-neutral-800 overflow-hidden bg-neutral-900 max-w-full">
                <div className="bg-black py-4 px-6 border-b border-neutral-800">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-[12px] text-center">Trip Summary</h3>
                </div>
                
                <div className="p-0 overflow-hidden">
                  <div className="w-full h-[200px] sm:h-[300px] border-b border-neutral-800 grayscale hover:grayscale-0 transition-all duration-700 relative overflow-hidden">
                    <MapComponent
                      pickup={pickup ? { lat: pickup.position.lat, lng: pickup.position.lon } : null}
                      destination={destination ? { lat: destination.position.lat, lng: destination.position.lon } : null}
                      routeCoordinates={route?.coordinates}
                    />
                    {!route && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] px-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-white/60 text-center">Enter Locations to View Route</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                    {route && (
                      <div className="flex justify-between items-center bg-black p-4 border-l-2 border-gold outline outline-1 outline-neutral-800">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Distance</p>
                          <p className="text-sm font-black italic">{formatDistance(route.distanceInKm)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Duration</p>
                          <p className="text-sm font-black italic">{formatDuration(route.durationInMinutes)}</p>
                        </div>
                      </div>
                    )}

                    {pricing ? (
                      <div className="text-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Estimated Total:</p>
                        <p className="font-serif font-black italic text-4xl sm:text-5xl lg:text-6xl text-gold">
                          {formatPrice(pricing.totalPrice)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-[#111111] px-6 border border-neutral-800">
                        <Info className="h-6 w-6 text-gold/40 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 leading-relaxed max-w-[200px] mx-auto">
                          Enter trip details to see pricing guide
                        </p>
                      </div>
                    )}
                  <div className="space-y-4">
                    <Button 
                      onClick={handleConfirm}
                      disabled={!pickup || !destination || !selectedCar || !options.customerName || !options.customerEmail || !options.customerPhone || isBooking}
                      className="w-full font-sans bg-gold hover:bg-gold-dark text-white rounded-none py-8 text-xs font-black uppercase tracking-[0.3em] shadow-xl disabled:bg-neutral-800 disabled:text-neutral-500 transition-all active:translate-y-1"
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Reservation"
                      )}
                    </Button>
                    <p className="text-[9px] font-bold text-neutral-500 text-center uppercase tracking-widest leading-relaxed">
                      By confirming, you agree to our <Link href="#" className="text-gold underline decoration-gold/30">Terms</Link> and <Link href="#" className="text-gold underline decoration-gold/30">Policy</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({ num, title, active, complete }: { num: string; title: string; active: boolean; complete: boolean }) {
  return (
    <div className={`flex items-center gap-2 md:gap-3 transition-all ${active ? "opacity-100" : "opacity-40"}`}>
       <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black italic text-[10px] md:text-sm border-2 ${active || complete ? "bg-gold border-gold text-white" : "border-white/20 text-white"}`}>
         {complete ? <CheckCircle className="h-3 w-3 md:h-4 md:h-4" /> : num}
       </div>
       <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:block ${active || complete ? "text-white" : "text-white/40"}`}>
         {title}
       </span>
    </div>
  );
}
