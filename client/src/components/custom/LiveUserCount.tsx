"use client"; // Required for Next.js App Router

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Eye } from "lucide-react"; // Eye icon
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"; // shadcn Tooltip

// Type for live user count event
interface LiveUserCountData {
  count: number;
}

export default function LiveUserCount() {
  const [liveUsers, setLiveUsers] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337");
    setSocket(newSocket);

    // Listen for the live user count event
    newSocket.on("liveUserCount", (data: LiveUserCountData) => {
      setLiveUsers(Math.floor(data.count / 2));
    });

    // Cleanup function to disconnect on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="z-[999] fixed bottom-20 right-4 flex items-center justify-center 
                       w-8 h-8 bg-white dark:bg-slate-800 shadow-lg rounded-full border border-gray-300 dark:border-orange-400
                       hover:shadow-xl transition-all cursor-pointer"
          >
            <Eye className="w-5 h-5 text-slate-800 dark:text-orange-500" />
            <span
              className="absolute -top-2 -right-2 bg-slate-700 dark:bg-orange-500 text-white text-xs font-bold 
                         w-5 h-5 flex items-center justify-center rounded-full"
            >
              {liveUsers}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          Live Views : {liveUsers}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
