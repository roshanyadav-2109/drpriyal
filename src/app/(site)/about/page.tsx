import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarHeart } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { DoctorPortrait } from "@/components/doctor-portrait";
import { Artifact } from "@/components/decor/artifacts";
import { HairlineDivider } from "@/components/decor/motifs";
import { Button } from "@/components/ui/button";
import { valuePoints } from "@/lib/sample-content";

export const metadata: Metadata = {
  title: "About Dr. Priyal Agarwal",
  description:
    "Obstetrician–gynaecologist and founder of WomanHood, Dr. Priyal Agarwal is committed to accessible, compassionate, evidence-based women's health care.",
};

const journey = [
  { year: "Education", title: "MBBS — GMCH, Guwahati", body: "Trained at Gauhati Medical College & Hospital, one of the North-East's leading institutions." },
  { year: "Pandemic", title: "Rural community service", body: "Cared for women in underserved communities across Assam and West Bengal during COVID-19." },
  { year: "Hospital", title: "Medical Officer", body: "Served as a Medical Officer at Maharaja Agrasen Hospital." },
  { year: "Specialisation", title: "OB-GYN training, CMH Bengaluru", body: "Pursuing postgraduate training in Obstetrics & Gynaecology." },
  { year: "Mission", title: "Founder & CEO, WomanHood", body: "Building a venture dedicated to elevating women's health and access to care." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet your doctor"
        title={
          <>
            Compassionate care, rooted in a{" "}
            <span className="italic text-pine">genuine mission</span>.
          </>
        }
        description="Dr. Priyal Agarwal is an obstetrician–gynaecologist and the founder of WomanHood — driven by a belief that every woman deserves care that is informed, dignified, and kind."
        breadcrumb={[{ label: "About" }]}
      />

      {/* Intro */}
      <Section>
        <div className="container-px grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <DoctorPortrait className="mx-auto max-w-sm" />
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Her story</span>
              <h2 className="mt-4 font-serif text-3xl md:text-[2.4rem]">
                A doctor who believes good care begins with listening.
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
                <p>
                  Dr. Priyal Agarwal earned her MBBS from Gauhati Medical College & Hospital in
                  Guwahati. During the COVID-19 pandemic, she chose to serve women in rural
                  communities across Assam and West Bengal — an experience that shaped her
                  conviction that quality women&apos;s health care should reach everyone, everywhere.
                </p>
                <p>
                  Today, she is pursuing specialist training in Obstetrics & Gynaecology in
                  Bengaluru, and is the founder and CEO of <strong>WomanHood</strong>, a venture
                  dedicated to elevating women&apos;s health and well-being.
                </p>
                <p>
                  Her approach is calm, modern, and evidence-based — and above all, human. You will
                  never feel rushed, judged, or talked down to.
                </p>
              </div>
              <HairlineDivider className="my-8 max-w-md" />
              <Button asChild>
                <Link href="/book">
                  <CalendarHeart /> Book a Consultation
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Journey timeline */}
      <Section className="bg-bone/50">
        <div className="container-px">
          <SectionHeading eyebrow="The journey" title="A path shaped by purpose" />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-sand bg-sand md:grid-cols-5">
            {journey.map((j) => (
              <Reveal key={j.title} className="flex flex-col bg-paper p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
                  {j.year}
                </span>
                <h3 className="mt-3 font-serif text-lg leading-snug">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{j.body}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-faint">
            Credentials shown reflect verified public information. Sub-specialty services are offered
            as consultative guidance.
          </p>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <div className="container-px">
          <SectionHeading align="center" eyebrow="What guides her care" title="Principles you can feel in every consultation" />
          <StaggerGroup className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valuePoints.map((v) => (
              <StaggerItem key={v.title} className="text-center">
                <Artifact name={v.icon} className="mx-auto size-16" />
                <h3 className="mt-5 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal className="mt-14 text-center">
            <Button asChild variant="outline">
              <Link href="/services">
                Explore her services <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
