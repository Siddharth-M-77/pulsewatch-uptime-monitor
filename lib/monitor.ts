import { prisma } from "./prisma";
import { sendAlert } from "./alerts";
import type { Monitor } from "@prisma/client";

export type CheckResult = {
  status: "up" | "down";
  statusCode: number | null;
  responseTime: number | null;
  error: string | null;
};

// Performs a single HTTP check against a monitor's URL.
export async function runCheck(monitor: Monitor): Promise<CheckResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), monitor.timeout);

  try {
    const res = await fetch(monitor.url, {
      method: monitor.method,
      redirect: "follow",
      signal: controller.signal,
      // identify ourselves so site owners can see who is probing
      headers: { "User-Agent": "PulseWatch/1.0 (+https://pulsewatch.app)" },
    });
    clearTimeout(timer);
    const responseTime = Date.now() - start;

    const ok =
      res.status >= monitor.expectedStatusMin &&
      res.status <= monitor.expectedStatusMax;

    return {
      status: ok ? "up" : "down",
      statusCode: res.status,
      responseTime,
      error: ok ? null : `Unexpected HTTP ${res.status}`,
    };
  } catch (err) {
    clearTimeout(timer);
    const responseTime = Date.now() - start;
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      status: "down",
      statusCode: null,
      responseTime,
      error: aborted ? "Request timed out" : (err as Error).message,
    };
  }
}

// Runs a check, stores it, updates monitor state, opens/closes incidents and
// fires alerts on state transitions. Returns the check result.
export async function checkAndRecord(monitor: Monitor): Promise<CheckResult> {
  const result = await runCheck(monitor);
  const previousStatus = monitor.currentStatus;

  await prisma.check.create({
    data: {
      monitorId: monitor.id,
      status: result.status,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      error: result.error,
    },
  });

  await prisma.monitor.update({
    where: { id: monitor.id },
    data: { currentStatus: result.status, lastCheckedAt: new Date() },
  });

  // State transition handling: only act when status actually changes.
  const wentDown = result.status === "down" && previousStatus !== "down";
  const cameUp = result.status === "up" && previousStatus === "down";

  if (wentDown) {
    await prisma.incident.create({
      data: { monitorId: monitor.id, cause: result.error ?? "Unknown" },
    });
    if (monitor.alertEmail) {
      await sendAlert({
        to: monitor.alertEmail,
        monitorName: monitor.name,
        url: monitor.url,
        kind: "down",
        cause: result.error ?? undefined,
      });
    }
  }

  if (cameUp) {
    // close the most recent open incident
    const open = await prisma.incident.findFirst({
      where: { monitorId: monitor.id, resolvedAt: null },
      orderBy: { startedAt: "desc" },
    });
    if (open) {
      await prisma.incident.update({
        where: { id: open.id },
        data: { resolvedAt: new Date() },
      });
    }
    if (monitor.alertEmail) {
      await sendAlert({
        to: monitor.alertEmail,
        monitorName: monitor.name,
        url: monitor.url,
        kind: "up",
      });
    }
  }

  return result;
}

// Selects monitors that are due for a check and runs them concurrently.
// Called by the /api/cron endpoint and the local worker.
export async function runDueChecks(): Promise<{ checked: number }> {
  const now = Date.now();
  const monitors = await prisma.monitor.findMany({ where: { paused: false } });

  const due = monitors.filter((m) => {
    if (!m.lastCheckedAt) return true;
    return now - m.lastCheckedAt.getTime() >= m.interval * 1000;
  });

  // bound concurrency to avoid hammering the network / DB
  const CONCURRENCY = 10;
  for (let i = 0; i < due.length; i += CONCURRENCY) {
    const batch = due.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((m) => checkAndRecord(m)));
  }

  return { checked: due.length };
}

// Computes uptime percentage and average response time over a window.
export async function getStats(monitorId: string, sinceHours = 24) {
  const since = new Date(Date.now() - sinceHours * 3600 * 1000);
  const checks = await prisma.check.findMany({
    where: { monitorId, checkedAt: { gte: since } },
    orderBy: { checkedAt: "asc" },
    select: { status: true, responseTime: true, checkedAt: true },
  });

  const total = checks.length;
  const up = checks.filter((c) => c.status === "up").length;
  const times = checks
    .map((c) => c.responseTime)
    .filter((t): t is number => t != null);

  return {
    uptime: total === 0 ? null : (up / total) * 100,
    avgResponseTime:
      times.length === 0
        ? null
        : Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    totalChecks: total,
    checks,
  };
}
