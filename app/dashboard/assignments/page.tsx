"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Calendar,
  Users,
  MoreVertical,
  Clock,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const assignmentsData = [
  {
    id: "1",
    title: "Essay: Climate Change Impact",
    className: "Environmental Science",
    classId: "2",
    dueDate: "2024-04-15",
    totalSubmissions: 25,
    graded: 20,
    maxScore: 100,
    status: "active",
  },
  {
    id: "2",
    title: "Lab Report: Photosynthesis",
    className: "Biology 101",
    classId: "1",
    dueDate: "2024-04-10",
    totalSubmissions: 30,
    graded: 30,
    maxScore: 50,
    status: "completed",
  },
  {
    id: "3",
    title: "Problem Set 5: Integrals",
    className: "Calculus II",
    classId: "3",
    dueDate: "2024-04-18",
    totalSubmissions: 18,
    graded: 5,
    maxScore: 100,
    status: "active",
  },
  {
    id: "4",
    title: "Book Review: 1984",
    className: "English Literature",
    classId: "4",
    dueDate: "2024-04-20",
    totalSubmissions: 15,
    graded: 0,
    maxScore: 100,
    status: "active",
  },
  {
    id: "5",
    title: "Research Paper: World War II",
    className: "History 201",
    classId: "5",
    dueDate: "2024-04-25",
    totalSubmissions: 8,
    graded: 0,
    maxScore: 150,
    status: "draft",
  },
  {
    id: "6",
    title: "Quiz: Periodic Table",
    className: "Chemistry 101",
    classId: "6",
    dueDate: "2024-04-12",
    totalSubmissions: 35,
    graded: 35,
    maxScore: 25,
    status: "completed",
  },
]

const statusConfig = {
  active: { label: "Active", className: "bg-primary/20 text-primary border-primary/30" },
  completed: { label: "Completed", className: "bg-success/20 text-success border-success/30" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
}

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAssignments = assignmentsData.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage assignments with AI-powered grading
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assignments/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            className="pl-10 bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="bg-card border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/assignments/${assignment.id}`}>
                      <h3 className="font-semibold text-lg text-card-foreground hover:text-primary transition-colors">
                        {assignment.title}
                      </h3>
                    </Link>
                    <Badge
                      variant="outline"
                      className={cn(statusConfig[assignment.status as keyof typeof statusConfig].className)}
                    >
                      {statusConfig[assignment.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.className}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/assignments/${assignment.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{assignment.totalSubmissions} submissions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {assignment.graded === assignment.totalSubmissions ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-muted-foreground">
                    {assignment.graded}/{assignment.totalSubmissions} graded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${
                          assignment.totalSubmissions > 0
                            ? (assignment.graded / assignment.totalSubmissions) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/dashboard/submissions?assignmentId=${assignment.id}`}>
                      View Submissions
                    </Link>
                  </Button>
                  {assignment.status === "active" && assignment.graded < assignment.totalSubmissions && (
                    <Button size="sm">
                      Grade with AI
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assignments found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
