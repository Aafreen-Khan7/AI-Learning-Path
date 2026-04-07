import { NextRequest, NextResponse } from "next/server"
import natural from "natural"
import { kmeans } from "ml-kmeans"

type TopicAnalytics = {
  id: string
  title: string
  score?: number | null
  status?: "completed" | "in-progress" | "locked"
}

type RecommendationRequest = {
  subjectName: string
  weakTopics?: string[]
  progress?: number
  averageScore?: number
  topics?: TopicAnalytics[]
}

type RecommendationItem = {
  type: "video" | "study-material" | "website"
  title: string
  url: string
  source: string
  reason: string
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "topic",
  "module",
  "learning",
  "path",
  "review",
])

function extractKeywords(input: string): string[] {
  const tokenizer = new natural.WordTokenizer()
  const raw = tokenizer.tokenize(input.toLowerCase())
  return raw.filter((token) => token.length > 2 && !STOPWORDS.has(token))
}

function inferWeakTopics(topics: TopicAnalytics[], weakTopics: string[]): string[] {
  const scoredTopics = topics
    .map((topic) => ({ title: topic.title, score: Number(topic.score ?? 0) }))
    .filter((topic) => Number.isFinite(topic.score))

  if (scoredTopics.length < 3) {
    return weakTopics.slice(0, 5)
  }

  try {
    const data = scoredTopics.map((topic) => [topic.score])
    const result = kmeans(data, 2, { initialization: "kmeans++", maxIterations: 100 })
    const centroidValues = result.centroids.map((centroid) => centroid[0])
    const weakCluster = centroidValues[0] <= centroidValues[1] ? 0 : 1

    const clusteredWeak = scoredTopics
      .filter((_, index) => result.clusters[index] === weakCluster)
      .sort((a, b) => a.score - b.score)
      .map((topic) => topic.title)

    const merged = [...weakTopics, ...clusteredWeak]
    return Array.from(new Set(merged)).slice(0, 5)
  } catch {
    return weakTopics.slice(0, 5)
  }
}

function buildQuery(subjectName: string, weak: string[], topics: TopicAnalytics[]): string {
  const topicTitles = topics.map((topic) => topic.title).slice(0, 4)
  const keywordText = `${subjectName} ${weak.join(" ")} ${topicTitles.join(" ")}`
  const keywords = extractKeywords(keywordText)
  return Array.from(new Set([subjectName, ...keywords])).slice(0, 8).join(" ")
}

async function fetchWikipediaWebsites(queryText: string): Promise<RecommendationItem[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(queryText)}&limit=5&namespace=0&format=json&origin=*`
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) return []

  const payload = (await response.json()) as [string, string[], string[], string[]]
  const titles = payload[1] || []
  const links = payload[3] || []

  return titles.slice(0, 5).map((title, index) => ({
    type: "website" as const,
    title,
    url: links[index] || "https://en.wikipedia.org",
    source: "Wikipedia",
    reason: "Covers core concepts related to your weak areas.",
  }))
}

async function fetchOpenLibraryMaterials(queryText: string): Promise<RecommendationItem[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(queryText)}&limit=6`
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) return []

  const payload = (await response.json()) as {
    docs?: Array<{ title?: string; key?: string; author_name?: string[] }>
  }

  return (payload.docs || []).slice(0, 5).map((doc) => ({
    type: "study-material" as const,
    title: doc.title || "Open Library reference",
    url: doc.key ? `https://openlibrary.org${doc.key}` : "https://openlibrary.org",
    source: "Open Library",
    reason: `Useful reading${doc.author_name?.[0] ? ` by ${doc.author_name[0]}` : ""} for revision and deeper understanding.`,
  }))
}

async function fetchArchiveVideos(queryText: string): Promise<RecommendationItem[]> {
  const archiveQuery = `title:(${queryText}) AND mediatype:(movies)`
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(archiveQuery)}&fl[]=identifier&fl[]=title&rows=6&page=1&output=json`
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) return []

  const payload = (await response.json()) as {
    response?: { docs?: Array<{ identifier?: string; title?: string }> }
  }

  return (payload.response?.docs || []).slice(0, 5).map((doc) => ({
    type: "video" as const,
    title: doc.title || "Educational video",
    url: doc.identifier ? `https://archive.org/details/${doc.identifier}` : "https://archive.org/details/movies",
    source: "Internet Archive",
    reason: "Video format helps reinforce topics where quiz scores are low.",
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RecommendationRequest

    if (!body.subjectName) {
      return NextResponse.json({ error: "subjectName is required" }, { status: 400 })
    }

    const topics = Array.isArray(body.topics) ? body.topics : []
    const weakTopics = Array.isArray(body.weakTopics) ? body.weakTopics.map((topic) => String(topic)) : []
    const inferredWeakTopics = inferWeakTopics(topics, weakTopics)
    const queryText = buildQuery(body.subjectName, inferredWeakTopics, topics)

    const [websites, materials, videos] = await Promise.all([
      fetchWikipediaWebsites(queryText),
      fetchOpenLibraryMaterials(queryText),
      fetchArchiveVideos(queryText),
    ])

    const all = [...videos, ...materials, ...websites]

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      analytics: {
        progress: Number(body.progress ?? 0),
        averageScore: Number(body.averageScore ?? 0),
        weakTopics: inferredWeakTopics,
      },
      recommendations: all.slice(0, 12),
    })
  } catch (error) {
    console.error("Failed to generate recommendations", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
