"use client";

import { useState } from "react";
import { Link2, Clipboard, X, ArrowRight, Loader2, Check } from "lucide-react";

interface UrlInputProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export function UrlInput({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  onClear,
}: UrlInputProps) {
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setPasteNotice("Clipboard not supported");
        setTimeout(() => setPasteNotice(null), 2500);
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        onUrlChange(text.trim());
        setPasteNotice("Pasted!");
        setTimeout(() => setPasteNotice(null), 2000);
      } else {
        setPasteNotice("Clipboard is empty");
        setTimeout(() => setPasteNotice(null), 2000);
      }
    } catch {
      setPasteNotice("Permission denied");
      setTimeout(() => setPasteNotice(null), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onSubmit(url.trim());
  };

  const isInputEmpty = url.trim().length === 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div className="relative rounded-2xl bg-[#131613]/90 p-2 sm:p-2.5 shadow-2xl shadow-emerald-950/30 ring-1 ring-[#262c26] backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/60 focus-within:shadow-emerald-950/40">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          {/* Input field wrapper */}
          <div className="relative flex flex-1 items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center text-stone-500">
              <Link2 className="h-5 w-5" />
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={isLoading}
              placeholder="Paste audio or video link here..."
              className="w-full rounded-xl bg-transparent py-3.5 pr-20 pl-11 text-sm sm:text-base text-[#f3f4f1] placeholder:text-stone-500 focus:outline-none disabled:opacity-50"
              aria-label="Media URL"
            />

            {/* Input Action buttons (Clear & Paste) */}
            <div className="absolute right-2 flex items-center gap-1">
              {!isInputEmpty && !isLoading && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Clear input"
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-[#1e241e] hover:text-stone-200 transition-colors"
                  title="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="inline-flex items-center gap-1 rounded-lg border border-[#272e27] bg-[#1a201a]/90 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:border-emerald-600/40 hover:bg-[#222a22] hover:text-white transition-all active:scale-95 disabled:opacity-50"
                title="Paste from clipboard"
              >
                {pasteNotice ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{pasteNotice}</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Paste</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submit / Download Button */}
          <button
            type="submit"
            disabled={isInputEmpty || isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 sm:w-auto w-full ${
              isInputEmpty || isLoading
                ? "bg-[#181d18] text-stone-600 cursor-not-allowed border border-[#222722]"
                : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/40 hover:brightness-105 active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Fetching Preview...</span>
              </>
            ) : (
              <>
                <span>Download MP3</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick sample prompt with Earth/Mitti & Green styling */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-stone-500">
        <span>Supports YouTube, SoundCloud, Spotify & more</span>
        <button
          type="button"
          onClick={() =>
            onUrlChange("https://www.youtube.com/watch?v=sample-synthwave-demo")
          }
          className="text-[#dcae7c] hover:text-[#ebd0ad] underline decoration-[#c9955c]/40 underline-offset-2 transition-colors"
        >
          Insert Demo URL
        </button>
      </div>
    </div>
  );
}
