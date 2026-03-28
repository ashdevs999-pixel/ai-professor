// Validation Schemas using Zod

import { z } from 'zod'
import { DifficultyLevel } from '../types/database'

// Course validation
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  topic: z.string().min(2, 'Topic is required').max(100),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  duration_weeks: z.number().int().min(1).max(52).optional(),
  image_url: z.string().url().optional(),
  is_published: z.boolean().optional(),
})

export const updateCourseSchema = createCourseSchema.partial()

// Lesson validation
export const createLessonSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
  week_number: z.number().int().min(1, 'Week number must be at least 1'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().max(50000).optional(),
  video_url: z.string().url().optional().nullable(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['article', 'video', 'book', 'tool', 'other']),
    description: z.string().optional(),
  })).optional(),
  estimated_minutes: z.number().int().min(1).max(480).optional(),
  order_index: z.number().int().min(0).optional(),
})

export const updateLessonSchema = createLessonSchema.partial().omit({ course_id: true })

// Progress validation
export const updateProgressSchema = z.object({
  lesson_id: z.string().uuid('Invalid lesson ID'),
  completed: z.boolean().optional(),
  time_spent_seconds: z.number().int().min(0).max(86400).optional(), // Max 24 hours
})

// Subscription validation
export const checkoutSchema = z.object({
  action: z.literal('checkout'),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']),
  billing_interval: z.enum(['month', 'year']),
})

export const cancelSubscriptionSchema = z.object({
  action: z.literal('cancel'),
})

export const reactivateSubscriptionSchema = z.object({
  action: z.literal('reactivate'),
})

export const updateSubscriptionSchema = z.object({
  action: z.literal('update'),
  price_id: z.string().startsWith('price_', 'Invalid price ID'),
})

export const subscriptionActionSchema = z.discriminatedUnion('action', [
  checkoutSchema,
  cancelSubscriptionSchema,
  reactivateSubscriptionSchema,
  updateSubscriptionSchema,
])

// AI Generation validation
export const generateContentSchema = z.object({
  action: z.literal('generate_content'),
  course_id: z.string().uuid(),
  content_type: z.enum([
    'lesson_outline',
    'lesson_content',
    'quiz',
    'summary',
    'exercises',
    'resources',
  ]),
  context: z.string().max(5000).optional(),
  parameters: z.record(z.any()).optional(),
})

export const generateOutlineSchema = z.object({
  action: z.literal('generate_outline'),
  course_id: z.string().uuid(),
  parameters: z.object({
    topic: z.string().min(3).max(200),
    objectives: z.array(z.string()).optional(),
  }),
})

export const generateQuizSchema = z.object({
  action: z.literal('generate_quiz'),
  course_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  parameters: z.object({
    topic: z.string().min(3).max(200),
    questionCount: z.number().int().min(1).max(20).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
})

export const generateExercisesSchema = z.object({
  action: z.literal('generate_exercises'),
  course_id: z.string().uuid(),
  parameters: z.object({
    topic: z.string().min(3).max(200),
    count: z.number().int().min(1).max(10).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
})

export const generateLessonContentSchema = z.object({
  action: z.literal('generate_lesson_content'),
  course_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  parameters: z.object({
    outline: z.object({
      title: z.string(),
      objectives: z.array(z.string()),
      topics: z.array(z.string()),
      estimated_time: z.number(),
    }),
    previousLessons: z.array(z.string()).optional(),
  }),
})

export const generateSummarySchema = z.object({
  action: z.literal('generate_summary'),
  course_id: z.string().uuid(),
  parameters: z.object({
    content: z.string().min(50, 'Content too short'),
  }),
})

export const aiGenerationSchema = z.discriminatedUnion('action', [
  generateContentSchema,
  generateOutlineSchema,
  generateQuizSchema,
  generateExercisesSchema,
  generateLessonContentSchema,
  generateSummarySchema,
])

// Research validation
export const researchSchema = z.object({
  course_id: z.string().uuid(),
  week_number: z.number().int().min(1).max(52),
  topic: z.string().min(3).max(200),
  depth: z.enum(['brief', 'detailed', 'comprehensive']).optional(),
})

// Enrollment validation
export const enrollmentSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
})

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character')

// User registration validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2).max(100).optional(),
})

// Validation helper function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    throw new ValidationError(
      'Validation failed',
      result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }))
    )
  }
  
  return result.data
}

// Custom validation error
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
