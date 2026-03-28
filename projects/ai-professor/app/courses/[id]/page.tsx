import { Metadata } from 'next'
import CourseDetailClient from './CourseDetailClient'
import { db } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Course - AI Professor',
  description: 'Learn AI with expert-led courses',
}

async function getCourse(id: string) {
  try {
    const course = await db.courses.getById(id)
    return course
  } catch (error) {
    console.error('Failed to fetch course:', error)
    return null
  }
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)
  return <CourseDetailClient courseId={params.id} initialCourse={course} />
}
