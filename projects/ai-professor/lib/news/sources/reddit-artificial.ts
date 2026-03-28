// Reddit r/artificial Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeRedditArtificial(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    $('[class*="post"], .thing').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $post = $(element)
        
        const title = cleanText($post.find('a.title, [class*="title"], h3').first().text())
        if (!title || title.length < 10) return
        
        const postUrl = $post.find('a.title, a[data-click-id="body"]').first().attr('href')
        const url = postUrl ? normalizeUrl(postUrl, 'https://reddit.com') : null
        
        if (!url || url.includes('/comments/')) return
        
        const score = $post.find('[class*="score"], .likes').first().text()
        const author = cleanText($post.find('[class*="author"], a.author').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'Reddit r/artificial',
          category: 'news',
          published_at: new Date().toISOString(),
          content: score ? `Score: ${score}` : null,
          image_url: null,
          author: author || null,
          tags: ['reddit', 'artificial-intelligence', 'community', 'discussion'],
        })
      } catch (error) {
        errors.push({ url: sourceUrl, error: `Failed to parse post: ${error}` })
      }
    })
  } catch (error) {
    errors.push({ url: sourceUrl, error: `Failed to scrape Reddit: ${error}` })
  }
  
  return { items, errors }
}
