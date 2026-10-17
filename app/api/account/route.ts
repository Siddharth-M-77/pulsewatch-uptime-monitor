import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    name: user.name,
    email: user.email,
    plan: user.plan,
    createdAt: user.createdAt,
  });
}

const schema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
  })
  .refine((d) => !d.newPassword || d.currentPassword, {
    message: "Current password is required to set a new one",
  });

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const data: { name?: string; password?: string } = {};
  if (parsed.data.name) data.name = parsed.data.name;

  if (parsed.data.newPassword) {
    const ok = await verifyPassword(parsed.data.currentPassword!, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }
    data.password = await hashPassword(parsed.data.newPassword);
  }

  await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ ok: true });
}
