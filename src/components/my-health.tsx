"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  CalendarHeart,
  CalendarDays,
  Baby,
  Download,
  Trash2,
  ShieldCheck,
  Video,
  Phone,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalState, exportLocalData } from "@/lib/trackers/storage";
import { getCycleStatus, phaseLabel, DEFAULT_SETTINGS, type CycleEntry, type PeriodSettings } from "@/lib/trackers/period";
import { getProgress, type PregnancyProfile } from "@/lib/trackers/pregnancy";
import { prettyTime, type BookingSummary } from "@/lib/booking";

const modeIcon: Record<string, React.ReactNode> = {
  video: <Video className="size-4" />,
  audio: <Phone className="size-4" />,
  chat: <MessageSquare className="size-4" />,
  in_person: <MapPin className="size-4" />,
};

export function MyHealth() {
  const [bookings] = useLocalState<BookingSummary[]>("dpa_bookings", []);
  const [entries] = useLocalState<CycleEntry[]>("dpa_period_entries", []);
  const [settings] = useLocalState<PeriodSettings>("dpa_period_settings", DEFAULT_SETTINGS);
  const [preg] = useLocalState<PregnancyProfile | null>("dpa_pregnancy_profile", null);
  const [hydrated, setHydrated] = React.useState(false);

  // SSR-safe hydration guard so localStorage-backed values render only on client.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  const cycle = React.useMemo(() => getCycleStatus(entries, settings), [entries, settings]);
  const pregProgress = preg ? getProgress(preg) : null;

  const exportAll = () => {
    const data = exportLocalData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-health-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Your data has been exported");
  };

  const clearAll = () => {
    if (!confirm("This permanently deletes all your local bookings and tracker data on this device. Continue?")) return;
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith("dpa_")) window.localStorage.removeItem(k);
    }
    toast.success("All local data cleared");
    setTimeout(() => window.location.reload(), 600);
  };

  if (!hydrated) return <div className="h-72 animate-pulse rounded-2xl bg-bone/60" />;

  return (
    <div className="space-y-8">
      {/* Snapshots */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-pine">
            <CalendarDays className="size-5" />
            <h3 className="font-serif text-lg text-ink">Cycle</h3>
          </div>
          {cycle.hasData ? (
            <>
              <p className="mt-3 font-serif text-2xl text-pine">{phaseLabel(cycle.phase)}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {cycle.daysUntilNext != null ? `Next period in ${cycle.daysUntilNext} days` : ""}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-ink-soft">Not started yet.</p>
          )}
          <Button asChild variant="ghost" size="sm" className="mt-3 px-0">
            <Link href="/tools/period-tracker">Open tracker →</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-pine">
            <Baby className="size-5" />
            <h3 className="font-serif text-lg text-ink">Pregnancy</h3>
          </div>
          {pregProgress?.valid ? (
            <>
              <p className="mt-3 font-serif text-2xl text-pine">Week {pregProgress.week}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {Math.max(0, pregProgress.daysRemaining)} days to go
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-ink-soft">Not started yet.</p>
          )}
          <Button asChild variant="ghost" size="sm" className="mt-3 px-0">
            <Link href="/tools/pregnancy-tracker">Open tracker →</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-pine">
            <CalendarHeart className="size-5" />
            <h3 className="font-serif text-lg text-ink">Bookings</h3>
          </div>
          <p className="mt-3 font-serif text-2xl text-pine">{bookings.length}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {bookings.length ? "consultation(s) on this device" : "No bookings yet"}
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-3 px-0">
            <Link href="/book">Book a consultation →</Link>
          </Button>
        </Card>
      </div>

      {/* Bookings list */}
      <Card className="p-7">
        <h2 className="font-serif text-2xl">Your consultations</h2>
        {bookings.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-sand p-8 text-center">
            <p className="text-ink-soft">You haven&apos;t booked a consultation yet.</p>
            <Button asChild className="mt-4">
              <Link href="/book">
                <CalendarHeart /> Book now
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.ref}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand bg-paper px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-sage-mist text-pine">
                    {modeIcon[b.mode]}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{b.modeLabel}</p>
                    <p className="text-sm text-ink-soft">
                      {format(parseISO(b.date), "d MMM yyyy")} · {prettyTime(b.time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-faint">{b.ref}</span>
                  <Badge variant={b.status === "paid" ? "default" : "outline"}>
                    {b.status === "paid" ? "Confirmed" : "Requested"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Privacy controls */}
      <Card className="border-sage/30 bg-sage-mist/30 p-7">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-pine" />
          <div className="flex-1">
            <h2 className="font-serif text-xl">Your data, your control</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Everything here is stored privately on this device — never uploaded. You can export a
              copy or permanently erase it at any time.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={exportAll}>
                <Download /> Export my data
              </Button>
              <Button variant="ghost" onClick={clearAll} className="text-danger hover:bg-danger/10">
                <Trash2 /> Clear all data
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
