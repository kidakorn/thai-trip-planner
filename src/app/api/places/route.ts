import { NextResponse } from "next/server";
import { PlaceSchema } from "@/src/lib/types";
import { createServerClient } from "@/src/lib/supabase";

// Verify the admin secret from the request header
function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const province = searchParams.get("province");

    const db = createServerClient();
    let query = db
      .from("places")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(60);

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (province) {
      query = query.eq("province", province);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET places error:", error);
      return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET places error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const parsed = PlaceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("places")
      .insert({
        ...parsed.data,
        vibe: parsed.data.vibe ?? [],
        open_hours: parsed.data.open_hours ?? {},
        images: [],
      })
      .select()
      .single();

    if (error) {
      console.error("POST place error:", error);
      return NextResponse.json({ error: "Failed to create place" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST place error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
