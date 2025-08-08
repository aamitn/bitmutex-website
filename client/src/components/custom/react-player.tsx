"use client";

import ReactPlayer from "react-player";

interface ReactPlayerProps {
  videoUrl: string;
}

export default function CustomReactPlayer({ videoUrl }: ReactPlayerProps) {
  return (
    <ReactPlayer
      src={videoUrl}
      width="100%"
      height="100%"
      controls
    />
  );
}