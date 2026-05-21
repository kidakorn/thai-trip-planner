"use client";

import { useState } from "react";
import { TripPlan, Category } from "@/src/lib/types";
import ActivityCard from "@/src/components/ActivityCard";
import MapView from "@/src/components/MapView";
import { ChevronDown, ChevronUp, Wallet, Lightbulb } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";

const CATEGORY_LABELS: Record<
  Category,
  { th: string; en: string }
> = {
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

  // Collect all activities from all days for the full-trip map
  const allActivities = plan.days.flatMap((d) => d.activities);

  return (
    <section aria-label="Trip result" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800,
            color: "#edf2f4",
            marginBottom: "0.5rem",
          }}
        >
          {plan.title}
        </h1>
        <p style={{ fontSize: "1rem", color: "#8d99ae", lineHeight: 1.7 }}>
          {plan.summary}
        </p>
        <div
          style={{
            marginTop: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.9rem",
            borderRadius: "999px",
            background: "rgba(217, 4, 41, 0.1)",
            border: "1px solid rgba(217, 4, 41, 0.25)",
            color: "#d90429",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          <Wallet size={15} aria-hidden="true" />
          {t("trip_total_budget")}: ฿{plan.total_budget.toLocaleString()}
        </div>
      </div>

      {/* Day accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {plan.days.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <article key={day.day} className="card-glass">
              {/* Day header — toggle button */}
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                aria-expanded={isOpen}
                aria-controls={`day-${day.day}-content`}
                style={{
                  width: "100%",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#edf2f4",
                  textAlign: "left",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#d90429",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {t("trip_day")} {day.day}
                  </span>
                  <h2
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#edf2f4",
                      marginTop: "0.1rem",
                    }}
                  >
                    {day.title}
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#8d99ae", fontWeight: 600 }}>
                    ฿{day.total_cost.toLocaleString()}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} color="#8d99ae" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} color="#8d99ae" aria-hidden="true" />
                  )}
                </div>
              </button>

              {/* Day content */}
              {isOpen && (
                <div
                  id={`day-${day.day}-content`}
                  style={{
                    padding: "0 1.25rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {day.activities.map((activity, idx) => (
                    <ActivityCard
                      key={idx}
                      activity={activity}
                      costLabel={t("trip_estimated_cost")}
                      bookLabel={t("trip_book_link")}
                      tipLabel={t("trip_tip")}
                      minutesLabel={t("trip_minutes")}
                      categoryLabel={
                        CATEGORY_LABELS[activity.category][lang]
                      }
                    />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Map */}
      <section aria-label={t("trip_map_title")}>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#edf2f4",
            marginBottom: "1rem",
          }}
        >
          {t("trip_map_title")}
        </h2>
        <MapView activities={allActivities} bookLabel={t("trip_book_link")} />
      </section>

      {/* Tips */}
      {plan.tips.length > 0 && (
        <section
          className="card-glass"
          style={{ padding: "1.25rem" }}
          aria-label={t("trip_tips_title")}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#edf2f4",
              marginBottom: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Lightbulb size={18} color="#d90429" aria-hidden="true" />
            {t("trip_tips_title")}
          </h2>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {plan.tips.map((tip, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.88rem",
                  color: "#8d99ae",
                }}
              >
                <span
                  style={{
                    width: "1.4rem",
                    height: "1.4rem",
                    borderRadius: "999px",
                    background: "rgba(217, 4, 41, 0.12)",
                    color: "#d90429",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "0.05rem",
                  }}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
