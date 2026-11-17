"use client";

import { useState } from "react";
import {
  Download,
  Clock,
  Radio,
  FileAudio,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { MediaMetadata } from "@/types/media";

interface DownloadCardProps {
  media: MediaMetadata;
  onStartDownload: (quality: string) => void;
  isDownloading: boolean;
}

export function DownloadCard({
  media,
  onStartDownload,
  isDownloading,
}: DownloadCardProps) {
  const [thumbError, setThumbError] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mt-8">
      <div className="overflow-hidden rounded-2xl border border-[#262c26] bg-[#131613]/95 shadow-2xl backdrop-blur-xl transition-all">
        {/* Status Banner */}
        {media.isMock ? (
          <div className="flex items-center justify-between border-b border-[#3d3326]/60 bg-[#1e1811]/60 px-4 py-2 text-xs text-[#dcae7c]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#dcae7c] animate-pulse" />
              <span className="font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
                Demo Sample Preview
              </span>
            </div>
            <span className="text-[11px] text-[#c9955c]/90">
              Offline Demonstration Track
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between border-b border-emerald-900/50 bg-emerald-950/40 px-4 py-2 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold tracking-wide uppercase text-[10px] sm:text-xs text-emerald-300">
                Verified Stream Ready
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/80 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              Direct 320 kbps Extraction
            </span>
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Media Thumbnail Container */}
            <div className="relative aspect-video w-full md:w-56 shrink-0 overflow-hidden rounded-xl border border-[#262c26] bg-[#1a1f1a] group">
              {media.thumbnailUrl && !thumbError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.thumbnailUrl}
                  alt={media.title}
                  onError={() => setThumbError(true)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                /* Decorative Botanical Green & Earth Waves Fallback */
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-emerald-950/40 via-[#182018] to-amber-950/30">
                  <div className="flex items-end gap-1.5 h-16 opacity-85">
                    <div className="w-1.5 h-8 bg-emerald-400 rounded-full animate-pulse" />
                    <div className="w-1.5 h-14 bg-[#dcae7c] rounded-full animate-pulse [animation-delay:150ms]" />
                    <div className="w-1.5 h-10 bg-teal-400 rounded-full animate-pulse [animation-delay:300ms]" />
                    <div className="w-1.5 h-16 bg-[#e2b887] rounded-full animate-pulse [animation-delay:450ms]" />
                    <div className="w-1.5 h-6 bg-emerald-300 rounded-full animate-pulse [animation-delay:200ms]" />
                    <div className="w-1.5 h-12 bg-[#c9955c] rounded-full animate-pulse [animation-delay:350ms]" />
                  </div>
                </div>
              )}

              {/* Source Tag on Thumbnail */}
              <div className="absolute top-2.5 left-2.5 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-medium text-stone-200 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-emerald-400" />
                <span>{media.source}</span>
              </div>

              {/* Duration Tag */}
              <div className="absolute bottom-2.5 right-2.5 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-mono font-medium text-stone-200 backdrop-blur-md border border-white/10 flex items-center gap-1">
                <Clock className="h-3 w-3 text-stone-400" />
                <span>{media.duration}</span>
              </div>
            </div>

            {/* Media Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="rounded-full bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                    {media.author}
                  </span>
                  <span className="rounded-full bg-[#1e241e] px-2 py-0.5 text-[11px] font-medium text-stone-300">
                    Est. {media.fileSize}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#f3f4f1] tracking-tight leading-snug line-clamp-2">
                  {media.title}
                </h3>
                {media.description && (
                  <p className="mt-1 text-xs text-stone-400 line-clamp-1">
                    {media.description}
                  </p>
                )}
              </div>

              {/* Locked Maximum Quality Indicator (Mitti / Warm Sand + Green) */}
              <div className="mt-4 pt-3.5 border-t border-[#262c26] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium">Audio Quality:</span>
                  <span className="text-stone-400">Ultra High Definition</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#3d3326] bg-[#221c14] px-2.5 py-1 text-xs font-semibold text-[#ebd0ad]">
                  <span>320 kbps MP3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#262c26]">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <FileAudio className="h-4 w-4 text-emerald-400" />
              <span>Highest Bitrate Constant MP3 Stream</span>
            </div>

            <button
              type="button"
              onClick={() => onStartDownload("320")}
              disabled={isDownloading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-lg ${
                isDownloading
                  ? "bg-[#181d18] text-stone-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/60 hover:shadow-emerald-900/40 active:scale-[0.98]"
              }`}
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? "Extracting 320 kbps..." : "Download 320 kbps MP3"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
