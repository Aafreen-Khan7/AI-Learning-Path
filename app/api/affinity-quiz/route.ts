import { NextRequest, NextResponse } from "next/server"
import { saveAffinityQuizResult, getUserLearningStyle } from "@/lib/enhanced-features-db"

// VARK Affinity Quiz Questions
const AFFINITY_QUESTIONS = [
  { question: "When learning something new, I prefer:", options: ["Visual diagrams (visual)", "Listening to explanations (auditory)", "Hands-on practice (kinesthetic)", "Reading detailed notes (reading-writing)"] },
  { question: "I remember things best by:", options: ["Seeing them (visual)", "Hearing them (auditory)", "Doing them (kinesthetic)", "Writing about them (reading-writing)"] },
  { question: "When giving directions, I usually:", options: ["Draw a map or diagram (visual)", "Explain verbally (auditory)", "Point and gesture (kinesthetic)", "Write the directions (reading-writing)"] },
  { question: "I learn best in:", options: ["Well-organized visual materials (visual)", "Discussions and lectures (auditory)", "Laboratories or outdoor settings (kinesthetic)", "Books and written resources (reading-writing)"] },
  { question: "I prefer to study:", options: ["Using videos and infographics (visual)", "Through group discussions (auditory)", "With experiments or simulations (kinesthetic)", "From textbooks and notes (reading-writing)"] },
]

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ questions: AFFINITY_QUESTIONS })
  } catch (error) {
    console.error("GET /api/affinity-quiz error:", error)
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, responses } = await req.json()

    if (!userId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const learningStyle = await saveAffinityQuizResult(userId, responses)

    return NextResponse.json({
      style: learningStyle,
      message: "Quiz completed successfully"
    })
  } catch (error) {
    console.error("POST /api/affinity-quiz error:", error)
    return NextResponse.json(
      { error: "Failed to save quiz results" },
      { status: 500 }
    )
  }
}
