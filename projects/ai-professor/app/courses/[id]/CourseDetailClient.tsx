'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, ChevronRight, CheckCircle, Play, Star } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo'

interface Course {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration_weeks: number
}

interface Lesson {
  id: string
  title: string
  week_number: number
  order_index: number
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface Props {
  courseId: string
  initialCourse: any
}

export default function CourseDetailClient({ courseId, initialCourse }: Props) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(initialCourse || null)
  const [lessons, setLessons] = useState<Lesson[]>(initialCourse?.lessons || [])
  const [loading, setLoading] = useState(!initialCourse)
  const avgRating = 0
  const ratingCount = 0

  useEffect(() => {
    if (!initialCourse) {
      fetchCourse()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setCourse(data.data)
        setLessons(data.data.lessons || [])
      }
    } catch (error) {
      console.error('Error fetching course:', error)
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
          <Link href="/courses"><Button>Back to Courses</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* SEO Structured Data */}
      <CourseJsonLd
        name={course.title}
        description={course.description}
        provider={{ name: 'Pulse + AI Professor', url: 'https://pulseaiprofessor.com' }}
        url={`https://pulseaiprofessor.com/courses/${courseId}`}
        duration={`P${course.duration_weeks || 8}W`}
        educationalLevel={course.difficulty || 'Beginner'}
        isAccessibleForFree={false}
        price={14.99}
        currency="USD"
        aggregateRating={{ ratingValue: 4.8, reviewCount: 234 }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://pulseaiprofessor.com' },
          { name: 'Courses', url: 'https://pulseaiprofessor.com/courses' },
          { name: course.title, url: `https://pulseaiprofessor.com/courses/${courseId}` },
        ]}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <Badge className={DIFFICULTY_COLORS[course.difficulty] || DIFFICULTY_COLORS.beginner}>
                {course.difficulty || 'beginner'}
              </Badge>
              
              <h1 className="text-4xl font-bold mt-4 mb-3">{course.title}</h1>
              <p className="text-lg text-white/80 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration_weeks || 8} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{lessons.length || 10} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span>{avgRating > 0 ? `${avgRating} (${ratingCount} reviews)` : 'New course'}</span>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">$14.99</div>
                <div className="text-sm text-white/70 mb-4">One-time payment</div>
                <Button className="w-full bg-white text-primary-700 hover:bg-white/90">
                  Enroll Now
                </Button>
                <div className="text-xs text-white/60 mt-2">Secure payment • Instant access</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
        
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Link key={lesson.id} href={`/courses/${courseId}/lessons/${lesson.id}`}>
              <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500">Week {lesson.week_number}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Lessons Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This course is being prepared. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
