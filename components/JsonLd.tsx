export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pulsewatch.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PulseWatch",
    url: baseUrl,
    description:
      "Real-time website, server and API uptime monitoring with 30-second multi-region checks, instant downtime alerting, and public status pages.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PulseWatch",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cloud, Web, Linux, Windows, macOS",
    url: baseUrl,
    description:
      "Enterprise-grade uptime monitoring platform for web applications, APIs, and microservices. Spot downtimes before users notice with instant alerts.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        name: "Free Forever Plan",
        description: "Up to 5 monitors, 1-minute checks, email alerts, public status pages.",
      },
      {
        "@type": "Offer",
        price: "499",
        priceCurrency: "INR",
        name: "Pro Plan",
        description: "Up to 25 monitors, 30-second checks, priority alerting, SSL monitoring.",
      },
      {
        "@type": "Offer",
        price: "1499",
        priceCurrency: "INR",
        name: "Business Plan",
        description: "Unlimited monitors, custom status domains, webhook routing, team access.",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "348",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "30-second interval checks",
      "Multi-region edge synthetic checks",
      "Instant email and webhook failure notifications",
      "Hosted public status pages with custom branding",
      "SSL certificate expiration tracking",
      "Response time latency diagnostics and heatmaps",
      "Zero-false-alarm failure sensitivity tuning",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is PulseWatch and how does uptime monitoring work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PulseWatch is an uptime and API reliability platform that continuously probes your websites, endpoints, and web services from multiple global edge locations. When your server fails to return a valid HTTP 2xx or 3xx code, or times out, PulseWatch immediately detects the outage and fires instant alerts to your email and webhooks.",
        },
      },
      {
        "@type": "Question",
        name: "How fast does PulseWatch detect website downtime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PulseWatch checks endpoints as frequently as every 30 seconds. In the event of a server crash, DNS issue, or HTTP 500 error, an incident is triggered and alerted within 30 to 60 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a completely free plan available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PulseWatch offers a 100% Free Forever plan with 5 monitors, 60-second checks, email alerts, and public status pages without requiring any credit card.",
        },
      },
      {
        "@type": "Question",
        name: "How does PulseWatch compare to BetterStack, UptimeRobot, and Cronitor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PulseWatch provides modern developer-first aesthetics, faster 30-second checks on affordable plans, built-in SSL tracking, hosted status pages, and zero bloated pricing compared to traditional monitoring tools.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share a live public status page with my users?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Any monitor can be set to public with one click, providing a shareable live status page showing real-time operational status, uptime percentage, and incident history.",
        },
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PulseWatch",
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    sameAs: [
      "https://twitter.com/pulsewatch",
      "https://github.com/pulsewatch",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
