// Single Course API Route - GET/PUT/DELETE course by ID

import { NextRequest } from 'next/server'
import { db, handleSupabaseError } from '@/lib/supabase'
import { 
  requireAuth, 
  requireResourceOwnership,
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  sanitizeInput,
  isValidUUID,
} from '@/lib/auth'
import { UpdateCourseInput } from '@/types/course'

// Helper to validate course ID
function validateCourseId(id: string): boolean {
  return isValidUUID(id)
}

// GET /api/courses/[id] - Get course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 200)

    const courseId = params.id

    if (!validateCourseId(courseId)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    const course = await db.courses.getById(courseId)

    // Check if course is published or user is instructor
    if (!course.is_published) {
      let user = null
      try {
        user = await requireAuth(request)
      } catch {
        return createErrorResponse(
          new Error('Course not found'),
          'Not found',
          404
        )
      }

      if (course.instructor_id !== user.id) {
        return createErrorResponse(
          new Error('Course not found'),
          'Not found',
          404
        )
      }
    }

    // Get lessons with proper ordering
    const lessons = await db.lessons.getByCourse(courseId)
    const { count: enrolledCount } = await db.enrollments.getByUser(courseId)

    const courseWithStats = {
      ...course,
      lessons: lessons, // Include properly ordered lessons
      lesson_count: lessons.length,
      enrolled_count: enrolledCount || 0,
    }

    return createSuccessResponse(courseWithStats)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Course not found')
    }
    return createErrorResponse(error, 'Failed to fetch course')
  }
}

// PUT /api/courses/[id] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 20)

    const courseId = params.id

    if (!validateCourseId(courseId)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    const user = await requireAuth(request)
    const course = await db.courses.getById(courseId)

    // Check ownership
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('You do not have permission to update this course'),
        'Forbidden',
        403
      )
    }

    const body = await request.json()
    const { title, description, topic, difficulty, duration_weeks, image_url, is_published } = body

    // Build update object
    const updates: UpdateCourseInput = {}

    if (title) updates.title = sanitizeInput(title)
    if (description !== undefined) updates.description = description ? sanitizeInput(description) : null
    if (topic) updates.topic = sanitizeInput(topic)
    if (difficulty) updates.difficulty = difficulty
    if (duration_weeks !== undefined) updates.duration_weeks = duration_weeks
    if (image_url !== undefined) updates.image_url = image_url
    if (is_published !== undefined) updates.is_published = is_published

    const updatedCourse = await db.courses.update(courseId, updates)

    return createSuccessResponse(updatedCourse)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Course not found')
    }
    return createErrorResponse(error, 'Failed to update course')
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await applyRateLimit(request, 10)

    const courseId = params.id

    if (!validateCourseId(courseId)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    const user = await requireAuth(request)
    const course = await db.courses.getById(courseId)

    // Check ownership
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('You do not have permission to delete this course'),
        'Forbidden',
        403
      )
    }

    await db.courses.delete(courseId)

    return createSuccessResponse({ message: 'Course deleted successfully' })
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return createErrorResponse(error, 'Course not found')
    }
    return createErrorResponse(error, 'Failed to delete course')
  }
}
