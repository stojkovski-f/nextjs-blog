import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getReviewsSummary } from "@/lib/reviews";
import {
  hasReviewsAccess,
  isReviewsPasswordConfigured,
} from "@/lib/reviews-auth";
import { LoginForm } from "./LoginForm";
import { lockReviews } from "./actions";

type Props = PageProps<"/[locale]/reviews">;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });

  return {
    title: t("title"),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviews");
  const configured = isReviewsPasswordConfigured();
  const unlocked = configured && (await hasReviewsAccess());

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
        {t("title")}
      </h1>
      <p className="mt-2 text-stone-600">{t("privateNote")}</p>

      {!configured ? (
        <p className="mt-8 text-stone-700">{t("notConfigured")}</p>
      ) : !unlocked ? (
        <LoginForm locale={locale} />
      ) : (
        <ReviewsContent locale={locale} />
      )}
    </main>
  );
}

async function ReviewsContent({ locale }: { locale: string }) {
  const t = await getTranslations("reviews");
  const summary = await getReviewsSummary();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="rounded-lg border border-stone-200 bg-card p-4">
          <p className="text-sm text-stone-600">{t("likesWithoutFeedback")}</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {summary.likesWithoutFeedback}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {t("totalLikes", { count: summary.totalLikes })}
          </p>
        </div>
        <form action={lockReviews}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:border-stone-900"
          >
            {t("lock")}
          </button>
        </form>
      </div>

      {summary.comments.length === 0 ? (
        <p className="mt-8 text-stone-600">{t("empty")}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {summary.comments.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-stone-200 bg-card p-4"
            >
              <p className="text-xs text-stone-500">
                {dateFormatter.format(new Date(review.createdAt))}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-stone-800">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
