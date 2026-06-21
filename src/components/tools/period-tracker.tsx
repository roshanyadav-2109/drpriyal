"use client";

import * as React from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Download,
  ShieldAlert,
  CalendarHeart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLocalState } from "@/lib/trackers/storage";
import {
  DEFAULT_SETTINGS,
  MOOD_OPTIONS,
  SYMPTOM_OPTIONS,
  fmt,
  getCycleStatus,
  phaseLabel,
  predictCycles,
  pretty,
  sortEntries,
  type CycleEntry,
  type Flow,
  type PeriodSettings,
} from "@/lib/trackers/period";

const flows: { id: Flow; label: string }[] = [
  { id: "spotting", label: "Spotting" },
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "heavy", label: "Heavy" },
];

type DayKind = "period" | "predicted" | "fertile" | "ovulation" | null;

export function PeriodTracker() {
  const [entries, setEntries, hydrated] = useLocalState<CycleEntry[]>("dpa_period_entries", []);
  const [settings, setSettings] = useLocalState<PeriodSettings>(
    "dpa_period_settings",
    DEFAULT_SETTINGS,
  );
  const [cursor, setCursor] = React.useState(() => startOfMonth(new Date()));
  const [adding, setAdding] = React.useState(false);

  const status = React.useMemo(
    () => getCycleStatus(entries, settings),
    [entries, settings],
  );
  const predictions = React.useMemo(
    () => predictCycles(entries, settings, 3),
    [entries, settings],
  );

  const classify = React.useCallback(
    (date: Date): DayKind => {
      for (const e of entries) {
        const start = parseISO(e.start);
        const end = e.end ? parseISO(e.end) : start;
        if (isWithinInterval(date, { start, end })) return "period";
      }
      const preds = predictCycles(entries, settings, 4);
      for (const p of preds) {
        if (isSameDay(date, p.ovulation)) return "ovulation";
      }
      for (const p of preds) {
        if (isWithinInterval(date, { start: p.periodStart, end: p.periodEnd })) return "predicted";
      }
      for (const p of preds) {
        if (isWithinInterval(date, { start: p.fertileStart, end: p.fertileEnd })) return "fertile";
      }
      return null;
    },
    [entries, settings],
  );

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
  });

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-2xl bg-bone/60" />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      {/* Left: calendar + add */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">{format(cursor, "MMMM yyyy")}</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCursor((c) => subMonths(c, 1))} aria-label="Previous month">
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Next month">
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-faint">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="py-1">{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((d) => {
              const kind = classify(d);
              const today = isSameDay(d, new Date());
              const muted = !isSameMonth(d, cursor);
              return (
                <div
                  key={d.toISOString()}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-sm ${
                    muted ? "text-ink-faint/40" : "text-ink"
                  } ${kindBg(kind)} ${today ? "ring-2 ring-pine ring-offset-1 ring-offset-paper" : ""}`}
                  title={kind ?? undefined}
                >
                  {format(d, "d")}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
            <Legend className="bg-[var(--period)]" label="Period" />
            <Legend className="bg-[var(--period)]/30" label="Predicted" />
            <Legend className="bg-[var(--fertile)]/40" label="Fertile" />
            <Legend className="bg-[var(--ovulation)]" label="Ovulation" />
          </div>
        </Card>

        {!adding ? (
          <Button onClick={() => setAdding(true)} className="w-full" size="lg">
            <Plus /> Log a period
          </Button>
        ) : (
          <AddEntryForm
            settings={settings}
            onCancel={() => setAdding(false)}
            onSave={(entry) => {
              setEntries((prev) => sortEntries([entry, ...prev]));
              setAdding(false);
            }}
          />
        )}
      </div>

      {/* Right: status + predictions + history */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-sage-mist to-bone p-6 grain">
          {status.hasData ? (
            <>
              <p className="eyebrow">Today</p>
              <p className="mt-2 font-serif text-2xl text-pine">{phaseLabel(status.phase)}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat label="Cycle day" value={status.cycleDay ? `Day ${status.cycleDay}` : "—"} />
                <MiniStat
                  label="Next period"
                  value={status.daysUntilNext != null ? `${status.daysUntilNext} days` : "—"}
                />
                <MiniStat label="Avg cycle" value={`${status.cycleLength} days`} />
                <MiniStat label="Variation" value={`±${status.variability}d`} />
              </div>
              {status.nextPeriod && (
                <p className="mt-4 text-sm text-ink-soft">
                  Next period expected around{" "}
                  <strong className="text-ink">{pretty(status.nextPeriod)}</strong>.
                </p>
              )}
            </>
          ) : (
            <div className="py-4 text-center">
              <CalendarHeart className="mx-auto size-8 text-pine/50" />
              <p className="mt-3 text-ink-soft">Log your last period to see predictions.</p>
            </div>
          )}
        </Card>

        {status.irregular && status.hasData && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-5">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="font-medium text-ink">Your cycles look a little irregular.</p>
              <p className="mt-1 text-ink-soft">
                This is often normal, but it can be worth a chat.{" "}
                <Link href="/book?service=period-menstrual-health" className="text-pine underline">
                  Book a consultation
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {predictions.length > 0 && (
          <Card className="p-6">
            <h3 className="font-serif text-lg">Upcoming cycles</h3>
            <ul className="mt-4 space-y-3">
              {predictions.map((p) => (
                <li key={p.index} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink">
                    <Droplets className="size-4 text-[var(--period)]" />
                    {pretty(p.periodStart)}
                  </span>
                  <span className="text-ink-faint">
                    Fertile {format(p.fertileStart, "d MMM")}–{format(p.fertileEnd, "d MMM")}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <HistoryAndSettings
          entries={entries}
          settings={settings}
          setSettings={setSettings}
          onDelete={(id) => setEntries((prev) => prev.filter((e) => e.id !== id))}
        />
      </div>
    </div>
  );
}

function kindBg(kind: DayKind) {
  switch (kind) {
    case "period":
      return "bg-[var(--period)] text-white font-medium";
    case "predicted":
      return "bg-[var(--period)]/25";
    case "fertile":
      return "bg-[var(--fertile)]/35";
    case "ovulation":
      return "bg-[var(--ovulation)] text-white font-medium";
    default:
      return "hover:bg-bone";
  }
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-3 rounded ${className}`} />
      {label}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand bg-paper/80 px-3 py-2.5">
      <p className="font-serif text-lg text-pine">{value}</p>
      <p className="text-[0.7rem] text-ink-faint">{label}</p>
    </div>
  );
}

function AddEntryForm({
  settings,
  onSave,
  onCancel,
}: {
  settings: PeriodSettings;
  onSave: (e: CycleEntry) => void;
  onCancel: () => void;
}) {
  const [start, setStart] = React.useState(fmt(new Date()));
  const [end, setEnd] = React.useState("");
  const [flow, setFlow] = React.useState<Flow>("medium");
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [mood, setMood] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const toggle = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg">Log a period</h3>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel">
          <X />
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="start">Start date</Label>
            <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="end">End date (optional)</Label>
            <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Flow</Label>
          <div className="flex flex-wrap gap-2">
            {flows.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFlow(f.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  flow === f.id ? "border-pine bg-pine text-ivory" : "border-sand text-ink-soft hover:border-pine/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Symptoms</Label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  symptoms.includes(s) ? "border-pine bg-sage-mist text-pine" : "border-sand text-ink-soft hover:border-pine/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Mood</Label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood((cur) => (cur === m ? "" : m))}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  mood === m ? "border-pine bg-sage-mist text-pine" : "border-sand text-ink-soft hover:border-pine/40"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything you'd like to remember…" />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() =>
              onSave({
                id: crypto.randomUUID(),
                start,
                end: end || undefined,
                flow,
                symptoms,
                mood: mood || undefined,
                notes: notes || undefined,
              })
            }
            disabled={!start}
          >
            Save entry
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <p className="text-xs text-ink-faint">
          Saved privately on this device. Your average period length is {settings.avgPeriod} days.
        </p>
      </div>
    </Card>
  );
}

function HistoryAndSettings({
  entries,
  settings,
  setSettings,
  onDelete,
}: {
  entries: CycleEntry[];
  settings: PeriodSettings;
  setSettings: React.Dispatch<React.SetStateAction<PeriodSettings>>;
  onDelete: (id: string) => void;
}) {
  const sorted = sortEntries(entries);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ entries, settings }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-period-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg">History & settings</h3>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={exportData}>
            <Download /> Export
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="avgCycle" className="text-xs">Avg cycle (days)</Label>
          <Input
            id="avgCycle"
            type="number"
            min={21}
            max={45}
            value={settings.avgCycle}
            onChange={(e) => setSettings((s) => ({ ...s, avgCycle: Number(e.target.value) || 28 }))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="avgPeriod" className="text-xs">Avg period (days)</Label>
          <Input
            id="avgPeriod"
            type="number"
            min={2}
            max={10}
            value={settings.avgPeriod}
            onChange={(e) => setSettings((s) => ({ ...s, avgPeriod: Number(e.target.value) || 5 }))}
          />
        </div>
      </div>

      {sorted.length > 0 && (
        <ul className="mt-5 space-y-2">
          {sorted.slice(0, 6).map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-xl border border-sand bg-paper px-3 py-2.5 text-sm"
            >
              <span className="text-ink">
                {pretty(e.start)}
                {e.flow && <span className="ml-2 text-xs text-ink-faint capitalize">· {e.flow}</span>}
              </span>
              <button
                onClick={() => onDelete(e.id)}
                className="text-ink-faint hover:text-danger"
                aria-label="Delete entry"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
