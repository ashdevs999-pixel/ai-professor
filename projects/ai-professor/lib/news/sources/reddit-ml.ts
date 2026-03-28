// Reddit r/MachineLearning Scraper

import type { ScrapingConfig, NewNewsItem } from '@/types/news'
import { fetchHTML, parseHTML, cleanText, normalizeUrl, parseDate } from '../scraper'

export async function scrapeRedditML(
  sourceUrl: string,
  config: ScrapingConfig
): Promise<{ items: Omit<NewNewsItem, 'summary'>[]; errors: Array<{ url?: string; error: string }> }> {
  const items: Omit<NewNewsItem, 'summary'>[] = []
  const errors: Array<{ url?: string; error: string }> = []
  
  try {
    const html = await fetchHTML(sourceUrl, config)
    const $ = parseHTML(html)
    
    // Reddit post structure
    $('[class*="post"], .thing').each((index, element) => {
      if (index >= config.maxItemsPerSource) return false
      
      try {
        const $post = $(element)
        
        // Extract title
        const title = cleanText(
          $post.find('a.title, [class*="title"], h3').first().text()
        )
        
        if (!title || title.length < 10) return
        
        // Extract URL - link to actual content or Reddit thread
        const postUrl = $post.find('a.title, a[data-click-id="body"]').first().attr('href')
        const url = postUrl ? normalizeUrl(postUrl, 'https://reddit.com') : null
        
        if (!url) return
        
        // Skip if it's just a Reddit internal link to comments
        if (url.includes('/comments/') && !url.includes('http')) {
          return
        }
        
        // Extract score/upvotes
        const score = $post.find('[class*="score"], .likes').first().text()
        
        // Extract author
        const author = cleanText($post.find('[class*="author"], a.author').first().text())
        
        items.push({
          title,
          source_url: url,
          source_name: 'Reddit r/MachineLearning',
          category: 'news',
          published_at: new Date().toISOString(),
          content: `Score: ${score}` || null,
          image_url: null,
          author: author || null,
          tags: ['reddit', 'machine-learning', 'community', 'discussion'],
        })
      } catch (error) {
        errors.push({
          url: sourceUrl,
          error: `Failed to parse post: ${error}`,
        })
      }
    })
  } catch (error) {
    errors.push({
      url: sourceUrl,
      error: `Failed to scrape Reddit: ${error}`,
    })
  }
  
  return { items, errors }
}
