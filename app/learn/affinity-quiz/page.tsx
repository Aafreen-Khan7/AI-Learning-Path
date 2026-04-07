"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface Question {
  question: string
  options: string[]
}

export default function AffinityQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    try {
      const response = await fetch("/api/affinity-quiz")
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(optionIndex: number) {
    const newResponses = [...responses]
    newResponses[currentQuestion] = optionIndex
    setResponses(newResponses)
  }

  async function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit quiz
      submitQuiz()
    }
  }

  async function submitQuiz() {
    if (!user) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/affinity-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          responses,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/learn?quiz=completed")
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <div className="text-center py-12 text-muted-foreground">
          Loading quiz...
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <div className="text-center py-12 text-muted-foreground">
          Failed to load quiz
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Learning Style Assessment (VARK)</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="mt-4"
          />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>

            {/* Options */}
            <RadioGroup
              value={responses[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswer(parseInt(value))}
            >
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={responses[currentQuestion] === undefined || submitting}
            >
              {currentQuestion === questions.length - 1
                ? submitting
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
