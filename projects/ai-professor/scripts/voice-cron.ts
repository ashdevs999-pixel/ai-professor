#!/usr/bin/env tsx
/**
 * Voice Audio Cron Job
 * Scheduled task to generate audio and cleanup old files
 * 
 * Can be run via:
 * - Node cron: schedule with node-cron package
 * - System cron: add to crontab
 * - GitHub Actions: scheduled workflow
 * - Vercel Cron: vercel.json configuration
 */

import { config } from 'dotenv'
config()

import { createClient } from '@supabase/supabase-js'
import { getAudioGenerator } from '../lib/voice/audio-generator'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface CronConfig {
  generateLimit: number
  cleanupDays: number
  voiceType: 'male' | 'female'
}

const config_defaults: CronConfig = {
  generateLimit: parseInt(process.env.VOICE_GENERATE_LIMIT || '20'),
  cleanupDays: parseInt(process.env.VOICE_CLEANUP_DAYS || '7'),
  voiceType: (process.env.VOICE_DEFAULT_TYPE as 'male' | 'female') || 'female',
}

/**
 * Main cron job function
 */
async function runVoiceCron() {
  console.log('🎙️  Voice Audio Cron Job Started')
  console.log(`Time: ${new Date().toISOString()}\n`)

  const startTime = Date.now()
  const audioGenerator = getAudioGenerator()

  try {
    // 1. Generate audio for latest articles
    console.log('📝 Step 1: Generating audio for latest articles...')
    const { data: newsItems, error: fetchError } = await supabase
      .from('news_items')
      .select('id, title, summary, content')
      .order('published_at', { ascending: false })
      .limit(config_defaults.generateLimit)

    if (fetchError) {
      throw new Error(`Failed to fetch news items: ${fetchError.message}`)
    }

    if (!newsItems || newsItems.length === 0) {
      console.log('⚠️  No news items found\n')
    } else {
      console.log(`✓ Found ${newsItems.length} news items to process\n`)

      const itemsToProcess = newsItems.map(item => ({
        id: item.id,
        text: item.summary || item.content || item.title,
      }))

      const results = await audioGenerator.batchGenerateAudio(
        itemsToProcess,
        config_defaults.voiceType,
        config_defaults.generateLimit
      )

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      console.log(`\n📊 Generation Results:`)
      console.log(`  ✅ Successful: ${successful}`)
      console.log(`  ❌ Failed: ${failed}\n`)
    }

    // 2. Cleanup old audio files
    console.log('🧹 Step 2: Cleaning up old audio files...')
    const cleanedCount = await audioGenerator.cleanupOldAudio(config_defaults.cleanupDays)
    console.log(`✓ Cleaned up ${cleanedCount} old audio files\n`)

    // 3. Get statistics
    console.log('📊 Step 3: Gathering statistics...')
    const stats = await audioGenerator.getStats()
    console.log(`  Total Audio Files: ${stats.totalAudioFiles}`)
    console.log(`  Total Size: ${(stats.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Average Duration: ${stats.averageDuration}s\n`)

    // 4. Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log('✅ Cron job completed successfully!')
    console.log(`⏱️  Total time: ${duration}s\n`)

    return {
      success: true,
      generated: newsItems?.length || 0,
      cleaned: cleanedCount,
      stats,
    }
  } catch (error) {
    console.error('\n❌ Cron job failed:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * For running as standalone script
 */
if (require.main === module) {
  runVoiceCron()
    .then(result => {
      console.log('Final result:', JSON.stringify(result, null, 2))
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

/**
 * Export for use in other modules
 */
export { runVoiceCron }

/**
 * VERCEL CRON CONFIGURATION
 * 
 * Add to vercel.json:
 * 
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/voice-audio",
 *       "schedule": "0 */6 * * *"
 *     }
 *   ]
 * }
 * 
 * Then create app/api/cron/voice-audio/route.ts:
 * 
 * import { runVoiceCron } from '@/scripts/voice-cron'
 * 
 * export async function GET(request: Request) {
 *   // Verify cron secret
 *   const authHeader = request.headers.get('authorization')
 *   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
 *     return new Response('Unauthorized', { status: 401 })
 *   }
 * 
 *   const result = await runVoiceCron()
 *   return Response.json(result)
 * }
 */

/**
 * SYSTEM CRON CONFIGURATION
 * 
 * Add to crontab (crontab -e):
 * 
 * # Run every 6 hours
 * 0 */6 * * * cd /path/to/ai-professor && npm run voice-cron >> /var/log/voice-cron.log 2>&1
 * 
 * Add to package.json:
 * 
 * "scripts": {
 *   "voice-cron": "tsx scripts/voice-cron.ts"
 * }
 */

/**
 * NODE-CRON CONFIGURATION
 * 
 * Install: npm install node-cron
 * 
 * Create scripts/schedule-voice-cron.ts:
 * 
 * import cron from 'node-cron'
 * import { runVoiceCron } from './voice-cron'
 * 
 * // Run every 6 hours
 * cron.schedule('0 */6 * * *', async () => {
 *   console.log('Running voice audio cron job...')
 *   await runVoiceCron()
 * })
 * 
 * console.log('Voice cron job scheduled (every 6 hours)')
 */

/**
 * GITHUB ACTIONS CONFIGURATION
 * 
 * Create .github/workflows/voice-cron.yml:
 * 
 * name: Voice Audio Cron
 * on:
 *   schedule:
 *     - cron: '0 */6 * * *'  # Every 6 hours
 * 
 * jobs:
 *   cron:
 *     runs-on: ubuntu-latest
 *     steps:
 *       - uses: actions/checkout@v3
 *       - uses: actions/setup-node@v3
 *         with:
 *           node-version: '20'
 *       - run: npm ci
 *       - run: npm run voice-cron
 *         env:
 *           NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
 *           SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
 *           ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
 */
