import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkAndRecord } from "@/lib/monitor";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const monitor = await prisma.monitor.findFirst({
    where: { id, userId: session.userId },
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const result = await checkAndRecord(monitor);
  return NextResponse.json({
    ok: true,
    result,
    lastCheckedAt: new Date().toISOString(),
  });
}
