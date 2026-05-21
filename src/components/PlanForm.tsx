"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Wallet, Users, ChevronRight, Loader } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";
import { TripStyle } from "@/src/lib/types";

const THAI_PROVINCES = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ภูเก็ต",
  "เชียงราย",
  "กระบี่",
  "พังงา",
  "สุราษฎร์ธานี",
  "นครราชสีมา",
  "ขอนแก่น",
  "อุดรธานี",
  "อยุธยา",
  "กาญจนบุรี",
  "ประจวบคีรีขันธ์",
  "ชลบุรี",
  "ระยอง",
  "ตราด",
  "สมุย (สุราษฎร์ธานี)",
  "พัทยา (ชลบุรี)",
  "น่าน",
  "แม่ฮ่องสอน",
  "ลำปาง",
  "พิษณุโลก",
  "สุโขทัย",
  "นครสวรรค์",
  "เพชรบุรี",
  "ราชบุรี",
  "ลพบุรี",
  "สระบุรี",
  "นครปฐม",
  "สมุทรสาคร",
];

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

export default function PlanForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

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

    if (!form.province) next.province = t("form_validation_province");
    if (form.days < 1 || form.days > 14) next.days = t("form_validation_days");
    if (form.budget < 500) next.budget = t("form_validation_budget");
    if (form.style.length === 0) next.style = t("form_validation_style");

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
          province: form.province,
          days: form.days,
          budget: form.budget,
          travelers: form.travelers,
          style: form.style,
          preferences: form.preferences || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? t("error_general"));
        return;
      }

      const data = await res.json();
      router.push(`/trip/${data.id}`);
    } catch {
      setServerError(t("error_general"));
    } finally {
      setIsLoading(false);
    }
  };

  const STYLE_KEYS: { value: TripStyle; label: string }[] = [
    { value: "culture", label: t("form_style_culture") },
    { value: "nature", label: t("form_style_nature") },
    { value: "food", label: t("form_style_food") },
    { value: "nightlife", label: t("form_style_nightlife") },
    { value: "relaxation", label: t("form_style_relaxation") },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.65rem 0.9rem",
    borderRadius: "0.5rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#edf2f4",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.4rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#8d99ae",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "0.25rem",
    fontSize: "0.78rem",
    color: "#ef233c",
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Province */}
        <div>
          <label htmlFor="province" style={labelStyle}>
            <MapPin
              size={13}
              style={{ display: "inline", marginRight: "0.3rem" }}
              aria-hidden="true"
            />
            {t("form_province_label")}
          </label>
          <select
            id="province"
            value={form.province}
            onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}
            aria-required="true"
            aria-describedby={errors.province ? "province-error" : undefined}
          >
            <option value="">{t("form_province_placeholder")}</option>
            {THAI_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.province && (
            <p id="province-error" style={errorStyle} role="alert">
              {errors.province}
            </p>
          )}
        </div>

        {/* Days + Budget row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label htmlFor="days" style={labelStyle}>
              <Calendar
                size={13}
                style={{ display: "inline", marginRight: "0.3rem" }}
                aria-hidden="true"
              />
              {t("form_days_label")}
            </label>
            <input
              id="days"
              type="number"
              min={1}
              max={14}
              value={form.days}
              onChange={(e) =>
                setForm((p) => ({ ...p, days: Number(e.target.value) }))
              }
              style={inputStyle}
              aria-required="true"
              aria-describedby={errors.days ? "days-error" : undefined}
            />
            {errors.days && (
              <p id="days-error" style={errorStyle} role="alert">
                {errors.days}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="budget" style={labelStyle}>
              <Wallet
                size={13}
                style={{ display: "inline", marginRight: "0.3rem" }}
                aria-hidden="true"
              />
              {t("form_budget_label")}
            </label>
            <input
              id="budget"
              type="number"
              min={500}
              step={500}
              value={form.budget}
              onChange={(e) =>
                setForm((p) => ({ ...p, budget: Number(e.target.value) }))
              }
              style={inputStyle}
              aria-required="true"
              aria-describedby={errors.budget ? "budget-error" : undefined}
            />
            {errors.budget && (
              <p id="budget-error" style={errorStyle} role="alert">
                {errors.budget}
              </p>
            )}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label htmlFor="travelers" style={labelStyle}>
            <Users
              size={13}
              style={{ display: "inline", marginRight: "0.3rem" }}
              aria-hidden="true"
            />
            {t("form_travelers_label")}
          </label>
          <input
            id="travelers"
            type="number"
            min={1}
            max={20}
            value={form.travelers}
            onChange={(e) =>
              setForm((p) => ({ ...p, travelers: Number(e.target.value) }))
            }
            style={{ ...inputStyle, maxWidth: "10rem" }}
          />
        </div>

        {/* Style selector */}
        <div>
          <p
            id="style-group-label"
            style={labelStyle}
            aria-hidden="false"
          >
            {t("form_style_label")}
          </p>
          <div
            role="group"
            aria-labelledby="style-group-label"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
          >
            {STYLE_KEYS.map(({ value, label }) => {
              const selected = form.style.includes(value);
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleStyle(value)}
                  aria-pressed={selected}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "999px",
                    border: `1px solid ${selected ? "#d90429" : "rgba(255,255,255,0.12)"}`,
                    background: selected ? "rgba(217, 4, 41, 0.15)" : "transparent",
                    color: selected ? "#d90429" : "#8d99ae",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.style && (
            <p style={errorStyle} role="alert">
              {errors.style}
            </p>
          )}
        </div>

        {/* Preferences textarea */}
        <div>
          <label htmlFor="preferences" style={labelStyle}>
            {t("form_preferences_label")}
          </label>
          <textarea
            id="preferences"
            rows={3}
            value={form.preferences}
            onChange={(e) =>
              setForm((p) => ({ ...p, preferences: e.target.value }))
            }
            placeholder={t("form_preferences_placeholder")}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Server error */}
        {serverError && (
          <p
            role="alert"
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(239, 35, 60, 0.08)",
              border: "1px solid rgba(239, 35, 60, 0.3)",
              color: "#ef233c",
              fontSize: "0.9rem",
            }}
          >
            {serverError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-custom"
          style={{
            padding: "0.85rem 2rem",
            fontSize: "1rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
          }}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="spin" aria-hidden="true" />
              {t("form_submitting")}
            </>
          ) : (
            <>
              {t("form_submit")}
              <ChevronRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
