'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, DollarSign, CheckCircle, ChevronRight } from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'

export default function CourseDetailClient({ courseId }: { courseId: string }) {
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to fetch course')
      return json.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h1>
          <Link href="/courses"><Button>Back to Courses</Button></Link>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'info'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              {course.difficulty && (
                <Badge variant={getDifficultyColor(course.difficulty) as any}>
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </Badge>
              )}
              {course.topic && <Badge variant="info">{course.topic}</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-white/80 mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.lesson_count || course.lessons?.length || 0} lessons</span>
              </div>
              {course.duration_weeks && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing & Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Card */}
          <Card className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">$14.99</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Included free with program purchase
                </p>
              </div>
              <Button size="lg">Join Waitlist</Button>
            </div>
          </Card>

          {/* Lessons List */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Lessons</h2>
          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3">
              {course.lessons.map((lesson: any, index: number) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                    <Card className="p-4 hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lesson.description}</p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No lessons available yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
