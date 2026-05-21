import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { Place, Category } from "@/src/lib/types";
import { MapPin, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import MapView from "@/src/components/MapView";
import { Activity } from "@/src/lib/types";

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_LABELS: Record<Category, { th: string; en: string }> = {
  food: { th: "อาหาร", en: "Food" },
  drink: { th: "เครื่องดื่ม", en: "Drinks" },
  hotel: { th: "ที่พัก", en: "Hotel" },
  activity: { th: "กิจกรรม", en: "Activity" },
  attraction: { th: "สถานที่ท่องเที่ยว", en: "Attraction" },
};

const BADGE_CLASSES: Record<Category, string> = {
  food: "badge-food",
  drink: "badge-drink",
  hotel: "badge-hotel",
  activity: "badge-activity",
  attraction: "badge-attraction",
};

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("places")
    .select("name, description")
    .eq("id", id)
    .single();

  return {
    title: data?.name ?? "สถานที่",
    description: data?.description ?? "รายละเอียดสถานที่ท่องเที่ยวในไทย",
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    notFound();
  }

  const place = data as Place;

  // Convert place to an activity shape so MapView can render its pin
  const mapActivity: Activity = {
    time: "",
    place_name: place.name,
    place_id: place.id,
    category: place.category,
    description: place.description ?? "",
    duration_minutes: 0,
    estimated_cost: 0,
    tip: "",
    lat: place.lat,
    lng: place.lng,
    affiliate_url: place.affiliate_url,
  };

  const hasImages = place.images.length > 0;
  const openHoursEntries = Object.entries(place.open_hours ?? {});

  return (
    <div
      style={{
        maxWidth: "52rem",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
      }}
    >
      {/* Back link */}
      <Link
        href="/places"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          fontSize: "0.85rem",
          color: "#8d99ae",
          textDecoration: "none",
          marginBottom: "1.5rem",
          transition: "color 0.2s",
        }}
        aria-label="Back to all places"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        กลับ
      </Link>

      {/* Hero image gallery */}
      {hasImages && (
        <div
          style={{
            borderRadius: "1rem",
            overflow: "hidden",
            marginBottom: "1.5rem",
            position: "relative",
            height: "280px",
          }}
        >
          <Image
            src={place.images[0]}
            alt={place.name_en ?? place.name}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 640px) 100vw, 52rem"
          />
        </div>
      )}

      {/* Title row */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 800,
              color: "#edf2f4",
            }}
          >
            {place.name}
          </h1>
          <span
            className={BADGE_CLASSES[place.category]}
            style={{
              padding: "0.2rem 0.7rem",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {CATEGORY_LABELS[place.category].th}
          </span>
        </div>
        {place.name_en && (
          <p style={{ color: "#8d99ae", fontSize: "0.9rem" }}>{place.name_en}</p>
        )}
      </div>

      {/* Meta grid */}
      <div
        className="card-glass"
        style={{
          padding: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Location */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <MapPin size={16} color="#d90429" style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
          <div>
            <div style={{ fontSize: "0.72rem", color: "#8d99ae", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
              ที่อยู่
            </div>
            <div style={{ fontSize: "0.88rem", color: "#edf2f4" }}>
              {place.province}
              {place.district && ` · ${place.district}`}
            </div>
            {place.address && (
              <div style={{ fontSize: "0.8rem", color: "#8d99ae", marginTop: "0.1rem" }}>
                {place.address}
              </div>
            )}
          </div>
        </div>

        {/* Price range */}
        {place.price_range && (
          <div>
            <div style={{ fontSize: "0.72rem", color: "#8d99ae", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
              ระดับราคา
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#d90429" }}>
              {"฿".repeat(place.price_range)}
              <span style={{ color: "rgba(255,255,255,0.15)" }}>
                {"฿".repeat(3 - place.price_range)}
              </span>
            </div>
          </div>
        )}

        {/* Open hours */}
        {openHoursEntries.length > 0 && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <Clock size={16} color="#d90429" style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: "0.72rem", color: "#8d99ae", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                เวลาทำการ
              </div>
              {openHoursEntries.map(([day, hours]) => (
                <div key={day} style={{ fontSize: "0.82rem", color: "#edf2f4" }}>
                  <span style={{ color: "#8d99ae" }}>{day}: </span>
                  {hours}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {place.description && (
        <section aria-label="Description" style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.95rem", color: "#8d99ae", lineHeight: 1.8 }}>
            {place.description}
          </p>
        </section>
      )}

      {/* Affiliate link */}
      {place.affiliate_url && (
        <a
          href={place.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-custom"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.95rem",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
          aria-label={`Book ${place.name}`}
        >
          <ExternalLink size={16} aria-hidden="true" />
          จองที่นี่
        </a>
      )}

      {/* Map */}
      <section aria-label="Location map" style={{ marginTop: "2rem" }}>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#edf2f4",
            marginBottom: "1rem",
          }}
        >
          แผนที่
        </h2>
        <MapView activities={[mapActivity]} bookLabel="จองที่นี่" />
      </section>
    </div>
  );
}
