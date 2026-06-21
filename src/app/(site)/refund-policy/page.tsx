import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Our policy on consultation cancellations, rescheduling, and refunds.",
};

export default function RefundPage() {
  return (
    <>
      <PageHero
        eyebrow="Fair & transparent"
        title="Refund & Cancellation Policy"
        breadcrumb={[{ label: "Refund Policy" }]}
      />
      <Section>
        <div className="container-narrow px-5 prose-doc">
          <p className="text-sm text-ink-faint">Last updated: June 2026</p>
          <p>We want booking with us to feel risk-free. Here&apos;s how cancellations, rescheduling, and refunds work.</p>

          <h2>Rescheduling</h2>
          <p>You can reschedule a consultation free of charge up to 4 hours before the appointment, subject to availability.</p>

          <h2>Cancellations & refunds</h2>
          <ul>
            <li><strong>More than 24 hours before:</strong> full refund.</li>
            <li><strong>4–24 hours before:</strong> partial refund (a small processing fee may apply).</li>
            <li><strong>Less than 4 hours before / no-show:</strong> generally non-refundable.</li>
          </ul>

          <h2>If the doctor cancels</h2>
          <p>If a consultation is cancelled or significantly delayed from our side, you may choose a full refund or a rescheduled appointment at no extra cost.</p>

          <h2>Technical issues</h2>
          <p>If a consultation cannot proceed due to a technical failure on our side, we will reschedule it or issue a full refund.</p>

          <h2>How refunds are processed</h2>
          <p>Approved refunds are returned to your original payment method, typically within 5–7 business days. To request a refund, contact us at <a href={`mailto:${site.email}`}>{site.email}</a> with your booking reference.</p>

          <p className="text-sm text-ink-faint">This policy is a starting template; finalise the exact windows and fees with your team and legal counsel.</p>
        </div>
      </Section>
    </>
  );
}
