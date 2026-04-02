import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return createErrorResponse(new Error('Valid email is required'), 'Invalid email')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('waitlist' as any)
      .insert({ email: email.trim().toLowerCase(), source: source || null } as any)

    if (error) {
      // Duplicate entry is fine
      if (error.code === '23505') {
        return createSuccessResponse({ message: 'Already on the list' })
      }
      throw error
    }

    return createSuccessResponse({ message: 'Added to waitlist' })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to join waitlist')
  }
}
