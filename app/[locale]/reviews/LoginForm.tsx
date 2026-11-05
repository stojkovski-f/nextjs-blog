"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { unlockReviews } from "./actions";

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("reviews");
  const [state, action, pending] = useActionState(unlockReviews, null);

  return (
    <form action={action} className="mt-8 max-w-sm">
      <input type="hidden" name="locale" value={locale} />
      <label htmlFor="reviews-password" className="block text-sm font-medium text-stone-700">
        {t("passwordLabel")}
      </label>
      <input
        id="reviews-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md border border-black bg-transparent px-4 py-2 text-sm text-stone-900 disabled:opacity-50"
      >
        {pending ? t("unlocking") : t("unlock")}
      </button>
      {state?.error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
