"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Star, ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react"

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

// Define constants for form options
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English Literature"] as const

const learningStyles = [
  { id: "lecture", label: "Lecture-Based Learning", icon: "🎤" },
  { id: "visual", label: "Visual Aids & Demonstrations", icon: "📊" },
  { id: "practical", label: "Hands-on/Practical Learning", icon: "🛠" },
  { id: "group", label: "Group Discussions & Peer Learning", icon: "🗣" },
  { id: "realworld", label: "Real-World Applications", icon: "🌍" },
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
  { id: "video", label: "Video Tutorials", icon: "🎥" },
  { id: "practice", label: "Practice Problems", icon: "✍️" },
  { id: "ebooks", label: "E-Books & PDFs", icon: "📚" },
  { id: "interactive", label: "Interactive Simulations", icon: "🎮" },
  { id: "quizzes", label: "Online Quizzes", icon: "📝" },
] as const

const teachingMethods = [
  { id: "lectures", label: "Lectures", icon: "📢" },
  { id: "discussions", label: "Group Discussions", icon: "👥" },
  { id: "projects", label: "Projects", icon: "🛠️" },
  { id: "labs", label: "Labs", icon: "🧪" },
  { id: "presentations", label: "Student Presentations", icon: "🎭" },
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
  const totalSteps = 7

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

  
  async function onSubmit(data: FormValues) {
    toast("Thank you for your feedback! 🎉")
    console.log(data);
    const response = await fetch("http://localhost:8000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          {/* Section 1: Subject Difficulty Rating */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">1.</span> Subject Difficulty Rating
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map((subject) => (
                <FormField
                  key={subject}
                  control={form.control}
                  name={`subjectRatings.${subject}`}
                  render={({ field }) => (
                    <Card className="border-2 transition-colors hover:border-blue-100 dark:hover:border-blue-900">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base font-medium">{subject}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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

          {/* Section 2: Preferred Learning Style */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">2.</span> Preferred Learning Style
            </h2>
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
                          className={`cursor-pointer transition-all ${
                            field.value?.includes(style.id)
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "hover:border-blue-200 dark:hover:border-blue-800"
                          }`}
                          onClick={() => {
                            const newValue = field.value?.includes(style.id)
                              ? field.value.filter((v) => v !== style.id)
                              : [...(field.value || []), style.id]
                            field.onChange(newValue)
                          }}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                              <span className="text-xl">{style.icon}</span>
                              {style.label}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </section>

          {/* Section 3: Most Difficult Topics */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">3.</span> Most Difficult Topics
            </h2>
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
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
                            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center"
                            onClick={() => addTopic(topic)}
                          >
                            <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                            {topic}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">No topics found</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Teaching Methods Improvement */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">4.</span> Teaching Methods Improvement
            </h2>
            <Card className="border-2">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="teachingImprovement"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your suggestions for improving teaching methods..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Study Resources */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">5.</span> Study Resources
            </h2>
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {studyResources.map((resource) => (
                    <FormField
                      key={resource.id}
                      control={form.control}
                      name="studyResources"
                      render={({ field }) => (
                        <FormItem className="flex space-x-3 space-y-0 items-center">
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
                          <FormLabel className="text-base font-normal">
                            {resource.icon} {resource.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="additionalResources"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Suggest additional resources..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Section 6: Biggest Learning Challenge */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">6.</span> Biggest Learning Challenge
            </h2>
            <Card className="border-2">
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
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="timeManagement" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">⏰ Time Management</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="understanding" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">🤔 Understanding Concepts</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="examPrep" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">📝 Exam Preparation</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="resources" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">📚 Lack of Study Resources</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">✨ Other</FormLabel>
                          </FormItem>
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

          {/* Section 7: Teaching Methods Feedback - MODIFIED: Removed Toggle Buttons */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">7.</span> Teaching Methods Feedback
            </h2>
            <Card className="border-2 mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {teachingMethods.map((method) => (
                    <div key={method.id} className="flex justify-between items-center">
                      <span className="text-base flex items-center gap-2">
                        <span>{method.icon}</span> {method.label}
                      </span>
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
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="like" id={`like-${method.id}`} />
                                    </FormControl>
                                    <FormLabel htmlFor={`like-${method.id}`} className="flex items-center">
                                      <ThumbsUp className="h-4 w-4 mr-1" /> Like
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="dislike" id={`dislike-${method.id}`} />
                                    </FormControl>
                                    <FormLabel htmlFor={`dislike-${method.id}`} className="flex items-center">
                                      <ThumbsDown className="h-4 w-4 mr-1" /> Dislike
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">8.</span> Overall Experience Rating
            </h2>
            <Card className="border-2">
              <CardContent className="p-6 space-y-8">
                <FormField
                  control={form.control}
                  name="overallRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <div className="flex gap-2">
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
                                  <Star className="h-10 w-10 fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            {field.value === 1 && "Poor"}
                            {field.value === 2 && "Fair"}
                            {field.value === 3 && "Good"}
                            {field.value === 4 && "Very Good"}
                            {field.value === 5 && "Excellent"}
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Submit Feedback 📤
          </Button>
        </div>
      </form>
    </Form>
  )
}