"use client"

import { useState } from "react"
import { ClassCard } from "@/components/dashboard/class-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const classesData = [
  {
    id: "1",
    name: "Biology 101",
    code: "BIO-101",
    studentCount: 32,
    assignmentCount: 8,
    pendingSubmissions: 5,
    color: "teal",
  },
  {
    id: "2",
    name: "Environmental Science",
    code: "ENV-201",
    studentCount: 28,
    assignmentCount: 6,
    pendingSubmissions: 12,
    color: "green",
  },
  {
    id: "3",
    name: "Calculus II",
    code: "MATH-202",
    studentCount: 25,
    assignmentCount: 10,
    pendingSubmissions: 0,
    color: "blue",
  },
  {
    id: "4",
    name: "English Literature",
    code: "ENG-301",
    studentCount: 22,
    assignmentCount: 5,
    pendingSubmissions: 3,
    color: "purple",
  },
  {
    id: "5",
    name: "History 201",
    code: "HIST-201",
    studentCount: 30,
    assignmentCount: 7,
    pendingSubmissions: 8,
    color: "orange",
  },
  {
    id: "6",
    name: "Chemistry 101",
    code: "CHEM-101",
    studentCount: 35,
    assignmentCount: 9,
    pendingSubmissions: 2,
    color: "red",
  },
]

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredClasses = classesData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and student rosters
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Add a new class to start managing assignments and students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input id="className" placeholder="e.g., Biology 101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input id="classCode" placeholder="e.g., BIO-101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="Brief description of the class" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-10 bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center border border-border rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              viewMode === "grid" && "bg-secondary"
            )}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              viewMode === "list" && "bg-secondary"
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "gap-4",
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col"
        )}
      >
        {filteredClasses.map((classItem) => (
          <ClassCard key={classItem.id} {...classItem} />
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No classes found matching your search.</p>
        </div>
      )}
    </div>
  )
}
