import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { resolve } from "path";
import {
  loadRawPageMetadata,
  validateMetadata,
  type PageMetadata,
} from "../../../lib/metadataLoader";

/**
 * GET /api/metadata/[slug]
 * Returns metadata for a specific page
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const metadata = loadRawPageMetadata(slug);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error(`Error fetching metadata for slug:`, error);
    return NextResponse.json(
      { error: `Metadata not found for slug` },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/metadata/[slug]
 * Updates metadata for a specific page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Validate the metadata
    const validation = validateMetadata(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Ensure slug matches
    if (body.slug !== slug) {
      return NextResponse.json(
        { error: "Slug mismatch" },
        { status: 400 }
      );
    }

    // Write to file
    const filePath = resolve(
      process.cwd(),
      `app/metadata/${slug}-metadata.json`
    );

    // Check if it's a service slug
    const isService = slug.includes("-") && !["about-us", "technology"].includes(slug);
    const actualPath = isService
      ? filePath.replace("app/metadata/", "app/metadata/services/")
      : filePath;

    const jsonString = JSON.stringify(body, null, 2);
    writeFileSync(actualPath, jsonString, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Metadata updated for slug: ${slug}`,
      metadata: body,
    });
  } catch (error) {
    console.error(`Error updating metadata:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
