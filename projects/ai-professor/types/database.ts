// Database Types - Generated from Supabase Schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          subscription_tier: SubscriptionTier
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          topic: string
          difficulty: DifficultyLevel
          duration_weeks: number
          image_url: string | null
          instructor_id: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          topic: string
          difficulty?: DifficultyLevel
          duration_weeks?: number
          image_url?: string | null
          instructor_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          topic?: string
          difficulty?: DifficultyLevel
          duration_weeks?: number
          image_url?: string | null
          instructor_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          week_number: number
          title: string
          content: string | null
          video_url: string | null
          resources: Json
          estimated_minutes: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          week_number: number
          title: string
          content?: string | null
          video_url?: string | null
          resources?: Json
          estimated_minutes?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          week_number?: number
          title?: string
          content?: string | null
          video_url?: string | null
          resources?: Json
          estimated_minutes?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed?: boolean
          completed_at?: string | null
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          time_spent_seconds: number
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          time_spent_seconds?: number
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          time_spent_seconds?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string | null
          tier: SubscriptionTier
          status: SubscriptionStatus
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id?: string | null
          tier: SubscriptionTier
          status: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string | null
          tier?: SubscriptionTier
          status?: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ai_content_cache: {
        Row: {
          id: string
          course_id: string | null
          content_type: string
          prompt_hash: string
          content: Json
          model: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          content_type: string
          prompt_hash: string
          content: Json
          model?: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          course_id?: string | null
          content_type?: string
          prompt_hash?: string
          content?: Json
          model?: string
          created_at?: string
          expires_at?: string | null
        }
      }
      weekly_research: {
        Row: {
          id: string
          course_id: string
          week_number: number
          topic: string
          summary: string
          sources: Json
          generated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          week_number: number
          topic: string
          summary: string
          sources?: Json
          generated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          week_number?: number
          topic?: string
          summary?: string
          sources?: Json
          generated_at?: string
        }
      }
    }
    Enums: {
      subscription_tier: SubscriptionTier
      subscription_status: SubscriptionStatus
      difficulty_level: DifficultyLevel
    }
  }
}

// Enum types
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type AIContentCache = Database['public']['Tables']['ai_content_cache']['Row']
export type WeeklyResearch = Database['public']['Tables']['weekly_research']['Row']

// Insert types
export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewCourse = Database['public']['Tables']['courses']['Insert']
export type NewLesson = Database['public']['Tables']['lessons']['Insert']
export type NewEnrollment = Database['public']['Tables']['enrollments']['Insert']
export type NewProgress = Database['public']['Tables']['progress']['Insert']
export type NewSubscription = Database['public']['Tables']['subscriptions']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']
export type ProgressUpdate = Database['public']['Tables']['progress']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

// Extended types with relations
export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export interface CourseWithProgress extends Course {
  lessons: Lesson[]
  progress_percentage: number
  enrolled_at: string
  completed: boolean
}

export interface UserWithSubscription extends User {
  subscription: Subscription | null
}

export interface LessonWithProgress extends Lesson {
  progress: Progress | null
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
