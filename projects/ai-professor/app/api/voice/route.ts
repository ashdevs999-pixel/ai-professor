/**
 * Voice Preference API Route
 * GET: Get user's voice preference
 * POST: Set user's voice preference
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { VoiceType } from '@/types/voice'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's voice preference
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('preferred_voice')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching voice preference:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch voice preference' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      preferredVoice: profile?.preferred_voice || 'female',
    })
  } catch (error) {
    console.error('Voice preference API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const preferredVoice: VoiceType = body.preferredVoice

    // Validate voice type
    if (!['male', 'female'].includes(preferredVoice)) {
      return NextResponse.json(
        { success: false, error: 'Invalid voice type. Must be "male" or "female"' },
        { status: 400 }
      )
    }

    // Update user's voice preference
    const { error } = await supabase
      .from('profiles')
      .update({ preferred_voice: preferredVoice })
      .eq('id', session.user.id)

    if (error) {
      console.error('Error updating voice preference:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update voice preference' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Voice preference updated successfully',
      preferredVoice,
    })
  } catch (error) {
    console.error('Voice preference update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
