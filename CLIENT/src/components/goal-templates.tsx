"use client"

import { ArrowRight } from "lucide-react"
import type { Goal } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface GoalTemplatesProps {
  onSelectTemplate: (template: Goal) => void
}

export default function GoalTemplates({ onSelectTemplate }: GoalTemplatesProps) {
  const templates: Goal[] = [
    {
      id: "template1",
      title: "Complete a Course",
      description: "Complete an online course to advance your skills",
      category: "Academic",
      priority: "Medium",
      targetDate: "2023-12-31",
      progress: 0,
      milestones: [
        { id: "mt1", title: "Research available courses", completed: false },
        { id: "mt2", title: "Register for the course", completed: false, dependsOn: ["mt1"] },
        { id: "mt3", title: "Complete first module", completed: false, dependsOn: ["mt2"] },
        { id: "mt4", title: "Complete mid-term assignment", completed: false, dependsOn: ["mt3"] },
        { id: "mt5", title: "Complete final project", completed: false, dependsOn: ["mt4"] },
      ],
    },
    {
      id: "template2",
      title: "Prepare for Certification Exam",
      description: "Study and prepare for a professional certification exam",
      category: "Career",
      priority: "High",
      targetDate: "2023-12-31",
      progress: 0,
      milestones: [
        { id: "mt1", title: "Research exam requirements", completed: false },
        { id: "mt2", title: "Create study plan", completed: false, dependsOn: ["mt1"] },
        { id: "mt3", title: "Complete study materials", completed: false, dependsOn: ["mt2"] },
        { id: "mt4", title: "Take practice exams", completed: false, dependsOn: ["mt3"] },
        { id: "mt5", title: "Register for exam", completed: false, dependsOn: ["mt4"] },
        { id: "mt6", title: "Take the exam", completed: false, dependsOn: ["mt5"] },
      ],
    },
    {
      id: "template3",
      title: "Research Project",
      description: "Complete a research project for your studies",
      category: "Academic",
      priority: "High",
      targetDate: "2023-12-31",
      progress: 0,
      milestones: [
        { id: "mt1", title: "Define research question", completed: false },
        { id: "mt2", title: "Literature review", completed: false, dependsOn: ["mt1"] },
        { id: "mt3", title: "Create methodology", completed: false, dependsOn: ["mt2"] },
        { id: "mt4", title: "Collect data", completed: false, dependsOn: ["mt3"] },
        { id: "mt5", title: "Analyze results", completed: false, dependsOn: ["mt4"] },
        { id: "mt6", title: "Write paper", completed: false, dependsOn: ["mt5"] },
        { id: "mt7", title: "Present findings", completed: false, dependsOn: ["mt6"] },
      ],
    },
  ]

  const handleSelectTemplate = (template: Goal) => {
    const newGoal = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
    }
    onSelectTemplate(newGoal)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Goal Templates</h3>
        <p className="text-sm text-muted-foreground">Select a template to get started quickly</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>
                {template.category} · {template.priority} Priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{template.description}</p>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">{template.milestones.length} milestones included</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between" onClick={() => handleSelectTemplate(template)}>
                Use this template
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

