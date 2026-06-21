"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  CalendarCheck,
  PartyPopper,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { services, consultModes, site } from "@/lib/site";
import {
  FEES,
  makeRef,
  prettyTime,
  selectableDates,
  slotsForDate,
  type BookingSummary,
} from "@/lib/booking";
import { formatINR } from "@/lib/utils";

const modeIcons: Record<string, React.ReactNode> = {
  video: <Video className="size-5" />,
  audio: <Phone className="size-5" />,
  chat: <MessageSquare className="size-5" />,
  in_person: <MapPin className="size-5" />,
};

const STEPS = ["Service", "Time", "Details", "Confirm"];

type RazorpayWindow = Window & { Razorpay?: new (opts: unknown) => { open: () => void } };

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as RazorpayWindow).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function BookingFlow({ initialService }: { initialService?: string }) {
  const [step, setStep] = React.useState(0);
  const [serviceSlug, setServiceSlug] = React.useState(initialService ?? "");
  const [mode, setMode] = React.useState("video");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState<BookingSummary | null>(null);

  const dates = React.useMemo(() => selectableDates(14), []);
  const slots = React.useMemo(() => (date ? slotsForDate(date) : []), [date]);
  const fee = FEES[mode] ?? 600;
  const modeLabel = consultModes.find((m) => m.id === mode)?.label ?? mode;
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const canNext =
    (step === 0 && mode) ||
    (step === 1 && date && time) ||
    (step === 2 && name.trim() && phone.trim().length >= 8) ||
    step === 3;

  const saveLocal = (b: BookingSummary) => {
    try {
      const raw = window.localStorage.getItem("dpa_bookings");
      const arr = raw ? (JSON.parse(raw) as BookingSummary[]) : [];
      window.localStorage.setItem("dpa_bookings", JSON.stringify([b, ...arr].slice(0, 30)));
    } catch {
      /* ignore */
    }
  };

  const buildSummary = (status: BookingSummary["status"], ref: string): BookingSummary => ({
    ref,
    service: serviceSlug || undefined,
    mode,
    modeLabel,
    date,
    time,
    name,
    phone,
    email: email || undefined,
    reason: reason || undefined,
    fee,
    status,
    createdAt: new Date().toISOString(),
  });

  const requestViaWhatsApp = (b: BookingSummary) => {
    const svc = services.find((s) => s.slug === b.service)?.title ?? "General consultation";
    const msg =
      `Hi, I'd like to book a consultation.%0A%0A` +
      `Ref: ${b.ref}%0A` +
      `Type: ${b.modeLabel}%0A` +
      `Service: ${svc}%0A` +
      `Date: ${format(parseISO(b.date), "d MMM yyyy")} at ${prettyTime(b.time)}%0A` +
      `Name: ${b.name}%0A` +
      `Phone: ${b.phone}` +
      (b.email ? `%0AEmail: ${b.email}` : "") +
      (b.reason ? `%0AReason: ${encodeURIComponent(b.reason)}` : "");
    window.open(`https://wa.me/${site.whatsapp}?text=${msg}`, "_blank");
  };

  const finalize = (status: BookingSummary["status"], ref: string) => {
    const b = buildSummary(status, ref);
    saveLocal(b);
    setConfirmed(b);
  };

  const handleConfirm = async () => {
    const ref = makeRef();
    setBusy(true);
    try {
      if (razorpayKey) {
        const ok = await loadRazorpay();
        if (!ok) throw new Error("Could not load payment.");
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: fee * 100, ref }),
        });
        if (!res.ok) throw new Error("Payment setup failed.");
        const order = await res.json();
        const RZP = (window as RazorpayWindow).Razorpay!;
        const rzp = new RZP({
          key: razorpayKey,
          amount: order.amount,
          currency: "INR",
          name: site.name,
          description: `${modeLabel} consultation`,
          order_id: order.id,
          prefill: { name, contact: phone, email },
          theme: { color: "#3f5c4e" },
          handler: async (resp: Record<string, string>) => {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...resp, ref }),
            });
            if (v.ok) {
              finalize("paid", ref);
              toast.success("Payment successful — you're booked!");
            } else {
              toast.error("We couldn't verify the payment. Please contact us with your ref.");
            }
          },
        });
        rzp.open();
      } else {
        // No payment configured — route as a booking request via WhatsApp.
        const b = buildSummary("requested", ref);
        requestViaWhatsApp(b);
        finalize("requested", ref);
        toast.success("Booking request created!");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (confirmed) return <Confirmation booking={confirmed} />;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-10 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                  i < step
                    ? "border-pine bg-pine text-ivory"
                    : i === step
                      ? "border-pine bg-sage-mist text-pine"
                      : "border-sand text-ink-faint"
                }`}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "text-pine" : "text-ink-faint"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${i < step ? "bg-pine" : "bg-sand"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-7 md:p-8">
        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl">How would you like to consult?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {consultModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    mode === m.id ? "border-pine bg-sage-mist" : "border-sand hover:border-pine/40"
                  }`}
                >
                  <span className="mt-0.5 text-pine">{modeIcons[m.id]}</span>
                  <span>
                    <span className="block font-medium text-ink">{m.label}</span>
                    <span className="block text-xs text-ink-soft">
                      {m.note} · {m.durationMin} min · {formatINR(FEES[m.id] * 100)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <Label htmlFor="svc">Reason for visit (optional)</Label>
              <select
                id="svc"
                value={serviceSlug}
                onChange={(e) => setServiceSlug(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-sand bg-paper px-4 text-[0.95rem] text-ink focus-visible:border-pine focus-visible:outline-none"
              >
                <option value="">General consultation</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl">Pick a date & time</h2>
            <p className="mt-1 text-sm text-ink-soft">All times in IST. Mon–Sat.</p>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {dates.map((d) => {
                const iso = format(d, "yyyy-MM-dd");
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => {
                      setDate(iso);
                      setTime("");
                    }}
                    className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5 transition-colors ${
                      date === iso ? "border-pine bg-pine text-ivory" : "border-sand hover:border-pine/40"
                    }`}
                  >
                    <span className="text-xs uppercase">{format(d, "EEE")}</span>
                    <span className="font-serif text-lg">{format(d, "d")}</span>
                    <span className="text-xs">{format(d, "MMM")}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <div className="mt-5">
                <Label>Available slots</Label>
                {slots.length ? (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTime(s)}
                        className={`rounded-lg border py-2 text-sm transition-colors ${
                          time === s ? "border-pine bg-pine text-ivory" : "border-sand hover:border-pine/40"
                        }`}
                      >
                        {prettyTime(s)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-ink-soft">No slots left for this day — try another.</p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <h2 className="font-serif text-2xl">Your details</h2>
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (WhatsApp)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">What would you like to discuss? (optional)</Label>
              <Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <p className="text-xs text-ink-faint">
              Your details are used only to arrange your consultation. See our{" "}
              <Link href="/privacy" className="text-pine underline">privacy policy</Link>.
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif text-2xl">Review & confirm</h2>
            <dl className="mt-5 divide-y divide-sand rounded-xl border border-sand">
              <Row label="Consultation" value={modeLabel} />
              <Row label="Reason" value={services.find((s) => s.slug === serviceSlug)?.title ?? "General consultation"} />
              <Row label="Date" value={date ? format(parseISO(date), "EEEE, d MMM yyyy") : "—"} />
              <Row label="Time" value={time ? prettyTime(time) : "—"} />
              <Row label="Name" value={name} />
              <Row label="Phone" value={phone} />
              <Row label="Fee" value={formatINR(fee * 100)} emphasize />
            </dl>
            <p className="mt-4 text-xs text-ink-faint">
              By confirming you agree to our{" "}
              <Link href="/terms" className="text-pine underline">terms</Link> and{" "}
              <Link href="/refund-policy" className="text-pine underline">refund policy</Link>. Online
              consultations follow India&apos;s Telemedicine Practice Guidelines and are not for
              emergencies.
            </p>
            {!razorpayKey && (
              <p className="mt-3 rounded-lg bg-sage-mist/60 px-4 py-3 text-xs text-pine">
                You&apos;ll confirm your booking over WhatsApp and pay securely once the slot is
                confirmed.
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}>
              Continue <ChevronRight />
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={busy}>
              <CalendarCheck />
              {razorpayKey ? `Pay ${formatINR(fee * 100)} & Book` : "Confirm booking"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className={emphasize ? "font-serif text-lg text-pine" : "text-sm font-medium text-ink"}>
        {value}
      </dd>
    </div>
  );
}

function Confirmation({ booking }: { booking: BookingSummary }) {
  const copyRef = () => {
    navigator.clipboard.writeText(booking.ref);
    toast.success("Reference copied");
  };
  return (
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-sage-mist text-pine">
        <PartyPopper className="size-8" />
      </span>
      <h2 className="mt-6 font-serif text-3xl">
        {booking.status === "paid" ? "You're booked!" : "Booking request sent!"}
      </h2>
      <p className="mt-3 text-ink-soft">
        {booking.status === "paid"
          ? "Your consultation is confirmed. We've noted your details and you'll receive your joining link on WhatsApp and email."
          : "We've opened WhatsApp with your details. Our team will confirm your slot and share the payment link shortly."}
      </p>

      <Card className="mt-7 p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-soft">Your reference</span>
          <button onClick={copyRef} className="inline-flex items-center gap-1.5 text-sm font-medium text-pine">
            {booking.ref} <Copy className="size-3.5" />
          </button>
        </div>
        <div className="mt-3 space-y-1.5 text-sm text-ink">
          <p>{booking.modeLabel}</p>
          <p>
            {format(parseISO(booking.date), "EEEE, d MMM yyyy")} · {prettyTime(booking.time)}
          </p>
          <p className="text-ink-soft">{booking.name} · {booking.phone}</p>
        </div>
      </Card>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild>
          <Link href="/my-health">View my bookings</Link>
        </Button>
      </div>
      <p className="mt-6 text-xs text-ink-faint">
        Keep your reference safe. For any change, message us on WhatsApp quoting {booking.ref}.
      </p>
    </div>
  );
}
