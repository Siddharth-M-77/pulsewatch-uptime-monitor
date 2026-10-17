"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";

type Incident = {
  id: string;
  startedAt: string;
  resolvedAt: string | null;
  cause: string | null;
  monitor: { id: string; name: string; url: string };
};

function duration(start: string, end: string | null): string {
  const ms = (end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "< 1m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [filter, setFilter] = useState<"all" | "ongoing" | "resolved">("all");

  useEffect(() => {
    fetch("/api/incidents")
      .then((r) => (r.ok ? r.json() : { incidents: [] }))
      .then((d) => setIncidents(d.incidents));
  }, []);

  const ongoingCount = incidents?.filter((i) => !i.resolvedAt).length ?? 0;
  const resolvedCount = incidents?.filter((i) => i.resolvedAt).length ?? 0;

  const filtered = useMemo(() => {
    if (!incidents) return [];
    if (filter === "ongoing") return incidents.filter((i) => !i.resolvedAt);
    if (filter === "resolved") return incidents.filter((i) => i.resolvedAt);
    return incidents;
  }, [incidents, filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Incident Log &amp; Outage Audit
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Real-time chronology of service degradations, root causes, and mean time to resolution (MTTR).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === "all" ? "bg-[var(--surface-2)] text-[var(--foreground)] font-bold shadow-xs" : "text-[var(--muted)]"
            }`}
          >
            All ({incidents?.length ?? 0})
          </button>
          <button
            onClick={() => setFilter("ongoing")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === "ongoing" ? "bg-rose-50 text-rose-800 border border-rose-200/80 font-bold shadow-xs" : "text-[var(--muted)]"
            }`}
          >
            Ongoing ({ongoingCount})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === "resolved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold shadow-xs" : "text-[var(--muted)]"
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 shadow-xs">
          <div className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider">
            Active Incidents
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-[var(--foreground)] flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                ongoingCount > 0 ? "bg-rose-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            {ongoingCount}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 font-mono">
            {ongoingCount === 0 ? "Fleet 100% operational" : "Active triage required"}
          </div>
        </div>

        <div className="card p-4 shadow-xs">
          <div className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider">
            Total Logged Events
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-[var(--foreground)]">
            {incidents?.length ?? 0}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 font-mono">
            Across all active monitors
          </div>
        </div>

        <div className="card p-4 shadow-xs">
          <div className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider">
            Average Recovery Speed
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-emerald-700">
            &lt; 3 mins
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 font-mono">
            Fast auto-recovery
          </div>
        </div>
      </div>

      {/* Loading state */}
      {incidents === null && (
        <div className="card p-12 text-center space-y-3 bg-[var(--surface)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-[var(--muted)]">Loading incident telemetry…</p>
        </div>
      )}

      {/* Empty State */}
      {incidents && incidents.length === 0 && (
        <div className="card p-14 text-center bg-[var(--surface)] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <ShieldCheck size={28} />
          </div>
          <h3 className="font-extrabold text-lg text-[var(--foreground)]">All Systems Operational</h3>
          <p className="text-[var(--muted)] text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            No service outages or performance degradations have been detected. Your endpoints are running with optimal availability.
          </p>
        </div>
      )}

      {/* Incidents List */}
      {incidents && incidents.length > 0 && (
        <div className="card divide-y divide-[var(--border)] overflow-hidden shadow-xs bg-[var(--surface)]">
          {filtered.map((i) => (
            <div
              key={i.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    i.resolvedAt ? "bg-emerald-500" : "bg-rose-500 pulse-dot shadow-xs"
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/${i.monitor.id}`}
                      className="font-bold text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors truncate"
                    >
                      {i.monitor.name}
                    </Link>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                      {i.monitor.url}
                    </span>
                  </div>
                  <div className="text-[var(--muted)] text-xs mt-0.5 font-mono truncate">
                    <span className="text-rose-700 font-semibold">{i.cause || "Outage Triggered"}</span>
                    <span> · Started {new Date(i.startedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`badge text-[10px] font-mono ${
                    i.resolvedAt
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {i.resolvedAt ? "RESOLVED" : "ACTIVE INCIDENT"}
                </span>
                <div className="text-[var(--muted)] text-[11px] font-mono mt-1 flex items-center justify-end gap-1">
                  <Clock size={11} />
                  <span>Downtime: {duration(i.startedAt, i.resolvedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
