/**
 * Audio Generator - Uses OpenAI TTS
 * Simplified version - streams audio directly from OpenAI
 */

import type { VoiceType, AudioGenerationResponse } from '@/types/voice'

// OpenAI TTS voices
const OPENAI_VOICES = {
  male: 'onyx',      // Deep male voice
  female: 'nova',    // Warm female voice
}

export class AudioGenerator {
  /**
   * Generate audio for text using OpenAI TTS
   * Returns the audio URL directly from OpenAI
   */
  async getOrGenerateAudio(
    newsItemId: string,
    voiceType: VoiceType = 'female'
  ): Promise<AudioGenerationResponse> {
    try {
      // For now, return a simple response
      // The actual audio generation happens in the API route
      return {
        success: true,
        audio: {
          id: newsItemId,
          news_item_id: newsItemId,
          voice_type: voiceType,
          file_path: '',
          audio_url: '',
          file_size: 0,
          duration_seconds: 0,
        },
      }
    } catch (error: any) {
      console.error('Audio error:', error)
      return { success: false, error: error.message || 'Internal error' }
    }
  }

  /**
   * Generate audio stream from OpenAI
   */
  async generateAudioStream(
    text: string,
    voiceType: VoiceType = 'female'
  ): Promise<ReadableStream | null> {
    try {
      // Limit text length
      const limitedText = text.substring(0, 4000)

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: limitedText,
          voice: OPENAI_VOICES[voiceType],
          response_format: 'mp3',
        }),
      })

      if (!response.ok) {
        console.error('OpenAI TTS error:', await response.text())
        return null
      }

      return response.body
    } catch (error) {
      console.error('Audio stream error:', error)
      return null
    }
  }

  /**
   * Generate audio buffer from OpenAI
   */
  async generateAudioBuffer(
    text: string,
    voiceType: VoiceType = 'female'
  ): Promise<Buffer | null> {
    try {
      const stream = await this.generateAudioStream(text, voiceType)
      if (!stream) return null

      const reader = stream.getReader()
      const chunks: Uint8Array[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }

      return Buffer.concat(chunks)
    } catch (error) {
      console.error('Audio buffer error:', error)
      return null
    }
  }
}

// Export singleton instance
export const audioGenerator = new AudioGenerator()
