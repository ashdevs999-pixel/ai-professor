import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateLessonContent(course: any, lesson: any) {
  const prompt = `You are an expert AI educator. Generate comprehensive lesson content for the following:

Course: ${course.title}
Course Description: ${course.description}
Lesson: ${lesson.title}
Week: ${lesson.week_number}

Generate the following in JSON format:
{
  "content": "Full lesson content in markdown format (500-800 words). Include: introduction, main concepts with explanations, code examples if relevant, key takeaways, and a brief conclusion.",
  "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"],
  "keyTerms": [{"term": "term name", "definition": "brief definition"}],
  "resources": [{"title": "Resource title", "url": "https://...", "type": "article|video|documentation"}]
}

Make the content educational, engaging, and practical. Use real-world examples.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

async function main() {
  console.log('Fetching courses and lessons...')
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('is_published', true)
  
  if (!courses) {
    console.log('No courses found')
    return
  }
  
  let totalGenerated = 0
  
  for (const course of courses) {
    console.log(`\n📚 Processing: ${course.title}`)
    console.log(`   ${course.lessons?.length || 0} lessons`)
    
    for (const lesson of course.lessons || []) {
      console.log(`   ⏳ Generating: ${lesson.title}...`)
      
      try {
        const content = await generateLessonContent(course, lesson)
        
        // Update lesson with generated content
        const { error } = await supabase
          .from('lessons')
          .update({
            content: content.content,
            resources: content.resources || [],
          })
          .eq('id', lesson.id)
        
        if (error) {
          console.log(`   ❌ Error updating: ${error.message}`)
        } else {
          console.log(`   ✅ Generated: ${lesson.title}`)
          totalGenerated++
        }
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000))
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`)
      }
    }
  }
  
  console.log(`\n🎉 Complete! Generated ${totalGenerated} lessons`)
}

main().catch(console.error)
