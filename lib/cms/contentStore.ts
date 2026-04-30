import "server-only";
import path from "path";
import { mkdir, readFile, readdir, rm, stat, writeFile, rename } from "fs/promises";

export type CmsKind = "page" | "blog";
export type CmsLocale = "en" | "he";

export const SUPPORTED_LOCALES: CmsLocale[] = ["en", "he"];

export type CmsMeta = {
  title: string;
  description: string;
  ogImage?: string;
  jsonLd?: unknown;
  status?: "draft" | "published";
  updatedAt: number;
  /** Snapshot registry slug to inherit CSS/JS from (makes the page look like an existing post). */
  templateSlug?: string;
};

export type CmsPageFiles = {
  body: string;
  styles: string;
  stylesScoped: string;
  meta: CmsMeta;
};

export type CmsPageSummary = {
  kind: CmsKind;
  slug: string;
  locales: CmsLocale[];
  title: string;
  updatedAt: number | null;
};

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 120) return false;
  if (slug.includes("..") || slug.includes("/") || slug.includes("\\")) return false;
  return SLUG_RE.test(slug);
}

export function isValidLocale(locale: string): locale is CmsLocale {
  return SUPPORTED_LOCALES.includes(locale as CmsLocale);
}

export function isValidKind(kind: string): kind is CmsKind {
  return kind === "page" || kind === "blog";
}

const ROOT = path.join(process.cwd(), "content");

function kindDir(kind: CmsKind): string {
  return path.join(ROOT, kind === "blog" ? "blog" : "pages");
}

function pageDir(kind: CmsKind, slug: string): string {
  if (!isValidSlug(slug)) throw new Error(`invalid slug: ${slug}`);
  return path.join(kindDir(kind), slug);
}

function localeDir(kind: CmsKind, slug: string, locale: CmsLocale): string {
  if (!isValidLocale(locale)) throw new Error(`invalid locale: ${locale}`);
  return path.join(pageDir(kind, slug), locale);
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function safeReaddir(p: string): Promise<string[]> {
  try {
    return await readdir(p);
  } catch {
    return [];
  }
}

export async function readPage(
  kind: CmsKind,
  slug: string,
  locale: CmsLocale
): Promise<CmsPageFiles | null> {
  const dir = localeDir(kind, slug, locale);
  if (!(await exists(dir))) return null;
  const [body, styles, stylesScoped, metaRaw] = await Promise.all([
    readFile(path.join(dir, "body.html"), "utf-8").catch(() => ""),
    readFile(path.join(dir, "styles.css"), "utf-8").catch(() => ""),
    readFile(path.join(dir, "styles.scoped.css"), "utf-8").catch(() => ""),
    readFile(path.join(dir, "meta.json"), "utf-8").catch(() => "{}"),
  ]);
  let meta: CmsMeta;
  try {
    const parsed = JSON.parse(metaRaw) as Partial<CmsMeta>;
    meta = {
      title: typeof parsed.title === "string" ? parsed.title : "",
      description: typeof parsed.description === "string" ? parsed.description : "",
      ogImage: typeof parsed.ogImage === "string" ? parsed.ogImage : undefined,
      jsonLd: parsed.jsonLd,
      status: parsed.status === "published" ? "published" : "draft",
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
      templateSlug: typeof parsed.templateSlug === "string" ? parsed.templateSlug : undefined,
    };
  } catch {
    meta = { title: "", description: "", status: "draft", updatedAt: 0 };
  }
  return { body, styles, stylesScoped, meta };
}

export type WritePageInput = {
  body: string;
  styles: string;
  stylesScoped: string;
  meta: Omit<CmsMeta, "updatedAt"> & { updatedAt?: number };
};

export async function writePage(
  kind: CmsKind,
  slug: string,
  locale: CmsLocale,
  input: WritePageInput
): Promise<CmsPageFiles> {
  const dir = localeDir(kind, slug, locale);
  await mkdir(dir, { recursive: true });
  const meta: CmsMeta = { ...input.meta, updatedAt: Date.now() };
  await Promise.all([
    atomicWrite(path.join(dir, "body.html"), input.body),
    atomicWrite(path.join(dir, "styles.css"), input.styles),
    atomicWrite(path.join(dir, "styles.scoped.css"), input.stylesScoped),
    atomicWrite(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n"),
  ]);
  return { body: input.body, styles: input.styles, stylesScoped: input.stylesScoped, meta };
}

async function atomicWrite(file: string, body: string): Promise<void> {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, body, "utf-8");
  await rename(tmp, file);
}

export async function deletePage(
  kind: CmsKind,
  slug: string,
  locale?: CmsLocale
): Promise<void> {
  if (locale) {
    await rm(localeDir(kind, slug, locale), { recursive: true, force: true });
    const remaining = await listLocales(kind, slug);
    if (remaining.length === 0) {
      await rm(pageDir(kind, slug), { recursive: true, force: true });
    }
  } else {
    await rm(pageDir(kind, slug), { recursive: true, force: true });
  }
}

export async function listLocales(kind: CmsKind, slug: string): Promise<CmsLocale[]> {
  const dir = pageDir(kind, slug);
  const entries = await safeReaddir(dir);
  return entries.filter(isValidLocale) as CmsLocale[];
}

export async function listAllPages(): Promise<CmsPageSummary[]> {
  const summaries: CmsPageSummary[] = [];
  for (const kind of ["page", "blog"] as const) {
    const dir = kindDir(kind);
    const slugs = await safeReaddir(dir);
    for (const slug of slugs) {
      if (!isValidSlug(slug)) continue;
      const locales = await listLocales(kind, slug);
      if (locales.length === 0) continue;
      // Use the first locale's metadata as the display title.
      const first = await readPage(kind, slug, locales[0]);
      summaries.push({
        kind,
        slug,
        locales,
        title: first?.meta.title ?? "",
        updatedAt: first?.meta.updatedAt ?? null,
      });
    }
  }
  summaries.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return summaries;
}

export async function pageExists(kind: CmsKind, slug: string): Promise<boolean> {
  return exists(pageDir(kind, slug));
}

export async function localeExists(
  kind: CmsKind,
  slug: string,
  locale: CmsLocale
): Promise<boolean> {
  return exists(localeDir(kind, slug, locale));
}

export function publicSlugUrl(kind: CmsKind, slug: string, locale: CmsLocale): string {
  const prefix = locale === "he" ? "/he" : "";
  if (kind === "blog") return `${prefix}/blog/${slug}`;
  return `${prefix}/${slug}`;
}

export function cmsScopeId(kind: CmsKind, slug: string): string {
  return `cms-${kind}-${slug}`;
}
