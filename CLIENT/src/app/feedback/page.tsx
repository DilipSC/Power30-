"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Star, ThumbsUp, ThumbsDown, ChevronRight, ArrowRight, ArrowLeft, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define constants for form options
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English Literature"] as const

const learningStyles = [
  { id: "lecture", label: "Lecture-Based Learning", icon: "🎤", description: "Traditional classroom lectures" },
  {
    id: "visual",
    label: "Visual Aids & Demonstrations",
    icon: "📊",
    description: "Learning through diagrams and visuals",
  },
  {
    id: "practical",
    label: "Hands-on/Practical Learning",
    icon: "🛠",
    description: "Learning by doing experiments and exercises",
  },
  {
    id: "group",
    label: "Group Discussions & Peer Learning",
    icon: "🗣",
    description: "Collaborative learning with peers",
  },
  {
    id: "realworld",
    label: "Real-World Applications",
    icon: "🌍",
    description: "Connecting concepts to real-life scenarios",
  },
] as const

const topics = [
  "Calculus",
  "Quantum Physics",
  "Organic Chemistry",
  "Molecular Biology",
  "Data Structures",
  "Programming",
  "Literature Analysis",
  "Research Methods",
  "Statistics",
  "Laboratory Techniques",
] as const

const studyResources = [
  { id: "video", label: "Video Tutorials", icon: "🎥", description: "Online video lessons and demonstrations" },
  { id: "practice", label: "Practice Problems", icon: "✍️", description: "Exercises to reinforce learning" },
  { id: "ebooks", label: "E-Books & PDFs", icon: "📚", description: "Digital reading materials" },
  { id: "interactive", label: "Interactive Simulations", icon: "🎮", description: "Hands-on digital experiments" },
  { id: "quizzes", label: "Online Quizzes", icon: "📝", description: "Self-assessment tools" },
] as const

const teachingMethods = [
  { id: "lectures", label: "Lectures", icon: "📢", description: "Traditional classroom teaching" },
  { id: "discussions", label: "Group Discussions", icon: "👥", description: "Collaborative learning sessions" },
  { id: "projects", label: "Projects", icon: "🛠️", description: "Hands-on project-based learning" },
  { id: "labs", label: "Labs", icon: "🧪", description: "Practical laboratory sessions" },
  { id: "presentations", label: "Student Presentations", icon: "🎭", description: "Student-led teaching sessions" },
] as const

// Define form schema with Zod
const formSchema = z.object({
  subjectRatings: z.record(z.enum(["easy", "moderate", "hard"])),
  learningStyles: z.array(z.string()).min(1, {
    message: "Please select at least one learning style.",
  }),
  difficultTopics: z.array(z.string()).min(1, {
    message: "Please select at least one difficult topic.",
  }),
  teachingImprovement: z.string().min(10, {
    message: "Please provide at least 10 characters of feedback.",
  }),
  studyResources: z.array(z.string()),
  additionalResources: z.string().optional(),
  learningChallenge: z.object({
    type: z.enum(["timeManagement", "understanding", "examPrep", "resources", "other"]),
    otherDescription: z.string().optional(),
  }),
  teachingMethodsFeedback: z.record(z.enum(["like", "dislike"])),
  overallRating: z.number().min(1).max(5),
})

type FormValues = z.infer<typeof formSchema>

export default function Feedback() {
  // State for topic search and selection
  const [topicSearch, setTopicSearch] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 8

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectRatings: {},
      learningStyles: [],
      difficultTopics: [],
      teachingImprovement: "",
      studyResources: [],
      additionalResources: "",
      learningChallenge: { type: "timeManagement" },
      teachingMethodsFeedback: {},
      overallRating: 0,
    },
  })

  // Check if current step is valid before proceeding
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return Object.keys(form.getValues().subjectRatings).length > 0
      case 2:
        return form.getValues().learningStyles.length > 0
      case 3:
        return form.getValues().difficultTopics.length > 0
      case 4:
        return form.getValues().teachingImprovement.length >= 10
      case 5:
        return true // Study resources are optional
      case 6:
        return true // Learning challenge is pre-selected
      case 7:
        return Object.keys(form.getValues().teachingMethodsFeedback).length === teachingMethods.length
      case 8:
        return form.getValues().overallRating > 0
      default:
        return true
    }
  }

  const nextStep = () => {
    if (isCurrentStepValid()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      toast.error("Please complete all required fields before continuing")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Thank you for your feedback! 🎉", {
          description: "Your responses have been successfully submitted.",
          duration: 5000,
        })
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter topics based on search input
  const filteredTopics = topics.filter((topic) => topic.toLowerCase().includes(topicSearch.toLowerCase()))

  // Add a topic to the selected topics
  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      const newTopics = [...selectedTopics, topic]
      setSelectedTopics(newTopics)
      form.setValue("difficultTopics", newTopics)
    }
    setTopicSearch("")
  }

  // Remove a topic from the selected topics
  const removeTopic = (topic: string) => {
    const newTopics = selectedTopics.filter((t) => t !== topic)
    setSelectedTopics(newTopics)
    form.setValue("difficultTopics", newTopics)
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                1
              </div>
              <h2 className="text-2xl font-semibold">Subject Difficulty Rating</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Please rate the difficulty level of each subject based on your experience.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <FormField
                  key={subject}
                  control={form.control}
                  name={`subjectRatings.${subject}`}
                  render={({ field }) => (
                    <Card
                      className={`border transition-all duration-200 hover:shadow-md ${field.value ? "border-primary/30 shadow-sm" : ""}`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-medium">{subject}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">
                              <span className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                Easy 🟢
                              </span>
                            </SelectItem>
                            <SelectItem value="moderate">
                              <span className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                Moderate 🟡
                              </span>
                            </SelectItem>
                            <SelectItem value="hard">
                              <span className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                Hard 🔴
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  )}
                />
              ))}
            </div>
          </section>
        )
      case 2:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                2
              </div>
              <h2 className="text-2xl font-semibold">Preferred Learning Style</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Select the learning styles that work best for you. Choose all that apply.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningStyles.map((style) => (
                <FormField
                  key={style.id}
                  control={form.control}
                  name="learningStyles"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            field.value?.includes(style.id) ? "border-primary bg-primary/5 shadow-sm" : ""
                          }`}
                          onClick={() => {
                            const newValue = field.value?.includes(style.id)
                              ? field.value.filter((v) => v !== style.id)
                              : [...(field.value || []), style.id]
                            field.onChange(newValue)
                          }}
                        >
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                              <span className="text-xl">{style.icon}</span>
                              {style.label}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                          </CardContent>
                        </Card>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </section>
        )
      case 3:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                3
              </div>
              <h2 className="text-2xl font-semibold">Most Difficult Topics</h2>
            </div>
            <p className="text-muted-foreground mb-6">Search and select the topics you find most challenging.</p>
            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {selectedTopics.length > 0 ? (
                    selectedTopics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/10">
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No topics selected yet</p>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Search and select topics..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    className="w-full"
                  />
                  {topicSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                          <div
                            key={topic}
                            className="px-4 py-2 hover:bg-primary/5 cursor-pointer flex items-center"
                            onClick={() => addTopic(topic)}
                          >
                            <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                            {topic}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">No topics found</div>
                      )}
                    </div>
                  )}
                </div>
                {selectedTopics.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Please select at least one topic to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )
      case 4:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                4
              </div>
              <h2 className="text-2xl font-semibold">Teaching Methods Improvement</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Share your suggestions on how teaching methods could be improved.
            </p>
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="teachingImprovement"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your suggestions for improving teaching methods..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between mt-2">
                        <FormMessage />
                        <p
                          className={`text-sm ${field.value.length < 10 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
                        >
                          {field.value.length}/10 characters minimum
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>
        )
      case 5:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                5
              </div>
              <h2 className="text-2xl font-semibold">Study Resources</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Select the study resources you find most helpful and suggest any additional ones.
            </p>
            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {studyResources.map((resource) => (
                    <FormField
                      key={resource.id}
                      control={form.control}
                      name="studyResources"
                      render={({ field }) => (
                        <FormItem className="flex space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(resource.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, resource.id]
                                  : field.value?.filter((value) => value !== resource.id)
                                field.onChange(newValue)
                              }}
                            />
                          </FormControl>
                          <div className="grid gap-0.5">
                            <FormLabel className="text-base font-medium">
                              {resource.icon} {resource.label}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="additionalResources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium mb-2 block">Suggest Additional Resources</FormLabel>
                        <FormControl>
                          <Input placeholder="Any other resources that help you learn..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        )
      case 6:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                6
              </div>
              <h2 className="text-2xl font-semibold">Biggest Learning Challenge</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              What is your biggest challenge when learning? Select one option.
            </p>
            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="learningChallenge.type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <Card
                            className={`border p-4 cursor-pointer transition-all ${field.value === "timeManagement" ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => field.onChange("timeManagement")}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="timeManagement" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium text-base">⏰ Time Management</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Difficulty balancing study time with other responsibilities
                                </p>
                              </div>
                            </FormItem>
                          </Card>

                          <Card
                            className={`border p-4 cursor-pointer transition-all ${field.value === "understanding" ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => field.onChange("understanding")}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="understanding" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium text-base">🤔 Understanding Concepts</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Trouble grasping complex or abstract ideas
                                </p>
                              </div>
                            </FormItem>
                          </Card>

                          <Card
                            className={`border p-4 cursor-pointer transition-all ${field.value === "examPrep" ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => field.onChange("examPrep")}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="examPrep" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium text-base">📝 Exam Preparation</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Difficulty preparing effectively for tests and exams
                                </p>
                              </div>
                            </FormItem>
                          </Card>

                          <Card
                            className={`border p-4 cursor-pointer transition-all ${field.value === "resources" ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => field.onChange("resources")}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="resources" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium text-base">📚 Lack of Study Resources</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Not having access to adequate learning materials
                                </p>
                              </div>
                            </FormItem>
                          </Card>

                          <Card
                            className={`border p-4 cursor-pointer transition-all ${field.value === "other" ? "border-primary bg-primary/5" : ""}`}
                            onClick={() => field.onChange("other")}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium text-base">✨ Other</FormLabel>
                                <p className="text-sm text-muted-foreground">A different challenge not listed here</p>
                              </div>
                            </FormItem>
                          </Card>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("learningChallenge.type") === "other" && (
                  <FormField
                    control={form.control}
                    name="learningChallenge.otherDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Please specify your challenge..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </section>
        )
      case 7:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                7
              </div>
              <h2 className="text-2xl font-semibold">Teaching Methods Feedback</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              For each teaching method, indicate whether you like or dislike it.
            </p>
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {teachingMethods.map((method) => (
                    <div key={method.id} className="pb-5 border-b last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-medium flex items-center gap-2">
                            <span>{method.icon}</span> {method.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <FormField
                          control={form.control}
                          name={`teachingMethodsFeedback.${method.id}`}
                          render={({ field }) => (
                            <FormItem className="space-x-4 flex">
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-2"
                                  >
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            type="button"
                                            variant={field.value === "like" ? "default" : "outline"}
                                            size="sm"
                                            className={`rounded-full px-4 ${field.value === "like" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                            onClick={() => field.onChange("like")}
                                          >
                                            <ThumbsUp className="h-4 w-4 mr-2" /> Like
                                          </Button>
                                          <Button
                                            type="button"
                                            variant={field.value === "dislike" ? "default" : "outline"}
                                            size="sm"
                                            className={`rounded-full px-4 ${field.value === "dislike" ? "bg-red-600 hover:bg-red-700" : ""}`}
                                            onClick={() => field.onChange("dislike")}
                                          >
                                            <ThumbsDown className="h-4 w-4 mr-2" /> Dislike
                                          </Button>
                                          <RadioGroupItem value="like" id={`like-${method.id}`} className="sr-only" />
                                          <RadioGroupItem
                                            value="dislike"
                                            id={`dislike-${method.id}`}
                                            className="sr-only"
                                          />
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )
      case 8:
        return (
          <section className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                8
              </div>
              <h2 className="text-2xl font-semibold">Overall Experience Rating</h2>
            </div>
            <p className="text-muted-foreground mb-6">How would you rate your overall learning experience?</p>
            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-8">
                <FormField
                  control={form.control}
                  name="overallRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-6">
                          <div className="flex items-center justify-center">
                            <div className="flex gap-3">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => field.onChange(rating)}
                                  className={`transition-all duration-300 transform ${
                                    field.value >= rating
                                      ? "text-yellow-400 scale-110"
                                      : "text-gray-300 hover:text-yellow-200"
                                  }`}
                                >
                                  <Star className="h-12 w-12 fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-medium">
                              {field.value === 1 && "Poor"}
                              {field.value === 2 && "Fair"}
                              {field.value === 3 && "Good"}
                              {field.value === 4 && "Very Good"}
                              {field.value === 5 && "Excellent"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {field.value === 1 && "Significant improvements needed"}
                              {field.value === 2 && "Several aspects need improvement"}
                              {field.value === 3 && "Satisfactory but could be better"}
                              {field.value === 4 && "Great experience with minor issues"}
                              {field.value === 5 && "Outstanding learning experience"}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Educational Experience Feedback</h1>
        <p className="text-muted-foreground">Help us improve our teaching methods and learning resources</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span>Progress</span>
          <span>
            {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Feedback
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
