import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-stone-600">{t("disclaimer")}</p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          <li>
            <Link href="/not-financial-advice" className="text-accent hover:underline">
              {t("notAdvice")}
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-accent hover:underline">
              {t("privacy")}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-accent hover:underline">
              {t("contact")}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
