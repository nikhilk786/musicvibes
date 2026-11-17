"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { UrlInput } from "@/components/UrlInput";
import { DownloadCard } from "@/components/DownloadCard";
import { DownloadProgress } from "@/components/DownloadProgress";
import { MediaMetadata, DownloadProgressState, InfoApiResponse } from "@/types/media";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaMetadata | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("320");
  const [serverStatus, setServerStatus] = useState<{
    ytdlp: boolean;
    ffmpeg: boolean;
  }>({ ytdlp: true, ffmpeg: true });

  const [progressState, setProgressState] = useState<DownloadProgressState>({
    status: "idle",
    percent: 0,
    speed: "Waiting...",
    downloadedBytes: "0 MB",
    totalBytes: "Unknown",
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend server health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ytdlp && data.ffmpeg) {
          setServerStatus({
            ytdlp: data.ytdlp.available,
            ffmpeg: data.ffmpeg.available,
          });
        }
      })
      .catch(() => {
        // Backend health check fallback
      });
  }, []);

  const handleUrlSubmit = async (submittedUrl: string) => {
    setIsFetchingInfo(true);
    setProgressState({ status: "idle", percent: 0 });

    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: submittedUrl.trim() }),
      });

      const result: InfoApiResponse = await response.json();

      if (response.ok && result.success && result.data) {
        setPreviewMedia(result.data);
      } else {
        setPreviewMedia(null);
        setProgressState({
          status: "error",
          percent: 0,
          errorMessage: result.error || "Failed to retrieve media metadata.",
        });
      }
    } catch (err: unknown) {
      setPreviewMedia(null);
      const error = err as Error;
      setProgressState({
        status: "error",
        percent: 0,
        errorMessage: error.message || "Network error while connecting to extraction service.",
      });
    } finally {
      setIsFetchingInfo(false);
    }
  };

  const handleStartDownload = async (quality: string) => {
    if (!previewMedia) return;
    setSelectedQuality(quality);

    // Cancel existing download if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const targetUrl = previewMedia.originalUrl || url;
    const downloadApiUrl = `/api/download?url=${encodeURIComponent(
      targetUrl
    )}&quality=${encodeURIComponent(quality)}`;

    setProgressState({
      status: "downloading",
      percent: 10,
      speed: "Processing...",
      downloadedBytes: "0 MB",
      totalBytes: previewMedia.fileSize || "Calculating...",
    });

    try {
      const response = await fetch(downloadApiUrl, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errJson: { error?: string } = {};
        try {
          errJson = await response.json();
        } catch {
          // ignore parsing error
        }
        throw new Error(errJson.error || `Download failed with HTTP ${response.status}`);
      }

      // Read Content-Disposition header to get filename
      const disposition = response.headers.get("Content-Disposition");
      let filename = `${previewMedia.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.mp3`;
      if (disposition && disposition.includes("filename=")) {
        const matches = disposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }

      const contentLength = response.headers.get("Content-Length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      const formattedTotal = totalBytes > 0 ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB` : previewMedia.fileSize;

      if (!response.body) {
        throw new Error("Readable stream is not supported in this browser.");
      }

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];
      let receivedBytes = 0;
      let lastTime = Date.now();
      let lastBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;

        const currentTime = Date.now();
        const timeDiff = (currentTime - lastTime) / 1000;
        let speedStr = "Streaming...";

        if (timeDiff >= 0.5) {
          const bytesDiff = receivedBytes - lastBytes;
          const speedBps = bytesDiff / timeDiff;
          speedStr = `${(speedBps / (1024 * 1024)).toFixed(1)} MB/s`;
          lastTime = currentTime;
          lastBytes = receivedBytes;
        }

        const calculatedPercent =
          totalBytes > 0
            ? Math.min(99, Math.round((receivedBytes / totalBytes) * 100))
            : Math.min(95, 10 + Math.round((receivedBytes / (5 * 1024 * 1024)) * 80));

        setProgressState((prev) => ({
          ...prev,
          percent: calculatedPercent,
          speed: speedStr,
          downloadedBytes: `${(receivedBytes / (1024 * 1024)).toFixed(1)} MB`,
          totalBytes: formattedTotal,
        }));
      }

      // Create blob and trigger automatic download
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setProgressState({
        status: "completed",
        percent: 100,
        downloadedBytes: `${(receivedBytes / (1024 * 1024)).toFixed(1)} MB`,
        totalBytes: formattedTotal,
        filename,
        downloadUrl: objectUrl,
      });
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        setProgressState({ status: "idle", percent: 0 });
        return;
      }
      const error = err as Error;
      setProgressState({
        status: "error",
        percent: 0,
        errorMessage: error.message || "An unexpected error occurred during audio download.",
      });
    }
  };

  const handleResetProgress = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setProgressState({
      status: "idle",
      percent: 0,
      downloadedBytes: "0 MB",
      totalBytes: "Unknown",
    });
  };

  const handleClearUrl = () => {
    setUrl("");
    setPreviewMedia(null);
    handleResetProgress();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e0c] text-[#f3f4f1] selection:bg-emerald-600/35 selection:text-emerald-200">
      <Header engineActive={serverStatus.ytdlp && serverStatus.ffmpeg} />

      <main className="flex-1 pb-16">
        {/* Clean Hero Section */}
        <HeroSection />

        {/* URL Input Card */}
        <UrlInput
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleUrlSubmit}
          isLoading={isFetchingInfo}
          onClear={handleClearUrl}
        />

        {/* Download Preview Card */}
        {previewMedia && (
          <DownloadCard
            media={previewMedia}
            onStartDownload={handleStartDownload}
            isDownloading={progressState.status === "downloading"}
          />
        )}

        {/* Download Progress Component */}
        <DownloadProgress
          progressState={progressState}
          onReset={handleResetProgress}
          onRetry={() => handleStartDownload(selectedQuality)}
        />
      </main>
    </div>
  );
}
