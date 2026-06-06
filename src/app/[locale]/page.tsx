"use client";

import Image from "next/image";
import { ArrowRight, Map, Sparkles, Star, Globe2, Terminal, Shield, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from "@/src/i18n/routing";
import UserGuide from "@/src/components/UserGuide";

const fade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const t = useTranslations('hero');
  const tHome = useTranslations('home');

  const STEPS = [
    { step: "01", title: tHome("step1_title"), desc: tHome("step1_desc"), icon: Map },
    { step: "02", title: tHome("step2_title"), desc: tHome("step2_desc"), icon: Sparkles },
    { step: "03", title: tHome("step3_title"), desc: tHome("step3_desc"), icon: Star },
  ];

  const PROVINCES = [
    { name: "Chiang Mai", nameTh: "เชียงใหม่", vibe: tHome("vibe_chiang_mai"), img: "/images/light/chiang_mai_light_1779892371034.png" },
    { name: "Phuket",     nameTh: "ภูเก็ต",     vibe: tHome("vibe_phuket"),     img: "/images/light/phuket_light_1779892386681.png" },
    { name: "Bangkok",    nameTh: "กรุงเทพฯ",   vibe: tHome("vibe_bangkok"),    img: "/images/light/bangkok_light_1779892407958.png" },
    { name: "Krabi",      nameTh: "กระบี่",     vibe: tHome("vibe_krabi"),      img: "/images/light/krabi_light_1779892422632.png" },
  ];

  const STATS = [
    { value: "77",    label: "Thai Provinces", icon: Globe2 },
    { value: "AI",    label: "Vertex Powered", icon: Terminal },
    { value: "Free",  label: "Always Free",    icon: Shield },
  ];

  return (
    <div className="bg-surface text-ink overflow-x-hidden font-inter">

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/light/hero_thailand_light_1779892355381.png"
            alt=""
            fill
            className="object-cover opacity-[0.07] scale-105"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface to-surface" />
          {/* Dot grid */}
          <div className="absolute inset-0 dot-grid opacity-100" />
          {/* Glow */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary-red/6 rounded-full blur-[130px]" />
        </div>

        {/* Content */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          {/* Badge */}
          <motion.span variants={fade}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary-red/8 border border-primary-red/20 rounded-full text-primary-red text-[11px] font-semibold tracking-[0.15em] uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-red animate-pulse" />
            {t('badge')}
          </motion.span>

          {/* Headline */}
          <motion.h1 variants={fade}
            className="font-black text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1.06] tracking-tight text-ink mb-5"
          >
            {t('headline').split(',')[0]},<br />
            <span className="text-gradient-red">
              {t('headline').split(',')[1]?.trim() || "planned in seconds."}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={fade}
            className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/plan"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-primary-red hover:bg-secondary-red text-white text-sm font-bold rounded-lg glow-red-sm transition-all hover:-translate-y-0.5 active:scale-95 overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full skew-x-[-12deg] group-hover:translate-x-full transition-transform duration-500" />
              {t('cta')}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/places"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-transparent hover:bg-white/5 border border-border-strong text-ink-muted hover:text-ink text-sm font-semibold rounded-lg transition-all w-full sm:w-auto"
            >
              {t('browse')}
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div variants={fade}
            className="mt-14 inline-flex divide-x divide-border-strong border border-border rounded-xl overflow-hidden bg-surface-3"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 px-6 py-3.5">
                <Icon size={14} className="text-primary-red shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-black text-ink leading-none">{value}</p>
                  <p className="text-[10px] text-ink-subtle mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fade} className="section-label">Process</motion.p>
          <motion.h2 variants={fade}
            className="font-black text-[clamp(1.8rem,3.5vw,3rem)] text-ink leading-tight mb-3"
          >
            {tHome('how_it_works_title')}{" "}
            <span className="text-gradient-red">{tHome('how_it_works_title_highlight')}</span>
          </motion.h2>
          <motion.p variants={fade} className="text-ink-muted max-w-md mx-auto text-sm">
            {tHome('how_it_works_subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {STEPS.map(({ step, title, desc, icon: Icon }) => (
            <motion.div key={step} variants={fade} className="card-dark p-7 group relative overflow-hidden">
              <span className="absolute top-5 right-5 font-black text-[4.5rem] leading-none text-white/[0.03] select-none">
                {step}
              </span>
              <div className="w-10 h-10 rounded-lg bg-primary-red/10 border border-primary-red/15 flex items-center justify-center mb-5 group-hover:bg-primary-red/15 transition-colors">
                <Icon size={18} className="text-primary-red" />
              </div>
              <h3 className="font-bold text-base text-ink mb-2">{title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─────────────── USER GUIDE ─────────────── */}
      <UserGuide />

      {/* ─────────────── DESTINATIONS ─────────────── */}
      <section className="px-6 py-20 md:py-28 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          >
            <div>
              <motion.p variants={fade} className="section-label">Destinations</motion.p>
              <motion.h2 variants={fade}
                className="font-black text-[clamp(1.8rem,3.5vw,3rem)] text-ink leading-tight mb-2"
              >
                {tHome('dest_title')}{" "}
                <span className="text-gradient-red">{tHome('dest_title_highlight')}</span>
              </motion.h2>
              <motion.p variants={fade} className="text-ink-muted text-sm max-w-md">
                {tHome('dest_subtitle')}
              </motion.p>
            </div>
            <motion.div variants={fade} className="shrink-0">
              <Link
                href="/places"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm font-semibold transition-colors group"
              >
                {tHome('dest_see_all')}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {PROVINCES.map((prov) => (
              <motion.div
                key={prov.name} variants={fade}
                className="group relative h-72 rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={prov.img} alt={prov.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108 brightness-60 group-hover:brightness-50"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                <div className="absolute inset-0 border border-white/8 rounded-xl group-hover:border-primary-red/30 transition-colors duration-400" />
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <p className="text-primary-red font-semibold text-[10px] tracking-widest uppercase mb-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {prov.vibe}
                  </p>
                  <h3 className="font-bold text-xl text-white leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                    {prov.name}
                  </h3>
                  <p className="text-white/60 text-sm">{prov.nameTh}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="relative px-6 py-24 border-t border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-red/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.div variants={fade} className="h-px w-16 shimmer-line mx-auto mb-8 rounded-full" />

          <motion.h2 variants={fade}
            className="font-black text-[clamp(2rem,4.5vw,3.5rem)] text-ink mb-4 leading-tight"
          >
            {tHome('cta_title')}{" "}
            <span className="text-gradient-red">{tHome('cta_title2')}</span>
          </motion.h2>

          <motion.p variants={fade} className="text-ink-muted text-sm mb-8 max-w-md mx-auto">
            Generate a complete itinerary in seconds — free, no account needed.
          </motion.p>

          <motion.div variants={fade}>
            <Link
              href="/plan"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary-red hover:bg-secondary-red text-white font-bold rounded-lg glow-red-sm transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              {tHome('cta_button')}
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
