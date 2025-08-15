"use client";
import React, { useRef, useEffect, useState } from "react";
import { Play, Radio, Signal, Zap, Users, Clipboard, X, RotateCcw } from "lucide-react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { usePathname } from "next/navigation";


const streamKey = process.env.NEXT_PUBLIC_STREAM_KEY || "fallback-key";

const dashStream = `https://live.bitmutex.com/dash/${streamKey}_src.mpd`;
const hlsStream = `https://live.bitmutex.com/hls/${streamKey}.m3u8`;
console.log("DASH Stream URL:", dashStream);
console.log("HLS Stream URL:", hlsStream);

const  genericHlsUrl= "https://live.bitmutex.com/dash/<key>_src.mpd";
const  genericDashUrl = "https://live.bitmutex.com/hls/<key>.m3u8";
const rtmpServerUrl = "rtmp://152.67.172.75/live/<key>";

// New Popover component for stream details
const StreamInfoPopover = ({ hlsUrl, dashUrl, rtmpServer }: { hlsUrl: string, dashUrl: string, rtmpServer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <div className="flex items-center gap-3 p-2 bg-gray-100/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-lg border border-gray-300 dark:border-gray-700">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-full bg-gray-200/50 backdrop-blur-lg border border-gray-300 hover:bg-gray-300 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
        >
          <Signal size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        <button 
          onClick={() => window.location.reload()} 
          className="p-2 rounded-full bg-gray-200/50 backdrop-blur-lg border border-gray-300 hover:bg-gray-300 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4 transition-all duration-300 ease-out transform scale-100 opacity-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Stream Endpoints</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Stream HLS Section */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stream HLS URL</p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{hlsUrl}</span>
                <button 
                  onClick={() => handleCopy(hlsUrl, "HLS Stream URL")}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>

            {/* STREAM DASH Section */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stream DASH URL</p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{dashUrl}</span>
                <button 
                  onClick={() => handleCopy(rtmpServer, "DASH Stream URL")}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>
            
            {/* RTMP Section */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RTMP URL</p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{rtmpServerUrl}</span>
                <button 
                  onClick={() => handleCopy(rtmpServerUrl, "RTMP Stream Url")}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {copiedText && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs rounded-full shadow-md animate-fade-in">
              {copiedText} copied! 🎉
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function VideoPlayer({
  src,
  type,
  hidden,
  streamType,
}: {
  src: string;
  type: string;
  hidden?: boolean;
  streamType: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false); 
  

  useEffect(() => {
    if (videoRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      
      setIsLoading(true);
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        pip: true,
        preload: "auto",
        fluid: true,
        responsive: true,
        userActions: {
          hotkeys: true
        },
        sources: [{ src, type }],
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        poster: "https://i.ibb.co/PzxzqC7R/streamsoon.jpg", // thumbnail before playback
        aspectRatio: "16:9",         // keep consistent aspect ratio
        html5: {
          hls: { overrideNative: true },  // HLS options
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        plugins: {},
      });

      videojs.addLanguage('en', {
        "Play": "▶ Play",
        "Pause": "⏸ Pause",
        "Video Not Supported": "Video cannot be played.",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": 
          "Oops! Something went wrong or we are not live yet, check back later! 🤖",
      });

      playerRef.current.ready(() => {
        setIsLoading(false);
        setHasError(false);
      });

      playerRef.current.on('loadstart', () => {
        setIsLoading(true);
      });

      playerRef.current.on('canplay', () => {
        setIsLoading(false);
        setHasError(false);
      });

      playerRef.current.on("error", () => {
        console.error("Video.js player error:", playerRef.current.error());
        setIsLoading(false);
        setHasError(true); // Mark as error
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type]);

  useEffect(() => {
    if (hidden && playerRef.current) {
      playerRef.current.pause();
    }
  }, [hidden]);

  return (
    <div
      className={`relative transition-all duration-700 ease-out transform ${
        hidden ? "opacity-0 scale-95 pointer-events-none absolute" : "opacity-100 scale-100"
      }`}
      style={{ display: hidden ? "none" : "block" }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
  
        {/* Stream info overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${
              hasError ? "bg-gray-500/80" : "bg-red-500/90"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                hasError ? "bg-red-600 animate-none" : "bg-emerald-400 animate-pulse"
              }`}
            ></div>
            <span className={`text-xs sm:text-sm font-medium ${hasError ? "text-white" : "text-emerald"}`}>
              {hasError ? "OFFLINE" : "LIVE"}
            </span>
          </div>
  
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 dark:bg-white/10 dark:text-gray-200 text-xs sm:text-sm">
            <Users size={14} />
          </div>
        </div>
  
        {/* Stream quality badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-2 sm:px-3 py-1 rounded-full bg-sky-500/90 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
            {streamType.toUpperCase()}
          </div>
        </div>
  
        {/* Video container */}
        <div className="relative aspect-video sm:aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 dark:bg-black">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-2 sm:mb-4"></div>
                <p className="text-white/80 text-sm sm:text-lg font-medium dark:text-gray-300">Connecting to stream...</p>
                <p className="text-white/50 text-xs sm:text-sm mt-1 dark:text-gray-400">Initializing {streamType.toUpperCase()} player</p>
              </div>
            </div>
          )}
          <video ref={videoRef} className="video-js vjs-default-skin w-full h-full" data-setup="{}" />
        </div>
  
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none dark:from-black/80"></div>
      </div>
  
      {/* Stream stats */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Quality */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm dark:from-blue-900/30 dark:to-blue-800/10 dark:border-blue-500/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-lg">
              <Signal size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-slate-800/90 font-medium text-sm sm:text-base dark:text-gray-200">Quality</p>
              <p className="text-slate-800/60 text-xs sm:text-sm dark:text-gray-400">1080p HD</p>
            </div>
          </div>
        </div>
  
        {/* Latency */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm dark:from-green-900/30 dark:to-green-800/10 dark:border-green-500/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-green-500/20 rounded-lg">
              <Zap size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-slate-800/90 font-medium text-sm sm:text-base dark:text-gray-200">Latency</p>
              <p className="text-slate-800/60 text-xs sm:text-sm dark:text-gray-400">&le;2.3s</p>
            </div>
          </div>
        </div>
  
        {/* Bitrate */}
        <div className="bg-gradient-to-br from-sky-500/10 to-sky-600/5 border border-sky-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm dark:from-sky-900/30 dark:to-sky-800/10 dark:border-sky-500/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-sky-500/20 rounded-lg">
              <Radio size={18} className="text-sky-400" />
            </div>
            <div>
              <p className="text-slate-800/90 font-medium text-sm sm:text-base dark:text-gray-200">Bitrate</p>
              <p className="text-slate-800/60 text-xs sm:text-sm dark:text-gray-400">&ge;4.2 Mbps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<"hls" | "dash">("hls");

  return (
    <div className="min-h-screen bg-gradient-to-br pt-12 pb-12 from-gray-100 via-white to-gray-200 dark:from-gray-950 dark:via-black dark:to-gray-950 text-gray-900 dark:text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Radio className="text-blue-400" size={20} />
            <span className="text-blue-800 font-medium dark:text-gray-200">Live Broadcasting</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-900 to-blue-900 bg-clip-text text-transparent mb-4 dark:from-white dark:via-sky-300 dark:to-blue-300">
            Bitmutex Live
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto dark:text-gray-400">
            Experience high-quality live streaming with adaptive bitrate technology. 
            Choose between HLS and DASH protocols for optimal performance.
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <div className="bg-gray-200/50 backdrop-blur-lg rounded-2xl p-2 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveTab("hls")}
                className={`px-4 py-2 sm:px-8 sm:py-4 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto ${
                  activeTab === "hls"
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-500/30"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Play size={18} />
                  HLS Stream
                </div>
              </button>

              <button
                onClick={() => setActiveTab("dash")}
                className={`px-4 py-2 sm:px-8 sm:py-4 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto ${
                  activeTab === "dash"
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-500/30"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Zap size={18} />
                  DASH Stream
                </div>
              </button>
            </div>
          </div>

          {/* New StreamInfoPopover component */}
          <div className="w-full sm:w-auto">
            <StreamInfoPopover 
              hlsUrl={genericHlsUrl} 
              dashUrl={genericDashUrl}
              rtmpServer={rtmpServerUrl}
            />
          </div>
        </div>


        {/* Video Players */}
        <div className="max-w-6xl mx-auto">
          <VideoPlayer
            src={hlsStream}
            type="application/x-mpegURL"
            hidden={activeTab !== "hls"}
            streamType="hls"
          />
          <VideoPlayer
            src={dashStream}
            type="application/dash+xml"
            hidden={activeTab !== "dash"}
            streamType="dash"
          />
        </div>

      </div>

    </div>
  );
}