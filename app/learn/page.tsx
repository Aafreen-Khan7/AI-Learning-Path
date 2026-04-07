"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
  Play,
  Calendar,
  Award,
  Flame,
  Users,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { asDate, formatRelativeDue, statusFromProgress } from "@/lib/learning-data"
import { toast } from "sonner"

type PathCard = {
  id: string
  subjectName: string
  overallProgress: number
  lastTopic: string
  completedTopics: number
  totalTopics: number
}

type SessionCard = {
  id: string
  title: string
  subject: string
  dueIn: string
  dueDate?: Date
}

export default function LearnDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [displayName, setDisplayName] = useState("Student")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [streakDays, setStreakDays] = useState(0)
  const [activeSubjects, setActiveSubjects] = useState(0)
  const [topicsCompleted, setTopicsCompleted] = useState(0)
  const [hoursStudied, setHoursStudied] = useState(0)
  const [avgQuizScore, setAvgQuizScore] = useState(0)
  const [recentSubjects, setRecentSubjects] = useState<PathCard[]>([])
  const [subjectPaths, setSubjectPaths] = useState<PathCard[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<SessionCard[]>([])

  const [inviteCode, setInviteCode] = useState("")
  const [joiningClass, setJoiningClass] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      if (!user) {
        if (mounted) setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists() && mounted) {
          const userData = userSnap.data()
          setDisplayName(userData.name || user.displayName || "Student")
          setStreakDays(Number(userData.streakDays || 0))
          setSelectedSubjects(Array.isArray(userData.subjects) ? userData.subjects : [])
        }

        const pathsQuery = query(collection(db, "learningPaths"), where("uid", "==", user.uid))
        const pathsSnap = await getDocs(pathsQuery)

        let completedTopicTotal = 0
        let estimatedMinutesTotal = 0
        const pathCards: PathCard[] = []

        for (const pathDoc of pathsSnap.docs) {
          const path = pathDoc.data()
          const pathId = pathDoc.id
          const subjectName = path.subjectName || path.subjectId || "Untitled Subject"
          const progress = Number(path.overallProgress || 0)

          const topicsSnap = await getDocs(collection(db, "learningPaths", pathId, "topics"))
          const topicDocs = topicsSnap.docs
            .map((t) => ({ id: t.id, ...t.data() }))
            .sort((a, b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0))

          const firstPending = topicDocs.find((t) => !Boolean(t.completed))
          const latestTopic = firstPending?.title || topicDocs[0]?.title || "Start your first topic"

          completedTopicTotal += Number(path.completedTopics || 0)
          estimatedMinutesTotal += topicDocs.reduce((sum, t) => sum + Number(t.estimatedMinutes || 0), 0)

          pathCards.push({
            id: pathId,
            subjectName,
            overallProgress: progress,
            lastTopic: latestTopic,
            completedTopics: Number(path.completedTopics || 0),
            totalTopics: topicDocs.length,
          })
        }

        const activeCount = pathCards.filter((p) => {
          const status = statusFromProgress(p.overallProgress)
          return status === "in-progress" || status === "not-started"
        }).length

        const attemptsQuery = query(collection(db, "topicAttempts"), where("uid", "==", user.uid))
        const attemptsSnap = await getDocs(attemptsQuery)
        const allScores = attemptsSnap.docs
          .map((docItem) => Number(docItem.data().percentage || 0))
          .filter((score) => Number.isFinite(score) && score > 0)

        const sessionsQuery = query(collection(db, "studySessions"), where("uid", "==", user.uid))
        const sessionsSnap = await getDocs(sessionsQuery)

        const sessionCards: SessionCard[] = sessionsSnap.docs
          .map((sessionDoc) => {
            const data = sessionDoc.data()
            const dueDate = asDate(data.date)
            const dueIn = dueDate ? formatRelativeDue(dueDate) : "Planned"
            return {
              id: sessionDoc.id,
              title: data.topic || "Study session",
              subject: data.subject || "General",
              dueIn,
              dueDate,
            }
          })
          .sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0
            return a.dueDate.getTime() - b.dueDate.getTime()
          })
          .slice(0, 4)

        if (mounted) {
          setSubjectPaths(pathCards)
          setRecentSubjects(pathCards.sort((a, b) => b.overallProgress - a.overallProgress).slice(0, 3))
          setUpcomingTasks(sessionCards)
          setActiveSubjects(activeCount)
          setTopicsCompleted(completedTopicTotal)
          setHoursStudied(Math.round(estimatedMinutesTotal / 60))
          setAvgQuizScore(allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0)
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error)
        toast.error("Could not load your dashboard data")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [user])

  const achievements = useMemo(
    () => [
      { id: 1, title: "7-Day Streak", icon: Flame, earned: streakDays >= 7 },
      { id: 2, title: "Quiz Master", icon: Award, earned: avgQuizScore >= 80 },
      { id: 3, title: "Fast Learner", icon: TrendingUp, earned: topicsCompleted >= 10 },
    ],
    [avgQuizScore, streakDays, topicsCompleted]
  )

  const handleJoinClass = async () => {
    if (!user) {
      toast.error("Please sign in to join a class")
      return
    }

    const normalizedCode = inviteCode.trim().toUpperCase()
    if (!normalizedCode) {
      toast.error("Enter an invite code")
      return
    }

    setJoiningClass(true)
    try {
      const classQuery = query(
        collection(db, "classes"),
        where("inviteCode", "==", normalizedCode),
        limit(1)
      )
      const classSnap = await getDocs(classQuery)

      if (classSnap.empty) {
        toast.error("Invalid invite code")
        return
      }

      const targetClass = classSnap.docs[0]
      await updateDoc(doc(db, "classes", targetClass.id), {
        studentIds: arrayUnion(user.uid),
      })

      await setDoc(
        doc(db, "users", user.uid),
        {
          joinedClassIds: arrayUnion(targetClass.id),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

      setInviteCode("")
      toast.success("Class joined successfully")
    } catch (error) {
      console.error("Failed to join class", error)
      toast.error("Could not join class")
    } finally {
      setJoiningClass(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-chart-5/10 text-chart-5 rounded-full">
            <Flame className="h-5 w-5" />
            <span className="font-semibold">{Math.max(streakDays, 0)} day streak</span>
          </div>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Selected Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <div
                  key={subject}
                  className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground"
                >
                  {subject}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No subjects were selected during signup yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Join a class</p>
              <p className="text-xs text-muted-foreground mb-2">Enter teacher invite code to connect your dashboard</p>
              <Input
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="e.g. CSE-2026-A"
                className="bg-secondary border-border"
              />
            </div>
            <Button onClick={handleJoinClass} disabled={joiningClass}>
              <Users className="h-4 w-4 mr-2" />
              {joiningClass ? "Joining..." : "Join Class"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subjects</p>
                <p className="text-2xl font-bold text-foreground">{activeSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-2xl font-bold text-foreground">{topicsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Planned</p>
                <p className="text-2xl font-bold text-foreground">{hoursStudied}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Quiz Score</p>
                <p className="text-2xl font-bold text-foreground">{avgQuizScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Continue Learning</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/learn/paths">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentSubjects.length > 0 ? (
              recentSubjects.map((subject) => (
                <Card key={subject.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground">{subject.subjectName}</h3>
                          <span className="text-sm font-medium text-primary">{subject.overallProgress}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Next: {subject.lastTopic}</p>
                        <Progress value={subject.overallProgress} className="h-2" />
                      </div>
                      <Button size="icon" className="shrink-0" asChild>
                        <Link href={`/learn/paths/${subject.id}`}>
                          <Play className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedSubjects.length > 0 ? (
                  selectedSubjects.map((subject) => {
                    const matchingPath = subjectPaths.find(
                      (path) => path.subjectName.toLowerCase() === subject.toLowerCase()
                    )

                    return (
                      <Card key={subject} className="bg-card border-border hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <BookOpen className="h-7 w-7 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <div>
                                  <h3 className="font-semibold text-foreground">{subject}</h3>
                                </div>
                                <span className="text-sm font-medium text-primary">
                                  {matchingPath ? `${matchingPath.overallProgress}%` : "Selected"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                Open the full module page to read theory, follow module unlocks, and take the final quiz.
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="secondary" asChild>
                                  <Link href={`/learn/subjects/${encodeURIComponent(subject)}`}>
                                    Learn
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={matchingPath ? `/learn/paths/${matchingPath.id}` : "/learn/paths"}>
                                    Open path
                                  </Link>
                                </Button>
                              </div>
                              <Progress value={matchingPath?.overallProgress || 0} className="h-2 mt-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="bg-card border-border sm:col-span-2">
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      No subjects were selected during signup yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/learn/planner">
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{task.dueIn}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming sessions. Add one in Study Planner.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center gap-2 ${achievement.earned ? "" : "opacity-40"}`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-chart-3/10" : "bg-secondary"
                      }`}
                    >
                      <achievement.icon
                        className={`h-6 w-6 ${achievement.earned ? "text-chart-3" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span className="text-xs text-center text-muted-foreground">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Need help understanding a concept?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Our AI tutor is available 24/7 to explain any topic.
              </p>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/learn/simplifier">
                  Ask AI Tutor
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}