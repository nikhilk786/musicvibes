import { Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#09090B] mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          {/* Brand & info */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-800/50 text-emerald-400">
              <Music2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-zinc-300">Music Downloader</span>
            <span>•</span>
            <span>Fast & Lossless Audio Extractor</span>
          </div>

          {/* Center disclaimer */}
          <div className="text-center sm:text-left text-zinc-500">
            For personal and educational use only. Respect copyright laws.
          </div>

          {/* Links / credit */}
          <div className="flex items-center gap-4">
            <a
              href="#terms"
              className="hover:text-zinc-300 transition-colors"
            >
              Terms
            </a>
            <a
              href="#privacy"
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#contact"
              className="hover:text-zinc-300 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
