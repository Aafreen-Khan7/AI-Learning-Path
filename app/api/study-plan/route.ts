import { NextRequest, NextResponse } from "next/server"
import { createStudyPlan, getUserStudyPlans } from "@/lib/enhanced-features-db"

export async function POST(req: NextRequest) {
  try {
    const { userId, subject, examDate, difficulty, dailyGoal, topics } = await req.json()

    if (!userId || !subject || !examDate || !difficulty || !dailyGoal || !topics) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const planId = await createStudyPlan(
      userId,
      subject,
      new Date(examDate),
      difficulty,
      dailyGoal,
      topics
    )

    return NextResponse.json({
      id: planId,
      message: "Study plan created successfully"
    })
  } catch (error) {
    console.error("POST /api/study-plan error:", error)
    return NextResponse.json(
      { error: "Failed to create study plan" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const plans = await getUserStudyPlans(userId)

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("GET /api/study-plan error:", error)
    return NextResponse.json(
      { error: "Failed to fetch study plans" },
      { status: 500 }
    )
  }
}
