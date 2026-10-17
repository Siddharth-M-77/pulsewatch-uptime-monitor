# PulseWatch

A production-style **uptime & website monitoring** SaaS. PulseWatch checks your
websites and APIs on a schedule, records response time and status, raises
incidents, sends email alerts when something goes down (and when it recovers),
and can publish a shareable public status page.

Built with **Next.js (App Router) + TypeScript + Prisma + PostgreSQL**.

---

## Features

- 🔐 **Auth** — email/password accounts with hashed passwords (bcrypt) and
  signed JWT sessions stored in httpOnly cookies.
- 📊 **Monitors** — add any URL, choose a check interval (30s–15m), pause/resume.
- ⏱️ **Scheduled checks** — a worker pings each due monitor, measures latency,
  and records every result.
- 🚨 **Incidents & alerts** — opens an incident and emails you the moment a
  monitor goes down; closes it and emails again on recovery (via Resend).
- 📈 **Dashboard** — live status list and a per-monitor detail page with uptime
  %, average response time, a response-time chart, and incident history.
- 🌐 **Public status pages** — share `/status/<slug>` with your users.

## Tech stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19        |
| Language   | TypeScript                               |
| Database   | PostgreSQL (Neon in production)          |
| ORM        | Prisma                                   |
| Auth       | jose (JWT) + bcryptjs                    |
| Validation | zod                                      |
| Charts     | Recharts                                 |
| Styling    | Tailwind CSS v4                          |
| Email      | Resend                                   |

## Architecture

```
Browser ──▶ Next.js App (pages + API routes)
                 │
                 ├─ /api/auth/*      register / login / logout
                 ├─ /api/monitors/*  CRUD for monitors (owner-scoped)
                 └─ /api/cron        runs all *due* checks (secret-protected)
                        │
                        ▼
                 lib/monitor.ts  ── fetch() each URL, store Check,
                                    open/close Incident, send alert
                        │
                        ▼
                 Prisma ──▶ PostgreSQL

Scheduling:
  • Production → Vercel Cron hits /api/cron every minute (see vercel.json)
  • Local dev  → `npm run worker` loops and calls the same logic
```

## Getting started (local)

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

- `DATABASE_URL` — your Postgres connection string (e.g. from [Neon](https://neon.tech)).
- `JWT_SECRET` — any long random string (`openssl rand -base64 32`).
- `CRON_SECRET` — any random string; protects `/api/cron`.
- `RESEND_API_KEY` — optional. Without it, alerts print to the console.

### 3. Create the database tables

```bash
npx prisma migrate dev
```

### 4. Run the app and the worker (two terminals)

```bash
npm run dev      # the web app on http://localhost:3000
npm run worker   # the background checker (pings due monitors)
```

Open http://localhost:3000, create an account, add a monitor, and watch it go
green/red on the dashboard.

## Subscriptions & billing (Razorpay)

PulseWatch has three plans (defined in `lib/plans.ts`):

| Plan     | Price      | Monitors | Fastest check |
| -------- | ---------- | -------- | ------------- |
| Free     | ₹0         | 3        | 5 min         |
| Pro      | ₹499/mo    | 25       | 1 min         |
| Business | ₹1499/mo   | 100      | 30 sec        |

Plan limits are enforced server-side when creating monitors. Payments use
**Razorpay Subscriptions**.

### Setting it up (test mode)

1. Create a free Razorpay account and switch to **Test Mode**.
2. From **Settings → API Keys**, generate test keys. Put them in `.env`:
   ```
   RAZORPAY_KEY_ID="rzp_test_xxx"
   RAZORPAY_KEY_SECRET="xxx"
   ```
3. Create the subscription plans — run:
   ```bash
   npm run setup:razorpay
   ```
   Copy the two lines it prints (`RAZORPAY_PLAN_PRO=...`, `RAZORPAY_PLAN_BUSINESS=...`)
   into `.env`.
4. Create a webhook (**Settings → Webhooks**) pointing at
   `https://YOUR_DOMAIN/api/billing/webhook`, choose a secret, subscribe to the
   `subscription.*` events, and set:
   ```
   RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
   ```
   For local testing, expose your machine with a tunnel (e.g. `ngrok http 3000`)
   and use that URL in the webhook.
5. Restart the app. The **Billing** page now lets users upgrade via Razorpay
   Checkout. Use Razorpay's test cards to simulate payments.

Without Razorpay keys the app runs fine — the Free plan works and the Billing
page shows a "not configured" notice instead of upgrade buttons.

## Deploying to production (Vercel + Neon)

1. Create a Postgres database on Neon and copy its connection string.
2. Push this repo to GitHub and import it into Vercel.
3. In Vercel project settings, add env vars: `DATABASE_URL`, `JWT_SECRET`,
   `CRON_SECRET`, `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `APP_URL`, and the
   Razorpay vars (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
   `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_PRO`, `RAZORPAY_PLAN_BUSINESS`).
4. Deploy. `vercel.json` registers a Cron Job that calls `/api/cron` every
   minute — Vercel automatically sends `Authorization: Bearer $CRON_SECRET`,
   which the route verifies. No separate worker needed in production.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run worker`    | Run the local background checker    |
| `npm run build`     | Production build                    |
| `npm run db:migrate`| Apply Prisma migrations             |
| `npm run db:studio` | Open Prisma Studio (DB GUI)         |

## Notes & next steps

Ideas to extend it into a fuller product: SMS/Slack/Discord alerts, SSL-certificate
expiry checks, multi-region probing, response-body keyword assertions, team
accounts, and a billing tier with Stripe.
