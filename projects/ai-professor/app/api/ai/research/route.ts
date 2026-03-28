// AI Research API Route - Weekly research updates

import { NextRequest } from 'next/server'
import { db } from '@/lib/supabase'
import { 
  requireAuth, 
  requireTier,
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  isValidUUID,
} from '@/lib/auth'
import { generateResearchUpdate } from '@/lib/ai-content'
import { ResearchRequest } from '@/types/course'

// POST /api/ai/research - Generate research update
export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, 10)

    // Require at least Pro tier for research updates
    const user = await requireTier(request, 'pro')
    const body = await request.json()

    const { course_id, week_number, topic, depth } = body

    // Validate inputs
    if (!course_id || !isValidUUID(course_id)) {
      return createErrorResponse(
        new Error('Valid course_id is required'),
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

    if (!topic || typeof topic !== 'string') {
      return createErrorResponse(
        new Error('Topic is required'),
        'Validation error',
        400
      )
    }

    // Verify user has access to this course (enrolled or instructor)
    const course = await db.courses.getById(course_id)
    
    if (!course) {
      return createErrorResponse(
        new Error('Course not found'),
        'Not found',
        404
      )
    }

    const enrollments = await db.enrollments.getByUser(user.id)
    const isEnrolled = enrollments.some((e: any) => e.course_id === course_id)
    const isInstructor = course.instructor_id === user.id

    if (!isEnrolled && !isInstructor) {
      return createErrorResponse(
        new Error('You do not have access to this course'),
        'Forbidden',
        403
      )
    }

    // Generate research update
    const researchRequest: ResearchRequest = {
      course_id,
      week_number,
      topic,
      depth: depth || 'detailed',
    }

    const research = await generateResearchUpdate(researchRequest)

    return createSuccessResponse(research)
  } catch (error: any) {
    if (error.message?.includes('rate limit')) {
      return createErrorResponse(error, 'Rate limit exceeded', 429)
    }
    return createErrorResponse(error, 'Failed to generate research')
  }
}

// GET /api/ai/research - Get existing research updates
export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, 100)

    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    
    const courseId = searchParams.get('course_id')
    const weekNumber = searchParams.get('week_number')

    if (!courseId || !isValidUUID(courseId)) {
      return createErrorResponse(
        new Error('Valid course_id is required'),
        'Validation error',
        400
      )
    }

    // Verify access
    const enrollments = await db.enrollments.getByUser(user.id)
    const isEnrolled = enrollments.some((e: any) => e.course_id === courseId)

    if (!isEnrolled && user.subscription_tier === 'free') {
      return createErrorResponse(
        new Error('Research updates require Pro subscription'),
        'Forbidden',
        403
      )
    }

    // Get research from database
    const { data, error } = await db.supabase
      .from('weekly_research')
      .select('*')
      .eq('course_id', courseId)
      .order('week_number', { ascending: true })

    if (error) {
      throw error
    }

    // Filter by week if specified
    let research = data
    if (weekNumber) {
      research = data.filter((r: any) => r.week_number === parseInt(weekNumber))
    }

    // Format response
    const formattedResearch = research.map((r: any) => ({
      course_id: r.course_id,
      week_number: r.week_number,
      topic: r.topic,
      summary: r.summary,
      key_insights: r.sources?.key_insights || [],
      sources: r.sources?.sources || [],
      recommended_reading: r.sources?.recommended_reading || [],
      generated_at: r.generated_at,
    }))

    return createSuccessResponse({
      research: formattedResearch,
    })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch research')
  }
}

// PUT /api/ai/research - Regenerate research update
export async function PUT(request: NextRequest) {
  try {
    await applyRateLimit(request, 5)

    const user = await requireTier(request, 'pro')
    const body = await request.json()

    const { course_id, week_number, topic, depth } = body

    if (!course_id || !week_number || !topic) {
      return createErrorResponse(
        new Error('course_id, week_number, and topic are required'),
        'Validation error',
        400
      )
    }

    // Verify instructor ownership
    const course = await db.courses.getById(course_id)
    
    if (course.instructor_id !== user.id) {
      return createErrorResponse(
        new Error('Only instructors can regenerate research updates'),
        'Forbidden',
        403
      )
    }

    // Delete existing research
    await db.supabase
      .from('weekly_research')
      .delete()
      .eq('course_id', course_id)
      .eq('week_number', week_number)

    // Generate new research
    const researchRequest: ResearchRequest = {
      course_id,
      week_number,
      topic,
      depth: depth || 'detailed',
    }

    const research = await generateResearchUpdate(researchRequest)

    return createSuccessResponse({
      message: 'Research regenerated successfully',
      research,
    })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to regenerate research')
  }
}
