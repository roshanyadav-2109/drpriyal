import { CheckCircle2, XCircle } from "lucide-react";
import { AdminHeader, Panel } from "@/components/admin/admin-ui";

function envSet(name: string, value?: string) {
  return Boolean(value && value.length > 0 && !value.startsWith("your-") && !value.startsWith("rzp_test_xxxx"));
}

export default function AdminSettings() {
  const checks = [
    { label: "Supabase URL", ok: envSet("url", process.env.NEXT_PUBLIC_SUPABASE_URL), hint: "NEXT_PUBLIC_SUPABASE_URL" },
    { label: "Supabase anon key", ok: envSet("anon", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), hint: "NEXT_PUBLIC_SUPABASE_ANON_KEY" },
    { label: "Supabase service role", ok: envSet("svc", process.env.SUPABASE_SERVICE_ROLE_KEY), hint: "SUPABASE_SERVICE_ROLE_KEY (server only)" },
    { label: "Razorpay key id", ok: envSet("rzp", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID), hint: "NEXT_PUBLIC_RAZORPAY_KEY_ID" },
    { label: "Razorpay secret", ok: envSet("rzs", process.env.RAZORPAY_KEY_SECRET), hint: "RAZORPAY_KEY_SECRET (server only)" },
    { label: "100ms video", ok: envSet("hms", process.env.HMS_ACCESS_KEY), hint: "HMS_ACCESS_KEY (server only)" },
    { label: "Email (Resend)", ok: envSet("rsd", process.env.RESEND_API_KEY), hint: "RESEND_API_KEY (server only)" },
    { label: "WhatsApp", ok: envSet("wa", process.env.WHATSAPP_TOKEN), hint: "WHATSAPP_TOKEN (server only)" },
  ];

  return (
    <>
      <AdminHeader title="Settings" subtitle="Integration status for this environment." />
      <Panel title="Integrations">
        <ul className="divide-y divide-sand">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-ink">{c.label}</p>
                <p className="text-xs text-ink-faint">{c.hint}</p>
              </div>
              {c.ok ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-success">
                  <CheckCircle2 className="size-4" /> Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-faint">
                  <XCircle className="size-4" /> Not set
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-ink-faint">
          Set these in <code className="rounded bg-bone px-1">.env.local</code> (development) or in
          your hosting provider&apos;s environment variables (production). Server-only secrets must
          never be exposed with the <code className="rounded bg-bone px-1">NEXT_PUBLIC_</code> prefix.
        </p>
      </Panel>
    </>
  );
}
