import type { Metadata } from "next";
import PlanForm from "@/src/components/PlanForm";
import { Sparkles, Map, Compass, MapPin, Zap, Clock } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Plan a Trip — Thai Trip Planner",
  description:
    "Fill in your preferences and let Gemini AI build a personalized Thailand itinerary instantly.",
};

const PERKS = [
  { icon: Zap, label: "Generated instantly by AI" },
  { icon: MapPin, label: "Interactive maps" },
  { icon: Clock, label: "Smart schedules" },
];

export default function PlanPage() {
  return (
    <div className="bg-surface text-ink min-h-screen pt-20 pb-24 relative overflow-hidden font-inter">
      {/* Premium Background Image */}
      <div className="absolute top-0 left-0 w-full h-[650px] z-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/light/krabi_light_1779892422632.png"
          alt="Plan Trip Thailand"
          fill
          className="object-cover opacity-60 scale-105"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/80 to-surface" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-8">
          
          {/* Left: Info */}
          <div className="pt-6">
            <div className="inline-block px-4 py-2 bg-primary-red/10 rounded-full text-primary-red font-bold text-xs tracking-widest uppercase mb-6 shadow-sm border border-primary-red/20">
              100% Free Planner
            </div>

            <h1 className="font-inter font-bold text-[clamp(2.5rem,5vw,4rem)] text-ink leading-tight mb-6">
              Plan your dream<br />
              <span className="text-primary-red">Thai getaway</span>
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed mb-12 max-w-md">
              Tell us what you love, and our AI will craft a personalized day-by-day itinerary just for you.
            </p>

            <div className="flex flex-col gap-6">
              {PERKS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-red-100 flex items-center justify-center shrink-0 shadow-sm shadow-red-900/5">
                    <Icon size={20} className="text-primary-red" aria-hidden="true" />
                  </div>
                  <span className="text-lg text-ink font-inter font-bold">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Image accent */}
            <div className="mt-16 relative w-full h-56 rounded-3xl overflow-hidden shadow-xl shadow-red-900/10 hidden md:block">
              <Image src="/images/light/chiang_mai_light_1779892371034.png" alt="Tropical Thailand" fill className="object-cover" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-red-900/10 border border-red-100">
            <h2 className="font-inter font-bold text-3xl text-ink mb-2">
              Your trip details
            </h2>
            <p className="text-sm text-ink-muted mb-8">
              Fields marked with an asterisk (*) are required.
            </p>

            <PlanForm />
          </div>
        </div>
      </div>
    </div>
  );
}
