import { prisma } from "./prisma";
import { getSession } from "./auth";
import { getPlan, type Plan } from "./plans";
import type { User } from "@prisma/client";

// Loads the logged-in user from the session, or null.
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

// Returns the user's effective plan. If a paid subscription has lapsed
// (status not active/authenticated), they fall back to Free.
export function effectivePlan(user: Pick<User, "plan" | "subscriptionStatus">): Plan {
  const active =
    user.plan === "free" ||
    user.subscriptionStatus === "active" ||
    user.subscriptionStatus === "authenticated";
  return getPlan(active ? user.plan : "free");
}

// Checks whether the user can create another monitor at the given interval.
export async function checkMonitorAllowed(
  user: User,
  interval: number,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const plan = effectivePlan(user);

  const count = await prisma.monitor.count({ where: { userId: user.id } });
  if (count >= plan.monitorLimit) {
    return {
      ok: false,
      reason: `Your ${plan.name} plan allows up to ${plan.monitorLimit} monitors. Upgrade to add more.`,
    };
  }

  if (interval < plan.minInterval) {
    const mins =
      plan.minInterval >= 60
        ? `${plan.minInterval / 60} minute(s)`
        : `${plan.minInterval} seconds`;
    return {
      ok: false,
      reason: `Your ${plan.name} plan checks at most every ${mins}. Upgrade for faster checks.`,
    };
  }

  return { ok: true };
}
