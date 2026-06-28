import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role for admin operations (singleton)
const globalForSupabase = globalThis as unknown as {
  serviceSupabase: SupabaseClient | undefined;
};

export function getServiceSupabase() {
  if (globalForSupabase.serviceSupabase) {
    return globalForSupabase.serviceSupabase;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const client = createClient(supabaseUrl, serviceRoleKey);

  if (process.env.NODE_ENV !== "production") {
    globalForSupabase.serviceSupabase = client;
  }

  return client;
}
