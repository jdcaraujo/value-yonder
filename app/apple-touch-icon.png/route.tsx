import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// iOS home-screen icon at the classic /apple-touch-icon.png path, which Apple
// devices request even without a <link>. Mirrors public/favicon.svg.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0e17",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path
            d="M4.5 8.5 L9.5 23 L14.5 8.5"
            fill="none"
            stroke="#f2f2f2"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 8.5 L20.5 19 L25 8.5"
            fill="none"
            stroke="#f2f2f2"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="20.5" y1="19" x2="18" y2="25" stroke="#f2f2f2" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="28.5" cy="24" r="1.3" fill="#06b6d4" />
        </svg>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
