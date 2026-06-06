"use client";

import { motion, Variants } from "framer-motion";
import { Place, Category } from "@/src/lib/types";
import PlaceCard from "@/src/components/PlaceCard";
import { useLanguage } from "@/src/lib/useLanguage";

interface PlacesGridProps {
  places: Place[];
}

const CATEGORY_LABEL_KEYS: Record<Category, string> = {
  food: "places_filter_food",
  drink: "places_filter_drink",
  hotel: "places_filter_hotel",
  activity: "places_filter_activity",
  attraction: "places_filter_attraction",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function PlacesGrid({ places }: PlacesGridProps) {
  const { t, locale } = useLanguage();
  if (places.length === 0) {
    return (
      <div className="text-center py-24 px-4 bg-surface-2 border border-white/5 rounded-3xl">
        <p className="font-inter font-bold text-2xl mb-2 text-white">
          {t("places_no_results")}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-ink-muted mb-6 font-bold uppercase tracking-wider">
        {locale === "en" ? `Showing ${places.length} ${places.length === 1 ? "place" : "places"}` : `แสดงทั้งหมด ${places.length} สถานที่`}
      </p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {places.map((place) => (
          <motion.div key={place.id} variants={itemVariants} whileHover={{ y: -6 }}>
            <PlaceCard
              place={place}
              categoryLabel={t(CATEGORY_LABEL_KEYS[place.category] as any)}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
