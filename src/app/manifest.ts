import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();
  return {
    name: "LaunchPage",
    short_name: "LaunchPage",
    description:
      "Create a landing page, collect signups, and manage email drafts from one dashboard.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#5B4FC9",
    icons: [
      {
        src: new URL("/icon.svg", base).toString(),
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
