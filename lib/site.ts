export const SITE_NAME = "Bostad & Bolån";

export function absoluteUrl(pathname: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
