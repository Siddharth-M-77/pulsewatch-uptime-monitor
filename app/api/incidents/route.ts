import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Returns all incidents across the user's monitors, newest first.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const incidents = await prisma.incident.findMany({
    where: { monitor: { userId: session.userId } },
    orderBy: { startedAt: "desc" },
    take: 100,
    include: { monitor: { select: { id: true, name: true, url: true } } },
  });

  return NextResponse.json({ incidents });
}
