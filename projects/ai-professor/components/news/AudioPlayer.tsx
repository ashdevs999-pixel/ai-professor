'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Button, Slider, Select } from '@/components/ui'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { VoiceSelector } from './VoiceSelector'
import type { VoiceType, PlaybackRate } from '@/types/voice'
import { PLAYBACK_RATES, PLAYBACK_RATE_LABELS } from '@/types/voice'

interface AudioPlayerProps {
  audioId: string
  audioUrl: string
  title: string
  duration?: number
  voiceType: VoiceType
  onVoiceChange?: (voice: VoiceType) => void
  onPlayStateChange?: (isPlaying: boolean) => void
  compact?: boolean
  showVoiceToggle?: boolean
}

export function AudioPlayer({
  audioId,
  audioUrl,
  title,
  duration,
  voiceType,
  onVoiceChange,
  onPlayStateChange,
  compact = false,
  showVoiceToggle = true,
}: AudioPlayerProps) {
  const [expanded, setExpanded] = useState(!compact)
  const [showSettings, setShowSettings] = useState(false)
  
  const {
    isPlaying,
    currentTime,
    duration: audioDuration,
    volume,
    playbackRate,
    loading,
    error,
    loadAudio,
    togglePlayPause,
    seek,
    skip,
    setVolume,
    setPlaybackRate,
    formatTime,
  } = useAudioPlayer()

  // Load audio when URL changes
  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioId, audioUrl, voiceType)
    }
  }, [audioId, audioUrl, voiceType, loadAudio])

  // Notify parent of play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying)
  }, [isPlaying, onPlayStateChange])

  // Set up media session for background playback
  useEffect(() => {
    if ('mediaSession' in navigator && isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: `CXO News (${voiceType === 'male' ? 'Male' : 'Female'} Voice)`,
        album: 'CXO Academy',
      })

      navigator.mediaSession.setActionHandler('play', togglePlayPause)
      navigator.mediaSession.setActionHandler('pause', togglePlayPause)
      navigator.mediaSession.setActionHandler('seekbackward', () => skip(-10))
      navigator.mediaSession.setActionHandler('seekforward', () => skip(10))
      
      const durationValue = audioDuration || duration || 0
      if (durationValue > 0) {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            seek(details.seekTime)
          }
        })
      }
    }
  }, [isPlaying, title, voiceType, audioDuration, duration, togglePlayPause, skip, seek])

  const handleProgressChange = (value: number[]) => {
    seek(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const handleSpeedChange = (rate: PlaybackRate) => {
    setPlaybackRate(rate)
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          ⚠️ Audio playback error: {error}
        </p>
      </div>
    )
  }

  const displayDuration = audioDuration || duration || 0
  const progress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
    >
      {/* Compact View */}
      {!expanded && (
        <div className="p-3 flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            disabled={loading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(displayDuration)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(true)}
            className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Expand player"
          >
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {voiceType === 'male' ? '👨 Male Voice' : '👩 Female Voice'}
                  </p>
                </div>
                {compact && (
                  <button
                    onClick={() => setExpanded(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Collapse player"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={displayDuration}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                  aria-label="Audio progress"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(displayDuration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(-10)}
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                <button
                  onClick={togglePlayPause}
                  disabled={loading}
                  className="w-14 h-14 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(10)}
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between">
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVolume(volume === 0 ? 1 : 0)}
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                    aria-label="Volume"
                  />
                </div>

                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    {/* Speed Control */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Playback Speed
                      </label>
                      <div className="flex gap-2">
                        {PLAYBACK_RATES.map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handleSpeedChange(rate)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              playbackRate === rate
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice Selector */}
                    {showVoiceToggle && onVoiceChange && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Voice Type
                        </label>
                        <VoiceSelector
                          currentVoice={voiceType}
                          onVoiceChange={onVoiceChange}
                          compact
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
