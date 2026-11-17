import { NextRequest, NextResponse } from "next/server";
import { extractMediaInfo } from "@/lib/ytdlp";
import { isValidUrl } from "@/lib/utils";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid media URL." },
        { status: 400 }
      );
    }

    const targetUrl = body.url.trim();

    // Allow special demo keywords for offline testing
    const isSpecialDemo =
      targetUrl.includes("sample-synthwave-demo") ||
      targetUrl.includes("demo-track") ||
      targetUrl === "demo";

    if (!isSpecialDemo && !isValidUrl(targetUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid URL format. Please include http:// or https://" },
        { status: 400 }
      );
    }

    const metadata = await extractMediaInfo(targetUrl);

    return NextResponse.json({
      success: true,
      data: metadata,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected error occurred while fetching media metadata.",
      },
      { status: 500 }
    );
  }
}
