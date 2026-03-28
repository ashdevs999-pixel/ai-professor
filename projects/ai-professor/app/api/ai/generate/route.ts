// AI Content Generation API Route

import { NextRequest } from 'next/server'
import { 
  requireAuth,
  applyRateLimit, 
  createSuccessResponse, 
  createErrorResponse,
  isValidUUID,
} from '@/lib/auth'
import {
  generateCachedContent,
  generateLessonOutline,
  generateQuiz,
  generateExercises,
  generateLessonContent,
  generateSummary,
} from '@/lib/ai-content'
import { 
  ContentGenerationRequest,
  ContentType,
  LessonOutline,
} from '@/types/course'

// POST /api/ai/generate - Generate AI content
export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, 30)

    const user = await requireAuth(request)
    const body = await request.json()

    const { 
      action, 
      course_id, 
      lesson_id, 
      content_type, 
      context, 
      parameters 
    } = body

    // Validate course_id if provided
    if (course_id && !isValidUUID(course_id)) {
      return createErrorResponse(
        new Error('Invalid course ID'),
        'Validation error',
        400
      )
    }

    // Check subscription tier for AI features
    if (user.subscription_tier === 'free') {
      // Free tier has limited AI generations
      const rateLimit = await applyRateLimit(request, 10)
      // Already handled by applyRateLimit
    }

    switch (action) {
      case 'generate_content': {
        if (!course_id || !content_type) {
          return createErrorResponse(
            new Error('course_id and content_type are required'),
            'Validation error',
            400
          )
        }

        const request: ContentGenerationRequest = {
          course_id,
          content_type: content_type as ContentType,
          context,
          parameters,
        }

        const result = await generateCachedContent(request, user.id)

        return createSuccessResponse(result)
      }

      case 'generate_outline': {
        if (!course_id || !parameters?.topic) {
          return createErrorResponse(
            new Error('course_id and topic are required'),
            'Validation error',
            400
          )
        }

        const outline = await generateLessonOutline(
          course_id,
          parameters.topic,
          parameters.objectives,
          user.id
        )

        return createSuccessResponse({
          content_type: 'lesson_outline',
          content: outline,
        })
      }

      case 'generate_quiz': {
        if (!course_id || !lesson_id || !parameters?.topic) {
          return createErrorResponse(
            new Error('course_id, lesson_id, and topic are required'),
            'Validation error',
            400
          )
        }

        const quiz = await generateQuiz(
          course_id,
          lesson_id,
          parameters.topic,
          parameters.questionCount || 5,
          parameters.difficulty || 'medium'
        )

        return createSuccessResponse({
          content_type: 'quiz',
          content: quiz,
        })
      }

      case 'generate_exercises': {
        if (!course_id || !parameters?.topic) {
          return createErrorResponse(
            new Error('course_id and topic are required'),
            'Validation error',
            400
          )
        }

        const exercises = await generateExercises(
          course_id,
          parameters.topic,
          parameters.count || 3,
          parameters.difficulty || 'medium'
        )

        return createSuccessResponse({
          content_type: 'exercises',
          content: exercises,
        })
      }

      case 'generate_lesson_content': {
        if (!course_id || !lesson_id || !parameters?.outline) {
          return createErrorResponse(
            new Error('course_id, lesson_id, and outline are required'),
            'Validation error',
            400
          )
        }

        const content = await generateLessonContent(
          course_id,
          lesson_id,
          parameters.outline as LessonOutline,
          parameters.previousLessons
        )

        return createSuccessResponse({
          content_type: 'lesson_content',
          content,
        })
      }

      case 'generate_summary': {
        if (!course_id || !parameters?.content) {
          return createErrorResponse(
            new Error('course_id and content are required'),
            'Validation error',
            400
          )
        }

        const summary = await generateSummary(course_id, parameters.content)

        return createSuccessResponse({
          content_type: 'summary',
          content: summary,
        })
      }

      default:
        return createErrorResponse(
          new Error('Invalid action'),
          'Bad request',
          400
        )
    }
  } catch (error: any) {
    if (error.message?.includes('rate limit')) {
      return createErrorResponse(error, 'Rate limit exceeded', 429)
    }
    return createErrorResponse(error, 'Failed to generate content')
  }
}

// GET /api/ai/generate - Get content types and limits
export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, 100)

    const user = await requireAuth(request)

    const contentTypes: Record<ContentType, { name: string; description: string }> = {
      lesson_outline: {
        name: 'Lesson Outline',
        description: 'Generate a structured outline for a lesson',
      },
      lesson_content: {
        name: 'Lesson Content',
        description: 'Generate comprehensive lesson content',
      },
      quiz: {
        name: 'Quiz',
        description: 'Generate assessment questions',
      },
      summary: {
        name: 'Summary',
        description: 'Generate a concise summary',
      },
      exercises: {
        name: 'Exercises',
        description: 'Generate practical exercises',
      },
      resources: {
        name: 'Resources',
        description: 'Recommend learning resources',
      },
    }

    const limits = {
      free: {
        daily_limit: 10,
        features: ['summary'],
      },
      basic: {
        daily_limit: 50,
        features: ['lesson_outline', 'summary', 'exercises'],
      },
      pro: {
        daily_limit: 500,
        features: Object.keys(contentTypes),
      },
      enterprise: {
        daily_limit: null, // unlimited
        features: Object.keys(contentTypes),
      },
    }

    return createSuccessResponse({
      content_types: contentTypes,
      user_tier: user.subscription_tier,
      limits: limits[user.subscription_tier as keyof typeof limits],
    })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch AI info')
  }
}
