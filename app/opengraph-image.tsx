import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stateside - Your path to US immigration";
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
          background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M75 28c0-7.7-6.3-14-14-14H42c-7.7 0-14 6.3-14 14s6.3 14 14 14h19c7.7 0 14 6.3 14 14s-6.3 14-14 14H47"
              stroke="white"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M56 70l-12 12M56 70l-12-12"
              stroke="#fbbf24"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          Stateside
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "48px",
          }}
        >
          Your path to US immigration
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Visa Pathways", "Green Card Timeline", "Live USCIS Data"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "12px 24px",
                  borderRadius: "999px",
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  fontSize: "18px",
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
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          stateside.app
        </div>
      </div>
    ),
    { ...size }
  );
}
