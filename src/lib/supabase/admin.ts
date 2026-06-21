import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * SERVICE-ROLE client. BYPASSES Row-Level Security — use ONLY in trusted
 * server code (Route Handlers / Server Actions / Edge Functions) behind an
 * explicit authorization check. Never import this into a client component.
 *
 * Used for: payment signature verification, signed-URL issuance, video-room
 * creation, prescription writes, audit-log writes, and admin tasks.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — server-only operation cannot proceed.");
  }
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
