import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarHeart, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site";
import { serviceImages, img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Women's health services with Dr. Priyal Agarwal — pregnancy & antenatal care, period and menstrual health, PCOS support, fertility, adolescent and menopause care.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Areas of care"
        title="Care for every chapter of your health"
        description="From adolescence through pregnancy, motherhood, and midlife — thoughtful, personalised consultation and guidance."
        breadcrumb={[{ label: "Services" }]}
      />

      <Section>
        <div className="container-px">
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand bg-paper shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-pine/40 hover:shadow-[var(--shadow-card)]">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={serviceImages[s.slug] ?? img.consult}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-paper/95 text-pine">
                        <ServiceIcon name={s.icon} className="size-5" />
                      </span>
                      <h2 className="font-serif text-2xl text-ivory">{s.title}</h2>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                  <p className="text-[0.97rem] leading-relaxed text-ink-soft">{s.summary}</p>
                  <ul className="mt-5 grid grid-cols-2 gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-ink">
                        <Check className="size-4 shrink-0 text-pine" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex items-center gap-3">
                    <Button asChild size="sm">
                      <Link href={`/services/${s.slug}`}>
                        Learn more <ArrowRight />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/book?service=${s.slug}`}>Book</Link>
                    </Button>
                  </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-16 rounded-xl border border-gold/30 bg-gradient-to-br from-sage-mist to-bone p-10 text-center grain md:p-14">
            <h2 className="mx-auto max-w-xl font-serif text-3xl md:text-4xl">
              Not sure which consultation you need?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ink-soft">
              That&apos;s completely okay. Book a general consultation and Dr. Priyal will guide you
              from there.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/book">
                <CalendarHeart /> Book a Consultation
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
