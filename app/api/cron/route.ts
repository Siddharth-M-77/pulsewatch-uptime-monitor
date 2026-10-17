import { NextResponse } from "next/server";
import { runDueChecks } from "@/lib/monitor";

// Runs all due checks. Protected by CRON_SECRET so it can't be triggered by the
// public. On Vercel, schedule this with a Cron Job; locally the worker script
// calls runDueChecks() directly.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  return header === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runDueChecks();
  return NextResponse.json({ ok: true, ...result });
}
