import type { Metadata } from "next";
import PlanForm from "@/src/components/PlanForm";
import { Zap, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Plan a Trip — Thai Trip Planner",
  description: "Build a personalized Thailand itinerary instantly with AI.",
};

const PERKS = [
  { icon: Zap,    label: "Generated instantly by AI" },
  { icon: MapPin, label: "Interactive maps included" },
  { icon: Clock,  label: "Day-by-day scheduling" },
];

export default function PlanPage() {
  return (
    <div className="bg-surface min-h-screen text-ink font-inter">

      {/* Background accent */}
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none overflow-hidden" aria-hidden="true">
        <Image
          src="/images/light/krabi_light_1779892422632.png"
          alt=""
          fill
          className="object-cover object-center opacity-[0.06] scale-105"
          priority quality={70}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/90 to-surface" />
        <div className="absolute dot-grid inset-0 opacity-100" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[280px] bg-primary-red/5 blur-[100px] rounded-full" />
      </div>

      {/* Page content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-start">

          {/* Left — Info */}
          <div>
            <span className="section-label">Plan your trip</span>
            <h1 className="font-black text-[clamp(2rem,4.5vw,3.5rem)] text-ink leading-tight mb-4">
              Plan your dream<br />
              <span className="text-gradient-red">Thai getaway</span>
            </h1>
            <p className="text-ink-muted text-sm leading-relaxed mb-10 max-w-sm">
              Tell us what you love and our AI will craft a personalized, day-by-day itinerary just for you.
            </p>

            <div className="flex flex-col gap-4">
              {PERKS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary-red/10 border border-primary-red/15 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary-red" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-ink-secondary font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Decorative image */}
            <div className="mt-10 relative h-44 rounded-xl overflow-hidden border border-border hidden lg:block">
              <Image
                src="/images/light/chiang_mai_light_1779892371034.png"
                alt="Chiang Mai Thailand"
                fill
                className="object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-surface-3 border border-border rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="font-bold text-xl text-ink mb-1">Your trip details</h2>
              <p className="text-[11px] text-ink-subtle">
                Fields marked * are required
              </p>
            </div>
            <hr className="divider-line mb-6" />
            <PlanForm />
          </div>

        </div>
      </div>
    </div>
  );
}
