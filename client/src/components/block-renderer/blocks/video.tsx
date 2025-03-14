"use client";

import { type VideoProps } from "@/types";


import dynamic from "next/dynamic";

const ReactVideoPlayer = dynamic(
  () => import("@/components/custom/react-player"),
  {
    ssr: false,
  }
);
function generateYouTubeUrl(data: {
  video: { videoId: string; start?: string; end?: string };
}) {
  const baseUrl = new URL("https://www.youtube.com/watch");
  baseUrl.searchParams.append("v", data.video.videoId);
  if (data.video.start ?? data.video.end) {
    baseUrl.searchParams.append("start", data.video.start ?? "0");
    baseUrl.searchParams.append("end", data.video.end ?? "0");
  }
  return baseUrl.href;
}

export function Video(data: Readonly<VideoProps>) {
  console.dir(data, { depth: null });

  if (!data) return null;

  const videoUrl = generateYouTubeUrl({
    video: {
      videoId: data.video.videoId,
      start: data.video.start,
      end: data.video.end,
    },
  });

  return (
    <div className="relative aspect-video rounded-md overflow-hidden">
      <ReactVideoPlayer videoUrl={videoUrl} />
    </div>
  );
}
