"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle2, Lock, PlayCircle, Target } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { buildSubjectModules, SubjectModuleOutline } from "@/lib/learning-data"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

type TopicRef = {
  id: string
  orderIndex: number
}

type SubjectPathState = {
  pathId: string
  overallProgress: number
  completedTopics: number
  totalTopics: number
  topicRefs: TopicRef[]
}

export default function SubjectModulesPage() {
  const { user } = useAuth()
  const params = useParams<{ subject: string }>()

  const decodedSubject = decodeURIComponent(params.subject || "")
  const [isLoading, setIsLoading] = useState(true)
  const [subjectName, setSubjectName] = useState(decodedSubject || "Subject")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [pathState, setPathState] = useState<SubjectPathState | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSubjectModules = async () => {
      if (!user) {
        if (mounted) setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid))
        const subjects = userSnap.exists() && Array.isArray(userSnap.data().subjects)
          ? userSnap.data().subjects
          : []

        const matchingSignupSubject = subjects.find(
          (subject: string) => subject.toLowerCase() === decodedSubject.toLowerCase()
        )
        const resolvedSubjectName = matchingSignupSubject || decodedSubject || "Subject"

        const pathsSnap = await getDocs(query(collection(db, "learningPaths"), where("uid", "==", user.uid)))
        const matchingPathDoc = pathsSnap.docs.find((pathDoc) => {
          const data = pathDoc.data()
          const candidate = String(data.subjectName || data.subjectId || "")
          return candidate.toLowerCase() === resolvedSubjectName.toLowerCase()
        })

        let nextPathState: SubjectPathState | null = null

        if (matchingPathDoc) {
          const pathData = matchingPathDoc.data()
          const topicsSnap = await getDocs(collection(db, "learningPaths", matchingPathDoc.id, "topics"))
          const topicRefs = topicsSnap.docs
            .map((topicDoc) => ({
              id: topicDoc.id,
              orderIndex: Number(topicDoc.data().orderIndex || 0),
            }))
            .sort((a, b) => a.orderIndex - b.orderIndex)

          nextPathState = {
            pathId: matchingPathDoc.id,
            overallProgress: Number(pathData.overallProgress || 0),
            completedTopics: Number(pathData.completedTopics || 0),
            totalTopics: topicRefs.length,
            topicRefs,
          }
        }

        if (mounted) {
          setSubjectName(resolvedSubjectName)
          setSelectedSubjects(subjects)
          setPathState(nextPathState)
        }
      } catch (error) {
        console.error("Failed to load subject modules", error)
        toast.error("Could not load subject modules")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadSubjectModules()

    return () => {
      mounted = false
    }
  }, [decodedSubject, user])

  const modules = useMemo<SubjectModuleOutline[]>(() => buildSubjectModules(subjectName), [subjectName])
  const canAccessSubject = selectedSubjects.some((subject) => subject.toLowerCase() === subjectName.toLowerCase())

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading modules...</div>
  }

  if (!canAccessSubject) {
    return (
      <Card className="bg-card border-border max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Subject not in your profile</h2>
          <p className="text-sm text-muted-foreground">
            This page is available for subjects selected during signup.
          </p>
          <Button asChild>
            <Link href="/learn">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const unlockedCount = pathState
    ? Math.max(1, Math.min(modules.length, pathState.completedTopics + 1))
    : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/learn">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{subjectName} Modules</h1>
          <p className="text-muted-foreground">Complete each module in order. The next module unlocks after completion.</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Module Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {pathState ? `${pathState.completedTopics}/${modules.length} modules completed` : "No module attempts yet"}
            </span>
            <span className="text-sm font-medium text-primary">{pathState?.overallProgress || 0}%</span>
          </div>
          <Progress value={pathState?.overallProgress || 0} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {modules.map((module, index) => {
          const isUnlocked = index < unlockedCount
          const isCompleted = Boolean(pathState && index < pathState.completedTopics)
          const isLast = index === modules.length - 1
          const linkedTopicId = pathState?.topicRefs?.[index]?.id
          const learnHref = linkedTopicId
            ? `/learn/paths/${pathState?.pathId}/topic/${linkedTopicId}`
            : "/learn/paths"

          return (
            <Card
              key={module.id}
              className={`bg-card transition-colors ${isUnlocked ? "border-border" : "border-border/60 opacity-70"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Module {index + 1}</Badge>
                      <span className="text-xs text-muted-foreground">{module.estimatedMinutes} min</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground leading-6 mb-4">{module.theory}</p>

                    <div className="flex flex-wrap gap-2">
                      {module.keyPoints.map((point) => (
                        <span
                          key={point}
                          className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium ${isCompleted ? "text-success" : isUnlocked ? "text-primary" : "text-muted-foreground"}`}>
                      {isCompleted ? "Completed" : isUnlocked ? "Unlocked" : "Locked"}
                    </span>

                    {isUnlocked ? (
                      <Button size="sm" variant={isLast ? "default" : "secondary"} asChild>
                        <Link href={learnHref}>
                          {isLast ? "Take Quiz" : "Learn"}
                          {isLast ? <Target className="h-4 w-4 ml-2" /> : <PlayCircle className="h-4 w-4 ml-2" />}
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">Need deeper practice?</h3>
            <p className="text-sm text-primary-foreground/80">
              Open the full learning path to access topic-level lessons and quiz history.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href={pathState ? `/learn/paths/${pathState.pathId}` : "/learn/paths"}>
              Open Learning Path
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
