"use client"

import { useState } from "react"
import { Calendar, MoreVertical, Plus, ArrowRight } from "lucide-react"
import { format } from "date-fns"

import type { Goal, Milestone, PriorityLevel } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import MilestoneTimeline from "@/components/milestone-timeline"
import DependencyChart from "@/components/dependency-chart"

interface GoalCardProps {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onToggleMilestone: (goalId: string, milestoneId: string) => void
  onAddMilestone: (goalId: string, milestone: Milestone) => void
}

export default function GoalCard({ goal, onUpdate, onDelete, onToggleMilestone, onAddMilestone }: GoalCardProps) {
  const [isAddMilestoneDialogOpen, setIsAddMilestoneDialogOpen] = useState(false)
  const [isViewDependenciesOpen, setIsViewDependenciesOpen] = useState(false)
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    completed: false,
  })
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list")

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Career":
        return "bg-green-100 text-green-800 border-green-200"
      case "Personal Development":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500"
    if (progress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleAddMilestone = () => {
    if (newMilestone.title?.trim()) {
      const milestone: Milestone = {
        id: `m${Math.random().toString(36).substring(2, 9)}`,
        title: newMilestone.title,
        completed: false,
        dependsOn: newMilestone.dependsOn || [],
      }
      onAddMilestone(goal.id, milestone)
      setNewMilestone({ title: "", completed: false })
      setIsAddMilestoneDialogOpen(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-orange-500">{goal.title}</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className={getCategoryColor(goal.category)}>
                {goal.category}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                {goal.priority} Priority
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(goal.targetDate), "MMM d, yyyy")}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode(viewMode === "list" ? "timeline" : "list")}>
                {viewMode === "list" ? "Switch to Timeline" : "Switch to List"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsViewDependenciesOpen(true)}>View Dependencies</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-red-600">
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{goal.description}</p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-red-500">Progress Tracker</h3>
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className={`h-2 ${getProgressColor(goal.progress)}`} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Milestones</h3>
            <Button
              onClick={() => setIsAddMilestoneDialogOpen(true)}
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          </div>

          {viewMode === "list" ? (
            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`milestone-${milestone.id}`}
                    checked={milestone.completed}
                    onCheckedChange={() => onToggleMilestone(goal.id, milestone.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`milestone-${milestone.id}`}
                      className={`font-medium cursor-pointer ${
                        milestone.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {milestone.title}
                    </label>
                    {milestone.dependsOn && milestone.dependsOn.length > 0 && (
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Depends on: {milestone.dependsOn.length} other task(s)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MilestoneTimeline milestones={goal.milestones} onToggle={(id) => onToggleMilestone(goal.id, id)} />
          )}
        </div>

        {/* Add Milestone Dialog */}
        <Dialog open={isAddMilestoneDialogOpen} onOpenChange={setIsAddMilestoneDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="milestone-title" className="text-sm font-medium">
                  Milestone Title
                </label>
                <Input
                  id="milestone-title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="Enter milestone title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Depends On (Optional)</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {goal.milestones.map((m) => (
                    <div key={m.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`depends-${m.id}`}
                        checked={newMilestone.dependsOn?.includes(m.id)}
                        onCheckedChange={(checked) => {
                          const deps = newMilestone.dependsOn || []
                          setNewMilestone({
                            ...newMilestone,
                            dependsOn: checked ? [...deps, m.id] : deps.filter((id) => id !== m.id),
                          })
                        }}
                      />
                      <label htmlFor={`depends-${m.id}`} className="text-sm cursor-pointer">
                        {m.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMilestoneDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMilestone}>Add Milestone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dependencies Dialog */}
        <Dialog open={isViewDependenciesOpen} onOpenChange={setIsViewDependenciesOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Task Dependencies</DialogTitle>
            </DialogHeader>
            <div className="h-[300px] w-full">
              <DependencyChart milestones={goal.milestones} />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

