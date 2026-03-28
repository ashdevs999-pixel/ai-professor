// AI Content Generation Logic

import { 
  generateContent, 
  generateResearch, 
  generateCourseOutline,
  checkRateLimit,
  OpenAIError 
} from './openai'
import { getSupabaseAdmin } from './supabase'
import { 
  ContentType, 
  ContentGenerationRequest, 
  GeneratedContent,
  ResearchRequest,
  ResearchUpdate,
  LessonOutline,
  Quiz,
  Exercise,
} from '../types/course'
import { createHash } from 'crypto'

// Cache duration in seconds
const CACHE_DURATION = {
  lesson_outline: 7 * 24 * 60 * 60, // 7 days
  lesson_content: 7 * 24 * 60 * 60, // 7 days
  quiz: 30 * 24 * 60 * 60, // 30 days
  summary: 24 * 60 * 60, // 1 day
  exercises: 30 * 24 * 60 * 60, // 30 days
  resources: 7 * 24 * 60 * 60, // 7 days
}

// Generate cache key
function generateCacheKey(
  courseId: string,
  contentType: ContentType,
  context?: string
): string {
  const content = `${courseId}:${contentType}:${context || ''}`
  return createHash('sha256').update(content).digest('hex')
}

// Get cached content
async function getCachedContent(
  courseId: string,
  contentType: ContentType,
  promptHash: string
): Promise<any | null> {
  const { data } = await getSupabaseAdmin()
    .from('ai_content_cache')
    .select('content')
    .eq('course_id', courseId)
    .eq('content_type', contentType)
    .eq('prompt_hash', promptHash)
    .gt('expires_at', new Date().toISOString())
    .single()

  return data?.content || null
}

// Cache content
async function cacheContent(
  courseId: string,
  contentType: ContentType,
  promptHash: string,
  content: any
): Promise<void> {
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + CACHE_DURATION[contentType])

  await getSupabaseAdmin()
    .from('ai_content_cache')
    .upsert({
      course_id: courseId,
      content_type: contentType,
      prompt_hash: promptHash,
      content,
      expires_at: expiresAt.toISOString(),
    }, {
      onConflict: 'prompt_hash,content_type',
    })
}

// Generate content with caching
export async function generateCachedContent(
  request: ContentGenerationRequest,
  userId: string
): Promise<GeneratedContent> {
  // Check rate limit
  const rateLimit = checkRateLimit(`ai:${userId}`)
  if (!rateLimit.allowed) {
    throw new Error('AI generation rate limit exceeded. Please try again later.')
  }

  const { course_id, content_type, context, parameters } = request

  // Generate cache key
  const cacheKey = generateCacheKey(course_id, content_type, context)

  // Try to get from cache
  const cachedContent = await getCachedContent(course_id, content_type, cacheKey)
  if (cachedContent) {
    return {
      content_type,
      content: cachedContent,
      metadata: {
        model: 'cached',
        tokens_used: 0,
        generation_time_ms: 0,
      },
    }
  }

  // Generate new content
  const prompt = buildPrompt(content_type, parameters)
  const result = await generateContent(content_type, prompt, context, {
    temperature: parameters?.temperature,
    maxTokens: parameters?.maxTokens,
  })

  // Cache the result
  await cacheContent(course_id, content_type, cacheKey, result.content)

  return {
    content_type,
    content: result.content,
    metadata: {
      model: 'gpt-4o',
      tokens_used: result.tokensUsed,
      generation_time_ms: result.generationTimeMs,
    },
  }
}

// Build prompt based on content type
function buildPrompt(
  contentType: ContentType,
  parameters?: Record<string, any>
): string {
  const prompts: Record<ContentType, string> = {
    lesson_outline: `Create a lesson outline for the following topic:
${parameters?.topic || 'General topic'}
${parameters?.objectives ? `\nLearning objectives:\n${parameters.objectives.join('\n')}` : ''}`,

    lesson_content: `Create comprehensive lesson content:
${parameters?.outline ? `\nBased on this outline:\n${JSON.stringify(parameters.outline, null, 2)}` : ''}`,

    quiz: `Create a quiz to test understanding of:
${parameters?.topic || 'the lesson content'}
${parameters?.difficulty ? `\nDifficulty: ${parameters.difficulty}` : ''}
${parameters?.questionCount ? `\nNumber of questions: ${parameters.questionCount}` : ''}`,

    summary: `Summarize the following content:
${parameters?.content || 'No content provided'}`,

    exercises: `Create practical exercises for:
${parameters?.topic || 'the lesson content'}
${parameters?.difficulty ? `\nDifficulty: ${parameters.difficulty}` : ''}
${parameters?.count ? `\nNumber of exercises: ${parameters.count}` : ''}`,

    resources: `Recommend learning resources for:
${parameters?.topic || 'the subject'}
${parameters?.types ? `\nResource types: ${parameters.types.join(', ')}` : ''}`,
  }

  return prompts[contentType]
}

// Generate lesson outline
export async function generateLessonOutline(
  courseId: string,
  topic: string,
  objectives?: string[],
  userId?: string
): Promise<LessonOutline> {
  if (userId) {
    const rateLimit = checkRateLimit(`ai:${userId}`)
    if (!rateLimit.allowed) {
      throw new Error('AI generation rate limit exceeded')
    }
  }

  const result = await generateContent(
    'lesson_outline',
    `Create a detailed lesson outline for: ${topic}`,
    objectives ? `Learning objectives: ${objectives.join(', ')}` : undefined
  )

  return result.content
}

// Generate quiz
export async function generateQuiz(
  courseId: string,
  lessonId: string,
  topic: string,
  questionCount: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<Quiz> {
  const result = await generateContent(
    'quiz',
    `Create a ${difficulty} quiz with ${questionCount} questions about: ${topic}`
  )

  return result.content
}

// Generate exercises
export async function generateExercises(
  courseId: string,
  topic: string,
  count: number = 3,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{ exercises: Exercise[] }> {
  const result = await generateContent(
    'exercises',
    `Create ${count} ${difficulty} exercises for: ${topic}`
  )

  return result.content
}

// Generate research update
export async function generateResearchUpdate(
  request: ResearchRequest
): Promise<ResearchUpdate> {
  const { course_id, week_number, topic, depth = 'detailed' } = request

  // Check cache
  const { data: existing } = await getSupabaseAdmin()
    .from('weekly_research')
    .select('*')
    .eq('course_id', course_id)
    .eq('week_number', week_number)
    .single()

  if (existing) {
    return {
      course_id: existing.course_id,
      week_number: existing.week_number,
      topic: existing.topic,
      summary: existing.summary,
      key_insights: existing.sources.key_insights || [],
      sources: existing.sources.sources || [],
      recommended_reading: existing.sources.recommended_reading || [],
    }
  }

  // Generate new research
  const research = await generateResearch(topic, depth)

  const update: ResearchUpdate = {
    course_id,
    week_number,
    topic,
    summary: research.summary,
    key_insights: research.keyInsights,
    sources: research.sources,
    recommended_reading: research.recommendedReading,
  }

  // Save to database
  await getSupabaseAdmin().from('weekly_research').insert({
    course_id,
    week_number,
    topic,
    summary: update.summary,
    sources: {
      key_insights: update.key_insights,
      sources: update.sources,
      recommended_reading: update.recommended_reading,
    },
  })

  return update
}

// Generate full course outline
export async function generateFullCourseOutline(
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
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
  return await generateCourseOutline(topic, difficulty, durationWeeks)
}

// Generate lesson content
export async function generateLessonContent(
  courseId: string,
  lessonId: string,
  outline: LessonOutline,
  previousLessons?: string[]
): Promise<{
  sections: Array<{
    title: string
    content: string
    examples?: string[]
  }>
}> {
  const context = previousLessons
    ? `Previous lessons covered: ${previousLessons.join(', ')}`
    : undefined

  const result = await generateContent(
    'lesson_content',
    `Create detailed content for lesson: ${outline.title}`,
    context
  )

  return result.content
}

// Generate summary
export async function generateSummary(
  courseId: string,
  content: string
): Promise<{
  summary: string
  key_points: string[]
  takeaways: string[]
}> {
  const result = await generateContent('summary', content)
  return result.content
}

// AI tutoring chat
export async function aiTutorChat(
  userId: string,
  message: string,
  context?: {
    courseId?: string
    lessonId?: string
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
  }
): Promise<string> {
  // Check rate limit
  const rateLimit = checkRateLimit(`chat:${userId}`, 50) // 50 messages per minute
  if (!rateLimit.allowed) {
    throw new Error('Chat rate limit exceeded. Please wait before sending another message.')
  }

  // Build context
  let contextString = ''
  
  if (context?.courseId) {
    const { data: course } = await getSupabaseAdmin()
      .from('courses')
      .select('title, topic')
      .eq('id', context.courseId)
      .single()
    
    if (course) {
      contextString += `Course: ${course.title} (${course.topic})\n`
    }
  }

  if (context?.lessonId) {
    const { data: lesson } = await getSupabaseAdmin()
      .from('lessons')
      .select('title, content')
      .eq('id', context.lessonId)
      .single()
    
    if (lesson) {
      contextString += `Current lesson: ${lesson.title}\n`
    }
  }

  // Use chat completion from openai.ts
  const { chatCompletion } = await import('./openai')
  const messages = context?.previousMessages || []
  
  return await chatCompletion(
    [
      ...messages,
      { role: 'user', content: message },
    ],
    contextString
  )
}

// Batch content generation
export async function batchGenerateContent(
  courseId: string,
  lessons: Array<{ id: string; topic: string }>,
  userId: string
): Promise<Map<string, any>> {
  const results = new Map<string, any>()

  for (const lesson of lessons) {
    try {
      // Check rate limit for each request
      const rateLimit = checkRateLimit(`ai:${userId}`, 30) // 30 per minute for batch
      if (!rateLimit.allowed) {
        // Wait for rate limit to reset
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      const outline = await generateLessonOutline(courseId, lesson.topic)
      const content = await generateLessonContent(courseId, lesson.id, outline)

      results.set(lesson.id, {
        outline,
        content,
      })
    } catch (error) {
      console.error(`Failed to generate content for lesson ${lesson.id}:`, error)
      results.set(lesson.id, { error: 'Failed to generate content' })
    }
  }

  return results
}

// Cleanup expired cache (can be called by cron job)
export async function cleanupExpiredCache(): Promise<number> {
  const { data, error } = await getSupabaseAdmin()
    .rpc('cleanup_expired_cache')

  if (error) {
    console.error('Failed to cleanup cache:', error)
    return 0
  }

  return data || 0
}
