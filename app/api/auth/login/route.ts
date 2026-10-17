import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  // Same response for missing user and wrong password to avoid user enumeration.
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  await createSession({ userId: user.id, email: user.email });
  return NextResponse.json({ id: user.id, email: user.email });
}
