// Sends alert emails via Resend. If RESEND_API_KEY is not configured, the
// alert is logged to the console instead so local development still works.

type AlertKind = "down" | "up";

export async function sendAlert(opts: {
  to: string;
  monitorName: string;
  url: string;
  kind: AlertKind;
  cause?: string;
}): Promise<void> {
  const { to, monitorName, url, kind, cause } = opts;

  const subject =
    kind === "down"
      ? `🔴 ${monitorName} is DOWN`
      : `🟢 ${monitorName} is back UP`;

  const line =
    kind === "down"
      ? `${monitorName} (${url}) is not responding.${cause ? ` Cause: ${cause}.` : ""}`
      : `${monitorName} (${url}) is responding again.`;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_FROM_EMAIL || "PulseWatch <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[alert:console] -> ${to}: ${subject} — ${line}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
          <h2 style="margin:0 0 8px">${subject}</h2>
          <p style="margin:0 0 12px">${line}</p>
          <p style="margin:0;color:#666;font-size:13px">Sent by PulseWatch</p>
        </div>`,
      }),
    });
    if (!res.ok) {
      console.error("[alert] Resend error", res.status, await res.text());
    }
  } catch (err) {
    console.error("[alert] failed to send", err);
  }
}
