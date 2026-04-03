import { Metadata } from 'next'
import LessonClient from './LessonClient'
import { db } from '@/lib/supabase'
import { getCurrentSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Lesson - CXO Academy',
  description: 'Learn with CXO Academy',
}

// Admin emails that bypass all checks
const ADMIN_EMAILS = ['bryanbleong@gmail.com']

async function getLesson(lessonId: string) {
  try {
    const lesson = await db.lessons.getById(lessonId)
    return lesson
  } catch (error) {
    console.error('Failed to fetch lesson:', error)
    return null
  }
}

async function getCourse(courseId: string) {
  try {
    const course = await db.courses.getById(courseId)
    return course
  } catch (error) {
    return null
  }
}

export default async function LessonPage({ 
  params 
}: { 
  params: { id: string; lessonId: string } 
}) {
  const [lesson, course, session] = await Promise.all([
    getLesson(params.lessonId),
    getCourse(params.id),
    getCurrentSession()
  ])
  
  // Check if user is admin
  const isAdmin = !!(session?.user?.email && ADMIN_EMAILS.includes(session.user.email))
  
  // Check enrollment status
  let isEnrolled = false
  if (session?.user?.id && !isAdmin) {
    try {
      isEnrolled = await db.enrollments.checkEnrollment(session.user.id, params.id)
    } catch (error) {
      console.error('Failed to check enrollment:', error)
    }
  }
  
  // Admin bypasses enrollment check
  const canAccess = isAdmin || isEnrolled
  
  return <LessonClient 
    lesson={lesson as any} 
    course={course as any}
    courseId={params.id}
    isEnrolled={isEnrolled}
    isAdmin={isAdmin}
    canAccess={canAccess}
    userEmail={session?.user?.email || null}
  />
}
