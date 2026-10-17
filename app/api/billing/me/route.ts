import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, effectivePlan } from "@/lib/user";
import { razorpayConfigured } from "@/lib/razorpay";

// Returns the current user's plan, subscription status, and usage — used by the
// billing page.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = effectivePlan(user);
  const monitorCount = await prisma.monitor.count({ where: { userId: user.id } });

  return NextResponse.json({
    plan: plan.id,
    planName: plan.name,
    subscriptionStatus: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
    monitorCount,
    monitorLimit: plan.monitorLimit,
    billingConfigured: razorpayConfigured(),
  });
}
