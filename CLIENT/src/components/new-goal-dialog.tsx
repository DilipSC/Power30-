"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Goal, GoalCategory, PriorityLevel } from "@/lib/types"

interface NewGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (goal: Goal) => void
  onShowTemplates: () => void
}

export function NewGoalDialog({ open, onOpenChange, onSave, onShowTemplates }: NewGoalDialogProps) {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "Academic",
    priority: "Medium",
    targetDate: format(new Date(), "yyyy-MM-dd"),
    progress: 0,
    milestones: [],
  })

  const [date, setDate] = useState<Date>(new Date())

  const handleSave = () => {
    if (!formData.title) return

    onSave({
      id: Math.random().toString(36).substring(2, 9),
      title: formData.title,
      description: formData.description || "",
      category: formData.category as GoalCategory,
      priority: formData.priority as PriorityLevel,
      targetDate: formData.targetDate || format(new Date(), "yyyy-MM-dd"),
      progress: 0,
      milestones: [],
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "Academic",
      priority: "Medium",
      targetDate: format(new Date(), "yyyy-MM-dd"),
      progress: 0,
      milestones: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Enter the details for your new goal. You can add milestones after creating the goal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter goal title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as GoalCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Career">Career</SelectItem>
                <SelectItem value="Personal Development">Personal Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Priority Level</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as PriorityLevel })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high" className="text-red-600">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium" className="text-yellow-600">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low" className="text-blue-600">
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label>Target Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    if (date) {
                      setDate(date)
                      setFormData({ ...formData, targetDate: format(date, "yyyy-MM-dd") })
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
          <Button variant="outline" onClick={onShowTemplates}>
            Use Template
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title}>
              Create Goal
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

