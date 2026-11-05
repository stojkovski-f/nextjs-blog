import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "reviews_access";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getPassword(): string | null {
  const password = process.env.REVIEWS_PAGE_PASSWORD;
  if (!password) {
    return null;
  }
  return password;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function secureEqual(left: string, right: string): boolean {
  return timingSafeEqual(digest(left), digest(right));
}

function accessToken(password: string): string {
  return createHmac("sha256", password).update("reviews-access-v1").digest("hex");
}

export function isReviewsPasswordConfigured(): boolean {
  return Boolean(getPassword());
}

export async function hasReviewsAccess(): Promise<boolean> {
  const password = getPassword();
  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  return secureEqual(token, accessToken(password));
}

export function passwordMatches(input: string): boolean {
  const password = getPassword();
  if (!password || !input) {
    return false;
  }
  return secureEqual(input, password);
}

export async function grantReviewsAccess(): Promise<void> {
  const password = getPassword();
  if (!password) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, accessToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearReviewsAccess(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
