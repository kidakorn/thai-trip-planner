"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AnimatedPlacesHero() {
  const t = useTranslations("places");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative z-10 text-center px-6 pt-14"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary-red/8 border border-primary-red/20 rounded-full text-primary-red text-[11px] font-semibold tracking-[0.15em] uppercase mb-5"
      >
        <MapPin size={10} />
        {t("hero_badge")}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="font-black text-[clamp(2rem,4.5vw,3.5rem)] text-ink leading-tight mb-2"
      >
        {t("hero_title")}{" "}
        <span className="text-gradient-red">{t("hero_title_highlight")}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-ink-muted text-sm max-w-md mx-auto"
      >
        {t("hero_desc")}
      </motion.p>
    </motion.div>
  );
}
