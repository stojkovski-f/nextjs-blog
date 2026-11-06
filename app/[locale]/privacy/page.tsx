import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]/privacy">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/privacy",
    title: t("privacyTitle"),
    description: t("privacyBody"),
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">{t("privacyTitle")}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-stone-600">
        <p>{t("privacyBody")}</p>
        <p>{t("privacyFeedback")}</p>
        <p>{t("privacyLocal")}</p>
        <p>{t("privacyDonate")}</p>
      </div>
    </main>
  );
}
