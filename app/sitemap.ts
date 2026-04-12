import type { MetadataRoute } from "next";
import { getAllEssays, getThoughts, getAllGallerySlugs } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://valueyonder.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/essays`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/thoughts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/seeing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/reading`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const essayRoutes: MetadataRoute.Sitemap = getAllEssays().map((essay) => ({
    url: `${base}/essays/${essay.section}/${essay.slug}`,
    lastModified: essay.date ? new Date(essay.date) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const thoughtRoutes: MetadataRoute.Sitemap = getThoughts().map((thought) => ({
    url: `${base}/thoughts/${thought.slug}`,
    lastModified: thought.date ? new Date(thought.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const galleryRoutes: MetadataRoute.Sitemap = getAllGallerySlugs().map((slug) => ({
    url: `${base}/seeing/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...essayRoutes, ...thoughtRoutes, ...galleryRoutes];
}
