import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { formatArticleDate, getAllStaticSlugs, getNewsPost } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type Props = PageProps<"/[locale]/news/[slug]">;

export async function generateStaticParams() {
  const { news } = await getAllStaticSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of news) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getNewsPost(slug, locale as Locale);
  if (!article) return {};
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: `/news/${slug}`,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getNewsPost(slug, locale as Locale);
  if (!article) notFound();

  const t = await getTranslations("news");
  const breadcrumb = await getTranslations("breadcrumb");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: breadcrumb("home"), href: "/" },
          { label: breadcrumb("news"), href: "/news" },
          { label: article.frontmatter.title },
        ]}
      />
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          {article.frontmatter.title}
        </h1>
        <p className="mt-3 text-stone-600">{article.frontmatter.description}</p>
        <time
          dateTime={article.frontmatter.publishedAt}
          className="mt-2 block text-sm text-stone-500"
        >
          {formatArticleDate(article.frontmatter.publishedAt, article.locale)}
        </time>
      </header>
      <div className="mt-10">
        <MarkdownContent html={article.html} />
      </div>
      {article.frontmatter.source && (
        <p className="mt-8 text-sm text-stone-600">
          {t("source")}:{" "}
          <a
            href={article.frontmatter.source}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.frontmatter.sourceLabel ?? article.frontmatter.source}
          </a>
        </p>
      )}
      <p className="mt-8">
        <Link href="/news" className="text-sm font-medium text-accent hover:underline">
          ← {t("backToNews")}
        </Link>
      </p>
    </main>
  );
}
