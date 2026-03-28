// The Verge AI Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeTheVerge(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    $('article, [class*="post"], [class*="article"]').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $article = $(element)
        
        const title = cleanText($article.find('h1, h2, h3, [class*="title"]').first().text())
        if (!title) return
        
        const relativeUrl = $article.find('a').first().attr('href')
        const url = relativeUrl ? normalizeUrl(relativeUrl, sourceUrl) : null
        if (!url) return
        
        const content = cleanText($article.find('p, [class*="excerpt"]').first().text())
        const dateText = $article.find('time, [class*="date"]').first().text()
        const publishedAt = parseDate(dateText)
        
        const author = cleanText($article.find('[class*="author"]').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'The Verge AI',
          category: 'news',
          published_at: publishedAt ? publishedAt.toISOString() : null,
          content: content || null,
          image_url: null,
          author: author || null,
          tags: ['ai', 'tech', 'news', 'the-verge'],
        })
      } catch (error) {
        errors.push({ url: sourceUrl, error: `Failed to parse article: ${error}` })
      }
    })
  } catch (error) {
    errors.push({ url: sourceUrl, error: `Failed to scrape The Verge: ${error}` })
  }
  
  return { items, errors }
}
