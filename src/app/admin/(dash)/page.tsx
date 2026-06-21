import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, MessageSquareQuote, Database } from "lucide-react";
import { AdminHeader, StatCard, Panel, NotConnected } from "@/components/admin/admin-ui";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { blogPosts, faqs, testimonials } from "@/lib/sample-content";
import { services } from "@/lib/site";

export default function AdminOverview() {
  const connected = isSupabaseConfigured();

  return (
    <>
      <AdminHeader
        title="Overview"
        subtitle="Welcome back. Here's a snapshot of your practice."
      />

      {!connected && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5">
          <Database className="mt-0.5 size-5 shrink-0 text-[#7a6427]" />
          <div className="text-sm">
            <p className="font-medium text-ink">Database not connected yet</p>
            <p className="mt-1 text-ink-soft">
              Add your Supabase keys to <code className="rounded bg-bone px-1">.env.local</code> and
              run the migration to enable live appointments, content, and reviews. The site works
              fully without it — bookings route via WhatsApp and trackers run on-device.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Appointments (live)" value={connected ? "0" : "—"} hint="Connect DB to track" />
        <StatCard label="Published articles" value={blogPosts.length} hint="Seeded content" />
        <StatCard label="Services" value={services.length} hint="Care areas" />
        <StatCard label="FAQs" value={faqs.length} hint="On the site" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Panel title="Quick actions" className="lg:col-span-1">
          <ul className="space-y-2">
            {[
              { href: "/admin/appointments", label: "View appointments", icon: CalendarDays },
              { href: "/admin/blog", label: "Manage blog", icon: FileText },
              { href: "/admin/reviews", label: "Moderate reviews", icon: MessageSquareQuote },
            ].map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="flex items-center justify-between rounded-xl border border-sand px-4 py-3 text-sm transition-colors hover:border-pine/30 hover:bg-bone"
                >
                  <span className="flex items-center gap-2.5 text-ink">
                    <a.icon className="size-4 text-pine" />
                    {a.label}
                  </span>
                  <ArrowUpRight className="size-4 text-ink-faint" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent articles" className="lg:col-span-2">
          {connected ? (
            <NotConnected feature="articles" />
          ) : (
            <ul className="divide-y divide-sand">
              {blogPosts.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-ink-faint">{p.category} · {p.readingMinutes} min</p>
                  </div>
                  <Link href={`/blog/${p.slug}`} className="text-sm text-pine hover:underline">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Latest reviews">
          <ul className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name} className="rounded-xl border border-sand bg-bone/40 p-4 text-sm">
                <p className="text-ink-soft">“{t.quote.slice(0, 90)}…”</p>
                <p className="mt-2 font-medium text-ink">{t.name}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
