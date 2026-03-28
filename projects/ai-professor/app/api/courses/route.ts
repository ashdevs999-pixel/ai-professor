// Courses API Route - GET all courses, POST new course

import { NextRequest } from 'next/server'
import { db, handleSupabaseError } from '@/lib/supabase'
import { 
  requireAuth, 
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  sanitizeInput,
  isValidUUID,
} from '@/lib/auth'
import { CreateCourseInput, CourseListFilters } from '@/types/course'
import { DifficultyLevel } from '@/types/database'

// GET /api/courses - List all courses with filters
export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, 100)

    const { searchParams } = new URL(request.url)
    
    const filters: CourseListFilters = {
      topic: searchParams.get('topic') || undefined,
      difficulty: searchParams.get('difficulty') as DifficultyLevel || undefined,
      is_published: searchParams.get('published') === 'true' ? true : 
                    searchParams.get('published') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
    }

    // Check if user is authenticated to show unpublished courses
    let user = null
    try {
      user = await requireAuth(request)
    } catch {
      // Anonymous user - only show published courses
      filters.is_published = true
    }

    // If instructor_id filter, check ownership
    const instructorId = searchParams.get('instructor_id')
    if (instructorId && user?.id !== instructorId) {
      filters.is_published = true
    }

    const courses = await db.courses.getAll(filters)

    // Add lesson count and enrolled count
    const coursesWithStats = courses.map((course: any) => ({
      ...course,
      lesson_count: course.lessons?.[0]?.count || 0,
      enrolled_count: course.enrollments?.[0]?.count || 0,
      lessons: undefined,
      enrollments: undefined,
    }))

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCourses = coursesWithStats.slice(startIndex, endIndex)

    return createSuccessResponse({
      courses: paginatedCourses,
      pagination: {
        page,
        limit,
        total: courses.length,
        totalPages: Math.ceil(courses.length / limit),
      },
    })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch courses')
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, 10)

    const user = await requireAuth(request)
    const body = await request.json()

    // Validate input
    const { title, description, topic, difficulty, duration_weeks, image_url, is_published } = body

    if (!title || typeof title !== 'string') {
      return createErrorResponse(new Error('Title is required'), 'Validation error', 400)
    }

    if (!topic || typeof topic !== 'string') {
      return createErrorResponse(new Error('Topic is required'), 'Validation error', 400)
    }

    // Sanitize inputs
    const courseInput: CreateCourseInput = {
      title: sanitizeInput(title),
      description: description ? sanitizeInput(description) : undefined,
      topic: sanitizeInput(topic),
      difficulty: difficulty as DifficultyLevel || 'beginner',
      duration_weeks: duration_weeks || 12,
      image_url: image_url || undefined,
      is_published: is_published || false,
    }

    // Create course
    const course = await db.courses.create({
      ...courseInput,
      instructor_id: user.id,
    })

    return createSuccessResponse(course, 201)
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return createErrorResponse(error, 'Course already exists', 409)
    }
    return createErrorResponse(error, 'Failed to create course')
  }
}
