"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, GripVertical, Sparkles } from "lucide-react"
import Link from "next/link"

interface RubricCriterion {
  id: string
  name: string
  description: string
  maxScore: number
}

const classes = [
  { id: "1", name: "Biology 101", code: "BIO-101" },
  { id: "2", name: "Environmental Science", code: "ENV-201" },
  { id: "3", name: "Calculus II", code: "MATH-202" },
  { id: "4", name: "English Literature", code: "ENG-301" },
  { id: "5", name: "History 201", code: "HIST-201" },
  { id: "6", name: "Chemistry 101", code: "CHEM-101" },
]

export default function NewAssignmentPage() {
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([
    { id: "1", name: "Content Quality", description: "Accuracy and depth of content", maxScore: 30 },
    { id: "2", name: "Organization", description: "Clear structure and logical flow", maxScore: 25 },
    { id: "3", name: "Evidence & Support", description: "Use of relevant examples and citations", maxScore: 25 },
    { id: "4", name: "Writing Quality", description: "Grammar, spelling, and clarity", maxScore: 20 },
  ])
  const [enableAIGrading, setEnableAIGrading] = useState(true)
  const [allowResubmission, setAllowResubmission] = useState(false)

  const addCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: Date.now().toString(),
      name: "",
      description: "",
      maxScore: 10,
    }
    setRubricCriteria([...rubricCriteria, newCriterion])
  }

  const removeCriterion = (id: string) => {
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id))
  }

  const updateCriterion = (id: string, field: keyof RubricCriterion, value: string | number) => {
    setRubricCriteria(
      rubricCriteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const totalScore = rubricCriteria.reduce((sum, c) => sum + c.maxScore, 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/assignments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Assignment</h1>
          <p className="text-muted-foreground">
            Set up a new assignment with AI-powered grading
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the assignment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                placeholder="e.g., Essay: Climate Change Impact"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed instructions for the assignment..."
                className="bg-secondary border-border min-h-32"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type</Label>
                <Select defaultValue="file">
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload (PDF, DOCX)</SelectItem>
                    <SelectItem value="text">Text Entry</SelectItem>
                    <SelectItem value="image">Image Upload</SelectItem>
                    <SelectItem value="any">Any Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grading Rubric</CardTitle>
                <CardDescription>
                  Define criteria for AI-powered grading (Total: {totalScore} points)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addCriterion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rubricCriteria.map((criterion, index) => (
              <div
                key={criterion.id}
                className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="mt-2 cursor-grab text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 md:grid-cols-[1fr_100px]">
                    <Input
                      placeholder="Criterion name"
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, "name", e.target.value)}
                      className="bg-background border-border"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Points"
                        value={criterion.maxScore}
                        onChange={(e) =>
                          updateCriterion(criterion.id, "maxScore", parseInt(e.target.value) || 0)
                        }
                        className="bg-background border-border"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">pts</span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Describe what constitutes excellent, good, and poor performance..."
                    value={criterion.description}
                    onChange={(e) => updateCriterion(criterion.id, "description", e.target.value)}
                    className="bg-background border-border min-h-20"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeCriterion(criterion.id)}
                  disabled={rubricCriteria.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>AI Grading Settings</CardTitle>
            <CardDescription>Configure how AI assists with grading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <Label htmlFor="ai-grading" className="font-medium">
                    Enable AI-Powered Grading
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI will automatically grade submissions based on your rubric
                </p>
              </div>
              <Switch
                id="ai-grading"
                checked={enableAIGrading}
                onCheckedChange={setEnableAIGrading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="resubmission" className="font-medium">
                  Allow Resubmissions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Students can submit improved versions after feedback
                </p>
              </div>
              <Switch
                id="resubmission"
                checked={allowResubmission}
                onCheckedChange={setAllowResubmission}
              />
            </div>
            {enableAIGrading && (
              <div className="space-y-2">
                <Label htmlFor="feedback-style">AI Feedback Style</Label>
                <Select defaultValue="detailed">
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief - Key points only</SelectItem>
                    <SelectItem value="detailed">Detailed - Comprehensive feedback</SelectItem>
                    <SelectItem value="encouraging">Encouraging - Growth-focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/assignments">Cancel</Link>
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary">Save as Draft</Button>
            <Button>Publish Assignment</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
