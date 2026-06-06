"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Category } from "@/src/lib/types";
import { useLanguage } from "@/src/lib/useLanguage";
import { PROVINCE_NAMES_EN } from "@/src/lib/constants";

const CATS: { value: "all" | Category; key: string }[] = [
  { value: "all",        key: "places_filter_all" },
  { value: "food",       key: "places_filter_food" },
  { value: "drink",      key: "places_filter_drink" },
  { value: "hotel",      key: "places_filter_hotel" },
  { value: "activity",   key: "places_filter_activity" },
  { value: "attraction", key: "places_filter_attraction" },
];

export default function PlacesFilter({
  currentCategory,
  currentProvince,
}: {
  currentCategory: string;
  currentProvince: string;
}) {
  const { t, locale } = useLanguage();
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [provinces, setProvinces]   = useState<string[]>([]);
  const [loadingP,  setLoadingP]    = useState(true);

  useEffect(() => {
    fetch("/api/provinces")
      .then(r => r.ok ? r.json() : [])
      .then(setProvinces)
      .catch(() => {})
      .finally(() => setLoadingP(false));
  }, []);

  const update = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams.toString());
    val === "all" ? p.delete(key) : p.set(key, val);
    router.push(`${pathname}?${p.toString()}`);
  };

  const LABEL = "text-[9px] font-bold uppercase tracking-[0.14em] text-ink-subtle mb-2 block";

  return (
    <div className="flex flex-col gap-5">

      {/* Category */}
      <div>
        <p className={LABEL}>{t("places_filter_category")}</p>
        <div className="flex flex-col gap-1">
          {CATS.map(({ value, key }) => {
            const on = value === currentCategory;
            return (
              <button
                key={value} type="button"
                onClick={() => update("category", value)}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  on
                    ? "bg-primary-red/10 text-primary-red border border-primary-red/20"
                    : "text-ink-muted hover:text-ink hover:bg-white/4 border border-transparent"
                }`}
              >
                {t(key as any)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Province */}
      <div>
        <label htmlFor="province-filter" className={LABEL}>
          {t("places_filter_province")}
        </label>
        <select
          id="province-filter"
          value={currentProvince}
          onChange={e => update("province", e.target.value)}
          className="input-dark text-xs cursor-pointer appearance-none"
          disabled={loadingP}
        >
          <option value="all">{t("places_filter_all_provinces")}</option>
          {!loadingP && provinces.map(p => (
            <option key={p} value={p}>
              {locale === "en" ? (PROVINCE_NAMES_EN[p] ?? p) : p}
            </option>
          ))}
        </select>
        {loadingP && <p className="text-[10px] text-ink-subtle mt-1.5">{t("places_filter_loading")}</p>}
      </div>

    </div>
  );
}
