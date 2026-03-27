"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  ChevronRight,
  Star,
  Globe,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Compass,
  Trophy,
  Quote,
  Zap,
  Car
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-black text-white">
          <div className="max-w-7xl mx-auto text-center relative z-20">
            <h2 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white leading-tight tracking-tight">
              REFINING THE ART OF <span className="text-gold">LUXURY TRAVEL</span>
              <br className="hidden md:block" />
              ELITE TRANSPORTATION IN SEATTLE & BEYOND
            </h2>

            <p className="text-sm md:text-base text-neutral-400 mt-6 max-w-3xl mx-auto font-medium leading-relaxed">
              Luna Limo delivers a bespoke transportation experience tailored for those who demand excellence.
              From executive airport transfers to refined event solutions, we provide the ultimate in <span className="text-gold">discretion, safety, and sophistication</span> for every journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 relative z-20">
              <Link href="tel:+12063274411">
                <Button className="font-montserrat bg-gold hover:bg-gold-dark text-white rounded-none px-10 py-7 text-xs font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-gold-dark flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  Call Now +1 (206) 327-4411
                </Button>
              </Link>
              <Link href="/booking">
                <Button className="font-montserrat bg-black hover:bg-neutral-800 text-gold rounded-none px-10 py-7 text-xs font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-neutral-700 flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  View Price & Book A Ride
                </Button>
              </Link>
            </div>
          </div>

          <div className="-mt-8 md:-mt-24 relative mx-auto max-w-6xl h-[250px] sm:h-[400px] md:h-[650px] -mb-16 sm:-mb-24 md:-mb-40 z-0">
            <Image
              src="/fleet_black_bg.png"
              alt="Luna Limo Fleet"
              fill
              className="object-contain transition-transform hover:scale-105 duration-1000"
              priority
            />
          </div>
        </section>

        {/* Testimonial Snapshot */}
        <section className="bg-neutral-900 py-12 px-6">
          <div className="max-w-lg mx-auto bg-black p-8 border border-neutral-800 shadow-xl relative animate-fade-in shadow-gold/5">
            <div className="flex items-center gap-4 mb-4">
              <Star className="h-10 w-10 text-gold fill-gold" />
              <div>
                <h3 className="font-serif font-black italic text-lg leading-tight uppercase text-white">Judy Bell-Holzemer</h3>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3 w-3 text-gold fill-gold" />)}
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-300 italic leading-relaxed">
              "First time using Luna Limo. Everything was seamless. I booked a car as a gift... The entire process... was so easy. My guests..." <span className="text-gold font-bold">Read more</span>
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                <span className="text-blue-400">G</span>
                <span className="text-red-400">o</span>
                <span className="text-yellow-400">o</span>
                <span className="text-blue-400">g</span>
                <span className="text-green-400">l</span>
                <span className="text-red-400">e</span>
                <span> rating 5.0 of 5, based on 302 reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Elite Services Grid */}
        <section className="py-24 px-6 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">Our Expertise</h3>
              <h2 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white leading-tight">
                Elite Travel Solutions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Airport Transfers",
                  desc: "Punctual, stress-free transfers to and from Sea-Tac International.",
                  icon: <Globe className="h-8 w-8 text-gold" />
                },
                {
                  title: "Corporate Travel",
                  desc: "Professional black car service for executive meetings and business events.",
                  icon: <Briefcase className="h-8 w-8 text-gold" />
                },
                {
                  title: "Special Occasions",
                  desc: "Luxurious transportation for weddings, anniversaries, and red-carpet events.",
                  icon: <Trophy className="h-8 w-8 text-gold" />
                },
                {
                  title: "City Charters",
                  desc: "Custom hourly service for city tours, shopping, or dinner bookings.",
                  icon: <Compass className="h-8 w-8 text-gold" />
                }
              ].map((service, i) => (
                <div key={i} className="group p-8 bg-neutral-900 border border-neutral-800 hover:border-gold/50 transition-all duration-500 relative">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                  <h4 className="font-serif font-black italic uppercase text-xl text-white mb-4">{service.title}</h4>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Section with Background */}
        <section className="relative py-24 px-6 bg-black overflow-hidden border-t border-neutral-900">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <Image
                src="/fleet_black_bg.png"
                alt="Luxury Car and Seattle Skyline"
                width={600}
                height={400}
                className="object-contain grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-black italic uppercase text-white leading-tight">
                Seattle Luxury Transportation | Your Premier Choice For Reliability.
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                Luxury is more than a car—it's the peace of mind that your driver is already there. At Luna Limo, we know that your time is your most valuable asset. We are an elite transportation provider, dedicated to delivering precision and comfort for every mile.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="tel:+12063274411">
                  <Button className="bg-black hover:bg-neutral-800 text-white rounded-none px-8 text-[11px] font-black uppercase tracking-widest border-b-2 border-neutral-700">
                    Call: (206) 327-4411
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button className="bg-gold hover:bg-gold-dark text-white rounded-none px-8 text-[11px] font-black uppercase tracking-widest border-b-2 border-gold-dark">
                    Book Your Ride Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-24 px-6 bg-neutral-900 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">Common Inquiries</h3>
              <h2 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white">
                Frequently Asked
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How far in advance should I book?",
                  a: "We recommend booking at least 24 hours in advance for airport transfers and 48 hours for special events to ensure full vehicle availability."
                },
                {
                  q: "What is your cancellation policy?",
                  a: "Cancellations made 24 hours prior to the scheduled pickup receive a full refund. Same-day cancellations may incur a standard fee."
                },
                {
                  q: "Do you offer meet and greet at Sea-Tac?",
                  a: "Yes, our executive airport service includes a baggage claim meet-and-greet with a personalized name board."
                },
                {
                  q: "Are your vehicles smoke-free?",
                  a: "Absolutely. All vehicles in our fleet are strictly non-smoking to ensure a premium environment for all guests."
                }
              ].map((faq, i) => (
                <div key={i} className="group p-6 bg-black border border-neutral-800 hover:border-gold/30 transition-all">
                  <h4 className="font-serif font-black italic uppercase text-lg text-gold mb-3 flex items-center gap-3">
                    <span className="text-xs font-sans not-italic border border-gold/40 px-2 py-0.5 rounded text-gold/60">Q</span>
                    {faq.q}
                  </h4>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest leading-relaxed pl-10">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Black Section / CTA */}
        <section className="bg-neutral-900 py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gold rotate-45 flex items-center justify-center">
                  <div className="bg-neutral-900 w-full h-full transform scale-90 border-4 border-gold" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gold font-serif font-black text-4xl italic uppercase tracking-tighter">L</span>
                </div>
              </div>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-black italic uppercase text-white leading-tight">
              Our Chauffeur Driven Services
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-bold tracking-tight px-4 uppercase">
              RELIABLE AIRPORT TRANSFERS FOR CORPORATE BLACK CAR SERVICE. LOCAL SPECIAL LOCATIONS FOR CORPORATE BLACK CAR SERVICE. SPECIAL EVENT TRANSPORTATION. FOR ROAD TRANSPORTATION, AND SPECIAL EVENT TRANSPORTATION TRANSPORTATION.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="tel:+12063274411" className="w-full sm:w-auto">
                <Button size="lg" className="bg-white hover:bg-neutral-100 text-black rounded-none px-12 py-8 text-xs font-black uppercase tracking-[0.2em] w-full">
                  Call: (206) 327-4411
                </Button>
              </Link>
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-white rounded-none px-12 py-8 text-xs font-black uppercase tracking-[0.2em] w-full">
                  Book Your Ride Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-cinzel text-2xl font-black italic uppercase text-gold leading-tight tracking-tighter">
                  Luna Limo
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider leading-relaxed">
                Premium Chauffeur Service in Seattle and Washington Area.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-6 border-b border-gold/20 pb-2 inline-block">Our Services</h4>
              <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <li>Airport Transfers</li>
                <li>Corporate Travel</li>
                <li>Special Events</li>
                <li>City Tours</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-6 border-b border-gold/20 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <li><Link href="/booking">Reservations</Link></li>
                <li><Link href="#">Fleet</Link></li>
                <li><Link href="#">About Us</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-6 border-b border-gold/20 pb-2 inline-block">Social Media</h4>
              <div className="flex gap-4">
                <Globe className="h-5 w-5 text-neutral-400 hover:text-gold cursor-pointer" />
                <Mail className="h-5 w-5 text-neutral-400 hover:text-gold cursor-pointer" />
                <MapPin className="h-5 w-5 text-neutral-400 hover:text-gold cursor-pointer" />
                <Phone className="h-5 w-5 text-neutral-400 hover:text-gold cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600">
              Copyright © 2026 Luna Limo. All Rights Reserved
            </p>
            <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}