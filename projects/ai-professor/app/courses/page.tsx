import { Metadata } from 'next'
import CourseListClient from './CourseListClient'

// Force dynamic rendering to ensure client-side fetch works properly
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Courses - AI Professor',
  description: 'Master AI with expert-led courses. From fundamentals to advanced topics.',
}

export default function CoursesPage() {
  return <CourseListClient />
}
