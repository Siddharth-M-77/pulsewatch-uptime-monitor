// Creates the Pro and Business subscription plans in your Razorpay account and
// prints the plan IDs to paste into .env (RAZORPAY_PLAN_PRO / _BUSINESS).
//
// Run (after setting RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in .env):
//   npm run setup:razorpay

import Razorpay from "razorpay";
import { PLANS } from "../lib/plans";

async function main() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    console.error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env first.");
    process.exit(1);
  }

  const razorpay = new Razorpay({ key_id, key_secret });

  for (const planId of ["pro", "business"] as const) {
    const plan = PLANS[planId];
    const created = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: `PulseWatch ${plan.name}`,
        amount: plan.priceInr * 100, // paise
        currency: "INR",
        description: plan.features.join(", "),
      },
    });
    const envKey = planId === "pro" ? "RAZORPAY_PLAN_PRO" : "RAZORPAY_PLAN_BUSINESS";
    console.log(`${envKey}="${created.id}"   # ${plan.name} — ₹${plan.priceInr}/mo`);
  }

  console.log("\nPaste the lines above into your .env, then restart the app.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
