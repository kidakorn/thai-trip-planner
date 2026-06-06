"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
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
  hoveredActivity?: Activity | null;
}

export default function LeafletMapInner({
  activities,
  bookLabel,
  hoveredActivity,
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
        height: "420px",
        borderRadius: 0,
        zIndex: 0,
        background: "#12141f",
      }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Polyline
        positions={activities.filter((a) => a.lat !== null && a.lng !== null).map(a => [a.lat!, a.lng!])}
        pathOptions={{ color: '#d90429', weight: 3, opacity: 0.6, dashArray: '10, 10' }}
      />
      {activities
        .filter((a) => a.lat !== null && a.lng !== null)
        .map((a, index) => {
          const isHovered = hoveredActivity === a;
          const iconHtml = `<div style="
            background-color: ${isHovered ? '#ff0000' : '#d90429'};
            color: white;
            border-radius: 50%;
            width: ${isHovered ? '32px' : '26px'};
            height: ${isHovered ? '32px' : '26px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${isHovered ? '14px' : '12px'};
            border: 2px solid white;
            box-shadow: 0 3px 8px rgba(217, 4, 41, 0.4);
            transition: all 0.2s ease;
          ">${index + 1}</div>`;

          const customIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: iconHtml,
            iconSize: isHovered ? [32, 32] : [26, 26],
            iconAnchor: isHovered ? [16, 16] : [13, 13],
          });

          return (
            <Marker key={index} position={[a.lat!, a.lng!]} icon={customIcon} zIndexOffset={isHovered ? 1000 : 0}>
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
          );
        })}
    </MapContainer>
  );
}
