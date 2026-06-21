import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { PeriodTracker } from "@/components/tools/period-tracker";

export const metadata: Metadata = {
  title: "Period Tracker",
  description:
    "A free, private period and cycle tracker. Predict your next period, fertile window, and ovulation. Data stays on your device — no sign-up.",
};

export default function PeriodTrackerPage() {
  return (
    <>
      <PageHero
        eyebrow="Your cycle, understood"
        title="Period & Cycle Tracker"
        description="Log your periods and symptoms to predict your next period, fertile window, and ovulation — privately, on your device."
        breadcrumb={[{ label: "Tools", href: "/tools" }, { label: "Period Tracker" }]}
      />
      <Section className="pt-12">
        <div className="container-px">
          <PeriodTracker />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-faint">
            Predictions are estimates based on the data you enter and are not a method of
            contraception. If your cycles are irregular or you have concerns, please book a
            consultation.
          </p>
        </div>
      </Section>
    </>
  );
}
