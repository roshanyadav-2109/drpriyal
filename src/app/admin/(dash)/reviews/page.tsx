import { Star } from "lucide-react";
import { AdminHeader, Panel } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/sample-content";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default function AdminReviews() {
  const connected = isSupabaseConfigured();
  return (
    <>
      <AdminHeader title="Reviews" subtitle="Moderate and publish patient testimonials." />
      <Panel>
        <ul className="divide-y divide-sand">
          {testimonials.map((t) => (
            <li key={t.name} className="flex flex-wrap items-start justify-between gap-4 py-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="font-medium text-ink">{t.name}</span>
                  <Badge variant="outline">{t.context}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">“{t.quote}”</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={!connected}>
                  Approve
                </Button>
                <Button size="sm" variant="ghost" disabled={!connected}>
                  Hide
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-lg bg-bone/60 px-4 py-3 text-xs text-ink-soft">
          ⚠️ These testimonials are illustrative placeholders. Replace with real, consented patient
          reviews before going live.
        </p>
      </Panel>
    </>
  );
}
