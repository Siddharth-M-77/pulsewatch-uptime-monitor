import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pulsewatch.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/status/*", "/login", "/register"],
        disallow: [
          "/api/*",
          "/dashboard/*",
          "/dashboard",
          "/_next/*",
          "/admin/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/status/*"],
        disallow: ["/api/*", "/dashboard/*"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/status/*"],
        disallow: ["/api/*", "/dashboard/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
