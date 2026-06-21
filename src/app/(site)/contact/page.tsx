import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dr. Priyal Agarwal's practice — book a consultation, ask a question, or reach us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="We're here to help"
        title="Get in touch"
        description="Have a question or want to book a consultation? Reach out — we'll respond with care."
        breadcrumb={[{ label: "Contact" }]}
      />

      <Section>
        <div className="container-px grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2 className="font-serif text-2xl">Send us a message</h2>
            <p className="mt-2 text-ink-soft">
              Fill in a few details and we&apos;ll continue the conversation on WhatsApp.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-sand bg-paper p-8 shadow-[var(--shadow-soft)]">
              <h2 className="font-serif text-2xl">Reach us directly</h2>
              <ul className="mt-6 space-y-5">
                <ContactRow icon={<MapPin />} label="Clinic">
                  {site.city}
                  <span className="block text-xs text-ink-faint">
                    Full clinic address to be confirmed
                  </span>
                </ContactRow>
                <ContactRow icon={<Phone />} label="Phone" href={`tel:${site.phone}`}>
                  {site.phoneDisplay}
                </ContactRow>
                <ContactRow icon={<Mail />} label="Email" href={`mailto:${site.email}`}>
                  {site.email}
                </ContactRow>
                <ContactRow
                  icon={<MessageCircle />}
                  label="WhatsApp"
                  href={`https://wa.me/${site.whatsapp}`}
                >
                  Chat with our team
                </ContactRow>
                <ContactRow icon={<Clock />} label="Consultation hours">
                  By appointment · Mon–Sat
                </ContactRow>
              </ul>

              <div className="mt-8 overflow-hidden rounded-xl border border-sand">
                <div className="flex aspect-video items-center justify-center bg-sage-mist text-sm text-pine">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4" /> Map — add clinic location
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-sage-mist text-pine [&_svg]:size-4">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
        <div className="text-[0.97rem] text-ink">{children}</div>
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80">
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
