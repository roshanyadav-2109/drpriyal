"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Baby,
  Footprints,
  Scale,
  Check,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  Plus,
  CalendarCheck,
  Stethoscope,
  Syringe,
  Microscope,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLocalState } from "@/lib/trackers/storage";
import {
  computeEDD,
  getProgress,
  trimesterLabel,
  type EddMethod,
  type KickSession,
  type PregLog,
  type PregnancyProfile,
} from "@/lib/trackers/pregnancy";
import { getWeekContent, ANC_SCHEDULE, type AncItem } from "@/lib/trackers/pregnancy-content";
import { fmt } from "@/lib/trackers/period";

export function PregnancyTracker() {
  const [profile, setProfile, hydrated, clearProfile] = useLocalState<PregnancyProfile | null>(
    "dpa_pregnancy_profile",
    null,
  );

  if (!hydrated) return <div className="h-96 animate-pulse rounded-2xl bg-bone/60" />;
  if (!profile) return <SetupForm onSave={setProfile} />;

  return <Dashboard profile={profile} onReset={clearProfile} />;
}

function SetupForm({ onSave }: { onSave: (p: PregnancyProfile) => void }) {
  const [method, setMethod] = React.useState<EddMethod>("lmp");
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState(28);

  const methods: { id: EddMethod; label: string; dateLabel: string }[] = [
    { id: "lmp", label: "Last period", dateLabel: "First day of last period" },
    { id: "conception", label: "Conception date", dateLabel: "Date of conception" },
    { id: "dueDate", label: "Known due date", dateLabel: "Your due date" },
    { id: "ivf5", label: "IVF (Day 5)", dateLabel: "Embryo transfer date" },
  ];

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-sage-mist text-pine">
          <Baby className="size-7" />
        </span>
        <h2 className="mt-4 font-serif text-2xl">Let&apos;s set up your pregnancy</h2>
        <p className="mt-2 text-ink-soft">A few details and we&apos;ll personalise everything for you.</p>
      </div>

      <div className="mt-7 grid gap-5">
        <div className="grid gap-2">
          <Label>How would you like to start?</Label>
          <div className="grid grid-cols-2 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  method === m.id ? "border-pine bg-sage-mist text-pine" : "border-sand text-ink-soft hover:border-pine/40"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pdate">{methods.find((m) => m.id === method)?.dateLabel}</Label>
          <Input id="pdate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {method === "lmp" && (
          <div className="grid gap-2">
            <Label htmlFor="pcycle">Average cycle length: {cycle} days</Label>
            <input
              id="pcycle"
              type="range"
              min={21}
              max={35}
              value={cycle}
              onChange={(e) => setCycle(Number(e.target.value))}
              className="accent-pine"
            />
          </div>
        )}

        <Button
          size="lg"
          disabled={!date}
          onClick={() =>
            onSave({ method, inputDate: date, cycleLength: cycle, createdAt: fmt(new Date()) })
          }
        >
          Start tracking
        </Button>
        <p className="text-center text-xs text-ink-faint">
          Stored privately on your device. This is a companion, not a replacement for medical care.
        </p>
      </div>
    </Card>
  );
}

function Dashboard({ profile, onReset }: { profile: PregnancyProfile; onReset: () => void }) {
  const progress = getProgress(profile);
  const edd = computeEDD(profile);
  const [selectedWeek, setSelectedWeek] = React.useState(Math.max(4, Math.min(40, progress.week)));
  const content = getWeekContent(selectedWeek);

  if (!progress.valid) {
    return (
      <Card className="mx-auto max-w-xl p-8 text-center">
        <AlertTriangle className="mx-auto size-8 text-warning" />
        <p className="mt-3 text-ink-soft">
          The dates don&apos;t look like an active pregnancy range. Please reset and try again.
        </p>
        <Button variant="outline" className="mt-5" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress header */}
      <Card className="overflow-hidden bg-gradient-to-br from-sage-mist to-bone p-7 grain">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{trimesterLabel(progress.trimester)}</p>
            <p className="mt-2 font-serif text-4xl text-pine">
              Week {progress.week}
              <span className="text-2xl text-ink-soft"> · day {progress.day}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-soft">Due date</p>
            <p className="font-serif text-xl text-ink">{format(edd, "d MMM yyyy")}</p>
            <p className="text-sm text-ink-soft">{Math.max(0, progress.daysRemaining)} days to go</p>
          </div>
        </div>
        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-pine transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </Card>

      {/* Week-by-week */}
      <Card className="p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Your week</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek((w) => Math.max(4, w - 1))}
              aria-label="Previous week"
            >
              <ChevronLeft />
            </Button>
            <span className="w-16 text-center font-medium">Week {selectedWeek}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek((w) => Math.min(40, w + 1))}
              aria-label="Next week"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-sand bg-bone/40 p-5">
          <p className="text-sm text-ink-soft">This week your baby is about the size of</p>
          <p className="font-serif text-2xl text-pine">{content.size}</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <InfoBlock icon={<Baby className="size-5" />} title="Baby" body={content.baby} />
          <InfoBlock icon={<Heart className="size-5" />} title="You" body={content.mom} />
          <InfoBlock icon={<Check className="size-5" />} title="Tip" body={content.tip} />
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <KickCounter />
        <QuickLog week={progress.week} />
      </div>

      <AncSchedule currentWeek={progress.week} />

      <div className="flex items-center justify-between rounded-2xl border border-sand bg-bone/40 p-5">
        <p className="text-sm text-ink-soft">
          A companion for your journey — always follow your doctor&apos;s advice.
        </p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      </div>
    </div>
  );
}

function InfoBlock({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-sand bg-paper p-4">
      <div className="flex items-center gap-2 text-pine">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function KickCounter() {
  const [sessions, setSessions] = useLocalState<KickSession[]>("dpa_kick_sessions", []);
  const [counting, setCounting] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const startRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  const start = () => {
    startRef.current = Date.now();
    setCount(0);
    setElapsed(0);
    setCounting(true);
  };

  const finish = React.useCallback(
    (finalCount: number) => {
      setCounting(false);
      if (finalCount > 0) {
        const session: KickSession = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          kicks: finalCount,
          durationSec: Math.floor((Date.now() - startRef.current) / 1000),
        };
        setSessions((prev) => [session, ...prev].slice(0, 20));
      }
    },
    [setSessions],
  );

  const tap = () => {
    const next = count + 1;
    setCount(next);
    if (next >= 10) finish(next);
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <Card className="p-7">
      <div className="flex items-center gap-2 text-pine">
        <Footprints className="size-5" />
        <h3 className="font-serif text-xl text-ink">Kick counter</h3>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">
        From ~28 weeks, count your baby&apos;s movements. Aim to feel 10 within 2 hours.
      </p>

      <div className="mt-5 flex flex-col items-center">
        <button
          type="button"
          onClick={counting ? tap : start}
          className={`flex size-36 flex-col items-center justify-center rounded-full border-2 transition-all ${
            counting
              ? "border-pine bg-sage-mist text-pine active:scale-95"
              : "border-dashed border-pine/40 text-ink-soft hover:border-pine"
          }`}
        >
          {counting ? (
            <>
              <span className="font-serif text-5xl text-pine">{count}</span>
              <span className="text-xs">tap for each kick</span>
            </>
          ) : (
            <>
              <Play className="size-7" />
              <span className="mt-1 text-sm">Start counting</span>
            </>
          )}
        </button>
        {counting && (
          <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
            <span>
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
            <Button variant="ghost" size="sm" onClick={() => finish(count)}>
              <Square /> Finish
            </Button>
          </div>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="mt-5 border-t border-sand pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Recent sessions</p>
          <ul className="mt-2 space-y-1.5">
            {sessions.slice(0, 3).map((s) => (
              <li key={s.id} className="flex justify-between text-sm text-ink-soft">
                <span>{format(new Date(s.date), "d MMM, h:mm a")}</span>
                <span>
                  {s.kicks} kicks · {Math.round(s.durationSec / 60)} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-xs text-ink-faint">
        If you notice reduced or no movements, contact your doctor or hospital right away.
      </p>
    </Card>
  );
}

function QuickLog({ week }: { week: number }) {
  const [logs, setLogs] = useLocalState<PregLog[]>("dpa_pregnancy_logs", []);
  const [weight, setWeight] = React.useState("");
  const [sys, setSys] = React.useState("");
  const [dia, setDia] = React.useState("");

  const save = () => {
    if (!weight && !sys && !dia) return;
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        date: fmt(new Date()),
        week,
        weightKg: weight ? Number(weight) : undefined,
        bpSys: sys ? Number(sys) : undefined,
        bpDia: dia ? Number(dia) : undefined,
      },
      ...prev,
    ]);
    setWeight("");
    setSys("");
    setDia("");
  };

  return (
    <Card className="p-7">
      <div className="flex items-center gap-2 text-pine">
        <Scale className="size-5" />
        <h3 className="font-serif text-xl text-ink">Health log</h3>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">Track your weight and blood pressure over time.</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="weight" className="text-xs">Weight (kg)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="sys" className="text-xs">BP (sys)</Label>
          <Input id="sys" type="number" value={sys} onChange={(e) => setSys(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="dia" className="text-xs">BP (dia)</Label>
          <Input id="dia" type="number" value={dia} onChange={(e) => setDia(e.target.value)} />
        </div>
      </div>
      <Button className="mt-4 w-full" variant="secondary" onClick={save}>
        <Plus /> Add to log
      </Button>

      {logs.length > 0 && (
        <ul className="mt-5 space-y-1.5 border-t border-sand pt-4 text-sm">
          {logs.slice(0, 4).map((l) => (
            <li key={l.id} className="flex justify-between text-ink-soft">
              <span>{format(new Date(l.date), "d MMM")}</span>
              <span>
                {l.weightKg ? `${l.weightKg} kg` : ""}
                {l.bpSys ? `  ${l.bpSys}/${l.bpDia}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function AncSchedule({ currentWeek }: { currentWeek: number }) {
  const [done, setDone] = useLocalState<string[]>("dpa_anc_done", []);
  const key = (a: AncItem, i: number) => `${a.week}-${a.title}-${i}`;
  const toggle = (k: string) =>
    setDone((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const typeIcon = (t: AncItem["type"]) => {
    switch (t) {
      case "scan":
        return <Microscope className="size-4" />;
      case "vaccine":
        return <Syringe className="size-4" />;
      case "test":
        return <Microscope className="size-4" />;
      default:
        return <Stethoscope className="size-4" />;
    }
  };

  return (
    <Card className="p-7">
      <div className="flex items-center gap-2 text-pine">
        <CalendarCheck className="size-5" />
        <h3 className="font-serif text-xl text-ink">Antenatal schedule</h3>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">
        Your personalised checklist of visits, scans, tests, and vaccines. Always follow your
        doctor&apos;s specific advice.
      </p>

      <ul className="mt-5 space-y-2">
        {ANC_SCHEDULE.map((a, i) => {
          const k = key(a, i);
          const isDone = done.includes(k);
          const overdue = !isDone && currentWeek > a.week + 1;
          const upcoming = !isDone && !overdue && a.week - currentWeek <= 4 && a.week >= currentWeek;
          return (
            <li
              key={k}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                isDone ? "border-sage/40 bg-sage-mist/40" : overdue ? "border-warning/40 bg-warning/5" : "border-sand bg-paper"
              }`}
            >
              <button
                onClick={() => toggle(k)}
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isDone ? "border-pine bg-pine text-ivory" : "border-ink-faint/40"
                }`}
                aria-label="Mark done"
              >
                {isDone && <Check className="size-3.5" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${isDone ? "text-ink-faint line-through" : "text-ink"}`}>
                    {a.title}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-ink-faint">
                    {typeIcon(a.type)} wk {a.week}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink-soft">{a.detail}</p>
                {upcoming && (
                  <Link
                    href="/book?service=pregnancy-care"
                    className="mt-1 inline-block text-xs font-medium text-pine underline"
                  >
                    Book this visit
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
