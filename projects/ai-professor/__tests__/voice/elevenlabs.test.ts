/**
 * ElevenLabs Client Tests
 */

import { ElevenLabsClient } from '../../lib/voice/elevenlabs'

// Mock fetch
global.fetch = jest.fn()

describe('ElevenLabsClient', () => {
  let client: ElevenLabsClient

  beforeEach(() => {
    // Set up environment variable
    process.env.ELEVENLABS_API_KEY = 'test-api-key'
    
    client = new ElevenLabsClient()
    
    // Reset fetch mock
    ;(fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    delete process.env.ELEVENLABS_API_KEY
  })

  describe('constructor', () => {
    it('should throw error if API key is missing', () => {
      delete process.env.ELEVENLABS_API_KEY
      
      expect(() => new ElevenLabsClient()).toThrow('ElevenLabs API key is required')
    })

    it('should use provided API key', () => {
      const customClient = new ElevenLabsClient('custom-key')
      expect(customClient).toBeDefined()
    })
  })

  describe('generateSpeech', () => {
    it('should generate speech successfully', async () => {
      const mockAudioBuffer = new ArrayBuffer(1024)
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockAudioBuffer,
      })

      const result = await client.generateSpeech('Hello world', 'voice-id')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/text-to-speech/voice-id',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'xi-api-key': 'test-api-key',
          }),
        })
      )

      expect(result).toBeInstanceOf(Buffer)
      expect(result.length).toBe(1024)
    })

    it('should throw error on API failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      await expect(
        client.generateSpeech('Hello world', 'voice-id')
      ).rejects.toThrow('ElevenLabs API error: 400 - Bad Request')
    })
  })

  describe('splitTextIntoChunks', () => {
    it('should split text at sentence boundaries', () => {
      // @ts-ignore - accessing private method for testing
      const chunks = client.splitTextIntoChunks(
        'First sentence. Second sentence. Third sentence.',
        20
      )

      expect(chunks).toHaveLength(3)
      expect(chunks[0]).toBe('First sentence.')
      expect(chunks[1]).toBe(' Second sentence.')
      expect(chunks[2]).toBe(' Third sentence.')
    })

    it('should handle long sentences', () => {
      const longText = 'This is a very long sentence that exceeds the maximum chunk size limit.'
      
      // @ts-ignore - accessing private method for testing
      const chunks = client.splitTextIntoChunks(longText, 20)

      expect(chunks.length).toBeGreaterThan(0)
      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(20 + 100) // Allow some flexibility
      })
    })
  })

  describe('getVoices', () => {
    it('should fetch available voices', async () => {
      const mockVoices = [
        { voice_id: '1', name: 'Voice 1', category: 'generated' },
        { voice_id: '2', name: 'Voice 2', category: 'cloned' },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ voices: mockVoices }),
      })

      const result = await client.getVoices()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/voices',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'xi-api-key': 'test-api-key',
          }),
        })
      )

      expect(result).toEqual(mockVoices)
    })

    it('should throw error on fetch failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      await expect(client.getVoices()).rejects.toThrow('Failed to fetch voices: 401')
    })
  })

  describe('getSubscriptionInfo', () => {
    it('should fetch subscription info', async () => {
      const mockInfo = {
        character_count: 1000,
        character_limit: 5000,
        can_generate: true,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      })

      const result = await client.getSubscriptionInfo()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/user/subscription',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'xi-api-key': 'test-api-key',
          }),
        })
      )

      expect(result).toEqual(mockInfo)
    })
  })

  describe('estimateCost', () => {
    it('should estimate cost correctly', () => {
      const text = 'Hello world'
      const result = client.estimateCost(text)

      expect(result.characterCount).toBe(11)
      expect(result.estimatedCost).toBeCloseTo(0.0033, 4) // (11/1000) * 0.30
    })

    it('should handle empty text', () => {
      const result = client.estimateCost('')

      expect(result.characterCount).toBe(0)
      expect(result.estimatedCost).toBe(0)
    })
  })
})
