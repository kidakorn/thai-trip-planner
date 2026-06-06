"use client";

import { Menu, X, Globe, Home, MapPin, Compass, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from "@/src/i18n/routing";

/** Bespoke SVG mark — a stylised temple spire inside a map-pin */
function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="16" cy="16" r="15" fill="#0e1018" stroke="#1c1f2e" strokeWidth="1" />

      {/* Map-pin shape (filled red) */}
      <path
        d="M16 5C12.134 5 9 8.134 9 12C9 17.25 16 27 16 27C16 27 23 17.25 23 12C23 8.134 19.866 5 16 5Z"
        fill="#D90429"
        opacity="0.15"
      />
      <path
        d="M16 5C12.134 5 9 8.134 9 12C9 17.25 16 27 16 27C16 27 23 17.25 23 12C23 8.134 19.866 5 16 5Z"
        stroke="#D90429"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Thai temple spire (tiered) inside the pin */}
      {/* Base tier */}
      <rect x="13" y="14" width="6" height="1.4" rx="0.4" fill="#D90429" />
      {/* Middle tier */}
      <rect x="13.8" y="12" width="4.4" height="1.4" rx="0.4" fill="#D90429" />
      {/* Top tier */}
      <rect x="14.6" y="10" width="2.8" height="1.4" rx="0.4" fill="#D90429" />
      {/* Spire tip */}
      <line x1="16" y1="10" x2="16" y2="8.5" stroke="#D90429" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/",       label: t("home"),   icon: Home },
    { href: "/plan",   label: t("plan"),   icon: MapPin },
    { href: "/places", label: t("places"), icon: Compass },
  ];

  const toggleLang = () =>
    router.replace(pathname, { locale: locale === 'en' ? 'th' : 'en' });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 ${scrolled ? "top-3" : "top-5"}`}
      >
        <div
          className={`w-full max-w-5xl flex items-center justify-between px-4 md:px-5 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-surface-3/96 backdrop-blur-2xl border border-border-strong shadow-2xl shadow-black/50"
              : "bg-surface-3/75 backdrop-blur-xl border border-border"
          }`}
        >

          {/* ── Logo / Wordmark ── */}
          <Link href="/" className="flex items-center gap-2.5 no-underline select-none shrink-0" aria-label="ThaiTrip home">
            <BrandMark size={30} />
            <span className="hidden sm:flex items-baseline gap-0 font-inter font-bold text-[15px] tracking-tight text-ink leading-none">
              Thai
              <span className="text-primary-red">Trip</span>
              <span className="ml-1 text-[9px] font-semibold text-ink-subtle tracking-widest uppercase leading-none self-end mb-0.5">
                AI
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-px" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive(href)
                    ? "bg-primary-red/10 text-primary-red font-semibold"
                    : "text-ink-muted hover:text-ink hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-border-strong mx-2.5" />

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              aria-label={`Switch language, currently ${locale === 'en' ? 'English' : 'Thai'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-ink-muted hover:text-ink hover:bg-white/5 transition-all"
            >
              <Globe size={13} strokeWidth={1.75} />
              <span className="text-[11px] font-bold tracking-wider">{locale.toUpperCase()}</span>
            </button>

            {/* CTA */}
            <Link
              href="/plan"
              className="ml-1.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary-red hover:bg-secondary-red text-white text-[13px] font-semibold transition-all hover:shadow-md hover:shadow-primary-red/25 group"
            >
              {t("plan")}
              <ChevronRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-ink-muted hover:bg-white/10 border border-border transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={17} strokeWidth={2} /> : <Menu size={17} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface/98 backdrop-blur-2xl px-5 pt-24 pb-8 flex flex-col gap-2"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Brand in drawer */}
          <div className="flex items-center gap-2.5 mb-4 px-1">
            <BrandMark size={28} />
            <span className="font-inter font-bold text-sm text-ink">
              Thai<span className="text-primary-red">Trip</span>
              <span className="ml-1 text-[9px] font-semibold text-ink-subtle tracking-widest uppercase">AI</span>
            </span>
          </div>

          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-colors ${
                isActive(href)
                  ? "bg-primary-red/10 text-primary-red border border-primary-red/15"
                  : "bg-surface-3 text-ink border border-border hover:border-border-strong"
              }`}
            >
              <Icon size={16} className={isActive(href) ? "text-primary-red" : "text-ink-muted"} />
              {label}
            </Link>
          ))}

          <button
            onClick={() => { toggleLang(); setMobileOpen(false); }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-3 text-ink font-medium text-sm border border-border mt-1"
          >
            <Globe size={16} className="text-ink-muted" />
            {locale === "en" ? "Switch to Thai" : "เปลี่ยนเป็นภาษาอังกฤษ"}
          </button>
        </div>
      )}
    </>
  );
}
