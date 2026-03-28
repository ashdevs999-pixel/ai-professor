// Voice Types

export type VoiceType = 'male' | 'female'

export interface VoicePreference {
  userId: string
  preferredVoice: VoiceType
  updatedAt: string
}

export interface NewsAudio {
  id: string
  newsItemId: string
  voiceType: VoiceType
  audioUrl: string
  durationSeconds: number | null
  fileSizeBytes: number | null
  generatedAt: string
  playCount: number
  lastPlayedAt: string | null
  createdAt: string
}

export interface AudioGenerationRequest {
  newsItemId: string
  voiceType: VoiceType
  text?: string // Optional: if not provided, will use news item summary
}

export interface AudioGenerationResponse {
  success: boolean
  audioUrl?: string
  duration?: number
  error?: string
  cached?: boolean
}

export interface AudioPlayerState {
  currentAudioId: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  voiceType: VoiceType
}

export interface AudioPlayerProps {
  audioId: string
  audioUrl: string
  duration?: number
  title: string
  voiceType: VoiceType
  onPlayStateChange?: (isPlaying: boolean) => void
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
  onError?: (error: string) => void
  autoPlay?: boolean
  showVoiceToggle?: boolean
  showSpeedControl?: boolean
  showVolumeControl?: boolean
  compact?: boolean
}

export interface VoiceSelectorProps {
  currentVoice: VoiceType
  onVoiceChange: (voice: VoiceType) => void
  showPreview?: boolean
  compact?: boolean
}

export interface MiniPlayerProps {
  audioId: string
  audioUrl: string
  title: string
  voiceType: VoiceType
  isPlaying: boolean
  onPlayPause: () => void
  onClose: () => void
  onExpand?: () => void
}

export interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  labels: Record<string, string>
}

export interface ElevenLabsTTSRequest {
  text: string
  voice_id: string
  model_id?: string
  voice_settings?: {
    stability: number
    similarity_boost: number
    style?: number
    use_speaker_boost?: boolean
  }
}

export interface AudioChunk {
  text: string
  audioBuffer: Buffer
  order: number
}

// Voice configuration
export const VOICE_CONFIG = {
  male: {
    name: 'Adam',
    voiceId: process.env.ELEVENLABS_MALE_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Adam voice ID
    description: 'Authoritative, clear male voice',
    previewUrl: '/audio/male-voice-preview.mp3',
  },
  female: {
    name: 'Rachel',
    voiceId: process.env.ELEVENLABS_FEMALE_VOICE_ID || '21m00Tcm4TlvDq8ikWAM', // Rachel voice ID
    description: 'Warm, professional female voice',
    previewUrl: '/audio/female-voice-preview.mp3',
  },
} as const

export const PLAYBACK_RATES = [0.75, 1.0, 1.25, 1.5, 2.0] as const
export type PlaybackRate = typeof PLAYBACK_RATES[number]

// Utility types
export const VOICE_TYPE_LABELS: Record<VoiceType, string> = {
  male: 'Male Voice 👨',
  female: 'Female Voice 👩',
}

export const PLAYBACK_RATE_LABELS: Record<PlaybackRate, string> = {
  0.75: '0.75x (Slower)',
  1.0: '1.0x (Normal)',
  1.25: '1.25x (Faster)',
  1.5: '1.5x (Fast)',
  2.0: '2.0x (Very Fast)',
}
