import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsCard } from "@/components/NewsCard";
import { FOUNDATIONAL_SLUGS } from "@/lib/foundational-slugs";
import { getNewsPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "",
    title: t("name"),
    description: t("tagline"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const news = await getNewsPosts(locale as Locale, { limit: 3 });
  const featuredSlugs = FOUNDATIONAL_SLUGS.slice(0, 3).map((item) => item.slug);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-teal-50 to-white p-8 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
          {t("heroSubtitle")}
        </p>
      </section>
      
      <section className="mt-14 rounded-2xl border border-teal-200 bg-accent-muted/40 p-8">
        <h2 className="text-2xl font-semibold text-stone-900">
          {t("plannerTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-stone-700">{t("plannerDescription")}</p>
        <Link
          href="/investment-planner"
          className="mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-900"
        >
          {t("plannerCta")}
        </Link>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              {t("fundamentalsTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-stone-600">{t("fundamentalsIntro")}</p>
          </div>
          <Link
            href="/fundamentals"
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("viewAllFundamentals")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSlugs.map((slug) => (
            <ArticleCard key={slug} slug={slug} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              {t("newsTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-stone-600">{t("newsIntro")}</p>
          </div>
          <Link
            href="/news"
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("viewAllNews")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      
    </main>
  );
}
