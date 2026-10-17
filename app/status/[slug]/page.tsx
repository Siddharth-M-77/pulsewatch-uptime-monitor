import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStats } from "@/lib/monitor";

export const dynamic = "force-dynamic";

export default async function PublicStatus({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monitor = await prisma.monitor.findFirst({
    where: { slug, isPublic: true },
  });
  if (!monitor) notFound();

  const stats = await getStats(monitor.id, 24);
  const isUp = monitor.currentStatus === "up";
  const isDown = monitor.currentStatus === "down";

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="card p-8 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 ${
              isUp
                ? "bg-[var(--up)]/15 text-[var(--up)]"
                : isDown
                  ? "bg-[var(--down)]/15 text-[var(--down)]"
                  : "bg-[var(--warn)]/15 text-[var(--warn)]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isUp
                  ? "bg-[var(--up)]"
                  : isDown
                    ? "bg-[var(--down)]"
                    : "bg-[var(--warn)]"
              }`}
            />
            {isUp ? "All systems operational" : isDown ? "Service disruption" : "Pending"}
          </div>

          <h1 className="text-2xl font-bold">{monitor.name}</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{monitor.url}</p>

          <div className="grid grid-cols-2 gap-3 mt-8 text-left">
            <div className="bg-[var(--surface-2)] rounded-xl p-4">
              <div className="text-[var(--muted)] text-xs uppercase">Uptime (24h)</div>
              <div className="text-xl font-bold mt-1">
                {stats.uptime === null ? "—" : `${stats.uptime.toFixed(2)}%`}
              </div>
            </div>
            <div className="bg-[var(--surface-2)] rounded-xl p-4">
              <div className="text-[var(--muted)] text-xs uppercase">Avg response</div>
              <div className="text-xl font-bold mt-1">
                {stats.avgResponseTime === null
                  ? "—"
                  : `${stats.avgResponseTime} ms`}
              </div>
            </div>
          </div>

          {monitor.lastCheckedAt && (
            <p className="text-[var(--muted)] text-xs mt-6">
              Last checked {new Date(monitor.lastCheckedAt).toLocaleString()}
            </p>
          )}
        </div>
        <p className="text-center text-[var(--muted)] text-xs mt-4">
          Powered by PulseWatch
        </p>
      </div>
    </main>
  );
}
