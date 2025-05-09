"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Search, TrendingUp, BookOpen, ExternalLink, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Source {
  name: string
  url: string
}

interface Trend {
  title: string
  description: string
  sources: Source[]
  relevance?: number
}

interface TrendsResponse {
  trends: Trend[]
}

export default function AcademicTrendsPage() {
  const [skills, setSkills] = useState("")
  const [trends, setTrends] = useState<TrendsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchTrends = async () => {
    if (!skills.trim()) {
      setError("Please enter at least one skill")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get<TrendsResponse>(`http://localhost:8000/api/trends?skills=${encodeURIComponent(skills)}`)
      setTrends(response.data)
    } catch (err) {
      setError("Error fetching trends. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchTrends()
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-50">
          Academic Trends Explorer
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover the latest academic trends and research directions related to your skills and interests
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Search Trends</CardTitle>
          <CardDescription>Enter skills or topics separated by commas to find relevant academic trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="AI, machine learning, data science..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
                disabled={isLoading}
              />
            </div>
            <Button onClick={fetchTrends} disabled={isLoading || !skills.trim()} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  Find Trends
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && trends && trends.trends && trends.trends.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Results
              <Badge variant="outline" className="ml-2">
                {trends.trends.length} trends found
              </Badge>
            </h2>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {trends.trends.map((trend, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{trend.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.split(",").map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{trend.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">Sources:</span>
                  </div>
                  <ul className="space-y-1 w-full">
                    {trend.sources.map((source, idx) => (
                      <li key={idx} className="text-sm">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && trends && trends.trends && trends.trends.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center text-slate-500">
              <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-xl font-medium mb-2">No trends found</h3>
              <p className="max-w-md mx-auto">
                We couldn't find any academic trends matching your search. Try different keywords or broaden your search
                terms.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !trends && !error && (
        <Card className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-dashed">
          <CardContent>
            <div className="flex flex-col items-center justify-center text-slate-500">
              <Search className="h-16 w-16 mb-6 opacity-20" />
              <h3 className="text-xl font-medium mb-3">Start exploring academic trends</h3>
              <p className="max-w-md mx-auto">
                Enter skills or topics of interest in the search box above to discover relevant academic trends and
                research directions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
