import { Metadata } from 'next'
import CoursesClient from './CoursesClient'
import { db } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Courses - CXO Academy',
  description: 'Master AI with expert-led courses. From fundamentals to advanced topics.',
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'

async function getCourses() {
  try {
    const courses = await db.courses.getAll({ is_published: true })
    // Transform to include lesson_count
    return courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description || '',
      topic: c.topic,
      difficulty: c.difficulty,
      duration_weeks: c.duration_weeks,
      lesson_count: (c.lessons as any)?.[0]?.count || 0,
      image_url: c.image_url ?? undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()
  return <CoursesClient initialCourses={courses} />
}
