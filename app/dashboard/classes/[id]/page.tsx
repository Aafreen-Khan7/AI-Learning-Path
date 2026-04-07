"use client"

import { use, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Plus,
  Search,
  Users,
  FileText,
  TrendingUp,
  MoreVertical,
  Mail,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const classData = {
  id: "1",
  name: "Biology 101",
  code: "BIO-101",
  description: "Introduction to biological sciences covering cell biology, genetics, and evolution.",
  studentCount: 32,
  assignmentCount: 8,
  averageScore: 78,
}

const students = [
  { id: "1", name: "Alex Johnson", email: "alex.j@school.edu", initials: "AJ", avgScore: 92 },
  { id: "2", name: "Maria Garcia", email: "maria.g@school.edu", initials: "MG", avgScore: 88 },
  { id: "3", name: "James Wilson", email: "james.w@school.edu", initials: "JW", avgScore: 75 },
  { id: "4", name: "Sarah Chen", email: "sarah.c@school.edu", initials: "SC", avgScore: 85 },
  { id: "5", name: "Michael Brown", email: "michael.b@school.edu", initials: "MB", avgScore: 70 },
  { id: "6", name: "Emily Davis", email: "emily.d@school.edu", initials: "ED", avgScore: 95 },
]

const assignments = [
  { id: "1", title: "Lab Report: Cell Structure", dueDate: "2024-03-15", submissions: 30, graded: 28 },
  { id: "2", title: "Essay: Evolution Theory", dueDate: "2024-03-20", submissions: 25, graded: 10 },
  { id: "3", title: "Quiz: Genetics Basics", dueDate: "2024-03-25", submissions: 32, graded: 32 },
  { id: "4", title: "Research Paper: Ecosystems", dueDate: "2024-04-01", submissions: 18, graded: 0 },
]

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/classes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{classData.name}</h1>
            <Badge variant="outline" className="text-muted-foreground">
              {classData.code}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{classData.description}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/assignments/new?classId=${resolvedParams.id}`}>
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{classData.studentCount}</p>
              <p className="text-sm text-muted-foreground">Students Enrolled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{classData.assignmentCount}</p>
              <p className="text-sm text-muted-foreground">Assignments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{classData.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10 bg-secondary border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Students
            </Button>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-card-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">
                          Avg: {student.avgScore}%
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Progress</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove from Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Class Assignments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {assignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    href={`/dashboard/assignments/${assignment.id}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors block"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-card-foreground">
                          {assignment.graded}/{assignment.submissions} graded
                        </p>
                        <div className="w-24 h-2 bg-secondary rounded-full mt-1">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(assignment.graded / assignment.submissions) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
