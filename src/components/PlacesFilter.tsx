"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Category } from "@/src/lib/types";

const CATEGORY_OPTIONS: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food" },
  { value: "drink", label: "Drinks" },
  { value: "hotel", label: "Hotels" },
  { value: "activity", label: "Activities" },
  { value: "attraction", label: "Attractions" },
];

interface PlacesFilterProps {
  currentCategory: string;
  currentProvince: string;
}

export default function PlacesFilter({ currentCategory, currentProvince }: PlacesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch("/api/provinces");
        if (res.ok) {
          const data = await res.json();
          setProvinces(data);
        }
      } catch (err) {
        console.error("Failed to load provinces", err);
      } finally {
        setLoadingProvinces(false);
      }
    }
    fetchProvinces();
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-bold text-ink-muted uppercase tracking-wider mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map(({ value, label }) => {
            const isActive = value === currentCategory;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilters("category", value)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-primary-red text-white border border-secondary-red shadow-md shadow-primary-red/20" 
                    : "bg-red-50 text-ink-secondary border border-red-100 hover:bg-red-100 hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Province Filter */}
      <div>
        <h3 className="text-sm font-bold text-ink-muted uppercase tracking-wider mb-3">Province</h3>
        <select
          value={currentProvince}
          onChange={(e) => updateFilters("province", e.target.value)}
          className="w-full bg-red-50 text-ink text-sm font-bold px-4 py-2.5 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none appearance-none cursor-pointer"
        >
          <option value="all">All Provinces</option>
          {!loadingProvinces && provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {loadingProvinces && <p className="text-xs text-ink-muted mt-2">Loading provinces...</p>}
      </div>
    </div>
  );
}
