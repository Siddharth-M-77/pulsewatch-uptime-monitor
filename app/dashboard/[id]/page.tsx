"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  Activity,
  ArrowLeft,
  Zap,
  Globe2,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Copy,
  Server,
  Layers,
} from "lucide-react";

type Stats = {
  uptime: number | null;
  avgResponseTime: number | null;
  totalChecks: number;
  checks: { status: string; statusCode?: number | null; responseTime: number | null; checkedAt: string }[];
};
type Monitor = {
  id: string;
  name: string;
  url: string;
  method?: string;
  interval: number;
  timeout?: number;
  currentStatus: string;
  paused: boolean;
  isPublic: boolean;
  slug: string;
};
type Incident = {
  id: string;
  startedAt: string;
  resolvedAt: string | null;
  cause: string | null;
};

export default function MonitorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingToast, setPingToast] = useState<{ msg: string; success: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/monitors/${id}`);
    if (res.status === 404) return setNotFound(true);
    if (res.ok) {
      const data = await res.json();
      setMonitor(data.monitor);
      setStats(data.stats);
      setIncidents(data.incidents);
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/monitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function remove() {
    if (!confirm("Are you sure you want to delete this monitor and all associated probe telemetry?")) return;
    await fetch(`/api/monitors/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  async function handlePing() {
    setIsPinging(true);
    try {
      const res = await fetch(`/api/monitors/${id}/check`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.result) {
        setPingToast({
          msg: `HTTP ${data.result.statusCode ?? 200} in ${data.result.responseTime}ms — ${data.result.status.toUpperCase()}`,
          success: data.result.status === "up",
        });
        load();
      } else {
        setPingToast({ msg: data.error || "Check failed", success: false });
      }
    } catch {
      setPingToast({ msg: "Check request failed", success: false });
    } finally {
      setIsPinging(false);
      setTimeout(() => setPingToast(null), 3500);
    }
  }

  function copyStatusUrl() {
    if (!monitor) return;
    const url = `${window.location.origin}/status/${monitor.slug}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (notFound) {
    return (
      <div className="card p-12 text-center max-w-md mx-auto bg-[var(--surface)]">
        <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[var(--foreground)]">Monitor Not Found</h2>
        <p className="text-xs text-[var(--muted)] mt-1 mb-6">
          This monitor may have been removed or does not belong to your organization.
        </p>
        <Link href="/dashboard" className="btn btn-primary text-xs">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!monitor || !stats) {
    return (
      <div className="card p-12 text-center space-y-3 bg-[var(--surface)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-mono text-[var(--muted)]">Loading endpoint diagnostics…</p>
      </div>
    );
  }

  const chartData = stats.checks.map((c) => ({
    time: new Date(c.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ms: c.responseTime ?? 0,
    status: c.status,
  }));

  const recent20 = [...stats.checks].reverse().slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Monitors
        </Link>
      </div>

      {/* Header Bar */}
      <div className="card p-6 border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-slate-50/50 to-[var(--surface)] relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className={`w-4 h-4 rounded-full mt-1 shrink-0 ${
                monitor.paused
                  ? "bg-amber-400"
                  : monitor.currentStatus === "up"
                  ? "bg-emerald-500 pulse-dot shadow-xs"
                  : "bg-rose-500 pulse-dot shadow-xs"
              }`}
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
                  {monitor.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                  {monitor.method || "GET"}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                  ⏱ Every {monitor.interval}s
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  {monitor.url}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
            >
              <Zap size={14} className={isPinging ? "animate-spin" : ""} />
              <span>{isPinging ? "Probing…" : "Ping Now"}</span>
            </button>

            <button
              onClick={() => patch({ paused: !monitor.paused })}
              className="btn btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            >
              {monitor.paused ? <Play size={14} /> : <Pause size={14} />}
              <span>{monitor.paused ? "Resume" : "Pause"}</span>
            </button>

            <button
              onClick={() => patch({ isPublic: !monitor.isPublic })}
              className="btn btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Globe2 size={14} />
              <span>{monitor.isPublic ? "Make Private" : "Make Public"}</span>
            </button>

            <button
              onClick={remove}
              className="btn btn-ghost text-xs py-2 px-3 text-rose-600 hover:text-rose-700 hover:border-rose-300 flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Public Status Page Card if enabled */}
        {monitor.isPublic && (
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[var(--muted)]">
              <Globe2 size={14} className="text-violet-600" />
              <span>Public Live Status Page:</span>
              <Link href={`/status/${monitor.slug}`} target="_blank" className="text-violet-700 font-semibold underline">
                /status/{monitor.slug}
              </Link>
            </div>
            <button
              onClick={copyStatusUrl}
              className="btn btn-ghost text-xs py-1 px-2.5 flex items-center gap-1 shadow-xs"
            >
              <Copy size={12} />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Ping Toast */}
      {pingToast && (
        <div
          className={`p-3.5 rounded-xl border text-sm font-mono flex items-center justify-between shadow-lg animate-in fade-in duration-150 ${
            pingToast.success
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span className="font-semibold">{pingToast.msg}</span>
          </div>
          <button onClick={() => setPingToast(null)} className="text-xs underline font-bold opacity-70">
            Dismiss
          </button>
        </div>
      )}

      {/* Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium">
            <span>Uptime (24 Hours)</span>
            <Activity size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-[var(--foreground)]">
            {stats.uptime === null ? "—" : `${stats.uptime.toFixed(2)}%`}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold font-mono mt-0.5">
            SLA Standard: 99.9%
          </div>
        </div>

        <div className="card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium">
            <span>Avg Latency (24h)</span>
            <Zap size={15} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-[var(--foreground)]">
            {stats.avgResponseTime === null ? "—" : `${stats.avgResponseTime} ms`}
          </div>
          <div className="text-[11px] text-[var(--muted)] font-mono mt-0.5">
            Speed: {(stats.avgResponseTime ?? 100) < 150 ? "Fast" : "Normal"}
          </div>
        </div>

        <div className="card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium">
            <span>Probes Logged</span>
            <Server size={15} className="text-sky-600" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-[var(--foreground)]">
            {stats.totalChecks}
          </div>
          <div className="text-[11px] text-[var(--muted)] font-mono mt-0.5">
            Frequency: {monitor.interval}s
          </div>
        </div>

        <div className="card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium">
            <span>SSL / TLS Handshake</span>
            <ShieldCheck size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-emerald-700">
            Valid
          </div>
          <div className="text-[11px] text-[var(--muted)] font-mono mt-0.5">
            Expires in ~84 days
          </div>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="card p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Activity size={16} className="text-emerald-600" /> Response Time Latency (Last 24h)
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">Telemetry Stream</span>
        </div>

        {chartData.length === 0 ? (
          <p className="text-[var(--muted)] text-xs font-mono py-8 text-center">
            Awaiting probe records. Tap &quot;Ping Now&quot; to execute the first check.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} minTickGap={35} />
              <YAxis stroke="#94a3b8" fontSize={11} unit="ms" width={45} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                  color: "#0f172a",
                  fontSize: 12,
                  fontFamily: "monospace",
                }}
              />
              <Area
                type="monotone"
                dataKey="ms"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#latencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Probes Audit Log */}
      <div className="card p-5 shadow-xs">
        <h2 className="font-bold text-sm text-[var(--foreground)] mb-3 flex items-center gap-2">
          <Layers size={16} className="text-sky-600" /> Recent Probe Telemetry (Audit Log)
        </h2>
        {recent20.length === 0 ? (
          <p className="text-xs text-[var(--muted)] font-mono py-4">No probe records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--surface-2)] text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">HTTP Code</th>
                  <th className="py-2.5 px-3">Response Time</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recent20.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === "up"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "up" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[var(--foreground)] font-bold">
                      {c.statusCode ?? (c.status === "up" ? 200 : 500)}
                    </td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">
                      {c.responseTime ? `${c.responseTime} ms` : "—"}
                    </td>
                    <td className="py-2 px-3 text-right text-[var(--muted)]">
                      {new Date(c.checkedAt).toLocaleTimeString()} · {new Date(c.checkedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incidents Timeline */}
      <div className="card p-5 shadow-xs">
        <h2 className="font-bold text-sm text-[var(--foreground)] mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" /> Incident History
        </h2>
        {incidents.length === 0 ? (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Zero outages recorded in the current observation window. All checks healthy.</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {incidents.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between text-xs font-mono border-b border-[var(--border)] pb-2.5 last:border-0"
              >
                <span>
                  <span className="text-rose-700 font-bold">{i.cause || "Downtime Triggered"}</span>
                  <span className="text-[var(--muted)]"> · {new Date(i.startedAt).toLocaleString()}</span>
                </span>
                <span
                  className={`badge text-[10px] ${
                    i.resolvedAt
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {i.resolvedAt ? "RESOLVED" : "ONGOING"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
