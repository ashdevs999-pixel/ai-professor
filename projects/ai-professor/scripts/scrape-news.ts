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

  console.log('📰 Pulse News Scraper\n')

  try {
    // Show stats only
    if (statsOnly) {
      const stats = await getScrapingStats()
      console.log('Scraping Statistics:')
      console.log(`  Total Items: ${stats.totalItems}`)
      console.log(`  Recent Errors (24h): ${stats.recentErrors}`)
      console.log('\nSources:')
      stats.sources.forEach(source => {
        const lastScraped = source.last_scraped_at
          ? new Date(source.last_scraped_at).toLocaleString()
          : 'Never'
        console.log(`  ${source.name}:`)
        console.log(`    - Status: ${source.enabled ? 'Enabled' : 'Disabled'}`)
        console.log(`    - Items Scraped: ${source.items_scraped}`)
        console.log(`    - Last Scraped: ${lastScraped}`)
        if (source.last_error) {
          console.log(`    - Last Error: ${source.last_error}`)
        }
      })
      return
    }

    // Scrape specific source or all sources
    if (sourceName) {
      console.log(`Scraping source: ${sourceName}\n`)
      const result = await scrapeSpecificSource(sourceName, {
        maxItemsPerSource: 10,
      })
      console.log(`\n✓ Scraped ${result.items.length} items from ${sourceName}`)
      if (result.errors.length > 0) {
        console.log(`\n⚠ ${result.errors.length} errors occurred`)
        result.errors.forEach(err => console.log(`  - ${err.error}`))
      }
    } else {
      console.log('Scraping all enabled sources...\n')
      await scrapeAllNews({
        maxItemsPerSource: parseInt(process.env.NEWS_MAX_ITEMS_PER_SOURCE || '10'),
      })
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
    console.log(`\nTotal news items in database: ${stats.totalItems}`)
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
