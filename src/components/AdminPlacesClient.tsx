"use client";

import { useState } from "react";
import { Place, PlaceSchema, CATEGORIES } from "@/src/lib/types";
import { useLanguage } from "@/src/lib/useLanguage";
import { Plus, Pencil, Trash2, X, Save, AlertTriangle, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface AdminPlacesClientProps {
  initialPlaces: Place[];
}

type FormMode = "idle" | "create" | "edit";

const EMPTY_FORM = {
  name: "",
  name_en: "",
  category: "food" as Place["category"],
  province: "",
  district: "",
  address: "",
  lat: 0,
  lng: 0,
  price_range: 1,
  description: "",
  description_en: "",
  description_en: "",
  images: [] as string[],
  affiliate_url: "",
  is_published: true,
};

export default function AdminPlacesClient({ initialPlaces }: AdminPlacesClientProps) {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [mode, setMode] = useState<FormMode>("idle");
  const [editTarget, setEditTarget] = useState<Place | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setEditTarget(null);
    setMode("create");
    setFormError(null);
  };

  const openEdit = (place: Place) => {
    setFormData({
      name: place.name,
      name_en: place.name_en ?? "",
      category: place.category,
      province: place.province,
      district: place.district ?? "",
      address: place.address ?? "",
      lat: place.lat,
      lng: place.lng,
      price_range: place.price_range ?? 1,
      description: place.description ?? "",
      description: place.description ?? "",
      description_en: place.description_en ?? "",
      images: place.images ?? [],
      affiliate_url: place.affiliate_url ?? "",
      is_published: place.is_published,
    });
    setEditTarget(place);
    setMode("edit");
    setFormError(null);
  };

  const closeForm = () => {
    setMode("idle");
    setEditTarget(null);
    setFormError(null);
  };

  const handleSave = async () => {
    setFormError(null);

    const parsed = PlaceSchema.safeParse({
      ...formData,
      price_range: Number(formData.price_range),
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      vibe: [],
      open_hours: {},
    });

    if (!parsed.success) {
      const firstErr = Object.values(parsed.error.flatten().fieldErrors)[0];
      setFormError(firstErr?.[0] ?? "กรุณาตรวจสอบข้อมูล");
      return;
    }

    setSaving(true);
    try {
      const secret = prompt("Admin secret:");
      if (!secret) return;

      const method = mode === "create" ? "POST" : "PUT";
      const url =
        mode === "create"
          ? "/api/places"
          : `/api/places/${editTarget!.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? t("error_general"));
        return;
      }

      const saved = await res.json();

      if (mode === "create") {
        setPlaces((prev) => [saved as Place, ...prev]);
      } else {
        setPlaces((prev) =>
          prev.map((p) => (p.id === saved.id ? (saved as Place) : p))
        );
      }

      closeForm();
    } catch {
      setFormError(t("error_general"));
    } finally {
      setSaving(false);
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `places/${fileName}`;

      const { data, error } = await supabase.storage
        .from("places")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("places")
        .getPublicUrl(data.path);

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), publicUrlData.publicUrl],
      }));
    } catch (err: any) {
      setFormError(err.message || "Failed to upload image. Did you setup Supabase Storage?");
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (place: Place) => {
    if (!confirm(`ลบ "${place.name}"?`)) return;

    const secret = prompt("Admin secret:");
    if (!secret) return;

    const res = await fetch(`/api/places/${place.id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });

    if (res.ok) {
      setPlaces((prev) => prev.filter((p) => p.id !== place.id));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: "0.5rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#edf2f4",
    fontSize: "0.88rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#8d99ae",
    marginBottom: "0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#edf2f4",
          }}
        >
          {t("admin_title")}
          <span
            style={{
              marginLeft: "0.75rem",
              fontSize: "0.85rem",
              fontWeight: 400,
              color: "#8d99ae",
            }}
          >
            ({places.length})
          </span>
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary-custom"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1.25rem",
            fontSize: "0.9rem",
          }}
          aria-label={t("admin_add")}
        >
          <Plus size={16} aria-hidden="true" />
          {t("admin_add")}
        </button>
      </div>

      {/* Inline form */}
      {mode !== "idle" && (
        <div
          className="card-glass"
          style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
          role="dialog"
          aria-label={mode === "create" ? t("admin_add") : t("admin_edit")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#edf2f4" }}>
              {mode === "create" ? t("admin_add") : t("admin_edit")}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              aria-label={t("admin_cancel")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8d99ae" }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="admin-name" style={labelStyle}>{t("admin_name_label")}</label>
              <input
                id="admin-name"
                style={inputStyle}
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="admin-name-en" style={labelStyle}>{t("admin_name_en_label")}</label>
              <input
                id="admin-name-en"
                style={inputStyle}
                value={formData.name_en}
                onChange={(e) => setFormData((p) => ({ ...p, name_en: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="admin-category" style={labelStyle}>{t("admin_category_label")}</label>
              <select
                id="admin-category"
                style={{ ...inputStyle, cursor: "pointer" }}
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    category: e.target.value as Place["category"],
                  }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="admin-province" style={labelStyle}>{t("admin_province_label")}</label>
              <input
                id="admin-province"
                style={inputStyle}
                value={formData.province}
                onChange={(e) => setFormData((p) => ({ ...p, province: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="admin-lat" style={labelStyle}>{t("admin_lat_label")}</label>
              <input
                id="admin-lat"
                type="number"
                step="any"
                style={inputStyle}
                value={formData.lat}
                onChange={(e) => setFormData((p) => ({ ...p, lat: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label htmlFor="admin-lng" style={labelStyle}>{t("admin_lng_label")}</label>
              <input
                id="admin-lng"
                type="number"
                step="any"
                style={inputStyle}
                value={formData.lng}
                onChange={(e) => setFormData((p) => ({ ...p, lng: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label htmlFor="admin-affiliate" style={labelStyle}>{t("admin_affiliate_label")}</label>
              <input
                id="admin-affiliate"
                style={inputStyle}
                value={formData.affiliate_url}
                onChange={(e) => setFormData((p) => ({ ...p, affiliate_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="admin-price" style={labelStyle}>Price Range (1-3)</label>
              <input
                id="admin-price"
                type="number"
                min={1}
                max={3}
                style={inputStyle}
                value={formData.price_range}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, price_range: Number(e.target.value) }))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="admin-description" style={labelStyle}>Description (TH)</label>
              <textarea
                id="admin-description"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Images</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                {formData.images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "0.5rem", overflow: "hidden" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                      style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", border: "none", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label style={{ width: "80px", height: "80px", borderRadius: "0.5rem", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8d99ae", background: "rgba(255,255,255,0.02)" }}>
                  {uploading ? <span style={{ fontSize: "10px" }}>Up...</span> : <Upload size={20} />}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          {formError && (
            <div
              role="alert"
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.5rem",
                background: "rgba(239, 35, 60, 0.08)",
                border: "1px solid rgba(239, 35, 60, 0.3)",
                color: "#ef233c",
                fontSize: "0.85rem",
              }}
            >
              <AlertTriangle size={14} aria-hidden="true" />
              {formError}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary-custom"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              <Save size={15} aria-hidden="true" />
              {saving ? "..." : t("admin_save")}
            </button>
            <button
              type="button"
              onClick={closeForm}
              style={{
                padding: "0.55rem 1.25rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#8d99ae",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {t("admin_cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Places table */}
      <div
        className="card-glass"
        style={{ overflow: "hidden" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {["Image", "Name", "Category", "Province", "Published", "Actions"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#8d99ae",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr
                key={place.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.15s",
                }}
              >
                <td style={{ padding: "0.75rem 1rem", width: "60px" }}>
                  {place.images?.[0] ? (
                    <img src={place.images[0]} alt="" style={{ width: "40px", height: "40px", borderRadius: "0.4rem", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "0.4rem", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8d99ae" }}>
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.88rem", color: "#edf2f4", fontWeight: 600 }}>
                  {place.name}
                  {place.name_en && (
                    <div style={{ fontSize: "0.75rem", color: "#8d99ae", fontWeight: 400 }}>
                      {place.name_en}
                    </div>
                  )}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.82rem", color: "#8d99ae" }}>
                  {place.category}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.82rem", color: "#8d99ae" }}>
                  {place.province}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "0.55rem",
                      height: "0.55rem",
                      borderRadius: "999px",
                      background: place.is_published ? "#22c55e" : "#ef4444",
                    }}
                    aria-label={place.is_published ? "Published" : "Unpublished"}
                  />
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => openEdit(place)}
                      aria-label={`Edit ${place.name}`}
                      style={{
                        padding: "0.35rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "transparent",
                        color: "#8d99ae",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(place)}
                      aria-label={`Delete ${place.name}`}
                      style={{
                        padding: "0.35rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: "1px solid rgba(239,35,60,0.25)",
                        background: "rgba(239,35,60,0.05)",
                        color: "#ef233c",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {places.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "3rem", textAlign: "center", color: "#8d99ae", fontSize: "0.9rem" }}
                >
                  No places yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
