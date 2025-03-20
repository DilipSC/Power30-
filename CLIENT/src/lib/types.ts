export type GoalCategory = "Academic" | "Career" | "Personal Development"

export type PriorityLevel = "High" | "Medium" | "Low"

export interface Milestone {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  dependsOn?: string[]
}

export interface Goal {
  id: string
  title: string
  description: string
  category: GoalCategory
  priority: PriorityLevel
  targetDate: string
  progress: number
  milestones: Milestone[]
}

