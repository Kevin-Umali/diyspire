import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: process.env.NEXT_PUBLIC_PROJECT_URL,
    sitemap: `${process.env.NEXT_PUBLIC_PROJECT_URL}/sitemap.xml`,
  };
}
