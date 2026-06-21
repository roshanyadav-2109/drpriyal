import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/sample-content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about consultations, trackers, payments, and privacy at Dr. Priyal Agarwal's practice.",
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="Questions, answered"
        title="Frequently asked questions"
        description="Everything you might want to know before booking. Can't find your answer? Just message us."
        breadcrumb={[{ label: "FAQ" }]}
      />

      <Section>
        <div className="container-narrow px-5">
          {categories.map((cat) => (
            <Reveal key={cat} className="mb-12">
              <h2 className="eyebrow mb-2">{cat}</h2>
              <Accordion type="single" collapsible className="mt-2">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((f, i) => (
                    <AccordionItem key={f.question} value={`${cat}-${i}`}>
                      <AccordionTrigger>{f.question}</AccordionTrigger>
                      <AccordionContent>{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </Reveal>
          ))}

          <Reveal className="mt-4 rounded-2xl border border-sand bg-bone/50 p-8 text-center">
            <h3 className="font-serif text-2xl">Still have a question?</h3>
            <p className="mx-auto mt-2 max-w-md text-ink-soft">
              We&apos;re happy to help. Reach out and we&apos;ll get back to you.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/book">Book a consultation</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
