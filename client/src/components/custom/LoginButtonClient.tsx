"use client";

import React from "react";
import { UserPlus, DoorOpen, Loader2 } from "lucide-react"; 
import { logoutAction } from "@/data/actions/auth"; 
import { useTransition } from "react";

const LoginButtonClient = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    window.location.href = "/signin";
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
        <div 
        className="fixed z-50 

            /* Mobile Position */
            bottom-30 top-7 left-23 right-[40%]  

            /* Desktop Position (md: and above) */
            md:top-7 md:bottom-15 md:right-[74%]"
        >
      <button
        onClick={isLoggedIn ? handleLogout : handleLogin}
        className={`relative flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 
        border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        
        ${
          isLoggedIn
            ? `bg-red-500 hover:bg-red-600 text-white shadow-red-300 
               dark:bg-red-600 dark:hover:bg-red-700 dark:shadow-red-400`
            : `bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300 
               dark:bg-orange-500 dark:hover:bg-orange-600 dark:shadow-orange-300`
        }
        `}
        disabled={isPending}
        aria-label={isLoggedIn ? "Logout" : "Log In"}
      >
        {isPending ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : isLoggedIn ? (
          <>
            <DoorOpen className="w-4 h-4" /> Logout
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" /> Log In
          </>
        )}
      </button>
    </div>
  );
};

export default LoginButtonClient;
