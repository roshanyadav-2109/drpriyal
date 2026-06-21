import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarHeart, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { HairlineDivider } from "@/components/decor/motifs";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import Image from "next/image";
import { blogPosts, type BlogBlock } from "@/lib/sample-content";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { img, blogImages } from "@/lib/images";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "h2") return <h2>{block.text}</h2>;
  if (block.type === "ul")
    return (
      <ul>
        {block.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  return <p>{block.text}</p>;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);
  const fallbackRelated = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const show = related.length ? related : fallbackRelated;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        {/* Header */}
        <div className="border-b border-sand bg-bone/40">
          <div className="container-narrow px-5 py-14 md:py-20">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-pine"
              >
                <ArrowLeft className="size-4" /> Back to blog
              </Link>
              <p className="eyebrow mt-6">{post.category}</p>
              <h1 className="mt-4 text-balance font-serif text-4xl leading-[1.08] md:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
                <LogoMark className="size-9" />
                <div>
                  <p className="font-medium text-ink">{post.author}</p>
                  <p className="flex items-center gap-2 text-xs text-ink-faint">
                    {formatDate(post.date)}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {post.readingMinutes} min read
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Cover */}
        <div className="relative h-64 overflow-hidden md:h-96">
          <Image
            src={blogImages[post.category] ?? img.rose}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Body */}
        <Section className="pt-12">
          <div className="container-narrow px-5">
            <div className="prose-doc">
              <p className="text-lg text-ink">{post.excerpt}</p>
              {post.body.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-sand bg-bone/40 p-5 text-sm text-ink-soft">
              This article is for general information and isn&apos;t a substitute for personal medical
              advice. If something doesn&apos;t feel right, please{" "}
              <Link href="/book" className="text-pine underline">
                book a consultation
              </Link>
              .
            </div>

            <HairlineDivider className="my-12" />

            {/* CTA */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-sage-mist to-bone p-8 text-center grain">
              <h3 className="font-serif text-2xl">Have a question about this?</h3>
              <p className="mx-auto mt-2 max-w-md text-ink-soft">
                Talk it through with Dr. Priyal in a private consultation.
              </p>
              <Button asChild className="mt-5">
                <Link href="/book">
                  <CalendarHeart /> Book a Consultation
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </article>

      {/* Related */}
      <Section className="pt-0">
        <div className="container-px">
          <h2 className="font-serif text-2xl">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {show.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex items-center gap-5 rounded-lg border border-sand bg-paper p-5 transition-colors hover:border-pine/40"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={blogImages[p.category] ?? img.rose}
                    alt={p.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-pine">{p.category}</span>
                  <h3 className="mt-1 font-serif text-lg leading-snug group-hover:text-pine">
                    {p.title}
                  </h3>
                </div>
                <ArrowRight className="ml-auto size-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
