// GET /api/news - Get news items with filters and pagination

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { NewsFilters, NewsApiResponse } from '@/types/news'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters from query params
    const filters: NewsFilters = {
      category: searchParams.get('category') as any || undefined,
      source: searchParams.get('source') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') as any) || 'published_at',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }
    
    // Build query
    let query = supabase
      .from('news_items')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.source) {
      query = query.eq('source_name', filters.source)
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }
    
    if (filters.startDate) {
      query = query.gte('published_at', filters.startDate)
    }
    
    if (filters.endDate) {
      query = query.lte('published_at', filters.endDate)
    }
    
    // Apply sorting
    query = query.order(filters.sortBy || 'published_at', {
      ascending: filters.sortOrder === 'asc',
    })
    
    // Apply pagination
    const page = filters.page || 1
    const limit = Math.min(filters.limit || 20, 100)
    const offset = (page - 1) * limit
    
    query = query.range(offset, offset + limit - 1)
    
    // Execute query
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    const response: NewsApiResponse = {
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
