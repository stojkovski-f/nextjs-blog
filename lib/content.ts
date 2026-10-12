import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/routing";
import {
  FOUNDATIONAL_SLUGS,
  isFoundationalSlug,
  type FoundationalSlug,
} from "./foundational-slugs";
import { markdownToHtml } from "./markdown";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ArticleFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  featured?: boolean;
  source?: string;
  sourceLabel?: string;
};

export type Article = {
  slug: string;
  locale: Locale;
  type: "foundational" | "news";
  frontmatter: ArticleFrontmatter;
  content: string;
  html: string;
  order?: number;
};

function localeFile(locale: Locale): string {
  return `${locale}.md`;
}

async function readMarkdownFile(
  filePath: string,
): Promise<{ frontmatter: ArticleFrontmatter; content: string } | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as ArticleFrontmatter;
    if (!frontmatter.title || !frontmatter.description || !frontmatter.publishedAt) {
      return null;
    }
    return { frontmatter, content };
  } catch {
    return null;
  }
}

async function toArticle(
  type: "foundational" | "news",
  slug: string,
  locale: Locale,
  order?: number,
): Promise<Article | null> {
  const dir =
    type === "foundational"
      ? path.join(CONTENT_DIR, "foundational", slug)
      : path.join(CONTENT_DIR, "news", slug);
  const parsed = await readMarkdownFile(path.join(dir, localeFile(locale)));
  if (!parsed) return null;

  const html = await markdownToHtml(parsed.content);
  return {
    slug,
    locale,
    type,
    frontmatter: parsed.frontmatter,
    content: parsed.content,
    html,
    order,
  };
}

export async function getFoundationalArticles(
  locale: Locale,
): Promise<Article[]> {
  const articles: Article[] = [];

  for (const item of FOUNDATIONAL_SLUGS) {
    const article = await toArticle(
      "foundational",
      item.slug,
      locale,
      item.order,
    );
    if (article) articles.push(article);
  }

  return articles.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getFoundationalArticle(
  slug: string,
  locale: Locale,
): Promise<Article | null> {
  if (!isFoundationalSlug(slug)) return null;
  const order = FOUNDATIONAL_SLUGS.find((item) => item.slug === slug)?.order;
  return toArticle("foundational", slug, locale, order);
}

async function listNewsSlugs(): Promise<string[]> {
  const newsDir = path.join(CONTENT_DIR, "news");
  try {
    const entries = await fs.readdir(newsDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function newsHasBothLocales(slug: string): Promise<boolean> {
  const dir = path.join(CONTENT_DIR, "news", slug);
  const [sv, en] = await Promise.all([
    readMarkdownFile(path.join(dir, localeFile("sv"))),
    readMarkdownFile(path.join(dir, localeFile("en"))),
  ]);
  return Boolean(sv && en);
}

export async function getNewsPosts(
  locale: Locale,
  options?: { limit?: number },
): Promise<Article[]> {
  const slugs = await listNewsSlugs();
  const articles: Article[] = [];

  for (const slug of slugs) {
    if (!(await newsHasBothLocales(slug))) continue;
    const article = await toArticle("news", slug, locale);
    if (article) articles.push(article);
  }

  articles.sort((a, b) => {
    const featuredDiff =
      Number(b.frontmatter.featured ?? false) -
      Number(a.frontmatter.featured ?? false);
    if (featuredDiff !== 0) return featuredDiff;
    return (
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    );
  });

  if (options?.limit !== undefined) {
    return articles.slice(0, options.limit);
  }
  return articles;
}

export async function getNewsPost(
  slug: string,
  locale: Locale,
): Promise<Article | null> {
  if (!(await newsHasBothLocales(slug))) return null;
  return toArticle("news", slug, locale);
}

export async function getArticle(
  type: "foundational" | "news",
  slug: string,
  locale: Locale,
): Promise<Article | null> {
  if (type === "foundational") return getFoundationalArticle(slug, locale);
  return getNewsPost(slug, locale);
}

export function getFoundationalNeighbors(slug: FoundationalSlug): {
  prev: FoundationalSlug | null;
  next: FoundationalSlug | null;
} {
  const index = FOUNDATIONAL_SLUGS.findIndex((item) => item.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? FOUNDATIONAL_SLUGS[index - 1].slug : null,
    next:
      index < FOUNDATIONAL_SLUGS.length - 1
        ? FOUNDATIONAL_SLUGS[index + 1].slug
        : null,
  };
}

export function formatArticleDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export async function getAllStaticSlugs(): Promise<{
  foundational: FoundationalSlug[];
  news: string[];
}> {
  const newsSlugs = await listNewsSlugs();
  const news: string[] = [];
  for (const slug of newsSlugs) {
    if (await newsHasBothLocales(slug)) news.push(slug);
  }
  return {
    foundational: FOUNDATIONAL_SLUGS.map((item) => item.slug),
    news,
  };
}
