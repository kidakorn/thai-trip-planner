"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/src/lib/types";
import { useLanguage } from "@/src/lib/useLanguage";

const FILTER_OPTIONS: { value: "all" | Category; labelKey: string }[] = [
  { value: "all", labelKey: "places_filter_all" },
  { value: "food", labelKey: "places_filter_food" },
  { value: "drink", labelKey: "places_filter_drink" },
  { value: "hotel", labelKey: "places_filter_hotel" },
  { value: "activity", labelKey: "places_filter_activity" },
  { value: "attraction", labelKey: "places_filter_attraction" },
];

interface PlacesFilterProps {
  activeCategory: string;
}

export default function PlacesFilter({ activeCategory }: PlacesFilterProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`/places?${params.toString()}`);
  };

  return (
    <div
      role="group"
      aria-label="Filter by category"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      {FILTER_OPTIONS.map(({ value, labelKey }) => {
        const isActive = value === activeCategory || (value === "all" && !activeCategory);
        return (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            aria-pressed={isActive}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              border: `1px solid ${isActive ? "#d90429" : "rgba(255,255,255,0.1)"}`,
              background: isActive ? "rgba(217, 4, 41, 0.15)" : "transparent",
              color: isActive ? "#d90429" : "#8d99ae",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t(labelKey as Parameters<typeof t>[0])}
          </button>
        );
      })}
    </div>
  );
}
