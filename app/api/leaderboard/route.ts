import { NextRequest, NextResponse } from "next/server"
import { getClassLeaderboard, getUserRank } from "@/lib/social-db"

export async function GET(req: NextRequest) {
  try {
    const classId = req.nextUrl.searchParams.get("classId")
    const userId = req.nextUrl.searchParams.get("userId")
    const limitParam = req.nextUrl.searchParams.get("limit")

    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 }
      )
    }

    const limit = limitParam ? parseInt(limitParam) : 20
    const leaderboard = await getClassLeaderboard(classId, limit)

    let userRank = 0
    if (userId) {
      userRank = await getUserRank(userId, classId)
    }

    return NextResponse.json({
      leaderboard: leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      })),
      userRank,
    })
  } catch (error) {
    console.error("GET /api/leaderboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
