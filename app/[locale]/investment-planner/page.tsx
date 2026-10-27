import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";


import "./index.css";
import App from "./App";



type Props = PageProps<"/[locale]/investment-planner">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "planner" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/investment-planner",
    title: t("title"),
    description: t("description"),
  });
}

export default async function InvestmentPlannerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("planner");

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        {t("comingSoon")}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {t("title")}
      </h1>
      <p className="mt-2 text-xl text-stone-700">{t("subtitle")}</p>
      <p className="mt-6 leading-relaxed text-stone-600">{t("description")}</p>
      <div id="investment-planner-root" className="mt-10 w-full min-w-0">
        <App />
      </div>
    </main>
  );
}
