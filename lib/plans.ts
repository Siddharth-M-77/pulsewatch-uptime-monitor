// Central definition of subscription plans. Prices are in INR.
// The Razorpay plan IDs come from env vars so you can swap test/live without
// touching code. Create the plans in your Razorpay dashboard (or via
// `npm run setup:razorpay`) and paste the IDs into .env.

export type PlanId = "free" | "pro" | "business";

export type Plan = {
  id: PlanId;
  name: string;
  priceInr: number; // monthly, in rupees
  razorpayPlanId: string | null; // null for free
  monitorLimit: number;
  minInterval: number; // seconds — smallest allowed check interval
  features: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceInr: 0,
    razorpayPlanId: null,
    monitorLimit: 3,
    minInterval: 300, // 5 minutes
    features: [
      "3 monitors",
      "5-minute checks",
      "Email alerts",
      "1 public status page",
      "24h history",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceInr: 499,
    razorpayPlanId: process.env.RAZORPAY_PLAN_PRO || null,
    monitorLimit: 25,
    minInterval: 60, // 1 minute
    features: [
      "25 monitors",
      "1-minute checks",
      "Email alerts",
      "Unlimited status pages",
      "30-day history",
      "Priority support",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    priceInr: 1499,
    razorpayPlanId: process.env.RAZORPAY_PLAN_BUSINESS || null,
    monitorLimit: 100,
    minInterval: 30, // 30 seconds
    features: [
      "100 monitors",
      "30-second checks",
      "Email alerts",
      "Unlimited status pages",
      "90-day history",
      "Priority support",
    ],
  },
};

export function getPlan(planId: string | null | undefined): Plan {
  if (planId && planId in PLANS) return PLANS[planId as PlanId];
  return PLANS.free;
}

export const ORDERED_PLANS: Plan[] = [PLANS.free, PLANS.pro, PLANS.business];
