import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stateside - US immigration paths";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "600",
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            Stateside
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#6b7280",
            marginBottom: "48px",
          }}
        >
          Find your fastest path to a US green card
        </div>

        {/* Feature chips */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["Live USCIS data", "Timeline estimates", "All visa types"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  background: "#f0fdf4",
                  color: "#166534",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "#9ca3af",
          }}
        >
          stateside.app
        </div>
      </div>
    ),
    { ...size }
  );
}
