// Course Types

import { DifficultyLevel, Lesson, Course as DBCourse } from './database'

export interface Course extends DBCourse {
  instructor?: {
    id: string
    email: string
  }
  lesson_count?: number
  enrolled_count?: number
}

export interface CourseListFilters {
  topic?: string
  difficulty?: DifficultyLevel
  is_published?: boolean
  instructor_id?: string
  search?: string
}

export interface CreateCourseInput {
  title: string
  description?: string
  topic: string
  difficulty?: DifficultyLevel
  duration_weeks?: number
  image_url?: string
  is_published?: boolean
}

export interface UpdateCourseInput {
  title?: string
  description?: string
  topic?: string
  difficulty?: DifficultyLevel
  duration_weeks?: number
  image_url?: string
  is_published?: boolean
}

export interface CreateLessonInput {
  course_id: string
  week_number: number
  title: string
  content?: string
  video_url?: string
  resources?: LessonResource[]
  estimated_minutes?: number
  order_index?: number
}

export interface UpdateLessonInput {
  week_number?: number
  title?: string
  content?: string
  video_url?: string
  resources?: LessonResource[]
  estimated_minutes?: number
  order_index?: number
}

export interface LessonResource {
  title: string
  url: string
  type: 'article' | 'video' | 'book' | 'tool' | 'other'
  description?: string
  resources?: Json
    estimated_minutes?: number
    order_index?: number
    created_at?: string
    updated_at?: string
  }

export interface CourseSyllabus {
  course: Course
  weeks: Array<{
    week_number: number
    lessons: Lesson[]
    total_time_minutes: number
  }>
}

// AI Content Generation Types
export interface ContentGenerationRequest {
  course_id: string
  content_type: ContentType
  context?: string
  parameters?: Record<string, any>
}

export type ContentType =
  | 'lesson_outline'
  | 'lesson_content'
  | 'quiz'
  | 'summary'
  | 'exercises'
  | 'resources'

export interface GeneratedContent {
  content_type: ContentType
  content: any
  metadata?: {
    model: string
    tokens_used: number
    generation_time_ms: number
  }
}

export interface LessonOutline {
  title: string
  objectives: string[]
  topics: string[]
  estimated_time: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface Quiz {
  title: string
  questions: QuizQuestion[]
  passing_score: number
}

export interface Exercise {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_time: number
  hints: string[]
  solution?: string
}

// Research Types
export interface ResearchRequest {
  course_id: string
  week_number: number
  topic: string
  depth?: 'brief' | 'detailed' | 'comprehensive'
}

export interface ResearchSource {
  title: string
  url?: string
  author?: string
  published_date?: string
  type: 'paper' | 'article' | 'book' | 'documentation' | 'other'
}

export interface ResearchUpdate {
  course_id: string
  week_number: number
  topic: string
  summary: string
  key_insights: string[]
  sources: ResearchSource[]
  recommended_reading: string[]
}

// Course Analytics
export interface CourseAnalytics {
  course_id: string
  total_enrollments: number
  active_students: number
  completion_rate: number
  average_rating: number
  average_completion_time_days: number
  lesson_analytics: Array<{
    lesson_id: string
    lesson_title: string
    completion_rate: number
    average_time_spent_seconds: number
    drop_off_rate: number
  }>
}

// Enrollment Types
export interface EnrollInCourseInput {
  course_id: string
}

export interface EnrollmentWithCourse {
  id: string
  course_id: string
  enrolled_at: string
  completed: boolean
  completed_at: string | null
  course: Course
  progress_percentage: number
  next_lesson?: Lesson
}

// Validation schemas
export const TOPICS = [
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'Blockchain',
  'Product Management',
  'UX/UI Design',
  'Business Strategy',
  'Digital Marketing',
  'Finance',
  'Leadership',
] as const

export type Topic = (typeof TOPICS)[number]

export function isValidTopic(topic: string): topic is Topic {
  return TOPICS.includes(topic as Topic)
}

// Helper functions
export function calculateCourseProgress(
  lessons: Lesson[],
  completedLessonIds: string[]
): number {
  if (lessons.length === 0) return 0
  const completedCount = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length
  return Math.round((completedCount / lessons.length) * 100)
}

export function getDifficultyLevel(level: number): DifficultyLevel {
  if (level <= 3) return 'beginner'
  if (level <= 6) return 'intermediate'
  if (level <= 8) return 'advanced'
  return 'expert'
}
