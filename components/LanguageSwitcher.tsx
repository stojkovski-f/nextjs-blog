"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  sv: "SV",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex rounded-lg border border-border bg-card p-0.5 text-sm font-medium"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            locale === loc
              ? "bg-accent text-white"
              : "text-stone-600 hover:text-stone-900"
          }`}
          aria-pressed={locale === loc}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
