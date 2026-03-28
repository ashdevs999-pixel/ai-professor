// Supabase Client Configuration
// Uses function-based initialization to avoid build-time errors

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

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

// Database query helpers
export const db = {
  // User operations
  users: {
    async getById(id: string) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByEmail(email: string) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
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
    async getAll(filters?: Record<string, any>) {
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
      return data
    },

    async getById(id: string) {
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

    async create(course: Database['public']['Tables']['courses']['Insert']) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('courses')
        .insert(course)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Database['public']['Tables']['courses']['Update']) {
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

    async delete(id: string) {
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
    async getByCourse(courseId: string) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('week_number', { ascending: true })
        .order('order_index', { ascending: true })
      
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(lesson: Database['public']['Tables']['lessons']['Insert']) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('lessons')
        .insert(lesson)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Database['public']['Tables']['lessons']['Update']) {
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

    async delete(id: string) {
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
    async getByUser(userId: string) {
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
      return data
    },

    async create(enrollment: Database['public']['Tables']['enrollments']['Insert']) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('enrollments')
        .insert(enrollment)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async markComplete(userId: string, courseId: string) {
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
  },

  // Progress operations
  progress: {
    async getByUser(userId: string) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('progress')
        .select(`
          *,
          lessons(*)
        `)
        .eq('user_id', userId)
      
      if (error) throw error
      return data
    },

    async getByUserAndLesson(userId: string, lessonId: string) {
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

    async upsert(progress: Database['public']['Tables']['progress']['Insert']) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('progress')
        .upsert(progress, {
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
    async getByUser(userId: string) {
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

    async create(subscription: Database['public']['Tables']['subscriptions']['Insert']) {
      const admin = getSupabaseAdmin()
      const { data, error } = await admin
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Database['public']['Tables']['subscriptions']['Update']) {
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

    async getByStripeCustomerId(customerId: string) {
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
