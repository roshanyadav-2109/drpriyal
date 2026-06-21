import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, Baby, CalendarClock, Lock, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Free Health Tools",
  description:
    "Free, private women's health tools — period tracker, pregnancy tracker, and due-date calculator. No sign-up, data stays on your device.",
};

const tools = [
  {
    href: "/tools/period-tracker",
    title: "Period Tracker",
    desc: "Log your periods and symptoms, and predict your next period, fertile window, and ovulation.",
    icon: CalendarHeart,
    tone: "from-blush to-bone",
  },
  {
    href: "/tools/pregnancy-tracker",
    title: "Pregnancy Tracker",
    desc: "Week-by-week updates, a kick counter, weight log, and your personalised antenatal schedule.",
    icon: Baby,
    tone: "from-sage-soft to-sage-mist",
  },
  {
    href: "/tools/due-date-calculator",
    title: "Due-Date Calculator",
    desc: "Find your estimated delivery date and current pregnancy week in seconds.",
    icon: CalendarClock,
    tone: "from-gold-soft/60 to-bone",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Free & private"
        title="Health tools that respect your privacy"
        description="Built by a doctor, for you. Everything runs on your device — no account, no data leaving your phone unless you choose to share it."
        breadcrumb={[{ label: "Tools" }]}
      />

      <Section>
        <div className="container-px">
          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            {tools.map((t) => (
              <StaggerItem key={t.href}>
                <Link
                  href={t.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand/80 bg-paper shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className={`flex h-32 items-center justify-center bg-gradient-to-br grain ${t.tone}`}>
                    <t.icon className="size-12 text-pine" strokeWidth={1.4} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="font-serif text-2xl">{t.title}</h2>
                    <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{t.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-pine">
                      Open tool
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-12 flex items-start gap-4 rounded-2xl border border-sand bg-bone/50 p-7">
            <Lock className="mt-1 size-6 shrink-0 text-pine" />
            <div>
              <h3 className="font-serif text-xl">Your data stays with you</h3>
              <p className="mt-1.5 text-ink-soft">
                These tools store everything locally in your browser. Nothing is uploaded to a server.
                You can export or clear your data anytime. They provide estimates for guidance — not a
                diagnosis, and not a method of contraception.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
