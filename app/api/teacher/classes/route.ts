import { NextRequest, NextResponse } from "next/server"
import { createClass, getTeacherClasses, updateClass, deleteClass } from "@/lib/teacher-db"

export async function POST(req: NextRequest) {
  try {
    const { teacherId, name, subject, batch, branch, totalStudents } = await req.json()

    if (!teacherId || !name || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const classId = await createClass(teacherId, {
      name,
      subject,
      batch,
      branch,
      totalStudents,
      teacherId,
    })

    return NextResponse.json({ id: classId, message: "Class created successfully" })
  } catch (error) {
    console.error("POST /api/teacher/classes error:", error)
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const teacherId = req.nextUrl.searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json(
        { error: "teacherId is required" },
        { status: 400 }
      )
    }

    const classes = await getTeacherClasses(teacherId)

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("GET /api/teacher/classes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { teacherId, classId, ...updateData } = await req.json()

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "teacherId and classId are required" },
        { status: 400 }
      )
    }

    await updateClass(teacherId, classId, updateData)

    return NextResponse.json({ message: "Class updated successfully" })
  } catch (error) {
    console.error("PUT /api/teacher/classes error:", error)
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { teacherId, classId } = await req.json()

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "teacherId and classId are required" },
        { status: 400 }
      )
    }

    await deleteClass(teacherId, classId)

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/teacher/classes error:", error)
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    )
  }
}
