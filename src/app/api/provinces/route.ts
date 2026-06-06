import { NextResponse } from "next/server";
import { THAI_PROVINCES } from "@/src/lib/constants";

export async function GET() {
  try {
    // Sort provinces alphabetically in Thai for better UX
    const sortedProvinces = [...THAI_PROVINCES].sort((a, b) => 
      a.localeCompare(b, "th")
    );

    return NextResponse.json(sortedProvinces);
  } catch (error) {
    console.error("GET provinces error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
