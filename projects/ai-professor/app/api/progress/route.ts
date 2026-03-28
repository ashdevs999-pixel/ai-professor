// Progress API Route - GET/POST user progress

import { NextRequest } from 'next/server'
import { db } from '@/lib/supabase'
import { 
  requireAuth, 
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  isValidUUID,
} from '@/lib/auth'
import { calculateCourseProgress } from '@/types/course'

// GET /api/progress - Get user progress
export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, 200)

    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    
    const courseId = searchParams.get('course_id')

    if (courseId && !isValidUUID(courseId)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    // Get all progress for user
    const allProgress = await db.progress.getByUser(user.id)

    if (courseId) {
      // Filter by course
      const courseProgress = allProgress.filter((p: any) => 
        p.lessons?.course_id === courseId
      )

      // Get course lessons
      const lessons = await db.lessons.getByCourse(courseId)
      const completedLessonIds = courseProgress
        .filter((p: any) => p.completed)
        .map((p: any) => p.lesson_id)

      const progressPercentage = calculateCourseProgress(lessons, completedLessonIds)

      return createSuccessResponse({
        progress: courseProgress,
        percentage: progressPercentage,
        completed_lessons: completedLessonIds.length,
        total_lessons: lessons.length,
      })
    }

    // Get all enrollments with progress
    const enrollments = await db.enrollments.getByUser(user.id)
    
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const course = enrollment.courses
        const lessons = await db.lessons.getByCourse(course.id)
        
        const lessonProgress = allProgress.filter((p: any) =>
          lessons.some((l: any) => l.id === p.lesson_id)
        )

        const completedLessonIds = lessonProgress
          .filter((p: any) => p.completed)
          .map((p: any) => p.lesson_id)

        const progressPercentage = calculateCourseProgress(lessons, completedLessonIds)

        // Find next lesson
        const nextLesson = lessons.find((l: any) => 
          !completedLessonIds.includes(l.id)
        )

        return {
          ...enrollment,
          course: {
            id: course.id,
            title: course.title,
            difficulty: course.difficulty,
          },
          progress_percentage: progressPercentage,
          next_lesson: nextLesson || null,
        }
      })
    )

    return createSuccessResponse({
      progress: allProgress,
      enrollments: enrollmentsWithProgress,
    })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch progress')
  }
}

// POST /api/progress - Update progress
export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, 50)

    const user = await requireAuth(request)
    const body = await request.json()

    const { lesson_id, completed, time_spent_seconds } = body

    if (!lesson_id || !isValidUUID(lesson_id)) {
      return createErrorResponse(
        new Error('Valid lesson_id is required'),
        'Validation error',
        400
      )
    }

    // Verify lesson exists
    const lesson = await db.lessons.getById(lesson_id)
    if (!lesson) {
      return createErrorResponse(
        new Error('Lesson not found'),
        'Not found',
        404
      )
    }

    // Check if user is enrolled in the course
    const enrollments = await db.enrollments.getByUser(user.id)
    const isEnrolled = enrollments.some((e: any) => e.course_id === lesson.course_id)

    if (!isEnrolled) {
      return createErrorResponse(
        new Error('You must be enrolled in the course to track progress'),
        'Forbidden',
        403
      )
    }

    // Update or create progress
    const progressData = {
      user_id: user.id,
      lesson_id,
      completed: completed !== undefined ? completed : false,
      completed_at: completed ? new Date().toISOString() : null,
      time_spent_seconds: time_spent_seconds || 0,
    }

    const progress = await db.progress.upsert(progressData)

    // Check if course is completed
    if (completed) {
      const lessons = await db.lessons.getByCourse(lesson.course_id)
      const allProgress = await db.progress.getByUser(user.id)
      
      const completedLessons = allProgress.filter((p: any) => 
        p.completed && lessons.some((l: any) => l.id === p.lesson_id)
      )

      if (completedLessons.length === lessons.length) {
        // Mark enrollment as complete
        await db.enrollments.markComplete(user.id, lesson.course_id)

        // Send completion email
        try {
          const course = await db.courses.getById(lesson.course_id)
          const { sendEmail, emailTemplates } = await import('@/lib/email')
          const template = emailTemplates.courseCompletion(
            user.email.split('@')[0],
            course.title,
            course.id,
            new Date().toLocaleDateString()
          )

          await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          })
        } catch (error) {
          console.error('Failed to send completion email:', error)
        }
      }
    }

    return createSuccessResponse(progress)
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to update progress')
  }
}
