"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Milestone } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
  dependsOn: z.array(z.string()).optional(),
})

interface AddMilestoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (milestone: Milestone) => void
  existingMilestones: Milestone[]
}

export function AddMilestoneDialog({ open, onOpenChange, onSave, existingMilestones }: AddMilestoneDialogProps) {
  const [dependencies, setDependencies] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      completed: false,
      dependsOn: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newMilestone: Milestone = {
      id: `m${Date.now()}`,
      title: values.title,
      completed: values.completed,
      dependsOn: dependencies.length > 0 ? dependencies : undefined,
    }

    onSave(newMilestone)
    onOpenChange(false)
    form.reset()
    setDependencies([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
          <DialogDescription>
            Create a new milestone for your goal. Add dependencies if this milestone depends on others.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter milestone title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {existingMilestones.length > 0 && (
              <div>
                <FormLabel>Dependencies</FormLabel>
                <div className="mt-2 space-y-2">
                  {existingMilestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={milestone.id}
                        checked={dependencies.includes(milestone.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDependencies([...dependencies, milestone.id])
                          } else {
                            setDependencies(dependencies.filter((id) => id !== milestone.id))
                          }
                        }}
                      />
                      <label
                        htmlFor={milestone.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {milestone.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit">Add Milestone</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
