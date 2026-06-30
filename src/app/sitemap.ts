import type { MetadataRoute } from "next";
import { discoverTrainSlugsForSitemap } from "@/lib/build-trains";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://traindekho.live";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/train-schedule`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  let trainPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await discoverTrainSlugsForSitemap();
    trainPages = slugs.map((slug) => ({
      url: `${base}/train-schedule/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // API unavailable during build — static pages still included
  }

  return [...staticPages, ...trainPages];
}
