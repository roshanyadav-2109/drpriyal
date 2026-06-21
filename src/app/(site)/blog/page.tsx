import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { blogPosts, blogCategories } from "@/lib/sample-content";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { img, blogImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Honest, evidence-based women's health writing by Dr. Priyal Agarwal — pregnancy, periods, PCOS, fertility, menopause, and wellness.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = cat && blogCategories.includes(cat as (typeof blogCategories)[number]) ? cat : null;
  const posts = active ? blogPosts.filter((p) => p.category === active) : blogPosts;

  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Women's health, written to be understood"
        description="Clear, compassionate, evidence-based articles to help you make confident decisions about your body."
        breadcrumb={[{ label: "Blog" }]}
      />

      <Section className="pt-12">
        <div className="container-px">
          {/* Category filter */}
          <div className="mb-10 flex flex-wrap gap-2">
            <FilterChip href="/blog" active={!active}>
              All
            </FilterChip>
            {blogCategories.map((c) => (
              <FilterChip key={c} href={`/blog?cat=${encodeURIComponent(c)}`} active={active === c}>
                {c}
              </FilterChip>
            ))}
          </div>

          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand bg-paper shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-pine/40 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative h-48 overflow-hidden">
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
                    <h2 className="font-serif text-xl leading-snug transition-colors group-hover:text-pine">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.excerpt}</p>
                    <p className="mt-4 text-xs text-ink-faint">
                      {formatDate(p.date)} · {p.readingMinutes} min read
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {posts.length === 0 && (
            <p className="py-16 text-center text-ink-soft">No articles in this category yet.</p>
          )}
        </div>
      </Section>
    </>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-pine bg-pine text-ivory"
          : "border-sand text-ink-soft hover:border-pine/40 hover:text-pine",
      )}
    >
      {children}
    </Link>
  );
}
