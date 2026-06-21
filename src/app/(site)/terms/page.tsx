import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of this website and Dr. Priyal Agarwal's services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="The fine print" title="Terms of Service" breadcrumb={[{ label: "Terms" }]} />
      <Section>
        <div className="container-narrow px-5 prose-doc">
          <p className="text-sm text-ink-faint">Last updated: June 2026</p>
          <p>By using this website and booking consultations, you agree to these terms. Please read them carefully.</p>

          <h2>Nature of services</h2>
          <p>This platform offers women&apos;s health consultations (online and in-clinic) and educational health tools. Online consultations are conducted in accordance with India&apos;s Telemedicine Practice Guidelines, 2020.</p>

          <h2>Not for emergencies</h2>
          <p>Our services are not intended for medical emergencies. If you are experiencing a medical emergency, call your local emergency number or visit the nearest hospital immediately.</p>

          <h2>Consultations & prescriptions</h2>
          <ul>
            <li>You agree to provide accurate information for safe care.</li>
            <li>The doctor may decline to prescribe where it is not clinically appropriate or permitted via teleconsultation.</li>
            <li>Prescriptions are issued at the doctor&apos;s clinical discretion.</li>
          </ul>

          <h2>Health tools</h2>
          <p>The period tracker, pregnancy tracker, and calculators are for general informational purposes and are estimates only. They are not a diagnosis and not a contraceptive method.</p>

          <h2>Payments</h2>
          <p>Consultation fees are displayed at booking and processed via a secure payment gateway. See our Refund & Cancellation policy for details.</p>

          <h2>Intellectual property</h2>
          <p>All content on this site is owned by or licensed to the practice and may not be reproduced without permission.</p>

          <h2>Limitation of liability</h2>
          <p>To the maximum extent permitted by law, we are not liable for indirect or consequential losses arising from use of the website or tools. Clinical care is provided with reasonable skill and care.</p>

          <p className="text-sm text-ink-faint">These terms are a starting template and should be finalised with qualified Indian legal counsel before launch.</p>
        </div>
      </Section>
    </>
  );
}
