import { Activity, Category } from "@/src/lib/types";
import { Clock, Utensils, Hotel, Zap, Binoculars, ExternalLink, Lightbulb } from "lucide-react";

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

interface ActivityCardProps {
  activity: Activity;
  costLabel: string;
  bookLabel: string;
  tipLabel: string;
  minutesLabel: string;
  categoryLabel: string;
}

export default function ActivityCard({
  activity,
  costLabel,
  bookLabel,
  tipLabel,
  minutesLabel,
  categoryLabel,
}: ActivityCardProps) {
  const Icon = CATEGORY_ICONS[activity.category];

  return (
    <article className="grid grid-cols-[48px_1fr] sm:grid-cols-[56px_1fr] gap-4 p-5 bg-white border border-red-100 rounded-3xl hover:border-red-300 shadow-sm hover:shadow-md transition-all">
      {/* Time column */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <span className="text-[11px] font-bold text-primary-red flex items-center gap-1">
          <Clock size={10} aria-hidden="true" />
          {activity.time}
        </span>
        <div className="w-10 h-10 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0 border border-primary-red/20">
          <Icon size={16} className="text-primary-red" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h4 className="text-[15px] font-inter font-bold text-ink mb-1.5 leading-tight">
              {activity.place_name}
            </h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_BADGE_CLASS[activity.category]}`}>
              {categoryLabel}
            </span>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-ink-muted mb-0.5 font-bold">
              {costLabel}
            </div>
            <div className="text-base font-inter font-bold text-ink">
              ฿{activity.estimated_cost.toLocaleString()}
            </div>
            <div className="text-[11px] text-ink-muted">
              {activity.duration_minutes} {minutesLabel}
            </div>
          </div>
        </div>

        <p className={`text-[13px] text-ink-secondary leading-relaxed ${activity.tip || activity.affiliate_url ? 'mb-4' : ''}`}>
          {activity.description}
        </p>

        {activity.tip && (
          <div className={`p-3 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 ${activity.affiliate_url ? 'mb-3' : ''}`}>
            <Lightbulb size={14} className="text-primary-red mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[12px] text-ink-secondary leading-relaxed">
              <strong className="text-primary-red font-bold">{tipLabel}: </strong>
              {activity.tip}
            </p>
          </div>
        )}

        {activity.affiliate_url && (
          <a
            href={activity.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${bookLabel} — ${activity.place_name}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary-red hover:text-ink transition-colors"
          >
            <ExternalLink size={14} aria-hidden="true" />
            {bookLabel}
          </a>
        )}
      </div>
    </article>
  );
}
