import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Important information about the educational nature of content on this website.",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Please read" title="Medical Disclaimer" breadcrumb={[{ label: "Disclaimer" }]} />
      <Section>
        <div className="container-narrow px-5 prose-doc">
          <p className="text-sm text-ink-faint">Last updated: June 2026</p>

          <blockquote>
            The content on this website is for educational purposes only and is not a substitute for
            professional medical advice, diagnosis, or treatment.
          </blockquote>

          <h2>General information only</h2>
          <p>Articles, trackers, and calculators on this site provide general information and estimates. They do not constitute medical advice and should not be relied upon as such. Always seek the guidance of a qualified healthcare provider with any questions about your health.</p>

          <h2>Trackers and tools are estimates</h2>
          <p>The period tracker, pregnancy tracker, ovulation guidance, and due-date calculator produce estimates based on the information you enter. They are not diagnostic tools and must not be used as a method of contraception.</p>

          <h2>No doctor–patient relationship from content</h2>
          <p>Reading content on this website does not create a doctor–patient relationship. That relationship is established only through a booked consultation.</p>

          <h2>Emergencies</h2>
          <p><strong>Do not use this website for medical emergencies.</strong> If you have severe pain, heavy bleeding, difficulty breathing, reduced fetal movements, or any urgent symptom, call your local emergency number or go to the nearest hospital immediately.</p>
        </div>
      </Section>
    </>
  );
}
