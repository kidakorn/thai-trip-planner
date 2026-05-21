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
  food: "badge-food",
  drink: "badge-drink",
  hotel: "badge-hotel",
  activity: "badge-activity",
  attraction: "badge-attraction",
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
    <article
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.2s",
      }}
    >
      {/* Time + icon column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          minWidth: "4rem",
        }}
      >
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#d90429",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          <Clock size={11} aria-hidden="true" />
          {activity.time}
        </span>
        <div
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "0.5rem",
            background: "rgba(217, 4, 41, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} color="#d90429" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#edf2f4",
                marginBottom: "0.15rem",
              }}
            >
              {activity.place_name}
            </h4>
            <span
              className={CATEGORY_BADGE_CLASS[activity.category]}
              style={{
                display: "inline-block",
                padding: "0.1rem 0.5rem",
                borderRadius: "999px",
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Cost */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "0.75rem", color: "#8d99ae" }}>{costLabel}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#edf2f4" }}>
              ฿{activity.estimated_cost.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#8d99ae" }}>
              {activity.duration_minutes} {minutesLabel}
            </div>
          </div>
        </div>

        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            color: "#8d99ae",
            lineHeight: 1.6,
          }}
        >
          {activity.description}
        </p>

        {/* Tip */}
        {activity.tip && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(217, 4, 41, 0.06)",
              border: "1px solid rgba(217, 4, 41, 0.15)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.4rem",
            }}
          >
            <Lightbulb size={13} color="#d90429" style={{ marginTop: "0.15rem", flexShrink: 0 }} aria-hidden="true" />
            <p style={{ fontSize: "0.8rem", color: "#edf2f4" }}>
              <strong style={{ color: "#d90429" }}>{tipLabel}: </strong>
              {activity.tip}
            </p>
          </div>
        )}

        {/* Affiliate link */}
        {activity.affiliate_url && (
          <a
            href={activity.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${bookLabel} — ${activity.place_name}`}
            style={{
              marginTop: "0.6rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#d90429",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={13} aria-hidden="true" />
            {bookLabel}
          </a>
        )}
      </div>
    </article>
  );
}
