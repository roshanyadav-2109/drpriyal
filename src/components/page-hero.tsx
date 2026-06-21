import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { WaveBand, OrbitRings } from "@/components/decor/motifs";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-sand bg-bone/40", className)}>
      <OrbitRings className="pointer-events-none absolute -right-20 -top-16 size-72 opacity-40" />
      <div className="container-px relative pb-14 pt-14 md:pb-20 md:pt-20">
        {breadcrumb && (
          <Reveal>
            <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink-faint">
              <Link href="/" className="hover:text-pine">
                Home
              </Link>
              {breadcrumb.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" />
                  {b.href ? (
                    <Link href={b.href} className="hover:text-pine">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-ink-soft">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        {eyebrow && (
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-[1.05] md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      <WaveBand className="h-12 w-full" />
    </section>
  );
}
