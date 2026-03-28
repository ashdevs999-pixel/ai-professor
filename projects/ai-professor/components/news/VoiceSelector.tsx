'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Loader2 } from 'lucide-react'
import type { VoiceType } from '@/types/voice'
import { VOICE_CONFIG, VOICE_TYPE_LABELS } from '@/types/voice'

interface VoiceSelectorProps {
  currentVoice: VoiceType
  onVoiceChange: (voice: VoiceType) => void
  showPreview?: boolean
  compact?: boolean
}

export function VoiceSelector({
  currentVoice,
  onVoiceChange,
  showPreview = true,
  compact = false,
}: VoiceSelectorProps) {
  const [playingPreview, setPlayingPreview] = useState<VoiceType | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handleVoiceChange = (voice: VoiceType) => {
    onVoiceChange(voice)
  }

  const playPreview = async (voiceType: VoiceType) => {
    // Stop current preview if playing
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setPlayingPreview(null)
    }

    // If clicking same voice, just stop
    if (playingPreview === voiceType) {
      return
    }

    // Play new preview
    const previewUrl = VOICE_CONFIG[voiceType].previewUrl
    const newAudio = new Audio(previewUrl)
    
    setAudio(newAudio)
    setPlayingPreview(voiceType)

    newAudio.onended = () => {
      setPlayingPreview(null)
    }

    newAudio.onerror = () => {
      console.error('Failed to load voice preview')
      setPlayingPreview(null)
    }

    try {
      await newAudio.play()
    } catch (error) {
      console.error('Failed to play preview:', error)
      setPlayingPreview(null)
    }
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        {(['male', 'female'] as VoiceType[]).map((voice) => (
          <button
            key={voice}
            onClick={() => handleVoiceChange(voice)}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
              currentVoice === voice
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {voice === 'male' ? '👨 Male' : '👩 Female'}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {(['male', 'female'] as VoiceType[]).map((voice) => {
        const config = VOICE_CONFIG[voice]
        const isSelected = currentVoice === voice
        const isPlaying = playingPreview === voice

        return (
          <motion.button
            key={voice}
            onClick={() => handleVoiceChange(voice)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {voice === 'male' ? '👨' : '👩'}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {config.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {config.description}
                    </p>
                  </div>
                </div>
              </div>

              {showPreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    playPreview(voice)
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={`Preview ${voice} voice`}
                >
                  {isPlaying ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}

              {isSelected && (
                <div className="ml-2 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
