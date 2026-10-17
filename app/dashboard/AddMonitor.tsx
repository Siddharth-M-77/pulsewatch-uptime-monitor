"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Server,
  Globe,
  Clock,
  Shield,
  Bell,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AddMonitor({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form states
  const [method, setMethod] = useState("GET");
  const [interval, setIntervalVal] = useState(60);
  const [timeout, setTimeoutVal] = useState(10000);
  const [expectedStatus, setExpectedStatus] = useState("200-399");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    let minStatus = 200;
    let maxStatus = 399;
    if (expectedStatus === "200") {
      minStatus = 200;
      maxStatus = 200;
    } else if (expectedStatus === "200-299") {
      minStatus = 200;
      maxStatus = 299;
    }

    const payload = {
      name: String(form.get("name") || "").trim(),
      url: String(form.get("url") || "").trim(),
      interval: Number(interval),
      method,
      timeout: Number(timeout),
      expectedStatusMin: minStatus,
      expectedStatusMax: maxStatus,
      alertEmail: String(form.get("alertEmail") || "").trim(),
      isPublic: form.get("isPublic") === "on",
    };

    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create monitor");
        setNeedsUpgrade(Boolean(data.upgrade));
        return;
      }
      onCreated();
    } catch {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Create New Monitor
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Set up automated endpoint health checks &amp; instant alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Endpoint Name */}
          <div>
            <label className="label" htmlFor="name">
              Monitor Name <span className="text-emerald-700 font-bold">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              className="input font-medium"
              placeholder="e.g. Production API, Auth Service, Landing Page"
            />
          </div>

          {/* URL & Method */}
          <div>
            <label className="label" htmlFor="url">
              Endpoint URL <span className="text-emerald-700 font-bold">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input !w-28 font-mono font-bold text-xs bg-[var(--surface-2)] shrink-0"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
              </select>
              <input
                id="url"
                name="url"
                type="url"
                required
                className="input font-mono text-sm"
                placeholder="https://api.yourdomain.com/health"
              />
            </div>
          </div>

          {/* Check Interval */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Check Frequency</label>
              <select
                value={interval}
                onChange={(e) => setIntervalVal(Number(e.target.value))}
                className="input text-sm"
              >
                <option value={30}>⚡ Every 30 seconds</option>
                <option value={60}>⏱ Every 1 minute</option>
                <option value={300}>⏱ Every 5 minutes</option>
                <option value={900}>⏱ Every 15 minutes</option>
              </select>
            </div>
            <div>
              <label className="label">Expected Response</label>
              <select
                value={expectedStatus}
                onChange={(e) => setExpectedStatus(e.target.value)}
                className="input text-sm font-mono"
              >
                <option value="200-399">2xx / 3xx (Healthy)</option>
                <option value="200">200 OK only</option>
                <option value="200-299">2xx Success only</option>
              </select>
            </div>
          </div>

          {/* Alert Email */}
          <div>
            <label className="label" htmlFor="alertEmail">
              Alert Destination Email (Optional)
            </label>
            <div className="relative">
              <input
                id="alertEmail"
                name="alertEmail"
                type="email"
                className="input pl-9 text-sm"
                placeholder="ops-alerts@yourcompany.com"
              />
              <Bell
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
              />
            </div>
          </div>

          {/* Public Status Page Toggle */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="text-emerald-700 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  Public Status Page
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Generate a shareable live status link for your users
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isPublic" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Advanced Accordion Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] pt-1"
          >
            <Sliders size={14} />
            <span>{showAdvanced ? "Hide advanced probe settings" : "Show advanced probe settings (Timeout, Regions)"}</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showAdvanced && (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-slate-50 space-y-3 text-xs animate-in fade-in duration-150">
              <div>
                <label className="label">Request Timeout</label>
                <select
                  value={timeout}
                  onChange={(e) => setTimeoutVal(Number(e.target.value))}
                  className="input text-xs font-mono"
                >
                  <option value={5000}>5,000 ms (5 seconds)</option>
                  <option value={10000}>10,000 ms (10 seconds - Recommended)</option>
                  <option value={20000}>20,000 ms (20 seconds)</option>
                  <option value={30000}>30,000 ms (30 seconds)</option>
                </select>
              </div>

              <div className="text-[var(--muted)] leading-relaxed">
                <span className="font-semibold text-[var(--foreground)]">Probing Nodes:</span> Automated multi-region probing simulated across US-East, EU-Frankfurt, and AP-South.
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
              <span className="font-semibold">Error:</span> {error}
              {needsUpgrade && (
                <Link
                  href="/dashboard/billing"
                  className="ml-auto underline font-bold text-emerald-700 whitespace-nowrap"
                >
                  Upgrade plan
                </Link>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              className="btn btn-ghost text-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-sm flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating monitor…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Start Monitoring
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
