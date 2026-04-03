import { Metadata } from 'next'
import CourseDetailClient from './CourseDetailClient'

export const metadata: Metadata = {
  title: 'Course - CXO Academy',
  description: 'Learn AI with expert-led courses',
}

export const dynamic = 'force-dynamic'

export default async function CoursePage({ params }: { params: { id: string } }) {
  // Just pass the ID — client fetches everything via API
  return <CourseDetailClient courseId={params.id} />
}
