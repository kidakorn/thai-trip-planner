"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Activity } from "@/src/lib/types";

// Fix Leaflet's default icon asset paths broken by webpack/bundlers
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface LeafletMapInnerProps {
  activities: Activity[];
  bookLabel: string;
}

export default function LeafletMapInner({
  activities,
  bookLabel,
}: LeafletMapInnerProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const firstValid = activities.find((a) => a.lat !== null && a.lng !== null);
  const center: [number, number] = firstValid
    ? [firstValid.lat!, firstValid.lng!]
    : [13.7563, 100.5018];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "1rem",
        zIndex: 0,
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {activities
        .filter((a) => a.lat !== null && a.lng !== null)
        .map((a, index) => (
          <Marker key={index} position={[a.lat!, a.lng!]}>
            <Popup>
              <strong>{a.place_name}</strong>
              <br />
              {a.description}
              <br />
              <span style={{ color: "#d90429", fontWeight: 600 }}>
                ฿{a.estimated_cost.toLocaleString()}
              </span>
              {a.affiliate_url && (
                <>
                  <br />
                  <a
                    href={a.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#d90429" }}
                  >
                    {bookLabel}
                  </a>
                </>
              )}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
