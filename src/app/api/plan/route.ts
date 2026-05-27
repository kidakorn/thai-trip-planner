import { NextResponse } from "next/server";
import { TripRequestSchema } from "@/src/lib/types";
import { generateTripPlan, matchProvince } from "@/src/lib/gemini";
import { createServerClient } from "@/src/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input with Zod — never trust client data
    const parsed = TripRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const request = parsed.data;
    
    // AI Matcher: If province is not provided, let AI decide
    if (!request.province) {
      request.province = await matchProvince(request);
    }

    const db = createServerClient();

    // Fetch places from the same province to feed the AI context
    const { data: places } = await db
      .from("places")
      .select("*")
      .eq("province", request.province)
      .eq("is_published", true)
      .limit(30);

    // Generate the plan — throws if AI fails or times out
    const plan = await generateTripPlan(request, places ?? []);

    // Persist the trip so it can be retrieved later by ID
    const { data: trip, error: insertError } = await db
      .from("trips")
      .insert({
        province: request.province,
        days: request.days,
        budget: request.budget,
        travelers: request.travelers,
        style: request.style,
        preferences: request.preferences ?? null,
        plan,
      })
      .select("id")
      .single();

    if (insertError || !trip) {
      console.error("DB insert error:", insertError);
      return NextResponse.json({ error: "Failed to save trip" }, { status: 500 });
    }

    return NextResponse.json({ id: trip.id, plan }, { status: 201 });
  } catch (error) {
    console.error("Plan API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate trip plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
