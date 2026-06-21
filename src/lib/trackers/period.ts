import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
} from "date-fns";

export type Flow = "spotting" | "light" | "medium" | "heavy";

export type CycleEntry = {
  id: string;
  start: string; // yyyy-MM-dd
  end?: string;
  flow?: Flow;
  symptoms?: string[];
  mood?: string;
  notes?: string;
};

export type PeriodSettings = {
  avgCycle: number; // days
  avgPeriod: number; // days
};

export const DEFAULT_SETTINGS: PeriodSettings = { avgCycle: 28, avgPeriod: 5 };

export const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Back pain",
  "Tender breasts",
  "Acne",
  "Fatigue",
  "Nausea",
];

export const MOOD_OPTIONS = ["Happy", "Calm", "Anxious", "Irritable", "Low", "Energetic"];

export const fmt = (d: Date | string) =>
  format(typeof d === "string" ? parseISO(d) : d, "yyyy-MM-dd");

export const pretty = (d: Date | string) =>
  format(typeof d === "string" ? parseISO(d) : d, "d MMM yyyy");

/** Sort entries newest first. */
export function sortEntries(entries: CycleEntry[]) {
  return [...entries].sort((a, b) => (a.start < b.start ? 1 : -1));
}

/** Rolling average cycle length from recent starts (weighted to recent). */
export function averageCycleLength(entries: CycleEntry[], fallback = 28): number {
  const starts = sortEntries(entries)
    .map((e) => parseISO(e.start))
    .slice(0, 7);
  if (starts.length < 2) return fallback;
  const gaps: number[] = [];
  for (let i = 0; i < starts.length - 1; i++) {
    const gap = differenceInCalendarDays(starts[i], starts[i + 1]);
    if (gap >= 18 && gap <= 60) gaps.push(gap); // ignore outliers
  }
  if (!gaps.length) return fallback;
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

export function cycleVariability(entries: CycleEntry[]): number {
  const starts = sortEntries(entries).map((e) => parseISO(e.start));
  if (starts.length < 3) return 0;
  const gaps: number[] = [];
  for (let i = 0; i < starts.length - 1; i++) {
    gaps.push(differenceInCalendarDays(starts[i], starts[i + 1]));
  }
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance = gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length;
  return Math.round(Math.sqrt(variance));
}

export type PredictedCycle = {
  index: number;
  periodStart: Date;
  periodEnd: Date;
  fertileStart: Date;
  fertileEnd: Date;
  ovulation: Date;
};

/** Predict the next `count` cycles from the latest logged period start. */
export function predictCycles(
  entries: CycleEntry[],
  settings: PeriodSettings,
  count = 3,
): PredictedCycle[] {
  const sorted = sortEntries(entries);
  if (!sorted.length) return [];
  const cycle = averageCycleLength(entries, settings.avgCycle);
  const periodLen = settings.avgPeriod || 5;
  const lastStart = parseISO(sorted[0].start);

  const out: PredictedCycle[] = [];
  for (let i = 1; i <= count; i++) {
    const periodStart = addDays(lastStart, cycle * i);
    const ovulation = addDays(periodStart, -14);
    out.push({
      index: i,
      periodStart,
      periodEnd: addDays(periodStart, periodLen - 1),
      ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
    });
  }
  return out;
}

export type CycleStatus = {
  hasData: boolean;
  cycleDay: number | null;
  daysUntilNext: number | null;
  nextPeriod: Date | null;
  phase: "menstrual" | "follicular" | "fertile" | "luteal" | "unknown";
  cycleLength: number;
  variability: number;
  irregular: boolean;
};

export function getCycleStatus(
  entries: CycleEntry[],
  settings: PeriodSettings,
  today = new Date(),
): CycleStatus {
  const sorted = sortEntries(entries);
  const cycleLength = averageCycleLength(entries, settings.avgCycle);
  const variability = cycleVariability(entries);
  if (!sorted.length) {
    return {
      hasData: false,
      cycleDay: null,
      daysUntilNext: null,
      nextPeriod: null,
      phase: "unknown",
      cycleLength,
      variability,
      irregular: false,
    };
  }
  const t = startOfDay(today);
  const lastStart = parseISO(sorted[0].start);
  const cycleDay = differenceInCalendarDays(t, lastStart) + 1;
  const next = predictCycles(entries, settings, 1)[0];
  const nextPeriod = next?.periodStart ?? null;
  const daysUntilNext = nextPeriod ? differenceInCalendarDays(nextPeriod, t) : null;

  let phase: CycleStatus["phase"] = "luteal";
  if (cycleDay <= (settings.avgPeriod || 5)) phase = "menstrual";
  else if (next && isWithinInterval(t, { start: next.fertileStart, end: next.fertileEnd }))
    phase = "fertile";
  else if (cycleDay <= cycleLength - 14 - 6) phase = "follicular";

  return {
    hasData: true,
    cycleDay: cycleDay > 0 ? cycleDay : null,
    daysUntilNext,
    nextPeriod,
    phase,
    cycleLength,
    variability,
    irregular: variability >= 7 || cycleLength < 21 || cycleLength > 35,
  };
}

export function phaseLabel(phase: CycleStatus["phase"]) {
  switch (phase) {
    case "menstrual":
      return "Menstrual phase";
    case "follicular":
      return "Follicular phase";
    case "fertile":
      return "Fertile window";
    case "luteal":
      return "Luteal phase";
    default:
      return "Add your last period";
  }
}
