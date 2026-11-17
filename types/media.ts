export interface MediaMetadata {
  id: string;
  title: string;
  author: string;
  duration: string;
  durationSeconds?: number;
  source: string;
  thumbnailUrl: string;
  bitrate: string;
  fileSize: string;
  format: "MP3" | "M4A" | "WAV";
  isMock: boolean;
  originalUrl?: string;
  description?: string;
}

export type DownloadStatus =
  | "idle"
  | "fetching"
  | "ready"
  | "downloading"
  | "completed"
  | "error";

export interface DownloadProgressState {
  status: DownloadStatus;
  percent: number;
  speed?: string;
  downloadedBytes?: string;
  totalBytes?: string;
  errorMessage?: string;
  downloadUrl?: string;
  filename?: string;
}

export interface InfoApiResponse {
  success: boolean;
  data?: MediaMetadata;
  error?: string;
}

export interface HealthApiResponse {
  status: "ok" | "degraded";
  ytdlp: {
    available: boolean;
    version?: string;
  };
  ffmpeg: {
    available: boolean;
    version?: string;
  };
}
