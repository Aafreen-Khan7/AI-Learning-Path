import { NextRequest, NextResponse } from "next/server"
import {
  getCachedSimplification,
  saveSimplifiedConcept,
  SimplifiedConcept,
} from "@/lib/enhanced-features-db"
import { createGeminiClient, handleGeminiError, validateGeminiKey } from "@/lib/gemini-utils"

export async function POST(req: NextRequest) {
  try {
    const { concept, subject, userId } = await req.json()

    if (!concept || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate API key before making request
    const keyValidation = validateGeminiKey()
    if (!keyValidation.valid) {
      console.error("Gemini API Key validation failed:", keyValidation.error)
      return NextResponse.json(
        {
          error: "Gemini API is not properly configured",
          details: keyValidation.error,
          hint: "Please check your GEMINI_API_KEY in environment variables. Get a new key from https://aistudio.google.com/app/apikey",
        },
        { status: 503 }
      )
    }

    // Check cache first to avoid excessive API calls
    const cached = await getCachedSimplification(concept, subject)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Create Gemini client and generate content
    const genAI = createGeminiClient()
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `You are an expert educator. Please simplify the following concept in a way that makes it easy to understand:

Subject: ${subject}
Concept: ${concept}

Provide your response in JSON format with the following structure:
{
  "simplifiedText": "A 2-3 paragraph simplified explanation",
  "keyPoints": ["point1", "point2", "point3"],
  "analogies": ["analogy1", "analogy2"],
  "visualSummary": "A text-based visual summary or ASCII art",
  "flashcards": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"}
  ]
}

Keep the explanation simple and engaging.`

    try {
      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Parse JSON from response
      let parsedResponse
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      } catch {
        parsedResponse = {
          simplifiedText: responseText,
          keyPoints: ["See simplified text above"],
          analogies: [],
          visualSummary: "",
          flashcards: [],
        }
      }

      const simplifiedConcept: SimplifiedConcept = {
        userId: userId || "anonymous",
        concept,
        subject,
        simplifiedText: parsedResponse.simplifiedText || responseText,
        keyPoints: parsedResponse.keyPoints || [],
        analogies: parsedResponse.analogies || [],
        visualSummary: parsedResponse.visualSummary || "",
        flashcards: parsedResponse.flashcards || [],
        createdAt: new Date(),
      }

      // Cache the result
      await saveSimplifiedConcept(simplifiedConcept)

      return NextResponse.json(simplifiedConcept)
    } catch (apiError) {
      // Handle specific Gemini API errors
      const handled = handleGeminiError(apiError)
      console.error(`Concept Simplifier API Error (${handled.status}):`, handled.message)

      return NextResponse.json(
        {
          error: handled.message,
          details: handled.details,
          isAuthError: handled.isAuthError,
          isQuotaError: handled.isQuotaError,
        },
        { status: handled.status }
      )
    }
  } catch (error) {
    console.error("Concept Simplifier POST error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      { error: "Failed to process your request", details: message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const concept = req.nextUrl.searchParams.get("concept")
    const subject = req.nextUrl.searchParams.get("subject")

    if (!concept || !subject) {
      return NextResponse.json(
        { error: "concept and subject are required" },
        { status: 400 }
      )
    }

    const cached = await getCachedSimplification(concept, subject)

    if (cached) {
      return NextResponse.json(cached)
    }

    return NextResponse.json(
      { error: "Concept not found in cache" },
      { status: 404 }
    )
  } catch (error) {
    console.error("GET /api/concept-simplifier error:", error)
    return NextResponse.json(
      { error: "Failed to fetch simplification" },
      { status: 500 }
    )
  }
}
