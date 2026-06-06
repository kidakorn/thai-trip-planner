"use client";

import { useState } from "react";
import { TripPlan, Category, Activity } from "@/src/lib/types";
import ActivityCard from "@/src/components/ActivityCard";
import MapView from "@/src/components/MapView";
import { ChevronDown, ChevronUp, Wallet, Lightbulb, Copy, Check } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";
import { motion, Variants } from "framer-motion";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

const CATEGORY_LABELS: Record<Category, { th: string; en: string }> = {
  food:       { th: "อาหาร",           en: "Food" },
  drink:      { th: "เครื่องดื่ม",     en: "Drinks" },
  hotel:      { th: "ที่พัก",          en: "Hotel" },
  activity:   { th: "กิจกรรม",         en: "Activity" },
  attraction: { th: "สถานที่ท่องเที่ยว", en: "Attraction" },
};

interface TripResultProps {
  plan: TripPlan;
}

export default function TripResult({ plan }: TripResultProps) {
  const { t, lang } = useLanguage();
  const [openDay, setOpenDay] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [hoveredActivity, setHoveredActivity] = useState<Activity | null>(null);

  const allActivities = plan.days.flatMap((d) => d.activities);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  };

  return (
    <article className="font-inter" aria-label="Trip result">

      {/* ── Trip header ── */}
      <header className="relative bg-surface-3 border border-border rounded-xl overflow-hidden px-7 py-10 mb-6">
        {/* Red top line */}
        <div className="absolute top-0 left-0 right-0 h-px shimmer-line" />

        <div className="max-w-2xl">
          <p className="section-label">{t("trip_result_label") || "Your Itinerary"}</p>
          <h1 className="font-black text-2xl sm:text-3xl text-ink leading-snug mb-2">
            {plan.title}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed mb-6">{plan.summary}</p>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary-red/8 border border-primary-red/15 text-sm font-semibold text-ink">
              <Wallet size={13} className="text-primary-red" />
              ฿{plan.total_budget.toLocaleString()}
            </div>
            <button
              onClick={handleCopy}
              aria-label={t("trip_share")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/4 hover:bg-white/8 border border-border text-ink-muted hover:text-ink text-sm font-semibold transition-all cursor-pointer"
            >
              {copied
                ? <><Check size={13} className="text-emerald-400" />{t("trip_share_copied")}</>
                : <><Copy size={13} />{t("trip_share")}</>
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Map ── */}
      <div className="rounded-xl overflow-hidden border border-border mb-6">
        <MapView activities={allActivities} bookLabel={t("trip_book_link")} hoveredActivity={hoveredActivity} />
      </div>

      {/* ── Itinerary ── */}
      <div className="mb-2">
        <p className="section-label">Itinerary</p>
        <h2 className="font-bold text-lg text-ink mb-5">
          {plan.days.length}-day plan
        </h2>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-2.5">
        {plan.days.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <motion.div key={day.day} variants={fade} className="bg-surface-3 rounded-xl border border-border overflow-hidden">

              {/* Day header */}
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                aria-expanded={isOpen}
                aria-controls={`day-${day.day}-panel`}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                    isOpen ? "bg-primary-red text-white" : "bg-surface-4 text-ink-subtle border border-border"
                  }`}>
                    {day.day}
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5 ${isOpen ? "text-primary-red" : "text-ink-subtle"}`}>
                      {t("trip_day")} {day.day}
                    </p>
                    <h3 className="text-sm font-bold text-ink leading-tight line-clamp-1">{day.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-ink-subtle font-medium hidden sm:block">
                    ฿{day.total_cost.toLocaleString()}
                  </span>
                  {isOpen
                    ? <ChevronUp size={15} className="text-ink-subtle" />
                    : <ChevronDown size={15} className="text-ink-subtle" />
                  }
                </div>
              </button>

              {/* Day content */}
              {isOpen && (
                <div
                  id={`day-${day.day}-panel`}
                  className="border-t border-border bg-surface-2/60 p-4 flex flex-col gap-2.5"
                >
                  {day.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredActivity(activity)}
                      onMouseLeave={() => setHoveredActivity(null)}
                    >
                      <ActivityCard
                        activity={activity}
                        costLabel={t("trip_estimated_cost")}
                        bookLabel={t("trip_book_link")}
                        tipLabel={t("trip_tip")}
                        minutesLabel={t("trip_minutes")}
                        categoryLabel={CATEGORY_LABELS[activity.category][lang]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Tips ── */}
      {plan.tips.length > 0 && (
        <section aria-label={t("trip_tips_title")} className="bg-surface-3 border border-border rounded-xl p-6 mt-6">
          <h2 className="font-bold text-base text-ink mb-4 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-red/10 border border-primary-red/15 flex items-center justify-center shrink-0">
              <Lightbulb size={13} className="text-primary-red" />
            </div>
            {t("trip_tips_title")}
          </h2>
          <ul className="flex flex-col gap-3">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-ink-muted leading-relaxed">
                <span className="w-5 h-5 rounded-md bg-primary-red/8 border border-primary-red/15 text-primary-red font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

    </article>
  );
}
