import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarHeart, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { ServiceIcon } from "@/components/service-icon";
import { HairlineDivider } from "@/components/decor/motifs";
import { Button } from "@/components/ui/button";
import { services, site } from "@/lib/site";
import { blogPosts } from "@/lib/sample-content";
import { serviceImages, img } from "@/lib/images";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service" };
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);
  const related = blogPosts.slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.summary}
        breadcrumb={[{ label: "Services", href: "/services" }, { label: service.title }]}
      />

      <Section>
        <div className="container-px grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div>
            <Reveal>
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg border border-sand shadow-[var(--shadow-soft)]">
                <Image
                  src={serviceImages[service.slug] ?? img.consult}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <span className="inline-flex size-14 items-center justify-center rounded-lg bg-sage-mist text-pine">
                <ServiceIcon name={service.icon} className="size-7" />
              </span>
              <h2 className="mt-6 font-serif text-3xl">What this care covers</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{service.summary}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.points.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-3 rounded-xl border border-sand bg-paper px-4 py-3"
                  >
                    <Check className="size-5 shrink-0 text-pine" />
                    <span className="text-[0.95rem]">{p}</span>
                  </div>
                ))}
              </div>

              <HairlineDivider className="my-10" />

              <h2 className="font-serif text-3xl">What to expect</h2>
              <ol className="mt-6 space-y-5">
                {[
                  "A relaxed conversation about your history, concerns, and goals — no rushing.",
                  "A clear explanation of what's happening and why, in language that makes sense.",
                  "A practical plan tailored to your life, with any tests or follow-up clearly outlined.",
                  "A digital prescription and notes where appropriate, sent to you afterwards.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-2xl text-pine/40">{`0${i + 1}`}</span>
                    <p className="pt-1 text-ink-soft">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Related reading */}
            <Reveal className="mt-12">
              <h3 className="font-serif text-2xl">Related reading</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group rounded-xl border border-sand bg-paper p-5 transition-colors hover:border-pine/30"
                  >
                    <span className="text-xs font-medium text-pine">{p.category}</span>
                    <h4 className="mt-1 font-serif text-lg leading-snug group-hover:text-pine">
                      {p.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="rounded-lg border border-sand bg-paper p-7 shadow-[var(--shadow-soft)]">
                <h3 className="font-serif text-xl">Book this consultation</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Video, audio, chat, or in-clinic — no sign-up needed.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <Button asChild>
                    <Link href={`/book?service=${service.slug}`}>
                      <CalendarHeart /> Book now
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle /> Ask on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-sand bg-bone/50 p-7">
                <h3 className="font-serif text-lg">Other care areas</h3>
                <ul className="mt-4 space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/services/${o.slug}`}
                        className="group flex items-center justify-between gap-2 text-sm text-ink hover:text-pine"
                      >
                        <span className="flex items-center gap-2.5">
                          <ServiceIcon name={o.icon} className="size-4 text-pine" />
                          {o.title}
                        </span>
                        <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
