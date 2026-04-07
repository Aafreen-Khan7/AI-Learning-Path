import { GoogleGenerativeAI, GenerativeAIFetchError } from "@google/generative-ai"

/**
 * Validates if the Gemini API key is properly configured
 * @returns {boolean} true if key exists and is properly formatted
 */
export function validateGeminiKey(): { valid: boolean; error?: string } {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!key) {
    return {
      valid: false,
      error: "GEMINI_API_KEY is not set in environment variables",
    }
  }

  // API keys typically start with AIza
  if (!key.startsWith("AIza")) {
    return {
      valid: false,
      error: "Invalid API key format. Keys should start with 'AIza'",
    }
  }

  // Check minimum key length (Google API keys are typically 39+ chars)
  if (key.length < 30) {
    return {
      valid: false,
      error: "API key appears too short. Please verify it's complete",
    }
  }

  return { valid: true }
}

/**
 * Initialize Gemini AI with proper error handling
 */
export function createGeminiClient() {
  const validation = validateGeminiKey()
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  return new GoogleGenerativeAI(key!)
}

/**
 * Handles Gemini API errors and returns user-friendly messages
 */
export function handleGeminiError(error: unknown): {
  status: number
  message: string
  details: string
  isAuthError: boolean
  isQuotaError: boolean
} {
  const errorMessage = error instanceof Error ? error.message : String(error)

  // 403 Forbidden - Invalid/unregistered API key
  if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
    return {
      status: 403,
      message: "Gemini API key is invalid or not authorized",
      details:
        "The API key may not be registered, enabled, or associated with a Google Cloud project. " +
        "Generate a new key from https://aistudio.google.com/app/apikey",
      isAuthError: true,
      isQuotaError: false,
    }
  }

  // 429 Too Many Requests - Quota exceeded
  if (errorMessage.includes("429") || errorMessage.includes("quota")) {
    return {
      status: 429,
      message: "Gemini API quota exceeded",
      details: "You've hit the usage limit. Wait a few minutes and try again, or enable billing in Google AI Studio.",
      isAuthError: false,
      isQuotaError: true,
    }
  }

  // 401 Unauthorized
  if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
    return {
      status: 401,
      message: "Gemini API authentication failed",
      details: "The API key is invalid. Generate a new one from https://aistudio.google.com/app/apikey",
      isAuthError: true,
      isQuotaError: false,
    }
  }

  // 400 Bad Request
  if (errorMessage.includes("400") || errorMessage.includes("Bad Request")) {
    return {
      status: 400,
      message: "Invalid request to Gemini API",
      details: "The request may be malformed. Check the prompt or parameters.",
      isAuthError: false,
      isQuotaError: false,
    }
  }

  // Network errors
  if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
    return {
      status: 503,
      message: "Could not reach Gemini API",
      details: "Network connection issue. Please check your internet and try again.",
      isAuthError: false,
      isQuotaError: false,
    }
  }

  // Unknown error
  return {
    status: 500,
    message: "Gemini API error",
    details: errorMessage,
    isAuthError: false,
    isQuotaError: false,
  }
}

/**
 * Test Gemini API connectivity
 */
export async function testGeminiConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const genAI = createGeminiClient()
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const result = await model.generateContent("Say 'API is working'")
    const text = result.response.text()

    if (text) {
      return { success: true }
    }

    return { success: false, error: "No response from API" }
  } catch (error) {
    const handled = handleGeminiError(error)
    return { success: false, error: handled.message }
  }
}
