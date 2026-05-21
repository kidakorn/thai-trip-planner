import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { Place, Category } from "@/src/lib/types";
import PlaceCard from "@/src/components/PlaceCard";
import PlacesFilter from "@/src/components/PlacesFilter";

export const metadata: Metadata = {
  title: "สถานที่ทั้งหมด",
  description:
    "ค้นพบสถานที่น่าสนใจทั่วไทย ร้านอาหาร ที่พัก กิจกรรม และสถานที่ท่องเที่ยว",
};

const CATEGORY_LABELS: Record<Category, { th: string; en: string }> = {
  food: { th: "อาหาร", en: "Food" },
  drink: { th: "เครื่องดื่ม", en: "Drinks" },
  hotel: { th: "ที่พัก", en: "Hotel" },
  activity: { th: "กิจกรรม", en: "Activity" },
  attraction: { th: "สถานที่ท่องเที่ยว", en: "Attraction" },
};

interface PlacesPageProps {
  searchParams: Promise<{ category?: string; province?: string }>;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
  const { category, province } = await searchParams;

  let query = supabase
    .from("places")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (province) {
    query = query.eq("province", province);
  }

  const { data, error } = await query.limit(60);

  const places: Place[] = error ? [] : (data as Place[]);

  return (
    <div
      style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800,
            color: "#edf2f4",
            marginBottom: "0.4rem",
          }}
        >
          สถานที่ทั้งหมด
        </h1>
        <p style={{ color: "#8d99ae", fontSize: "0.95rem" }}>
          ค้นพบสถานที่น่าสนใจทั่วไทย
        </p>
      </div>

      {/* Filter bar — client component to use URL params */}
      <PlacesFilter activeCategory={category ?? "all"} />

      {/* Grid */}
      {places.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 1rem",
            color: "#8d99ae",
            fontSize: "1rem",
          }}
        >
          ไม่พบสถานที่
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1.25rem",
            marginTop: "1.5rem",
          }}
        >
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              categoryLabel={CATEGORY_LABELS[place.category].th}
            />
          ))}
        </div>
      )}
    </div>
  );
}
