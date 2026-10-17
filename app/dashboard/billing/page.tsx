"use client";

import { useCallback, useEffect, useState } from "react";
import { ORDERED_PLANS } from "@/lib/plans";

type Billing = {
  plan: string;
  planName: string;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  monitorCount: number;
  monitorLimit: number;
  billingConfigured: boolean;
};

// Minimal typing for the Razorpay Checkout global.
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BillingPage() {
  const [billing, setBilling] = useState<Billing | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/billing/me");
    if (res.ok) setBilling(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upgrade(planId: "pro" | "business", planName: string) {
    setMsg(null);
    setBusy(planId);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Could not start checkout");
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        setMsg("Could not load payment window. Check your connection.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "PulseWatch",
        description: `${planName} plan — ₹${data.amount}/mo`,
        theme: { color: "#4f7cff" },
        handler: () => {
          setMsg("Payment received! Activating your plan…");
          // The webhook confirms activation; poll a few times.
          let tries = 0;
          const t = setInterval(async () => {
            tries++;
            await load();
            if (tries >= 5) clearInterval(t);
          }, 2000);
        },
        modal: {
          ondismiss: () => setBusy(null),
        },
      });
      rzp.open();
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the period ends.")) return;
    setBusy("cancel");
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const data = await res.json();
    setMsg(res.ok ? "Subscription cancelled." : data.error || "Could not cancel");
    await load();
    setBusy(null);
  }

  if (!billing) return <p className="text-[var(--muted)]">Loading…</p>;

  const usagePct = Math.min(
    100,
    Math.round((billing.monitorCount / billing.monitorLimit) * 100),
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Billing & plan</h1>
      <p className="text-[var(--muted)] text-sm mb-6">
        Manage your subscription and see your usage.
      </p>

      {/* Current plan + usage */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[var(--muted)] text-sm">Current plan</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {billing.planName}
              {billing.subscriptionStatus === "cancelled" && (
                <span className="badge bg-[var(--warn)]/15 text-[var(--warn)]">
                  Cancelling
                </span>
              )}
              {billing.subscriptionStatus === "active" && (
                <span className="badge bg-[var(--up)]/15 text-[var(--up)]">Active</span>
              )}
            </div>
          </div>
          {billing.plan !== "free" && billing.subscriptionStatus === "active" && (
            <button
              className="btn btn-ghost text-sm"
              onClick={cancel}
              disabled={busy === "cancel"}
            >
              {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
            </button>
          )}
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-[var(--muted)]">Monitors used</span>
            <span>
              {billing.monitorCount} / {billing.monitorLimit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all"
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>

        {billing.currentPeriodEnd && (
          <p className="text-[var(--muted)] text-xs mt-4">
            Renews on {new Date(billing.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </div>

      {!billing.billingConfigured && (
        <div className="card p-4 mb-6 border-[var(--warn)]/40 text-sm">
          ⚠️ Billing isn&apos;t configured yet. Add your Razorpay keys and plan IDs
          to <code>.env</code> (see README) to enable upgrades.
        </div>
      )}

      {msg && (
        <div className="card p-4 mb-6 text-sm border-[var(--accent)]/40">{msg}</div>
      )}

      {/* Plan options */}
      <div className="grid sm:grid-cols-3 gap-4">
        {ORDERED_PLANS.map((plan) => {
          const isCurrent = plan.id === billing.plan;
          const isFree = plan.id === "free";
          return (
            <div
              key={plan.id}
              className={`card p-5 ${plan.id === "pro" ? "border-[var(--accent)]" : ""}`}
            >
              <h3 className="font-bold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-extrabold">₹{plan.priceInr}</span>
                <span className="text-[var(--muted)] text-sm">/mo</span>
              </div>
              {isCurrent ? (
                <button className="btn btn-ghost w-full" disabled>
                  Current plan
                </button>
              ) : isFree ? (
                <button className="btn btn-ghost w-full" disabled>
                  Downgrade on cancel
                </button>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  disabled={!billing.billingConfigured || busy === plan.id}
                  onClick={() => upgrade(plan.id as "pro" | "business", plan.name)}
                >
                  {busy === plan.id ? "Opening…" : `Upgrade to ${plan.name}`}
                </button>
              )}
              <ul className="mt-4 space-y-2 text-xs">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--up)]">✓</span>
                    <span className="text-[var(--muted)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
