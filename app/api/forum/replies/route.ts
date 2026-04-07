import { NextRequest, NextResponse } from "next/server"
import { createForumReply, getPostReplies } from "@/lib/social-db"

export async function POST(req: NextRequest) {
  try {
    const { postId, classId, userId, userName, content, userAvatar } = await req.json()

    if (!postId || !classId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const replyId = await createForumReply(
      postId,
      classId,
      userId,
      userName,
      content,
      userAvatar
    )

    return NextResponse.json({ id: replyId, message: "Reply created successfully" })
  } catch (error) {
    console.error("POST /api/forum/replies error:", error)
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("postId")

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      )
    }

    const replies = await getPostReplies(postId)

    return NextResponse.json({ replies })
  } catch (error) {
    console.error("GET /api/forum/replies error:", error)
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    )
  }
}
