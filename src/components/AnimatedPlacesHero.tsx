"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AnimatedPlacesHero() {
  const t = useTranslations("places");
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 text-center px-4 pt-20"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md border border-red-500/20 rounded-full text-primary-red text-xs font-bold tracking-widest uppercase mb-6 shadow-xl shadow-red-500/5"
      >
        <MapPin size={12} className="text-primary-red" />
        <span>{t('hero_badge')}</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-inter font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] text-ink leading-[1.1] mb-4 drop-shadow-sm"
      >
        {t('hero_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-rose-500 relative inline-block">
          {t('hero_title_highlight')}
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-lg md:text-xl text-ink-secondary max-w-2xl mx-auto font-medium"
      >
        {t('hero_desc')}
      </motion.p>
    </motion.div>
  );
}
