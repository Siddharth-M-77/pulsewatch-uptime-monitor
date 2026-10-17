import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { type PlanId } from "@/lib/plans";

// Razorpay posts subscription lifecycle events here. We verify the signature,
// match the subscription back to a user, and update their plan/status.
// Configure this URL + a webhook secret in the Razorpay dashboard.

function planIdFromRazorpayPlan(razorpayPlanId: string): PlanId {
  if (razorpayPlanId === process.env.RAZORPAY_PLAN_BUSINESS) return "business";
  if (razorpayPlanId === process.env.RAZORPAY_PLAN_PRO) return "pro";
  return "free";
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event: string;
    payload?: { subscription?: { entity?: Record<string, unknown> } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const sub = event.payload?.subscription?.entity;
  if (!sub?.id) {
    // Not a subscription event we care about — acknowledge so Razorpay stops retrying.
    return NextResponse.json({ ok: true });
  }

  const subscriptionId = sub.id as string;
  const user = await prisma.user.findFirst({
    where: { razorpaySubscriptionId: subscriptionId },
  });
  if (!user) return NextResponse.json({ ok: true });

  const planId = sub.plan_id
    ? planIdFromRazorpayPlan(sub.plan_id as string)
    : (user.plan as PlanId);
  const currentEnd = sub.current_end
    ? new Date((sub.current_end as number) * 1000)
    : null;

  switch (event.event) {
    case "subscription.activated":
    case "subscription.authenticated":
    case "subscription.charged":
    case "subscription.resumed":
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: planId,
          subscriptionStatus: "active",
          currentPeriodEnd: currentEnd,
        },
      });
      break;

    case "subscription.halted":
    case "subscription.pending":
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "halted" },
      });
      break;

    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.expired":
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "free",
          subscriptionStatus: "cancelled",
          currentPeriodEnd: null,
        },
      });
      break;

    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
