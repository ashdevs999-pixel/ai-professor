// Hacker News Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeHackerNews(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    $('.athing, [class*="item"]').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $item = $(element)
        
        const title = cleanText($item.find('.titleline > a, .title a').first().text())
        if (!title) return
        
        // Only include AI-related posts
        const titleLower = title.toLowerCase()
        const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'gpt', 'llm', 'deep learning']
        if (!aiKeywords.some(keyword => titleLower.includes(keyword))) {
          return
        }
        
        const relativeUrl = $item.find('.titleline > a, .title a').first().attr('href')
        const url = relativeUrl ? normalizeUrl(relativeUrl, 'https://news.ycombinator.com') : null
        if (!url || url.includes('news.ycombinator.com')) return
        
        const score = $item.next().find('.score').text()
        
        items.push({
          title,
          source_url: url,
          source_name: 'Hacker News',
          category: 'launches',
          published_at: new Date().toISOString(),
          content: score ? `Upvotes: ${score}` : null,
          image_url: null,
          author: null,
          tags: ['hacker-news', 'ai', 'tech', 'community'],
        })
      } catch (error) {
        errors.push({ url: sourceUrl, error: `Failed to parse post: ${error}` })
      }
    })
  } catch (error) {
    errors.push({ url: sourceUrl, error: `Failed to scrape Hacker News: ${error}` })
  }
  
  return { items, errors }
}
