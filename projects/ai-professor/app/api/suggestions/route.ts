// Course Suggestion API - Track A: AI Course Suggester

import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'
import OpenAI from 'openai'

// Lazy OpenAI initialization
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

// GET /api/suggestions - Get all course suggestions
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    
    const { data, error } = await supabaseAdmin
      .from('course_suggestions')
      .select('*')
      .eq('status', status)
      .order('suggested_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    
    return createSuccessResponse({ suggestions: data })
  } catch (error: any) {
    return createErrorResponse(error, 'Failed to fetch suggestions')
  }
}

// POST /api/suggestions - Generate new course suggestions from trending news
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const openai = getOpenAI()
    
    // Get recent news articles
    const { data: news } = await supabaseAdmin
      .from('news_items')
      .select('id, title, summary, category, source_name')
      .order('published_at', { ascending: false })
      .limit(50)
    
    if (!news || news.length === 0) {
      return createSuccessResponse({ 
        message: 'No news articles to analyze',
        suggestions: [] 
      })
    }
    
    // Get existing suggestions to avoid duplicates
    const { data: existing } = await supabaseAdmin
      .from('course_suggestions')
      .select('title')
    
    const existingTitles = new Set(existing?.map(s => s.title.toLowerCase()) || [])
    
    // Analyze news with AI to suggest courses
    const prompt = `Analyze these recent AI news headlines and suggest 3-5 course topics that would be valuable to create.

News headlines:
${news.map(n => `- ${n.title} (${n.source_name})`).join('\n')}

For each course suggestion, provide:
1. A clear, specific title
2. A brief description (2-3 sentences)
3. The main topic area
4. Difficulty level (beginner/intermediate/advanced)
5. Recommended duration in weeks
6. Why this course is relevant now (based on the news)

Return as JSON array:
{
  "suggestions": [
    {
      "title": "Course Title",
      "description": "Course description",
      "topic": "Topic Area",
      "difficulty": "beginner|intermediate|advanced",
      "duration_weeks": 8,
      "reason": "Why this course is relevant"
    }
  ]
}

Focus on practical, in-demand topics. Avoid generic courses like "Introduction to AI" - be specific.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })
    
    const result = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}')
    const suggestions = result.suggestions || []
    
    // Filter out duplicates and save to database
    const newSuggestions = []
    for (const suggestion of suggestions) {
      if (existingTitles.has(suggestion.title.toLowerCase())) continue
      
      const { data, error } = await supabaseAdmin
        .from('course_suggestions')
        .insert({
          title: suggestion.title,
          description: suggestion.description,
          topic: suggestion.topic,
          difficulty: suggestion.difficulty,
          duration_weeks: suggestion.duration_weeks,
          reason: suggestion.reason,
          status: 'pending',
        })
        .select()
        .single()
      
      if (!error && data) {
        newSuggestions.push(data)
      }
    }
    
    return createSuccessResponse({
      message: `Generated ${newSuggestions.length} new course suggestions`,
      suggestions: newSuggestions,
    })
  } catch (error: any) {
    console.error('Error generating suggestions:', error)
    return createErrorResponse(error, 'Failed to generate suggestions')
  }
}
