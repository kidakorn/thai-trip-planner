"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Wallet, Users, ChevronRight, Loader, AlertCircle, Wand2 } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";
import { TripStyle } from "@/src/lib/types";
import { PROVINCE_NAMES_EN } from "../lib/constants";

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

const STYLES: { value: TripStyle; label: string }[] = [
  { value: "culture",    label: "Culture" },
  { value: "nature",     label: "Nature" },
  { value: "food",       label: "Food" },
  { value: "nightlife",  label: "Nightlife" },
  { value: "relaxation", label: "Relaxation" },
];

const LABEL = "block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-subtle mb-1.5";
const ERR   = "mt-1.5 text-[11px] text-primary-red flex items-center gap-1 font-medium";

export default function PlanForm() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [aiMode, setAiMode]     = useState(false);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [loadingP, setLoadingP] = useState(true);

  useEffect(() => {
    fetch("/api/provinces")
      .then(r => r.ok ? r.json() : [])
      .then(d => setProvinces(d))
      .catch(() => {})
      .finally(() => setLoadingP(false));
  }, []);

  const [form, setForm] = useState<FormState>({
    province: "", days: 3, budget: 5000, travelers: 2, style: [], preferences: "",
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(p => ({ ...p, [key]: val }));

  const toggleStyle = (s: TripStyle) =>
    set("style", form.style.includes(s) ? form.style.filter(x => x !== s) : [...form.style, s]);

  const validate = () => {
    const e: FormErrors = {};
    if (!aiMode && !form.province) e.province = t("form_validation_province") || "Select a destination";
    if (form.days < 1 || form.days > 14) e.days   = t("form_validation_days")   || "1–14 days";
    if (form.budget < 500)               e.budget  = t("form_validation_budget") || "Minimum ฿500";
    if (form.style.length === 0)         e.style   = t("form_validation_style")  || "Pick at least one";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerErr(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          province: aiMode ? "" : form.province,
          days: form.days, budget: form.budget, travelers: form.travelers,
          style: form.style, preferences: form.preferences || undefined, language: lang,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setServerErr(d.error ?? t("error_general") ?? "Failed");
        return;
      }
      const d = await res.json();
      router.push(`/trip/${d.id}`);
    } catch {
      setServerErr(t("error_general") ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-lg border border-border">
        {[
          { label: t("mode_know"), active: !aiMode, onClick: () => setAiMode(false) },
          { label: t("mode_help"), active: aiMode,  onClick: () => { setAiMode(true); set("province",""); }, icon: Wand2 },
        ].map(({ label, active, onClick, icon: Icon }) => (
          <button
            key={label} type="button" onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
              active
                ? aiMode === (Icon !== undefined)
                  ? "bg-primary-red/10 text-primary-red border border-primary-red/20"
                  : "bg-surface-3 text-ink border border-border-strong"
                : "text-ink-subtle hover:text-ink"
            }`}
          >
            {Icon && <Icon size={12} />}
            {label}
          </button>
        ))}
      </div>

      {/* Province */}
      {!aiMode && (
        <div>
          <label htmlFor="province" className={LABEL}>
            <span className="flex items-center gap-1"><MapPin size={10} />{t("form_province_label")} *</span>
          </label>
          <select
            id="province" value={form.province}
            onChange={e => set("province", e.target.value)}
            className="input-dark appearance-none cursor-pointer"
            disabled={loadingP}
          >
            <option value="">{loadingP ? t("form_loading_provinces") : t("form_province_placeholder")}</option>
            {provinces.map(p => <option key={p} value={p}>{PROVINCE_NAMES_EN[p] ?? p}</option>)}
          </select>
          {errors.province && <p className={ERR}><AlertCircle size={11} />{errors.province}</p>}
        </div>
      )}

      {/* Days + Budget */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="days" className={LABEL}>
            <span className="flex items-center gap-1"><Calendar size={10} />{t("form_days_label")} *</span>
          </label>
          <input id="days" type="number" min={1} max={14} value={form.days}
            onChange={e => set("days", Number(e.target.value))} className="input-dark" />
          {errors.days && <p className={ERR}><AlertCircle size={11} />{errors.days}</p>}
        </div>
        <div>
          <label htmlFor="budget" className={LABEL}>
            <span className="flex items-center gap-1"><Wallet size={10} />{t("form_budget_label")} *</span>
          </label>
          <input id="budget" type="number" min={500} step={500} value={form.budget}
            onChange={e => set("budget", Number(e.target.value))} className="input-dark" />
          {errors.budget && <p className={ERR}><AlertCircle size={11} />{errors.budget}</p>}
        </div>
      </div>

      {/* Travelers */}
      <div>
        <label htmlFor="travelers" className={LABEL}>
          <span className="flex items-center gap-1"><Users size={10} />{t("form_travelers_label")}</span>
        </label>
        <input id="travelers" type="number" min={1} max={20} value={form.travelers}
          onChange={e => set("travelers", Number(e.target.value))}
          className="input-dark max-w-[120px]" />
      </div>

      <hr className="divider-line" />

      {/* Style */}
      <div>
        <p className={LABEL}>{t("form_style_label")} *</p>
        <div className="flex flex-wrap gap-1.5">
          {STYLES.map(({ value, label }) => {
            const on = form.style.includes(value);
            return (
              <button
                key={value} type="button" onClick={() => toggleStyle(value)} aria-pressed={on}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  on
                    ? "bg-primary-red/10 text-primary-red border-primary-red/25"
                    : "bg-surface-3 text-ink-muted border-border hover:border-border-strong hover:text-ink"
                }`}
              >
                {(t(`form_style_${value}` as any) as string) || label}
              </button>
            );
          })}
        </div>
        {errors.style && <p className={`${ERR} mt-2`}><AlertCircle size={11} />{errors.style}</p>}
      </div>

      {/* Preferences */}
      <div>
        <label htmlFor="preferences" className="flex justify-between items-center mb-1.5">
          <span className={LABEL.replace("mb-1.5","")}>
            {aiMode ? t("form_preferences_label_ai") : t("form_preferences_label")}
          </span>
          {aiMode && (
            <span className="text-[9px] text-primary-red bg-primary-red/8 border border-primary-red/15 px-2 py-0.5 rounded-full font-bold">
              {t("form_ai_picks_province")}
            </span>
          )}
        </label>
        <textarea
          id="preferences" rows={3} value={form.preferences}
          onChange={e => set("preferences", e.target.value)}
          placeholder={t("form_preferences_placeholder")}
          className="input-dark resize-y"
        />
      </div>

      {/* Server error */}
      {serverErr && (
        <div role="alert" className="p-3.5 rounded-lg bg-primary-red/5 border border-primary-red/15 text-primary-red text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={13} />{serverErr}
        </div>
      )}

      {/* Submit */}
      <button
        id="plan-submit" type="submit" disabled={loading}
        className="w-full py-3.5 bg-primary-red hover:bg-secondary-red text-white font-bold rounded-lg glow-red-sm transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:pointer-events-none"
        aria-busy={loading}
      >
        {loading
          ? <><Loader size={15} className="animate-spin" />{t("form_submitting")}</>
          : <>{t("form_submit")}<ChevronRight size={15} /></>
        }
      </button>
    </form>
  );
}
