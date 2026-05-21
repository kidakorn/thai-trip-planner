import type { Metadata } from "next";
import { createServerClient } from "@/src/lib/supabase";
import { Place } from "@/src/lib/types";
import AdminPlacesClient from "@/src/components/AdminPlacesClient";

export const metadata: Metadata = {
  title: "Admin — Places",
};

export default async function AdminPlacesPage() {

  const db = createServerClient();
  const { data, error } = await db
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  const places: Place[] = error ? [] : (data as Place[]);

  return (
    <div
      style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
      }}
    >
      <AdminPlacesClient initialPlaces={places} />
    </div>
  );
}
