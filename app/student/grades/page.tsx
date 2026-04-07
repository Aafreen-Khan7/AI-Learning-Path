"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BookOpen, Trophy, BarChart3 } from "lucide-react"

type Grade = {
  id: string
  subject: string
  assignmentTitle: string
  score: number
  maxScore: number
  percentage: number
  submittedDate: string
  feedback?: string
  gradedDate?: string
}

type SubjectStats = {
  subject: string
  averageScore: number
  totalAssignments: number
  completedAssignments: number
  trend: "up" | "down" | "stable"
  lastUpdate: string
}

// Dummy grades data
const dummyGrades: Grade[] = [
  {
    id: "g1",
    subject: "Data Structures",
    assignmentTitle: "Array Implementation Challenge",
    score: 92,
    maxScore: 100,
    percentage: 92,
    submittedDate: "2025-12-15",
    feedback: "Excellent work! Your solution was efficient and well-documented.",
    gradedDate: "2025-12-16",
  },
  {
    id: "g2",
    subject: "Data Structures",
    assignmentTitle: "Linked List Operations",
    score: 88,
    maxScore: 100,
    percentage: 88,
    submittedDate: "2025-12-22",
    feedback: "Good implementation. Consider edge cases in future submissions.",
    gradedDate: "2025-12-23",
  },
  {
    id: "g3",
    subject: "Algorithms",
    assignmentTitle: "Sorting Algorithm Comparison",
    score: 85,
    maxScore: 100,
    percentage: 85,
    submittedDate: "2025-12-18",
    feedback: "Solid analysis. Time complexity explanation could be more detailed.",
    gradedDate: "2025-12-19",
  },
  {
    id: "g4",
    subject: "Algorithms",
    assignmentTitle: "Graph Traversal",
    score: 95,
    maxScore: 100,
    percentage: 95,
    submittedDate: "2025-12-25",
    feedback: "Outstanding! DFS and BFS implementations were perfect.",
    gradedDate: "2025-12-26",
  },
  {
    id: "g5",
    subject: "Database Management",
    assignmentTitle: "SQL Query Optimization",
    score: 78,
    maxScore: 100,
    percentage: 78,
    submittedDate: "2025-12-20",
    feedback: "Good effort. Review indexing strategies for better performance.",
    gradedDate: "2025-12-21",
  },
  {
    id: "g6",
    subject: "Database Management",
    assignmentTitle: "Database Design Project",
    score: 91,
    maxScore: 100,
    percentage: 91,
    submittedDate: "2025-12-28",
    feedback: "Well-structured database. Great normalization!",
    gradedDate: "2025-12-29",
  },
  {
    id: "g7",
    subject: "Web Development",
    assignmentTitle: "React Component Library",
    score: 89,
    maxScore: 100,
    percentage: 89,
    submittedDate: "2025-12-17",
    feedback: "Nice component design. Add more TypeScript types.",
    gradedDate: "2025-12-18",
  },
  {
    id: "g8",
    subject: "Web Development",
    assignmentTitle: "API Integration Project",
    score: 87,
    maxScore: 100,
    percentage: 87,
    submittedDate: "2025-12-24",
    feedback: "Good API handling. Consider error handling improvements.",
    gradedDate: "2025-12-25",
  },
]

const subjectStats: SubjectStats[] = [
  {
    subject: "Data Structures",
    averageScore: 90,
    totalAssignments: 2,
    completedAssignments: 2,
    trend: "up",
    lastUpdate: "2025-12-23",
  },
  {
    subject: "Algorithms",
    averageScore: 90,
    totalAssignments: 2,
    completedAssignments: 2,
    trend: "up",
    lastUpdate: "2025-12-26",
  },
  {
    subject: "Database Management",
    averageScore: 84.5,
    totalAssignments: 2,
    completedAssignments: 2,
    trend: "up",
    lastUpdate: "2025-12-29",
  },
  {
    subject: "Web Development",
    averageScore: 88,
    totalAssignments: 2,
    completedAssignments: 2,
    trend: "stable",
    lastUpdate: "2025-12-25",
  },
]

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 80) return "text-blue-600"
  if (percentage >= 70) return "text-yellow-600"
  return "text-red-600"
}

const getGradeBadgeVariant = (percentage: number): "default" | "secondary" | "destructive" | "outline" => {
  if (percentage >= 90) return "default"
  if (percentage >= 80) return "secondary"
  if (percentage >= 70) return "outline"
  return "destructive"
}

const getGradeLabel = (percentage: number) => {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "B"
  if (percentage >= 70) return "C"
  if (percentage >= 60) return "D"
  return "F"
}

export default function GradesPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([])

  useEffect(() => {
    if (selectedSubject) {
      setFilteredGrades(dummyGrades.filter((g) => g.subject === selectedSubject))
    } else {
      setFilteredGrades(dummyGrades)
    }
  }, [selectedSubject])

  const overallAverage = dummyGrades.length > 0 ? Math.round(dummyGrades.reduce((sum, g) => sum + g.percentage, 0) / dummyGrades.length) : 0

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Grades</h1>
        <p className="text-muted-foreground">Track your academic performance across all subjects</p>
      </div>

      {/* Overall Performance Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Average */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Overall Average</p>
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl font-bold text-blue-600">{overallAverage}%</div>
                <Badge variant="default" className="text-lg py-1">
                  {getGradeLabel(overallAverage)}
                </Badge>
              </div>
            </div>

            {/* Assignments Completed */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Assignments Completed</p>
              <p className="text-4xl font-bold text-green-600">{dummyGrades.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of {dummyGrades.length} total</p>
            </div>

            {/* Subjects */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Subjects Enrolled</p>
              <p className="text-4xl font-bold text-purple-600">{subjectStats.length}</p>
              <p className="text-xs text-muted-foreground mt-1">All subjects active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">Performance by Subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectStats.map((stat) => (
            <Card
              key={stat.subject}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSubject(selectedSubject === stat.subject ? null : stat.subject)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{stat.subject}</h3>
                    {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>

                  <div>
                    <p className={`text-2xl font-bold ${getGradeColor(stat.averageScore)}`}>
                      {stat.averageScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.completedAssignments}/{stat.totalAssignments} assignments
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stat.averageScore >= 90
                          ? "bg-green-600"
                          : stat.averageScore >= 80
                            ? "bg-blue-600"
                            : stat.averageScore >= 70
                              ? "bg-yellow-600"
                              : "bg-red-600"
                      }`}
                      style={{ width: `${stat.averageScore}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-muted-foreground">Updated: {stat.lastUpdate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {selectedSubject ? `${selectedSubject} Assignments` : "All Assignments"}
          </CardTitle>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGrades.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No grades found</p>
            ) : (
              filteredGrades.map((grade) => (
                <div key={grade.id} className="border rounded-lg p-4 hover:bg-accent transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{grade.assignmentTitle}</h4>
                        <Badge variant="outline" className="text-xs">
                          {grade.subject}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Submitted: {grade.submittedDate}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`text-2xl font-bold ${getGradeColor(grade.percentage)}`}>
                          {grade.score}
                        </span>
                        <span className="text-muted-foreground">/ {grade.maxScore}</span>
                        <Badge variant={getGradeBadgeVariant(grade.percentage)} className="text-lg px-3 py-1">
                          {getGradeLabel(grade.percentage)}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold mt-1 text-muted-foreground">{grade.percentage}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${getGradeColor(grade.percentage).replace("text-", "bg-")}`}
                      style={{ width: `${grade.percentage}%` }}
                    ></div>
                  </div>

                  {/* Feedback */}
                  {grade.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                      <p className="font-medium text-blue-900 mb-1">Teacher Feedback:</p>
                      <p className="text-blue-800">{grade.feedback}</p>
                    </div>
                  )}

                  {grade.gradedDate && (
                    <p className="text-xs text-muted-foreground mt-2">Graded: {grade.gradedDate}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "A (90-100%)", count: dummyGrades.filter((g) => g.percentage >= 90).length, color: "bg-green-600" },
              { label: "B (80-89%)", count: dummyGrades.filter((g) => g.percentage >= 80 && g.percentage < 90).length, color: "bg-blue-600" },
              { label: "C (70-79%)", count: dummyGrades.filter((g) => g.percentage >= 70 && g.percentage < 80).length, color: "bg-yellow-600" },
              { label: "D (60-69%)", count: dummyGrades.filter((g) => g.percentage >= 60 && g.percentage < 70).length, color: "bg-orange-600" },
              { label: "F (<60%)", count: dummyGrades.filter((g) => g.percentage < 60).length, color: "bg-red-600" },
            ].map((grade) => (
              <div key={grade.label} className="flex items-center gap-4">
                <div className="w-20">
                  <p className="text-sm font-medium">{grade.label}</p>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 flex items-center">
                  <div className={`${grade.color} h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`} style={{ width: `${(grade.count / dummyGrades.length) * 100}%` }}>
                    {grade.count > 0 && grade.count}
                  </div>
                </div>
                <div className="w-12 text-right">
                  <p className="text-sm font-semibold">{grade.count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
