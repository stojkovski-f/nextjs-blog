import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]/not-financial-advice">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/not-financial-advice",
    title: t("notAdviceTitle"),
    description: t("notAdviceBody"),
  });
}

export default async function NotFinancialAdvicePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">{t("notAdviceTitle")}</h1>
      <p className="mt-6 leading-relaxed text-stone-600">{t("notAdviceBody")}</p>
    </main>
  );
}
