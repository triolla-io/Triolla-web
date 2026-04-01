import { NextRequest, NextResponse } from "next/server";
import { getAllPageSlugs, loadRawPageMetadata } from "../../lib/metadataLoader";

/**
 * GET /api/metadata
 * Returns a list of all available pages with their slugs
 */
export async function GET() {
  try {
    const slugs = getAllPageSlugs();
    const pages = slugs.map((slug) => {
      try {
        const metadata = loadRawPageMetadata(slug);
        return {
          slug,
          title_en: metadata.title_en,
          title_he: metadata.title_he,
          section: metadata.section,
        };
      } catch {
        return {
          slug,
          title_en: "Error loading",
          title_he: "שגיאה בטעינה",
          section: "unknown",
        };
      }
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching metadata list:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata list" },
      { status: 500 }
    );
  }
}
