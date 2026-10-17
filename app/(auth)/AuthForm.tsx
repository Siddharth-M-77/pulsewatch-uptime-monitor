"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconPulse } from "@/components/Icons";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      ...(isRegister ? { name: String(form.get("name") || "") } : {}),
    };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="mesh">
        <div className="orb" style={{ width: 460, height: 460, left: "-10%", top: "-15%", background: "#00c073" }} />
        <div className="orb" style={{ width: 420, height: 420, right: "-10%", bottom: "-15%", background: "#14bbb9" }} />
        <div className="grid-bg" />
      </div>
      <div className="glass p-8 w-full max-w-sm relative z-10 rise">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-6">
          <span className="chip !w-8 !h-8 !rounded-lg">
            <IconPulse size={18} />
          </span>
          PulseWatch
        </Link>
        <h1 className="text-2xl font-bold mb-1">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-[var(--muted)] text-sm mb-6">
          {isRegister
            ? "Start monitoring your sites in seconds."
            : "Log in to your dashboard."}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="label" htmlFor="name">
                Name
              </label>
              <input id="name" name="name" className="input" placeholder="Siddharth" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={isRegister ? 8 : undefined}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[var(--down)] text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading
              ? "Please wait…"
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="text-[var(--muted)] text-sm mt-6 text-center">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--accent)]">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/register" className="text-[var(--accent)]">
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
