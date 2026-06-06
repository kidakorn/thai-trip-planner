"use client";

import { Activity, Category } from "@/src/lib/types";
import { Clock, Utensils, Hotel, Zap, Binoculars, ExternalLink, Lightbulb, Coffee } from "lucide-react";

const ICONS: Record<Category, React.ElementType> = {
  food:       Utensils,
  drink:      Coffee,
  hotel:      Hotel,
  activity:   Zap,
  attraction: Binoculars,
};

const BADGE: Record<Category, string> = {
  food:       "bg-orange-500/10 text-orange-400 border-orange-500/15",
  drink:      "bg-purple-500/10 text-purple-400 border-purple-500/15",
  hotel:      "bg-sky-500/10    text-sky-400    border-sky-500/15",
  activity:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
  attraction: "bg-primary-red/10 text-primary-red border-primary-red/15",
};

const BOOK_STYLE: Record<string, string> = {
  Agoda:       "bg-[#ff567d]/8 hover:bg-[#ff567d]/15 text-[#ff567d] border-[#ff567d]/20",
  Klook:       "bg-[#ff5b00]/8 hover:bg-[#ff5b00]/15 text-[#ff5b00] border-[#ff5b00]/20",
  "Booking.com": "bg-sky-500/8 hover:bg-sky-500/15 text-sky-400 border-sky-500/20",
  Maps:        "bg-white/4 hover:bg-white/8 text-ink-muted border-border",
};

interface ActivityCardProps {
  activity:      Activity;
  costLabel:     string;
  bookLabel:     string;
  tipLabel:      string;
  minutesLabel:  string;
  categoryLabel: string;
}

export default function ActivityCard({ activity, costLabel, bookLabel, tipLabel, minutesLabel, categoryLabel }: ActivityCardProps) {
  const Icon = ICONS[activity.category];

  let url  = activity.affiliate_url;
  let provider = "Maps";

  if (!url) {
    if (activity.category === "hotel") {
      url = `https://www.agoda.com/search?text=${encodeURIComponent(activity.place_name)}`;
      provider = "Agoda";
    } else if (activity.category === "activity" || activity.category === "attraction") {
      url = `https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(activity.place_name)}`;
      provider = "Klook";
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place_name)}`;
    }
  } else {
    if      (url.includes("agoda"))   provider = "Agoda";
    else if (url.includes("klook"))   provider = "Klook";
    else if (url.includes("booking")) provider = "Booking.com";
  }

  const bookStyle = BOOK_STYLE[provider] ?? BOOK_STYLE["Maps"];
  const isMap = provider === "Maps";

  return (
    <article className="group grid grid-cols-[40px_1fr] gap-3.5 p-4 bg-surface-3 border border-border rounded-xl hover:border-border-strong transition-all duration-150">

      {/* Time + icon column */}
      <div className="flex flex-col items-center gap-1.5 pt-0.5">
        <span className="text-[9px] font-bold text-primary-red flex items-center gap-0.5">
          <Clock size={8} />
          {activity.time}
        </span>
        <div className="w-8 h-8 rounded-lg bg-primary-red/8 border border-primary-red/15 flex items-center justify-center shrink-0 group-hover:bg-primary-red/12 transition-colors">
          <Icon size={13} className="text-primary-red" />
        </div>
      </div>

      {/* Content column */}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-ink leading-snug truncate mb-1">{activity.place_name}</h4>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${BADGE[activity.category]}`}>
              {categoryLabel}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[8px] font-bold uppercase tracking-wider text-ink-subtle">{costLabel}</p>
            <p className="text-sm font-black text-ink">฿{activity.estimated_cost.toLocaleString()}</p>
            <p className="text-[9px] text-ink-subtle">{activity.duration_minutes} {minutesLabel}</p>
          </div>
        </div>

        <p className={`text-[11px] text-ink-muted leading-relaxed ${activity.tip || url ? "mb-2.5" : ""}`}>
          {activity.description}
        </p>

        {activity.tip && (
          <div className={`flex items-start gap-2 p-2.5 rounded-lg bg-primary-red/5 border border-primary-red/12 ${url ? "mb-2.5" : ""}`}>
            <Lightbulb size={11} className="text-primary-red mt-0.5 shrink-0" />
            <p className="text-[10px] text-ink-muted leading-relaxed">
              <strong className="text-primary-red">{tipLabel}: </strong>
              {activity.tip}
            </p>
          </div>
        )}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${isMap ? "View on" : bookLabel} ${provider} — ${activity.place_name}`}
            className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${bookStyle}`}
          >
            <ExternalLink size={10} />
            {isMap ? `View on ${provider}` : `${bookLabel} via ${provider}`}
          </a>
        )}
      </div>
    </article>
  );
}
