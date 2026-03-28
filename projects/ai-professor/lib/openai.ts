// OpenAI Client Configuration

import OpenAI from 'openai'
import { ContentType } from '../types/course'

// Lazy initialization to avoid build-time errors
let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
    })
  }
  return _openai
}

// Export a proxy that lazily initializes
export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    return getOpenAI()[prop as keyof OpenAI]
  }
})

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count }
}

// Content generation prompts
const SYSTEM_PROMPTS: Record<ContentType, string> = {
  lesson_outline: `You are an expert curriculum designer. Create a detailed lesson outline based on the topic and context provided.
  
Format your response as JSON:
{
  "title": "Lesson title",
  "objectives": ["Objective 1", "Objective 2"],
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "estimated_time": 60
}`,

  lesson_content: `You are an expert educator. Create comprehensive lesson content that is engaging, educational, and well-structured.
  
Include:
- Clear explanations with examples
- Code snippets where relevant
- Practical applications
- Common pitfalls to avoid

Format as JSON:
{
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed content...",
      "examples": ["Example 1"]
    }
  ]
}`,

  quiz: `You are an expert at creating assessments. Design a quiz to test understanding of the lesson content.
  
Format as JSON:
{
  "title": "Quiz title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Explanation of correct answer"
    }
  ],
  "passing_score": 70
}`,

  summary: `You are an expert at distilling complex information. Create a concise but comprehensive summary.
  
Format as JSON:
{
  "summary": "2-3 paragraph summary",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "takeaways": ["Takeaway 1", "Takeaway 2"]
}`,

  exercises: `You are an expert at creating practical exercises. Design hands-on exercises to reinforce learning.
  
Format as JSON:
{
  "exercises": [
    {
      "title": "Exercise title",
      "description": "Detailed description",
      "difficulty": "easy|medium|hard",
      "estimated_time": 30,
      "hints": ["Hint 1", "Hint 2"],
      "solution": "Optional solution"
    }
  ]
}`,

  resources: `You are an expert curator of learning resources. Recommend high-quality resources for further learning.
  
Format as JSON:
{
  "resources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "type": "article|video|book|tool",
      "description": "Why this resource is valuable"
    }
  ]
}`,
}

// Generate content with GPT-4o
export async function generateContent(
  contentType: ContentType,
  prompt: string,
  context?: string,
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<{
  content: any
  tokensUsed: number
  generationTimeMs: number
}> {
  const startTime = Date.now()

  const systemPrompt = SYSTEM_PROMPTS[contentType]
  const userPrompt = context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No content generated')
  }

  const generationTimeMs = Date.now() - startTime
  const tokensUsed = response.usage?.total_tokens || 0

  return {
    content: JSON.parse(content),
    tokensUsed,
    generationTimeMs,
  }
}

// Generate research summary
export async function generateResearch(
  topic: string,
  depth: 'brief' | 'detailed' | 'comprehensive' = 'detailed'
): Promise<{
  summary: string
  keyInsights: string[]
  sources: Array<{ title: string; type: string; description: string }>
  recommendedReading: string[]
}> {
  const depthInstructions = {
    brief: 'Provide a concise overview (2-3 paragraphs) with 3 key insights.',
    detailed: 'Provide a comprehensive overview (5-7 paragraphs) with 5-7 key insights.',
    comprehensive: 'Provide an in-depth analysis (10+ paragraphs) with 10+ key insights.',
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a research assistant specializing in technology and education.
        
${depthInstructions[depth]}

Format your response as JSON:
{
  "summary": "Your comprehensive summary...",
  "key_insights": ["Insight 1", "Insight 2"],
  "sources": [
    {
      "title": "Source title",
      "type": "paper|article|book|documentation",
      "description": "Brief description"
    }
  ],
  "recommended_reading": ["Topic 1", "Topic 2"]
}`,
      },
      {
        role: 'user',
        content: `Research the following topic: ${topic}

Include:
- Recent developments and trends
- Key concepts and principles
- Practical applications
- Future directions
- Credible sources for further reading`,
      },
    ],
    temperature: 0.5,
    max_tokens: depth === 'comprehensive' ? 4000 : 2000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No research content generated')
  }

  return JSON.parse(content)
}

// Generate course outline
export async function generateCourseOutline(
  topic: string,
  difficulty: string,
  durationWeeks: number
): Promise<{
  title: string
  description: string
  weeks: Array<{
    week: number
    title: string
    topics: string[]
    objectives: string[]
  }>
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert curriculum designer. Create a comprehensive course outline.

Format your response as JSON:
{
  "title": "Course title",
  "description": "Course description",
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "topics": ["Topic 1", "Topic 2"],
      "objectives": ["Objective 1", "Objective 2"]
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Create a ${durationWeeks}-week course outline for:
        
Topic: ${topic}
Difficulty: ${difficulty}

Ensure:
- Progressive complexity from week to week
- Clear learning objectives for each week
- Practical, hands-on topics
- Balanced workload distribution`,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No course outline generated')
  }

  return JSON.parse(content)
}

// Chat completion for AI tutoring
export async function chatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context?: string
): Promise<string> {
  const systemMessage = context
    ? `You are an expert AI tutor. Context: ${context}`
    : 'You are an expert AI tutor. Provide helpful, educational responses.'

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0]?.message?.content || ''
}

// Streaming completion for real-time responses
export async function* streamCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

// Error handling
export class OpenAIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'OpenAIError'
  }
}

export function handleOpenAIError(error: any): never {
  if (error instanceof OpenAI.APIError) {
    throw new OpenAIError(
      error.message,
      error.code,
      error.status
    )
  }
  
  if (error instanceof OpenAI.RateLimitError) {
    throw new OpenAIError(
      'Rate limit exceeded. Please try again later.',
      'rate_limit_exceeded',
      429
    )
  }
  
  throw new OpenAIError(
    error.message || 'An unexpected AI error occurred'
  )
}
