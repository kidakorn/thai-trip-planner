"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Map, CheckCircle2, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserGuide() {
  const [active, setActive] = useState(0);
  const tHome = useTranslations("home");

  const steps = [
    {
      id:    "preferences",
      title: tHome("step1_title"),
      desc:  tHome("step1_desc"),
      icon:  MapPin,
      color: "#f97316",
      ring:  "border-orange-500/20 bg-orange-500/8",
      text:  "text-orange-400",
      bar:   "#f97316",
    },
    {
      id:    "ai",
      title: tHome("step2_title"),
      desc:  tHome("step2_desc"),
      icon:  Sparkles,
      color: "#D90429",
      ring:  "border-primary-red/20 bg-primary-red/8",
      text:  "text-primary-red",
      bar:   "#D90429",
    },
    {
      id:    "map",
      title: tHome("step3_title"),
      desc:  tHome("step3_desc"),
      icon:  Map,
      color: "#10b981",
      ring:  "border-emerald-500/20 bg-emerald-500/8",
      text:  "text-emerald-400",
      bar:   "#10b981",
    },
  ];

  const step = steps[active];

  return (
    <section className="bg-surface-2 border-t border-border px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label">How it works</p>
          <h2 className="font-black text-[clamp(1.8rem,3.5vw,3rem)] text-ink leading-tight mb-2">
            See it in <span className="text-gradient-red">action</span>
          </h2>
          <p className="text-ink-muted text-sm max-w-sm mx-auto">
            From preferences to a full itinerary in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 items-start">

          {/* Left — step nav */}
          <div className="flex flex-col gap-2.5">
            {steps.map((s, idx) => {
              const isActive = active === idx;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(idx)}
                  className={`text-left px-5 py-5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? `bg-surface-3 ${s.ring.split(" ")[0]}`
                      : "bg-transparent border-transparent hover:bg-surface-3/50 hover:border-border"
                  }`}
                >
                  {/* Active bar */}
                  {isActive && (
                    <motion.div
                      layoutId="step-bar"
                      className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                      style={{ backgroundColor: s.bar }}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                      isActive ? `${s.ring}` : "border-border bg-surface-3 text-ink-subtle"
                    }`}>
                      <Icon size={17} className={isActive ? s.text : ""} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className={`text-[9px] font-black tracking-widest uppercase ${isActive ? s.text : "text-ink-subtle"}`}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className={`font-bold text-sm ${isActive ? "text-ink" : "text-ink-muted"}`}>
                          {s.title}
                        </span>
                      </div>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="text-ink-muted text-xs leading-relaxed overflow-hidden"
                          >
                            {s.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right — mockup window */}
          <div className="relative">
            <div className="bg-surface-3 border border-border rounded-xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2">
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map(c => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="ml-3 h-5 bg-surface rounded border border-border max-w-[180px] w-full flex items-center px-2.5">
                  <span className="text-[10px] text-ink-subtle truncate">thaitrip.ai/plan</span>
                </div>
              </div>

              {/* Mockup content */}
              <div className="p-7 min-h-[260px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    {/* Step 0 — Form */}
                    {active === 0 && (
                      <div className="max-w-xs mx-auto space-y-3.5">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-ink-subtle mb-1.5">Destination</p>
                          <div className="h-9 bg-surface-2 border border-border rounded-lg flex items-center px-3 gap-2.5">
                            <MapPin size={12} className="text-primary-red" />
                            <span className="text-xs text-ink-muted">Chiang Mai</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {[["Days","5"],["Budget","฿10,000"]].map(([l,v]) => (
                            <div key={l}>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-ink-subtle mb-1.5">{l}</p>
                              <div className="h-9 bg-surface-2 border border-border rounded-lg flex items-center px-3 text-xs text-ink-muted">{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Culture","Food","Nature"].map((s, i) => (
                            <span key={s} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${i < 2 ? "bg-primary-red/10 text-primary-red border-primary-red/20" : "bg-surface-2 border-border text-ink-subtle"}`}>{s}</span>
                          ))}
                        </div>
                        <div className="h-9 bg-primary-red rounded-lg flex items-center justify-center gap-1.5 mt-1">
                          <span className="text-white text-xs font-bold">Generate Plan</span>
                          <ChevronRight size={13} className="text-white" />
                        </div>
                      </div>
                    )}

                    {/* Step 1 — AI processing */}
                    {active === 1 && (
                      <div className="text-center space-y-5">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-14 h-14 mx-auto rounded-full border-2 border-t-primary-red border-r-primary-red/30 border-b-border border-l-border"
                        />
                        <div>
                          <p className="text-sm font-bold text-ink mb-1">Building your itinerary</p>
                          <p className="text-xs text-ink-muted">Analyzing routes, costs, and venues...</p>
                        </div>
                        <div className="bg-surface-2 border border-border rounded-lg p-3.5 text-left space-y-2.5 max-w-xs mx-auto">
                          {["Selecting top hotels","Mapping attractions","Optimising budget"].map(item => (
                            <div key={item} className="flex items-center gap-2.5">
                              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                              <span className="text-xs text-ink-muted">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2 — Map */}
                    {active === 2 && (
                      <div className="max-w-xs mx-auto">
                        <div className="h-40 bg-surface-2 border border-border rounded-lg relative overflow-hidden flex items-center justify-center mb-3.5">
                          <div className="absolute inset-0 opacity-[0.06]"
                            style={{ backgroundImage: "linear-gradient(rgba(217,4,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(217,4,41,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                          />
                          <svg className="absolute inset-0 w-full h-full">
                            <path d="M 50 130 Q 130 70 200 100 T 310 60" fill="none" stroke="#D90429" strokeWidth="1.5" strokeDasharray="4 4" />
                          </svg>
                          {([[50, 130, 1], [200, 100, 2], [310, 60, 3]] as [number, number, number][]).map(([x, y, n]) => (
                            <div key={n} className="absolute w-6 h-6 rounded-full bg-primary-red border-2 border-white/20 shadow-lg flex items-center justify-center text-white text-[9px] font-black"
                              style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
                              {n}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["Doi Suthep","Nimman Rd","Night Bazaar"].map((place, i) => (
                            <div key={place} className="bg-surface-2 border border-border rounded-lg p-2 text-center">
                              <div className="w-4 h-4 rounded-full bg-primary-red text-white text-[8px] font-black flex items-center justify-center mx-auto mb-1">{i+1}</div>
                              <p className="text-[9px] font-semibold text-ink-muted truncate">{place}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating confirm badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 -bottom-4 bg-surface-3 border border-border rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[8px] text-ink-subtle font-bold uppercase tracking-wide">Ready</p>
                <p className="text-[11px] font-bold text-ink leading-tight">Plan confirmed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
