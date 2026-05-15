// components/providers/ClientWidgets.tsx
"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/ui/chat"), {
  ssr: false,
});

const LiveUserCount = dynamic(() => import("@/components/custom/LiveUserCount"), {
  ssr: false,
});

const Metrics = dynamic(() => import("@/app/metrics"), {
  ssr: false,
});

export default function ClientWidgets() {
  return (
    <>
      <Metrics /> {/* Analytics */}
      <Chat />
      <LiveUserCount />
    </>
  );
}