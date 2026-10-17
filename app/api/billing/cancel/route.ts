import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { getRazorpay } from "@/lib/razorpay";

// Cancels the user's Razorpay subscription at the end of the current cycle.
// The actual downgrade happens when Razorpay sends subscription.cancelled.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.razorpaySubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  try {
    // cancel_at_cycle_end = 1 keeps access until the paid period ends.
    await razorpay.subscriptions.cancel(user.razorpaySubscriptionId, true);
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: "cancelled" },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[billing] cancel failed", err);
    return NextResponse.json({ error: "Could not cancel" }, { status: 500 });
  }
}
