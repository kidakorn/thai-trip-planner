import Link from "next/link";
import Image from "next/image";
import { MapPin, Utensils, Hotel, Zap, Binoculars, ArrowRight } from "lucide-react";
import { Category, Place } from "@/src/lib/types";

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  food: Utensils,
  drink: Zap,
  hotel: Hotel,
  activity: Zap,
  attraction: Binoculars,
};

const CATEGORY_BADGE_CLASS: Record<Category, string> = {
  food: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  drink: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  hotel: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  activity: "bg-green-500/10 text-green-500 border-green-500/20",
  attraction: "bg-primary-red/10 text-primary-red border-primary-red/20",
};

interface PlaceCardProps {
  place: Place;
  categoryLabel: string;
}

export default function PlaceCard({ place, categoryLabel }: PlaceCardProps) {
  const FallbackIcon = CATEGORY_ICONS[place.category];
  const hasImage = place.images.length > 0 && place.images[0];

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-red-100 hover:border-red-300 shadow-md hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative w-full h-[200px] bg-dark-bg flex items-center justify-center overflow-hidden shrink-0">
        {hasImage ? (
          <Image
            src={place.images[0]}
            alt={place.name_en ?? place.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <FallbackIcon size={40} className="text-ink-muted" aria-hidden="true" />
        )}
        
        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${CATEGORY_BADGE_CLASS[place.category]}`}
        >
          {categoryLabel}
        </span>

        {/* Price badge */}
        {place.price_range && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
            {"฿".repeat(place.price_range)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-inter font-bold text-xl text-ink mb-1 line-clamp-1 group-hover:text-primary-red transition-colors">
          {place.name}
        </h3>

        {place.name_en && (
          <p className="text-xs text-ink-muted mb-3 line-clamp-1">
            {place.name_en}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-ink-secondary mb-3 font-medium">
          <MapPin size={14} className="text-primary-red" aria-hidden="true" />
          <span>{place.province}</span>
          {place.district && <span>· {place.district}</span>}
        </div>

        {place.description && (
          <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
            {place.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-red-100">
          <Link
            href={place.affiliate_url || `/places/${place.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-red hover:text-ink transition-colors"
            aria-label={`View details for ${place.name}`}
          >
            View details
            <ArrowRight size={14} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
