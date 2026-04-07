"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Send,
  Sparkles,
  Lightbulb,
  BookOpen,
  Trash2,
  MessageSquare,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "Explain recursion in simple terms",
  "What is the difference between TCP and UDP?",
  "How does a hash table work?",
  "Explain polymorphism with examples",
  "What is normalization in databases?",
  "How does garbage collection work?",
]

const quickTopics = [
  { label: "Data Structures", icon: BookOpen },
  { label: "Algorithms", icon: Lightbulb },
  { label: "Operating Systems", icon: Brain },
  { label: "Networks", icon: MessageSquare },
]

// Simulated AI responses
const aiResponses: Record<string, string> = {
  recursion: `**Recursion** is when a function calls itself to solve a problem. Think of it like looking into two mirrors facing each other - the reflection keeps going!

**Simple Example:**
Imagine you're in a line of people and want to know your position. You could:
1. Ask the person in front: "What's your position?"
2. They ask the person in front of them
3. This continues until reaching the first person who says "I'm #1"
4. Then each person adds 1 and tells the person behind them

**Code Example:**
\`\`\`python
def factorial(n):
    if n <= 1:  # Base case - stops recursion
        return 1
    return n * factorial(n - 1)  # Recursive call
\`\`\`

**Key Parts:**
- **Base Case**: The condition that stops the recursion
- **Recursive Case**: Where the function calls itself with a smaller problem

**Remember**: Always have a base case, or your function will run forever! 🔄`,

  "tcp udp": `**TCP vs UDP** - Two ways to send data over the internet!

**TCP (Transmission Control Protocol)** 📦
Think of it like sending a registered letter:
- Guarantees delivery - if a packet is lost, it's resent
- Packets arrive in order
- Slower but reliable
- Used for: Web browsing, email, file downloads

**UDP (User Datagram Protocol)** ✉️
Think of it like sending a postcard:
- No guarantee of delivery
- Packets might arrive out of order
- Faster but unreliable
- Used for: Video streaming, online gaming, VoIP

**Comparison Table:**
| Feature | TCP | UDP |
|---------|-----|-----|
| Reliability | High | Low |
| Speed | Slower | Faster |
| Order | Guaranteed | Not guaranteed |
| Connection | Required | Not required |

**When to use which?**
- Need reliability? → TCP
- Need speed? → UDP`,

  "hash table": `**Hash Tables** - The fastest way to find things! 🔍

**What is it?**
A hash table is like a magical filing cabinet where you can find any file instantly, no matter how many files you have.

**How it works:**
1. **Hash Function**: Takes your key (like a name) and converts it to an index number
2. **Storage**: Puts the value at that index in an array
3. **Retrieval**: Uses the same hash function to find where the value is stored

**Example:**
\`\`\`python
# Storing phone numbers
hash("Alice") → 3  # Alice's number goes to index 3
hash("Bob") → 7    # Bob's number goes to index 7

phone_book[3] = "555-1234"  # Alice
phone_book[7] = "555-5678"  # Bob
\`\`\`

**Time Complexity:**
- Insert: O(1) average
- Search: O(1) average
- Delete: O(1) average

**Collision Handling:**
When two keys hash to the same index:
- **Chaining**: Store multiple items at same index using a linked list
- **Open Addressing**: Find the next empty slot

**Real-world uses:**
- Dictionaries in Python
- Caching systems
- Database indexing`,

  polymorphism: `**Polymorphism** - One interface, many forms! 🎭

**Simple Definition:**
Polymorphism means "many forms" - it lets us use the same method name for different types of objects.

**Real-world Analogy:**
Think of a universal remote control. The "play" button works on:
- TV → plays a show
- DVD player → plays a movie
- Music system → plays music

Same button, different behaviors!

**Types of Polymorphism:**

**1. Method Overriding (Runtime)**
\`\`\`python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# Same method, different outputs
animals = [Dog(), Cat()]
for animal in animals:
    print(animal.speak())  # "Woof!" then "Meow!"
\`\`\`

**2. Method Overloading (Compile-time)**
Same method name, different parameters.

**Benefits:**
- Write cleaner, more flexible code
- Add new types without changing existing code
- Enables powerful design patterns`,

  default: `That's a great question! Let me break it down for you.

**Understanding the Concept:**
The topic you're asking about is fundamental to computer science. Here's a simplified explanation:

1. **Core Idea**: Every complex concept can be broken down into smaller, understandable parts

2. **Key Points to Remember**:
   - Start with the basics
   - Build up gradually
   - Practice with examples

3. **Learning Tips**:
   - Draw diagrams to visualize
   - Write small code snippets to test your understanding
   - Teach the concept to someone else

Would you like me to elaborate on any specific aspect? I can also provide:
- More detailed examples
- Code implementations
- Real-world applications
- Practice problems`,
}

function getAIResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes("recursion")) {
    return aiResponses.recursion
  } else if (lowerQuestion.includes("tcp") || lowerQuestion.includes("udp")) {
    return aiResponses["tcp udp"]
  } else if (lowerQuestion.includes("hash")) {
    return aiResponses["hash table"]
  } else if (lowerQuestion.includes("polymorphism")) {
    return aiResponses.polymorphism
  }
  
  return aiResponses.default
}

export default function ConceptSimplifierPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm your AI study companion. Ask me any concept and I'll explain it in simple terms. Try questions like 'What is recursion?' or 'Explain polymorphism'.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: getAIResponse(userMessage.content),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleCopy = (id: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "Chat cleared! Ask me anything about your subjects.",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Concept Simplifier</h1>
          <p className="text-muted-foreground">AI-powered explanations for complex topics</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearChat}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Chat Area */}
        <Card className="flex-1 bg-card border-border flex flex-col min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Brain className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>

                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm"
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none">
                        {message.content.split("\n").map((line, i) => {
                          // Handle code blocks
                          if (line.startsWith("```")) {
                            return null
                          }
                          // Handle bold text
                          const parts = line.split(/\*\*(.*?)\*\*/g)
                          return (
                            <p key={i} className="mb-2 last:mb-0">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold">{part}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </p>
                          )
                        })}
                      </div>
                    </div>

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-muted-foreground"
                          onClick={() => handleCopy(message.id, message.content)}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          {copiedId === message.id ? "Copied" : "Copy"}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm p-4">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any concept..."
                className="bg-secondary border-border"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="w-80 hidden lg:block space-y-6">
          {/* Quick Topics */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <Badge
                    key={topic.label}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleSuggestedQuestion(`Explain ${topic.label} basics`)}
                  >
                    <topic.icon className="h-3 w-3 mr-1" />
                    {topic.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-chart-3" />
                Try Asking
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-sm p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Tips for better answers</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>- Be specific in your questions</li>
                <li>- Ask for examples if needed</li>
                <li>- Request analogies for complex topics</li>
                <li>- Ask follow-up questions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
