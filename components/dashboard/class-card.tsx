"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ClassCardProps {
  id: string
  name: string
  code: string
  studentCount: number
  assignmentCount: number
  pendingSubmissions: number
  color: string
}

export function ClassCard({
  id,
  name,
  code,
  studentCount,
  assignmentCount,
  pendingSubmissions,
}: ClassCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors group">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <Link href={`/dashboard/classes/${id}`}>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{code}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Class</DropdownMenuItem>
            <DropdownMenuItem>Edit Class</DropdownMenuItem>
            <DropdownMenuItem>Manage Students</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Archive Class</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{studentCount} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{assignmentCount} assignments</span>
          </div>
        </div>
        {pendingSubmissions > 0 && (
          <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
            {pendingSubmissions} pending submissions
          </Badge>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/classes/${id}`}>View Class</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/assignments/new?classId=${id}`}>New Assignment</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
