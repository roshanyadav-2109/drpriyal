import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { PregnancyTracker } from "@/components/tools/pregnancy-tracker";

export const metadata: Metadata = {
  title: "Pregnancy Tracker",
  description:
    "A free, private week-by-week pregnancy tracker with due-date, kick counter, weight log, and your personalised antenatal schedule. No sign-up.",
};

export default function PregnancyTrackerPage() {
  return (
    <>
      <PageHero
        eyebrow="Your pregnancy companion"
        title="Pregnancy Tracker"
        description="Follow your baby's growth week by week, count kicks, log your health, and never miss an antenatal visit."
        breadcrumb={[{ label: "Tools", href: "/tools" }, { label: "Pregnancy Tracker" }]}
      />
      <Section className="pt-12">
        <div className="container-px">
          <PregnancyTracker />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-faint">
            This tracker is a supportive companion and does not replace professional antenatal care.
            For any concern — especially reduced fetal movements, bleeding, or severe symptoms —
            contact your doctor or nearest hospital immediately.
          </p>
        </div>
      </Section>
    </>
  );
}
