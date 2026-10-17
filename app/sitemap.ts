import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pulsewatch.app";

  // Core high-priority landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic public status pages for SEO indexing
  try {
    const publicMonitors = await prisma.monitor.findMany({
      where: { isPublic: true },
      select: { slug: true, createdAt: true, lastCheckedAt: true },
      take: 500,
    });

    const statusRoutes: MetadataRoute.Sitemap = publicMonitors.map((m) => ({
      url: `${baseUrl}/status/${m.slug}`,
      lastModified: m.lastCheckedAt ?? m.createdAt,
      changeFrequency: "always",
      priority: 0.7,
    }));

    return [...staticRoutes, ...statusRoutes];
  } catch {
    return staticRoutes;
  }
}
