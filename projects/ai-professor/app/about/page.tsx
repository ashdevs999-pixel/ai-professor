import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About - CXO Academy',
  description: 'Learn about CXO Academy, our mission, and the team behind the platform.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About CXO Academy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            <strong>CXO Academy</strong> is an educational platform built for professionals who want to master AI, cybersecurity, data strategy, and digital leadership — without the fluff.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We believe the gap between AI hype and real-world competence is massive. Most professionals don&apos;t need another buzzword blog — they need structured, actionable learning that they can apply on Monday morning.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            CXO Academy delivers expert-designed programs that combine academic rigor with practical application. Every lesson is built around real frameworks, real tools, and real decisions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">What Makes Us Different</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li><strong>Structured programs</strong> — not random articles, but complete learning paths designed to build skills progressively</li>
            <li><strong>Expert-level content</strong> — written by practitioners with real-world experience in AI, cybersecurity, and digital transformation</li>
            <li><strong>Practical exercises</strong> — every lesson includes hands-on activities you can apply immediately</li>
            <li><strong>Self-paced</strong> — learn on your schedule, at your speed, with lifetime access</li>
            <li><strong>Affordable</strong> — enterprise-quality education without the enterprise price tag</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">Our Programs</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We offer 7 comprehensive programs covering the most in-demand skills for modern leaders:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Digital Transformation</li>
            <li>AI Strategy</li>
            <li>Leading Through Change</li>
            <li>Risk Mastery</li>
            <li>Cybersecurity</li>
            <li>Chief Technology Officer (CTO)</li>
            <li>Chief Data &amp; AI Officer (CDAIO)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">Built by Professionals, for Professionals</h2>
          <p className="text-gray-600 dark:text-gray-300">
            CXO Academy is developed by a team with deep experience in AI engineering, cybersecurity consulting, and executive education. We understand what leaders need because we&apos;ve been in those roles ourselves.
          </p>
          
          <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <p className="text-primary-700 dark:text-primary-300 font-medium text-center">
              Have questions? We&apos;d love to hear from you.{' '}
              <a href="/contact" className="underline">Get in touch →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
