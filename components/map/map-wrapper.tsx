"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/components/map/leaflet-map").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-surface-elevated flex items-center justify-center rounded-2xl">
        <p className="text-foreground-muted">Loading map...</p>
      </div>
    ),
  }
);

export default MapComponent;