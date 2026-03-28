// Learning Paths API - Track B: Structured Learning Journeys

import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

// GET /api/paths - Get all learning paths
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Get specific path with courses
      const { data: path, error } = await supabaseAdmin
        .from('learning_paths')
        .select(`
          *,
          path_courses (
            order_index,
            is_required,
            courses (
              id,
              title,
              description,
              topic,
              difficulty,
              duration_weeks,
              image_url
            )
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
      
      if (error) throw error
      
      // Sort courses by order_index
      if (path?.path_courses) {
        path.path_courses.sort((a: any, b: any) => a.order_index - b.order_index)
      }
      
      return createSuccessResponse({ path })
    }
    
    // Get all paths
    const { data: paths, error } = await supabaseAdmin
      .from('learning_paths')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return createSuccessResponse({ paths })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch learning paths')
  }
}
