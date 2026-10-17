"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe2, ExternalLink, Copy, Check, Radio, Shield } from "lucide-react";

type Monitor = {
  id: string;
  name: string;
  url: string;
  slug: string;
  isPublic: boolean;
  currentStatus: string;
};

export default function StatusPagesPage() {
  const [monitors, setMonitors] = useState<Monitor[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/monitors")
      .then((r) => (r.ok ? r.json() : { monitors: [] }))
      .then((d) => setMonitors(d.monitors));
  }, []);

  const publicOnes = monitors?.filter((m) => m.isPublic) ?? [];

  function copy(slug: string) {
    const url = `${window.location.origin}/status/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Public Status Pages
        </h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Broadcast transparent system availability to your customers and users with custom public portals.
        </p>
      </div>

      {monitors === null && (
        <div className="card p-12 text-center space-y-3 bg-[var(--surface)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-[var(--muted)]">Loading public portals…</p>
        </div>
      )}

      {monitors && publicOnes.length === 0 && (
        <div className="card p-14 text-center bg-[var(--surface)] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <Globe2 size={28} />
          </div>
          <h3 className="font-extrabold text-lg text-[var(--foreground)]">No Public Status Pages Yet</h3>
          <p className="text-[var(--muted)] text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            Flip any monitor to &quot;Public Status Page&quot; from its detail settings to create a shareable live status URL.
          </p>
          <Link href="/dashboard" className="btn btn-primary text-xs mt-5 inline-flex items-center gap-1.5 shadow-sm">
            Go to Monitors
          </Link>
        </div>
      )}

      <div className="grid gap-3.5">
        {publicOnes.map((m) => (
          <div
            key={m.id}
            className="card p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-[var(--border-hi)] transition-all group bg-[var(--surface)] shadow-xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shrink-0">
                <Globe2 size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--foreground)] truncate">
                    {m.name}
                  </span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      m.currentStatus === "up" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                </div>
                <div className="text-[var(--muted)] text-xs font-mono truncate mt-0.5">
                  /status/{m.slug}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copy(m.slug)}
                className="btn btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
              >
                {copied === m.slug ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
              <Link
                href={`/status/${m.slug}`}
                target="_blank"
                className="btn btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 text-emerald-700 hover:border-emerald-300 font-semibold shadow-xs"
              >
                <ExternalLink size={14} />
                <span>Open Portal</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
