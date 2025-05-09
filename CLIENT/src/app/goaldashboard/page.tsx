"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalGrid } from "@/components/goal-grid"
import { GoalSummary } from "@/components/goal-summary"
import { NewGoalDialog } from "@/components/new-goal-dialog"
import { GoalTemplates } from "@/components/goal-templates"
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
  const [filter, setFilter] = useState<string>("all")

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

  const filteredGoals =
    filter === "all" ? goals : goals.filter((goal) => goal.category === filter || goal.priority === filter)

  const categories = Array.from(new Set(goals.map((goal) => goal.category)))
  const priorities = Array.from(new Set(goals.map((goal) => goal.priority)))

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Goal Dashboard</h1>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsNewGoalDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Goal
                  </Button>
                </div>
              </div>

              <GoalSummary goals={goals} />

              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="all" onClick={() => setFilter("all")}>
                      All Goals
                    </TabsTrigger>
                    <TabsTrigger value="academic" onClick={() => setFilter("Academic")}>
                      Academic
                    </TabsTrigger>
                    <TabsTrigger value="career" onClick={() => setFilter("Career")}>
                      Career
                    </TabsTrigger>
                    <TabsTrigger value="high" onClick={() => setFilter("High")}>
                      High Priority
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <GoalGrid
                      goals={filteredGoals}
                      onUpdate={updateGoal}
                      onDelete={deleteGoal}
                      onToggleMilestone={toggleMilestoneStatus}
                      onAddMilestone={addMilestone}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="academic" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <GoalGrid
                      goals={filteredGoals}
                      onUpdate={updateGoal}
                      onDelete={deleteGoal}
                      onToggleMilestone={toggleMilestoneStatus}
                      onAddMilestone={addMilestone}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="career" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <GoalGrid
                      goals={filteredGoals}
                      onUpdate={updateGoal}
                      onDelete={deleteGoal}
                      onToggleMilestone={toggleMilestoneStatus}
                      onAddMilestone={addMilestone}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="high" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <GoalGrid
                      goals={filteredGoals}
                      onUpdate={updateGoal}
                      onDelete={deleteGoal}
                      onToggleMilestone={toggleMilestoneStatus}
                      onAddMilestone={addMilestone}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      <NewGoalDialog
        open={isNewGoalDialogOpen}
        onOpenChange={setIsNewGoalDialogOpen}
        onSave={addGoal}
        onShowTemplates={() => {
          setShowTemplates(true)
          setIsNewGoalDialogOpen(false)
        }}
      />

      {showTemplates && (
        <GoalTemplates onSelectTemplate={(template) => addGoal(template)} onClose={() => setShowTemplates(false)} />
      )}
    </SidebarProvider>
  )
}
