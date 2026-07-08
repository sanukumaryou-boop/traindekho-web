import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
    ],
    sitemap: "https://traindekho.live/sitemap.xml",
  };
}
