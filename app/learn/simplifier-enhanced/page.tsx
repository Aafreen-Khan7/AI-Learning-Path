"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { BookOpen, Brain, Lightbulb, Layers } from "lucide-react"

interface SimplificationResult {
  simplifiedText: string
  keyPoints: string[]
  analogies: string[]
  visualSummary: string
  flashcards: { question: string; answer: string }[]
}

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "History", "Geography", "English"
]

export default function ConceptSimplifierPage() {
  const { user } = useAuth()
  const [concept, setConcept] = useState("")
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SimplificationResult | null>(null)
  const [error, setError] = useState("")

  async function handleSimplify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/concept-simplifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept,
          subject,
          userId: user?.uid,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to simplify concept")
      }
    } catch (err) {
      setError("Failed to simplify concept. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Concept Simplifier</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            AI-powered explanations tailored to your learning style
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimplify} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concept">Concept</Label>
                <Input
                  id="concept"
                  placeholder="e.g., Photosynthesis, Calculus, Gravity"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !concept || !subject}
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Simplifying...
                </>
              ) : (
                "Simplify Concept"
              )}
            </Button>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Tabs defaultValue="explanation" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="keypoints">Key Points</TabsTrigger>
            <TabsTrigger value="analogies">Analogies</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          </TabsList>

          {/* Explanation Tab */}
          <TabsContent value="explanation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Simplified Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.simplifiedText}
                  </p>
                </div>
              </CardContent>
            </Card>

            {result.visualSummary && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Visual Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-accent p-4 rounded-lg overflow-auto text-xs">
                    {result.visualSummary}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Key Points Tab */}
          <TabsContent value="keypoints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-bold text-primary">
                        {index + 1}.
                      </span>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analogies Tab */}
          <TabsContent value="analogies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Analogies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.analogies.length > 0 ? (
                    result.analogies.map((analogy, index) => (
                      <li key={index} className="p-3 bg-accent rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {analogy}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No analogies available
                    </p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards">
            <div className="space-y-4">
              {result.flashcards.length > 0 ? (
                result.flashcards.map((card, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Card {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Question</p>
                        <p className="font-semibold">{card.question}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Answer</p>
                        <p className="text-sm">{card.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No flashcards available
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
