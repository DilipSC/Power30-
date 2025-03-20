"use client"

import { useState } from "react"
import { PlusCircle, User, Menu } from "lucide-react"

import GoalCard from "@/components/goal-card"
import NewGoalDialog from "@/components/new-goal-dialog"
import GoalTemplates from "@/components/goal-templates"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Goal, Milestone } from "@/lib/types"
export default function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete Final Year Project",
      description: "Design and implement a student profile application with goal tracking features",
      category: "Academic",
      priority: "High",
      targetDate: "2023-12-15",
      progress: 35,
      milestones: [
        { id: "m1", title: "Project proposal", completed: true },
        { id: "m2", title: "Requirements gathering", completed: true },
        { id: "m3", title: "UI/UX design", completed: true },
        { id: "m4", title: "Frontend implementation", completed: false, dependsOn: ["m3"] },
        { id: "m5", title: "Backend development", completed: false, dependsOn: ["m2"] },
        { id: "m6", title: "Testing", completed: false, dependsOn: ["m4", "m5"] },
        { id: "m7", title: "Deployment", completed: false, dependsOn: ["m6"] },
      ],
    },
    {
      id: "2",
      title: "Prepare for Job Interviews",
      description: "Study and practice for upcoming software engineer job interviews",
      category: "Career",
      priority: "Medium",
      targetDate: "2023-11-30",
      progress: 50,
      milestones: [
        { id: "m1", title: "Update resume", completed: true },
        { id: "m2", title: "Research companies", completed: true },
        { id: "m3", title: "Practice coding questions", completed: false },
        { id: "m4", title: "Mock interviews", completed: false, dependsOn: ["m3"] },
      ],
    },
  ])

  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal])
    setIsNewGoalDialogOpen(false)
  }

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))
  }

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  const toggleMilestoneStatus = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed: !milestone.completed }
          }
          return milestone
        })

        // Calculate progress percentage
        const completedCount = updatedMilestones.filter((m) => m.completed).length
        const totalCount = updatedMilestones.length
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

        return { ...goal, milestones: updatedMilestones, progress }
      }
      return goal
    })

    setGoals(updatedGoals)
  }

  const addMilestone = (goalId: string, milestone: Milestone) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = [...goal.milestones, milestone]
        return { ...goal, milestones: updatedMilestones }
      }
      return goal
    })

    setGoals(updatedGoals)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 flex justify-between items-center bg-white">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
        <h1 className="text-xl font-semibold text-center">Student Goals</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-6 w-6" />
          <span className="sr-only">Profile</span>
        </Button>
      </header>

      <div className="p-4 md:p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Goals</h2>
          <Button onClick={() => setIsNewGoalDialogOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Goal
          </Button>
        </div>

        {showTemplates && (
          <div className="mb-6">
            <GoalTemplates onSelectTemplate={(template) => addGoal(template)} />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={updateGoal}
                onDelete={deleteGoal}
                onToggleMilestone={toggleMilestoneStatus}
                onAddMilestone={addMilestone}
              />
            ))}
          </div>
        </ScrollArea>

        <NewGoalDialog
          open={isNewGoalDialogOpen}
          onOpenChange={setIsNewGoalDialogOpen}
          onSave={addGoal}
          onShowTemplates={() => {
            setShowTemplates(true)
            setIsNewGoalDialogOpen(false)
          }}
        />
      </div>
    </div>
  )
}

