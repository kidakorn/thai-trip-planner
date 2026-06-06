import type { Metadata } from "next";
import Image from "next/image";
import { supabase } from "@/src/lib/supabase";
import { Place, Category } from "@/src/lib/types";
import PlacesGrid from "@/src/components/PlacesGrid";
import PlacesFilter from "@/src/components/PlacesFilter";
import { SlidersHorizontal } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "All Places — Thai Trip Planner" : "สถานที่ทั้งหมด — Thai Trip Planner",
    description: locale === "en"
      ? "Discover restaurants, hotels, activities and attractions across all provinces of Thailand."
      : "ค้นพบร้านอาหาร โรงแรม กิจกรรม และสถานที่ท่องเที่ยวในทุกจังหวัดของประเทศไทย",
  };
}

interface PlacesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}

export default async function PlacesPage({ searchParams, params }: PlacesPageProps) {
  const resolvedParams = await searchParams;
  const { locale } = await params;

  const filterCategory = (resolvedParams.category as string) || "all";
  const filterProvince  = (resolvedParams.province  as string) || "all";

  let query = supabase
    .from("places")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filterCategory !== "all") query = query.eq("category", filterCategory);
  if (filterProvince  !== "all") query = query.eq("province",  filterProvince);

  const { data: places, error } = await query;
  const validPlaces = (places as Place[]) || [];

  return (
    <div className="bg-surface min-h-screen text-ink font-inter">

      {/* ── Hero ── */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/light/phuket_light_1779892386681.png"
          alt="" fill
          className="object-cover brightness-40 scale-105"
          priority quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/70 to-surface" />
        <div className="absolute inset-0 dot-grid opacity-60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-12 px-6">
          <p className="section-label">Discover Thailand</p>
          <h1 className="font-black text-[clamp(1.8rem,4vw,3rem)] text-ink text-center leading-tight">
            Explore{" "}
            <span className="text-gradient-red">Places</span>
          </h1>
          <p className="text-ink-muted text-sm text-center max-w-md mt-2">
            {locale === "en"
              ? "Handpicked restaurants, hotels, activities and attractions."
              : "ร้านอาหาร โรงแรม กิจกรรม และสถานที่ท่องเที่ยวที่คัดสรร"}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar */}
          <aside className="w-full lg:w-52 shrink-0 lg:sticky lg:top-24 bg-surface-3 border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal size={15} className="text-primary-red" />
              <h2 className="font-bold text-sm text-ink">
                {locale === "en" ? "Filters" : "ตัวกรอง"}
              </h2>
            </div>
            <PlacesFilter currentCategory={filterCategory} currentProvince={filterProvince} />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {error ? (
              <div className="p-6 text-center bg-surface-3 border border-border rounded-xl">
                <p className="text-sm text-primary-red font-semibold">
                  {locale === "en"
                    ? "Error loading places. Please try again."
                    : "เกิดข้อผิดพลาด กรุณาลองใหม่"}
                </p>
              </div>
            ) : (
              <PlacesGrid places={validPlaces} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
