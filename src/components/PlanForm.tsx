"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Wallet, Users, ChevronRight, Loader, AlertCircle } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";
import { TripStyle } from "@/src/lib/types";
import { PROVINCE_NAMES_EN } from "@/src/lib/constants";

interface FormState {
  province: string;
  days: number;
  budget: number;
  travelers: number;
  style: TripStyle[];
  preferences: string;
}

interface FormErrors {
  province?: string;
  days?: string;
  budget?: string;
  style?: string;
}

const STYLE_OPTIONS: { value: TripStyle; label: string }[] = [
  { value: "culture", label: "Culture" },
  { value: "nature", label: "Nature" },
  { value: "food", label: "Food" },
  { value: "nightlife", label: "Nightlife" },
  { value: "relaxation", label: "Relaxation" },
];

export default function PlanForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAiMode, setIsAiMode] = useState(false);
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

  const [form, setForm] = useState<FormState>({
    province: "",
    days: 3,
    budget: 5000,
    travelers: 2,
    style: [],
    preferences: "",
  });

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!isAiMode && !form.province) next.province = t("form_validation_province") || "Select a destination";
    if (form.days < 1 || form.days > 14) next.days = t("form_validation_days") || "Must be 1-14 days";
    if (form.budget < 500) next.budget = t("form_validation_budget") || "Minimum budget is 500 THB";
    if (form.style.length === 0) next.style = t("form_validation_style") || "Select at least one style";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toggleStyle = (s: TripStyle) => {
    setForm((prev) => ({
      ...prev,
      style: prev.style.includes(s)
        ? prev.style.filter((x) => x !== s)
        : [...prev.style, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          province: isAiMode ? "" : form.province,
          days: form.days,
          budget: form.budget,
          travelers: form.travelers,
          style: form.style,
          preferences: form.preferences || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? t("error_general") ?? "Failed to create trip");
        return;
      }

      const data = await res.json();
      router.push(`/trip/${data.id}`);
    } catch {
      setServerError(t("error_general") ?? "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="font-inter">
      <div className="flex flex-col gap-6">

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1.5 bg-red-50/50 rounded-full border border-red-100 relative">
          <button
            type="button"
            onClick={() => setIsAiMode(false)}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isAiMode ? "bg-white text-primary-red shadow-md border border-red-100" : "text-ink-muted hover:text-ink"}`}
          >
            {t("mode_know")}
          </button>
          <button
            type="button"
            onClick={() => { setIsAiMode(true); setForm(p => ({...p, province: ""})); }}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${isAiMode ? "bg-white text-primary-red shadow-md border border-red-100" : "text-ink-muted hover:text-ink"}`}
          >
            {t("mode_help")}
          </button>
        </div>

        {/* Province Selection */}
        {!isAiMode && (
          <div>
            <label htmlFor="province" className="flex items-center gap-2 text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">
              <MapPin size={14} aria-hidden="true" />
              Destination *
            </label>
            <div className="relative">
              <select
                id="province"
                value={form.province}
                onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                className="w-full bg-white text-ink font-bold px-4 py-3 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none appearance-none cursor-pointer shadow-sm"
                aria-required="true"
                aria-describedby={errors.province ? "province-error" : undefined}
                disabled={loadingProvinces}
              >
                <option value="">{loadingProvinces ? "Loading..." : "Select a province"}</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {PROVINCE_NAMES_EN[prov] ?? prov}
                  </option>
                ))}
              </select>
            </div>
            {errors.province && (
              <p id="province-error" role="alert" className="mt-2 text-xs text-primary-red flex items-center gap-1 font-bold">
                <AlertCircle size={12} aria-hidden="true" /> {errors.province}
              </p>
            )}
          </div>
        )}

        {/* Days + Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="days" className="flex items-center gap-2 text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">
              <Calendar size={14} aria-hidden="true" />
              Days *
            </label>
            <input
              id="days"
              type="number"
              min={1}
              max={14}
              value={form.days}
              onChange={(e) => setForm((p) => ({ ...p, days: Number(e.target.value) }))}
              className="w-full bg-white text-ink font-bold px-4 py-3 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none shadow-sm"
              aria-required="true"
              aria-describedby={errors.days ? "days-error" : undefined}
            />
            {errors.days && (
              <p id="days-error" role="alert" className="mt-2 text-xs text-primary-red flex items-center gap-1 font-bold">
                <AlertCircle size={12} aria-hidden="true" /> {errors.days}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="flex items-center gap-2 text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">
              <Wallet size={14} aria-hidden="true" />
              Budget (THB) *
            </label>
            <input
              id="budget"
              type="number"
              min={500}
              step={500}
              value={form.budget}
              onChange={(e) => setForm((p) => ({ ...p, budget: Number(e.target.value) }))}
              className="w-full bg-white text-ink font-bold px-4 py-3 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none shadow-sm"
              aria-required="true"
              aria-describedby={errors.budget ? "budget-error" : undefined}
            />
            {errors.budget && (
              <p id="budget-error" role="alert" className="mt-2 text-xs text-primary-red flex items-center gap-1 font-bold">
                <AlertCircle size={12} aria-hidden="true" /> {errors.budget}
              </p>
            )}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label htmlFor="travelers" className="flex items-center gap-2 text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">
            <Users size={14} aria-hidden="true" />
            Travelers
          </label>
          <input
            id="travelers"
            type="number"
            min={1}
            max={20}
            value={form.travelers}
            onChange={(e) => setForm((p) => ({ ...p, travelers: Number(e.target.value) }))}
            className="w-full sm:max-w-[160px] bg-white text-ink font-bold px-4 py-3 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none shadow-sm"
          />
        </div>

        {/* Divider */}
        <div className="text-sm font-bold text-ink-muted uppercase tracking-wider border-t border-red-100 pt-6 mt-2">
          Travel style *
        </div>

        {/* Style selector */}
        <div>
          <div role="group" aria-label="Travel style" className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map(({ value, label }) => {
              const isActive = form.style.includes(value);
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleStyle(value)}
                  aria-pressed={isActive}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-primary-red text-white border border-secondary-red shadow-lg shadow-primary-red/20" 
                      : "bg-white text-ink-secondary border border-red-100 hover:border-red-300 hover:text-ink shadow-sm"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.style && (
            <p role="alert" className="mt-2 text-xs text-primary-red flex items-center gap-1 font-bold">
              <AlertCircle size={12} aria-hidden="true" /> {errors.style}
            </p>
          )}
        </div>

        {/* Preferences */}
        <div>
          <label htmlFor="preferences" className="flex justify-between items-center text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">
            <span>{isAiMode ? "Describe your dream trip *" : "Additional preferences (optional)"}</span>
            {isAiMode && <span className="text-[10px] text-primary-red bg-primary-red/10 px-2 py-0.5 rounded-full">AI Picks Province</span>}
          </label>
          <textarea
            id="preferences"
            rows={3}
            value={form.preferences}
            onChange={(e) => setForm((p) => ({ ...p, preferences: e.target.value }))}
            placeholder="e.g. love seafood, avoid crowds, must be pet-friendly"
            className="w-full bg-white text-ink font-medium px-4 py-3 rounded-xl border border-red-100 focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none resize-y shadow-sm"
          />
        </div>

        {/* Server error */}
        {serverError && (
          <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} aria-hidden="true" />
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-2 bg-primary-red hover:bg-secondary-red text-white font-bold rounded-xl shadow-lg hover:shadow-primary-red/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" aria-hidden="true" />
              Generating your itinerary...
            </>
          ) : (
            <>
              Generate Trip Plan
              <ChevronRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
