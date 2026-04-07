import { NextRequest, NextResponse } from "next/server"
import { createForumPost, getClassForumPosts } from "@/lib/social-db"

export async function POST(req: NextRequest) {
  try {
    const { classId, userId, userName, title, content, userAvatar } = await req.json()

    if (!classId || !userId || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const postId = await createForumPost(
      classId,
      userId,
      userName,
      title,
      content,
      userAvatar
    )

    return NextResponse.json({ id: postId, message: "Post created successfully" })
  } catch (error) {
    console.error("POST /api/forum/posts error:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const classId = req.nextUrl.searchParams.get("classId")
    const limitParam = req.nextUrl.searchParams.get("limit")

    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 }
      )
    }

    const limit = limitParam ? parseInt(limitParam) : 20
    const posts = await getClassForumPosts(classId, limit)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("GET /api/forum/posts error:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
