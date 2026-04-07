import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, CheckCircle2, TrendingUp, Calendar, Upload } from "lucide-react"
import Link from "next/link"

const upcomingAssignments = [
  {
    id: "1",
    title: "Essay: Climate Change Impact",
    className: "Environmental Science",
    dueDate: "2024-04-15",
    daysLeft: 5,
  },
  {
    id: "2",
    title: "Problem Set 6: Derivatives",
    className: "Calculus II",
    dueDate: "2024-04-18",
    daysLeft: 8,
  },
  {
    id: "3",
    title: "Book Report: To Kill a Mockingbird",
    className: "English Literature",
    dueDate: "2024-04-20",
    daysLeft: 10,
  },
]

const recentGrades = [
  {
    id: "1",
    title: "Lab Report: Photosynthesis",
    className: "Biology 101",
    score: 48,
    maxScore: 50,
    percentage: 96,
    gradedAt: "2024-04-08",
  },
  {
    id: "2",
    title: "Quiz: Periodic Table",
    className: "Chemistry 101",
    score: 23,
    maxScore: 25,
    percentage: 92,
    gradedAt: "2024-04-07",
  },
  {
    id: "3",
    title: "Essay: World War II Causes",
    className: "History 201",
    score: 85,
    maxScore: 100,
    percentage: 85,
    gradedAt: "2024-04-05",
  },
]

const classProgress = [
  { name: "Biology 101", average: 92, color: "bg-chart-1" },
  { name: "Environmental Science", average: 88, color: "bg-chart-2" },
  { name: "Calculus II", average: 78, color: "bg-chart-3" },
  { name: "English Literature", average: 85, color: "bg-chart-4" },
]

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your academic progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                <p className="text-3xl font-bold text-card-foreground">3</p>
                <p className="text-sm text-warning">Due this week: 1</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-card-foreground">24</p>
                <p className="text-sm text-success">This semester</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Overall Average</p>
                <p className="text-3xl font-bold text-card-foreground">86%</p>
                <p className="text-sm text-success">+3% this month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Classes Enrolled</p>
                <p className="text-3xl font-bold text-card-foreground">4</p>
                <p className="text-sm text-muted-foreground">Spring 2024</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Upcoming Assignments
            </CardTitle>
            <Link href="/student/assignments" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.className}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      assignment.daysLeft <= 3
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : assignment.daysLeft <= 7
                        ? "bg-warning/20 text-warning border-warning/30"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {assignment.daysLeft} days left
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href={`/student/assignments/${assignment.id}/submit`}>
                      <Upload className="h-4 w-4 mr-1" />
                      Submit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Recent Grades
            </CardTitle>
            <Link href="/student/grades" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentGrades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="font-medium text-card-foreground">{grade.title}</p>
                  <p className="text-sm text-muted-foreground">{grade.className}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    {grade.score}/{grade.maxScore}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      grade.percentage >= 90
                        ? "bg-success/20 text-success border-success/30"
                        : grade.percentage >= 80
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-warning/20 text-warning border-warning/30"
                    }
                  >
                    {grade.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Class Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {classProgress.map((cls) => (
            <div key={cls.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-card-foreground">{cls.name}</p>
                <p className="text-sm text-muted-foreground">{cls.average}%</p>
              </div>
              <Progress value={cls.average} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
