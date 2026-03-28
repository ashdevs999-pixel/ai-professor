'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, X, Maximize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import type { VoiceType } from '@/types/voice'

interface MiniPlayerProps {
  audioId: string
  audioUrl: string
  title: string
  voiceType: VoiceType
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onClose: () => void
  onExpand?: () => void
  loading?: boolean
}

export function MiniPlayer({
  audioId,
  audioUrl,
  title,
  voiceType,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onClose,
  onExpand,
  loading = false,
}: MiniPlayerProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          {/* Progress Bar (top) */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-primary-600"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Content */}
          <div className="p-3 flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>{voiceType === 'male' ? '👨' : '👩'}</span>
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {onExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpand}
                  aria-label="Expand player"
                  className="p-2"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close mini player"
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hover Expand Info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Now Playing</span>
                    <span>
                      {Math.round(progress)}% complete
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
