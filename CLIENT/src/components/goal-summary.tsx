"use client"

import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Goal } from "@/lib/types"

interface GoalSummaryProps {
  goals: Goal[]
}

export function GoalSummary({ goals }: GoalSummaryProps) {
  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.progress === 100).length
  const upcomingDeadlines = goals.filter((goal) => {
    const targetDate = new Date(goal.targetDate)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0 && goal.progress < 100
  }).length

  const averageProgress =
    totalGoals > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGoals}</div>
          <p className="text-xs text-muted-foreground">
            {completedGoals} completed, {totalGoals - completedGoals} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress}%</div>
          <Progress value={averageProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedGoals}</div>
          <p className="text-xs text-muted-foreground">
            {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Goals due within the next 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
