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
          /* Mobile Position - default for all sizes unless overridden */
          bottom-30 top-7 left-48
          /* Small Mobile Position (xs: and above) */
          xs:bottom-30 xs:top-7 xs:left-48
          /* Tablet Position (sm: and above) */
          sm:bottom-30 sm:top-7 sm:left-48
          /* Small Desktop Position (md: and above) */
          md:top-15 md:left-24
          /* Medium Desktop Position (lg: and above) */
          lg:top-15 lg:left-48
          /* Large Desktop Position (xl: and above) */
          xl:top-15 xl:left-28
          /* Extra Large Desktop Position (2xl: and above) */
          2xl:top-7 2xl:left-48"
        >
      <button
        onClick={isLoggedIn ? handleLogout : handleLogin}
        className={`relative flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 
        border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isLoggedIn
                ? `bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-300 
                  hover:from-red-700 hover:to-red-800 
                  dark:from-red-700 dark:to-red-800 dark:shadow-red-400 dark:hover:from-red-800 dark:hover:to-red-900`
                : `bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-blue-300 
                  hover:from-blue-800 hover:to-blue-500 
                  dark:from-orange-600 dark:to-orange-700 dark:shadow-orange-300 dark:hover:from-orange-700 dark:hover:to-orange-800`
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
