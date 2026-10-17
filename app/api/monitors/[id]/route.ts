import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getStats } from "@/lib/monitor";

async function ownedMonitor(id: string, userId: string) {
  return prisma.monitor.findFirst({ where: { id, userId } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const monitor = await ownedMonitor(id, session.userId);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const stats = await getStats(id, 24);
  const incidents = await prisma.incident.findMany({
    where: { monitorId: id },
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ monitor, stats, incidents });
}

const patchSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  url: z.string().url().optional(),
  interval: z.number().int().min(30).max(86400).optional(),
  paused: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  alertEmail: z.string().email().or(z.literal("")).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const monitor = await ownedMonitor(id, session.userId);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = { ...parsed.data };
  if (data.alertEmail === "") data.alertEmail = undefined;

  const updated = await prisma.monitor.update({
    where: { id },
    data: {
      ...data,
      alertEmail:
        parsed.data.alertEmail === ""
          ? null
          : parsed.data.alertEmail ?? undefined,
    },
  });
  return NextResponse.json({ monitor: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const monitor = await ownedMonitor(id, session.userId);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.monitor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
