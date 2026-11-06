import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

const PAYPAL_DONATE_URL =
  "https://www.paypal.com/donate/?hosted_button_id=BLEA94AY958HC";

type Props = PageProps<"/[locale]/about">;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale: locale as Locale,
    pathWithoutLocale: "/about",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {t("title")}
      </h1>
      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
        <Image
          src="/filip-stojkovski.png"
          alt="Filip Stojkovski"
          width={320}
          height={320}
          className="h-40 w-40 shrink-0 rounded-2xl object-cover sm:h-48 sm:w-48"
          priority
        />
        <div>
          <p className="text-xl text-stone-800">{t("greeting")}</p>
          <div className="mt-4 space-y-4 leading-relaxed text-stone-700">
            <p>{t("intro")}</p>
            <p className="text-accent italic">{t("support")}</p>
            <p>{t("closing")}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={PAYPAL_DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
        >
          {t("donateCta")}
        </a>
        <Link
          href="/investment-planner"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-900"
        >
          {t("calculatorCta")}
        </Link>
      </div>
    </main>
  );
}
