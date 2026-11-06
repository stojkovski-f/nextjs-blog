export const SITE_NAME = "Bostadsklok";

function withHttps(host: string): string {
  const trimmed = host.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) {
    return withHttps(production);
  }

  const deployment = process.env.VERCEL_URL;
  if (deployment) {
    return withHttps(deployment);
  }

  return "http://localhost:3000";
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteOrigin();
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
