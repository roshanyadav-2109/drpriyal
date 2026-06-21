import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function Section({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", align === "center" && "eyebrow--center")}>{eyebrow}</span>
      )}
      <Heading
        className={cn(
          "mt-4 text-balance font-serif",
          Heading === "h1"
            ? "text-4xl leading-[1.05] md:text-6xl"
            : "text-3xl md:text-[2.6rem]",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-ink-soft text-pretty">{description}</p>
      )}
    </Reveal>
  );
}
