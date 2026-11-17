import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import type { MediaMetadata } from "@/types/media";
import { formatDuration } from "@/lib/utils";

const execFileAsync = promisify(execFile);

// Maximum execution timeout for metadata extraction (20 seconds)
const EXTRACT_TIMEOUT_MS = 20000;
// Maximum execution timeout for audio download and conversion (120 seconds)
const DOWNLOAD_TIMEOUT_MS = 120000;

export async function checkSystemDependencies(): Promise<{
  ytdlp: { available: boolean; version?: string };
  ffmpeg: { available: boolean; version?: string };
}> {
  let ytdlpResult: { available: boolean; version?: string } = { available: false };
  let ffmpegResult: { available: boolean; version?: string } = { available: false };

  try {
    const { stdout } = await execFileAsync("yt-dlp", ["--version"]);
    ytdlpResult = { available: true, version: stdout.trim() };
  } catch {
    ytdlpResult = { available: false };
  }

  try {
    const { stdout } = await execFileAsync("ffmpeg", ["-version"]);
    const firstLine = stdout.split("\n")[0] || "";
    ffmpegResult = { available: true, version: firstLine.trim() };
  } catch {
    ffmpegResult = { available: false };
  }

  return { ytdlp: ytdlpResult, ffmpeg: ffmpegResult };
}

interface YtDlpRawMetadata {
  id?: string;
  title?: string;
  uploader?: string;
  channel?: string;
  artist?: string;
  creator?: string;
  duration?: number;
  thumbnail?: string;
  thumbnails?: Array<{ url: string; width?: number; height?: number }>;
  extractor?: string;
  extractor_key?: string;
  description?: string;
  filesize?: number;
  filesize_approx?: number;
}

export async function extractMediaInfo(rawUrl: string): Promise<MediaMetadata> {
  const cleanUrl = rawUrl.trim();

  // If URL indicates a sample/demo request or offline test
  if (
    cleanUrl.includes("sample-synthwave-demo") ||
    cleanUrl.includes("demo-track") ||
    cleanUrl === "demo"
  ) {
    return {
      id: "demo-synthwave-2026",
      title: "Midnight City Lights (Chillwave & Synth Electronic Extended Mix)",
      author: "Neon Dreamer Studio",
      duration: "03:48",
      durationSeconds: 228,
      source: "YouTube Demo",
      thumbnailUrl: "",
      bitrate: "320 kbps",
      fileSize: "8.7 MB",
      format: "MP3",
      isMock: true,
      originalUrl: cleanUrl,
      description: "Sample offline demonstration track for previewing UI and audio features.",
    };
  }

  const args = [
    "--dump-single-json",
    "--no-playlist",
    "--no-warnings",
    "--skip-download",
    "--prefer-free-formats",
    cleanUrl,
  ];

  let rawJson: string;
  try {
    const { stdout } = await execFileAsync("yt-dlp", args, {
      timeout: EXTRACT_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
    });
    rawJson = stdout;
  } catch (error: unknown) {
    const execErr = error as { stderr?: string; message?: string };
    const errMessage = execErr.stderr || execErr.message || "Failed to extract media information";

    // Detect offline / DNS resolution issues
    if (
      errMessage.includes("Failed to resolve") ||
      errMessage.includes("Temporary failure in name resolution") ||
      errMessage.includes("Network is unreachable")
    ) {
      throw new Error(
        "Network connection unreachable or offline. If you are testing offline, you can use the Demo URL option."
      );
    }

    if (errMessage.includes("Video unavailable") || errMessage.includes("Private video")) {
      throw new Error("This media is private, removed, or unavailable in this region.");
    }

    if (errMessage.includes("Unsupported URL")) {
      throw new Error("Unsupported media URL. Please provide a supported link (e.g. YouTube, SoundCloud, Vimeo, etc.).");
    }

    throw new Error(errMessage.slice(0, 300));
  }

  const data: YtDlpRawMetadata = JSON.parse(rawJson);

  const durationSecs = Math.round(data.duration || 0);
  const formattedDuration = durationSecs > 0 ? formatDuration(durationSecs) : "Live / Unknown";

  // Calculate approximate file size for 320 kbps MP3: (320 * 1000 / 8) bytes/sec
  const approxBytes = durationSecs > 0 ? (durationSecs * 320 * 1000) / 8 : 8.5 * 1024 * 1024;
  const approxMb = (approxBytes / (1024 * 1024)).toFixed(1);

  // Pick best thumbnail
  let bestThumbnail = data.thumbnail || "";
  if (!bestThumbnail && data.thumbnails && data.thumbnails.length > 0) {
    bestThumbnail = data.thumbnails[data.thumbnails.length - 1].url;
  }

  const sourceName =
    data.extractor_key ||
    (data.extractor
      ? data.extractor.charAt(0).toUpperCase() + data.extractor.slice(1)
      : "Media");

  return {
    id: data.id || `track-${Date.now()}`,
    title: data.title || "Untitled Audio Track",
    author: data.artist || data.uploader || data.channel || data.creator || "Unknown Artist",
    duration: formattedDuration,
    durationSeconds: durationSecs,
    source: sourceName,
    thumbnailUrl: bestThumbnail,
    bitrate: "320 kbps",
    fileSize: `${approxMb} MB`,
    format: "MP3",
    isMock: false,
    originalUrl: cleanUrl,
    description: data.description ? data.description.slice(0, 150) + "..." : undefined,
  };
}

export interface DownloadResult {
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function processAudioDownload(
  url: string,
  quality: string,
  targetDir: string
): Promise<DownloadResult> {
  const cleanUrl = url.trim();

  // Validate quality setting
  const qualityMap: Record<string, string> = {
    "320": "320K",
    "256": "256K",
    "128": "128K",
  };
  const targetQuality = qualityMap[quality] || "320K";

  // Handle sample demo track generation if requested offline
  if (
    cleanUrl.includes("sample-synthwave-demo") ||
    cleanUrl.includes("demo-track") ||
    cleanUrl === "demo"
  ) {
    const demoFileName = "Midnight_City_Lights_Demo.mp3";
    const demoFilePath = path.join(targetDir, demoFileName);

    // Generate a quick sample MP3 file with sine chords using ffmpeg
    await execFileAsync("ffmpeg", [
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=3",
      "-vn",
      "-c:a",
      "libmp3lame",
      "-b:a",
      targetQuality,
      demoFilePath,
    ]);

    const stat = await fs.stat(demoFilePath);
    return {
      filePath: demoFilePath,
      fileName: demoFileName,
      fileSize: stat.size,
      mimeType: "audio/mpeg",
    };
  }

  const outputTemplate = path.join(targetDir, "%(title).100B.%(ext)s");

  const args = [
    "-x",
    "--audio-format",
    "mp3",
    "--audio-quality",
    targetQuality,
    "--no-playlist",
    "--embed-metadata",
    "--output",
    outputTemplate,
    cleanUrl,
  ];

  try {
    await execFileAsync("yt-dlp", args, {
      timeout: DOWNLOAD_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error: unknown) {
    const execErr = error as { stderr?: string; message?: string };
    const errMessage = execErr.stderr || execErr.message || "Failed to download and process audio";
    throw new Error(errMessage.slice(0, 300));
  }

  // Find generated .mp3 file in targetDir
  const files = await fs.readdir(targetDir);
  const mp3File = files.find((f) => f.endsWith(".mp3"));

  if (!mp3File) {
    throw new Error("Conversion succeeded but output MP3 file could not be located.");
  }

  const finalFilePath = path.join(targetDir, mp3File);
  const stat = await fs.stat(finalFilePath);

  return {
    filePath: finalFilePath,
    fileName: mp3File,
    fileSize: stat.size,
    mimeType: "audio/mpeg",
  };
}
