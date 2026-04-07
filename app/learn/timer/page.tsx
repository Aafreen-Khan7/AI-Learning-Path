"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Coffee, BookOpen, Bell } from "lucide-react"
import { toast } from "sonner"

const MODES = {
  FOCUS: { name: "Focus", duration: 25 * 60, icon: BookOpen, color: "text-primary" },
  SHORT_BREAK: { name: "Short Break", duration: 5 * 60, icon: Coffee, color: "text-chart-2" },
  LONG_BREAK: { name: "Long Break", duration: 15 * 60, icon: Coffee, color: "text-chart-3" },
}

export default function FocusTimerPage() {
  const [mode, setMode] = useState("FOCUS")
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.duration)
  const [isActive, setIsActive] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = useCallback(() => {
    setIsActive(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  const switchMode = (newMode: string) => {
    setMode(newMode)
    setTimeLeft(MODES[newMode].duration)
    setIsActive(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      if (mode === "FOCUS") {
        setSessionsCompleted((prev) => prev + 1)
        toast.success("Focus session completed! Take a break.")
      } else {
        toast.success("Break over! Ready to focus?")
      }
      
      // Auto-switch modes could be added here
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Focus Timer</h1>
        <p className="text-muted-foreground">Stay productive and track your study hours</p>
      </div>

      <Card className="bg-card border-border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-center gap-4 pb-2">
          {Object.entries(MODES).map(([key, value]) => (
            <Button
              key={key}
              variant={mode === key ? "default" : "ghost"}
              onClick={() => switchMode(key)}
              className="rounded-full"
            >
              <value.icon className="h-4 w-4 mr-2" />
              {value.name}
            </Button>
          ))}
        </CardHeader>
        <CardContent className="p-12 flex flex-col items-center space-y-8">
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-secondary"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-bold text-foreground tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
                {MODES[mode].name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className="h-16 w-16 rounded-full shadow-lg"
            >
              {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="h-16 w-16 rounded-full shadow-md"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions Done</p>
              <p className="text-2xl font-bold text-foreground">{sessionsCompleted}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Focus Time</p>
              <p className="text-2xl font-bold text-foreground">{sessionsCompleted * 25} min</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
