// POST /api/news/scrape - Trigger manual scrape

import { NextRequest, NextResponse } from 'next/server'
import { scrapeAllNews, scrapeSpecificSource, getScrapingStats } from '@/lib/news/scraper'

export async function POST(request: NextRequest) {
  try {
    // For now, allow scraping without auth (for testing)
    // In production, you'd want to require admin auth
    
    const body = await request.json().catch(() => ({}))
    const { source } = body
    
    let result
    
    if (source) {
      result = await scrapeSpecificSource(source)
    } else {
      result = await scrapeAllNews()
    }
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error triggering scrape:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to trigger scrape' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await getScrapingStats()
    
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching scrape stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scrape stats' },
      { status: 500 }
    )
  }
}
