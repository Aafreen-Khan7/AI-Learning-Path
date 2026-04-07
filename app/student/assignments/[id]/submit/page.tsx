"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  File,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const assignmentData = {
  id: "1",
  title: "Essay: Climate Change Impact",
  className: "Environmental Science",
  instructor: "Dr. Jane Doe",
  dueDate: "2024-04-15T23:59:00",
  description: `Write a 1000-1500 word essay analyzing the impacts of climate change on global ecosystems and human societies. Your essay should:

1. Discuss at least three major impacts of climate change
2. Include scientific evidence and data to support your arguments
3. Propose at least two potential solutions
4. Follow APA citation format for any sources used

Submit your essay as a PDF or DOCX file.`,
  rubric: [
    { name: "Content Quality", points: 30 },
    { name: "Organization", points: 25 },
    { name: "Evidence & Support", points: 25 },
    { name: "Writing Quality", points: 20 },
  ],
  maxScore: 100,
  allowedFormats: ["pdf", "docx", "doc"],
}

interface UploadedFile {
  name: string
  size: number
  type: string
}

export default function SubmitAssignmentPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [textContent, setTextContent] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 100)

    const newFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const dueDate = new Date(assignmentData.dueDate)
  const now = new Date()
  const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student/assignments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{assignmentData.title}</h1>
          <p className="text-muted-foreground">{assignmentData.className}</p>
        </div>
        <Badge
          variant="outline"
          className={
            daysLeft <= 1
              ? "bg-destructive/20 text-destructive border-destructive/30"
              : daysLeft <= 3
              ? "bg-warning/20 text-warning border-warning/30"
              : "bg-muted text-muted-foreground"
          }
        >
          <Clock className="h-3 w-3 mr-1" />
          {daysLeft} days left
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{assignmentData.maxScore} points</span>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-card-foreground text-sm leading-relaxed">
                  {assignmentData.description}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Upload Your Submission</CardTitle>
              <CardDescription>
                Accepted formats: PDF, DOCX, DOC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      Drag and drop your files here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="text-card-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        {file.type.includes("pdf") ? (
                          <File className="h-5 w-5 text-destructive" />
                        ) : file.type.includes("image") ? (
                          <ImageIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium text-card-foreground text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-card-foreground">
                  Additional Comments (Optional)
                </p>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Add any comments or notes for your instructor..."
                  className="bg-secondary border-border min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Grading Rubric</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignmentData.rubric.map((criterion) => (
                <div
                  key={criterion.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-card-foreground">{criterion.name}</span>
                  <span className="text-muted-foreground">{criterion.points} pts</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">{assignmentData.maxScore} pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-card-foreground">AI-Powered Grading</p>
                  <p className="text-muted-foreground">
                    Your submission will be graded by AI and reviewed by {assignmentData.instructor}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={uploadedFiles.length === 0}
          >
            <Upload className="h-4 w-4 mr-2" />
            Submit Assignment
          </Button>
        </div>
      </div>
    </div>
  )
}
