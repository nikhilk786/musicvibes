import { Music2 } from "lucide-react";

interface HeaderProps {
  engineActive?: boolean;
}

export function Header({ engineActive = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222722] bg-[#0c0e0c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* App Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-700 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30">
            <Music2 className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#f3f4f1]">
              Music Downloader
            </span>
            
          </div>
        </div>

        {/* Minimal Engine Status Indicator with Earth & Green Accent */}
        <div className="flex items-center gap-2 rounded-full border border-[#262c26] bg-[#141714]/90 px-3 py-1 text-xs text-stone-300">
          <span
            className={`h-2 w-2 rounded-full ${
              engineActive ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" : "bg-amber-500"
            }`}
          />
          <span className="text-[11px] font-medium text-stone-300">
            {engineActive ? "Online & Ready" : "Connecting..."}
          </span>
        </div>
      </div>
    </header>
  );
}
