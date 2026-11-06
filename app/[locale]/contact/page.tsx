import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

const LINKEDIN_URL = "https://www.linkedin.com/in/dev-filip-stojkovski/";

type Props = PageProps<"/[locale]/contact">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/contact",
    title: t("contactTitle"),
    description: t("contactMeta"),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">{t("contactTitle")}</h1>
      <p className="mt-6 leading-relaxed text-stone-600">
        {t.rich("contactBody", {
          linkedin: (chunks) => (
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline underline-offset-2 hover:text-teal-800"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </main>
  );
}
