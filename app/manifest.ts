import type { MetadataRoute } from "next";
import { withBase } from "@/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Value Yonder",
    short_name: "Value Yonder",
    description: "Personal site of Daniel Araújo — essays on learning, progress, and prosperity.",
    start_url: withBase("/"),
    display: "browser",
    background_color: "#0d0e17",
    theme_color: "#0d0e17",
    icons: [
      { src: withBase("/favicon.svg"), sizes: "any", type: "image/svg+xml" },
      { src: withBase("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
