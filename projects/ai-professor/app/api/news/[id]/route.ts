// GET /api/news/[id] - Get single news item

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { SingleNewsApiResponse } from '@/types/news'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'News item not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const response: SingleNewsApiResponse = {
      success: true,
      data,
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news item' },
      { status: 500 }
    )
  }
}
