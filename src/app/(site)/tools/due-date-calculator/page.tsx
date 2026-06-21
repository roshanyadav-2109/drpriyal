import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { DueDateCalculator } from "@/components/tools/due-date-calculator";

export const metadata: Metadata = {
  title: "Due-Date Calculator",
  description:
    "Calculate your estimated due date (EDD) and current pregnancy week from your last period, conception date, IVF transfer, or known due date.",
};

export default function DueDatePage() {
  return (
    <>
      <PageHero
        eyebrow="Pregnancy tool"
        title="Due-Date Calculator"
        description="Estimate your delivery date and see how far along you are. It's free, private, and takes seconds."
        breadcrumb={[{ label: "Tools", href: "/tools" }, { label: "Due-Date Calculator" }]}
      />
      <Section>
        <div className="container-px">
          <DueDateCalculator />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-faint">
            This calculator provides an estimate based on a standard 40-week (280-day) pregnancy.
            Your doctor may revise your due date after an ultrasound. It is not a substitute for
            medical advice.
          </p>
        </div>
      </Section>
    </>
  );
}
