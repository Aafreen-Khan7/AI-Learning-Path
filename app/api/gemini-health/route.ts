import { NextRequest, NextResponse } from "next/server"
import { validateGeminiKey, testGeminiConnection } from "@/lib/gemini-utils"

export async function GET(req: NextRequest) {
  try {
    // Check if key is configured
    const validation = validateGeminiKey()

    if (!validation.valid) {
      return NextResponse.json(
        {
          status: "unconfigured",
          message: validation.error,
          getKeyUrl: "https://aistudio.google.com/app/apikey",
          steps: [
            "1. Go to https://aistudio.google.com/app/apikey",
            "2. Click 'Create API Key' or copy existing key",
            "3. Update GEMINI_API_KEY in .env.local",
            "4. Restart the development server",
            "5. Test again at /api/gemini-health",
          ],
        },
        { status: 503 }
      )
    }

    // Try to connect to Gemini API
    const connection = await testGeminiConnection()

    if (connection.success) {
      return NextResponse.json(
        {
          status: "healthy",
          message: "Gemini API is working correctly",
          apiKey: "***" + (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").slice(-8),
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        status: "error",
        message: connection.error,
        getKeyUrl: "https://aistudio.google.com/app/apikey",
        troubleshoot: [
          "The API key exists but cannot connect to Gemini API",
          "Possible causes:",
          "1. API key is not properly registered in Google Cloud",
          "2. Generative Language API is not enabled",
          "3. API key has restricted access settings",
          "4. Network/firewall blocking the connection",
          "",
          "Solution: Generate a fresh key from https://aistudio.google.com/app/apikey",
        ],
      },
      { status: 503 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        status: "error",
        message,
        error: String(error),
      },
      { status: 500 }
    )
  }
}
