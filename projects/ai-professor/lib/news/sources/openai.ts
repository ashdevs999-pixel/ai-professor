// OpenAI Blog Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeOpenAI(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    // OpenAI blog structure (adjust selectors based on actual site)
    $('article, .blog-post, [class*="post"], [class*="article"]').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $article = $(element)
        
        // Extract title
        const title = cleanText(
          $article.find('h1, h2, h3, [class*="title"], a').first().text()
        )
        
        if (!title) return
        
        // Extract URL
        const relativeUrl = $article.find('a').first().attr('href')
        const url = relativeUrl ? normalizeUrl(relativeUrl, sourceUrl) : null
        
        if (!url) return
        
        // Extract description/content
        const content = cleanText(
          $article.find('p, [class*="excerpt"], [class*="summary"]').first().text()
        )
        
        // Extract date
        const dateText = $article.find('time, [class*="date"]').first().text()
        const publishedAt = parseDate(dateText)
        
        // Extract image
        const imageUrl = $article.find('img').first().attr('src')
        const normalizedImageUrl = imageUrl ? normalizeUrl(imageUrl, sourceUrl) : null
        
        // Extract author
        const author = cleanText($article.find('[class*="author"]').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'OpenAI Blog',
          category: 'announcements',
          published_at: publishedAt ? publishedAt.toISOString() : null,
          content: content || null,
          image_url: normalizedImageUrl,
          author: author || null,
          tags: ['openai', 'ai', 'announcements'],
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
      error: `Failed to scrape OpenAI: ${error}`,
    })
  }
  
  return { items, errors }
}
