"use server";

import { redirect } from "next/navigation";
import {
  clearReviewsAccess,
  grantReviewsAccess,
  isReviewsPasswordConfigured,
  passwordMatches,
} from "@/lib/reviews-auth";
import { routing, type Locale } from "@/i18n/routing";

function reviewsPath(locale: string): string {
  const safeLocale = routing.locales.includes(locale as Locale)
    ? locale
    : routing.defaultLocale;
  return `/${safeLocale}/reviews`;
}

export async function unlockReviews(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  if (!isReviewsPasswordConfigured()) {
    return { error: "This page is not configured yet." };
  }

  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? routing.defaultLocale);

  if (!passwordMatches(password)) {
    return { error: "Wrong password." };
  }

  await grantReviewsAccess();
  redirect(reviewsPath(locale));
}

export async function lockReviews(formData: FormData): Promise<void> {
  const locale = String(formData.get("locale") ?? routing.defaultLocale);
  await clearReviewsAccess();
  redirect(reviewsPath(locale));
}
