"use client";

import Image from "next/image";
import { Menu, X, Globe, Home, MapPin, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from "@/src/i18n/routing";

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/plan", label: t("plan"), icon: MapPin },
    { href: "/places", label: t("places"), icon: Compass },
  ];

  const toggleLang = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 px-4 ${
          scrolled ? "top-4" : "top-6"
        }`}
      >
        <div
          className={`max-w-5xl mx-auto h-18 flex items-center justify-between rounded-full px-3 md:px-6 border border-red-100 transition-shadow duration-300 ${
            scrolled 
              ? "bg-white/90 backdrop-blur-xl shadow-md shadow-red-900/5" 
              : "bg-white/70 backdrop-blur-md shadow-sm shadow-red-900/5"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="ThaiTrip" width={40} height={40} className="object-cover" />
            </div>
            <span className="font-sans text-2xl text-ink font-bold tracking-tight hidden sm:block">
              Thai<span className="text-primary-red">Trip</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`px-5 py-2.5 rounded-full text-sm font-sans font-bold transition-all ${
                  isActive(href)
                    ? "bg-primary-red/10 text-primary-red"
                    : "text-ink-secondary hover:text-ink hover:bg-red-50"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="w-[1px] h-6 bg-red-100 mx-3" />

            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-ink-secondary text-sm font-bold hover:text-ink hover:bg-red-50 transition-colors"
            >
              <Globe size={16} />
              {locale.toUpperCase()}
            </button>

            <Link href="/plan" className="btn btn-primary bg-primary-red hover:bg-secondary-red text-white border-none rounded-full ml-2 px-6 py-2.5 min-h-0 h-auto text-sm font-bold shadow-lg hover:shadow-primary-red/30 transition-all hover:-translate-y-0.5">
              {t("plan")}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-ink transition-colors hover:bg-red-100 border border-red-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white/98 z-40 px-6 pt-32 pb-6 flex flex-col gap-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-4 p-5 rounded-2xl text-xl font-serif font-bold ${
                isActive(href)
                  ? "bg-primary-red/10 text-primary-red"
                  : "bg-red-50 text-ink"
              }`}
            >
              <Icon size={24} className={isActive(href) ? "text-primary-red" : "text-ink-muted"} />
              {label}
            </Link>
          ))}

          <button
            onClick={() => { toggleLang(); setMobileOpen(false); }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 text-ink text-xl font-serif font-bold text-left mt-2 border border-red-100"
          >
            <Globe size={24} className="text-ink-muted" />
            {locale === "en" ? "Switch to Thai" : "Switch to English"}
          </button>
        </div>
      )}
    </>
  );
}
