#!/usr/bin/env ts-node

// Verification Script - Check all news system files are in place

import * as fs from 'fs'
import * as path from 'path'

const projectRoot = path.resolve(__dirname, '..')

interface FileCheck {
  path: string
  description: string
  required: boolean
}

const filesToCheck: FileCheck[] = [
  // Database
  { path: 'supabase/news-schema.sql', description: 'Database schema', required: true },
  
  // Types
  { path: 'types/news.ts', description: 'Type definitions', required: true },
  
  // Library - Core
  { path: 'lib/news/scraper.ts', description: 'Main scraper', required: true },
  { path: 'lib/news/summarizer.ts', description: 'AI summarizer', required: true },
  { path: 'lib/news/index.ts', description: 'News library exports', required: true },
  
  // Library - Scrapers
  { path: 'lib/news/sources/openai.ts', description: 'OpenAI scraper', required: true },
  { path: 'lib/news/sources/anthropic.ts', description: 'Anthropic scraper', required: true },
  { path: 'lib/news/sources/google-ai.ts', description: 'Google AI scraper', required: true },
  { path: 'lib/news/sources/meta-ai.ts', description: 'Meta AI scraper', required: true },
  { path: 'lib/news/sources/microsoft-ai.ts', description: 'Microsoft AI scraper', required: true },
  { path: 'lib/news/sources/stability-ai.ts', description: 'Stability AI scraper', required: true },
  { path: 'lib/news/sources/techcrunch.ts', description: 'TechCrunch scraper', required: true },
  { path: 'lib/news/sources/the-verge.ts', description: 'The Verge scraper', required: true },
  { path: 'lib/news/sources/ars-technica.ts', description: 'Ars Technica scraper', required: true },
  { path: 'lib/news/sources/venturebeat.ts', description: 'VentureBeat scraper', required: true },
  { path: 'lib/news/sources/wired.ts', description: 'Wired scraper', required: true },
  { path: 'lib/news/sources/arxiv.ts', description: 'arXiv scraper', required: true },
  { path: 'lib/news/sources/papers-with-code.ts', description: 'Papers With Code scraper', required: true },
  { path: 'lib/news/sources/huggingface.ts', description: 'Hugging Face scraper', required: true },
  { path: 'lib/news/sources/product-hunt.ts', description: 'Product Hunt scraper', required: true },
  { path: 'lib/news/sources/hacker-news.ts', description: 'Hacker News scraper', required: true },
  { path: 'lib/news/sources/reddit-ml.ts', description: 'Reddit ML scraper', required: true },
  { path: 'lib/news/sources/reddit-artificial.ts', description: 'Reddit Artificial scraper', required: true },
  
  // API Routes
  { path: 'app/api/news/route.ts', description: 'News API route', required: true },
  { path: 'app/api/news/[id]/route.ts', description: 'Single news API route', required: true },
  { path: 'app/api/news/scrape/route.ts', description: 'Scrape API route', required: true },
  { path: 'app/api/news/rss/route.ts', description: 'RSS API route', required: true },
  
  // Pages
  { path: 'app/news/page.tsx', description: 'News feed page', required: true },
  { path: 'app/news/[id]/page.tsx', description: 'Article detail page', required: true },
  
  // Components
  { path: 'components/news/NewsCard.tsx', description: 'NewsCard component', required: true },
  { path: 'components/news/NewsFeed.tsx', description: 'NewsFeed component', required: true },
  { path: 'components/news/NewsFilters.tsx', description: 'NewsFilters component', required: true },
  { path: 'components/news/NewsSearch.tsx', description: 'NewsSearch component', required: true },
  { path: 'components/news/index.ts', description: 'Component exports', required: true },
  
  // Scripts
  { path: 'scripts/scrape-news.ts', description: 'Manual scrape script', required: true },
  { path: 'scripts/news-cron.ts', description: 'Cron job script', required: true },
  
  // Documentation
  { path: 'NEWS-IMPLEMENTATION-SUMMARY.md', description: 'Implementation summary', required: true },
  { path: 'NEWS-QUICKSTART.md', description: 'Quick start guide', required: true },
]

let passed = 0
let failed = 0
let warnings = 0

console.log('🔍 AI News Aggregation System - Verification\n')
console.log('=' .repeat(60))

filesToCheck.forEach(file => {
  const fullPath = path.join(projectRoot, file.path)
  const exists = fs.existsSync(fullPath)
  
  if (exists) {
    const stats = fs.statSync(fullPath)
    const sizeKB = Math.round(stats.size / 1024)
    console.log(`✅ ${file.description} (${sizeKB} KB)`)
    passed++
  } else {
    if (file.required) {
      console.log(`❌ ${file.description} - MISSING: ${file.path}`)
      failed++
    } else {
      console.log(`⚠️  ${file.description} - NOT FOUND: ${file.path}`)
      warnings++
    }
  }
})

console.log('=' .repeat(60))
console.log('\n📊 Verification Results:\n')
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`⚠️  Warnings: ${warnings}`)
console.log(`📁 Total Files Checked: ${filesToCheck.length}`)

if (failed === 0) {
  console.log('\n🎉 All required files are in place!')
  console.log('\nNext steps:')
  console.log('1. Run database migration: psql -f supabase/news-schema.sql')
  console.log('2. Install dependencies: npm install')
  console.log('3. Run initial scrape: npm run scrape:news')
  console.log('4. Start dev server: npm run dev')
  console.log('5. Visit: http://localhost:3000/news')
  process.exit(0)
} else {
  console.log('\n❌ Some required files are missing!')
  console.log('Please check the implementation.')
  process.exit(1)
}
