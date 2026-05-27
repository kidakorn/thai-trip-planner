import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Returns a no-op stub when credentials are missing so the app
// renders without crashing during local UI development.
function buildClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Minimal stub — every query returns an empty result instead of throwing.
    const stub = {
      from: () => stub,
      select: () => stub,
      insert: () => stub,
      update: () => stub,
      delete: () => stub,
      upsert: () => stub,
      eq: () => stub,
      neq: () => stub,
      order: () => stub,
      limit: () => stub,
      single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      then: (resolve: (v: { data: null; error: { message: string } }) => void) =>
        Promise.resolve({ data: null, error: { message: "Supabase not configured" } }).then(resolve),
    } as unknown as SupabaseClient;
    return stub;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = buildClient();

// Server-only client using the service role key.
// NEVER import this in client components — it bypasses Row Level Security.
export function createServerClient(): SupabaseClient {
  if (!supabaseUrl) return supabase;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!serviceRoleKey) return supabase;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
