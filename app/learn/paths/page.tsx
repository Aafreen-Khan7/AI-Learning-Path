"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"
import { buildSubjectModules, LearningPathRecord, statusFromProgress } from "@/lib/learning-data"
import { toast } from "sonner"

const colorClasses = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5", "bg-primary"]

type PathListItem = LearningPathRecord & { hasPath: boolean }

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default function LearningPathsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [paths, setPaths] = useState<PathListItem[]>([])
  const [creatingPathFor, setCreatingPathFor] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadPaths = async () => {
      if (!user) {
        if (mounted) setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid))
        const selectedSubjects = userSnap.exists() && Array.isArray(userSnap.data().subjects)
          ? userSnap.data().subjects.map((subject: unknown) => String(subject)).filter(Boolean)
          : []

        const pathsQuery = query(collection(db, "learningPaths"), where("uid", "==", user.uid))
        const pathsSnap = await getDocs(pathsQuery)

        const records: PathListItem[] = await Promise.all(
          pathsSnap.docs.map(async (pathDoc) => {
            const data = pathDoc.data()
            const pathId = pathDoc.id
            const subjectId = String(data.subjectId || pathId)
            const subjectName = String(data.subjectName || data.subjectId || "Untitled Subject")
            const description = String(data.description || "Personalized learning path")
            const progress = Number(data.overallProgress || 0)

            const topicsSnap = await getDocs(collection(db, "learningPaths", pathId, "topics"))
            const totalTopics = topicsSnap.size

            let completedTopics = Number(data.completedTopics || 0)
            const progressRef = doc(db, "subjectProgress", `${user.uid}_${subjectId}`)
            const progressSnap = await getDoc(progressRef)
            if (progressSnap.exists()) {
              const progressData = progressSnap.data()
              const completedIds = Array.isArray(progressData.completedTopicIds)
                ? progressData.completedTopicIds
                : []
              completedTopics = completedIds.length
            }

            const computedProgress = totalTopics > 0
              ? Math.round((completedTopics / totalTopics) * 100)
              : progress

            return {
              id: pathId,
              subjectId,
              subjectName,
              description,
              overallProgress: Number.isFinite(computedProgress) ? computedProgress : 0,
              completedTopics,
              totalTopics,
              duration: String(data.duration || `${Math.max(1, totalTopics)} hours`),
              status: statusFromProgress(Number.isFinite(computedProgress) ? computedProgress : 0),
              hasPath: true,
            }
          })
        )

        const recordsBySubject = new Map(records.map((record) => [record.subjectName.toLowerCase(), record]))
        for (const subject of selectedSubjects) {
          const key = subject.toLowerCase()
          if (recordsBySubject.has(key)) continue

          const modulePlan = buildSubjectModules(subject)
          records.push({
            id: `pending-${slugify(subject)}`,
            subjectId: slugify(subject),
            subjectName: subject,
            description: "Start your personalized module path for this subject.",
            overallProgress: 0,
            completedTopics: 0,
            totalTopics: modulePlan.length,
            duration: `${Math.max(1, Math.round(modulePlan.reduce((sum, module) => sum + module.estimatedMinutes, 0) / 60))} hours`,
            status: "not-started",
            hasPath: false,
          })
        }

        if (mounted) setPaths(records)
      } catch (error) {
        console.error("Failed to load learning paths", error)
        toast.error("Could not load learning paths")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadPaths()

    return () => {
      mounted = false
    }
  }, [user])

  const handleStartPath = async (subject: PathListItem) => {
    if (!user) {
      toast.error("Please sign in first")
      return
    }

    if (subject.hasPath) {
      router.push(`/learn/paths/${subject.id}`)
      return
    }

    setCreatingPathFor(subject.subjectName)
    try {
      const modules = buildSubjectModules(subject.subjectName)
      const now = new Date().toISOString()

      const createdPathRef = await addDoc(collection(db, "learningPaths"), {
        uid: user.uid,
        subjectId: slugify(subject.subjectName),
        subjectName: subject.subjectName,
        description: subject.description,
        duration: subject.duration,
        completedTopics: 0,
        totalTopics: modules.length,
        overallProgress: 0,
        createdAt: now,
        updatedAt: now,
      })

      await Promise.all(
        modules.map((module, index) =>
          setDoc(doc(db, "learningPaths", createdPathRef.id, "topics", `module-${index + 1}`), {
            title: module.title,
            description: module.theory,
            contentMarkdown: `${module.theory}\n\nKey points:\n${module.keyPoints.map((point) => `- ${point}`).join("\n")}`,
            estimatedMinutes: module.estimatedMinutes,
            orderIndex: index + 1,
            resources: [],
            completed: false,
            quizQuestions: [
              {
                question: `What is the main focus of ${module.title}?`,
                options: [
                  module.keyPoints[0] || "Core concept",
                  "Random unrelated topic",
                  "Only memorization without understanding",
                  "Skipping to advanced topics first",
                ],
                correctIndex: 0,
                explanation: `The module focuses on ${module.keyPoints[0] || "the core concept"}.`,
              },
              {
                question: `Which key point belongs to ${module.title}?`,
                options: [
                  module.keyPoints[1] || module.keyPoints[0] || "Core point",
                  "Ignoring fundamentals",
                  "No practical connection",
                  "Avoiding revision",
                ],
                correctIndex: 0,
                explanation: `This module includes ${module.keyPoints[1] || module.keyPoints[0] || "its core point"}.`,
              },
            ],
          })
        )
      )

      toast.success("Learning path created")
      router.push(`/learn/paths/${createdPathRef.id}`)
    } catch (error) {
      console.error("Failed to create learning path", error)
      toast.error("Could not create learning path")
    } finally {
      setCreatingPathFor(null)
    }
  }

  const filteredSubjects = useMemo(() => {
    return paths.filter((subject) => {
      const matchesSearch = subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || subject.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [paths, searchQuery, statusFilter])

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading learning paths...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learning Paths</h1>
        <p className="text-muted-foreground">Choose a subject to start learning</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {filteredSubjects.map((subject, index) => {
          const color = colorClasses[index % colorClasses.length]
          return (
            <Card
              key={subject.id}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className={viewMode === "grid" ? "p-6" : "p-6 flex gap-6 items-center"}>
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${color}/10 flex items-center justify-center`}>
                      <BookOpen className={`h-6 w-6 ${color.replace("bg-", "text-")}`} />
                    </div>
                    <Badge
                      variant={subject.status === "completed" ? "default" : subject.status === "in-progress" ? "secondary" : "outline"}
                      className={subject.status === "completed" ? "bg-success text-success-foreground" : ""}
                    >
                      {subject.status === "completed"
                        ? "Completed"
                        : subject.status === "in-progress"
                        ? "In Progress"
                        : "Not Started"}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{subject.subjectName}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {subject.completedTopics}/{subject.totalTopics} topics
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {subject.duration}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-primary">{subject.overallProgress}%</span>
                    </div>
                    <Progress value={subject.overallProgress} className="h-2" />
                  </div>
                </div>

                <Button
                  className={viewMode === "list" ? "" : "w-full"}
                  variant={subject.status === "completed" ? "secondary" : "default"}
                  onClick={() => handleStartPath(subject)}
                  disabled={creatingPathFor === subject.subjectName}
                >
                  {creatingPathFor === subject.subjectName
                    ? "Creating..."
                    : subject.hasPath
                    ? subject.status === "completed"
                      ? "Review"
                      : subject.status === "in-progress"
                      ? "Continue"
                      : "Start Learning"
                    : "Create Path"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No subjects found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}