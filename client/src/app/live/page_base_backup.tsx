"use client";

import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dashStream = "https://live.bitmutex.com/dash/test_src.mpd";
const hlsStream = "https://live.bitmutex.com/hls/test.m3u8";

function VideoPlayer({
  src,
  type,
  hidden,
}: {
  src: string;
  type: string;
  hidden?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        sources: [{ src, type }],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type]);

  // Pause when hidden
  useEffect(() => {
    if (hidden && playerRef.current) {
      playerRef.current.pause();
    }
  }, [hidden]);

  return (
    <div data-vjs-player style={{ display: hidden ? "none" : "block" }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<"hls" | "dash">("hls");

  return (
    <div className="p-8 mt-28 mb-28">
      <h1 className="text-2xl font-bold mb-4">📡 Live Streams</h1>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "hls" | "dash")}>
        <TabsList className="mb-4">
          <TabsTrigger value="hls">HLS</TabsTrigger>
          <TabsTrigger value="dash">DASH</TabsTrigger>
        </TabsList>
      </Tabs>

      <VideoPlayer
        src={hlsStream}
        type="application/x-mpegURL"
        hidden={activeTab !== "hls"}
      />
      <VideoPlayer
        src={dashStream}
        type="application/dash+xml"
        hidden={activeTab !== "dash"}
      />
    </div>
  );
}
