# Voice Feature - Quick Reference

## 🎯 Most Common Tasks

### Play Audio in Component
```tsx
import { AudioPlayer } from '@/components/news'

<AudioPlayer
  audioId="news-id"
  audioUrl="https://..."
  title="Article Title"
  voiceType="female"
/>
```

### Fetch Audio via API
```tsx
const response = await fetch(`/api/news/${newsId}/audio?voice=female`)
const { audioUrl, duration } = await response.json()
```

### Use Audio Hook
```tsx
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

const {
  isPlaying,
  currentTime,
  duration,
  loadAudio,
  togglePlayPause,
  seek,
  formatTime,
} = useAudioPlayer()

// Load and play
loadAudio('id', 'url', 'female')
togglePlayPause()
```

### Generate Audio (Script)
```bash
# Generate for top 20 articles
npm run generate-audio

# Custom options
npm run generate-audio -- --limit 50 --voice male

# Cleanup
npm run generate-audio -- --cleanup
```

### Set User Voice Preference
```tsx
await fetch('/api/voice', {
  method: 'POST',
  body: JSON.stringify({ preferredVoice: 'female' }),
})
```

## 📝 Environment Variables

```bash
# Required
ELEVENLABS_API_KEY=xi_...

# Optional (defaults provided)
ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVENLABS_FEMALE_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

## 🔗 Key Files

- **Database Schema**: `supabase/voice-schema.sql`
- **API Routes**: `app/api/news/[id]/audio/route.ts`
- **Components**: `components/news/AudioPlayer.tsx`
- **Hook**: `hooks/useAudioPlayer.ts`
- **Types**: `types/voice.ts`

## 🎨 Component Props

### AudioPlayer
```typescript
interface AudioPlayerProps {
  audioId: string          // Unique ID
  audioUrl: string         // Audio file URL
  title: string            // Article title
  duration?: number        // Duration in seconds
  voiceType: 'male' | 'female'
  onVoiceChange?: (voice: VoiceType) => void
  compact?: boolean        // Compact mode
  showVoiceToggle?: boolean
}
```

### VoiceSelector
```typescript
interface VoiceSelectorProps {
  currentVoice: 'male' | 'female'
  onVoiceChange: (voice: VoiceType) => void
  showPreview?: boolean    // Play sample audio
  compact?: boolean        // Compact toggle
}
```

### MiniPlayer
```typescript
interface MiniPlayerProps {
  audioId: string
  audioUrl: string
  title: string
  voiceType: 'male' | 'female'
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onClose: () => void
  onExpand?: () => void
}
```

## 🎛️ Hook Return Values

```typescript
{
  // State
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  voiceType: 'male' | 'female'
  loading: boolean
  error: string | null
  
  // Controls
  loadAudio: (id, url, voice?) => void
  togglePlayPause: () => void
  seek: (time: number) => void
  skip: (seconds: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  setVoiceType: (voice: VoiceType) => void
  stop: () => void
  
  // Helpers
  formatTime: (seconds: number) => string
}
```

## 🎵 Audio API Endpoints

### GET /api/news/[id]/audio
Query params:
- `voice`: 'male' | 'female' (default: 'female')

Response:
```json
{
  "success": true,
  "audioUrl": "https://...",
  "duration": 120,
  "cached": false
}
```

### POST /api/news/[id]/audio
Body:
```json
{
  "voiceType": "female",
  "text": "Optional custom text"
}
```

### GET /api/voice
Response:
```json
{
  "success": true,
  "preferredVoice": "female"
}
```

### POST /api/voice
Body:
```json
{
  "preferredVoice": "female"
}
```

## 🗄️ Database Queries

### Check if audio exists
```sql
SELECT * FROM news_audio
WHERE news_item_id = 'uuid'
AND voice_type = 'female';
```

### Get audio stats
```sql
SELECT
  COUNT(*) as total_files,
  SUM(file_size_bytes) as total_size,
  AVG(duration_seconds) as avg_duration
FROM news_audio;
```

### Cleanup old audio
```sql
DELETE FROM news_audio
WHERE generated_at < NOW() - INTERVAL '7 days'
AND play_count < 5;
```

## 💰 Cost Estimation

- **Characters per article**: ~500 (summary)
- **Cost per 1K characters**: ~$0.30
- **100 articles**: ~$15
- **With caching**: Cost decreases over time

## ⚡ Performance Tips

1. **Use cache**: Check for existing audio before generating
2. **Lazy load**: Only fetch when user clicks play
3. **Batch generate**: Pre-generate for top articles
4. **Cleanup regularly**: Delete unused audio weekly
5. **Monitor costs**: Track API usage

## 🐛 Common Issues

### Audio won't play
- Check browser console
- Verify audio URL is valid
- Check HTTPS requirement

### Generation fails
- Verify API key
- Check API quota
- Validate text length (>50 chars)

### Voice preference not saving
- Check authentication
- Verify database column
- Check API response

## 📞 Support

- **Full docs**: `docs/VOICE_FEATURE.md`
- **Integration**: `docs/VOICE_INTEGRATION.md`
- **File list**: `docs/VOICE_FILES.md`

## 🚀 Quick Commands

```bash
# Setup
./scripts/setup-voice.sh

# Generate audio
npm run generate-audio

# Run cron
npm run voice-cron

# Run tests
npm test __tests__/voice/
```

---

Keep this handy! 📌
