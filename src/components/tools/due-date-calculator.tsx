"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Baby, CalendarHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  computeEDD,
  getProgress,
  trimesterLabel,
  type EddMethod,
  type PregnancyProfile,
} from "@/lib/trackers/pregnancy";

const methods: { id: EddMethod; label: string; dateLabel: string }[] = [
  { id: "lmp", label: "Last period (LMP)", dateLabel: "First day of your last period" },
  { id: "conception", label: "Conception date", dateLabel: "Date of conception" },
  { id: "ivf5", label: "IVF (Day 5 transfer)", dateLabel: "Embryo transfer date" },
  { id: "dueDate", label: "I know my due date", dateLabel: "Estimated due date" },
];

export function DueDateCalculator() {
  const [method, setMethod] = React.useState<EddMethod>("lmp");
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState(28);

  const profile: PregnancyProfile | null = date
    ? { method, inputDate: date, cycleLength: cycle, createdAt: date }
    : null;

  const progress = profile ? getProgress(profile) : null;
  const edd = profile ? computeEDD(profile) : null;
  const valid = progress?.valid;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-7">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Calculate from</Label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    method === m.id
                      ? "border-pine bg-sage-mist text-pine"
                      : "border-sand bg-paper text-ink-soft hover:border-pine/30"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">{methods.find((m) => m.id === method)?.dateLabel}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {method === "lmp" && (
            <div className="grid gap-2">
              <Label htmlFor="cycle">Average cycle length: {cycle} days</Label>
              <input
                id="cycle"
                type="range"
                min={21}
                max={35}
                value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                className="accent-pine"
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="flex flex-col justify-center bg-gradient-to-br from-sage-mist to-bone p-7 grain">
        {!progress ? (
          <div className="text-center text-ink-soft">
            <Sparkles className="mx-auto size-8 text-pine/50" />
            <p className="mt-3">Enter a date to see your estimated due date.</p>
          </div>
        ) : !valid ? (
          <div className="text-center text-ink-soft">
            <p>That date doesn&apos;t look like an active pregnancy range. Please check your input.</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="eyebrow eyebrow--center justify-center">Estimated due date</p>
            <p className="mt-3 font-serif text-4xl text-pine">{edd && format(edd, "d MMMM yyyy")}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="You're in" value={`Week ${progress.week}`} />
              <Stat label="Trimester" value={trimesterLabel(progress.trimester).split(" ")[0]} />
              <Stat label="Days to go" value={`${Math.max(0, progress.daysRemaining)}`} />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild size="sm">
                <Link href="/tools/pregnancy-tracker">
                  <Baby /> Start tracking
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/book?service=pregnancy-care">
                  <CalendarHeart /> Book antenatal care
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand bg-paper/80 px-2 py-3">
      <p className="font-serif text-xl text-pine">{value}</p>
      <p className="mt-0.5 text-[0.7rem] text-ink-faint">{label}</p>
    </div>
  );
}
