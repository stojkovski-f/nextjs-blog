import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { FOUNDATIONAL_SLUGS } from "@/lib/foundational-slugs";
import { getAllStaticSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const staticPaths = [
  "",
  "/fundamentals",
  "/news",
  "/investment-planner",
  "/not-financial-advice",
  "/privacy",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { news } = await getAllStaticSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
    for (const slug of FOUNDATIONAL_SLUGS) {
      entries.push({
        url: absoluteUrl(`/${locale}/fundamentals/${slug.slug}`),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
    for (const slug of news) {
      entries.push({
        url: absoluteUrl(`/${locale}/news/${slug}`),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
