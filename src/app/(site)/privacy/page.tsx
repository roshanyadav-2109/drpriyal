import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dr. Priyal Agarwal's practice collects, uses, and protects your personal and health data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Your privacy matters" title="Privacy Policy" breadcrumb={[{ label: "Privacy" }]} />
      <Section>
        <div className="container-narrow px-5 prose-doc">
          <p className="text-sm text-ink-faint">Last updated: June 2026</p>
          <p>
            This Privacy Policy explains how we collect, use, store, and protect your information when
            you use this website and our services. We are committed to handling your data — especially
            sensitive health data — with care, and in line with India&apos;s Digital Personal Data
            Protection (DPDP) Act, 2023.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li><strong>Information you provide:</strong> name, contact details, and any information you share when booking a consultation or contacting us.</li>
            <li><strong>Health information:</strong> details you choose to share for a consultation (symptoms, history, reports).</li>
            <li><strong>Tracker data:</strong> period and pregnancy tracker entries are stored locally on your own device by default, and are not sent to us unless you explicitly choose to share them.</li>
            <li><strong>Usage data:</strong> basic, privacy-respecting analytics to improve the site.</li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To provide consultations, prescriptions, and follow-up care.</li>
            <li>To send appointment confirmations and reminders (with your consent).</li>
            <li>To respond to your enquiries and improve our services.</li>
          </ul>

          <h2>Your rights</h2>
          <p>Under the DPDP Act, you have the right to access, correct, and request deletion of your personal data, and to withdraw consent. To exercise these rights, contact us at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

          <h2>Data security</h2>
          <p>We use industry-standard safeguards including encryption in transit and at rest, access controls, and audit logging for sensitive records. No method of transmission is 100% secure, but we take reasonable steps to protect your data.</p>

          <h2>Sharing</h2>
          <p>We do not sell your data. We share information only with service providers necessary to deliver our services (e.g., secure payment and communication providers), under appropriate safeguards, or where required by law.</p>

          <h2>Grievance Officer</h2>
          <p>For any privacy concerns or grievances, please contact our Grievance Officer at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

          <p className="text-sm text-ink-faint">
            This policy is provided as a starting template and should be reviewed and finalised with
            qualified Indian legal counsel before the website goes live.
          </p>
        </div>
      </Section>
    </>
  );
}
