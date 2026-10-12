import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatArticleDate, type Article } from "@/lib/content";

type NewsCardProps = {
  article: Article;
};

export function NewsCard({ article }: NewsCardProps) {
  const t = useTranslations("news");

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <time
        dateTime={article.frontmatter.publishedAt}
        className="text-xs font-medium uppercase tracking-wide text-stone-500"
      >
        {formatArticleDate(article.frontmatter.publishedAt, article.locale)}
      </time>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">
        {article.frontmatter.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
        {article.frontmatter.description}
      </p>
      <Link
        href={`/news/${article.slug}`}
        className="mt-4 text-sm font-medium text-accent hover:underline"
      >
        {t("readMore")} →
      </Link>
    </article>
  );
}
