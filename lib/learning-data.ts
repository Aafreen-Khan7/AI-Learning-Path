import { Timestamp } from "firebase/firestore"

export type LearningStatus = "not-started" | "in-progress" | "completed"

export interface SubjectModuleOutline {
  id: string
  title: string
  theory: string
  keyPoints: string[]
  estimatedMinutes: number
}

export interface LearningPathRecord {
  id: string
  subjectId: string
  subjectName: string
  description: string
  overallProgress: number
  completedTopics: number
  totalTopics: number
  duration: string
  status: LearningStatus
  updatedAt?: Date
}

export interface TopicRecord {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  orderIndex: number
  contentMarkdown: string
  resources: Array<{ type: string; title: string; url: string; source?: string }>
  quizQuestions: Array<{ question: string; options: string[]; correctIndex: number; explanation?: string }>
}

export function asDate(value: unknown): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.valueOf()) ? undefined : parsed
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    const seconds = Number((value as { seconds: number }).seconds)
    if (Number.isFinite(seconds)) return new Date(seconds * 1000)
  }
  return undefined
}

export function formatRelativeDue(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (diffHours < 1 && diffHours > -1) return "Soon"
  if (diffHours > 0 && diffHours < 24) return `${diffHours} hours`

  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays > 1) return `${diffDays} days`
  return "Overdue"
}

export function statusFromProgress(progress: number): LearningStatus {
  if (progress >= 100) return "completed"
  if (progress > 0) return "in-progress"
  return "not-started"
}

export function minutesToLabel(minutes: number): string {
  if (!minutes || minutes <= 0) return "-"
  if (minutes < 60) return `${minutes} min`
  const hours = (minutes / 60).toFixed(minutes % 60 === 0 ? 0 : 1)
  return `${hours} hr`
}

function buildOutline(
  subjectName: string,
  modules: Array<{ title: string; theory: string; keyPoints: string[]; estimatedMinutes: number }>
): SubjectModuleOutline[] {
  return modules.slice(0, 6).map((module, index) => ({
    id: `${subjectName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-module-${index + 1}`,
    title: module.title,
    theory: module.theory,
    keyPoints: module.keyPoints,
    estimatedMinutes: module.estimatedMinutes,
  }))
}

export function buildSubjectModules(subjectName: string): SubjectModuleOutline[] {
  const normalized = subjectName.toLowerCase()

  if (/math|stat|algorithm|data structures|programming|database|network|operating|machine learning|web|software|computer/.test(normalized)) {
    return buildOutline(subjectName, [
      {
        title: "Foundations and notation",
        theory:
          "Start with the language of the subject: core symbols, definitions, assumptions, and the rules that keep later concepts consistent. This module builds the vocabulary you need before solving problems or reading advanced material.",
        keyPoints: ["Core definitions", "Notation and symbols", "Common assumptions"],
        estimatedMinutes: 25,
      },
      {
        title: "Core structures and models",
        theory:
          "This module explains the main structures, patterns, or abstractions that organize the subject. The goal is to understand how the pieces fit together before applying them in real situations.",
        keyPoints: ["Primary structures", "How parts interact", "Why the model matters"],
        estimatedMinutes: 30,
      },
      {
        title: "Methods and workflows",
        theory:
          "Here you study the step-by-step methods used to solve standard tasks. Each workflow should make the subject feel procedural rather than abstract, so you can repeat the process confidently.",
        keyPoints: ["Standard procedures", "Stepwise reasoning", "Worked examples"],
        estimatedMinutes: 35,
      },
      {
        title: "Applications and case studies",
        theory:
          "This module shows where the ideas are used in practice. Connecting theory to applications helps you remember the material and recognize when a concept is the right tool for the job.",
        keyPoints: ["Real-world use", "Scenario mapping", "Choosing the right method"],
        estimatedMinutes: 30,
      },
      {
        title: "Revision and quiz practice",
        theory:
          "Finish with a focused revision pass that ties together the definitions, methods, and applications. This final module prepares you for the quiz and confirms that you can recall and apply the material under time pressure.",
        keyPoints: ["Quick revision", "Self-check questions", "Quiz readiness"],
        estimatedMinutes: 20,
      },
    ])
  }

  if (/physics|chemistry|biology|engineering|mechanics|thermodynamics|electronics|signal|control|fluid/.test(normalized)) {
    return buildOutline(subjectName, [
      {
        title: "Conceptual fundamentals",
        theory:
          "Begin with the physical meaning of the subject, the variables involved, and the rules that describe how the system behaves. This makes the later formulas easier to interpret instead of memorizing them blindly.",
        keyPoints: ["Core concepts", "Variables and units", "System behavior"],
        estimatedMinutes: 25,
      },
      {
        title: "Laws, principles, and formulas",
        theory:
          "This module focuses on the governing principles and equations. You should understand what each law says, when it applies, and which assumptions are built into the derivation.",
        keyPoints: ["Key laws", "Assumptions", "Derivation logic"],
        estimatedMinutes: 35,
      },
      {
        title: "Problem-solving methods",
        theory:
          "Work through the standard problem-solving sequence: identify the knowns, choose the right relation, substitute carefully, and verify the answer with units or physical reasoning.",
        keyPoints: ["Knowns and unknowns", "Equation selection", "Dimensional checks"],
        estimatedMinutes: 35,
      },
      {
        title: "Systems, experiments, and applications",
        theory:
          "Apply the theory to systems, experiments, or devices so the subject becomes practical. This is where you connect the abstract material to measurements, observations, or engineering designs.",
        keyPoints: ["Experimental intuition", "System analysis", "Practical examples"],
        estimatedMinutes: 30,
      },
      {
        title: "Revision and quiz practice",
        theory:
          "Conclude with a compact review of formulas, diagrams, and common misconceptions. This final pass is designed to lock in memory and prepare you for the quiz at the end of the module path.",
        keyPoints: ["Formula review", "Common mistakes", "Quiz preparation"],
        estimatedMinutes: 20,
      },
    ])
  }

  if (/business|economics|accounting|management|commerce/.test(normalized)) {
    return buildOutline(subjectName, [
      {
        title: "Core terminology and context",
        theory:
          "Start with the language of the subject and the environment it operates in. Clear definitions and the surrounding context make later strategy or analysis easier to understand.",
        keyPoints: ["Terminology", "Context", "Big-picture goals"],
        estimatedMinutes: 20,
      },
      {
        title: "Frameworks and structures",
        theory:
          "This module explains the main frameworks that organize decision-making, analysis, or record-keeping. You learn how the subject is structured and which part is responsible for which outcome.",
        keyPoints: ["Frameworks", "Roles and structure", "Decision flow"],
        estimatedMinutes: 30,
      },
      {
        title: "Methods and analysis",
        theory:
          "Here you practice the methods used to analyze situations, compare options, and reach clear conclusions. The emphasis is on reasoning, consistency, and knowing which method fits which problem.",
        keyPoints: ["Analysis steps", "Comparisons", "Practical reasoning"],
        estimatedMinutes: 30,
      },
      {
        title: "Case studies and applications",
        theory:
          "Apply the subject to case studies and everyday scenarios. Seeing the ideas in use makes them stick and helps you explain why a particular approach works in context.",
        keyPoints: ["Scenario practice", "Real examples", "Interpretation"],
        estimatedMinutes: 30,
      },
      {
        title: "Revision and quiz practice",
        theory:
          "Finish by reviewing the key concepts and checking your ability to use them quickly. The final quiz should feel like a short audit of understanding rather than a surprise.",
        keyPoints: ["Quick recap", "Memory checks", "Quiz readiness"],
        estimatedMinutes: 20,
      },
    ])
  }

  return buildOutline(subjectName, [
    {
      title: "Subject foundation",
      theory:
        "Start by learning the core definitions, scope, and purpose of the subject. This gives the rest of the module path a stable base.",
      keyPoints: ["Definitions", "Scope", "Purpose"],
      estimatedMinutes: 20,
    },
    {
      title: "Main concepts",
      theory:
        "This module explains the main ideas that appear repeatedly throughout the subject. Understanding them early reduces confusion later.",
      keyPoints: ["Main ideas", "Relationships", "Patterns"],
      estimatedMinutes: 30,
    },
    {
      title: "Methods and examples",
      theory:
        "Learn the standard methods used to solve problems or interpret the subject in practice. Examples make the material concrete and easier to retain.",
      keyPoints: ["Methods", "Examples", "Practice"],
      estimatedMinutes: 30,
    },
    {
      title: "Application layer",
      theory:
        "Connect the theory to realistic situations so you can see how the subject is used outside the classroom or textbook.",
      keyPoints: ["Use cases", "Scenarios", "Application"],
      estimatedMinutes: 25,
    },
    {
      title: "Revision and quiz practice",
      theory:
        "Wrap up with revision, quick recall, and a quiz that checks whether the essential ideas have stuck.",
      keyPoints: ["Revision", "Recall", "Quiz"],
      estimatedMinutes: 20,
    },
  ])
}
