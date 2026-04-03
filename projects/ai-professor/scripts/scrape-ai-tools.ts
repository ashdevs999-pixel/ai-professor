/**
 * AI Tools Auto-Scraper
 * 
 * Scans Product Hunt AI, TechCrunch AI, and Hacker News for new AI tools
 * and generates quick guide templates for CXO Academy.
 * 
 * Run: npx ts-node scripts/scrape-ai-tools.ts
 * Cron: 0 9 * * * (daily at 9 AM)
 */

import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Known AI tools - skip these
const KNOWN_TOOLS = new Set([
  'chatgpt', 'gpt-4', 'claude', 'gemini', 'copilot', 'midjourney',
  'dall-e', 'stable diffusion', 'anthropic', 'openai', 'perplexity',
  'cursor', 'windsurf', 'kimi', 'grok', 'llama', 'mistral',
  'openclaw', 'vscode', 'github', 'vercel', 'supabase',
])

interface AITool {
  name: string
  description: string
  url?: string
  source: string
  detectedAt: string
}

interface ScrapedItem {
  title: string
  description: string
  url?: string
  source: string
}

// Fetch Product Hunt AI topics
async function fetchProductHuntAI(): Promise<ScrapedItem[]> {
  try {
    const response = await fetch('https://www.producthunt.com/topics/ai', {
      headers: {
        'User-Agent': 'AI-Professor-Bot/1.0',
      },
    })
    const html = await response.text()
    
    // Extract product names from HTML (simplified parsing)
    const products: ScrapedItem[] = []
    const titleMatches = html.matchAll(/<h3[^>]*class="[^"]*styles_title[^"]*"[^>]*>([^<]+)<\/h3>/g)
    
    for (const match of titleMatches) {
      const title = match[1].trim()
      if (title && !KNOWN_TOOLS.has(title.toLowerCase())) {
        products.push({
          title,
          description: 'Detected from Product Hunt AI',
          source: 'producthunt',
        })
      }
    }
    
    return products.slice(0, 10) // Limit to 10
  } catch (error) {
    console.error('Product Hunt fetch error:', error)
    return []
  }
}

// Fetch TechCrunch AI news
async function fetchTechCrunchAI(): Promise<ScrapedItem[]> {
  try {
    const response = await fetch('https://techcrunch.com/category/artificial-intelligence/', {
      headers: {
        'User-Agent': 'AI-Professor-Bot/1.0',
      },
    })
    const html = await response.text()
    
    const items: ScrapedItem[] = []
    // Extract article titles
    const titleMatches = html.matchAll(/<h2[^>]*class="[^"]*post-block__title[^"]*"[^>]*>.*?<a[^>]*>([^<]+)<\/a>/gs)
    
    for (const match of titleMatches) {
      const title = match[1].trim()
      if (title) {
        items.push({
          title,
          description: 'TechCrunch AI article',
          source: 'techcrunch',
        })
      }
    }
    
    return items.slice(0, 10)
  } catch (error) {
    console.error('TechCrunch fetch error:', error)
    return []
  }
}

// Fetch Hacker News AI stories
async function fetchHackerNewsAI(): Promise<ScrapedItem[]> {
  try {
    // HN Algolia API for AI-tagged stories
    const response = await fetch(
      'https://hn.algolia.com/api/v1/search?query=ai%20OR%20artificial%20intelligence%20OR%20llm%20OR%20gpt&tags=story&hitsPerPage=15'
    )
    const data = await response.json()
    
    const items: ScrapedItem[] = (data.hits || []).map((hit: any) => ({
      title: hit.title,
      description: `HN points: ${hit.points}`,
      url: hit.url,
      source: 'hackernews',
    }))
    
    return items
  } catch (error) {
    console.error('Hacker News fetch error:', error)
    return []
  }
}

// Use GPT to analyze and extract AI tools from scraped content
async function extractNewAITools(items: ScrapedItem[]): Promise<AITool[]> {
  if (items.length === 0) return []
  
  const prompt = `Analyze these AI-related items and extract any NEW AI tools/products that would be useful for a beginner tutorial guide.

Known tools to skip: ${Array.from(KNOWN_TOOLS).join(', ')}

Items:
${items.map(i => `- ${i.title}: ${i.description} (${i.source})`).join('\n')}

For each NEW AI tool found, provide:
- name: Tool name
- description: What it does (1 sentence)
- whyNotable: Why it's worth a quick guide

Return JSON array only, max 5 tools. Skip if no new tools found.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    
    const content = completion.choices[0]?.message?.content
    if (!content) return []
    
    const parsed = JSON.parse(content)
    const tools = parsed.tools || parsed
    
    return tools.map((t: any) => ({
      name: t.name,
      description: t.description,
      source: 'auto-detected',
      detectedAt: new Date().toISOString(),
    }))
  } catch (error) {
    console.error('GPT extraction error:', error)
    return []
  }
}

// Generate a quick guide template for a new AI tool
function generateGuideTemplate(tool: AITool): { id: string; title: string; lessons: any[] } {
  const id = `guide-${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  
  return {
    id,
    title: `Using ${tool.name}`,
    lessons: [
      { title: `What is ${tool.name}?`, content: `[AUTO-GENERATED - Needs content]\n\n${tool.description}` },
      { title: 'Getting Started', content: '[AUTO-GENERATED - Needs content]\n\nStep-by-step setup instructions go here.' },
      { title: 'Key Features', content: '[AUTO-GENERATED - Needs content]\n\nOverview of main features and capabilities.' },
      { title: 'Pro Tips', content: '[AUTO-GENERATED - Needs content]\n\nBest practices and power user tips.' },
    ],
  }
}

// Main function
async function main() {
  console.log('🔍 Scraping for new AI tools...\n')
  
  // Fetch from all sources
  const [productHunt, techcrunch, hn] = await Promise.all([
    fetchProductHuntAI(),
    fetchTechCrunchAI(),
    fetchHackerNewsAI(),
  ])
  
  const allItems = [...productHunt, ...techcrunch, ...hn]
  console.log(`📊 Found ${allItems.length} items from sources`)
  console.log(`  - Product Hunt: ${productHunt.length}`)
  console.log(`  - TechCrunch: ${techcrunch.length}`)
  console.log(`  - Hacker News: ${hn.length}\n`)
  
  // Extract new AI tools using GPT
  console.log('🤖 Analyzing with GPT...')
  const newTools = await extractNewAITools(allItems)
  
  if (newTools.length === 0) {
    console.log('✅ No new AI tools detected')
    return
  }
  
  console.log(`\n🆕 Found ${newTools.length} new AI tools:\n`)
  
  // Generate guide templates
  const guides: any[] = []
  for (const tool of newTools) {
    console.log(`📦 ${tool.name}`)
    console.log(`   ${tool.description}`)
    const template = generateGuideTemplate(tool)
    guides.push(template)
    console.log(`   → Generated guide: ${template.id}\n`)
  }
  
  // Output as JSON for further processing
  const output = {
    detectedAt: new Date().toISOString(),
    tools: newTools,
    guideTemplates: guides,
  }
  
  console.log('\n📄 Guide Templates (JSON):')
  console.log(JSON.stringify(output, null, 2))
  
  // TODO: Save to database or file
  // await saveDetectedTools(newTools)
  // await saveGuideTemplates(guides)
}

main().catch(console.error)
