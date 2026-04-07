import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createGeminiClient, handleGeminiError, validateGeminiKey } from "@/lib/gemini-utils"

type PathGenerationRequest = {
  subjectName: string
  averageScore?: number
  progress?: number
  weakTopics?: string[]
  topicScores?: number[]
  qualification?: string
  branch?: string
  year?: string
  semester?: string
}

type GeneratedQuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

type RecommendedResource = {
  title: string
  url: string
  type: "video" | "website" | "material"
}

type GeneratedModule = {
  title: string
  theory: string
  keyPoints: string[]
  estimatedMinutes: number
  quizQuestions: GeneratedQuizQuestion[]
  resources: RecommendedResource[]
}

type GenerationProfile = "foundation" | "balanced" | "accelerated"

function determineProfile(payload: PathGenerationRequest): GenerationProfile {
  const averageScore = Number(payload.averageScore ?? 0)
  const progress = Number(payload.progress ?? 0)

  if (averageScore >= 75 && progress >= 50) return "accelerated"
  if (averageScore >= 50) return "balanced"
  return "foundation"
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      const isLastRetry = i === maxRetries - 1
      const errorMsg = error instanceof Error ? error.message : String(error)
      const isNetworkError = errorMsg.includes("fetch") || errorMsg.includes("network") || errorMsg.includes("503")

      if (isNetworkError && !isLastRetry) {
        console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      } else {
        throw error
      }
    }
  }
  throw new Error("Max retries exceeded")
}

// Fallback dummy modules for when API is unavailable
function generateFallbackModules(subject: string, profile: GenerationProfile): GeneratedModule[] {
  const moduleCount = profile === "foundation" ? 6 : profile === "balanced" ? 5 : 4
  const modules: GeneratedModule[] = []

  for (let i = 1; i <= moduleCount; i++) {
    modules.push({
      title: `Module ${i}: ${subject} Fundamentals Part ${i}`,
      theory: `This module covers the fundamental concepts of ${subject}. Students will learn the core principles and foundational knowledge needed to progress in this subject. This is a placeholder module generated when the AI API is temporarily unavailable. Please check your internet connection and try again for personalized content.`,
      keyPoints: [
        `Key concept ${i}.1 related to ${subject}`,
        `Key concept ${i}.2 related to ${subject}`,
        `Key concept ${i}.3 related to ${subject}`,
        `Key concept ${i}.4 related to ${subject}`,
      ],
      estimatedMinutes: 25 + i * 5,
      quizQuestions: [
        {
          question: `What is the primary focus of module ${i}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctIndex: 0,
          explanation: "This is a placeholder question.",
        },
      ],
      resources: [
        { title: `Resource ${i}.1`, url: `https://www.youtube.com/results?search_query=${subject}+tutorial`, type: "video" },
        { title: `Resource ${i}.2`, url: `https://www.wikipedia.org/wiki/${subject}`, type: "website" },
      ],
    })
  }

  return modules
}

async function generateWithGemini(payload: PathGenerationRequest, profile: GenerationProfile, useFallback: boolean = false): Promise<GeneratedModule[]> {
  if (useFallback) {
    console.log("Using fallback modules due to API unavailability")
    return generateFallbackModules(payload.subjectName, profile)
  }
  // Validate API key first
  const keyValidation = validateGeminiKey()
  if (!keyValidation.valid) {
    throw new Error(`API Key Error: ${keyValidation.error}`)
  }

  // Create client with validated key
  const genAI = createGeminiClient()
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
    Generate a personalized learning path for a student studying "${payload.subjectName}".
    
    Student Profile:
    - Qualification: ${payload.qualification || "Not specified"}
    - Branch: ${payload.branch || "Not specified"}
    - Year/Semester: ${payload.year || ""} ${payload.semester || ""}
    - Current Progress: ${payload.progress || 0}%
    - Average Score: ${payload.averageScore || 0}%
    - Weak Topics: ${(payload.weakTopics || []).join(", ") || "None identified"}
    - Target Pace: ${profile} (foundation = detailed, balanced = moderate, accelerated = fast-paced/advanced)

    Requirements:
    1. Generate exactly ${profile === "foundation" ? 6 : profile === "balanced" ? 5 : 4} modules.
    2. Each module must include:
       - title: A concise name for the module.
       - theory: A clear explanation of the core concept (2-3 paragraphs).
       - keyPoints: 3-5 bullet points of essential takeaways.
       - estimatedMinutes: Time to complete (15-45 mins).
       - quizQuestions: 3 multiple-choice questions with 4 options, a correctIndex (0-3), and an explanation.
       - resources: 2-3 recommended resources (YouTube videos, educational websites, or study materials). Provide realistic URLs or search queries as URLs (e.g., https://www.youtube.com/results?search_query=...).

    Format the response as a strict JSON object with a "modules" key containing the array of modules. Do not include markdown formatting or extra text.
  `

  try {
    const result = await retryWithBackoff(async () => {
      const res = await model.generateContent(prompt)
      return res.response
    }, 3, 1000)

    const text = result.text()

    // Clean potential markdown formatting
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(jsonStr)
    return parsed.modules || []
  } catch (error) {
    console.error("Gemini generation failed after retries:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PathGenerationRequest

    if (!body.subjectName?.trim()) {
      return NextResponse.json({ error: "subjectName is required" }, { status: 400 })
    }

    // Validate API key upfront
    const keyValidation = validateGeminiKey()
    if (!keyValidation.valid) {
      console.error("Path Generation API Key validation failed:", keyValidation.error)
      return NextResponse.json(
        {
          error: "Gemini API is not properly configured",
          details: keyValidation.error,
          hint: "Generate a new key from https://aistudio.google.com/app/apikey and update GEMINI_API_KEY in environment variables",
        },
        { status: 503 }
      )
    }

    const profile = determineProfile(body)
    
    let modules: GeneratedModule[]
    let usedFallback = false
    
    try {
      modules = await generateWithGemini(body, profile, false)
    } catch (aiError) {
      const handled = handleGeminiError(aiError)
      console.error(`Path Generation API Error (${handled.status}):`, handled.message)

      // For network errors, use fallback  
      if (handled.isQuotaError === false && handled.isAuthError === false) {
        console.log("Attempting to use fallback modules due to network issue...")
        modules = await generateWithGemini(body, profile, true)
        usedFallback = true
      } else {
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
    }

    return NextResponse.json({
      profile,
      moduleCount: modules.length,
      generatedAt: new Date().toISOString(),
      modules,
      usedFallback,
      fallbackWarning: usedFallback
        ? "Using placeholder modules due to API unavailability. Refresh the page when your connection improves for personalized content."
        : undefined,
      summary: {
        averageScore: Number(body.averageScore ?? 0),
        progress: Number(body.progress ?? 0),
        weakTopics: body.weakTopics || [],
      },
    })
  } catch (error) {
    console.error("Failed to generate personalized path", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to generate personalized path",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
