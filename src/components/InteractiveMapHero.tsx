"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";

const PROVINCES = [
  { id: "chiang_rai", name: "Chiang Rai", top: 15, left: 45 },
  { id: "chiang_mai", name: "Chiang Mai", top: 25, left: 40 },
  { id: "khon_kaen", name: "Khon Kaen", top: 35, left: 65 },
  { id: "bangkok", name: "Bangkok", top: 55, left: 50 },
  { id: "chonburi", name: "Chonburi", top: 60, left: 55 },
  { id: "surat_thani", name: "Surat Thani", top: 75, left: 45 },
  { id: "phuket", name: "Phuket", top: 85, left: 40 },
  { id: "krabi", name: "Krabi", top: 85, left: 45 },
];

const CONNECTIONS = [
  ["chiang_rai", "chiang_mai"],
  ["chiang_mai", "bangkok"],
  ["khon_kaen", "bangkok"],
  ["bangkok", "chonburi"],
  ["bangkok", "surat_thani"],
  ["surat_thani", "phuket"],
  ["surat_thani", "krabi"],
];

export default function InteractiveMapHero() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Background dotted grid pattern
  const gridPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`;

  return (
    <div className="absolute inset-0 z-0 bg-dark-bg overflow-hidden flex items-center justify-center">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute w-[200%] h-[200%] pointer-events-none"
        style={{ backgroundImage: gridPattern }}
        animate={{
          x: [0, -20],
          y: [0, -20],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "linear",
        }}
      />

      {/* Map Container - Limits the aspect ratio and coordinates */}
      <div className="relative w-full h-[80%] max-w-4xl mx-auto opacity-40 hover:opacity-100 transition-opacity duration-700">
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {CONNECTIONS.map(([startId, endId], idx) => {
            const start = PROVINCES.find((p) => p.id === startId);
            const end = PROVINCES.find((p) => p.id === endId);
            if (!start || !end) return null;

            const isHovered = hoveredNode === startId || hoveredNode === endId;

            return (
              <motion.line
                key={idx}
                x1={`${start.left}%`}
                y1={`${start.top}%`}
                x2={`${end.left}%`}
                y2={`${end.top}%`}
                stroke={isHovered ? "var(--color-primary-red)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: idx * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {PROVINCES.map((prov, idx) => {
          const isHovered = hoveredNode === prov.id;

          return (
            <motion.div
              key={prov.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ top: `${prov.top}%`, left: `${prov.left}%` }}
              onMouseEnter={() => setHoveredNode(prov.id)}
              onMouseLeave={() => setHoveredNode(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", bounce: 0.5 }}
            >
              {/* Outer Pulse */}
              <motion.div
                className="absolute inset-0 bg-primary-red rounded-full"
                animate={
                  isHovered
                    ? { scale: [1, 2.5], opacity: [0.5, 0] }
                    : { scale: [1, 1.5], opacity: [0.3, 0] }
                }
                transition={{
                  repeat: Infinity,
                  duration: isHovered ? 1.5 : 3,
                  ease: "easeOut",
                }}
              />

              {/* Pin Icon */}
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isHovered ? "bg-primary-red shadow-[0_0_15px_var(--color-primary-red)] scale-125" : "bg-white/20"
                }`}
                style={{ width: isHovered ? "32px" : "12px", height: isHovered ? "32px" : "12px" }}
              >
                {isHovered && <MapPin size={16} className="text-white" />}
              </div>

              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg z-50 pointer-events-none"
                >
                  {prov.name}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dark gradient overlay so the headline still pops */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-transparent pointer-events-none z-0" />
    </div>
  );
}
