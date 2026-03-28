#!/usr/bin/env tsx
/**
 * Batch Audio Generation Script
 * Generates audio for top news items
 * 
 * Usage: 
 *   npm run generate-audio
 *   npm run generate-audio -- --limit 50 --voice female
 */

import { config } from 'dotenv'
config()

import { createClient } from '@supabase/supabase-js'
import { getAudioGenerator } from '../lib/voice/audio-generator'
import type { VoiceType } from '../types/voice'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface CLIOptions {
  limit: number
  voice: VoiceType
  cleanup: boolean
  stats: boolean
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)
  
  const options: CLIOptions = {
    limit: 20,
    voice: 'female',
    cleanup: false,
    stats: false,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--limit':
      case '-l':
        options.limit = parseInt(args[i + 1]) || 20
        i++
        break
      case '--voice':
      case '-v':
        const voice = args[i + 1]
        if (voice === 'male' || voice === 'female') {
          options.voice = voice
        }
        i++
        break
      case '--cleanup':
      case '-c':
        options.cleanup = true
        break
      case '--stats':
      case '-s':
        options.stats = true
        break
      case '--help':
      case '-h':
        console.log(`
Audio Generation Script

Usage: npm run generate-audio [options]

Options:
  --limit, -l <number>    Number of articles to process (default: 20)
  --voice, -v <type>      Voice type: male or female (default: female)
  --cleanup, -c           Cleanup old audio files
  --stats, -s             Show audio statistics
  --help, -h              Show this help message

Examples:
  npm run generate-audio
  npm run generate-audio -- --limit 50 --voice male
  npm run generate-audio -- --cleanup
  npm run generate-audio -- --stats
        `)
        process.exit(0)
    }
  }

  return options
}

async function generateAudio(options: CLIOptions) {
  console.log('🎙️  Audio Generation Script\n')
  console.log(`Settings:`)
  console.log(`  Limit: ${options.limit} articles`)
  console.log(`  Voice: ${options.voice}\n`)

  const audioGenerator = getAudioGenerator()

  try {
    // Fetch top news items
    console.log('📥 Fetching news items...')
    const { data: newsItems, error } = await supabase
      .from('news_items')
      .select('id, title, summary, content')
      .order('published_at', { ascending: false })
      .limit(options.limit)

    if (error) {
      throw new Error(`Failed to fetch news items: ${error.message}`)
    }

    if (!newsItems || newsItems.length === 0) {
      console.log('⚠️  No news items found')
      return
    }

    console.log(`✓ Found ${newsItems.length} news items\n`)

    // Prepare items for batch generation
    const itemsToProcess = newsItems.map(item => ({
      id: item.id,
      text: item.summary || item.content || item.title,
    }))

    // Generate audio
    console.log('🎙️  Generating audio...\n')
    const results = await audioGenerator.batchGenerateAudio(
      itemsToProcess,
      options.voice,
      options.limit
    )

    // Summary
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    console.log('\n📊 Results:')
    console.log(`  ✅ Successful: ${successful}`)
    console.log(`  ❌ Failed: ${failed}`)

    if (failed > 0) {
      console.log('\nFailed items:')
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.id}: ${r.error}`)
        })
    }

    console.log('\n✅ Audio generation complete!')
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

async function cleanupAudio() {
  console.log('🧹 Cleaning up old audio files...\n')
  
  const audioGenerator = getAudioGenerator()
  const count = await audioGenerator.cleanupOldAudio(7)
  
  console.log(`\n✅ Cleaned up ${count} old audio files`)
}

async function showStats() {
  console.log('📊 Audio Statistics\n')
  
  const audioGenerator = getAudioGenerator()
  const stats = await audioGenerator.getStats()

  console.log(`Total Audio Files: ${stats.totalAudioFiles}`)
  console.log(`Total Size: ${(stats.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Average Duration: ${stats.averageDuration} seconds`)
  console.log(`Oldest Audio: ${stats.oldestAudio || 'N/A'}`)
}

// Main execution
async function main() {
  const options = parseArgs()

  if (options.stats) {
    await showStats()
  } else if (options.cleanup) {
    await cleanupAudio()
  } else {
    await generateAudio(options)
  }
}

main().catch(console.error)
