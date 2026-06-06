import type { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/src/lib/supabase";
import TripResult from "@/src/components/TripResult";
import { notFound } from "next/navigation";

interface TripPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata(
  { params }: TripPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) {
    return {
      title: "Trip Not Found",
    };
  }

  return {
    title: `${trip.plan.title} | Thai Trip Planner`,
    description: `${trip.plan.days}-day trip to ${trip.province} — ${trip.plan.summary}`,
    openGraph: {
      title: trip.plan.title,
      description: trip.plan.summary,
      url: `https://thaitripplanner.com/trip/${id}`, // Will be dynamic based on production domain
      siteName: 'Thai Trip Planner',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&h=630&fit=crop', // Beautiful Thailand hero image
          width: 1200,
          height: 630,
          alt: `Trip to ${trip.province}`,
        },
      ],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: trip.plan.title,
      description: trip.plan.summary,
      images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&h=630&fit=crop'],
    },
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;

  // Supabase mock for development if no env vars are set
  let tripData;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error || !data) {
      notFound();
    }
    tripData = data.plan;
  } else {
    // Mock data if Supabase isn't configured
    tripData = {
      title: "Tropical Paradise",
      summary: "Enjoy a relaxing beach holiday.",
      days: 3,
      total_cost: 15000,
      tips: ["Bring sunscreen"],
      days_detail: []
    };
  }

  return (
    <div className="bg-surface text-ink min-h-screen pt-24 pb-20 font-inter">
      <div className="max-w-5xl mx-auto px-4">
        <TripResult plan={tripData} />
      </div>
    </div>
  );
}
