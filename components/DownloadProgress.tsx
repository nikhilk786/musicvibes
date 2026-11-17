"use client";

import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Loader2,
  Download,
} from "lucide-react";
import { DownloadProgressState } from "@/types/media";

interface DownloadProgressProps {
  progressState: DownloadProgressState;
  onReset: () => void;
  onRetry?: () => void;
}

export function DownloadProgress({
  progressState,
  onReset,
  onRetry,
}: DownloadProgressProps) {
  const { status, percent, speed, downloadedBytes, totalBytes, errorMessage, downloadUrl, filename } =
    progressState;

  if (status === "idle" || status === "fetching") {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mt-6">
      <div className="overflow-hidden rounded-2xl border border-[#262c26] bg-[#131613]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        {/* Header pill */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2 w-2 rounded-full ${
                status === "completed"
                  ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                  : status === "error"
                  ? "bg-red-400"
                  : "bg-emerald-400 animate-pulse"
              }`}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              {status === "downloading"
                ? "Backend Processing & Extraction"
                : status === "completed"
                ? "Audio Ready"
                : "Extraction Status"}
            </span>
          </div>
          <span className="rounded-md bg-[#1a201a] border border-[#262c26] px-2 py-0.5 text-[10px] font-mono text-stone-400">
            FFmpeg MP3 Stream
          </span>
        </div>

        {/* State: Downloading / Converting */}
        {status === "downloading" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="font-semibold text-[#f3f4f1]">
                  Converting and preparing MP3 stream...
                </span>
                <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                  {speed || "Live FFmpeg Pipe"}
                </span>
              </div>
              <span className="font-mono text-base font-bold text-emerald-400">
                {Math.round(percent)}%
              </span>
            </div>

            {/* Progress Track (Botanical Green to Warm Mitti gradient) */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#181d18] p-0.5 border border-[#222722]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-[#dcae7c] transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
                style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <span>
                Status:{" "}
                <span className="font-mono text-[#e2b887]">
                  {downloadedBytes ? `${downloadedBytes} / ${totalBytes}` : "Streaming audio..."}
                </span>
              </span>

              <button
                type="button"
                onClick={onReset}
                className="rounded-lg px-2 py-1 text-xs text-stone-400 hover:bg-[#1a201a] hover:text-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State: Completed / Success */}
        {status === "completed" && (
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/25 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#f3f4f1] text-base">
                    Audio Extraction Complete!
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {filename ? (
                      <span className="font-mono text-emerald-300">{filename}</span>
                    ) : (
                      "Your audio file has been converted and downloaded."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2a332a] bg-[#1a211a] px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-[#222c22] hover:text-white transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Download Another</span>
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={filename || "audio.mp3"}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Save to Disk</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#f3f4f1] text-base">
                    Extraction Error
                  </h4>
                  <p className="text-xs text-red-300/90 mt-0.5 break-words">
                    {errorMessage ||
                      "Failed to extract audio. The link may be private, region-restricted, or unsupported."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-[#2a302a] bg-[#1a201a] px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-[#222a22] transition-all"
                >
                  Dismiss
                </button>

                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-all shadow-lg shadow-red-950/50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
