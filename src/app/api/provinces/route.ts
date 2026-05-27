import { NextResponse } from "next/server";
import { createServerClient } from "@/src/lib/supabase";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const db = createServerClient();
    
    // Fetch only the province column
    const { data, error } = await db
      .from("places")
      .select("province")
      .eq("is_published", true);

    if (error) {
      console.error("GET provinces error:", error);
      return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
    }

    // Deduplicate provinces
    const uniqueProvinces = [...new Set(data.map((p) => p.province))].sort((a, b) => 
      a.localeCompare(b, "th")
    );

    return NextResponse.json(uniqueProvinces);
  } catch (error) {
    console.error("GET provinces error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
