import { Headphones, ShieldCheck, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-8 pb-6 sm:pt-12 sm:pb-8 text-center overflow-hidden">
      {/* Background ambient earthy glow (botanical green + warm clay/sand) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 w-[32rem] sm:w-[48rem] h-[18rem] rounded-full bg-gradient-to-tr from-emerald-600/18 via-amber-700/12 to-teal-800/15 blur-3xl -z-10"
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero Heading with Green & Earth/Mitti Gradient */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f3f4f1] leading-tight">
          Download Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-[#86efac] to-[#e2b887] bg-clip-text text-transparent">
            Favorite Audio
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-stone-400 font-normal leading-relaxed">
          Paste a supported media link and save high-fidelity 320 kbps MP3 directly to your device.
        </p>

        {/* Minimal Feature Pills with Earthy & Green Styling */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-stone-400">
          <div className="flex items-center gap-1.5 rounded-full border border-[#262c26] bg-[#141714]/80 px-3 py-1 backdrop-blur-sm">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span className="text-stone-300">Fast Extraction</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#332b22] bg-[#1a1713]/80 px-3 py-1 backdrop-blur-sm">
            <Headphones className="h-3 w-3 text-[#dcae7c]" />
            <span className="text-[#e2c19a]">Ultra HD 320 kbps</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#262c26] bg-[#141714]/80 px-3 py-1 backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3 text-teal-400" />
            <span className="text-stone-300">Free & Direct</span>
          </div>
        </div>
      </div>
    </section>
  );
}
