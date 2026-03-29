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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_items: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          source_url: string
          source_name: string
          category: string
          published_at: string | null
          scraped_at: string
          image_url: string | null
          author: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content?: string | null
          source_url: string
          source_name: string
          category?: string
          published_at?: string | null
          scraped_at?: string
          image_url?: string | null
          author?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string | null
          source_url?: string
          source_name?: string
          category?: string
          published_at?: string | null
          scraped_at?: string
          image_url?: string | null
          author?: string | null
          tags?: string[] | null
          created_at?: string
        }
      }
      news_audio: {
        Row: {
          id: string
          news_item_id: string
          voice_type: string
          file_path: string
          file_size: number
          duration_seconds: number
          generated_at: string
        }
        Insert: {
          id?: string
          news_item_id: string
          voice_type: string
          file_path: string
          file_size: number
          duration_seconds: number
          generated_at?: string
        }
        Update: {
          id?: string
          news_item_id?: string
          voice_type?: string
          file_path?: string
          file_size?: number
          duration_seconds?: number
          generated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          course_id: string
          rating: number
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          rating: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          rating?: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_suggestions: {
        Row: {
          id: string
          title: string
          description: string | null
          topic: string | null
          difficulty: string | null
          duration_weeks: number | null
          reason: string | null
          status: string
          suggested_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          topic?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          reason?: string | null
          status?: string
          suggested_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          topic?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          reason?: string | null
          status?: string
          suggested_at?: string
          reviewed_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          instructions: string | null
          starter_code: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          instructions?: string | null
          starter_code?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          instructions?: string | null
          starter_code?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_submissions: {
        Row: {
          id: string
          user_id: string
          project_id: string
          submission_url: string | null
          submission_text: string | null
          files: Json
          status: string
          submitted_at: string
          reviewed_at: string | null
          passed: boolean | null
          feedback: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          submission_url?: string | null
          submission_text?: string | null
          files?: Json
          status?: string
          submitted_at?: string
          reviewed_at?: string | null
          passed?: boolean | null
          feedback?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          submission_url?: string | null
          submission_text?: string | null
          files?: Json
          status?: string
          submitted_at?: string
          reviewed_at?: string | null
          passed?: boolean | null
          feedback?: string | null
        }
      }
      assessments: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          questions: Json
          passing_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          questions?: Json
          passing_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          questions?: Json
          passing_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      assessment_attempts: {
        Row: {
          id: string
          user_id: string
          assessment_id: string
          answers: Json
          score: number
          passed: boolean
          attempt_number: number
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_id: string
          answers?: Json
          score?: number
          passed?: boolean
          attempt_number?: number
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_id?: string
          answers?: Json
          score?: number
          passed?: boolean
          attempt_number?: number
          submitted_at?: string
        }
      }
      learning_paths: {
        Row: {
          id: string
          title: string
          description: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      path_courses: {
        Row: {
          id: string
          path_id: string
          course_id: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          path_id: string
          course_id: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          path_id?: string
          course_id?: string
          order_index?: number
          created_at?: string
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
export type Profile = Database['public']['Tables']['profiles']['Row']
export type NewsItem = Database['public']['Tables']['news_items']['Row']
export type NewsAudio = Database['public']['Tables']['news_audio']['Row']
export type Rating = Database['public']['Tables']['ratings']['Row']
export type CourseSuggestion = Database['public']['Tables']['course_suggestions']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectSubmission = Database['public']['Tables']['project_submissions']['Row']
export type Assessment = Database['public']['Tables']['assessments']['Row']
export type AssessmentAttempt = Database['public']['Tables']['assessment_attempts']['Row']
export type LearningPath = Database['public']['Tables']['learning_paths']['Row']
export type PathCourse = Database['public']['Tables']['path_courses']['Row']

// Insert types
export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewCourse = Database['public']['Tables']['courses']['Insert']
export type NewLesson = Database['public']['Tables']['lessons']['Insert']
export type NewEnrollment = Database['public']['Tables']['enrollments']['Insert']
export type NewProgress = Database['public']['Tables']['progress']['Insert']
export type NewSubscription = Database['public']['Tables']['subscriptions']['Insert']
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type NewNewsItem = Database['public']['Tables']['news_items']['Insert']
export type NewNewsAudio = Database['public']['Tables']['news_audio']['Insert']
export type NewRating = Database['public']['Tables']['ratings']['Insert']
export type NewCourseSuggestion = Database['public']['Tables']['course_suggestions']['Insert']
export type NewProject = Database['public']['Tables']['projects']['Insert']
export type NewProjectSubmission = Database['public']['Tables']['project_submissions']['Insert']
export type NewAssessment = Database['public']['Tables']['assessments']['Insert']
export type NewAssessmentAttempt = Database['public']['Tables']['assessment_attempts']['Insert']
export type NewLearningPath = Database['public']['Tables']['learning_paths']['Insert']
export type NewPathCourse = Database['public']['Tables']['path_courses']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']
export type ProgressUpdate = Database['public']['Tables']['progress']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type NewsItemUpdate = Database['public']['Tables']['news_items']['Update']
export type NewsAudioUpdate = Database['public']['Tables']['news_audio']['Update']
export type RatingUpdate = Database['public']['Tables']['ratings']['Update']
export type CourseSuggestionUpdate = Database['public']['Tables']['course_suggestions']['Update']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type ProjectSubmissionUpdate = Database['public']['Tables']['project_submissions']['Update']
export type AssessmentUpdate = Database['public']['Tables']['assessments']['Update']
export type AssessmentAttemptUpdate = Database['public']['Tables']['assessment_attempts']['Update']
export type LearningPathUpdate = Database['public']['Tables']['learning_paths']['Update']
export type PathCourseUpdate = Database['public']['Tables']['path_courses']['Update']

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
