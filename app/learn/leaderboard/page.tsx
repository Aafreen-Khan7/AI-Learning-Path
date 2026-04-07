"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, Brain } from "lucide-react"

type LeaderboardEntry = {
  rank: number
  name: string
  score: number
  timeMinutes: number
  completedQuizzes: number
  subject: string
}

// Dummy data for different subjects
const dummyLeaderboards: Record<string, LeaderboardEntry[]> = {
  "Data Structures": [
    { rank: 1, name: "Arjun Kumar", score: 98, timeMinutes: 45, completedQuizzes: 5, subject: "Data Structures" },
    { rank: 2, name: "Priya Singh", score: 95, timeMinutes: 52, completedQuizzes: 5, subject: "Data Structures" },
    { rank: 3, name: "Rohit Patel", score: 92, timeMinutes: 58, completedQuizzes: 4, subject: "Data Structures" },
    { rank: 4, name: "Neha Sharma", score: 89, timeMinutes: 65, completedQuizzes: 4, subject: "Data Structures" },
    { rank: 5, name: "Vikram Singh", score: 85, timeMinutes: 72, completedQuizzes: 3, subject: "Data Structures" },
    { rank: 6, name: "Ananya Gupta", score: 82, timeMinutes: 78, completedQuizzes: 3, subject: "Data Structures" },
  ],
  "Algorithms": [
    { rank: 1, name: "Priya Singh", score: 97, timeMinutes: 48, completedQuizzes: 5, subject: "Algorithms" },
    { rank: 2, name: "Arjun Kumar", score: 94, timeMinutes: 55, completedQuizzes: 5, subject: "Algorithms" },
    { rank: 3, name: "Vikram Singh", score: 91, timeMinutes: 60, completedQuizzes: 4, subject: "Algorithms" },
    { rank: 4, name: "Rohit Patel", score: 88, timeMinutes: 68, completedQuizzes: 4, subject: "Algorithms" },
    { rank: 5, name: "Ananya Gupta", score: 86, timeMinutes: 75, completedQuizzes: 3, subject: "Algorithms" },
    { rank: 6, name: "Neha Sharma", score: 83, timeMinutes: 82, completedQuizzes: 3, subject: "Algorithms" },
  ],
  "Database Management": [
    { rank: 1, name: "Rohit Patel", score: 96, timeMinutes: 50, completedQuizzes: 5, subject: "Database Management" },
    { rank: 2, name: "Neha Sharma", score: 93, timeMinutes: 57, completedQuizzes: 5, subject: "Database Management" },
    { rank: 3, name: "Arjun Kumar", score: 90, timeMinutes: 62, completedQuizzes: 4, subject: "Database Management" },
    { rank: 4, name: "Priya Singh", score: 87, timeMinutes: 69, completedQuizzes: 4, subject: "Database Management" },
    { rank: 5, name: "Vikram Singh", score: 84, timeMinutes: 76, completedQuizzes: 3, subject: "Database Management" },
    { rank: 6, name: "Ananya Gupta", score: 81, timeMinutes: 84, completedQuizzes: 3, subject: "Database Management" },
  ],
  "Network Security": [
    { rank: 1, name: "Ananya Gupta", score: 99, timeMinutes: 42, completedQuizzes: 5, subject: "Network Security" },
    { rank: 2, name: "Neha Sharma", score: 96, timeMinutes: 54, completedQuizzes: 5, subject: "Network Security" },
    { rank: 3, name: "Priya Singh", score: 93, timeMinutes: 60, completedQuizzes: 4, subject: "Network Security" },
    { rank: 4, name: "Arjun Kumar", score: 90, timeMinutes: 67, completedQuizzes: 4, subject: "Network Security" },
    { rank: 5, name: "Rohit Patel", score: 87, timeMinutes: 74, completedQuizzes: 3, subject: "Network Security" },
    { rank: 6, name: "Vikram Singh", score: 84, timeMinutes: 81, completedQuizzes: 3, subject: "Network Security" },
  ],
}

const subjects = Object.keys(dummyLeaderboards)

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const data = dummyLeaderboards[selectedSubject] || []
    setLeaderboard(data)
  }, [selectedSubject])

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Subject Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Rankings based on quiz scores and completion time
        </p>
      </div>

      {/* Subject Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
            <TabsList className="grid w-full grid-cols-4">
              {subjects.map((subject) => (
                <TabsTrigger key={subject} value={subject} className="text-xs">
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{selectedSubject} Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                  entry.rank === 1
                    ? "border-yellow-200 bg-yellow-50"
                    : entry.rank === 2
                      ? "border-gray-300 bg-gray-50"
                      : entry.rank === 3
                        ? "border-orange-200 bg-orange-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {/* Rank & Name */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold w-12 text-center">
                    {getMedalIcon(entry.rank)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{entry.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        {entry.completedQuizzes} quizzes
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 text-right">
                  {/* Score */}
                  <div className="min-w-max">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-lg font-bold text-blue-600">{entry.score}%</p>
                  </div>

                  {/* Time */}
                  <div className="min-w-max">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> Time
                    </p>
                    <p className="font-semibold text-sm">{entry.timeMinutes} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Ranking Factor:</strong> Students are ranked by quiz score (primary) and completion time (secondary). The faster you complete while maintaining quality, the higher your rank!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
