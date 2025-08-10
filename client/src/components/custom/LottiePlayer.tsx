// components/LottiePlayer.tsx
"use client";

import { Player } from "@lottiefiles/react-lottie-player";

export function LottiePlayer() {
  return (
    <Player
      src="/404-1.json"
      className="w-full h-full"
      loop
      autoplay
      speed={1}
    />
  );
}