'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, ChevronRight, ChevronLeft, CheckCircle, ExternalLink } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import ReactMarkdown from 'react-markdown'

interface Lesson {
  id: string
  title: string
  content: string
  week_number: number
  order_index: number
  estimated_minutes?: number
  resources?: { url: string; type: string; title: string }[]
  video_url?: string
}

interface Course {
  id: string
  title: string
  lessons: { id: string; title: string; order_index: number }[]
}

interface Props {
  lesson: Lesson | null
  course: Course | null
  courseId: string
}

export default function LessonClient({ lesson, course, courseId }: Props) {
  const router = useRouter()

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
          <Link href={`/courses/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Find previous and next lessons
  const lessons = course?.lessons || []
  const currentIndex = lessons.findIndex(l => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to {course?.title || 'Course'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 font-bold text-xl">
              {lesson.week_number}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimated_minutes || 60} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Week {lesson.week_number}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video if available */}
          {lesson.video_url && (
            <div className="mb-8 aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <iframe 
                src={lesson.video_url} 
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </Card>

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-3">
              {lesson.resources.map((resource, i) => (
                <a 
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{resource.title}</div>
                    <div className="text-sm text-gray-500 capitalize">{resource.type}</div>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {prevLesson ? (
            <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
              <Button>
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Course Complete!</span>
              </div>
              <Link href="/courses">
                <Button>Browse More Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
