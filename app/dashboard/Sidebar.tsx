"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Globe2,
  CreditCard,
  Settings2,
  Radio,
  Zap,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Monitors", icon: Activity, exact: true },
  { href: "/dashboard/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/dashboard/status-pages", label: "Status Pages", icon: Globe2 },
  { href: "/dashboard/billing", label: "Billing & Plan", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-56 shrink-0 flex flex-col gap-6">
      {/* Navigation Links */}
      <nav className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                active
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs font-bold"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] border border-transparent"
              }`}
            >
              <Icon size={17} className={active ? "text-emerald-700" : "text-[var(--muted)]"} />
              <span>{item.label}</span>
              {item.href === "/dashboard" && (
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--muted)] hidden sm:inline-block font-bold">
                  LIVE
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro Badge Card */}
      <div className="hidden sm:block p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-1">
          <Zap size={14} className="text-emerald-600" />
          <span>Multi-Region Fleet</span>
        </div>
        <p className="text-[var(--muted)] leading-relaxed mb-3">
          Probing from 4 global edge locations with instant SMS &amp; Webhook alerts.
        </p>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
        >
          Manage plan &rarr;
        </Link>
      </div>
    </aside>
  );
}
