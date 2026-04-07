"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

type ChatMessage = {
  id: number
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
}

const prompts = [
  "Explain recursion simply",
  "Difference between TCP and UDP",
  "What is polymorphism?",
  "How does a hash table work?",
]

export default function SimplifierPage() {
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I am your AI-powered Concept Simplifier chatbot. Ask any topic and I will explain it in short, clear language.",
    },
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(text: string) {
    const question = text.trim()
    if (!question) return

    // Generate unique IDs upfront
    const userId = Date.now()
    const loadingId = userId + 1

    // Add user message and loading message in single update
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: question },
      { id: loadingId, role: "assistant", content: "Generating response...", isLoading: true },
    ])
    setInput("")

    try {
      const response = await fetch("/api/concept-simplifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: question,
          subject: "Computer Science",
          userId: user?.uid || "anonymous",
        }),
      })

      const data = await response.json()

      let answerText = ""
      if (response.ok) {
        answerText = data.simplifiedText || data.info || "Response received"
      } else {
        answerText = `Error: ${data.error || "Failed to get response"}. Check your API key at /learn/gemini-diagnostics`
      }

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: answerText, isLoading: false }
            : msg
        )
      )
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Network error"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: `Error: ${errorMsg}`, isLoading: false }
            : msg
        )
      )
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Card className="h-[72vh] flex flex-col">
        <CardHeader>
          <CardTitle>Concept Simplifier Chatbot</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            {prompts.map((p) => (
              <Badge key={p} variant="secondary" className="cursor-pointer" onClick={() => sendMessage(p)}>
                {p}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto rounded-md border p-3 space-y-3 bg-muted/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <>
                    {m.isLoading ? (
                      <Loader2 className="h-4 w-4 mt-1 text-primary animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 mt-1 text-primary" />
                    )}
                  </>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && <User className="h-4 w-4 mt-1 text-muted-foreground" />}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a concept question..."
            />
            <Button type="submit" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
