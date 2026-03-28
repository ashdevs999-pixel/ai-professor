// arXiv cs.AI Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeArxiv(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    // arXiv recent papers structure
    $('dt, [class*="paper"], .list-title').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $item = $(element)
        
        // Extract title
        const title = cleanText(
          $item.find('.list-title, a[title]').first().text() ||
          $item.find('a').first().attr('title')
        )
        
        if (!title) return
        
        // Extract URL - arXiv papers have specific URL format
        const paperId = $item.find('a').first().attr('href')
        const url = paperId ? normalizeUrl(paperId, 'https://arxiv.org') : null
        
        if (!url) return
        
        // Extract abstract/content
        const content = cleanText(
          $item.next('dd').find('.abstract, p').first().text()
        )
        
        // Extract authors
        const authors = cleanText(
          $item.next('dd').find('.list-authors, .authors').first().text()
        )
        
        items.push({
          title,
          source_url: url,
          source_name: 'arXiv cs.AI',
          category: 'research',
          published_at: new Date().toISOString(), // arXiv papers are recent
          content: content || null,
          image_url: null,
          author: authors || null,
          tags: ['research', 'arxiv', 'ai', 'machine-learning', 'papers'],
        })
      } catch (error) {
        errors.push({
          url: sourceUrl,
          error: `Failed to parse paper: ${error}`,
        })
      }
    })
  } catch (error) {
    errors.push({
      url: sourceUrl,
      error: `Failed to scrape arXiv: ${error}`,
    })
  }
  
  return { items, errors }
}
