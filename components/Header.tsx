import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const site = useTranslations("site");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <span className="block text-lg font-semibold tracking-tight text-stone-900 group-hover:text-accent">
            {site("name")}
          </span>
          <span className="hidden text-xs text-stone-500 sm:block">
            {site("tagline")}
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700"
          aria-label="Main"
        >
          <Link href="/fundamentals" className="hover:text-accent">
            {t("fundamentals")}
          </Link>
          <Link href="/news" className="hover:text-accent">
            {t("news")}
          </Link>
          <Link href="/investment-planner" className="hover:text-accent">
            {t("planner")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
