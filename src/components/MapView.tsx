"use client";

import dynamic from "next/dynamic";
import { Activity } from "@/src/lib/types";

// Leaflet must not render on the server — dynamic import with ssr: false
const LeafletMap = dynamic(() => import("@/src/components/LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "1rem",
        background: "var(--bg-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.9rem",
      }}
    >
      Loading map...
    </div>
  ),
});

interface MapViewProps {
  activities: Activity[];
  bookLabel: string;
  hoveredActivity?: Activity | null;
}

export default function MapView({ activities, bookLabel, hoveredActivity }: MapViewProps) {
  const withCoords = activities.filter(
    (a) => a.lat !== null && a.lng !== null
  );

  if (withCoords.length === 0) {
    return null;
  }

  return <LeafletMap activities={withCoords} bookLabel={bookLabel} hoveredActivity={hoveredActivity} />;
}
