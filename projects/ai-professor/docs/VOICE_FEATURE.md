# Voice Narration Feature - Pulse News

Complete voice narration system for Pulse News (part of Pulse + AI Professor), allowing users to listen to news articles with male or female voice options.

## 🎙️ Features

- **Text-to-Speech**: Generate audio from news summaries using ElevenLabs API
- **Voice Selection**: Choose between male (Adam) and female (Rachel) voices
- **Audio Caching**: Shared cache across all users for cost optimization
- **Playback Controls**: Play/pause, seek, skip, speed control, volume control
- **Mini Player**: Floating player that persists across pages
- **Background Playback**: Media session API support for notification controls
- **Mobile Friendly**: Responsive design with touch-friendly controls

## 📦 Components

### AudioPlayer
Full-featured audio player with all controls:
- Play/pause button
- Progress bar with seek
- Volume control
- Speed control (0.75x - 2.0x)
- Voice toggle
- Skip forward/backward (10s)
- Compact and expanded views

### VoiceSelector
Voice selection component:
- Male/Female toggle
- Voice preview playback
- Compact and full variants

### MiniPlayer
Floating mini-player:
- Always visible at bottom-right
- Progress bar
- Play/pause control
- Expand/close buttons

## 🔌 API Endpoints

### GET `/api/news/[id]/audio`
Get or generate audio for a news item.

**Query Parameters:**
- `voice` (optional): "male" or "female" (default: "female")

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://...",
  "duration": 120,
  "cached": false
}
```

### POST `/api/news/[id]/audio`
Force generate new audio (authenticated).

**Body:**
```json
{
  "voiceType": "female",
  "text": "Optional custom text"
}
```

### GET `/api/voice`
Get user's voice preference (authenticated).

### POST `/api/voice`
Set user's voice preference (authenticated).

**Body:**
```json
{
  "preferredVoice": "female"
}
```

## 🗄️ Database Schema

### `profiles` table (extended)
```sql
ALTER TABLE profiles ADD COLUMN preferred_voice TEXT DEFAULT 'female' 
  CHECK (preferred_voice IN ('male', 'female'));
```

### `news_audio` table
```sql
CREATE TABLE news_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_item_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  voice_type TEXT NOT NULL CHECK (voice_type IN ('male', 'female')),
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  play_count INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(news_item_id, voice_type)
);
```

## 🎨 Usage Examples

### Basic Audio Player
```tsx
import { AudioPlayer } from '@/components/news'

<AudioPlayer
  audioId="news-item-id"
  audioUrl="https://..."
  title="Article Title"
  voiceType="female"
  onVoiceChange={(voice) => console.log(voice)}
/>
```

### With Voice Selection
```tsx
import { VoiceSelector } from '@/components/news'

const [voice, setVoice] = useState<VoiceType>('female')

<VoiceSelector
  currentVoice={voice}
  onVoiceChange={setVoice}
  showPreview
/>
```

### Mini Player
```tsx
import { MiniPlayer } from '@/components/news'

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
    onClose={closePlayer}
  />
)}
```

### Using the Hook
```tsx
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

function MyComponent() {
  const {
    isPlaying,
    currentTime,
    duration,
    loadAudio,
    togglePlayPause,
    seek,
    skip,
    setVolume,
    setPlaybackRate,
    formatTime,
  } = useAudioPlayer()

  // Load audio
  useEffect(() => {
    loadAudio('audio-id', 'https://audio-url.mp3', 'female')
  }, [])

  return (
    <div>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div>{formatTime(currentTime)} / {formatTime(duration)}</div>
    </div>
  )
}
```

## 🚀 Scripts

### Generate Audio (Batch)
```bash
# Generate audio for top 20 articles (female voice)
npm run generate-audio

# Custom options
npm run generate-audio -- --limit 50 --voice male

# Cleanup old audio files
npm run generate-audio -- --cleanup

# Show statistics
npm run generate-audio -- --stats
```

## 🔧 Configuration

### Environment Variables
```bash
# ElevenLabs API Key (required)
ELEVENLABS_API_KEY=xi_your_api_key_here

# Voice IDs (optional, defaults provided)
ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB    # Adam
ELEVENLABS_FEMALE_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel
```

### Voice Configuration
```typescript
// types/voice.ts
export const VOICE_CONFIG = {
  male: {
    name: 'Adam',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    description: 'Authoritative, clear male voice',
  },
  female: {
    name: 'Rachel',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    description: 'Warm, professional female voice',
  },
}
```

## 💰 Cost Optimization

### Strategies
1. **Shared Cache**: Audio generated once, used by all users
2. **Lazy Generation**: Only generate when first user requests
3. **Summary Only**: Generate audio for summaries, not full articles
4. **Automatic Cleanup**: Delete audio older than 7 days with low play count
5. **Top Articles Only**: Limit to top 50 articles

### Estimated Costs
- Average article summary: ~500 characters
- Cost per 1000 characters: ~$0.30
- 100 articles: ~$15/month
- With caching: Cost decreases over time

### Cleanup Policy
- Audio older than 7 days
- Play count < 5
- Automatic deletion via script

## 📱 Mobile Support

- Touch-friendly controls
- Responsive layout
- Media session API for notification controls
- Background playback
- Compact player mode

## ♿ Accessibility

- ARIA labels on all controls
- Keyboard navigation support
- Screen reader compatible
- High contrast colors
- Focus indicators

## 🧪 Testing

```bash
# Run tests
npm test __tests__/voice/

# Run with coverage
npm test -- --coverage __tests__/voice/
```

## 🔒 Security

- API endpoints require authentication for write operations
- Audio cache is publicly readable (shared resource)
- User preferences require authentication
- RLS policies on database tables
- Input validation on all endpoints

## 📊 Monitoring

### Metrics to Track
- Total audio files generated
- Cache hit rate
- Average generation time
- Play count per audio
- Storage usage
- API costs

### Logging
- Audio generation events
- Cache hits/misses
- Playback errors
- API errors

## 🐛 Troubleshooting

### Audio Won't Play
1. Check if audio URL is valid
2. Verify browser supports audio format
3. Check browser console for errors
4. Ensure HTTPS (required for Media Session API)

### Generation Fails
1. Verify ElevenLabs API key
2. Check API quota/limits
3. Verify text content is sufficient
4. Check network connectivity

### Cache Issues
1. Clear browser cache
2. Check database for cached audio
3. Verify storage bucket permissions

## 📝 Future Improvements

- [ ] Multi-language support
- [ ] Custom voice cloning
- [ ] Audio waveform visualization
- [ ] Playlist support
- [ ] Offline playback
- [ ] Podcast RSS feed generation
- [ ] Audio analytics dashboard
- [ ] A/B testing for voices
- [ ] User-generated playlists
- [ ] Audio speed ramping

## 📚 Resources

- [ElevenLabs API Documentation](https://elevenlabs.io/docs/api-reference)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## 📄 License

MIT

---

Built with ❤️ for AI Professor
