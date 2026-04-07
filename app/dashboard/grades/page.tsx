"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, CheckCircle, AlertCircle, DownloadCloud } from "lucide-react"

type StudentGrade = {
  id: string
  studentId: string
  studentName: string
  assignmentId: string
  assignmentTitle: string
  classId: string
  score: number
  maxScore: number
  percentage: number
  submittedDate: string
  gradedDate?: string
  feedback?: string
  status: "pending" | "graded"
}

type ClassInfo = {
  id: string
  name: string
  totalStudents: number
}

// Dummy data
const dummyGrades: StudentGrade[] = [
  {
    id: "sg1",
    studentId: "s1",
    studentName: "Arjun Kumar",
    assignmentId: "a1",
    assignmentTitle: "Array Implementation Challenge",
    classId: "class1",
    score: 92,
    maxScore: 100,
    percentage: 92,
    submittedDate: "2025-12-15",
    gradedDate: "2025-12-16",
    feedback: "Excellent work! Your solution was efficient.",
    status: "graded",
  },
  {
    id: "sg2",
    studentId: "s2",
    studentName: "Priya Singh",
    assignmentId: "a1",
    assignmentTitle: "Array Implementation Challenge",
    classId: "class1",
    score: 88,
    maxScore: 100,
    percentage: 88,
    submittedDate: "2025-12-15",
    gradedDate: "2025-12-16",
    feedback: "Good implementation.",
    status: "graded",
  },
  {
    id: "sg3",
    studentId: "s3",
    studentName: "Rohit Patel",
    assignmentId: "a1",
    assignmentTitle: "Array Implementation Challenge",
    classId: "class1",
    score: 0,
    maxScore: 100,
    percentage: 0,
    submittedDate: "2025-12-15",
    status: "pending",
  },
  {
    id: "sg4",
    studentId: "s1",
    studentName: "Arjun Kumar",
    assignmentId: "a2",
    assignmentTitle: "Linked List Operations",
    classId: "class1",
    score: 85,
    maxScore: 100,
    percentage: 85,
    submittedDate: "2025-12-22",
    status: "pending",
  },
  {
    id: "sg5",
    studentId: "s2",
    studentName: "Priya Singh",
    assignmentId: "a2",
    assignmentTitle: "Linked List Operations",
    classId: "class1",
    score: 0,
    maxScore: 100,
    percentage: 0,
    submittedDate: "2025-12-22",
    status: "pending",
  },
  {
    id: "sg6",
    studentId: "s4",
    studentName: "Neha Sharma",
    assignmentId: "a2",
    assignmentTitle: "Linked List Operations",
    classId: "class1",
    score: 91,
    maxScore: 100,
    percentage: 91,
    submittedDate: "2025-12-22",
    gradedDate: "2025-12-23",
    feedback: "Outstanding work!",
    status: "graded",
  },
]

const dummyClasses: ClassInfo[] = [
  { id: "class1", name: "Data Structures - CSE-2A", totalStudents: 45 },
  { id: "class2", name: "Algorithms - CSE-2B", totalStudents: 42 },
  { id: "class3", name: "Database Management - CSE-3A", totalStudents: 38 },
]

export default function TeacherGradesPage() {
  const [grades, setGrades] = useState<StudentGrade[]>(dummyGrades)
  const [selectedClass, setSelectedClass] = useState<string>(dummyClasses[0].id)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded">("all")
  const [searchStudent, setSearchStudent] = useState("")

  const classGrades = grades.filter((g) => g.classId === selectedClass)
  const filteredGrades = classGrades.filter((g) => {
    const statusMatch = filterStatus === "all" || g.status === filterStatus
    const searchMatch = g.studentName.toLowerCase().includes(searchStudent.toLowerCase())
    return statusMatch && searchMatch
  })

  const pendingCount = classGrades.filter((g) => g.status === "pending").length
  const gradedCount = classGrades.filter((g) => g.status === "graded").length
  const averageScore = classGrades.filter((g) => g.status === "graded").length > 0
    ? Math.round(classGrades.filter((g) => g.status === "graded").reduce((sum, g) => sum + g.percentage, 0) / classGrades.filter((g) => g.status === "graded").length)
    : 0

  const getStatusIcon = (status: string) => {
    return status === "graded" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-orange-600" />
    )
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (percentage >= 80) return "text-blue-600 bg-blue-50 border-blue-200"
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Grade Management</h1>
        <p className="text-muted-foreground">View and manage student grades</p>
      </div>

      {/* Class Selection */}
      <Card>
        <CardContent className="pt-6">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {dummyClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Grades</p>
              <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Graded</p>
              <p className="text-3xl font-bold text-green-600">{gradedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">{averageScore}%</p>
              <p className="text-xs text-muted-foreground">From graded assignments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold">{classGrades.length}</p>
              <p className="text-xs text-muted-foreground">In this class</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search student name..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Assignment</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Submitted</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <p className="font-medium">{grade.studentName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{grade.assignmentTitle}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-muted-foreground">{grade.submittedDate}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {grade.status === "graded" ? (
                          <div className={`inline-block px-3 py-1 rounded-lg border font-bold ${getGradeColor(grade.percentage)}`}>
                            {grade.score}/{grade.maxScore}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not graded</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(grade.status)}
                          <Badge variant={grade.status === "graded" ? "default" : "secondary"}>
                            {grade.status === "graded" ? "Graded" : "Pending"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit2 className="w-3 h-3" /> Grade
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback Section */}
      {filteredGrades.filter((g) => g.status === "graded" && g.feedback).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredGrades
              .filter((g) => g.status === "graded" && g.feedback)
              .slice(0, 5)
              .map((grade) => (
                <div key={grade.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{grade.studentName}</p>
                      <p className="text-sm text-muted-foreground">{grade.assignmentTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getGradeColor(grade.percentage)}`}>
                        {grade.score}/{grade.maxScore}
                      </p>
                      <p className="text-xs text-muted-foreground">Graded: {grade.gradedDate}</p>
                    </div>
                  </div>
                  {grade.feedback && (
                    <p className="text-sm text-blue-900 bg-blue-100 rounded p-2 mt-2">
                      <strong>Your Feedback:</strong> {grade.feedback}
                    </p>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <DownloadCloud className="w-4 h-4" />
          Export Grades
        </Button>
      </div>
    </div>
  )
}
