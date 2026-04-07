"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  Mail,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileText,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RubricScore {
  id: string
  name: string
  maxScore: number
  score: number
  feedback: string
}

const submissionData = {
  id: "1",
  studentName: "Alex Johnson",
  studentInitials: "AJ",
  studentEmail: "alex.j@school.edu",
  assignmentTitle: "Essay: Climate Change Impact",
  className: "Environmental Science",
  submittedAt: "2024-04-10T14:30:00",
  content: `Climate change represents one of the most pressing challenges facing our planet today. The evidence for anthropogenic climate change is overwhelming, supported by decades of scientific research and observation.

The primary driver of modern climate change is the increase in greenhouse gas emissions, particularly carbon dioxide and methane, resulting from human activities such as burning fossil fuels, deforestation, and industrial processes. Since the Industrial Revolution, atmospheric CO2 levels have risen from approximately 280 parts per million to over 420 parts per million today.

The impacts of climate change are already being felt worldwide. Rising global temperatures have led to more frequent and intense heatwaves, altered precipitation patterns, and accelerated melting of polar ice caps and glaciers. Sea levels are rising, threatening coastal communities and island nations. Ecosystems are being disrupted, with many species facing extinction as their habitats change faster than they can adapt.

Addressing climate change requires urgent action on multiple fronts. Transitioning to renewable energy sources, improving energy efficiency, and protecting and restoring forests are essential steps. International cooperation, such as the Paris Agreement, provides a framework for collective action, but more ambitious commitments are needed to limit warming to 1.5°C above pre-industrial levels.

In conclusion, climate change poses existential risks to human civilization and the natural world. While the challenges are immense, solutions exist and can be implemented with sufficient political will and public support. The time to act is now.`,
}

const initialRubricScores: RubricScore[] = [
  {
    id: "1",
    name: "Content Quality",
    maxScore: 30,
    score: 28,
    feedback: "Excellent coverage of climate change causes and effects. Well-researched with accurate data.",
  },
  {
    id: "2",
    name: "Organization",
    maxScore: 25,
    score: 24,
    feedback: "Clear structure with logical flow from introduction to conclusion. Smooth transitions between paragraphs.",
  },
  {
    id: "3",
    name: "Evidence & Support",
    maxScore: 25,
    score: 22,
    feedback: "Good use of scientific data and examples. Could include more specific citations.",
  },
  {
    id: "4",
    name: "Writing Quality",
    maxScore: 20,
    score: 18,
    feedback: "Well-written with minor grammatical issues. Clear and professional tone throughout.",
  },
]

export default function SubmissionDetailPage() {
  const [rubricScores, setRubricScores] = useState(initialRubricScores)
  const [overallFeedback, setOverallFeedback] = useState(
    "This is an excellent essay that demonstrates a strong understanding of climate change and its global implications. The writing is clear and well-organized, presenting a compelling argument supported by scientific evidence. Consider adding more specific citations to strengthen the academic rigor of your work. Overall, great job!"
  )

  const totalScore = rubricScores.reduce((sum, r) => sum + r.score, 0)
  const maxTotalScore = rubricScores.reduce((sum, r) => sum + r.maxScore, 0)
  const percentage = Math.round((totalScore / maxTotalScore) * 100)

  const updateScore = (id: string, score: number) => {
    setRubricScores((prev) =>
      prev.map((r) => (r.id === id ? { ...r, score } : r))
    )
  }

  const updateFeedback = (id: string, feedback: string) => {
    setRubricScores((prev) =>
      prev.map((r) => (r.id === id ? { ...r, feedback } : r))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/submissions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submission Review</h1>
            <p className="text-muted-foreground">{submissionData.assignmentTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Student
          </Button>
          <Button>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Finalize Grade
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {submissionData.studentInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-card-foreground">
                    {submissionData.studentName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {submissionData.studentEmail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-success/20 text-success border-success/30">
                  Graded
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted {new Date(submissionData.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content">
                <TabsList className="bg-secondary mb-4">
                  <TabsTrigger value="content">
                    <FileText className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="ai-analysis">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-card-foreground leading-relaxed">
                      {submissionData.content}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ai-analysis">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <p className="font-medium text-card-foreground">AI Analysis Summary</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This essay demonstrates strong analytical skills and a comprehensive understanding of climate change. The argument is well-structured and supported by relevant evidence. The AI grading system has high confidence (95%) in the assessment.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-card-foreground">Key Strengths</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <ThumbsUp className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          Clear thesis statement and logical argument structure
                        </li>
                        <li className="flex items-start gap-2">
                          <ThumbsUp className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          Effective use of scientific data to support claims
                        </li>
                        <li className="flex items-start gap-2">
                          <ThumbsUp className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          Strong conclusion with call to action
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-card-foreground">Areas for Improvement</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <ThumbsDown className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                          Add in-text citations for statistical claims
                        </li>
                        <li className="flex items-start gap-2">
                          <ThumbsDown className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                          Include counterarguments for a more balanced perspective
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grade</CardTitle>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-grade with AI
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-card-foreground">{totalScore}</p>
                <p className="text-muted-foreground">out of {maxTotalScore} points</p>
                <Badge
                  className={cn(
                    "mt-2",
                    percentage >= 90
                      ? "bg-success/20 text-success"
                      : percentage >= 70
                      ? "bg-primary/20 text-primary"
                      : "bg-warning/20 text-warning"
                  )}
                >
                  {percentage}%
                </Badge>
              </div>

              <div className="space-y-6">
                {rubricScores.map((criterion) => (
                  <div key={criterion.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-card-foreground text-sm">
                        {criterion.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {criterion.score}/{criterion.maxScore}
                      </p>
                    </div>
                    <Slider
                      value={[criterion.score]}
                      max={criterion.maxScore}
                      step={1}
                      onValueChange={([value]) => updateScore(criterion.id, value)}
                      className="py-2"
                    />
                    <Textarea
                      value={criterion.feedback}
                      onChange={(e) => updateFeedback(criterion.id, e.target.value)}
                      placeholder="Add feedback..."
                      className="bg-secondary border-border text-sm min-h-16"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                placeholder="Add overall feedback for the student..."
                className="bg-secondary border-border min-h-32"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
