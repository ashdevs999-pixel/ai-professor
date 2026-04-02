'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, DollarSign, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function PathDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: pathData, isLoading, error } = useQuery({
    queryKey: ['path', slug],
    queryFn: async () => {
      const res = await fetch(`/api/paths?slug=${slug}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to fetch path')
      return json.data?.path
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

  if (error || !pathData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Program not found</h1>
          <Link href="/paths"><Button>Browse Programs</Button></Link>
        </div>
      </div>
    )
  }

  const courses = (pathData.path_courses || []).map((pc: any) => pc.courses).filter(Boolean)
  const totalLessons = courses.length // Approximation
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
          <Link href="/paths" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Programs
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GraduationCap className="w-12 h-12 mb-4 opacity-90" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{pathData.title}</h1>
            <p className="text-lg text-white/80 mb-6 max-w-3xl">{pathData.description}</p>
            <div className="flex items-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{courses.length} modules</span>
              </div>
              {pathData.difficulty && (
                <Badge variant={getDifficultyColor(pathData.difficulty) as any} className="text-sm">
                  {pathData.difficulty.charAt(0).toUpperCase() + pathData.difficulty.slice(1)}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">$49.99</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  All modules included with program purchase
                </p>
              </div>
              <Button size="lg">Enroll Now</Button>
            </div>
          </Card>

          {/* Module List */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Program Modules</h2>
          <div className="space-y-4">
            {courses.map((course: any, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-lg shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{course.title}</h3>
                        {course.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {course.difficulty && (
                            <Badge variant={getDifficultyColor(course.difficulty) as any}>
                              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                            </Badge>
                          )}
                          {course.duration_weeks && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration_weeks} weeks</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0 mt-1" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {courses.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No modules available yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
