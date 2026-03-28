/**
 * ElevenLabs Text-to-Speech API Client
 * Handles voice synthesis for news audio generation
 */

import type { ElevenLabsVoice, ElevenLabsTTSRequest } from '@/types/voice'

const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1'

export class ElevenLabsClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || ''
    
    // Don't throw during build - only throw when actually used
  }

  private ensureApiKey() {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key is required. Set ELEVENLABS_API_KEY environment variable.')
    }
  }

  /**
   * Generate speech from text
   */
  async generateSpeech(
    text: string,
    voiceId: string,
    options?: {
      modelId?: string
      stability?: number
      similarityBoost?: number
      style?: number
      useSpeakerBoost?: boolean
    }
  ): Promise<Buffer> {
    this.ensureApiKey()
    const url = `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}`
    
    const requestBody: ElevenLabsTTSRequest = {
      text,
      voice_id: voiceId,
      model_id: options?.modelId || 'eleven_monolingual_v1',
      voice_settings: {
        stability: options?.stability ?? 0.5,
        similarity_boost: options?.similarityBoost ?? 0.75,
        style: options?.style ?? 0,
        use_speaker_boost: options?.useSpeakerBoost ?? true,
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`ElevenLabs API error: ${response.status} - ${error}`)
      }

      // Get audio buffer
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error('ElevenLabs speech generation error:', error)
      throw error
    }
  }

  /**
   * Generate speech for long text by splitting into chunks
   */
  async generateSpeechLongText(
    text: string,
    voiceId: string,
    maxChunkSize: number = 5000
  ): Promise<Buffer[]> {
    this.ensureApiKey()
    // Split text into chunks
    const chunks = this.splitTextIntoChunks(text, maxChunkSize)
    
    // Generate audio for each chunk
    const audioBuffers: Buffer[] = []
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Generating audio for chunk ${i + 1}/${chunks.length}...`)
      
      const audioBuffer = await this.generateSpeech(chunks[i], voiceId, {
        stability: 0.5,
        similarityBoost: 0.75,
      })
      
      audioBuffers.push(audioBuffer)
      
      // Add small delay to avoid rate limiting
      if (i < chunks.length - 1) {
        await this.delay(500)
      }
    }
    
    return audioBuffers
  }

  /**
   * Split text into chunks at sentence boundaries
   */
  private splitTextIntoChunks(text: string, maxSize: number): string[] {
    const chunks: string[] = []
    let currentChunk = ''
    
    // Split by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += sentence
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    this.ensureApiKey()
    const url = `${ELEVENLABS_API_BASE}/voices`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`)
      }

      const data = await response.json()
      return data.voices
    } catch (error) {
      console.error('Error fetching voices:', error)
      throw error
    }
  }

  /**
   * Get user subscription info
   */
  async getSubscriptionInfo(): Promise<{
    character_count: number
    character_limit: number
    can_generate: boolean
  }> {
    this.ensureApiKey()
    const url = `${ELEVENLABS_API_BASE}/user/subscription`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription info: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching subscription info:', error)
      throw error
    }
  }

  /**
   * Estimate character count and cost
   */
  estimateCost(text: string): {
    characterCount: number
    estimatedCost: number
  } {
    const characterCount = text.length
    // ElevenLabs pricing: ~$0.30 per 1000 characters
    const estimatedCost = (characterCount / 1000) * 0.30
    
    return {
      characterCount,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
    }
  }

  /**
   * Helper: delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
let elevenLabsClient: ElevenLabsClient | null = null

export function getElevenLabsClient(): ElevenLabsClient {
  if (!elevenLabsClient) {
    elevenLabsClient = new ElevenLabsClient()
  }
  return elevenLabsClient
}
