"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { addCalculatorComment, addCalculatorLike } from "./actions";

const MAX_COMMENT_LENGTH = 600;
const PAYPAL_DONATE_URL =
  "https://www.paypal.com/donate/?hosted_button_id=BLEA94AY958HC";

export function CalculatorFeedback({
  initialLikeCount,
}: {
  initialLikeCount: number;
}) {
  const t = useTranslations("planner");
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (liked || isPending) return;

    startTransition(async () => {
      const result = await addCalculatorLike();
      if ("error" in result) {
        setError(result.error);
        return;
      }

      setLikeId(result.id);
      setLikeCount((count) => count + 1);
      setLiked(true);
      setAccordionOpen(true);
      setError(null);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!likeId || submitted || isPending) return;

    startTransition(async () => {
      const result = await addCalculatorComment(likeId, comment);
      if ("error" in result) {
        setError(result.error);
        return;
      }

      setSubmitted(true);
      setError(null);
    });
  };

  return (
    <div className="mt-4 flex flex-col items-start">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-stone-700 font-bold">{t("likePrompt")}</p>
        <button
          type="button"
          onClick={handleLike}
          disabled={liked || isPending}
          aria-pressed={liked}
          aria-label={t("likeAria", { count: likeCount })}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-500 bg-transparent px-3 py-1 text-sm text-stone-900 cursor-pointer disabled:cursor-default"
        >
          <span className={liked ? "grayscale" : ""} aria-hidden>
            ❤️
          </span>
          <span>
            {likeCount} {t("likesLabel")}
          </span>
        </button>
      </div>

      <div
        className={`grid w-full max-w-xl transition-[grid-template-rows] duration-300 ease-out ${
          accordionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" aria-hidden={!accordionOpen}>
          <div className="mt-3 rounded-lg border border-stone-200 bg-card p-4">
            {submitted ? (
              <>
                <p className="font-medium text-stone-900">
                  {t("submitSuccessTitle")}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-stone-600">
                  {t.rich("submitSuccessBody", {
                    donate: (chunks) => (
                      <a
                        href={PAYPAL_DONATE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent underline underline-offset-2 hover:text-teal-800"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-stone-900">{t("thanksTitle")}</p>
                <p className="mt-1 text-sm text-stone-600">{t("thanksBody")}</p>
                <form
                  className="mt-3 flex flex-col gap-2"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full">
                    <label htmlFor="calculator-feedback-comment" className="sr-only">
                      {t("thanksBody")}
                    </label>
                    <textarea
                      id="calculator-feedback-comment"
                      value={comment}
                      onChange={(event) =>
                        setComment(event.target.value.slice(0, MAX_COMMENT_LENGTH))
                      }
                      maxLength={MAX_COMMENT_LENGTH}
                      rows={3}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-900"
                      placeholder={t("commentPlaceholder")}
                    />
                    <p className="mt-1 text-right text-xs text-stone-500">
                      {comment.length}/{MAX_COMMENT_LENGTH}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isPending || comment.trim().length === 0}
                    className="w-full sm:w-auto self-start rounded-md border border-black bg-transparent px-4 py-2 text-sm text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("submit")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
