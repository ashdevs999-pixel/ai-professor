# Voice Feature Integration Guide

This guide shows how to integrate the voice narration feature into existing pages.

## Quick Start

### 1. Add to News Feed Page

Update `app/news/page.tsx` to add floating mini-player:

```tsx
'use client'

import React, { useState } from 'react'
import { NewsFeed, MiniPlayer } from '@/components/news'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

export default function NewsPage() {
  const [currentAudio, setCurrentAudio] = useState<{
    id: string
    url: string
    title: string
    voice: 'male' | 'female'
  } | null>(null)

  const {
    isPlaying,
    currentTime,
    duration,
    loadAudio,
    togglePlayPause,
    stop,
  } = useAudioPlayer()

  const handlePlayAudio = async (newsId: string, title: string) => {
    // Fetch audio
    const response = await fetch(`/api/news/${newsId}/audio?voice=female`)
    const data = await response.json()

    if (data.success) {
      setCurrentAudio({
        id: newsId,
        url: data.audioUrl,
        title,
        voice: 'female',
      })
      loadAudio(newsId, data.audioUrl, 'female')
    }
  }

  return (
    <>
      {/* Existing content */}
      <section className="py-12">
        <NewsFeed
          showFilters={true}
          showSearch={true}
          infiniteScroll={true}
          itemsPerPage={20}
        />
      </section>

      {/* Mini Player */}
      {currentAudio && (
        <MiniPlayer
          audioId={currentAudio.id}
          audioUrl={currentAudio.url}
          title={currentAudio.title}
          voiceType={currentAudio.voice}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={togglePlayPause}
          onClose={() => {
            stop()
            setCurrentAudio(null)
          }}
        />
      )}
    </>
  )
}
```

### 2. Add to Homepage

Add "Listen to Latest News" CTA to `app/page.tsx`:

```tsx
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui'

// In your featured news section:
<div className="mt-8 flex gap-4">
  <a href="/news">
    <Button>Read Latest News</Button>
  </a>
  <a href="/news?autoplay=true">
    <Button variant="outline" leftIcon={<Volume2 className="w-4 h-4" />}>
      Listen to Latest News
    </Button>
  </a>
</div>
```

### 3. Add Voice Selector to Settings

Create a voice settings section in user settings:

```tsx
import { VoiceSelector } from '@/components/news'
import { useState, useEffect } from 'react'

export function VoiceSettings() {
  const [voice, setVoice] = useState<'male' | 'female'>('female')

  useEffect(() => {
    // Load preference
    fetch('/api/voice')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVoice(data.preferredVoice)
        }
      })
  }, [])

  const handleVoiceChange = async (newVoice: 'male' | 'female') => {
    setVoice(newVoice)
    
    // Save preference
    await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferredVoice: newVoice }),
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Voice Preferences</h3>
      <VoiceSelector
        currentVoice={voice}
        onVoiceChange={handleVoiceChange}
        showPreview
      />
    </div>
  )
}
```

### 4. Add to News Detail Page

Update `app/news/[id]/page.tsx` to show audio player:

```tsx
import { AudioPlayer } from '@/components/news'
import { useState, useEffect } from 'react'

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [audioData, setAudioData] = useState<{
    audioUrl: string
    duration: number
  } | null>(null)
  const [voiceType, setVoiceType] = useState<'male' | 'female'>('female')

  useEffect(() => {
    // Load audio
    fetch(`/api/news/${params.id}/audio?voice=${voiceType}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAudioData({
            audioUrl: data.audioUrl,
            duration: data.duration,
          })
        }
      })
  }, [params.id, voiceType])

  return (
    <article>
      {/* Article content */}
      
      {/* Audio Player */}
      {audioData && (
        <div className="my-8">
          <AudioPlayer
            audioId={params.id}
            audioUrl={audioData.audioUrl}
            duration={audioData.duration}
            title={newsItem.title}
            voiceType={voiceType}
            onVoiceChange={setVoiceType}
          />
        </div>
      )}
    </article>
  )
}
```

## Database Setup

Run the voice schema migration:

```bash
# Apply to your Supabase database
psql $DATABASE_URL < supabase/voice-schema.sql
```

Or manually in Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase/voice-schema.sql
```

## Storage Setup

Create a storage bucket in Supabase:

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `audio`
3. Set to public (for audio file access)
4. Configure CORS if needed

## Environment Setup

Add to `.env.local`:

```bash
ELEVENLABS_API_KEY=xi_your_api_key_here
ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVENLABS_FEMALE_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

## Testing the Integration

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to a news page**

3. **Click "Listen" button** on any news card

4. **Test controls:**
   - Play/Pause
   - Volume adjustment
   - Speed control
   - Voice switching
   - Seek functionality

5. **Test mini-player:**
   - Navigate to different pages
   - Verify audio continues playing
   - Check media session controls

## Monitoring

Check audio generation stats:

```bash
npm run generate-audio -- --stats
```

Generate audio for top articles:

```bash
npm run generate-audio -- --limit 20 --voice female
```

Cleanup old audio:

```bash
npm run generate-audio -- --cleanup
```

## Troubleshooting

### Audio not loading?
- Check browser console for errors
- Verify API endpoint returns valid audio URL
- Check if audio file exists in storage
- Verify ElevenLabs API key is set

### Voice preference not saving?
- Check if user is authenticated
- Verify database column exists
- Check API response for errors

### Mini player not showing?
- Ensure state is managed correctly
- Check conditional rendering logic
- Verify z-index for overlay

## Performance Tips

1. **Lazy load audio**: Only fetch when user clicks play
2. **Preload top articles**: Generate audio for top 10 articles
3. **Cache aggressively**: Use cached audio when available
4. **Cleanup regularly**: Run cleanup script weekly
5. **Monitor costs**: Track API usage

## Next Steps

- Add analytics tracking
- Implement playlist feature
- Add offline support
- Create podcast RSS feed
- Add voice customization

---

Need help? Check the full documentation at `docs/VOICE_FEATURE.md`
