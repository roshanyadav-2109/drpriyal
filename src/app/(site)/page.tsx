import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarHeart,
  CalendarDays,
  Baby,
  Sparkles,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { DoctorPortrait } from "@/components/doctor-portrait";
import { ServiceIcon } from "@/components/service-icon";
import { Artifact } from "@/components/decor/artifacts";
import { WaveBand, HairlineDivider, OrbitRings } from "@/components/decor/motifs";
import { services, credentials, trustPoints, site } from "@/lib/site";
import { consultSteps, valuePoints, blogPosts } from "@/lib/sample-content";
import { formatDate } from "@/lib/utils";
import { img, serviceImages, blogImages } from "@/lib/images";

export default function HomePage() {
  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden">
        <OrbitRings className="pointer-events-none absolute -left-24 top-10 size-72 opacity-40" />
        <div className="container-px relative grid items-center gap-14 pb-16 pt-16 lg:grid-cols-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Women&apos;s health, with warmth</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-balance font-serif text-[2.6rem] leading-[1.04] md:text-6xl lg:text-[4rem]">
                Care that understands{" "}
                <span className="italic text-pine">every woman</span>, at every stage.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
                Online consultations, gentle guidance, and tools you can trust — from your first
                period to pregnancy, PCOS, and beyond. With Dr. Priyal Agarwal.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="accent">
                  <Link href="/book">
                    <CalendarHeart />
                    Book a Consultation
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">
                    Explore Services
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-pine" /> No sign-up needed
                </span>
                <span className="inline-flex items-center gap-2">
                  <Stethoscope className="size-4 text-pine" /> Evidence-based care
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-pine" /> English &amp; हिंदी
                </span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <DoctorPortrait priority className="mx-auto max-w-sm" />
            </Reveal>
          </div>
        </div>
        <WaveBand className="h-16 w-full md:h-24" />
      </section>

      {/* ───────────────── Trust strip ───────────────── */}
      <div className="border-y border-sand bg-bone/50">
        <div className="container-px grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {trustPoints.map((t) => (
            <div key={t.label} className="text-center">
              <p className="stat-num text-2xl md:text-3xl">{t.stat}</p>
              <p className="mt-1 text-xs text-ink-soft md:text-sm">{t.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── Services ───────────────── */}
      <Section>
        <div className="container-px">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Areas of care"
              title="Support for every chapter of women's health"
              description="Thoughtful, personalised care across the moments that matter most."
            />
            <Reveal delay={0.1}>
              <Button asChild variant="ghost" className="shrink-0">
                <Link href="/services">
                  All services <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>

          <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand bg-paper shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-pine/40 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={serviceImages[s.slug] ?? img.consult}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex size-10 items-center justify-center rounded-md bg-paper/95 text-pine shadow-sm">
                      <ServiceIcon name={s.icon} className="size-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl">{s.title}</h3>
                    <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                      {s.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-pine">
                      Learn more
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* ───────────────── How online consultation works ───────────────── */}
      <Section>
        <div className="mx-auto w-[92%] max-w-[88rem] rounded-2xl bg-pine px-6 py-14 text-ivory/90 md:px-12 md:py-16">
          <SectionHeading
            eyebrow="How it works"
            title={<span className="text-ivory">A consultation in four calm steps</span>}
            description={
              <span className="text-ivory/70">
                Designed to be simple — especially if you&apos;ve never consulted online before.
              </span>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultSteps.map((s) => (
              <Reveal key={s.step} className="rounded-lg border border-ivory/15 bg-ivory/5 p-7">
                <span className="text-4xl font-semibold tracking-tight text-sage-soft">{s.step}</span>
                <h3 className="mt-4 text-xl text-ivory">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10">
            <Button asChild size="lg" variant="secondary">
              <Link href="/book">
                Book your consultation <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* ───────────────── Free tools ───────────────── */}
      <Section>
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Free, private tools</span>
            <h2 className="mt-4 font-serif text-3xl md:text-[2.6rem]">
              Track your cycle and pregnancy — privately, on your device.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              No sign-up, no data leaving your phone unless you choose to share it. Understand your
              body with tools built by a doctor who actually cares about your privacy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/tools/period-tracker">
                  <CalendarDays /> Period Tracker
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tools/pregnancy-tracker">
                  <Baby /> Pregnancy Tracker
                </Link>
              </Button>
            </div>
          </Reveal>

          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Period Tracker", desc: "Predict your next period, fertile window, and log symptoms.", href: "/tools/period-tracker", icon: "calendar-heart" },
              { title: "Pregnancy Tracker", desc: "Week-by-week updates, kick counter, and visit reminders.", href: "/tools/pregnancy-tracker", icon: "baby" },
              { title: "Due-Date Calculator", desc: "Find your estimated delivery date in seconds.", href: "/tools/due-date-calculator", icon: "infinity" },
              { title: "Ovulation Guide", desc: "Understand your most fertile days for planning.", href: "/tools/period-tracker", icon: "sprout" },
            ].map((t, i) => (
              <StaggerItem key={t.title}>
                <Link
                  href={t.href}
                  className={`group block h-full rounded-2xl border border-sand/80 bg-paper p-6 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] ${i % 2 === 1 ? "sm:mt-8" : ""}`}
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blush/40 text-clay">
                    <ServiceIcon name={t.icon} />
                  </span>
                  <h3 className="mt-4 font-serif text-lg">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{t.desc}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* ───────────────── Mission / about teaser ───────────────── */}
      <Section className="bg-bone/60">
        <div className="container-px grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -left-3 -top-3 hidden h-full w-full rounded-md border border-gold/40 sm:block" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-md border border-sand shadow-[var(--shadow-card)]">
                <Image
                  src={img.consult}
                  alt="Dr. Priyal Agarwal in consultation with a patient"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Meet Dr. Priyal</span>
              <h2 className="mt-4 font-serif text-3xl md:text-[2.6rem]">
                A doctor on a mission to make women&apos;s health accessible.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                An obstetrician–gynaecologist and founder of <strong>WomanHood</strong>, Dr. Priyal
                Agarwal has cared for women across rural and urban India — including underserved
                communities during the pandemic. Her belief is simple: every woman deserves care
                that is informed, dignified, and kind.
              </p>
              <HairlineDivider className="my-8 max-w-md" />
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {credentials.map((c) => (
                  <li key={c.label} className="flex flex-col">
                    <span className="font-serif text-lg text-pine">{c.label}</span>
                    <span className="text-sm text-ink-soft">{c.detail}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" className="mt-8">
                <Link href="/about">
                  Read her full story <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ───────────────── Values ───────────────── */}
      <Section>
        <div className="container-px">
          <SectionHeading
            align="center"
            eyebrow="Why women choose this practice"
            title="The kind of care you've been looking for"
          />
          <StaggerGroup className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valuePoints.map((v) => (
              <StaggerItem key={v.title} className="text-center">
                <Artifact name={v.icon} className="mx-auto size-16" />
                <h3 className="mt-5 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* ───────────────── Blog preview ───────────────── */}
      <Section>
        <div className="container-px">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="From the journal"
              title="Honest, readable women's health writing"
              description="Evidence-based articles to help you make confident decisions."
            />
            <Reveal delay={0.1}>
              <Button asChild variant="ghost" className="shrink-0">
                <Link href="/blog">
                  Read the blog <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand bg-paper shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-pine/40 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={blogImages[p.category] ?? img.rose}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 rounded-md bg-paper/95 px-3 py-1 text-xs font-medium text-pine">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl leading-snug transition-colors group-hover:text-pine">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.excerpt}</p>
                    <p className="mt-4 text-xs text-ink-faint">
                      {formatDate(p.date)} · {p.readingMinutes} min read
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* ───────────────── Final CTA ───────────────── */}
      <Section className="pb-28">
        <div className="container-px">
          <Reveal className="relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-br from-sage-mist via-bone to-blush/30 px-8 py-16 text-center grain md:px-16 md:py-20">
            <OrbitRings className="pointer-events-none absolute -right-16 -top-16 size-64 opacity-50" />
            <span className="eyebrow eyebrow--center">Ready when you are</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl md:text-5xl">
              Your health questions deserve real answers.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Book a private consultation with Dr. Priyal — no account, no waiting room, no judgement.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href="/book">
                  <CalendarHeart /> Book Consultation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
