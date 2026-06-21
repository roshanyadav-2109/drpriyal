import type { MetadataRoute } from "next";
import { services } from "@/lib/site";
import { blogPosts } from "@/lib/sample-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyalagarwal.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/tools",
    "/tools/period-tracker",
    "/tools/pregnancy-tracker",
    "/tools/due-date-calculator",
    "/blog",
    "/contact",
    "/faq",
    "/book",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/disclaimer",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
