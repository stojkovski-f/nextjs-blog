import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const site = useTranslations("site");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/BrandLogo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0"
            priority
          />
          <span>
            <span className="block text-lg font-semibold tracking-tight text-stone-900 group-hover:text-accent">
              {site("name")}
            </span>
            <span className="hidden text-xs text-stone-500 sm:block">
              {site("tagline")}
            </span>
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700"
          aria-label="Main"
        >
          <Link href="/about" className="hover:text-accent">
            {t("about")}
          </Link>
          <Link href="/fundamentals" className="hover:text-accent">
            {t("fundamentals")}
          </Link>
          <Link href="/news" className="hover:text-accent">
            {t("news")}
          </Link>
          <Link
            href="/investment-planner"
            className="inline-flex items-center gap-1.5 hover:text-accent"
          >
            {t("planner")}
            <span className="-rotate-6 rounded-[3px] bg-yellow-300 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-black shadow-sm">
              {t("newBadge")}
            </span>
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
