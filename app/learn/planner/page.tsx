"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  BookOpen,
  Target,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Brain,
  Layers,
} from "lucide-react"

const initialSchedule = [
  { id: 1, subject: "Data Structures", topic: "Binary Trees", date: "2026-04-07", time: "09:00", duration: 90, completed: false },
  { id: 2, subject: "Computer Networks", topic: "TCP/IP Protocol", date: "2026-04-07", time: "14:00", duration: 60, completed: true },
  { id: 3, subject: "Operating Systems", topic: "Process Scheduling", date: "2026-04-08", time: "10:00", duration: 120, completed: false },
  { id: 4, subject: "Database Management", topic: "Normalization", date: "2026-04-09", time: "11:00", duration: 90, completed: false },
]

const initialFlashcards = [
  { id: 1, subject: "Data Structures", question: "What is the time complexity of binary search?", answer: "O(log n) - Binary search repeatedly divides the search interval in half.", known: false },
  { id: 2, subject: "Data Structures", question: "What is a stack overflow?", answer: "A stack overflow occurs when too much memory is used on the call stack, often from deep or infinite recursion.", known: true },
  { id: 3, subject: "Computer Networks", question: "What does TCP stand for?", answer: "Transmission Control Protocol - It provides reliable, ordered delivery of data between applications.", known: false },
  { id: 4, subject: "Operating Systems", question: "What is a deadlock?", answer: "A deadlock is a situation where two or more processes are blocked forever, each waiting for resources held by the other.", known: false },
  { id: 5, subject: "Database Management", question: "What is 3NF?", answer: "Third Normal Form - A relation is in 3NF if it is in 2NF and has no transitive dependencies.", known: true },
]

const subjects = ["Data Structures", "Computer Networks", "Operating Systems", "Database Management", "Algorithms", "Machine Learning"]

export default function StudyPlannerPage() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [schedule, setSchedule] = useState(initialSchedule)
  const [flashcards, setFlashcards] = useState(initialFlashcards)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [isAddingFlashcard, setIsAddingFlashcard] = useState(false)
  const [flashcardMode, setFlashcardMode] = useState<"view" | "practice">("view")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all")

  const [newSession, setNewSession] = useState({
    subject: "",
    topic: "",
    date: "",
    time: "",
    duration: 60,
  })

  const [newFlashcard, setNewFlashcard] = useState({
    subject: "",
    question: "",
    answer: "",
  })

  const filteredSchedule = schedule.filter((session) => {
    if (!selectedDate) return true
    const sessionDate = new Date(session.date).toDateString()
    return sessionDate === selectedDate.toDateString()
  })

  const filteredFlashcards = flashcards.filter((card) => {
    if (selectedSubjectFilter === "all") return true
    return card.subject === selectedSubjectFilter
  })

  const practiceCards = filteredFlashcards.filter((card) => !card.known)

  const handleAddSession = () => {
    if (newSession.subject && newSession.topic && newSession.date && newSession.time) {
      setSchedule([
        ...schedule,
        {
          id: Date.now(),
          ...newSession,
          completed: false,
        },
      ])
      setNewSession({ subject: "", topic: "", date: "", time: "", duration: 60 })
      setIsAddingSession(false)
    }
  }

  const handleDeleteSession = (id: number) => {
    setSchedule(schedule.filter((s) => s.id !== id))
  }

  const handleToggleComplete = (id: number) => {
    setSchedule(schedule.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }

  const handleAddFlashcard = () => {
    if (newFlashcard.subject && newFlashcard.question && newFlashcard.answer) {
      setFlashcards([
        ...flashcards,
        {
          id: Date.now(),
          ...newFlashcard,
          known: false,
        },
      ])
      setNewFlashcard({ subject: "", question: "", answer: "" })
      setIsAddingFlashcard(false)
    }
  }

  const handleDeleteFlashcard = (id: number) => {
    setFlashcards(flashcards.filter((f) => f.id !== id))
  }

  const handleMarkKnown = (known: boolean) => {
    setFlashcards(flashcards.map((f) => (f.id === practiceCards[currentCardIndex].id ? { ...f, known } : f)))
    setShowAnswer(false)
    if (currentCardIndex < practiceCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setFlashcardMode("view")
      setCurrentCardIndex(0)
    }
  }

  const resetPractice = () => {
    setFlashcards(flashcards.map((f) => ({ ...f, known: false })))
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Study Planner</h1>
          <p className="text-muted-foreground">Plan your study sessions and create flashcards</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="schedule" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2">
            <Layers className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>

            {/* Sessions List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h2>
                <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Study Session</DialogTitle>
                      <DialogDescription>
                        Schedule a new study session for exam preparation.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select
                          value={newSession.subject}
                          onValueChange={(v) => setNewSession({ ...newSession, subject: v })}
                        >
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Topic</Label>
                        <Input
                          placeholder="Enter topic name"
                          value={newSession.topic}
                          onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={newSession.date}
                            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newSession.time}
                            onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Select
                          value={newSession.duration.toString()}
                          onValueChange={(v) => setNewSession({ ...newSession, duration: parseInt(v) })}
                        >
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="180">3 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleAddSession}>
                        Add Session
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {filteredSchedule.length > 0 ? (
                <div className="space-y-3">
                  {filteredSchedule.map((session) => (
                    <Card
                      key={session.id}
                      className={`bg-card border-border ${session.completed ? "opacity-60" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleComplete(session.id)}
                            className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              session.completed
                                ? "bg-success border-success text-success-foreground"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {session.completed && <Check className="h-5 w-5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium ${session.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {session.topic}
                              </h3>
                              <Badge variant="secondary">{session.subject}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {session.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" /> {session.duration} min
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSession(session.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No sessions scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      Add a study session to start planning your day.
                    </p>
                    <Button onClick={() => setIsAddingSession(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Flashcards Tab */}
        <TabsContent value="flashcards" className="mt-6">
          {flashcardMode === "view" ? (
            <div className="space-y-6">
              {/* Flashcard Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSubjectFilter} onValueChange={setSelectedSubjectFilter}>
                  <SelectTrigger className="w-48 bg-secondary border-border">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 sm:ml-auto">
                  {practiceCards.length > 0 && (
                    <Button variant="secondary" onClick={() => setFlashcardMode("practice")}>
                      <Brain className="h-4 w-4 mr-2" />
                      Practice ({practiceCards.length})
                    </Button>
                  )}
                  <Dialog open={isAddingFlashcard} onOpenChange={setIsAddingFlashcard}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Flashcard
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Flashcard</DialogTitle>
                        <DialogDescription>
                          Add a new flashcard for quick revision.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select
                            value={newFlashcard.subject}
                            onValueChange={(v) => setNewFlashcard({ ...newFlashcard, subject: v })}
                          >
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Textarea
                            placeholder="Enter your question"
                            value={newFlashcard.question}
                            onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer</Label>
                          <Textarea
                            placeholder="Enter the answer"
                            value={newFlashcard.answer}
                            onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <Button className="w-full" onClick={handleAddFlashcard}>
                          Create Flashcard
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Flashcard Grid */}
              {filteredFlashcards.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFlashcards.map((card) => (
                    <Card key={card.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{card.subject}</Badge>
                          <div className="flex items-center gap-1">
                            {card.known && (
                              <Badge className="bg-success text-success-foreground">Known</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteFlashcard(card.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-medium text-foreground mb-2">{card.question}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{card.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No flashcards yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create flashcards to help you memorize key concepts.
                    </p>
                    <Button onClick={() => setIsAddingFlashcard(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Flashcard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Practice Mode */
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => setFlashcardMode("view")}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Flashcards
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentCardIndex + 1} / {practiceCards.length}
                  </span>
                  <Button variant="ghost" size="icon" onClick={resetPractice}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {practiceCards.length > 0 ? (
                <Card
                  className="bg-card border-border cursor-pointer min-h-[300px] flex flex-col"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <Badge variant="secondary" className="mb-4">
                      {practiceCards[currentCardIndex].subject}
                    </Badge>
                    
                    {!showAnswer ? (
                      <>
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                          {practiceCards[currentCardIndex].question}
                        </h2>
                        <p className="text-sm text-muted-foreground">Tap to reveal answer</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg text-foreground mb-6">
                          {practiceCards[currentCardIndex].answer}
                        </p>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkKnown(false)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Still Learning
                          </Button>
                          <Button
                            className="bg-success hover:bg-success/90"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkKnown(true)
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Got It!
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">All done!</h3>
                    <p className="text-muted-foreground mb-4">
                      You&apos;ve reviewed all your flashcards. Great job!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={resetPractice}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Practice Again
                      </Button>
                      <Button onClick={() => setFlashcardMode("view")}>
                        Back to Flashcards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              {practiceCards.length > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                  {practiceCards.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full ${
                        index === currentCardIndex
                          ? "bg-primary"
                          : index < currentCardIndex
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
