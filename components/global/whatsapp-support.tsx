"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsAppSupport() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  // Professional pre-filled message
  const message = encodeURIComponent(
    "Hello Luna Limo, I am interested in booking a luxury chauffeur service. Could you please provide more information?"
  );
  const whatsappUrl = `https://wa.me/12063274411?text=${message}`;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 group">
      {/* Tooltip/Label */}
      <div 
        className={cn(
          "bg-black/90 backdrop-blur-md border border-gold/30 text-white px-4 py-2 rounded-none",
          "text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl",
          "transition-all duration-300 transform",
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        Luxe Concierge Online
      </div>

      <div className="relative">
        {/* Pulsing Background Effect */}
        <div className="absolute inset-0 bg-gold rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        
        {/* Main WhatsApp Button */}
        <Link 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Button 
            className="h-14 w-14 rounded-full bg-gold hover:bg-gold-dark text-white shadow-3xl border-2 border-black p-0 flex items-center justify-center transition-all active:scale-95"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </Link>

        {/* Dismiss Button (Tiny X) */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -left-2 bg-neutral-900 text-neutral-500 hover:text-white rounded-full p-1 border border-neutral-800 transition-colors"
          title="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
