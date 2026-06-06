import Link from "next/link";
import Image from "next/image";
import { MapPin, Utensils, Hotel, Zap, Binoculars, Coffee, ArrowRight } from "lucide-react";
import { Category, Place } from "@/src/lib/types";
import { useLanguage } from "@/src/lib/useLanguage";

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  food: Utensils,
  drink: Coffee,
  hotel: Hotel,
  activity: Zap,
  attraction: Binoculars,
};

const CATEGORY_BADGE: Record<Category, string> = {
  food:       "bg-orange-500/15 text-orange-400 border-orange-500/25",
  drink:      "bg-purple-500/15 text-purple-400 border-purple-500/25",
  hotel:      "bg-sky-500/15 text-sky-400 border-sky-500/25",
  activity:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  attraction: "bg-primary-red/15 text-primary-red border-primary-red/25",
};

interface PlaceCardProps {
  place: Place;
  categoryLabel: string;
}

export default function PlaceCard({ place, categoryLabel }: PlaceCardProps) {
  const { t } = useLanguage();
  const FallbackIcon = CATEGORY_ICONS[place.category];
  const hasImage = place.images.length > 0 && place.images[0];

  return (
    <article className="group bg-surface-3 rounded-2xl overflow-hidden border border-border hover:border-border-strong transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative w-full h-[190px] bg-surface-2 flex items-center justify-center overflow-hidden shrink-0">
        {hasImage ? (
          <Image
            src={place.images[0]}
            alt={place.name_en ?? place.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-80 group-hover:brightness-70"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <FallbackIcon size={36} className="text-ink-subtle" aria-hidden="true" />
        )}

        {/* Top gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${CATEGORY_BADGE[place.category]}`}>
          {categoryLabel}
        </span>

        {/* Price badge */}
        {place.price_range && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
            {"฿".repeat(place.price_range)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-inter font-bold text-base text-ink mb-1 line-clamp-1 group-hover:text-primary-red transition-colors duration-200">
          {place.name}
        </h3>

        {place.name_en && (
          <p className="text-[11px] text-ink-subtle mb-3 line-clamp-1">{place.name_en}</p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
          <MapPin size={12} className="text-primary-red shrink-0" aria-hidden="true" />
          <span>{place.province}</span>
          {place.district && <span className="text-ink-subtle">· {place.district}</span>}
        </div>

        {place.description && (
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-4 flex-1">
            {place.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-border">
          <Link
            href={place.affiliate_url || `/places/${place.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-red hover:text-secondary-red transition-colors group/link"
            aria-label={`${t("places_view_detail")} ${place.name}`}
          >
            {t("places_view_detail")}
            <ArrowRight size={12} aria-hidden="true" className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
