import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCurrentUser, checkMonitorAllowed } from "@/lib/user";

const createSchema = z.object({
  name: z.string().trim().min(1).max(100),
  url: z.string().url(),
  interval: z.number().int().min(30).max(86400).default(60),
  method: z.enum(["GET", "HEAD", "POST", "PUT"]).default("GET"),
  timeout: z.number().int().min(1000).max(30000).optional().default(10000),
  expectedStatusMin: z.number().int().min(100).max(599).optional().default(200),
  expectedStatusMax: z.number().int().min(100).max(599).optional().default(399),
  alertEmail: z.string().email().optional().or(z.literal("")),
  isPublic: z.boolean().default(false),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawMonitors = await prisma.monitor.findMany({
    where: { userId: session.userId },
    include: {
      checks: {
        take: 30,
        orderBy: { checkedAt: "desc" },
        select: {
          id: true,
          status: true,
          statusCode: true,
          responseTime: true,
          checkedAt: true,
        },
      },
      incidents: {
        where: { resolvedAt: null },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const monitors = rawMonitors.map((m) => {
    // Reverse checks to chronological order for heatmap / sparkline
    const chronologicalChecks = [...m.checks].reverse();
    const upChecks = m.checks.filter((c) => c.status === "up").length;
    const uptimePct = m.checks.length > 0 ? (upChecks / m.checks.length) * 100 : null;
    const latestCheck = m.checks[0] || null;
    const avgLatency =
      m.checks.length > 0
        ? Math.round(
            m.checks
              .filter((c) => c.responseTime != null)
              .reduce((acc, c) => acc + (c.responseTime || 0), 0) /
              (m.checks.filter((c) => c.responseTime != null).length || 1),
          )
        : null;

    return {
      id: m.id,
      name: m.name,
      url: m.url,
      method: m.method,
      interval: m.interval,
      timeout: m.timeout,
      expectedStatusMin: m.expectedStatusMin,
      expectedStatusMax: m.expectedStatusMax,
      currentStatus: m.currentStatus,
      lastCheckedAt: m.lastCheckedAt,
      paused: m.paused,
      slug: m.slug,
      isPublic: m.isPublic,
      alertEmail: m.alertEmail,
      createdAt: m.createdAt,
      checks: chronologicalChecks,
      latestResponseTime: latestCheck?.responseTime ?? null,
      latestStatusCode: latestCheck?.statusCode ?? null,
      uptimePercentage: uptimePct,
      avgLatency,
      hasActiveIncident: m.incidents.length > 0,
    };
  });

  return NextResponse.json({ monitors });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Enforce plan limits (monitor count + minimum interval).
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const allowed = await checkMonitorAllowed(user, data.interval);
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.reason, upgrade: true }, { status: 402 });
  }

  const monitor = await prisma.monitor.create({
    data: {
      userId: session.userId,
      name: data.name,
      url: data.url,
      interval: data.interval,
      method: data.method,
      timeout: data.timeout,
      expectedStatusMin: data.expectedStatusMin,
      expectedStatusMax: data.expectedStatusMax,
      alertEmail: data.alertEmail || null,
      isPublic: data.isPublic,
    },
  });

  return NextResponse.json({ monitor });
}
