// TechCrunch AI Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeTechCrunch(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    // TechCrunch article structure
    $('article, .article, [class*="post"]').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $article = $(element)
        
        // Extract title
        const title = cleanText(
          $article.find('h1, h2, h3, .article-title, [class*="title"]').first().text()
        )
        
        if (!title) return
        
        // Extract URL
        const relativeUrl = $article.find('a').first().attr('href')
        const url = relativeUrl ? normalizeUrl(relativeUrl, sourceUrl) : null
        
        if (!url) return
        
        // Extract excerpt
        const content = cleanText(
          $article.find('.article-excerpt, [class*="excerpt"], p').first().text()
        )
        
        // Extract date
        const dateText = $article.find('time, [class*="date"], [class*="time"]').first().text()
        const publishedAt = parseDate(dateText)
        
        // Extract image
        const imageUrl = $article.find('img').first().attr('src')
        const normalizedImageUrl = imageUrl ? normalizeUrl(imageUrl, sourceUrl) : null
        
        // Extract author
        const author = cleanText($article.find('[class*="author"], .byline').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'TechCrunch AI',
          category: 'news',
          published_at: publishedAt ? publishedAt.toISOString() : null,
          content: content || null,
          image_url: normalizedImageUrl,
          author: author || null,
          tags: ['ai', 'tech', 'news', 'techcrunch'],
        })
      } catch (error) {
        errors.push({
          url: sourceUrl,
          error: `Failed to parse article: ${error}`,
        })
      }
    })
  } catch (error) {
    errors.push({
      url: sourceUrl,
      error: `Failed to scrape TechCrunch: ${error}`,
    })
  }
  
  return { items, errors }
}
