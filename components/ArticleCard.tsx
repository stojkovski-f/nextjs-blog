import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FoundationalSlug } from "@/lib/foundational-slugs";

type ArticleCardProps = {
  slug: FoundationalSlug;
};

export function ArticleCard({ slug }: ArticleCardProps) {
  const t = useTranslations("articles");
  const fundamentals = useTranslations("fundamentals");

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-lg font-semibold text-stone-900">
        {t(`${slug}.cardTitle`)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
        {t(`${slug}.cardDescription`)}
      </p>
      <Link
        href={`/fundamentals/${slug}`}
        className="mt-4 text-sm font-medium text-accent hover:underline"
      >
        {fundamentals("readArticle")} →
      </Link>
    </article>
  );
}
