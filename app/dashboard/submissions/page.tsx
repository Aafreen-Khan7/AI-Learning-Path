"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  Eye,
} from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Submission {
  id: string
  studentName: string
  studentInitials: string
  studentEmail: string
  assignmentTitle: string
  className: string
  submittedAt: string
  status: "pending" | "grading" | "graded" | "needs_review"
  score?: number
  maxScore: number
  aiConfidence?: number
}

const submissionsData: Submission[] = [
  {
    id: "1",
    studentName: "Alex Johnson",
    studentInitials: "AJ",
    studentEmail: "alex.j@school.edu",
    assignmentTitle: "Essay: Climate Change Impact",
    className: "Environmental Science",
    submittedAt: "2024-04-10T14:30:00",
    status: "graded",
    score: 92,
    maxScore: 100,
    aiConfidence: 95,
  },
  {
    id: "2",
    studentName: "Maria Garcia",
    studentInitials: "MG",
    studentEmail: "maria.g@school.edu",
    assignmentTitle: "Lab Report: Photosynthesis",
    className: "Biology 101",
    submittedAt: "2024-04-10T12:15:00",
    status: "grading",
    maxScore: 50,
  },
  {
    id: "3",
    studentName: "James Wilson",
    studentInitials: "JW",
    studentEmail: "james.w@school.edu",
    assignmentTitle: "Problem Set 5: Integrals",
    className: "Calculus II",
    submittedAt: "2024-04-10T10:45:00",
    status: "pending",
    maxScore: 100,
  },
  {
    id: "4",
    studentName: "Sarah Chen",
    studentInitials: "SC",
    studentEmail: "sarah.c@school.edu",
    assignmentTitle: "Essay: Climate Change Impact",
    className: "Environmental Science",
    submittedAt: "2024-04-10T09:20:00",
    status: "needs_review",
    score: 78,
    maxScore: 100,
    aiConfidence: 72,
  },
  {
    id: "5",
    studentName: "Michael Brown",
    studentInitials: "MB",
    studentEmail: "michael.b@school.edu",
    assignmentTitle: "Book Review: 1984",
    className: "English Literature",
    submittedAt: "2024-04-09T16:00:00",
    status: "graded",
    score: 88,
    maxScore: 100,
    aiConfidence: 91,
  },
  {
    id: "6",
    studentName: "Emily Davis",
    studentInitials: "ED",
    studentEmail: "emily.d@school.edu",
    assignmentTitle: "Lab Report: Photosynthesis",
    className: "Biology 101",
    submittedAt: "2024-04-09T15:30:00",
    status: "graded",
    score: 48,
    maxScore: 50,
    aiConfidence: 98,
  },
  {
    id: "7",
    studentName: "David Kim",
    studentInitials: "DK",
    studentEmail: "david.k@school.edu",
    assignmentTitle: "Problem Set 5: Integrals",
    className: "Calculus II",
    submittedAt: "2024-04-09T14:00:00",
    status: "pending",
    maxScore: 100,
  },
  {
    id: "8",
    studentName: "Lisa Wang",
    studentInitials: "LW",
    studentEmail: "lisa.w@school.edu",
    assignmentTitle: "Essay: Climate Change Impact",
    className: "Environmental Science",
    submittedAt: "2024-04-09T11:30:00",
    status: "graded",
    score: 95,
    maxScore: 100,
    aiConfidence: 97,
  },
]

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/20 text-warning border-warning/30",
  },
  grading: {
    label: "AI Grading",
    icon: Sparkles,
    className: "bg-primary/20 text-primary border-primary/30",
  },
  graded: {
    label: "Graded",
    icon: CheckCircle2,
    className: "bg-success/20 text-success border-success/30",
  },
  needs_review: {
    label: "Needs Review",
    icon: AlertCircle,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
}

export default function SubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])

  const filteredSubmissions = submissionsData.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([])
    } else {
      setSelectedSubmissions(filteredSubmissions.map((s) => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const pendingCount = submissionsData.filter((s) => s.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submissions</h1>
          <p className="text-muted-foreground">
            Review and grade student submissions
          </p>
        </div>
        {pendingCount > 0 && (
          <Button>
            <Sparkles className="h-4 w-4 mr-2" />
            Grade All Pending ({pendingCount})
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            className="pl-10 bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 bg-secondary border-border">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="grading">AI Grading</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="needs_review">Needs Review</SelectItem>
          </SelectContent>
        </Select>
        {selectedSubmissions.length > 0 && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Selected ({selectedSubmissions.length})
          </Button>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedSubmissions.length > 0
                  ? `${selectedSubmissions.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {filteredSubmissions.map((submission) => {
              const StatusIcon = statusConfig[submission.status].icon
              return (
                <div
                  key={submission.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedSubmissions.includes(submission.id)}
                    onCheckedChange={() => toggleSelect(submission.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {submission.studentInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-card-foreground truncate">
                        {submission.studentName}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0", statusConfig[submission.status].className)}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[submission.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {submission.assignmentTitle} • {submission.className}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {submission.score !== undefined ? (
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {submission.score}/{submission.maxScore}
                        </p>
                        {submission.aiConfidence && (
                          <p className="text-xs text-muted-foreground">
                            AI confidence: {submission.aiConfidence}%
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not graded</p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground shrink-0 w-24 text-right">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/submissions/${submission.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No submissions found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
