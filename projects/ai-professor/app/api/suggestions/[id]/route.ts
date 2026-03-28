// Course Suggestion Actions - Approve/Reject/Generate

import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse, requireAuth } from '@/lib/auth'
import OpenAI from 'openai'

let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

// POST /api/suggestions/[id]/approve - Approve a suggestion
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const suggestionId = params.id
    const body = await request.json().catch(() => ({}))
    const { action } = body // 'approve', 'reject', or 'generate'
    
    // Get the suggestion
    const { data: suggestion, error: fetchError } = await supabaseAdmin
      .from('course_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single()
    
    if (fetchError || !suggestion) {
      return createErrorResponse(new Error('Suggestion not found'), 'Not found', 404)
    }
    
    if (action === 'reject') {
      // Mark as rejected
      const { error } = await supabaseAdmin
        .from('course_suggestions')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', suggestionId)
      
      if (error) throw error
      
      return createSuccessResponse({ message: 'Suggestion rejected' })
    }
    
    if (action === 'approve' || action === 'generate') {
      // Generate the course content
      const openai = getOpenAI()
      
      // Generate course outline
      const outlinePrompt = `Create a detailed course outline for: "${suggestion.title}"

Description: ${suggestion.description}
Topic: ${suggestion.topic}
Difficulty: ${suggestion.difficulty}
Duration: ${suggestion.duration_weeks} weeks

Return JSON with:
{
  "title": "Course Title",
  "description": "Full course description",
  "learningOutcomes": ["Outcome 1", "Outcome 2", ...],
  "prerequisites": ["Prereq 1", "Prereq 2", ...],
  "weeks": [
    {
      "week": 1,
      "title": "Week Title",
      "description": "Week description",
      "lessons": [
        {"title": "Lesson Title", "description": "Brief description"}
      ]
    }
  ]
}`

      const outlineResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: outlinePrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })
      
      const courseData = JSON.parse(outlineResponse.choices[0].message.content || '{}')
      
      // Create the course
      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .insert({
          title: courseData.title || suggestion.title,
          description: courseData.description || suggestion.description,
          topic: suggestion.topic,
          difficulty: suggestion.difficulty,
          duration_weeks: suggestion.duration_weeks,
          is_published: action === 'generate', // Auto-publish if generate action
        })
        .select()
        .single()
      
      if (courseError) throw courseError
      
      // Create lessons for each week
      const lessons = []
      for (const week of courseData.weeks || []) {
        for (const lesson of week.lessons || []) {
          lessons.push({
            course_id: course.id,
            week_number: week.week,
            title: lesson.title,
            content: lesson.description,
            estimated_minutes: 60,
            order_index: 1,
          })
        }
      }
      
      if (lessons.length > 0) {
        const { error: lessonsError } = await supabaseAdmin
          .from('lessons')
          .insert(lessons)
        
        if (lessonsError) console.error('Error creating lessons:', lessonsError)
      }
      
      // Update suggestion
      await supabaseAdmin
        .from('course_suggestions')
        .update({
          status: 'generated',
          reviewed_at: new Date().toISOString(),
          created_course_id: course.id,
        })
        .eq('id', suggestionId)
      
      return createSuccessResponse({
        message: 'Course created and published!',
        course,
        lessonsCreated: lessons.length,
      })
    }
    
    return createErrorResponse(new Error('Invalid action'), 'Bad request', 400)
  } catch (error: any) {
    console.error('Error processing suggestion:', error)
    return createErrorResponse(error, 'Failed to process suggestion')
  }
}
