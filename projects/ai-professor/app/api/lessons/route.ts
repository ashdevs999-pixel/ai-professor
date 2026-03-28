// Lessons API Route - GET lessons, POST new lesson

import { NextRequest } from 'next/server'
import { db } from '@/lib/supabase'
import { 
  requireAuth, 
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  sanitizeInput,
  isValidUUID,
} from '@/lib/auth'
import { CreateLessonInput } from '@/types/course'

// GET /api/lessons - Get lessons by course
export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, 200)

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    if (!courseId) {
      return createErrorResponse(
        new Error('course_id parameter is required'),
        'Validation error',
        400
      )
    }

    if (!isValidUUID(courseId)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    // Check if course exists and is accessible
    const course = await db.courses.getById(courseId)

    if (!course.is_published) {
      try {
        const user = await requireAuth(request)
        if (course.instructor_id !== user.id) {
          return createErrorResponse(
            new Error('Course not found'),
            'Not found',
            404
          )
        }
      } catch {
        return createErrorResponse(
          new Error('Course not found'),
          'Not found',
          404
        )
      }
    }

    const lessons = await db.lessons.getByCourse(courseId)

    return createSuccessResponse({ lessons })
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Course not found', 404)
    }
    return createErrorResponse(error, 'Failed to fetch lessons')
  }
}

// POST /api/lessons - Create new lesson
export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, 20)

    const user = await requireAuth(request)
    const body = await request.json()

    // Validate input
    const { course_id, week_number, title, content, video_url, resources, estimated_minutes, order_index } = body

    if (!course_id || !isValidUUID(course_id)) {
      return createErrorResponse(
        new Error('Valid course_id is required'),
        'Validation error',
        400
      )
    }

    if (!title || typeof title !== 'string') {
      return createErrorResponse(
        new Error('Title is required'),
        'Validation error',
        400
      )
    }

    if (!week_number || typeof week_number !== 'number' || week_number < 1) {
      return createErrorResponse(
        new Error('Valid week_number is required'),
        'Validation error',
        400
      )
    }

    // Check if user owns the course
    const course = await db.courses.getById(course_id)
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('You do not have permission to add lessons to this course'),
        'Forbidden',
        403
      )
    }

    // Sanitize inputs
    const lessonInput: CreateLessonInput = {
      course_id,
      week_number,
      title: sanitizeInput(title),
      content: content ? sanitizeInput(content) : undefined,
      video_url: video_url || undefined,
      resources: resources || [],
      estimated_minutes: estimated_minutes || 60,
      order_index: order_index || 0,
    }

    const lesson = await db.lessons.create(lessonInput)

    return createSuccessResponse(lesson, 201)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Course not found', 404)
    }
    return createErrorResponse(error, 'Failed to create lesson')
  }
}
