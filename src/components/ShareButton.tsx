"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLanguage } from "@/src/lib/useLanguage";

export default function ShareButton() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API may not be available in all environments
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={t("trip_share")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 1.25rem",
        borderRadius: "0.75rem",
        border: "1px solid rgba(217, 4, 41, 0.35)",
        background: copied ? "rgba(217, 4, 41, 0.12)" : "transparent",
        color: "#d90429",
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {copied ? (
        <>
          <Check size={16} aria-hidden="true" />
          {t("trip_share_copied")}
        </>
      ) : (
        <>
          <Copy size={16} aria-hidden="true" />
          {t("trip_share")}
        </>
      )}
    </button>
  );
}
