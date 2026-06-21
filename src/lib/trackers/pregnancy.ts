import { addDays, differenceInCalendarDays, parseISO, startOfDay } from "date-fns";

export type EddMethod = "lmp" | "conception" | "dueDate" | "ivf5" | "ivf3" | "ultrasound";

export type PregnancyProfile = {
  method: EddMethod;
  inputDate: string; // yyyy-MM-dd
  cycleLength?: number; // for lmp
  ultrasoundWeeks?: number; // for ultrasound dating
  ultrasoundDays?: number;
  createdAt: string;
};

/** Returns the EDD as a Date. */
export function computeEDD(p: PregnancyProfile): Date {
  const d = parseISO(p.inputDate);
  switch (p.method) {
    case "lmp": {
      const adj = (p.cycleLength ?? 28) - 28;
      return addDays(d, 280 + adj);
    }
    case "conception":
      return addDays(d, 266);
    case "ivf5":
      return addDays(d, 261);
    case "ivf3":
      return addDays(d, 263);
    case "ultrasound": {
      const gaDays = (p.ultrasoundWeeks ?? 0) * 7 + (p.ultrasoundDays ?? 0);
      // EDD = scan date + (280 - GA at scan)
      return addDays(d, 280 - gaDays);
    }
    case "dueDate":
    default:
      return d;
  }
}

export type PregnancyProgress = {
  edd: Date;
  conception: Date;
  gaDays: number; // gestational age in days
  week: number;
  day: number;
  daysRemaining: number;
  trimester: 1 | 2 | 3;
  percent: number;
  valid: boolean;
};

export function getProgress(p: PregnancyProfile, today = new Date()): PregnancyProgress {
  const edd = computeEDD(p);
  const t = startOfDay(today);
  const daysRemaining = differenceInCalendarDays(edd, t);
  const gaDays = 280 - daysRemaining;
  const week = Math.floor(gaDays / 7);
  const day = ((gaDays % 7) + 7) % 7;
  const trimester: 1 | 2 | 3 = week <= 12 ? 1 : week <= 27 ? 2 : 3;
  const percent = Math.max(0, Math.min(100, Math.round((gaDays / 280) * 100)));
  return {
    edd,
    conception: addDays(edd, -266),
    gaDays,
    week,
    day,
    daysRemaining,
    trimester,
    percent,
    valid: gaDays >= 0 && gaDays <= 300,
  };
}

export const trimesterLabel = (t: 1 | 2 | 3) =>
  t === 1 ? "First trimester" : t === 2 ? "Second trimester" : "Third trimester";

export type PregLog = {
  id: string;
  date: string;
  week?: number;
  weightKg?: number;
  bpSys?: number;
  bpDia?: number;
  mood?: string;
  notes?: string;
};

export type KickSession = {
  id: string;
  date: string; // ISO datetime
  kicks: number;
  durationSec: number;
};
