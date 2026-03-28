// Cron job endpoint for automatic news scraping
// Called by Vercel Cron Jobs twice daily (6 AM and 6 PM UTC)

import { NextRequest, NextResponse } from 'next/server'
import { scrapeAllNews } from '@/lib/news/scraper'

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // In production, require the secret
  // In development, allow without secret for testing
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  try {
    console.log('[Cron] Starting news scrape at', new Date().toISOString())
    
    const result = await scrapeAllNews()
    
    console.log('[Cron] Scrape complete:', result)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    })
  } catch (error) {
    console.error('[Cron] Scrape failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Scrape failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
