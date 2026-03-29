// Single Lesson API Route - GET/PUT/DELETE lesson by ID

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
import { UpdateLessonInput } from '@/types/course'

// GET /api/lessons/[id] - Get lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 200)

    const lessonId = params.id

    if (!isValidUUID(lessonId)) {
      return createErrorResponse(
        new Error('Invalid lesson ID'),
        'Validation error',
        400
      )
    }

    const lesson = await db.lessons.getById(lessonId)

    if (!lesson) {
      return createErrorResponse(
        new Error('Lesson not found'),
        'Not found',
        404
      )
    }

    // Check if course is published or user is instructor
    const course = await db.courses.getById(lesson.course_id)

    if (!course.is_published) {
      try {
        const user = await requireAuth(request)
        if (course.instructor_id !== user.id) {
          return createErrorResponse(
            new Error('Lesson not found'),
            'Not found',
            404
          )
        }
      } catch {
        return createErrorResponse(
          new Error('Lesson not found'),
          'Not found',
          404
        )
      }
    }

    // Get user progress if authenticated
    let progress = null
    try {
      const user = await requireAuth(request)
      progress = await db.progress.getByUserAndLesson(user.id, lessonId)
    } catch {
      // Anonymous user - no progress
    }

    const lessonWithProgress = {
      ...lesson,
      progress,
    }

    return createSuccessResponse(lessonWithProgress)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Lesson not found')
    }
    return createErrorResponse(error, 'Failed to fetch lesson')
  }
}

// PUT /api/lessons/[id] - Update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 30)

    const lessonId = params.id

    if (!isValidUUID(lessonId)) {
      return createErrorResponse(
        new Error('Invalid lesson ID'),
        'Validation error',
        400
      )
    }

    const user = await requireAuth(request)
    const lesson = await db.lessons.getById(lessonId)

    if (!lesson) {
      return createErrorResponse(
        new Error('Lesson not found'),
        'Not found',
        404
      )
    }

    // Check course ownership
    const course = await db.courses.getById(lesson.course_id)
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('You do not have permission to update this lesson'),
        'Forbidden',
        403
      )
    }

    const body = await request.json()
    const { week_number, title, content, video_url, resources, estimated_minutes, order_index } = body

    // Build update object
    const updates: UpdateLessonInput = {}

    if (week_number !== undefined) updates.week_number = week_number
    if (title) updates.title = sanitizeInput(title)
    if (content !== undefined) updates.content = content ? sanitizeInput(content) : null
    if (video_url !== undefined) updates.video_url = video_url
    if (resources !== undefined) updates.resources = resources
    if (estimated_minutes !== undefined) updates.estimated_minutes = estimated_minutes
    if (order_index !== undefined) updates.order_index = order_index

    const updatedLesson = await db.lessons.update(lessonId, updates)

    return createSuccessResponse(updatedLesson)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Lesson not found')
    }
    return createErrorResponse(error, 'Failed to update lesson')
  }
}

// DELETE /api/lessons/[id] - Delete lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 10)

    const lessonId = params.id

    if (!isValidUUID(lessonId)) {
      return createErrorResponse(
        new Error('Invalid lesson ID'),
        'Validation error',
        400
      )
    }

    const user = await requireAuth(request)
    const lesson = await db.lessons.getById(lessonId)

    if (!lesson) {
      return createErrorResponse(
        new Error('Lesson not found'),
        'Not found',
        404
      )
    }

    // Check course ownership
    const course = await db.courses.getById(lesson.course_id)
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('You do not have permission to delete this lesson'),
        'Forbidden',
        403
      )
    }

    await db.lessons.delete(lessonId)

    return createSuccessResponse({ message: 'Lesson deleted successfully' })
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Lesson not found')
    }
    return createErrorResponse(error, 'Failed to delete lesson')
  }
}
