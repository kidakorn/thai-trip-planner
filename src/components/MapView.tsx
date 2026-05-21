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
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8d99ae",
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
}

export default function MapView({ activities, bookLabel }: MapViewProps) {
  const withCoords = activities.filter(
    (a) => a.lat !== null && a.lng !== null
  );

  if (withCoords.length === 0) {
    return null;
  }

  return <LeafletMap activities={withCoords} bookLabel={bookLabel} />;
}
