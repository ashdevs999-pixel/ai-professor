/**
 * Audio Player Hook
 * Manages audio playback state and controls
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { VoiceType, AudioPlayerState, PlaybackRate } from '@/types/voice'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const [state, setState] = useState<AudioPlayerState>({
    currentAudioId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1.0,
    voiceType: 'female',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load preferences from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('audioPlayerVolume')
    const savedPlaybackRate = localStorage.getItem('audioPlayerPlaybackRate')
    const savedVoiceType = localStorage.getItem('audioPlayerVoiceType') as VoiceType

    setState(prev => ({
      ...prev,
      volume: savedVolume ? parseFloat(savedVolume) : 1,
      playbackRate: savedPlaybackRate ? parseFloat(savedPlaybackRate) : 1.0,
      voiceType: savedVoiceType || 'female',
    }))
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('audioPlayerVolume', state.volume.toString())
    localStorage.setItem('audioPlayerPlaybackRate', state.playbackRate.toString())
    localStorage.setItem('audioPlayerVoiceType', state.voiceType)
  }, [state.volume, state.playbackRate, state.voiceType])

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }))
    }

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }))
      setLoading(false)
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
    }

    const handleError = () => {
      setError('Audio playback error')
      setLoading(false)
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }))
    }

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  // Update audio element properties
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume
      audioRef.current.playbackRate = state.playbackRate
    }
  }, [state.volume, state.playbackRate])

  // Load and play audio
  const loadAudio = useCallback(async (audioId: string, audioUrl: string, voiceType?: VoiceType) => {
    if (!audioRef.current) return

    setLoading(true)
    setError(null)

    try {
      // Stop current audio if playing
      if (state.isPlaying) {
        audioRef.current.pause()
      }

      // Load new audio
      audioRef.current.src = audioUrl
      audioRef.current.load()

      setState(prev => ({
        ...prev,
        currentAudioId: audioId,
        currentTime: 0,
        voiceType: voiceType || prev.voiceType,
      }))
    } catch (err) {
      setError('Failed to load audio')
      setLoading(false)
    }
  }, [state.isPlaying])

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !state.currentAudioId) return

    if (state.isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => {
        setError('Failed to play audio')
      })
    }
  }, [state.isPlaying, state.currentAudioId])

  // Seek to position
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = time
    setState(prev => ({ ...prev, currentTime: time }))
  }, [])

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (!audioRef.current) return
    
    const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, state.duration))
    audioRef.current.currentTime = newTime
    setState(prev => ({ ...prev, currentTime: newTime }))
  }, [state.duration])

  // Set volume
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }))
  }, [])

  // Set playback rate
  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setState(prev => ({ ...prev, playbackRate: rate }))
  }, [])

  // Set voice type
  const setVoiceType = useCallback((voiceType: VoiceType) => {
    setState(prev => ({ ...prev, voiceType }))
  }, [])

  // Stop audio
  const stop = useCallback(() => {
    if (!audioRef.current) return
    
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      currentAudioId: null,
    }))
  }, [])

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    // State
    ...state,
    loading,
    error,
    
    // Controls
    loadAudio,
    togglePlayPause,
    seek,
    skip,
    setVolume,
    setPlaybackRate,
    setVoiceType,
    stop,
    
    // Helpers
    formatTime,
    audioRef,
  }
}
