// Simple News Fetcher - Fetches news from RSS feeds
// Supports both AI news and general tech breaking news

import { getSupabaseAdmin } from '../supabase'

interface NewsItem {
  title: string
  summary: string
  source_url: string
  source_name: string
  category: 'news' | 'launches' | 'research' | 'tools' | 'announcements' | 'breaking'
  published_at?: string
}

// AI-focused RSS feeds
const AI_FEEDS = [
  // Company Blogs
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: 'announcements' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss', category: 'announcements' },
  { name: 'Google DeepMind Blog', url: 'https://deepmind.google/discover/blog/', category: 'research' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'research' },
  { name: 'Meta AI Blog', url: 'https://ai.meta.com/blog/rss/', category: 'announcements' },
  { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/', category: 'announcements' },
  
  // Tech News AI Sections
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'news' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'news' },
  
  // Research & Academic
  { name: 'Nature AI', url: 'https://www.nature.com/subjects/machine-learning/artificial-intelligence.rss', category: 'research' },
  { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', category: 'research' },
  
  // Community
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'news' },
  { name: 'r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/.rss', category: 'research' },
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', category: 'news' },
]

// General tech breaking news RSS feeds
const BREAKING_TECH_FEEDS = [
  // Major Tech Publications
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'breaking' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'breaking' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'breaking' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'breaking' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'breaking' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'breaking' },
  { name: 'Recode', url: 'https://www.vox.com/recode/rss/index.xml', category: 'breaking' },
  
  // Business & Financial Tech
  { name: 'Bloomberg Tech', url: 'https://www.bloomberg.com/technology/feed', category: 'breaking' },
  { name: 'CNBC Tech', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', category: 'breaking' },
  { name: 'The Information', url: 'https://theinformation.com/feed', category: 'breaking' },
  
  // Global Coverage
  { name: 'BBC Tech', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'breaking' },
]

/**
 * Parse RSS feed XML
 */
function parseRSS(xml: string, sourceName: string, category: string, filterAI: boolean = false): NewsItem[] {
  const items: NewsItem[] = []
  
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    
    const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i.exec(itemXml)
    const linkMatch = /<link>(.*?)<\/link>/i.exec(itemXml)
    const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i.exec(itemXml)
    const dateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemXml)
    
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : ''
    const link = linkMatch ? linkMatch[1] : ''
    const description = descMatch ? (descMatch[1] || descMatch[2]) : ''
    const pubDate = dateMatch ? dateMatch[1] : ''
    
    if (title && link) {
      if (filterAI) {
        // Filter for AI-related content
        const aiKeywords = ['AI', 'artificial intelligence', 'machine learning', 'GPT', 'LLM', 'neural', 'deep learning', 'ChatGPT', 'Claude', 'OpenAI', 'Anthropic']
        const isAIRelated = aiKeywords.some(keyword => 
          title.toLowerCase().includes(keyword.toLowerCase()) ||
          description.toLowerCase().includes(keyword.toLowerCase())
        )
        
        if (!isAIRelated && !sourceName.includes('AI') && !sourceName.includes('OpenAI')) {
          continue
        }
      }
      
      items.push({
        title: title.trim(),
        summary: description.replace(/<[^>]*>/g, '').trim().substring(0, 300),
        source_url: link.trim(),
        source_name: sourceName,
        category: category as any,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      })
    }
  }
  
  return items
}

/**
 * Fetch RSS feed
 */
async function fetchRSS(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Professor-Bot/1.0)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    return ''
  }
}

/**
 * Scrape all news sources (AI + Breaking Tech)
 */
export async function scrapeAllNews(): Promise<{ message: string; count: number; details: any }> {
  const supabaseAdmin = getSupabaseAdmin()
  let totalItems = 0
  const details: any = { ai: 0, breaking: 0 }
  
  // Scrape AI feeds
  for (const feed of AI_FEEDS) {
    try {
      console.log(`Fetching AI: ${feed.name}...`)
      
      const xml = await fetchRSS(feed.url)
      
      if (!xml) {
        console.log(`No data from ${feed.name}`)
        continue
      }
      
      const items = parseRSS(xml, feed.name, feed.category, true)
      
      for (const item of items.slice(0, 10)) {
        try {
          await supabaseAdmin
            .from('news_items')
            .upsert(item, { onConflict: 'source_url' })
          
          totalItems++
          details.ai++
        } catch (error) {
          // Ignore duplicate errors
        }
      }
      
      console.log(`✓ AI ${feed.name}: ${items.length} items`)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error with ${feed.name}:`, error)
    }
  }
  
  // Scrape Breaking Tech feeds
  for (const feed of BREAKING_TECH_FEEDS) {
    try {
      console.log(`Fetching Breaking: ${feed.name}...`)
      
      const xml = await fetchRSS(feed.url)
      
      if (!xml) {
        console.log(`No data from ${feed.name}`)
        continue
      }
      
      const items = parseRSS(xml, feed.name, feed.category, false)
      
      for (const item of items.slice(0, 15)) {
        try {
          await supabaseAdmin
            .from('news_items')
            .upsert(item, { onConflict: 'source_url' })
          
          totalItems++
          details.breaking++
        } catch (error) {
          // Ignore duplicate errors
        }
      }
      
      console.log(`✓ Breaking ${feed.name}: ${items.length} items`)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error with ${feed.name}:`, error)
    }
  }
  
  return { 
    message: `Scraped ${totalItems} news items`,
    count: totalItems,
    details
  }
}

/**
 * Scrape only breaking tech news
 */
export async function scrapeBreakingNews(): Promise<{ message: string; count: number }> {
  const supabaseAdmin = getSupabaseAdmin()
  let totalItems = 0
  
  for (const feed of BREAKING_TECH_FEEDS) {
    try {
      console.log(`Fetching ${feed.name}...`)
      
      const xml = await fetchRSS(feed.url)
      
      if (!xml) continue
      
      const items = parseRSS(xml, feed.name, 'breaking', false)
      
      for (const item of items.slice(0, 15)) {
        try {
          await supabaseAdmin
            .from('news_items')
            .upsert(item, { onConflict: 'source_url' })
          
          totalItems++
        } catch (error) {
          // Ignore
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error with ${feed.name}:`, error)
    }
  }
  
  return { 
    message: `Scraped ${totalItems} breaking news items`,
    count: totalItems 
  }
}

/**
 * Get scraping statistics
 */
export async function getScrapingStats() {
  const supabaseAdmin = getSupabaseAdmin()
  
  const { count: totalItems } = await supabaseAdmin
    .from('news_items')
    .select('*', { count: 'exact', head: true })
  
  const { count: aiItems } = await supabaseAdmin
    .from('news_items')
    .select('*', { count: 'exact', head: true })
    .in('category', ['news', 'announcements', 'research', 'tools', 'launches'])
  
  const { count: breakingItems } = await supabaseAdmin
    .from('news_items')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'breaking')
  
  return {
    totalArticles: totalItems || 0,
    aiArticles: aiItems || 0,
    breakingArticles: breakingItems || 0,
  }
}

/**
 * Scrape specific source
 */
export async function scrapeSpecificSource(source: string): Promise<{ message: string; count: number }> {
  const allFeeds = [...AI_FEEDS, ...BREAKING_TECH_FEEDS]
  const feed = allFeeds.find(f => f.name.toLowerCase().includes(source.toLowerCase()))
  
  if (!feed) {
    return { message: `Source "${source}" not found`, count: 0 }
  }
  
  const supabaseAdmin = getSupabaseAdmin()
  const xml = await fetchRSS(feed.url)
  
  if (!xml) {
    return { message: `Failed to fetch ${feed.name}`, count: 0 }
  }
  
  const filterAI = AI_FEEDS.includes(feed as any)
  const items = parseRSS(xml, feed.name, feed.category, filterAI)
  
  let count = 0
  for (const item of items) {
    try {
      await supabaseAdmin
        .from('news_items')
        .upsert(item, { onConflict: 'source_url' })
      count++
    } catch (error) {
      // Ignore
    }
  }
  
  return { message: `Scraped ${count} items from ${feed.name}`, count }
}
