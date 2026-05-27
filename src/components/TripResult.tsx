"use client";

import { useState } from "react";
import { TripPlan, Category } from "@/src/lib/types";
import ActivityCard from "@/src/components/ActivityCard";
import MapView from "@/src/components/MapView";
import { ChevronDown, ChevronUp, Wallet, Lightbulb, Share2 } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const CATEGORY_LABELS: Record<Category, { th: string; en: string }> = {
  food: { th: "อาหาร", en: "Food" },
  drink: { th: "เครื่องดื่ม", en: "Drinks" },
  hotel: { th: "ที่พัก", en: "Hotel" },
  activity: { th: "กิจกรรม", en: "Activity" },
  attraction: { th: "สถานที่ท่องเที่ยว", en: "Attraction" },
};

interface TripResultProps {
  plan: TripPlan;
}

export default function TripResult({ plan }: TripResultProps) {
  const { t, lang } = useLanguage();
  const [openDay, setOpenDay] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const allActivities = plan.days.flatMap((d) => d.activities);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <section aria-label="Trip result" className="font-inter">
      {/* ── Header ── */}
      <div className="bg-white rounded-3xl overflow-hidden border border-red-100 relative px-8 py-12 md:p-16 mb-8 shadow-xl shadow-red-900/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="w-16 h-1 bg-primary-red mb-8 rounded-full" />
          <h1 className="font-inter font-extrabold text-[clamp(2rem,4vw,3rem)] text-ink leading-tight mb-4">
            {plan.title}
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed mb-8">
            {plan.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 border border-red-100 text-ink font-bold text-sm backdrop-blur-sm">
              <Wallet size={16} className="text-primary-red" aria-hidden="true" />
              {t("trip_total_budget")}: ฿{plan.total_budget.toLocaleString()}
            </div>
            <button
              onClick={handleShare}
              aria-label={t("trip_share")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-red-100 text-ink-secondary hover:text-ink hover:bg-red-50 font-bold text-sm cursor-pointer transition-colors"
            >
              <Share2 size={16} aria-hidden="true" />
              {copied ? t("trip_share_copied") : t("trip_share")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="rounded-3xl overflow-hidden border border-red-100 shadow-xl shadow-red-900/5 mb-12">
        <MapView activities={allActivities} bookLabel={t("trip_book_link")} />
      </div>

      {/* ── Day accordion ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="mb-8">
          <h2 className="font-inter font-bold text-3xl text-ink">
            Your itinerary
          </h2>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-4"
        >
          {plan.days.map((day) => {
            const isOpen = openDay === day.day;
            return (
              <motion.article key={day.day} variants={itemVariants} className="bg-white rounded-3xl overflow-hidden border border-red-100 shadow-md">
                <button
                  type="button"
                  onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                  aria-expanded={isOpen}
                  aria-controls={`day-${day.day}-content`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary-red' : 'bg-red-50 border border-red-100'}`}>
                      <span className={`font-inter font-bold text-lg ${isOpen ? 'text-white' : 'text-ink-muted'}`}>
                        {day.day}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-primary-red mb-1">
                        {t("trip_day")} {day.day}
                      </div>
                      <h3 className="text-xl font-bold text-ink line-clamp-1">
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-bold text-ink-muted hidden sm:inline">
                      ฿{day.total_cost.toLocaleString()}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-ink-muted" aria-hidden="true" />
                    ) : (
                      <ChevronDown size={20} className="text-ink-muted" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`day-${day.day}-content`}
                    className="p-6 pt-2 border-t border-red-100 flex flex-col gap-4 bg-red-50/30"
                  >
                    {day.activities.map((activity, idx) => (
                      <ActivityCard
                        key={idx}
                        activity={activity}
                        costLabel={t("trip_estimated_cost")}
                        bookLabel={t("trip_book_link")}
                        tipLabel={t("trip_tip")}
                        minutesLabel={t("trip_minutes")}
                        categoryLabel={CATEGORY_LABELS[activity.category][lang]}
                      />
                    ))}
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>

        {/* ── Tips ── */}
        {plan.tips.length > 0 && (
          <section
            aria-label={t("trip_tips_title")}
            className="bg-white rounded-3xl p-8 mt-12 border border-red-100 shadow-md"
          >
            <h2 className="font-inter font-bold text-2xl text-ink mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-red/10 flex items-center justify-center text-primary-red">
                <Lightbulb size={20} aria-hidden="true" />
              </div>
              {t("trip_tips_title")}
            </h2>
            <ul className="flex flex-col gap-4">
              {plan.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-4 text-ink-secondary leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 text-primary-red font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
