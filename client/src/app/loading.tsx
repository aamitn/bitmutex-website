"use client"

import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 text-center shadow-sm">
        <div className="flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <p className="text-lg font-medium text-foreground">Loading{dots}</p>
      </Card>
    </div>
  )
}

