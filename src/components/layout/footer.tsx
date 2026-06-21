import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { LogoMark } from "./logo";
import { LotusLine } from "@/components/decor/motifs";
import { site, services, legalLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand bg-bone/60">
      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LogoMark className="size-10" />
              <span className="font-serif text-xl text-ink">Dr. Priyal Agarwal</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{site.shortBio}</p>
            <LotusLine className="mt-6 h-10 w-16 opacity-70" />
          </div>

          {/* Explore */}
          <FooterCol title="Explore">
            <FooterLink href="/about">About Dr. Priyal</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/tools">Health Tools</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/book">Book Consultation</FooterLink>
          </FooterCol>

          {/* Care */}
          <FooterCol title="Care Areas">
            {services.slice(0, 6).map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>

          {/* Contact */}
          <FooterCol title="Get in Touch">
            <li className="flex items-start gap-2.5 text-sm text-ink-soft">
              <MapPin className="mt-0.5 size-4 shrink-0 text-pine" />
              <span>{site.city}</span>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-2.5 text-sm text-ink-soft hover:text-pine"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-pine" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone}`}
                className="flex items-start gap-2.5 text-sm text-ink-soft hover:text-pine"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-pine" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-ink-soft hover:text-pine"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-pine" />
                WhatsApp us
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="hairline mt-14" />

        <div className="mt-6 flex flex-col gap-4 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>© {2026} Dr. Priyal Agarwal. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-pine">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-[0.7rem] leading-relaxed text-ink-faint">
          The information on this website is for educational purposes only and is not a substitute
          for professional medical advice, diagnosis, or treatment. In an emergency, call your local
          emergency number or visit the nearest hospital. Online consultations follow India&apos;s
          Telemedicine Practice Guidelines.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow eyebrow--center mb-4 before:hidden">{title}</h4>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ink-soft transition-colors hover:text-pine">
        {children}
      </Link>
    </li>
  );
}
