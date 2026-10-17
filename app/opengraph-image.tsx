import { ImageResponse } from "next/og";

export const alt = "PulseWatch — #1 Real-Time Website & API Uptime Monitoring";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(5, 150, 105, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(2, 132, 199, 0.08) 0%, transparent 40%)",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          border: "12px solid #f1f5f9",
        }}
      >
        {/* Top bar with brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #059669, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.03em",
              }}
            >
              PulseWatch
            </span>
            <span style={{ fontSize: "16px", color: "#64748b", fontWeight: 600 }}>
              Fleet Uptime &amp; API Reliability Platform
            </span>
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#047857",
              fontSize: "16px",
              fontWeight: 800,
            }}
          >
            ● 99.99% Multi-Region Synthetic Probing
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Know the Second Your Site or API Goes Down.
          </h1>
          <p style={{ fontSize: "24px", color: "#64748b", margin: 0, maxWidth: "900px" }}>
            Checks every 30 seconds · Instant email &amp; webhook alerts · Public status pages · Free forever
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderTop: "2px solid #e2e8f0",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "18px", color: "#0f172a", fontWeight: 700 }}>
            🚀 30s Check Frequency
          </span>
          <span style={{ fontSize: "18px", color: "#0f172a", fontWeight: 700 }}>
            🛡️ SSL Expiration Alerts
          </span>
          <span style={{ fontSize: "18px", color: "#0f172a", fontWeight: 700 }}>
            📊 Latency Heartbeat Heatmaps
          </span>
          <span style={{ fontSize: "18px", color: "#059669", fontWeight: 800, marginLeft: "auto" }}>
            pulsewatch.app →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
