import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { getPlan } from "@/lib/plans";
import { getRazorpay } from "@/lib/razorpay";

const schema = z.object({ planId: z.enum(["pro", "business"]) });

// Creates a Razorpay subscription for the chosen plan and returns the data the
// browser needs to open Razorpay Checkout.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = getPlan(parsed.data.planId);
  const razorpay = getRazorpay();
  if (!razorpay || !plan.razorpayPlanId) {
    return NextResponse.json(
      { error: "Billing is not configured yet. Add Razorpay keys and plan IDs." },
      { status: 503 },
    );
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      total_count: 12, // bill monthly for up to 12 cycles
      customer_notify: 1,
      notes: { userId: user.id, email: user.email },
    });

    // Record the pending subscription so the webhook can match it back.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        razorpaySubscriptionId: subscription.id,
        subscriptionStatus: "created",
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      amount: plan.priceInr,
    });
  } catch (err) {
    console.error("[billing] subscribe failed", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
