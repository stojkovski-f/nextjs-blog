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
  "/about",
  "/not-financial-advice",
  "/privacy",
  "/contact",
];

function languageAlternates(pathWithoutLocale: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale === "sv" ? "sv-SE" : "en"] = absoluteUrl(
      `/${locale}${pathWithoutLocale}`,
    );
  }
  languages["x-default"] = absoluteUrl(`/sv${pathWithoutLocale}`);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { news } = await getAllStaticSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: languageAlternates(path),
      });
    }
    for (const slug of FOUNDATIONAL_SLUGS) {
      const path = `/fundamentals/${slug.slug}`;
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: languageAlternates(path),
      });
    }
    for (const slug of news) {
      const path = `/news/${slug}`;
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: languageAlternates(path),
      });
    }
  }

  return entries;
}
