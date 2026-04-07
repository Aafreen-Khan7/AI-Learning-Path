"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Submission {
  id: string
  studentName: string
  studentInitials: string
  assignment: string
  class: string
  status: "pending" | "grading" | "graded"
  score?: number
  submittedAt: string
}

const recentSubmissions: Submission[] = [
  {
    id: "1",
    studentName: "Alex Johnson",
    studentInitials: "AJ",
    assignment: "Essay: Climate Change",
    class: "Environmental Science",
    status: "graded",
    score: 92,
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    studentName: "Maria Garcia",
    studentInitials: "MG",
    assignment: "Lab Report: Photosynthesis",
    class: "Biology 101",
    status: "grading",
    submittedAt: "3 hours ago",
  },
  {
    id: "3",
    studentName: "James Wilson",
    studentInitials: "JW",
    assignment: "Problem Set 5",
    class: "Calculus II",
    status: "pending",
    submittedAt: "4 hours ago",
  },
  {
    id: "4",
    studentName: "Sarah Chen",
    studentInitials: "SC",
    assignment: "Book Review: 1984",
    class: "English Literature",
    status: "graded",
    score: 88,
    submittedAt: "5 hours ago",
  },
  {
    id: "5",
    studentName: "Michael Brown",
    studentInitials: "MB",
    assignment: "Research Paper Draft",
    class: "History 201",
    status: "pending",
    submittedAt: "6 hours ago",
  },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning border-warning/30" },
  grading: { label: "AI Grading", className: "bg-primary/20 text-primary border-primary/30" },
  graded: { label: "Graded", className: "bg-success/20 text-success border-success/30" },
}

export function RecentSubmissions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Recent Submissions
        </CardTitle>
        <a href="/dashboard/submissions" className="text-sm text-primary hover:underline">
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {submission.studentInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-card-foreground">
                    {submission.studentName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {submission.assignment}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={cn(statusConfig[submission.status].className)}
                  >
                    {statusConfig[submission.status].label}
                  </Badge>
                  {submission.score !== undefined && (
                    <p className="text-sm font-semibold text-card-foreground mt-1">
                      {submission.score}/100
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {submission.submittedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
