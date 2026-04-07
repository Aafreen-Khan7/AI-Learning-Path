"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Trash2, Copy } from "lucide-react"
import { TeacherClass } from "@/lib/teacher-db"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ClassesPage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchClasses()
  }, [user])

  async function fetchClasses() {
    try {
      const response = await fetch(
        `/api/teacher/classes?teacherId=${user?.uid}`
      )
      const data = await response.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(classId: string) {
    setDeleting(true)
    try {
      const response = await fetch("/api/teacher/classes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: user?.uid,
          classId,
        }),
      })

      if (response.ok) {
        setClasses(classes.filter((c) => c.id !== classId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Error deleting class:", error)
    } finally {
      setDeleting(false)
    }
  }

  function copyClassCode(code: string) {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and students
          </p>
        </div>
        <Link href="/teacher/classes/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Class
          </Button>
        </Link>
      </div>

      {/* Classes Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading classes...
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No classes found</p>
            <Link href="/teacher/classes/new">
              <Button>Create Your First Class</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Classes ({classes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Class Name</th>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 font-semibold">Batch</th>
                    <th className="px-4 py-3 font-semibold">Students</th>
                    <th className="px-4 py-3 font-semibold">Class Code</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id} className="border-b hover:bg-accent">
                      <td className="px-4 py-3">{cls.name}</td>
                      <td className="px-4 py-3">{cls.subject}</td>
                      <td className="px-4 py-3">{cls.batch}</td>
                      <td className="px-4 py-3">{cls.totalStudents}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold bg-accent rounded px-2 py-1">
                            {cls.classCode}
                          </code>
                          <button
                            onClick={() => copyClassCode(cls.classCode)}
                            className="p-1 hover:bg-accent rounded"
                            title="Copy class code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/teacher/classes/${cls.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </Link>
                          <button
                            onClick={() => setDeleteId(cls.id!)}
                            className="p-2 hover:bg-destructive/10 rounded"
                            title="Delete class"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
