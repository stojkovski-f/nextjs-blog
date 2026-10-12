import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  formatArticleDate,
  getFoundationalArticle,
  getFoundationalNeighbors,
} from "@/lib/content";
import { FOUNDATIONAL_SLUGS, isFoundationalSlug } from "@/lib/foundational-slugs";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type Props = PageProps<"/[locale]/fundamentals/[slug]">;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const item of FOUNDATIONAL_SLUGS) {
      params.push({ locale, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isFoundationalSlug(slug)) return {};
  const article = await getFoundationalArticle(slug, locale as Locale);
  if (!article) return {};
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: `/fundamentals/${slug}`,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  });
}

export default async function FoundationalArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isFoundationalSlug(slug)) notFound();

  const article = await getFoundationalArticle(slug, locale as Locale);
  if (!article) notFound();

  const t = await getTranslations("fundamentals");
  const breadcrumb = await getTranslations("breadcrumb");
  const neighbors = getFoundationalNeighbors(slug);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: breadcrumb("home"), href: "/" },
          { label: breadcrumb("fundamentals"), href: "/fundamentals" },
          { label: article.frontmatter.title },
        ]}
      />
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          {article.frontmatter.title}
        </h1>
        <p className="mt-3 text-stone-600">{article.frontmatter.description}</p>
        <p className="mt-2 text-sm text-stone-500">
          {formatArticleDate(article.frontmatter.publishedAt, article.locale)}
          {article.frontmatter.updatedAt && (
            <>
              {" · "}
              {formatArticleDate(article.frontmatter.updatedAt, article.locale)}
            </>
          )}
        </p>
      </header>
      <div className="mt-10">
        <MarkdownContent html={article.html} />
      </div>
      <nav
        className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm font-medium"
        aria-label="Article navigation"
      >
        {neighbors.prev ? (
          <Link href={`/fundamentals/${neighbors.prev}`} className="text-accent hover:underline">
            ← {t("prev")}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/fundamentals" className="text-stone-600 hover:text-accent">
          {t("backToHub")}
        </Link>
        {neighbors.next ? (
          <Link href={`/fundamentals/${neighbors.next}`} className="text-accent hover:underline">
            {t("next")} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
