#!/usr/bin/env ts-node

// Automated News Cron Job
// Run: npm run news:watch
// This script runs continuously and scrapes news every 6 hours

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { scrapeAllNews, getScrapingStats } from '../lib/news/scraper'
import { processAllUnprocessed } from '../lib/news/summarizer'

const SCRAPE_INTERVAL_HOURS = parseInt(process.env.NEWS_SCRAPE_INTERVAL_HOURS || '6')
const SCRAPE_INTERVAL_MS = SCRAPE_INTERVAL_HOURS * 60 * 60 * 1000

let isRunning = false

async function runScraping() {
  if (isRunning) {
    console.log('Scraping already in progress, skipping...')
    return
  }

  isRunning = true
  console.log(`\n${new Date().toISOString()} - Starting news scraping...`)

  try {
    // Scrape all sources
    await scrapeAllNews()
    console.log('✓ Scraping completed')

    // Process summaries with AI
    console.log('Processing summaries with AI...')
    await processAllUnprocessed(50)
    console.log('✓ Summaries processed')

    // Show stats
    const stats = await getScrapingStats()
    console.log(`Total news items: ${stats.totalArticles}`)
    console.log(`AI articles: ${stats.aiArticles}`)
    console.log(`Breaking news: ${stats.breakingArticles}`)
  } catch (error) {
    console.error('Error during scraping:', error)
  } finally {
    isRunning = false
  }
}

async function main() {
  console.log('📰 CXO News Cron Job')
  console.log(`Interval: Every ${SCRAPE_INTERVAL_HOURS} hours\n`)

  // Run immediately on startup
  await runScraping()

  // Schedule periodic runs
  console.log(`\nNext scrape in ${SCRAPE_INTERVAL_HOURS} hours...`)
  
  setInterval(async () => {
    await runScraping()
    console.log(`\nNext scrape in ${SCRAPE_INTERVAL_HOURS} hours...`)
  }, SCRAPE_INTERVAL_MS)

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...')
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log('\nShutting down gracefully...')
    process.exit(0)
  })
}

main().catch(console.error)
