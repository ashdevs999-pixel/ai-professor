// Product Hunt AI Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeProductHunt(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    $('[class*="post"], [class*="item"], article').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $item = $(element)
        
        const title = cleanText($item.find('h1, h2, h3, [class*="title"], a').first().text())
        if (!title) return
        
        const relativeUrl = $item.find('a').first().attr('href')
        const url = relativeUrl ? normalizeUrl(relativeUrl, 'https://producthunt.com') : null
        if (!url) return
        
        const content = cleanText($item.find('p, [class*="tagline"], [class*="description"]').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'Product Hunt AI',
          category: 'launches',
          published_at: new Date().toISOString(),
          content: content || null,
          image_url: null,
          author: null,
          tags: ['product-hunt', 'ai-tools', 'launches', 'products'],
        })
      } catch (error) {
        errors.push({ url: sourceUrl, error: `Failed to parse product: ${error}` })
      }
    })
  } catch (error) {
    errors.push({ url: sourceUrl, error: `Failed to scrape Product Hunt: ${error}` })
  }
  
  return { items, errors }
}
