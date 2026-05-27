"use client";

import Image from "next/image";
import { ArrowRight, Map, Zap, Star, MapPin, Users, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from "@/src/i18n/routing";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function HomePage() {
  const t = useTranslations('hero');
  const tHome = useTranslations('home');

  const HOW_IT_WORKS = [
    {
      step: "1",
      title: tHome("step1_title"),
      description: tHome("step1_desc"),
      icon: Map,
      color: "var(--color-primary-red)",
    },
    {
      step: "2",
      title: tHome("step2_title"),
      description: tHome("step2_desc"),
      icon: Sparkles,
      color: "var(--color-secondary-red)",
    },
    {
      step: "3",
      title: tHome("step3_title"),
      description: tHome("step3_desc"),
      icon: Star,
      color: "#EF4444", // primary red
    },
  ];

  const POPULAR_PROVINCES = [
    { name: "Chiang Mai", nameTh: "เชียงใหม่", vibe: tHome("vibe_chiang_mai"), image: "/images/light/chiang_mai_light_1779892371034.png" },
    { name: "Phuket", nameTh: "ภูเก็ต", vibe: tHome("vibe_phuket"), image: "/images/light/phuket_light_1779892386681.png" },
    { name: "Bangkok", nameTh: "กรุงเทพฯ", vibe: tHome("vibe_bangkok"), image: "/images/light/bangkok_light_1779892407958.png" },
    { name: "Krabi", nameTh: "กระบี่", vibe: tHome("vibe_krabi"), image: "/images/light/krabi_light_1779892422632.png" },
  ];

  return (
    <div className="bg-surface text-ink overflow-x-hidden font-inter selection:bg-primary-red/30">
      
      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        
        {/* Stunning Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/light/hero_thailand_light_1779892355381.png"
            alt="Thailand Beach"
            fill
            className="object-cover scale-105"
            priority
            sizes="100vw"
            quality={100}
          />
          {/* Bright, warm gradient overlays for light mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-surface/20" />
          <div className="absolute inset-0 bg-primary-red/5 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-20 max-w-5xl mx-auto text-center px-4"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur-xl border border-red-500/20 rounded-full text-primary-red text-sm font-bold tracking-widest uppercase mb-8 shadow-xl shadow-red-500/10"
          >
            <Sparkles size={14} className="text-primary-red" />
            <span className="bg-gradient-to-r from-primary-red to-rose-500 bg-clip-text text-transparent">
              {t('badge')}
            </span>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="font-inter font-extrabold text-[clamp(3rem,8vw,6.5rem)] text-ink leading-[1.1] mb-6 drop-shadow-sm"
          >
            {t('headline').split(',')[0]},<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-rose-500 relative inline-block">
              {t('headline').split(',')[1] || "planned in seconds."}
            </span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-[clamp(1.1rem,2vw,1.4rem)] text-ink-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {t('subheadline')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/plan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-red to-rose-500 hover:from-rose-500 hover:to-primary-red text-white font-bold rounded-2xl shadow-xl shadow-red-500/30 transition-all hover:-translate-y-1 active:scale-95 text-lg group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-[150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              <span>{t('cta')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/places"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/80 hover:bg-white backdrop-blur-xl border border-red-500/20 text-primary-red font-bold rounded-2xl shadow-lg shadow-red-500/5 transition-all hover:-translate-y-1 active:scale-95 text-lg group"
            >
              <span>{t('browse')}</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 md:mb-24 relative z-10"
        >
          <motion.h2
            variants={itemVariants}
            className="font-inter font-extrabold text-[clamp(2.5rem,5vw,4rem)] text-ink leading-tight mb-6"
          >
            {tHome('how_it_works_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-rose-500">{tHome('how_it_works_title_highlight')}</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-ink-secondary max-w-2xl mx-auto font-medium">
            {tHome('how_it_works_subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
        >
          {HOW_IT_WORKS.map(({ step, title, description, icon: Icon, color }) => (
            <motion.div
              key={step}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-[2rem] p-10 shadow-xl shadow-red-900/5 border border-red-100 relative overflow-hidden group transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" style={{ background: `linear-gradient(to bottom right, ${color}10, transparent)` }} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-8 shadow-inner group-hover:border-red-200 transition-colors duration-500">
                  <Icon size={28} className="text-primary-red" />
                </div>
                
                <div className="absolute top-8 right-8 text-[8rem] font-black text-ink/5 leading-none select-none pointer-events-none group-hover:text-primary-red/5 transition-colors duration-500">
                  {step}
                </div>

                <h3 className="font-inter font-bold text-2xl text-ink mb-4">{title}</h3>
                <p className="text-ink-secondary text-lg leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── POPULAR PROVINCES ── */}
      <section className="relative px-4 py-24 md:py-32 bg-surface-2 border-t border-red-100 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div>
              <motion.h2
                variants={itemVariants}
                className="font-inter font-extrabold text-[clamp(2.5rem,5vw,4rem)] text-ink leading-tight mb-4"
              >
                {tHome('dest_title')} <span className="text-primary-red">{tHome('dest_title_highlight')}</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-ink-secondary max-w-xl">
                {tHome('dest_subtitle')}
              </motion.p>
            </div>
            <motion.div variants={itemVariants}>
              <Link
                href="/places"
                className="inline-flex items-center gap-2 text-primary-red hover:text-rose-600 font-bold text-lg transition-colors group bg-white px-6 py-3 rounded-full shadow-md shadow-red-900/5"
              >
                {tHome('dest_see_all')}
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {POPULAR_PROVINCES.map((prov) => (
              <motion.div
                key={prov.name}
                variants={itemVariants}
                className="group relative h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-red-900/10"
              >
                <Image
                  src={prov.image}
                  alt={prov.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 transition-opacity duration-500" />
                <div className="absolute inset-0 border border-white/20 rounded-[2rem] group-hover:border-primary-red transition-colors duration-500 z-10" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <div className="text-rose-300 font-bold text-sm tracking-widest uppercase mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {prov.vibe}
                  </div>
                  <h3 className="font-inter font-bold text-3xl text-white mb-1 drop-shadow-lg group-hover:-translate-y-1 transition-transform duration-500">
                    {prov.name}
                  </h3>
                  <div className="text-white/80 font-sans text-xl group-hover:-translate-y-1 transition-transform duration-500 delay-75">
                    {prov.nameTh}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative px-4 py-32 overflow-hidden bg-gradient-to-b from-surface to-surface-2">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="w-24 h-24 bg-white rounded-3xl mx-auto flex items-center justify-center border border-red-100 mb-8 shadow-xl shadow-red-900/5">
            <Sparkles size={40} className="text-primary-red" />
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="font-inter font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] text-ink mb-8 leading-tight"
          >
            {tHome('cta_title')}<br />{tHome('cta_title2')}
          </motion.h2>
          
          <motion.div variants={itemVariants}>
            <Link
              href="/plan"
              className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-primary-red to-rose-500 hover:from-rose-500 hover:to-primary-red text-white font-bold rounded-2xl shadow-2xl shadow-red-500/20 transition-all hover:-translate-y-2 hover:scale-105 active:scale-95 text-xl group"
            >
              {tHome('cta_button')}
              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
