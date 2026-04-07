import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, getDoc, Timestamp } from "firebase/firestore"

// Types
export interface TeacherClass {
  id?: string
  teacherId: string
  name: string
  subject: string
  batch: string
  branch: string
  classCode: string
  totalStudents: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ClassStudent {
  id?: string
  classId: string
  studentId: string
  email: string
  name: string
  joinedAt: Timestamp
  averageScore?: number
  completedQuizzes?: number
}

export interface ClassAssignment {
  id?: string
  classId: string
  quizId: string
  quizTitle: string
  assignedAt: Timestamp
  dueDate?: Timestamp
  submittedCount?: number
  totalStudents?: number
}

// Class Operations
export async function createClass(
  teacherId: string,
  data: Omit<TeacherClass, "id" | "createdAt" | "updatedAt" | "classCode">
): Promise<string> {
  try {
    // Generate unique class code
    const classCode = generateClassCode()
    
    const classData: TeacherClass = {
      ...data,
      teacherId,
      classCode,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(
      collection(db, "teachers", teacherId, "classes"),
      classData
    )
    
    return docRef.id
  } catch (error) {
    console.error("Error creating class:", error)
    throw error
  }
}

export async function getTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
  try {
    const classesRef = collection(db, "teachers", teacherId, "classes")
    const snapshot = await getDocs(classesRef)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<TeacherClass, "id">
    }))
  } catch (error) {
    console.error("Error fetching classes:", error)
    throw error
  }
}

export async function getClassById(teacherId: string, classId: string): Promise<TeacherClass | null> {
  try {
    const docRef = doc(db, "teachers", teacherId, "classes", classId)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data() as Omit<TeacherClass, "id">
    }
  } catch (error) {
    console.error("Error fetching class:", error)
    throw error
  }
}

export async function updateClass(
  teacherId: string,
  classId: string,
  data: Partial<TeacherClass>
): Promise<void> {
  try {
    const docRef = doc(db, "teachers", teacherId, "classes", classId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error("Error updating class:", error)
    throw error
  }
}

export async function deleteClass(teacherId: string, classId: string): Promise<void> {
  try {
    const docRef = doc(db, "teachers", teacherId, "classes", classId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting class:", error)
    throw error
  }
}

// Student Operations
export async function addStudentToClass(
  teacherId: string,
  classId: string,
  studentId: string,
  studentEmail: string,
  studentName: string
): Promise<string> {
  try {
    const studentRef = await addDoc(
      collection(db, "teachers", teacherId, "classes", classId, "students"),
      {
        studentId,
        email: studentEmail,
        name: studentName,
        joinedAt: Timestamp.now(),
        averageScore: 0,
        completedQuizzes: 0,
      }
    )
    
    return studentRef.id
  } catch (error) {
    console.error("Error adding student:", error)
    throw error
  }
}

export async function getClassStudents(
  teacherId: string,
  classId: string
): Promise<ClassStudent[]> {
  try {
    const studentsRef = collection(
      db,
      "teachers",
      teacherId,
      "classes",
      classId,
      "students"
    )
    const snapshot = await getDocs(studentsRef)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ClassStudent, "id">
    }))
  } catch (error) {
    console.error("Error fetching class students:", error)
    throw error
  }
}

// Quiz Assignment Operations
export async function assignQuizToClass(
  teacherId: string,
  classId: string,
  quizId: string,
  quizTitle: string,
  dueDate?: Date
): Promise<string> {
  try {
    const assignmentRef = await addDoc(
      collection(db, "teachers", teacherId, "classes", classId, "assignments"),
      {
        quizId,
        quizTitle,
        assignedAt: Timestamp.now(),
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
        submittedCount: 0,
      }
    )
    
    return assignmentRef.id
  } catch (error) {
    console.error("Error assigning quiz:", error)
    throw error
  }
}

export async function getClassAssignments(
  teacherId: string,
  classId: string
): Promise<ClassAssignment[]> {
  try {
    const assignmentsRef = collection(
      db,
      "teachers",
      teacherId,
      "classes",
      classId,
      "assignments"
    )
    const snapshot = await getDocs(assignmentsRef)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ClassAssignment, "id">
    }))
  } catch (error) {
    console.error("Error fetching assignments:", error)
    throw error
  }
}

// Helper function to generate class code
function generateClassCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Class Analytics
export async function getClassAnalytics(
  teacherId: string,
  classId: string
): Promise<any> {
  try {
    const students = await getClassStudents(teacherId, classId)
    const assignments = await getClassAssignments(teacherId, classId)
    
    // Calculate metrics
    const avgScore = students.length > 0
      ? students.reduce((acc, s) => acc + (s.averageScore || 0), 0) / students.length
      : 0
    
    const completionRate = students.length > 0
      ? students.filter(s => (s.completedQuizzes || 0) > 0).length / students.length * 100
      : 0
    
    // Score distribution slabs
    const scoreSlabs = {
      excellent: students.filter(s => (s.averageScore || 0) >= 80).length,
      good: students.filter(s => (s.averageScore || 0) >= 60 && (s.averageScore || 0) < 80).length,
      average: students.filter(s => (s.averageScore || 0) >= 40 && (s.averageScore || 0) < 60).length,
      needsImprovement: students.filter(s => (s.averageScore || 0) < 40).length,
    }
    
    return {
      totalStudents: students.length,
      avgScore: Math.round(avgScore),
      completionRate: Math.round(completionRate),
      scoreSlabs,
      totalAssignments: assignments.length,
      students,
      assignments,
    }
  } catch (error) {
    console.error("Error fetching class analytics:", error)
    throw error
  }
}
