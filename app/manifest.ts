import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PulseWatch — Real-Time Website & API Monitoring",
    short_name: "PulseWatch",
    description:
      "Instant downtime alerting, 30s checks, global latency monitoring and public status pages for your web apps and APIs.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    categories: ["developer", "utilities", "monitoring", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
