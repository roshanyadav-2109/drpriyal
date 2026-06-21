import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { MyHealth } from "@/components/my-health";

export const metadata: Metadata = {
  title: "My Health",
  description:
    "Your private health space — bookings, cycle and pregnancy snapshots, and full control over your data. No account needed.",
  robots: { index: false, follow: false },
};

export default function MyHealthPage() {
  return (
    <>
      <PageHero
        eyebrow="Your private space"
        title="My Health"
        description="A quick view of your consultations and trackers — all kept privately on your device."
        breadcrumb={[{ label: "My Health" }]}
      />
      <Section className="pt-12">
        <div className="container-px">
          <MyHealth />
        </div>
      </Section>
    </>
  );
}
