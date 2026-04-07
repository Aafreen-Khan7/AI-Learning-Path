import { NextRequest, NextResponse } from "next/server"
import { awardTokens, getTokenBalance } from "@/lib/social-db"

export async function POST(req: NextRequest) {
  try {
    const { userId, classId, amount, type, description } = await req.json()

    if (!userId || !classId || !amount || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await awardTokens(userId, classId, amount, type, description || "")

    return NextResponse.json({ message: "Tokens awarded successfully" })
  } catch (error) {
    console.error("POST /api/tokens/award error:", error)
    return NextResponse.json(
      { error: "Failed to award tokens" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const classId = req.nextUrl.searchParams.get("classId")

    if (!userId || !classId) {
      return NextResponse.json(
        { error: "userId and classId are required" },
        { status: 400 }
      )
    }

    const balance = await getTokenBalance(userId, classId)

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("GET /api/tokens/balance error:", error)
    return NextResponse.json(
      { error: "Failed to fetch token balance" },
      { status: 500 }
    )
  }
}
