import { z } from "zod";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Metadata schema for all pages (titles, descriptions, SEO fields)
 * Supports bilingual content (en + he)
 */
const PageMetadataSchema = z.object({
  slug: z.string().min(1),
  title_en: z.string().min(1),
  title_he: z.string().min(1),
  description_en: z.string().min(1),
  description_he: z.string().min(1),
  og_image: z.string().optional(),
  og_type: z.enum(["website", "article"]).default("website"),
  keywords_en: z.string().optional(),
  keywords_he: z.string().optional(),
  section: z.enum(["main", "service", "blog"]).default("main"),
});

export type PageMetadata = z.infer<typeof PageMetadataSchema>;

/**
 * Load metadata for a specific page and language
 * @param slug Page slug (e.g., "about-us", "technology")
 * @param lang Language ("en" or "he")
 * @returns Object with title, description, og_image, og_type, keywords
 */
export function loadPageMetadata(slug: string, lang: "en" | "he" = "en") {
  try {
    const filePath = resolve(
      process.cwd(),
      `app/metadata/${slug}-metadata.json`
    );
    const fileContent = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Validate against schema
    const validated = PageMetadataSchema.parse(data);

    // Return language-specific fields
    return {
      slug: validated.slug,
      title: lang === "en" ? validated.title_en : validated.title_he,
      description: lang === "en" ? validated.description_en : validated.description_he,
      og_image: validated.og_image || "/og-image.png",
      og_type: validated.og_type,
      keywords: lang === "en" ? validated.keywords_en : validated.keywords_he,
      section: validated.section,
    };
  } catch (error) {
    console.error(`Failed to load metadata for slug: ${slug}`, error);
    throw new Error(`Metadata not found for slug: ${slug}`);
  }
}

/**
 * Load raw metadata JSON without language filtering
 * Used by admin editor UI
 */
export function loadRawPageMetadata(slug: string): PageMetadata {
  try {
    const filePath = resolve(
      process.cwd(),
      `app/metadata/${slug}-metadata.json`
    );
    const fileContent = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return PageMetadataSchema.parse(data);
  } catch (error) {
    console.error(`Failed to load raw metadata for slug: ${slug}`, error);
    throw new Error(`Metadata not found for slug: ${slug}`);
  }
}

/**
 * Validate metadata object
 * Used by admin editor before saving
 */
export function validateMetadata(data: unknown): { valid: boolean; errors?: string[] } {
  try {
    PageMetadataSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return {
      valid: false,
      errors: ["Unknown validation error"],
    };
  }
}

/**
 * Get all available page slugs (for admin editor listing)
 * Scans app/metadata/ directory for *-metadata.json files
 */
export function getAllPageSlugs(): string[] {
  try {
    const metadataDir = resolve(process.cwd(), "app/metadata");
    const { readdirSync } = require("fs");
    const files = readdirSync(metadataDir);
    return files
      .filter((f: string) => f.endsWith("-metadata.json"))
      .map((f: string) => f.replace("-metadata.json", ""));
  } catch (error) {
    console.error("Failed to scan metadata directory", error);
    return [];
  }
}
