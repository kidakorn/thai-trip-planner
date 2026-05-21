import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { Trip } from "@/src/lib/types";
import TripResult from "@/src/components/TripResult";
import ShareButton from "@/src/components/ShareButton";

interface TripPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("trips")
    .select("plan")
    .eq("id", id)
    .single();

  const title = (data?.plan as Trip["plan"])?.title ?? "แผนทริปไทย";
  return {
    title,
    description: (data?.plan as Trip["plan"])?.summary ?? "แผนทริปไทยสร้างโดย AI",
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const trip = data as Trip;

  // Increment view count — fire and forget, no need to block render
  supabase
    .from("trips")
    .update({ view_count: (trip.view_count ?? 0) + 1 })
    .eq("id", id)
    .then(() => {});

  return (
    <div
      style={{
        maxWidth: "52rem",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
      }}
    >
      {/* Share row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <ShareButton />
      </div>

      <TripResult plan={trip.plan} />
    </div>
  );
}
