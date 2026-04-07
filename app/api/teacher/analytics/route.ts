import { NextRequest, NextResponse } from "next/server"
import { getClassAnalytics } from "@/lib/teacher-db"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const teacherId = searchParams.get("teacherId")
    const classId = searchParams.get("classId")

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "teacherId and classId are required" },
        { status: 400 }
      )
    }

    const analytics = await getClassAnalytics(teacherId, classId)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("GET /api/teacher/analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
