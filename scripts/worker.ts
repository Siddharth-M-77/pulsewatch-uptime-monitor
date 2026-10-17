// Local background worker: runs due checks on a loop.
// In production you'd use Vercel Cron (hitting /api/cron) instead, but this is
// handy for local development and for a simple VPS deployment.
//
// Run with:  npm run worker

import { runDueChecks } from "../lib/monitor";

const TICK_SECONDS = 15;

async function tick() {
  try {
    const { checked } = await runDueChecks();
    if (checked > 0) {
      console.log(`[worker] ${new Date().toISOString()} checked ${checked} monitor(s)`);
    }
  } catch (err) {
    console.error("[worker] tick failed", err);
  }
}

async function main() {
  console.log(`[worker] started, ticking every ${TICK_SECONDS}s. Ctrl+C to stop.`);
  // run once immediately, then on an interval
  await tick();
  setInterval(tick, TICK_SECONDS * 1000);
}

main();
