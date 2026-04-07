"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

type HealthStatus = "loading" | "healthy" | "unconfigured" | "error"

interface HealthResponse {
  status: HealthStatus
  message: string
  getKeyUrl?: string
  steps?: string[]
  troubleshoot?: string[]
  apiKey?: string
  timestamp?: string
}

export default function GeminiDiagnosticsPage() {
  const [status, setStatus] = useState<HealthStatus>("loading")
  const [data, setData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/gemini-health")
      const result = (await response.json()) as HealthResponse
      setData(result)
      setStatus(result.status)
    } catch (error) {
      setData({
        status: "error",
        message: "Failed to connect to health check endpoint",
      })
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusColor = (s: HealthStatus) => {
    switch (s) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "unconfigured":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (s: HealthStatus) => {
    switch (s) {
      case "healthy":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "unconfigured":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(status)}
              Gemini API Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(status)}>
                {status === "loading" ? "Checking..." : status.toUpperCase()}
              </Badge>
              {data?.timestamp && (
                <span className="text-xs text-muted-foreground">
                  Last checked: {new Date(data.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Message */}
            {data?.message && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium">{data.message}</p>
              </div>
            )}

            {/* API Key Status */}
            {data?.apiKey && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm">
                  <span className="font-medium">API Key:</span> {data.apiKey}
                </p>
              </div>
            )}

            {/* Steps to Fix */}
            {data?.steps && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Setup Steps:</h3>
                <ol className="space-y-1">
                  {data.steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Troubleshooting */}
            {data?.troubleshoot && (
              <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-medium text-sm">Troubleshooting:</h3>
                <ul className="space-y-1">
                  {data.troubleshoot.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={checkHealth} disabled={loading} variant="outline">
                {loading ? "Checking..." : "Re-check Status"}
              </Button>
              {data?.getKeyUrl && (
                <Button
                  onClick={() => window.open(data.getKeyUrl, "_blank")}
                  variant="default"
                >
                  Get API Key
                </Button>
              )}
            </div>

            {/* Documentation */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-sm mb-2">Documentation:</h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  • API Key must be from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>• Store it in .env.local as GEMINI_API_KEY (no NEXT_PUBLIC_ prefix)</li>
                <li>• Restart dev server after updating .env.local</li>
                <li>• Each API key is unique and cannot be reused</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
