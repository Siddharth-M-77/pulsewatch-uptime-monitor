import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import Sidebar from "./Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Activity, ShieldCheck } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const initials = session.email
    ? session.email.slice(0, 2).toUpperCase()
    : "PW";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--background)]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-black text-lg tracking-tight group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Activity size={20} strokeWidth={2.4} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[var(--foreground)] text-lg tracking-tight">
                  PulseWatch
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PRO
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border-hi)] flex items-center justify-center text-xs font-bold font-mono text-[var(--foreground)] shadow-xs">
                {initials}
              </div>
              <span className="text-[var(--muted)] text-sm font-medium hidden md:inline truncate max-w-[160px]">
                {session.email}
              </span>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-8 flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
