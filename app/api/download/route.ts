import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import os from "os";
import path from "path";
import { processAudioDownload } from "@/lib/ytdlp";
import { isValidUrl } from "@/lib/utils";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const quality = searchParams.get("quality") || "320";

  if (!targetUrl || !targetUrl.trim()) {
    return NextResponse.json(
      { error: "Missing required 'url' query parameter." },
      { status: 400 }
    );
  }

  const cleanUrl = targetUrl.trim();
  const isSpecialDemo =
    cleanUrl.includes("sample-synthwave-demo") ||
    cleanUrl.includes("demo-track") ||
    cleanUrl === "demo";

  if (!isSpecialDemo && !isValidUrl(cleanUrl)) {
    return NextResponse.json(
      { error: "Invalid URL provided. Please provide a valid HTTP or HTTPS media link." },
      { status: 400 }
    );
  }

  let tempDir = "";
  try {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "music-dl-"));
    const downloadResult = await processAudioDownload(cleanUrl, quality, tempDir);

    const { filePath, fileName, fileSize, mimeType } = downloadResult;

    // Sanitize filename for safe ASCII fallback in Content-Disposition
    const safeAsciiName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const encodedFileName = encodeURIComponent(fileName);

    const nodeStream = fsSync.createReadStream(filePath);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        nodeStream.on("end", () => {
          controller.close();
          // Clean up temp dir after delivery
          fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        });
        nodeStream.on("error", (err) => {
          controller.error(err);
          fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        });
      },
      cancel() {
        nodeStream.destroy();
        fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(fileSize),
        "Content-Disposition": `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedFileName}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: unknown) {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
    const err = error as Error;
    return NextResponse.json(
      {
        error: err.message || "Failed to download and process audio file.",
      },
      { status: 500 }
    );
  }
}
