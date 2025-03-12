"use client"

import type { Milestone } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle } from "lucide-react"

interface MilestoneTimelineProps {
  milestones: Milestone[]
  onToggle: (id: string) => void
}

export default function MilestoneTimeline({ milestones, onToggle }: MilestoneTimelineProps) {
  return (
    <div className="space-y-2 pl-4">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="relative">
          {/* Connecting line */}
          {index < milestones.length - 1 && (
            <div
              className={cn(
                "absolute left-3 top-3 bottom-0 w-0.5 -ml-3 -translate-x-1/2",
                milestone.completed ? "bg-green-200" : "bg-gray-200",
              )}
              style={{ height: "calc(100% + 0.5rem)" }}
            />
          )}

          {/* Milestone */}
          <div className="flex relative">
            <button
              onClick={() => onToggle(milestone.id)}
              className="absolute left-0 top-1 -ml-3 -translate-x-1/2 flex items-center justify-center"
            >
              {milestone.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500 fill-green-100" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </button>

            <div className={cn("ml-6 pb-6 flex-1", milestone.completed ? "text-gray-500" : "text-gray-900")}>
              <p className={cn("font-medium", milestone.completed && "line-through")}>{milestone.title}</p>

              {milestone.dependsOn && milestone.dependsOn.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Depends on:{" "}
                  {milestone.dependsOn
                    .map((id) => {
                      const dependentTask = milestones.find((m) => m.id === id)
                      return dependentTask ? dependentTask.title : id
                    })
                    .join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

