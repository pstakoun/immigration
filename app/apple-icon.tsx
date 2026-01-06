import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
          borderRadius: "32px",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized S as pathway */}
          <path
            d="M75 28c0-7.7-6.3-14-14-14H42c-7.7 0-14 6.3-14 14s6.3 14 14 14h19c7.7 0 14 6.3 14 14s-6.3 14-14 14H47"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Arrow accent */}
          <path
            d="M56 70l-12 12M56 70l-12-12"
            stroke="#fbbf24"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
