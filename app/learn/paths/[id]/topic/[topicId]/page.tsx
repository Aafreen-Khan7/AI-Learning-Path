"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Video,
  FileText,
  MessageSquare,
  Award,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore"
import { toast } from "sonner"

type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

type TopicResource = {
  type: string
  title: string
  url: string
  source?: string
}

const fallbackQuiz: QuizQuestion[] = [
  {
    question: "Which statement best describes this topic?",
    options: [
      "It requires conceptual understanding and practice",
      "It is only theory with no application",
      "It is unrelated to problem solving",
      "It does not need revision",
    ],
    correctIndex: 0,
  },
]

export default function TopicDetailPage() {
  const { user } = useAuth()
  const params = useParams<{ id: string; topicId: string }>()
  const pathId = params.id
  const topicId = params.topicId

  const [isLoading, setIsLoading] = useState(true)
  const [mode, setMode] = useState<"learn" | "quiz" | "results">("learn")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const [subjectId, setSubjectId] = useState("")
  const [subjectName, setSubjectName] = useState("Learning Path")
  const [topicName, setTopicName] = useState("Topic")
  const [topicDuration, setTopicDuration] = useState("45 min")
  const [contentMarkdown, setContentMarkdown] = useState("Content is being prepared.")
  const [resources, setResources] = useState<TopicResource[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(fallbackQuiz)

  const [orderedTopicIds, setOrderedTopicIds] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    const loadTopic = async () => {
      if (!user || !pathId || !topicId) {
        if (mounted) setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const pathSnap = await getDoc(doc(db, "learningPaths", pathId))
        if (!pathSnap.exists()) {
          toast.error("Learning path not found")
          if (mounted) setIsLoading(false)
          return
        }

        const pathData = pathSnap.data()
        if (pathData.uid && pathData.uid !== user.uid) {
          toast.error("You do not have access to this path")
          if (mounted) setIsLoading(false)
          return
        }

        const derivedSubjectId = String(pathData.subjectId || pathId)
        const derivedSubjectName = String(pathData.subjectName || pathData.subjectId || "Learning Path")

        const topicsSnap = await getDocs(collection(db, "learningPaths", pathId, "topics"))
        const sortedTopics = topicsSnap.docs
          .map((topicDoc) => ({ id: topicDoc.id, ...topicDoc.data() }))
          .sort((a, b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0))

        const currentIndex = sortedTopics.findIndex((topic) => topic.id === topicId)
        const previousTopicId = currentIndex > 0 ? sortedTopics[currentIndex - 1]?.id : null

        const currentTopic = sortedTopics.find((topic) => topic.id === topicId)
        if (!currentTopic) {
          toast.error("Topic not found")
          if (mounted) setIsLoading(false)
          return
        }

        const questions = Array.isArray(currentTopic.quizQuestions) && currentTopic.quizQuestions.length > 0
          ? currentTopic.quizQuestions
          : fallbackQuiz

        const progressRef = doc(db, "subjectProgress", `${user.uid}_${derivedSubjectId}`)
        const progressSnap = await getDoc(progressRef)
        const completedTopicIds = progressSnap.exists() && Array.isArray(progressSnap.data().completedTopicIds)
          ? progressSnap.data().completedTopicIds
          : []
        const topicLocked = Boolean(previousTopicId && !completedTopicIds.includes(previousTopicId))

        if (mounted) {
          setSubjectId(derivedSubjectId)
          setSubjectName(derivedSubjectName)
          setTopicName(String(currentTopic.title || "Topic"))
          setTopicDuration(`${Number(currentTopic.estimatedMinutes || 45)} min`)
          setContentMarkdown(String(currentTopic.contentMarkdown || "Content is being prepared."))
          setResources(Array.isArray(currentTopic.resources) ? currentTopic.resources : [])
          setQuizQuestions(questions)
          setAnswers(new Array(questions.length).fill(null))
          setOrderedTopicIds(sortedTopics.map((topic) => topic.id))
          setIsLocked(topicLocked)
        }
      } catch (error) {
        console.error("Failed to load topic", error)
        toast.error("Could not load topic details")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadTopic()

    return () => {
      mounted = false
    }
  }, [pathId, topicId, user])

  const score = useMemo(() => {
    if (!quizQuestions.length) return 0
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index]?.correctIndex) correct++
    })
    return Math.round((correct / quizQuestions.length) * 100)
  }, [answers, quizQuestions])

  const previousTopicId = useMemo(() => {
    const idx = orderedTopicIds.indexOf(topicId)
    if (idx <= 0) return null
    return orderedTopicIds[idx - 1]
  }, [orderedTopicIds, topicId])

  const nextTopicId = useMemo(() => {
    const idx = orderedTopicIds.indexOf(topicId)
    if (idx < 0 || idx >= orderedTopicIds.length - 1) return null
    return orderedTopicIds[idx + 1]
  }, [orderedTopicIds, topicId])

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value, 10)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowFeedback(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!user) return

    try {
      const correctCount = answers.filter((answer, index) => answer === quizQuestions[index]?.correctIndex).length
      const weakAreas = quizQuestions
        .map((question, index) => ({ question, index }))
        .filter(({ index }) => answers[index] !== quizQuestions[index]?.correctIndex)
        .map(({ question }) => question.question)
        .slice(0, 3)

      await addDoc(collection(db, "topicAttempts"), {
        uid: user.uid,
        pathId,
        subjectId,
        topicId,
        answers,
        score: correctCount,
        maxScore: quizQuestions.length,
        percentage: score,
        weakAreas,
        submittedAt: new Date().toISOString(),
      })

      const progressRef = doc(db, "subjectProgress", `${user.uid}_${subjectId}`)
      const progressSnap = await getDoc(progressRef)
      const completedTopicIds = progressSnap.exists() && Array.isArray(progressSnap.data().completedTopicIds)
        ? progressSnap.data().completedTopicIds
        : []

      const mergedCompleted = Array.from(new Set([...completedTopicIds, topicId]))

      await setDoc(
        progressRef,
        {
          uid: user.uid,
          subjectId,
          completedTopicIds: mergedCompleted,
          weakTopics: weakAreas,
          progressPercent: orderedTopicIds.length
            ? Math.round((mergedCompleted.length / orderedTopicIds.length) * 100)
            : 0,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

      await setDoc(
        doc(db, "learningPaths", pathId),
        {
          completedTopics: mergedCompleted.length,
          totalTopics: orderedTopicIds.length,
          overallProgress: orderedTopicIds.length
            ? Math.round((mergedCompleted.length / orderedTopicIds.length) * 100)
            : 0,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

      setMode("results")
      toast.success("Quiz submitted and progress updated")
    } catch (error) {
      console.error("Failed to submit quiz", error)
      toast.error("Could not submit quiz")
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading topic...</div>
  }

  if (isLocked) {
    return (
      <Card className="bg-card border-border max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <Lock className="h-10 w-10 mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Module locked</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Complete the previous module and its quiz to unlock this one.
            </p>
          </div>
          <Button asChild>
            <Link href={`/learn/paths/${pathId}`}>Go back to modules</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/learn/paths/${pathId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{subjectName}</span>
            <span>/</span>
            <span>{topicName}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{topicName}</h1>
        </div>
        <Badge variant="secondary">{topicDuration}</Badge>
      </div>

      <div className="flex gap-2">
        <Button variant={mode === "learn" ? "default" : "outline"} onClick={() => setMode("learn")}>
          <BookOpen className="h-4 w-4 mr-2" />
          Learn
        </Button>
        <Button
          variant={mode === "quiz" || mode === "results" ? "default" : "outline"}
          onClick={() => {
            setMode("quiz")
            setCurrentQuestion(0)
            setAnswers(new Array(quizQuestions.length).fill(null))
            setShowFeedback(false)
          }}
        >
          <Award className="h-4 w-4 mr-2" />
          Take Quiz
        </Button>
      </div>

      {mode === "learn" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">{topicName}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{contentMarkdown}</p>

                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Study Tip</h4>
                        <p className="text-sm text-muted-foreground">
                          Review this topic once, then take the quiz to lock it into memory and unlock next topics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" asChild disabled={!previousTopicId}>
                <Link href={previousTopicId ? `/learn/paths/${pathId}/topic/${previousTopicId}` : "#"}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Topic
                </Link>
              </Button>
              <Button onClick={() => setMode("quiz")}>
                Take Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <a
                      key={`${resource.url}-${resource.title}`}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      {resource.type === "video" ? (
                        <Video className="h-5 w-5 text-chart-5" />
                      ) : (
                        <FileText className="h-5 w-5 text-chart-2" />
                      )}
                      <span className="text-sm text-foreground">{resource.title}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No resources linked yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Need help?</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Ask our AI tutor to explain this concept in simpler words.
                </p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/learn/simplifier">Ask AI Tutor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {mode === "quiz" && (
        <Card className="bg-card border-border max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </CardTitle>
              <Badge variant="secondary">{answers.filter((a) => a !== null).length} answered</Badge>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2 mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium text-foreground">{quizQuestions[currentQuestion].question}</h3>

            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    showFeedback
                      ? index === quizQuestions[currentQuestion].correctIndex
                        ? "bg-success/10 border-success"
                        : answers[currentQuestion] === index
                        ? "bg-destructive/10 border-destructive"
                        : "bg-secondary border-border"
                      : answers[currentQuestion] === index
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showFeedback && index === quizQuestions[currentQuestion].correctIndex && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  {showFeedback && answers[currentQuestion] === index && index !== quizQuestions[currentQuestion].correctIndex && (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {!showFeedback && answers[currentQuestion] !== null && (
                <Button variant="secondary" onClick={() => setShowFeedback(true)}>
                  Check Answer
                </Button>
              )}

              {currentQuestion === quizQuestions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} disabled={answers.some((a) => a === null)}>
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "results" && (
        <Card className="bg-card border-border max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div
              className={`h-24 w-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                score >= 80 ? "bg-success/10" : score >= 60 ? "bg-warning/10" : "bg-destructive/10"
              }`}
            >
              <span
                className={`text-3xl font-bold ${
                  score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive"
                }`}
              >
                {score}%
              </span>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              You got {answers.filter((a, i) => a === quizQuestions[i]?.correctIndex).length} out of {quizQuestions.length} questions correct.
            </p>

            <div className="space-y-4 text-left mb-8">
              {quizQuestions.map((q, index) => (
                <div
                  key={`${q.question}-${index}`}
                  className={`p-4 rounded-lg ${
                    answers[index] === q.correctIndex ? "bg-success/10" : "bg-destructive/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answers[index] === q.correctIndex ? (
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{q.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">Correct answer: {q.options[q.correctIndex]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => setMode("learn")}>Review Topic</Button>
              <Button asChild>
                <Link href={nextTopicId ? `/learn/paths/${pathId}/topic/${nextTopicId}` : `/learn/paths/${pathId}`}>
                  {nextTopicId ? "Next Topic" : "Back to Path"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}