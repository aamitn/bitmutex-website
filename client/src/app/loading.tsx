"use client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [dots, setDots] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => {
      clearInterval(dotsInterval)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative">
      {/* Centered loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400 dark:text-slate-500" />
          <div className="flex items-center">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Loading</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium w-6 text-left">{dots}</span>
          </div>
        </div>
      </div>

      {/* Background skeleton content */}
      <div className="p-4 opacity-30">
        <div className="w-full max-w-full mx-auto space-y-4">
          {/* Header section */}
          <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-slate-300" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-300" />
                  <Skeleton className="h-3 w-16 bg-slate-300" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-20 rounded-md bg-slate-300" />
                <Skeleton className="h-8 w-8 rounded-full bg-slate-300" />
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <Card className="p-3 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Skeleton className="h-6 w-20 bg-slate-300" />
                <Skeleton className="h-6 w-16 bg-slate-300" />
                <Skeleton className="h-6 w-24 bg-slate-300" />
                <Skeleton className="h-6 w-18 bg-slate-300" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-6 rounded bg-slate-300" />
                <Skeleton className="h-6 w-6 rounded bg-slate-300" />
              </div>
            </div>
          </Card>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Primary content */}
            <div className="lg:col-span-3">
              <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2 bg-slate-300" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-slate-300" />
                    <Skeleton className="h-3 w-4/5 bg-slate-300" />
                    <Skeleton className="h-3 w-3/4 bg-slate-300" />
                  </div>
                  <Skeleton className="h-32 w-full rounded bg-slate-300" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-slate-300" />
                    <Skeleton className="h-3 w-2/3 bg-slate-300" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-16 bg-slate-300" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded-full bg-slate-300" />
                        <Skeleton className="h-3 w-full bg-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded bg-slate-300" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-slate-300" />
                    <Skeleton className="h-3 w-2/3 bg-slate-300" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}