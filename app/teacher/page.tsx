"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Users, BookOpen, Settings, Edit } from "lucide-react"
import Link from "next/link"

type Class = {
  id: string
  name: string
  code: string
  students: number
  semester: string
  createdAt: string
}

type Assignment = {
  id: string
  title: string
  classId: string
  dueDate: string
  totalStudents: number
  submitted: number
}

// Dummy classes with assignments
const dummyClasses: Class[] = [
  {
    id: "class-1",
    name: "Data Structures - CSE-2A",
    code: "DSA-2A",
    students: 45,
    semester: "4th Semester",
    createdAt: "2025-09-01",
  },
  {
    id: "class-2",
    name: "Algorithms - CSE-2B",
    code: "ALGO-2B",
    students: 42,
    semester: "4th Semester",
    createdAt: "2025-09-01",
  },
  {
    id: "class-3",
    name: "Database Management - CSE-3A",
    code: "DBMS-3A",
    students: 38,
    semester: "6th Semester",
    createdAt: "2025-08-15",
  },
]

const dummyAssignments: Assignment[] = [
  {
    id: "assign-1",
    title: "Array Implementation Challenge",
    classId: "class-1",
    dueDate: "2025-12-15",
    totalStudents: 45,
    submitted: 38,
  },
  {
    id: "assign-2",
    title: "Linked List Operations",
    classId: "class-1",
    dueDate: "2025-12-22",
    totalStudents: 45,
    submitted: 28,
  },
  {
    id: "assign-3",
    title: "Sorting Algorithm Comparison",
    classId: "class-2",
    dueDate: "2025-12-18",
    totalStudents: 42,
    submitted: 35,
  },
]

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>(dummyClasses)
  const [assignments, setAssignments] = useState<Assignment[]>(dummyAssignments)
  const [showNewClass, setShowNewClass] = useState(false)
  const [newClassName, setNewClassName] = useState("")
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const handleCreateClass = () => {
    if (!newClassName.trim()) return

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: newClassName,
      code: newClassName.substring(0, 3).toUpperCase() + "-" + Math.random().toString(36).substring(7).toUpperCase(),
      students: 0,
      semester: "Current",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setClasses([...classes, newClass])
    setNewClassName("")
    setShowNewClass(false)
  }

  const classAssignments = selectedClass ? assignments.filter((a) => a.classId === selectedClass) : []
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)
  const totalAssignments = assignments.length

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage classes, assignments, and quizzes</p>
        </div>
        <Button onClick={() => setShowNewClass(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Class
        </Button>
      </div>

      {/* Create Class Dialog */}
      {showNewClass && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Class name (e.g., Data Structures - CSE-2A)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateClass}>Create</Button>
                <Button onClick={() => setShowNewClass(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-3xl font-bold">{classes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Assignments</p>
              <p className="text-3xl font-bold">{totalAssignments}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Submission Rate</p>
              <p className="text-3xl font-bold">
                {assignments.length > 0
                  ? Math.round((assignments.reduce((sum, a) => sum + a.submitted / a.totalStudents, 0) / assignments.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            My Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedClass === classItem.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedClass(classItem.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{classItem.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Code: <span className="font-mono">{classItem.code}</span>
                    </p>
                  </div>
                  <Badge variant="outline">{classItem.semester}</Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    👥 {classItem.students} students
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/teacher/classes/${classItem.id}`}>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Edit className="w-3 h-3 mr-1" /> Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignments Section */}
      {selectedClass && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Assignments
              {selectedClass && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({classes.find((c) => c.id === selectedClass)?.name})
                </span>
              )}
            </CardTitle>
            <Link href={`/teacher/classes/${selectedClass}/assignment/new`}>
              <Button size="sm" className="gap-2">
                <Plus className="w-3 h-3" /> New Assignment
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {classAssignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No assignments yet</p>
            ) : (
              <div className="space-y-3">
                {classAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                      <Badge
                        variant={assignment.submitted === assignment.totalStudents ? "default" : "secondary"}
                      >
                        {assignment.submitted}/{assignment.totalStudents} submitted
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <BookOpen className="w-4 h-4" /> Create Quiz
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Users className="w-4 h-4" /> Manage Students
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
