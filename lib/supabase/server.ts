import { createClient } from "@supabase/supabase-js";

function readRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function createSupabaseAdminClient() {
  const url = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
