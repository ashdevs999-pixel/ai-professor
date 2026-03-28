// Authentication Helpers

import { getServerSession, Session } from 'next-auth'
import { authOptions } from '../app/api/auth/[...nextauth]/route'
import { getSupabaseAdmin, getUserFromRequest } from './supabase'
import { User } from '../types/database'
import { NextRequest } from 'next/server'

// Re-export auth store for client components
export { useAuthStore } from '../stores/auth-store'

// Get current session (server-side)
export async function getCurrentSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

// Get current user (server-side)
export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession()
  
  if (!session?.user?.id) {
    return null
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const user = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return user.data
  } catch (error) {
    return null
  }
}

// Get user from API route
export async function getApiUser(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const user = await getUserFromRequest(request as any)
  
  if (!user) {
    return null
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return data
  } catch (error) {
    return null
  }
}

// Require authentication middleware
export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getApiUser(request)
  
  if (!user) {
    throw new AuthError('Authentication required', 401)
  }

  return user
}

// Require specific subscription tier
export async function requireTier(
  request: NextRequest,
  requiredTier: 'basic' | 'pro' | 'enterprise'
): Promise<User> {
  const user = await requireAuth(request)

  const tierLevels = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3,
  }

  const userLevel = tierLevels[user.subscription_tier]
  const requiredLevel = tierLevels[requiredTier]

  if (userLevel < requiredLevel) {
    throw new AuthError(
      `This feature requires ${requiredTier} subscription or higher`,
      403
    )
  }

  return user
}

// Check if user owns resource
export async function requireResourceOwnership(
  request: NextRequest,
  resourceUserId: string
): Promise<User> {
  const user = await requireAuth(request)

  if (user.id !== resourceUserId) {
    throw new AuthError('You do not have permission to access this resource', 403)
  }

  return user
}

// Check if user is instructor
export async function isInstructor(userId: string): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin()
  const { data } = await supabaseAdmin
    .from('courses')
    .select('id')
    .eq('instructor_id', userId)
    .limit(1)

  return (data?.length || 0) > 0
}

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(identifier, newRecord)
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime,
    }
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

// Apply rate limiting to request
export async function applyRateLimit(
  request: NextRequest,
  maxRequests?: number
): Promise<void> {
  const user = await getApiUser(request)
  const identifier = user?.id || request.ip || 'anonymous'

  const result = checkRateLimit(identifier, maxRequests)

  if (!result.allowed) {
    throw new RateLimitError(
      'Too many requests. Please try again later.',
      result.resetTime
    )
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Generate secure token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 10000) // Limit length
}

// Validate UUID
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Error classes
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Helper to create error response
export function createErrorResponse(
  error: any,
  defaultMessage: string = 'An error occurred'
): Response {
  console.error('API Error:', error)

  if (error instanceof AuthError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  if (error instanceof RateLimitError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        retryAfter: Math.ceil((error.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((error.resetTime - Date.now()) / 1000)),
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: defaultMessage,
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// Helper to create success response
export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
