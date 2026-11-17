import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Downloader | Modern Audio Extractor",
  description: "Paste a supported media link and save audio directly to your device.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0c0e0c] text-[#f3f4f1] font-sans selection:bg-emerald-600/35 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}

