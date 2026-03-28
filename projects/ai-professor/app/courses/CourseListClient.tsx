'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, BookOpen, Star, ChevronRight, Crown } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

interface Course {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration_weeks: number
  lesson_count: number
  image_url?: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      const coursesData = data.data?.courses || data.courses || data || []
      setCourses(Array.isArray(coursesData) ? coursesData : [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Full Courses</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Master AI with comprehensive courses. Text-based lessons, hands-on exercises, real projects.
          </p>
          
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="text-sm">Premium Content</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">{courses.length} Courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={DIFFICULTY_COLORS[course.difficulty] || DIFFICULTY_COLORS.beginner}>
                    {course.difficulty || 'beginner'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration_weeks || 8} weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lesson_count || 10} lessons</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">$14.99</span>
                  <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                    {course.topic}
                  </Badge>
                </div>

                <Link href={`/courses/${course.id}`}>
                  <Button className="w-full group-hover:bg-primary-600 transition-colors">
                    View Course
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new courses!
            </p>
          </div>
        )}

        {/* Free Alternative */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 border-2 border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Not Ready to Commit?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start with our FREE Quick Guides. Hands-on tutorials that take 30 minutes.
            </p>
            <Link href="/guides">
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                Browse Free Guides
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
