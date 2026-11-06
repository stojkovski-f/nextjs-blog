import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]/tack">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/tack",
    title: t("title"),
    description: t("body"),
  });
}

export default async function TackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("donate");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-teal-200 bg-accent-muted/40 px-6 py-12 sm:px-10 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-700">
          {t("body")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/fundamentals"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-900"
          >
            {t("browseArticles")}
          </Link>
          <Link
            href="/investment-planner"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            {t("goToCalculator")}
          </Link>
        </div>
      </section>
    </main>
  );
}
