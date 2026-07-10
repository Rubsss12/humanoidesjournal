import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/data";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://agentipedia.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/methodology`, changeFrequency: "monthly", priority: 0.6 },
    ...getEntries().map((e) => ({
      url: `${BASE}/entry/${e.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
