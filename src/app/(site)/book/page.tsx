import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a video, audio, chat, or in-clinic consultation with Dr. Priyal Agarwal. No sign-up needed — secure payment in INR.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Book in minutes"
        title="Book your consultation"
        description="Choose how you'd like to meet, pick a time, and you're set — no account required."
        breadcrumb={[{ label: "Book" }]}
      />
      <Section className="pt-12">
        <div className="container-px">
          <BookingFlow initialService={service} />
        </div>
      </Section>
    </>
  );
}
