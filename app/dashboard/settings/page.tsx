"use client";

import { useEffect, useState } from "react";

type Account = {
  name: string | null;
  email: string;
  plan: string;
  createdAt: string;
};

export default function SettingsPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => (r.ok ? r.json() : null))
      .then(setAccount);
  }, []);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(f.get("name") || "") }),
    });
    const d = await res.json();
    setMsg(res.ok ? { ok: true, text: "Profile saved" } : { ok: false, text: d.error });
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: String(f.get("currentPassword") || ""),
        newPassword: String(f.get("newPassword") || ""),
      }),
    });
    const d = await res.json();
    setMsg(res.ok ? { ok: true, text: "Password changed" } : { ok: false, text: d.error });
    if (res.ok) e.currentTarget.reset();
    setSaving(false);
  }

  if (!account) return <p className="text-[var(--muted)]">Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold mb-1">Settings</h1>
      <p className="text-[var(--muted)] text-sm mb-6">
        Manage your account details.
      </p>

      {msg && (
        <div
          className={`card p-3 mb-5 text-sm ${
            msg.ok ? "border-[var(--up)]/40" : "border-[var(--down)]/40"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Profile */}
      <form onSubmit={saveProfile} className="card p-6 mb-5 space-y-4">
        <h2 className="font-bold">Profile</h2>
        <div>
          <label className="label">Email</label>
          <input className="input opacity-60" value={account.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="input"
            defaultValue={account.name ?? ""}
            placeholder="Your name"
          />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>

      {/* Password */}
      <form onSubmit={changePassword} className="card p-6 space-y-4">
        <h2 className="font-bold">Change password</h2>
        <div>
          <label className="label" htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="input"
            placeholder="At least 8 characters"
          />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Change password"}
          </button>
        </div>
      </form>
    </div>
  );
}
