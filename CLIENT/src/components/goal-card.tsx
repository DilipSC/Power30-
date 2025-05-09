"use client"

import { useState } from "react"
import { Calendar, CheckCircle2, ChevronDown, Circle, Clock, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { AddMilestoneDialog } from "@/components/add-milestone-dialog"
import { EditGoalDialog } from "@/components/edit-goal-dialog"
import type { Goal, Milestone } from "@/lib/types"

interface GoalCardProps {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onToggleMilestone: (goalId: string, milestoneId: string) => void
  onAddMilestone: (goalId: string, milestone: Milestone) => void
}

export function GoalCard({ goal, onUpdate, onDelete, onToggleMilestone, onAddMilestone }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddMilestoneDialogOpen, setIsAddMilestoneDialogOpen] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-purple-500"
      case "Career":
        return "bg-cyan-500"
      case "Personal":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const getDaysRemaining = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "Overdue"
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `${diffDays} days left`
    }
  }

  const daysRemaining = getDaysRemaining(goal.targetDate)
  const isOverdue = daysRemaining === "Overdue"
  const isDueToday = daysRemaining === "Due today"

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="line-clamp-2">{goal.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={`${getCategoryColor(goal.category)} text-white`}>
                  {goal.category}
                </Badge>
                <Badge variant="secondary" className={`${getPriorityColor(goal.priority)} text-white`}>
                  {goal.priority}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddMilestoneDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Milestone
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{goal.description}</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(goal.targetDate)}</span>
              </div>
              <div
                className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : isDueToday ? "text-yellow-500" : "text-muted-foreground"}`}
              >
                <Clock className="h-4 w-4" />
                <span>{daysRemaining}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-center">
                <span className="mr-1">Milestones</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-1">
                {goal.milestones.map((milestone) => (
                  <li key={milestone.id} className="flex items-start gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 mt-0.5"
                      onClick={() => onToggleMilestone(goal.id, milestone.id)}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span className="sr-only">{milestone.completed ? "Mark as incomplete" : "Mark as complete"}</span>
                    </Button>
                    <span className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                      {milestone.title}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      </Card>

      {isEditDialogOpen && (
        <EditGoalDialog goal={goal} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSave={onUpdate} />
      )}

      {isAddMilestoneDialogOpen && (
        <AddMilestoneDialog
          open={isAddMilestoneDialogOpen}
          onOpenChange={setIsAddMilestoneDialogOpen}
          onSave={(milestone) => onAddMilestone(goal.id, milestone)}
          existingMilestones={goal.milestones}
        />
      )}
    </>
  )
}
