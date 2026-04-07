import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, doc, setDoc, Timestamp, getDoc } from "firebase/firestore"

// Learning Style Types
export type LearningStyle = "visual" | "auditory" | "kinesthetic" | "reading-writing"

// Affinity Quiz Data
export interface AffinityQuizResponse {
  userId: string
  style: LearningStyle
  stylePercentages: {
    visual: number
    auditory: number
    kinesthetic: number
    readingWriting: number
  }
  completedAt: Timestamp
}

export interface StudyPlan {
  userId: string
  subject: string
  examDate: Timestamp
  daysToExam: number
  difficulty: "beginner" | "intermediate" | "advanced"
  dailyGoal: number // minutes
  topics: StudyTopic[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface StudyTopic {
  id: string
  name: string
  duration: number
  priority: "high" | "medium" | "low"
  status: "not_started" | "in_progress" | "completed"
  suggestedDate?: Timestamp
}

// Affinity Quiz Operations
export async function saveAffinityQuizResult(
  userId: string,
  responses: number[]
): Promise<LearningStyle> {
  try {
    // Calculate style percentages based on responses
    const styleScores = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      readingWriting: 0,
    }

    // Score mapping (this is simplified; real implementation would use proper VARK scoring)
    responses.forEach((response, index) => {
      const styleKeys = Object.keys(styleScores) as (keyof typeof styleScores)[]
      const styleIndex = index % 4
      styleScores[styleKeys[styleIndex]] += response
    })

    // Normalize scores
    const total = Object.values(styleScores).reduce((a, b) => a + b, 0)
    const stylePercentages = {
      visual: Math.round((styleScores.visual / total) * 100),
      auditory: Math.round((styleScores.auditory / total) * 100),
      kinesthetic: Math.round((styleScores.kinesthetic / total) * 100),
      readingWriting: Math.round((styleScores.readingWriting / total) * 100),
    }

    // Determine dominant style
    let dominantStyle: LearningStyle = "visual"
    let maxScore = stylePercentages.visual

    Object.entries(stylePercentages).forEach(([style, score]) => {
      if (score > maxScore) {
        dominantStyle = style as LearningStyle
        maxScore = score
      }
    })

    // Save to Firestore
    await setDoc(doc(db, "affinity_profiles", userId), {
      userId,
      style: dominantStyle,
      stylePercentages,
      completedAt: Timestamp.now(),
    })

    return dominantStyle
  } catch (error) {
    console.error("Error saving affinity quiz result:", error)
    throw error
  }
}

export async function getUserLearningStyle(userId: string): Promise<LearningStyle | null> {
  try {
    const docRef = doc(db, "affinity_profiles", userId)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      return snapshot.data().style || null
    }

    return null
  } catch (error) {
    console.error("Error fetching learning style:", error)
    throw error
  }
}

// Study Plan Operations
export async function createStudyPlan(
  userId: string,
  subject: string,
  examDate: Date,
  difficulty: "beginner" | "intermediate" | "advanced",
  dailyGoal: number,
  topics: string[]
): Promise<string> {
  try {
    // Calculate days to exam
    const now = new Date()
    const daysToExam = Math.ceil(
      (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Create study topics with suggested dates
    const studyTopics: StudyTopic[] = topics.map((topic, index) => ({
      id: `topic_${index}`,
      name: topic,
      duration: Math.ceil((dailyGoal * daysToExam) / topics.length),
      priority: index < Math.ceil(topics.length * 0.3) ? "high" : "medium",
      status: "not_started",
      suggestedDate: new Date(now.getTime() + index * 24 * 60 * 60 * 1000),
    }))

    const planRef = await addDoc(collection(db, "study_plans"), {
      userId,
      subject,
      examDate: Timestamp.fromDate(examDate),
      daysToExam,
      difficulty,
      dailyGoal,
      topics: studyTopics,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return planRef.id
  } catch (error) {
    console.error("Error creating study plan:", error)
    throw error
  }
}

export async function getUserStudyPlans(userId: string): Promise<any[]> {
  try {
    const plansRef = query(
      collection(db, "study_plans"),
      where("userId", "==", userId)
    )

    const snapshot = await getDocs(plansRef)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching study plans:", error)
    throw error
  }
}

// Concept Simplification (using cache to avoid excessive API calls)
export interface SimplifiedConcept {
  id?: string
  userId: string
  concept: string
  subject: string
  simplifiedText: string
  keyPoints: string[]
  analogies: string[]
  visualSummary: string
  flashcards: { question: string; answer: string }[]
  createdAt: Timestamp
}

export async function getCachedSimplification(
  concept: string,
  subject: string
): Promise<SimplifiedConcept | null> {
  try {
    const conceptRef = query(
      collection(db, "simplified_concepts"),
      where("concept", "==", concept),
      where("subject", "==", subject)
    )

    const snapshot = await getDocs(conceptRef)

    if (snapshot.size > 0) {
      return snapshot.docs[0].data() as SimplifiedConcept
    }

    return null
  } catch (error) {
    console.error("Error fetching cached simplification:", error)
    throw error
  }
}

export async function saveSimplifiedConcept(
  concept: SimplifiedConcept
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "simplified_concepts"), {
      ...concept,
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error saving simplified concept:", error)
    throw error
  }
}
