import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const nunito = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pulsewatch.app";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PulseWatch — #1 Real-Time Website & API Uptime Monitoring",
    template: "%s | PulseWatch Uptime Monitoring",
  },
  description:
    "Know the second your website or API goes down. PulseWatch delivers 30-second multi-region checks, instant downtime alerts via email & webhooks, SSL expiration monitoring, and transparent public status pages. Free plan available.",
  keywords: [
    "website uptime monitoring",
    "api monitoring tool",
    "server downtime alerts",
    "free uptime monitor",
    "website downtime checker",
    "status page generator",
    "ssl certificate monitor",
    "synthetic monitoring",
    "cron job monitoring",
    "betterstack alternative",
    "uptimerobot alternative",
    "cronitor alternative",
    "pingdom alternative",
    "http health check",
    "endpoint latency monitoring",
    "pulsewatch",
  ],
  authors: [{ name: "PulseWatch Team", url: siteUrl }],
  creator: "PulseWatch",
  publisher: "PulseWatch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PulseWatch",
    title: "PulseWatch — #1 Real-Time Website & API Uptime Monitoring",
    description:
      "Continuous 30-second checks, instant failover alerting, multi-region probing, and public status pages for your web apps and APIs.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PulseWatch Uptime Monitoring Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseWatch — #1 Real-Time Website & API Uptime Monitoring",
    description:
      "Continuous 30-second checks, instant failover alerting, multi-region probing, and public status pages for your web apps and APIs.",
    images: [`${siteUrl}/opengraph-image`],
    creator: "@pulsewatch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${nunito.variable} h-full antialiased`}>
      <head>
        <JsonLd />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
