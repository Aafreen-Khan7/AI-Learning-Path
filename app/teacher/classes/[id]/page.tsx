"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, BookOpen, Award, TrendingUp } from "lucide-react"
import { TeacherClass } from "@/lib/teacher-db"

interface ClassAnalytics {
  totalStudents: number
  avgScore: number
  completionRate: number
  scoreSlabs: {
    excellent: number
    good: number
    average: number
    needsImprovement: number
  }
  totalAssignments: number
}

export default function ClassDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { user } = useAuth()
  const [classData, setClassData] = useState<TeacherClass | null>(null)
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const classId = params.id

  useEffect(() => {
    if (!user) return
    fetchClassData()
  }, [user, classId])

  async function fetchClassData() {
    try {
      const response = await fetch(
        `/api/teacher/analytics?teacherId=${user?.uid}&classId=${classId}`
      )
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading class data...
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12 text-muted-foreground">
          Failed to load class data
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Class Dashboard</h1>
        <p className="text-muted-foreground">Monitor class performance and manage students</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.avgScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalAssignments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Excellent (80-100)</span>
                  <span className="text-sm">{analytics.scoreSlabs.excellent}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.max(
                        (analytics.scoreSlabs.excellent / analytics.totalStudents) * 100,
                        5
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Good (60-79)</span>
                  <span className="text-sm">{analytics.scoreSlabs.good}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.max(
                        (analytics.scoreSlabs.good / analytics.totalStudents) * 100,
                        5
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Average (40-59)</span>
                  <span className="text-sm">{analytics.scoreSlabs.average}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${Math.max(
                        (analytics.scoreSlabs.average / analytics.totalStudents) * 100,
                        5
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Needs Improvement (&lt;40)</span>
                  <span className="text-sm">{analytics.scoreSlabs.needsImprovement}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${Math.max(
                        (analytics.scoreSlabs.needsImprovement / analytics.totalStudents) * 100,
                        5
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Students in Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Student management interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Class Assignments</CardTitle>
              <Button>Assign Quiz</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Quiz assignment interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
