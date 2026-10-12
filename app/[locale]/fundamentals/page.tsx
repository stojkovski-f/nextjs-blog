import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FOUNDATIONAL_SLUGS } from "@/lib/foundational-slugs";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type Props = PageProps<"/[locale]/fundamentals">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fundamentals" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/fundamentals",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function FundamentalsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("fundamentals");
  const breadcrumb = await getTranslations("breadcrumb");

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: breadcrumb("home"), href: "/" },
          { label: breadcrumb("fundamentals") },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-stone-600">
        {t("intro")}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {FOUNDATIONAL_SLUGS.map((item) => (
          <ArticleCard key={item.slug} slug={item.slug} />
        ))}
      </div>
    </main>
  );
}
