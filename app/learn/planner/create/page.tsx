"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "History", "Geography", "English"
]

export default function CreateStudyPlanPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState<string[]>([""])
  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced",
    dailyGoal: 60, // minutes
  })

  function addTopic() {
    setTopics([...topics, ""])
  }

  function removeTopic(index: number) {
    setTopics(topics.filter((_, i) => i !== index))
  }

  function updateTopic(index: number, value: string) {
    const newTopics = [...topics]
    newTopics[index] = value
    setTopics(newTopics)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) return

    const validTopics = topics.filter(t => t.trim() !== "")
    if (!formData.subject || !formData.examDate || validTopics.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          subject: formData.subject,
          examDate: formData.examDate,
          difficulty: formData.difficulty,
          dailyGoal: formData.dailyGoal,
          topics: validTopics,
        }),
      })

      if (response.ok) {
        router.push("/learn/planner")
      }
    } catch (error) {
      console.error("Error creating study plan:", error)
      alert("Failed to create study plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Exam Study Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exam Date */}
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date *</Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examDate}
                onChange={(e) =>
                  setFormData({ ...formData, examDate: e.target.value })
                }
                required
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    difficulty: value as "beginner" | "intermediate" | "advanced",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Daily Goal */}
            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Daily Study Goal (minutes)</Label>
              <Input
                id="dailyGoal"
                type="number"
                min="30"
                max="480"
                value={formData.dailyGoal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyGoal: parseInt(e.target.value),
                  })
                }
              />
            </div>

            {/* Topics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Topics to Study *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTopic}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </Button>
              </div>

              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Topic ${index + 1}`}
                      value={topic}
                      onChange={(e) => updateTopic(index, e.target.value)}
                    />
                    {topics.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTopic(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Study Plan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
