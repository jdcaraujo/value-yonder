import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Value Yonder",
    short_name: "Value Yonder",
    description: "Personal site of Daniel Araújo — essays on learning, progress, and prosperity.",
    start_url: "/",
    display: "browser",
    background_color: "#0d0e17",
    theme_color: "#0d0e17",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
