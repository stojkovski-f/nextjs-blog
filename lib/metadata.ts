import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { absoluteUrl, SITE_NAME } from "./site";

export function localeAlternates(pathWithoutLocale: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const hreflang = locale === "sv" ? "sv-SE" : "en";
    languages[hreflang] = absoluteUrl(`/${locale}${pathWithoutLocale}`);
  }
  languages["x-default"] = absoluteUrl(`/sv${pathWithoutLocale}`);
  return { languages };
}

export function pageMetadata(options: {
  locale: Locale;
  pathWithoutLocale: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, pathWithoutLocale, title, description } = options;
  return {
    title,
    description,
    alternates: localeAlternates(pathWithoutLocale),
    openGraph: {
      title,
      description,
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      siteName: SITE_NAME,
      url: absoluteUrl(`/${locale}${pathWithoutLocale}`),
      type: "website",
    },
  };
}
