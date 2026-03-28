// AI News Summarizer - Uses GPT-4o to generate summaries

import OpenAI from 'openai'
import { getSupabaseAdmin } from '../supabase'
import type { NewsItem } from '@/types/news'

// Lazy initialization to avoid build-time errors
let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
    })
  }
  return _openai
}

/**
 * Generate AI summary for a news item
 */
export async function summarizeNewsItem(
  title: string,
  content: string | null,
  maxLength: number = 200
): Promise<string> {
  try {
    // If no content, just use title
    if (!content || content.trim().length === 0) {
      return title
    }
    
    // Truncate content if too long (to save tokens)
    const truncatedContent = content.substring(0, 2000)
    
    const prompt = `Summarize the following AI news article in 2-3 sentences (max ${maxLength} characters). Focus on the key points and make it engaging for readers.

Title: ${title}

Content:
${truncatedContent}

Summary:`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI news summarizer. Create concise, informative summaries that capture the essence of AI developments.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })
    
    const summary = response.choices[0]?.message?.content?.trim() || title
    
    // Ensure summary doesn't exceed max length
    return summary.length > maxLength ? summary.substring(0, maxLength - 3) + '...' : summary
  } catch (error) {
    console.error('Error generating summary:', error)
    return title
  }
}

/**
 * Categorize news item using AI
 */
export async function categorizeNewsItem(
  title: string,
  content: string | null
): Promise<'news' | 'launches' | 'research' | 'tools' | 'announcements'> {
  try {
    const prompt = `Categorize the following AI news item into one of these categories:
- news: General AI news and updates
- launches: New product launches, features, or companies
- research: Research papers, studies, or breakthroughs
- tools: New AI tools, libraries, or frameworks
- announcements: Company announcements or official statements

Title: ${title}

Content: ${content?.substring(0, 500) || 'No content'}

Category:`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI news categorizer. Respond with only the category name.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 20,
      temperature: 0.3,
    })
    
    const category = response.choices[0]?.message?.content?.trim().toLowerCase()
    
    // Validate category
    const validCategories = ['news', 'launches', 'research', 'tools', 'announcements']
    return validCategories.includes(category || '') ? category as any : 'news'
  } catch (error) {
    console.error('Error categorizing news:', error)
    return 'news'
  }
}

/**
 * Extract tags from news item
 */
export async function extractTags(
  title: string,
  content: string | null
): Promise<string[]> {
  try {
    const prompt = `Extract relevant tags for this AI news article. Return 3-5 tags as a comma-separated list.

Title: ${title}

Content: ${content?.substring(0, 500) || 'No content'}

Tags:`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI tag extractor. Extract relevant tags related to AI, machine learning, and technology.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.5,
    })
    
    const tagsString = response.choices[0]?.message?.content?.trim() || ''
    
    // Parse and clean tags
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length < 30)
      .slice(0, 5)
    
    return tags
  } catch (error) {
    console.error('Error extracting tags:', error)
    return []
  }
}

/**
 * Process news item - add summary, category, and tags
 */
export async function processNewsItem(newsItem: NewsItem): Promise<void> {
  try {
    // Check if already processed
    if (newsItem.summary && newsItem.tags && newsItem.tags.length > 0) {
      return
    }
    
    // Generate summary
    const summary = await summarizeNewsItem(
      newsItem.title,
      newsItem.content || newsItem.summary
    )
    
    // Generate tags if not present
    const tags = newsItem.tags && newsItem.tags.length > 0
      ? newsItem.tags
      : await extractTags(newsItem.title, newsItem.content || newsItem.summary)
    
    // Update in database
    const { error } = await getSupabaseAdmin()
      .from('news_items')
      .update({
        summary,
        tags,
      })
      .eq('id', newsItem.id)
    
    if (error) {
      console.error(`Failed to update news item ${newsItem.id}:`, error)
    } else {
      console.log(`✓ Processed: ${newsItem.title.substring(0, 50)}...`)
    }
    
    // Add delay to respect rate limits
    await sleep(500)
  } catch (error) {
    console.error(`Error processing news item ${newsItem.id}:`, error)
  }
}

/**
 * Process all unprocessed news items
 */
export async function processAllUnprocessed(limit: number = 50): Promise<void> {
  try {
    // Get unprocessed items (no summary)
    const { data: items, error } = await getSupabaseAdmin()
      .from('news_items')
      .select('*')
      .is('summary', null)
      .order('scraped_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      throw new Error(`Failed to fetch unprocessed items: ${error.message}`)
    }
    
    if (!items || items.length === 0) {
      console.log('No unprocessed items found')
      return
    }
    
    console.log(`Processing ${items.length} unprocessed items...`)
    
    for (const item of items) {
      await processNewsItem(item)
    }
    
    console.log(`✓ Processed ${items.length} items`)
  } catch (error) {
    console.error('Error processing unprocessed items:', error)
    throw error
  }
}

/**
 * Batch process items with rate limiting
 */
export async function batchProcessItems(
  batchSize: number = 10,
  delayMs: number = 1000
): Promise<void> {
  let processed = 0
  let hasMore = true
  
  while (hasMore) {
    const { data: items, error } = await getSupabaseAdmin()
      .from('news_items')
      .select('*')
      .is('summary', null)
      .limit(batchSize)
    
    if (error || !items || items.length === 0) {
      hasMore = false
      break
    }
    
    for (const item of items) {
      await processNewsItem(item)
      processed++
    }
    
    // Delay between batches
    if (items.length === batchSize) {
      await sleep(delayMs)
    } else {
      hasMore = false
    }
  }
  
  console.log(`Total items processed: ${processed}`)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate summary for a batch of items (for parallel processing)
 */
export async function summarizeBatch(
  items: Array<{ id: string; title: string; content: string | null }>
): Promise<void> {
  const promises = items.map(async (item) => {
    const summary = await summarizeNewsItem(item.title, item.content)
    
    await getSupabaseAdmin()
      .from('news_items')
      .update({ summary })
      .eq('id', item.id)
  })
  
  await Promise.all(promises)
}
