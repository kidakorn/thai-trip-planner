import { NextResponse } from "next/server";
import { PlaceSchema } from "@/src/lib/types";
import { createServerClient } from "@/src/lib/supabase";

function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const db = createServerClient();

  const { data, error } = await db
    .from("places")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: RouteContext) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT place error:", error);
      return NextResponse.json({ error: "Failed to update place" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT place error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = createServerClient();

  // Soft delete — set is_published to false rather than deleting the row
  const { error } = await db
    .from("places")
    .update({ is_published: false })
    .eq("id", id);

  if (error) {
    console.error("DELETE place error:", error);
    return NextResponse.json({ error: "Failed to delete place" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
