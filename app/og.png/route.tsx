import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Default social-share image. A route handler (not the opengraph-image file
// convention) so the static export gets a real .png path — the NAS serves
// extensionless files with the wrong content type.

const stars = [
  { top: 60, left: 140, r: 3, o: 0.7 },
  { top: 120, left: 980, r: 2, o: 0.5 },
  { top: 200, left: 480, r: 2, o: 0.4 },
  { top: 90, left: 720, r: 3, o: 0.6 },
  { top: 340, left: 1080, r: 2, o: 0.5 },
  { top: 470, left: 220, r: 3, o: 0.6 },
  { top: 540, left: 860, r: 2, o: 0.4 },
  { top: 280, left: 80, r: 2, o: 0.5 },
  { top: 430, left: 620, r: 2, o: 0.35 },
  { top: 160, left: 300, r: 2, o: 0.45 },
];

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(160deg, #07080e 0%, #0d0e17 55%, #070810 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: 300,
            background: "radial-gradient(circle, rgba(6,182,212,0.16) 0%, rgba(6,182,212,0) 70%)",
          }}
        />
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: s.r,
              background: "#ffffff",
              opacity: s.o,
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#06b6d4" }} />
          <div style={{ fontSize: 26, color: "#06b6d4", letterSpacing: 6, textTransform: "uppercase" }}>
            Value Yonder
          </div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>
          Daniel Araújo
        </div>
        <div style={{ fontSize: 32, color: "#a3a3a3", marginTop: 24 }}>
          Essays on learning, progress, and prosperity.
        </div>
        <div style={{ position: "absolute", bottom: 48, left: 96, fontSize: 24, color: "#525252" }}>
          valueyonder.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
