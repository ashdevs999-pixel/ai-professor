// Supabase Client Configuration
// Uses function-based initialization to avoid build-time errors

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { 
  Database,
  User, Course, Lesson, Enrollment, Progress, Subscription,
  AIContentCache, WeeklyResearch, Profile, NewsItem, NewsAudio,
  Rating, CourseSuggestion, Project, ProjectSubmission, Assessment,
  AssessmentAttempt, LearningPath, PathCourse,
  NewUser, NewCourse, NewLesson, NewEnrollment, NewProgress, NewSubscription,
  NewProfile, NewNewsItem, NewNewsAudio, NewRating, NewCourseSuggestion,
  NewProject, NewProjectSubmission, NewAssessment, NewAssessmentAttempt,
  NewLearningPath, NewPathCourse,
  UserUpdate, CourseUpdate, LessonUpdate, ProgressUpdate, SubscriptionUpdate,
  ProfileUpdate, RatingUpdate, CourseSuggestionUpdate
} from '../types/database'

// Cached clients
let _supabase: SupabaseClient<Database> | null = null
let _supabaseAdmin: SupabaseClient<Database> | null = null

// Get Supabase URL with fallback
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  return url
}

// Get anon key with fallback
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  return key
}

// Get service role key with fallback
function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return key
}

// Get or create the browser/client-side Supabase client
export function getSupabase(): SupabaseClient<Database> {
  if (!_supabase) {
    _supabase = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      }
    )
  }
  return _supabase
}

// Get or create the admin Supabase client
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseServiceKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return _supabaseAdmin
}

// Legacy exports for backwards compatibility (lazy getters)
export const supabase = {
  get auth() { return getSupabase().auth },
  get from() { return getSupabase().from.bind(getSupabase()) },
  get rpc() { return getSupabase().rpc.bind(getSupabase()) },
  get storage() { return getSupabase().storage },
  get realtime() { return getSupabase().realtime },
  get functions() { return getSupabase().functions },
}

export const supabaseAdmin = {
  get auth() { return getSupabaseAdmin().auth },
  get from() { return getSupabaseAdmin().from.bind(getSupabaseAdmin()) },
  get rpc() { return getSupabaseAdmin().rpc.bind(getSupabaseAdmin()) },
  get storage() { return getSupabaseAdmin().storage },
  get realtime() { return getSupabaseAdmin().realtime },
  get functions() { return getSupabaseAdmin().functions },
}

// Helper function to get user from request
export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  const admin = getSupabaseAdmin()
  const { data: { user }, error } = await admin.auth.getUser(token)
  
  if (error || !user) {
    return null
  }

  return user
}

// Extended types for joined queries
export interface CourseWithLessonsAndCounts extends Course {
  lessons: Lesson[]
  lessons_count?: number
  enrollments_count?: number
}

export interface EnrollmentWithCourse extends Enrollment {
  courses: Course
}

export interface ProgressWithLesson extends Progress {
  lessons: Lesson
}

export interface RatingWithProfile extends Rating {
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

export interface CourseSuggestionRow extends CourseSuggestion {}

// Database query helpers
export const db = {
  // Direct Supabase admin access for advanced queries
  supabase: {
    get from() { return getSupabaseAdmin().from.bind(getSupabaseAdmin()) },
    get rpc() { return getSupabaseAdmin().rpc.bind(getSupabaseAdmin()) },
    get auth() { return getSupabaseAdmin().auth },
  },

  // User operations
  users: {
    async getById(id: string): Promise<User> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByEmail(email: string): Promise<User> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: UserUpdate): Promise<User> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
  },

  // Course operations
  courses: {
    async getAll(filters?: Record<string, any>): Promise<CourseWithLessonsAndCounts[]> {
      const admin = getSupabaseAdmin()
      let query = admin
        .from('courses')
        .select(`
          *,
          lessons(count),
          enrollments(count)
        `)
        .order('created_at', { ascending: false })

      if (filters?.topic) {
        query = query.eq('topic', filters.topic)
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }
      if (filters?.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published)
      }
      if (filters?.instructor_id) {
        query = query.eq('instructor_id', filters.instructor_id)
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<CourseWithLessonsAndCounts> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('courses')
        .select(`
          *,
          lessons(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(course: NewCourse): Promise<Course> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('courses')
        .insert(course)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: CourseUpdate): Promise<Course> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const admin = getSupabaseAdmin()
      const { error } = await admin
        .from('courses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
  },

  // Lesson operations
  lessons: {
    async getByCourse(courseId: string): Promise<Lesson[]> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('week_number', { ascending: true })
        .order('order_index', { ascending: true })
      
      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<Lesson> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(lesson: NewLesson): Promise<Lesson> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .insert(lesson)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: LessonUpdate): Promise<Lesson> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const admin = getSupabaseAdmin()
      const { error } = await admin
        .from('lessons')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
  },

  // Enrollment operations
  enrollments: {
    async getByUser(userId: string): Promise<EnrollmentWithCourse[]> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('enrollments')
        .select(`
          *,
          courses(*)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    async create(enrollment: NewEnrollment): Promise<Enrollment> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('enrollments')
        .insert(enrollment)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async markComplete(userId: string, courseId: string): Promise<Enrollment> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('enrollments')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async checkEnrollment(userId: string, courseId: string): Promise<boolean> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    },
  },

  // Progress operations
  progress: {
    async getByUser(userId: string): Promise<ProgressWithLesson[]> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('progress')
        .select(`
          *,
          lessons(*)
        `)
        .eq('user_id', userId)
      
      if (error) throw error
      return data || []
    },

    async getByUserAndLesson(userId: string, lessonId: string): Promise<Progress | null> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async upsert(progressData: NewProgress): Promise<Progress> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('progress')
        .upsert(progressData, {
          onConflict: 'user_id,lesson_id',
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
  },

  // Subscription operations
  subscriptions: {
    async getByUser(userId: string): Promise<Subscription | null> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },

    async create(subscription: NewSubscription): Promise<Subscription> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: SubscriptionUpdate): Promise<Subscription> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getByStripeCustomerId(customerId: string): Promise<Subscription | null> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },
  },

  // Rating operations
  ratings: {
    async getByCourse(courseId: string): Promise<RatingWithProfile[]> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('ratings')
        .select(`
          *,
          profiles!ratings_user_id_fkey(full_name, avatar_url)
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<Rating> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('ratings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByUserAndCourse(userId: string, courseId: string): Promise<Rating | null> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('ratings')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },

    async create(rating: NewRating): Promise<Rating> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('ratings')
        .insert(rating)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: RatingUpdate): Promise<Rating> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('ratings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const admin = getSupabaseAdmin()
      const { error } = await admin
        .from('ratings')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    async getStats(): Promise<{ total: number; average: number }> {
      const admin = getSupabaseAdmin()
      
      const { data: ratings, error } = await admin
        .from('ratings')
        .select('rating')
      
      if (error) throw error
      
      const total = ratings?.length || 0
      const average = total > 0 
        ? ratings!.reduce((sum, r) => sum + r.rating, 0) / total 
        : 0
      
      return { total, average: Math.round(average * 10) / 10 }
    },
  },

  // News operations
  news: {
    async getRecent(limit: number = 50): Promise<NewsItem[]> {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data || []
    },
  },

  // Analytics operations
  analytics: {
    async getDashboardStats(): Promise<{
      totalUsers: number
      totalCourses: number
      totalLessons: number
      totalEnrollments: number
      averageRating: number
      totalRatings: number
    }> {
      const admin = getSupabaseAdmin()
      
      // Get counts in parallel
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalLessons },
        { count: totalEnrollments },
        { data: ratings },
      ] = await Promise.all([
        admin.from('profiles').select('*', { count: 'exact', head: true }),
        admin.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        admin.from('lessons').select('*', { count: 'exact', head: true }),
        admin.from('enrollments').select('*', { count: 'exact', head: true }),
        admin.from('ratings').select('rating'),
      ])
      
      const avgRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0
      
      return {
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalLessons: totalLessons || 0,
        totalEnrollments: totalEnrollments || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings: ratings?.length || 0,
      }
    },

    async getRecentActivity(limit: number = 10): Promise<{
      enrollments: Array<{
        created_at: string
        profiles: { full_name: string | null } | null
        courses: { title: string } | null
      }>
      ratings: Array<{
        created_at: string
        rating: number
        review: string | null
        profiles: { full_name: string | null } | null
        courses: { title: string } | null
      }>
    }> {
      const admin = getSupabaseAdmin()
      
      const [enrollmentsResult, ratingsResult] = await Promise.all([
        admin
          .from('enrollments')
          .select(`
            created_at,
            profiles(full_name),
            courses(title)
          `)
          .order('created_at', { ascending: false })
          .limit(limit),
        admin
          .from('ratings')
          .select(`
            created_at,
            rating,
            review,
            profiles(full_name),
            courses(title)
          `)
          .order('created_at', { ascending: false })
          .limit(limit),
      ])
      
      return { 
        enrollments: enrollmentsResult.data || [], 
        ratings: ratingsResult.data || [] 
      }
    },

    async getPopularCourses(limit: number = 5): Promise<Array<{
      id: string
      title: string
      enrollments: number
    }>> {
      const admin = getSupabaseAdmin()
      
      const { data, error } = await admin
        .from('courses')
        .select(`
          id,
          title,
          enrollments(count)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      return (data || []).map((course: any) => ({
        id: course.id,
        title: course.title,
        enrollments: course.enrollments?.[0]?.count || 0,
      }))
    },
  },
}

// Error handling
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export function handleSupabaseError(error: any): never {
  if (error.code === 'PGRST116') {
    throw new SupabaseError('Resource not found', error.code, error)
  }
  if (error.code === '23505') {
    throw new SupabaseError('Resource already exists', error.code, error)
  }
  if (error.code === '23503') {
    throw new SupabaseError('Foreign key constraint violation', error.code, error)
  }
  
  throw new SupabaseError(
    error.message || 'An unexpected database error occurred',
    error.code,
    error
  )
}
