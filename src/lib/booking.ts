import { addDays, format, isToday, setHours, setMinutes, isAfter, parseISO } from "date-fns";

/** Consultation fees in INR (rupees). Stored as paise where sent to Razorpay. */
export const FEES: Record<string, number> = {
  video: 600,
  audio: 500,
  chat: 400,
  in_person: 800,
};

/** Clinic working windows (24h). Sundays are closed. */
const WINDOWS = [
  { start: "10:00", end: "13:00" },
  { start: "17:00", end: "20:00" },
];
const SLOT_MINUTES = 20;

/** Selectable dates for the next `count` days, excluding Sundays. */
export function selectableDates(count = 14): Date[] {
  const out: Date[] = [];
  let d = new Date();
  while (out.length < count) {
    if (d.getDay() !== 0) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

/** Available time slots for a given date (excludes past times today). */
export function slotsForDate(dateISO: string): string[] {
  const date = parseISO(dateISO);
  const now = new Date();
  const slots: string[] = [];
  for (const w of WINDOWS) {
    const [sh, sm] = w.start.split(":").map(Number);
    const [eh, em] = w.end.split(":").map(Number);
    let t = setMinutes(setHours(date, sh), sm);
    const end = setMinutes(setHours(date, eh), em);
    while (isAfter(end, t)) {
      const cutoff = isToday(date) ? addDays(now, 0) : null;
      if (!cutoff || isAfter(t, setMinutes(now, now.getMinutes() + 60))) {
        slots.push(format(t, "HH:mm"));
      }
      t = setMinutes(t, t.getMinutes() + SLOT_MINUTES);
    }
  }
  return slots;
}

/** Generate a human booking reference. */
export function makeRef(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `DPA-${t}${r}`;
}

export type BookingSummary = {
  ref: string;
  service?: string;
  mode: string;
  modeLabel: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  reason?: string;
  fee: number;
  status: "requested" | "paid";
  createdAt: string;
};

export function prettyTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = setMinutes(setHours(new Date(), h), m);
  return format(d, "h:mm a");
}
