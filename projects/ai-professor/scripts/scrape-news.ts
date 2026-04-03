#!/usr/bin/env ts-node

// Manual News Scraper Script
// Run: npm run scrape:news

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { scrapeAllNews, scrapeSpecificSource, getScrapingStats } from '../lib/news/scraper'
import { processAllUnprocessed } from '../lib/news/summarizer'

async function main() {
  const args = process.argv.slice(2)
  const sourceName = args.find(arg => !arg.startsWith('--'))
  const processSummaries = !args.includes('--no-summaries')
  const statsOnly = args.includes('--stats')

  console.log('📰 CXO News Scraper\n')

  try {
    // Show stats only
    if (statsOnly) {
      const stats = await getScrapingStats()
      console.log('Scraping Statistics:')
      console.log(`  Total Articles: ${stats.totalArticles}`)
      console.log(`  AI Articles: ${stats.aiArticles}`)
      console.log(`  Breaking Articles: ${stats.breakingArticles}`)
      return
    }

    // Scrape specific source or all sources
    if (sourceName) {
      console.log(`Scraping source: ${sourceName}\n`)
      const result = await scrapeSpecificSource(sourceName)
      console.log(`\n✓ ${result.message}`)
    } else {
      console.log('Scraping all enabled sources...\n')
      await scrapeAllNews()
      console.log('\n✓ Scraping completed')
    }

    // Process summaries with AI
    if (processSummaries) {
      console.log('\nProcessing summaries with AI...')
      await processAllUnprocessed(50)
      console.log('✓ Summaries processed')
    }

    // Show final stats
    const stats = await getScrapingStats()
    console.log(`\nTotal news items in database: ${stats.totalArticles}`)
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
