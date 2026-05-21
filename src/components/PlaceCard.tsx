import Link from "next/link";
import Image from "next/image";
import { MapPin, Utensils, Hotel, Zap, Binoculars } from "lucide-react";
import { Category, Place } from "@/src/lib/types";

// Map each category to a fallback lucide icon
const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  food: Utensils,
  drink: Zap,
  hotel: Hotel,
  activity: Zap,
  attraction: Binoculars,
};

// Map each category to a CSS class defined in globals.css
const CATEGORY_BADGE_CLASS: Record<Category, string> = {
  food: "badge-food",
  drink: "badge-drink",
  hotel: "badge-hotel",
  activity: "badge-activity",
  attraction: "badge-attraction",
};

interface PlaceCardProps {
  place: Place;
  categoryLabel: string;
}

export default function PlaceCard({ place, categoryLabel }: PlaceCardProps) {
  const FallbackIcon = CATEGORY_ICONS[place.category];
  const hasImage = place.images.length > 0 && place.images[0];

  return (
    <article
      className="card-glass"
      style={{
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image or fallback */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "180px",
          background: "rgba(255,255,255,0.04)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {hasImage ? (
          <Image
            src={place.images[0]}
            alt={place.name_en ?? place.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <FallbackIcon size={48} color="rgba(255,255,255,0.15)" aria-hidden="true" />
        )}

        {/* Category badge overlaid on image */}
        <span
          className={CATEGORY_BADGE_CLASS[place.category]}
          style={{
            position: "absolute",
            top: "0.6rem",
            left: "0.6rem",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#edf2f4",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {place.name}
        </h3>

        {place.name_en && (
          <p style={{ fontSize: "0.8rem", color: "#8d99ae", marginTop: "-0.25rem" }}>
            {place.name_en}
          </p>
        )}

        {/* Province */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            color: "#8d99ae",
            fontSize: "0.8rem",
          }}
        >
          <MapPin size={13} aria-hidden="true" />
          <span>{place.province}</span>
          {place.district && <span>· {place.district}</span>}
        </div>

        {/* Price range */}
        {place.price_range && (
          <div style={{ color: "#d90429", fontSize: "0.85rem", fontWeight: 600 }}>
            {"฿".repeat(place.price_range)}
            <span style={{ color: "rgba(255,255,255,0.2)" }}>
              {"฿".repeat(3 - place.price_range)}
            </span>
          </div>
        )}

        {/* Description preview */}
        {place.description && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "#8d99ae",
              flex: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {place.description}
          </p>
        )}

        {/* View detail link */}
        <Link
          href={`/places/${place.id}`}
          style={{
            marginTop: "auto",
            paddingTop: "0.75rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#d90429",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            transition: "gap 0.2s",
          }}
          aria-label={`View details for ${place.name}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
