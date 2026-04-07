import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentSubmissions } from "@/components/dashboard/recent-submissions"
import { GradeDistributionChart } from "@/components/dashboard/grade-distribution-chart"
import { PerformanceTrendChart } from "@/components/dashboard/performance-trend-chart"
import { Users, FileText, ClipboardCheck, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your grading activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Classes"
          value={6}
          description="Active this semester"
          icon={Users}
        />
        <StatsCard
          title="Assignments"
          value={24}
          change="+3 this week"
          changeType="positive"
          icon={FileText}
        />
        <StatsCard
          title="Pending Reviews"
          value={18}
          change="12 graded today"
          changeType="neutral"
          icon={ClipboardCheck}
        />
        <StatsCard
          title="Average Score"
          value="82%"
          change="+5% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GradeDistributionChart />
        <PerformanceTrendChart />
      </div>

      <RecentSubmissions />
    </div>
  )
}
