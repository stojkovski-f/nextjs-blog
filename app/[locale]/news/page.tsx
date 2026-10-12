import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { getNewsPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]/news">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/news",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function NewsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("news");
  const breadcrumb = await getTranslations("breadcrumb");
  const news = await getNewsPosts(locale as Locale);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: breadcrumb("home"), href: "/" },
          { label: breadcrumb("news") },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-stone-600">{t("intro")}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {news.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  );
}
