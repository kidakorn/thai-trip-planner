import type { Metadata } from "next";
import Image from "next/image";
import { supabase } from "@/src/lib/supabase";
import { Place, Category } from "@/src/lib/types";
import PlacesGrid from "@/src/components/PlacesGrid";
import PlacesFilter from "@/src/components/PlacesFilter";
import AnimatedPlacesHero from "@/src/components/AnimatedPlacesHero";
import { SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "All Places — Thai Trip Planner",
  description:
    "Discover restaurants, hotels, activities and attractions across all provinces of Thailand.",
};

const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food",
  drink: "Drinks",
  hotel: "Hotel",
  activity: "Activity",
  attraction: "Attraction",
};

interface PlacesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PlacesPage({
  searchParams,
}: PlacesPageProps) {
  const resolvedParams = await searchParams;
  const filterCategory = (resolvedParams.category as string) || "all";
  const filterProvince = (resolvedParams.province as string) || "all";

  // Fetch from Supabase
  let query = supabase
    .from("places")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filterCategory && filterCategory !== "all") {
    query = query.eq("category", filterCategory);
  }

  if (filterProvince && filterProvince !== "all") {
    query = query.eq("province", filterProvince);
  }

  const { data: places, error } = await query;
  const validPlaces = (places as Place[]) || [];

  return (
    <div className="bg-surface text-ink min-h-screen font-inter">
      {/* ── HERO SECTION ── */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/light/phuket_light_1779892386681.png"
            alt="Thailand Places"
            fill
            className="object-cover scale-105"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/90 to-surface" />
          <div className="absolute inset-0 bg-primary-red/5 mix-blend-multiply" />
        </div>

        {/* Animated Hero Content */}
        <AnimatedPlacesHero />
      </section>

      {/* ── CONTENT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 bg-white border border-red-100 rounded-3xl p-6 shadow-xl shadow-red-900/5">
            <div className="flex items-center gap-2 mb-6 text-ink">
              <SlidersHorizontal size={20} className="text-primary-red" />
              <h2 className="font-inter font-bold text-xl">Filters</h2>
            </div>
            
            <PlacesFilter 
              currentCategory={filterCategory} 
              currentProvince={filterProvince} 
            />
          </div>

          {/* Grid */}
          <div className="flex-1 w-full min-w-0">
            {error ? (
              <div className="p-8 text-center bg-white border border-red-100 shadow-md rounded-3xl">
                <p className="text-secondary-red font-bold">Error loading places. Please try again later.</p>
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
