// GET /api/news/rss - RSS feed for news items

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    
    // Build query
    let query = supabase
      .from('news_items')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data: items, error } = await query
    
    if (error) {
      return new NextResponse('Failed to fetch news items', { status: 500 })
    }
    
    // Generate RSS XML
    const rss = generateRSS(items || [])
    
    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Failed to generate RSS feed', { status: 500 })
  }
}

function generateRSS(items: any[]): string {
  const now = new Date().toUTCString()

  const itemsXML = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${escapeXML(item.title)}]]></title>
      <link>${escapeXML(item.source_url)}</link>
      <description><![CDATA[${escapeXML(item.summary || item.content || '')}]]></description>
      <pubDate>${item.published_at ? new Date(item.published_at).toUTCString() : now}</pubDate>
      <author>${escapeXML(item.author || 'CXO News')}</author>
      <category>${escapeXML(item.category)}</category>
      <guid isPermaLink="true">${escapeXML(item.source_url)}</guid>
      ${item.image_url ? `<enclosure url="${escapeXML(item.image_url)}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CXO News - Latest AI News</title>
    <link>https://cxoacademy.co/news</link>
    <description>Stay updated with the latest AI developments, research, and tools curated by CXO News</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://cxoacademy.co/api/news/rss" rel="self" type="application/rss+xml" />
    ${itemsXML}
  </channel>
</rss>`
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
