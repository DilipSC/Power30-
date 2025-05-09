"use client"

import { GoalCard } from "@/components/goal-card"
import type { Goal, Milestone } from "@/lib/types"
import { Target } from "lucide-react"

interface GoalGridProps {
  goals: Goal[]
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onToggleMilestone: (goalId: string, milestoneId: string) => void
  onAddMilestone: (goalId: string, milestone: Milestone) => void
}

export function GoalGrid({ goals, onUpdate, onDelete, onToggleMilestone, onAddMilestone }: GoalGridProps) {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Target className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No goals found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try changing your filters or create a new goal to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleMilestone={onToggleMilestone}
          onAddMilestone={onAddMilestone}
        />
      ))}
    </div>
  )
}

// Import this at the top of the file

