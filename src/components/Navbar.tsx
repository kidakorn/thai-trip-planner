"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Home, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/src/lib/useLanguage";

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav_home"), icon: Home },
    { href: "/plan", label: t("nav_plan"), icon: Map },
    { href: "/places", label: t("nav_places"), icon: MapPin },
  ];

  const toggleLang = () => setLang(lang === "th" ? "en" : "th");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(26, 27, 46, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #d90429, #ef233c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Map size={16} color="#fff" aria-hidden="true" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #d90429, #ff6b6b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thai Trip Planner
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "background 0.2s, color 0.2s",
                color: isActive(href) ? "#d90429" : "#8d99ae",
                background: isActive(href)
                  ? "rgba(217, 4, 41, 0.1)"
                  : "transparent",
              }}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            aria-label={`Switch to ${lang === "th" ? "English" : "Thai"}`}
            style={{
              marginLeft: "0.5rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(217, 4, 41, 0.4)",
              background: "transparent",
              color: "#d90429",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {t("nav_lang_toggle")}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "#edf2f4",
            cursor: "pointer",
            padding: "0.25rem",
          }}
          className="show-mobile"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: 500,
                color: isActive(href) ? "#d90429" : "#edf2f4",
                background: isActive(href)
                  ? "rgba(217, 4, 41, 0.1)"
                  : "transparent",
              }}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              toggleLang();
              setMobileOpen(false);
            }}
            style={{
              alignSelf: "flex-start",
              marginTop: "0.25rem",
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(217, 4, 41, 0.4)",
              background: "transparent",
              color: "#d90429",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {t("nav_lang_toggle")}
          </button>
        </nav>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
