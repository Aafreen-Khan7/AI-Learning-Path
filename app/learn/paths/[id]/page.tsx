"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Play,
  Lock,
  Video,
  Link as LinkIcon,
  TrendingUp,
  Award,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { minutesToLabel } from "@/lib/learning-data"
import { toast } from "sonner"

type TopicItem = {
  id: string
  title: string
  summary: string
  estimatedMinutes: number
  orderIndex: number
  status: "completed" | "in-progress" | "locked"
  quizScore: number | null
  resources: Array<{ type: string; title: string; url: string; source?: string }>
}

type RawTopicDoc = {
  id: string
  title?: string
  description?: string
  contentMarkdown?: string
  estimatedMinutes?: number
  orderIndex?: number
  resources?: Array<{ type: string; title: string; url: string; source?: string }>
}

type AIRecommendation = {
  type: "video" | "study-material" | "website"
  title: string
  url: string
  source: string
  reason: string
}

export default function SubjectDetailPage() {
  const { user } = useAuth()
  const params = useParams<{ id: string }>()
  const pathId = params.id

  const [activeTab, setActiveTab] = useState("topics")
  const [isLoading, setIsLoading] = useState(true)
  const [subjectName, setSubjectName] = useState("Learning Path")
  const [description, setDescription] = useState("Subject learning journey")
  const [progress, setProgress] = useState(0)
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [averageScore, setAverageScore] = useState(0)
  const [weakTopics, setWeakTopics] = useState<string[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadSubject = async () => {
      if (!user || !pathId) {
        if (mounted) setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const pathRef = doc(db, "learningPaths", pathId)
        const pathSnap = await getDoc(pathRef)

        if (!pathSnap.exists()) {
          toast.error("Learning path not found")
          if (mounted) setIsLoading(false)
          return
        }

        const pathData = pathSnap.data()
        if (pathData.uid && pathData.uid !== user.uid) {
          toast.error("You do not have access to this learning path")
          if (mounted) setIsLoading(false)
          return
        }

        const subjectId = String(pathData.subjectId || pathId)
        const pathName = String(pathData.subjectName || pathData.subjectId || "Learning Path")
        const pathDescription = String(pathData.description || "Personalized topic map")

        const topicsSnap = await getDocs(collection(db, "learningPaths", pathId, "topics"))
        const rawTopics: RawTopicDoc[] = topicsSnap.docs
          .map((topicDoc) => ({ id: topicDoc.id, ...(topicDoc.data() as Omit<RawTopicDoc, "id">) }))
          .sort((a, b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0))

        const progressRef = doc(db, "subjectProgress", `${user.uid}_${subjectId}`)
        const progressSnap = await getDoc(progressRef)
        const completedTopicIds = progressSnap.exists() && Array.isArray(progressSnap.data().completedTopicIds)
          ? progressSnap.data().completedTopicIds
          : []
        const weakAreas = progressSnap.exists() && Array.isArray(progressSnap.data().weakTopics)
          ? progressSnap.data().weakTopics
          : []

        const attemptsSnap = await getDocs(
          query(collection(db, "topicAttempts"), where("uid", "==", user.uid), where("subjectId", "==", subjectId))
        )

        const latestScoreByTopic = new Map<string, { score: number; submittedAt: number }>()
        for (const attemptDoc of attemptsSnap.docs) {
          const attempt = attemptDoc.data()
          const topicId = String(attempt.topicId || "")
          const score = Number(attempt.percentage || 0)
          const submittedAt = new Date(attempt.submittedAt || 0).getTime()
          const existing = latestScoreByTopic.get(topicId)
          if (!existing || submittedAt > existing.submittedAt) {
            latestScoreByTopic.set(topicId, { score, submittedAt })
          }
        }

        const topicItems: TopicItem[] = rawTopics.map((topic, index) => {
          const completed = completedTopicIds.includes(topic.id)
          const previousCompleted = index === 0 || completedTopicIds.includes(rawTopics[index - 1]?.id)
          const status: TopicItem["status"] = completed
            ? "completed"
            : previousCompleted
            ? "in-progress"
            : "locked"

          return {
            id: topic.id,
            title: String(topic.title || "Untitled Topic"),
            summary: String(
              topic.description ||
                (typeof topic.contentMarkdown === "string"
                  ? topic.contentMarkdown.split("\n").find((line: string) => line.trim())
                  : "") ||
                "Detailed module theory will appear here."
            ),
            estimatedMinutes: Number(topic.estimatedMinutes || 45),
            orderIndex: Number(topic.orderIndex || index),
            status,
            quizScore: latestScoreByTopic.get(topic.id)?.score ?? null,
            resources: Array.isArray(topic.resources) ? topic.resources : [],
          }
        })

        const completedCount = topicItems.filter((topic) => topic.status === "completed").length
        const progressValue = topicItems.length > 0 ? Math.round((completedCount / topicItems.length) * 100) : 0

        const scores = topicItems
          .map((topic) => topic.quizScore)
          .filter((score): score is number => score !== null)
        const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

        if (mounted) {
          setSubjectName(pathName)
          setDescription(pathDescription)
          setTopics(topicItems)
          setProgress(progressValue)
          setAverageScore(average)
          setWeakTopics(weakAreas)
        }
      } catch (error) {
        console.error("Failed to load subject details", error)
        toast.error("Could not load subject details")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadSubject()

    return () => {
      mounted = false
    }
  }, [pathId, user])

  const resourceCards = useMemo(() => {
    const list: Array<{ id: string; type: string; title: string; url: string; platform: string }> = []
    for (const topic of topics) {
      for (const resource of topic.resources) {
        list.push({
          id: `${topic.id}-${resource.url}`,
          type: resource.type || "article",
          title: resource.title || `Reference for ${topic.title}`,
          url: resource.url || "#",
          platform: resource.source || "Web",
        })
      }
    }
    return list.slice(0, 8)
  }, [topics])

  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecommendations(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName,
          progress,
          averageScore,
          weakTopics,
          topics: topics.map((topic) => ({
            id: topic.id,
            title: topic.title,
            score: topic.quizScore,
            status: topic.status,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendations")
      }

      const payload = (await response.json()) as { recommendations?: AIRecommendation[] }
      const recs = Array.isArray(payload.recommendations) ? payload.recommendations : []
      setAiRecommendations(recs)
      toast.success("Personalized recommendations generated")
    } catch (error) {
      console.error("Failed to generate personalized recommendations", error)
      toast.error("Could not generate recommendations right now")
    } finally {
      setIsGeneratingRecommendations(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading subject details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/learn/paths">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{subjectName}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-xl font-bold text-foreground">{progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-xl font-bold text-foreground">
                  {topics.filter((topic) => topic.status === "completed").length}/{topics.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-xl font-bold text-foreground">
                  {Math.round(topics.reduce((sum, topic) => sum + topic.estimatedMinutes, 0) / 60)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-xl font-bold text-foreground">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-primary font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="mt-6">
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <Card
                key={topic.id}
                className={`bg-card border-border transition-all ${
                  topic.status === "locked" ? "opacity-60" : "hover:border-primary/50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        topic.status === "completed"
                          ? "bg-success/10 text-success"
                          : topic.status === "in-progress"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {topic.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : topic.status === "locked" ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{topic.title}</h3>
                        {topic.status === "in-progress" && (
                          <Badge variant="secondary" className="shrink-0">Current</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{topic.summary}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {minutesToLabel(topic.estimatedMinutes)}
                        </span>
                        {topic.quizScore !== null && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Award className="h-3 w-3" /> Quiz: {topic.quizScore}%
                          </span>
                        )}
                      </div>
                    </div>

                    {topic.status !== "locked" && (
                      <Button
                        size="sm"
                        variant={topic.status === "completed" ? "outline" : "default"}
                        asChild
                      >
                        <Link href={`/learn/paths/${pathId}/topic/${topic.id}`}>
                          {topic.status === "completed" ? "Review Module" : "Continue Learning"}
                          <Play className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">AI + ML Personalized Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on your quiz analytics, weak areas, and module progress.
              </p>
            </div>
            <Button onClick={handleGenerateRecommendations} disabled={isGeneratingRecommendations}>
              {isGeneratingRecommendations ? "Generating..." : "Generate Recommendations"}
            </Button>
          </div>

          {aiRecommendations.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {aiRecommendations.map((resource, index) => (
                <Card key={`${resource.url}-${index}`} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                          resource.type === "video" ? "bg-chart-5/10" : "bg-chart-2/10"
                        }`}
                      >
                        {resource.type === "video" ? (
                          <Video className="h-5 w-5 text-chart-5" />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-chart-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{resource.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{resource.source}</p>
                        <p className="text-sm text-muted-foreground">{resource.reason}</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Open
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {resourceCards.length > 0 ? (
              resourceCards.map((resource) => (
                <Card key={resource.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                          resource.type === "video" ? "bg-chart-5/10" : "bg-chart-2/10"
                        }`}
                      >
                        {resource.type === "video" ? (
                          <Video className="h-5 w-5 text-chart-5" />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-chart-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.platform}</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Open
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-card border-border sm:col-span-2">
                <CardContent className="p-4 text-sm text-muted-foreground">
                  Resources will appear here once topic recommendations are generated.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Quiz Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topics
                    .filter((t) => t.quizScore !== null)
                    .map((topic) => (
                      <div key={topic.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{topic.title}</span>
                          <span className="text-sm font-medium text-primary">{topic.quizScore}%</span>
                        </div>
                        <Progress value={topic.quizScore ?? 0} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Suggestions to Improve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakTopics.length > 0 ? (
                  weakTopics.map((weakTopic) => (
                    <div key={weakTopic} className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Review {weakTopic}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        This topic needs more practice based on your recent quiz performance.
                      </p>
                      <Button size="sm" variant="outline">Review Topic</Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Keep going</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete more quizzes to get personalized improvement suggestions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}