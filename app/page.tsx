import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ORDERED_PLANS } from "@/lib/plans";
import {
  IconPulse,
  IconBell,
  IconGlobe,
  IconClock,
  IconShield,
  IconChart,
  IconCheck,
  IconArrow,
  IconServer,
} from "@/components/Icons";
import {
  Activity,
  Zap,
  Globe2,
  ShieldCheck,
  BellRing,
  Cpu,
  BarChart2,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex-1 relative bg-[var(--background)]">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--surface)]/90 border-b border-[var(--border)] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <IconPulse size={16} />
            </span>
            <span className="text-[var(--foreground)] font-extrabold">PulseWatch</span>
          </Link>
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
            <Link href="#features" className="btn btn-ghost hidden md:inline-flex !border-transparent !bg-transparent text-xs font-semibold">
              Features
            </Link>
            <Link href="#how" className="btn btn-ghost hidden md:inline-flex !border-transparent !bg-transparent text-xs font-semibold">
              How It Works
            </Link>
            <Link href="#comparison" className="btn btn-ghost hidden lg:inline-flex !border-transparent !bg-transparent text-xs font-semibold">
              Comparison
            </Link>
            <Link href="#pricing" className="btn btn-ghost hidden sm:inline-flex !border-transparent !bg-transparent text-xs font-semibold">
              Pricing
            </Link>
            <Link href="#faq" className="btn btn-ghost hidden sm:inline-flex !border-transparent !bg-transparent text-xs font-semibold">
              FAQ
            </Link>
            {session ? (
              <Link href="/dashboard" className="btn btn-primary text-xs shadow-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost text-xs shadow-xs">
                  Log in
                </Link>
                <Link href="/register" className="btn btn-primary text-xs shadow-sm">
                  Start Monitoring Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20">
        <div className="mesh">
          <div className="orb" style={{ width: 520, height: 520, left: "-8%", top: "-10%", background: "#10b981" }} />
          <div className="orb" style={{ width: 480, height: 480, right: "-6%", top: "4%", background: "#0284c7" }} />
          <div className="grid-bg" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <article className="rise">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 mb-5 shadow-xs">
              <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-emerald-600" />
              #1 Real-Time Uptime &amp; API Health Monitoring
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[var(--foreground)]">
              Real-Time Website &amp; <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                API Uptime Monitoring
              </span>
            </h1>

            <p className="text-[var(--muted)] text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
              Know the exact second your website, REST API, or server goes down. PulseWatch probes your endpoints from global edge locations every 30 seconds and delivers instant alerts before customers notice.
            </p>

            <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 max-w-lg">
              {[
                "Multi-region checks as fast as 30s",
                "Instant email & webhook downtime alerts",
                "Hosted public status pages with custom slug",
                "SSL certificate expiry tracking & alerts",
                "Heartbeat latency diagnostics heatmaps",
                "Free Forever plan — zero card required",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <IconCheck size={12} className="text-emerald-700" />
                  </span>
                  <span className="text-[var(--foreground)] font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link href="/register" className="btn btn-primary text-sm px-6 py-3 shadow-md">
                Start Monitoring Free <IconArrow size={16} />
              </Link>
              <Link href="#features" className="btn btn-ghost text-sm px-6 py-3 shadow-xs">
                Explore Features &rarr;
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
              <span>★★★★★ 4.9/5 Rating</span>
              <span>·</span>
              <span>Trusted by 300+ developers &amp; founders</span>
            </div>
          </article>

          {/* 3D product shot */}
          <div className="relative rise-2">
            <div className="tilt card p-5 float shadow-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[var(--muted)] text-xs font-mono ml-2">fleet-telemetry · live</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  99.99% FLEET OPERATIONAL
                </span>
              </div>

              {/* mini uptime sparkline */}
              <div className="rounded-xl bg-slate-50 border border-[var(--border)] p-4 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[var(--muted)]">Global Edge Latency (24h)</span>
                  <span className="text-xs font-mono text-emerald-700 font-bold">42ms Avg</span>
                </div>
                <Sparkline />
              </div>

              <div className="space-y-2">
                {[
                  { n: "Production Website (Next.js)", u: "up", ms: "38ms", status: "200 OK" },
                  { n: "Authentication API Gateway", u: "up", ms: "54ms", status: "200 OK" },
                  { n: "Payments & Webhook Receiver", u: "up", ms: "46ms", status: "200 OK" },
                ].map((m) => (
                  <div key={m.n} className="flex items-center justify-between bg-slate-50/80 border border-[var(--border)] rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot shadow-xs" />
                      <span className="text-xs font-bold text-[var(--foreground)]">{m.n}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {m.status}
                      </span>
                      <span className="font-bold text-emerald-700">{m.ms}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating alert card */}
            <div className="absolute -bottom-5 -left-4 sm:-left-8 card bg-white px-4 py-3 flex items-center gap-3 shadow-xl float border border-slate-200" style={{ animationDelay: "1.5s" }}>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--foreground)]">Zero Downtime Detected</div>
                <div className="text-[11px] text-[var(--muted)] font-mono">100% SLA Availability maintained</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST / STATS BAR ===== */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="card grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--border)] bg-[var(--surface)] shadow-xs">
          {[
            { k: "30s", v: "Fastest Probe Interval" },
            { k: "4 Edge Regions", v: "Multi-Region Probing" },
            { k: "< 30s", v: "Mean Time to Alert" },
            { k: "99.99%", v: "Fleet Reliability SLA" },
          ].map((s) => (
            <div key={s.v} className="px-5 py-6 text-center">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">{s.k}</div>
              <div className="text-[var(--muted)] text-xs sm:text-sm mt-1 font-medium">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHAT IS IT ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="eyebrow mb-3">Enterprise Website &amp; Server Monitoring</div>
        <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] leading-tight">
          A Watchtower for Everything You Put Online
        </h2>
        <p className="text-[var(--muted)] text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          You build high-performance web applications, APIs, and online stores. But servers crash, SSL certificates expire, and deploys break at 3 AM. PulseWatch continuously tests your endpoints, measures response times, and <span className="text-[var(--foreground)] font-bold">alerts you the instant an incident occurs</span>.
        </p>
      </section>

      {/* ===== MONITOR TYPES ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="eyebrow mb-2">Synthetic Monitoring Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            What You Can Monitor With PulseWatch
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <IconGlobe size={20} />, t: "Websites & Landing Pages", d: "Continuously check HTTP/HTTPS page availability, status codes, and global edge loading speed." },
            { icon: <IconServer size={20} />, t: "REST & GraphQL APIs", d: "Test API health endpoints, custom status codes (200 OK, 201 Created), and payload timeouts." },
            { icon: <IconClock size={20} />, t: "Background Jobs & Crons", d: "Verify scheduled cloud cron jobs and worker queues are pinging on schedule without silent failure." },
            { icon: <IconShield size={20} />, t: "SSL & TLS Certificates", d: "Track SSL validity and receive automated alerts 30, 14, and 7 days prior to certificate expiry." },
          ].map((m) => (
            <div key={m.t} className="card card-hover p-6 bg-[var(--surface)] shadow-xs">
              <span className="chip mb-4">{m.icon}</span>
              <h3 className="font-bold text-base mb-2 text-[var(--foreground)]">{m.t}</h3>
              <p className="text-[var(--muted)] text-xs leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BETTERSTACK / UPTIMEROBOT COMPARISON (SEO MAGNET) ===== */}
      <section id="comparison" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="eyebrow mb-2">Feature &amp; Value Breakdown</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            The Modern Alternative to Legacy Uptime Tools
          </h2>
          <p className="text-sm text-[var(--muted)] mt-2 max-w-xl mx-auto">
            Why developers and high-growth teams are switching from BetterStack, UptimeRobot, and Pingdom to PulseWatch.
          </p>
        </div>

        <div className="card overflow-x-auto bg-[var(--surface)] shadow-xs border border-[var(--border)]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[var(--muted)] uppercase border-b border-[var(--border)]">
              <tr>
                <th className="py-3.5 px-4">Feature</th>
                <th className="py-3.5 px-4 text-emerald-700 font-bold">PulseWatch</th>
                <th className="py-3.5 px-4">BetterStack</th>
                <th className="py-3.5 px-4">UptimeRobot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="py-3 px-4 font-bold text-[var(--foreground)]">30-Second Check Frequency</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">✓ Included</td>
                <td className="py-3 px-4 text-[var(--muted)]">Paid plan only</td>
                <td className="py-3 px-4 text-[var(--muted)]">60s on Pro</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[var(--foreground)]">Free Forever Plan</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">✓ 5 Monitors Free</td>
                <td className="py-3 px-4 text-[var(--muted)]">Limited</td>
                <td className="py-3 px-4 text-[var(--muted)]">5-minute checks</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[var(--foreground)]">Hosted Public Status Pages</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">✓ Included Free</td>
                <td className="py-3 px-4 text-[var(--muted)]">✓ Yes</td>
                <td className="py-3 px-4 text-[var(--muted)]">Watermarked</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[var(--foreground)]">SSL Expiry Alerting</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">✓ Automated</td>
                <td className="py-3 px-4 text-[var(--muted)]">✓ Yes</td>
                <td className="py-3 px-4 text-[var(--muted)]">Paid add-on</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[var(--foreground)]">Instant &quot;Ping Now&quot; Probing</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">✓ One-Click Realtime</td>
                <td className="py-3 px-4 text-[var(--muted)]">Scheduled only</td>
                <td className="py-3 px-4 text-[var(--muted)]">Scheduled only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="eyebrow mb-2">Fast Setup</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            Live Monitoring in Under 60 Seconds
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: <IconServer size={22} />, t: "1. Add Your Endpoint", d: "Paste your website or API URL, configure your desired HTTP method (GET, POST, HEAD), and select check frequency." },
            { icon: <IconClock size={22} />, t: "2. Cloud Edge Probing", d: "PulseWatch probes your endpoints on schedule from distributed edge nodes, tracking HTTP response codes and latency." },
            { icon: <IconBell size={22} />, t: "3. Instant Alerts & Failover", d: "If an endpoint fails or times out, you receive immediate notifications via email and webhooks with root-cause diagnostic logs." },
          ].map((s, i) => (
            <div key={s.t} className="card card-hover p-6 bg-[var(--surface)] shadow-xs">
              <span className="chip mb-4">{s.icon}</span>
              <h3 className="font-bold text-base mb-2 text-[var(--foreground)]">{s.t}</h3>
              <p className="text-[var(--muted)] text-xs leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-12">
          <div className="eyebrow mb-2">Platform Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            Everything Required for Zero-Downtime Reliability
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <IconClock size={20} />, t: "Automated Edge Probing", d: "Checks as fast as every 30 seconds with custom HTTP methods, headers, and expected status code ranges." },
            { icon: <IconBell size={20} />, t: "Instant Incident Notifications", d: "Get notified via email and webhooks the second an outage begins and when systems recover." },
            { icon: <IconChart size={20} />, t: "Latency Diagnostics & Charts", d: "Interactive response-time charts and 30-bar heartbeat heatmaps to identify latency degradations." },
            { icon: <IconShield size={20} />, t: "Audit Logs & MTTR Tracking", d: "Every downtime incident is logged with timestamp, HTTP error code, and mean time to resolution." },
            { icon: <IconGlobe size={20} />, t: "Public Hosted Status Pages", d: "Share custom live status pages with your customers to build trust and eliminate support tickets." },
            { icon: <IconZapInline />, t: "High-Performance Edge Architecture", d: "Powered by Next.js and Neon PostgreSQL with instant ping triggers and sub-second UI updates." },
          ].map((f) => (
            <div key={f.t} className="card card-hover p-6 bg-[var(--surface)] shadow-xs">
              <span className="chip mb-4">{f.icon}</span>
              <h3 className="font-bold text-base mb-2 text-[var(--foreground)]">{f.t}</h3>
              <p className="text-[var(--muted)] text-xs leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-12">
          <div className="eyebrow mb-2">Transparent Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            Start Free, Scale as Your Fleet Grows
          </h2>
          <p className="text-[var(--muted)] text-sm mt-2">Simple monthly pricing in ₹. Cancel anytime.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 items-start">
          {ORDERED_PLANS.map((plan) => {
            const highlight = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`card p-6 relative bg-[var(--surface)] shadow-xs ${
                  highlight ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : ""
                }`}
              >
                {highlight && (
                  <div className="badge bg-emerald-600 text-white font-bold absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-lg text-[var(--foreground)]">{plan.name}</h3>
                <div className="mt-3 mb-5">
                  <span className="text-4xl font-black font-mono text-[var(--foreground)]">₹{plan.priceInr}</span>
                  <span className="text-[var(--muted)] text-xs font-mono ml-1">/month</span>
                </div>
                <Link
                  href="/register"
                  className={`btn w-full text-xs font-bold ${
                    highlight ? "btn-primary shadow-sm" : "btn-ghost shadow-xs"
                  }`}
                >
                  {plan.priceInr === 0 ? "Get Started Free" : `Choose ${plan.name}`}
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs">
                      <IconCheck size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-[var(--muted)]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="eyebrow mb-2">Frequently Asked Questions</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">
            Everything You Need to Know
          </h2>
        </div>
        <div className="space-y-3">
          {[
            {
              q: "What types of endpoints can I monitor with PulseWatch?",
              a: "You can monitor any HTTP or HTTPS endpoint including websites, SaaS landing pages, REST API routes, GraphQL endpoints, webhook receivers, and health check URLs. If it responds over the web, PulseWatch can test it.",
            },
            {
              q: "How fast do downtime alerts get triggered?",
              a: "On our 30-second and 60-second plans, the moment an endpoint fails to return a valid HTTP status or times out, PulseWatch logs an incident and sends instant alerts to your email and webhooks typically within 30 to 60 seconds.",
            },
            {
              q: "Is the Free plan really free forever?",
              a: "Yes. PulseWatch offers a 100% Free Forever plan with 5 monitors, 60-second checks, email alerts, and hosted public status pages with zero credit card required.",
            },
            {
              q: "Can I host a public status page on my own domain?",
              a: "Every monitor can be toggled to a public status page instantly with a shareable URL (/status/your-slug). Custom domain mapping is supported on our Business tier.",
            },
            {
              q: "How does PulseWatch prevent false alarms?",
              a: "PulseWatch uses configurable timeouts (5s to 30s) and multi-region validation to ensure transient network blips do not cause alert fatigue.",
            },
          ].map((f) => (
            <details key={f.q} className="card p-5 group bg-[var(--surface)] shadow-xs">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-[var(--foreground)] list-none">
                {f.q}
                <span className="text-emerald-700 transition-transform group-open:rotate-45 shrink-0 ml-2">
                  <IconPlusInline />
                </span>
              </summary>
              <p className="text-[var(--muted)] text-xs mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden card p-10 sm:p-14 text-center bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 shadow-sm">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
              Never Get Caught Off-Guard by Downtime Again.
            </h2>
            <p className="text-[var(--muted)] text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
              Join hundreds of developers who rely on PulseWatch for 24/7 endpoint reliability and instant alerting.
            </p>
            <Link href="/register" className="btn btn-primary text-sm px-7 py-3 mt-6 inline-flex shadow-md font-bold">
              Start Monitoring Free (Zero Card Needed) <IconArrow size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--surface)] text-xs text-[var(--muted)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
            <span className="chip !w-6 !h-6 !rounded-md"><IconPulse size={14} /></span>
            PulseWatch Uptime Platform
          </div>
          <div className="flex items-center gap-4">
            <Link href="#features" className="hover:text-[var(--foreground)]">Features</Link>
            <Link href="#pricing" className="hover:text-[var(--foreground)]">Pricing</Link>
            <Link href="#faq" className="hover:text-[var(--foreground)]">FAQ</Link>
            <Link href="/login" className="hover:text-[var(--foreground)]">Login</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} PulseWatch. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}

function Sparkline() {
  const d = "M0 46 L24 40 L48 44 L72 30 L96 34 L120 20 L144 26 L168 14 L192 22 L216 10 L240 16";
  return (
    <svg viewBox="0 0 240 56" className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#059669" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${d} L240 56 L0 56 Z`} fill="url(#spark)" />
      <path
        d={d}
        fill="none"
        stroke="#059669"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset="600"
        style={{ animation: "dash 2s ease forwards" }}
      />
    </svg>
  );
}

function IconZapInline() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}

function IconPlusInline() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
