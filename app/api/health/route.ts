import { NextResponse } from "next/server";
import { checkSystemDependencies } from "@/lib/ytdlp";


export async function GET() {
  const systemStatus = await checkSystemDependencies();
  const isHealthy = systemStatus.ytdlp.available && systemStatus.ffmpeg.available;

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      ytdlp: systemStatus.ytdlp,
      ffmpeg: systemStatus.ffmpeg,
      timestamp: new Date().toISOString(),
    },
    { status: isHealthy ? 200 : 503 }
  );
}
