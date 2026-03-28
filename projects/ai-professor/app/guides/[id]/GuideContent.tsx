'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ChevronRight, Zap } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

// Guide content - comprehensive lessons
const GUIDES_DATA: Record<string, {
  title: string
  description: string
  topic: string
  lessons: { title: string; content: string }[]
}> = {
  'guide-openclaw': {
    title: 'Installing OpenClaw',
    description: 'Set up your own AI assistant. Step-by-step for beginners.',
    topic: 'Getting Started',
    lessons: [
      { title: 'What is OpenClaw?', content: 'Loading...' },
      { title: 'System Requirements', content: 'Loading...' },
      { title: 'Installation Step-by-Step', content: 'Loading...' },
      { title: 'Your First AI Assistant', content: 'Loading...' },
    ]
  },
  'guide-chatgpt': {
    title: 'Using ChatGPT Effectively',
    description: 'Master ChatGPT prompts and get better results.',
    topic: 'AI Tools',
    lessons: [
      { title: 'Introduction to ChatGPT', content: 'Loading...' },
      { title: 'Writing Great Prompts', content: 'Loading...' },
      { title: 'Advanced Techniques', content: 'Loading...' },
      { title: 'Pro Tips & Best Practices', content: 'Loading...' },
    ]
  },
  'guide-claude': {
    title: 'Using Claude AI',
    description: 'Get started with Claude AI assistant.',
    topic: 'AI Tools',
    lessons: [
      { title: 'Introduction to Claude', content: 'Loading...' },
      { title: 'Getting Started', content: 'Loading...' },
      { title: 'Using Artifacts', content: 'Loading...' },
      { title: 'Best Practices', content: 'Loading...' },
    ]
  },
  'guide-gemini': {
    title: 'Google Gemini Essentials',
    description: 'Master Google\'s multimodal AI assistant.',
    topic: 'AI Tools',
    lessons: [
      { title: 'What is Gemini?', content: 'Loading...' },
      { title: 'Getting Started with Gemini', content: 'Loading...' },
      { title: 'Multimodal Capabilities', content: 'Loading...' },
      { title: 'Pro Tips & Integrations', content: 'Loading...' },
    ]
  },
  'guide-grok': {
    title: 'Using Grok (xAI)',
    description: 'Get started with Elon Musk\'s Grok AI.',
    topic: 'Emerging AI',
    lessons: [
      { title: 'What is Grok?', content: 'Loading...' },
      { title: 'Accessing Grok via X', content: 'Loading...' },
      { title: 'Unique Features & Tips', content: 'Loading...' },
    ]
  },
  'guide-kimi': {
    title: 'Kimi AI - Long Context Master',
    description: 'Master Kimi\'s massive context window.',
    topic: 'Emerging AI',
    lessons: [
      { title: 'What is Kimi?', content: 'Loading...' },
      { title: 'Long Context Capabilities', content: 'Loading...' },
      { title: 'Document Analysis Workflows', content: 'Loading...' },
    ]
  },
  'guide-perplexity': {
    title: 'Perplexity AI Search',
    description: 'AI-powered research with citations.',
    topic: 'AI Tools',
    lessons: [
      { title: 'What is Perplexity?', content: 'Loading...' },
      { title: 'Basic Search & Citations', content: 'Loading...' },
      { title: 'Pro Search & Collections', content: 'Loading...' },
      { title: 'Research Workflows', content: 'Loading...' },
    ]
  },
  'guide-cursor': {
    title: 'Cursor AI Code Editor',
    description: 'Supercharge coding with AI.',
    topic: 'Development Setup',
    lessons: [
      { title: 'What is Cursor?', content: 'Loading...' },
      { title: 'Installation & Setup', content: 'Loading...' },
      { title: 'AI Chat & Autocomplete', content: 'Loading...' },
      { title: 'Pro Tips & Workflows', content: 'Loading...' },
    ]
  },
  'guide-github': {
    title: 'GitHub Basics',
    description: 'Learn Git and GitHub from scratch.',
    topic: 'Development Setup',
    lessons: [
      { title: 'What is Git & GitHub?', content: 'Loading...' },
      { title: 'Setting Up GitHub', content: 'Loading...' },
      { title: 'Your First Repository', content: 'Loading...' },
      { title: 'Collaboration Basics', content: 'Loading...' },
    ]
  },
  'guide-vscode': {
    title: 'Setting Up VS Code',
    description: 'Configure VS Code for productivity.',
    topic: 'Development Setup',
    lessons: [
      { title: 'Installing VS Code', content: 'Loading...' },
      { title: 'Essential Extensions', content: 'Loading...' },
      { title: 'Customization', content: 'Loading...' },
    ]
  },
  'guide-website': {
    title: 'Your First Website (No Code)',
    description: 'Build a website without coding.',
    topic: 'Getting Started',
    lessons: [
      { title: 'Choose Your Platform', content: 'Loading...' },
      { title: 'Planning Your Site', content: 'Loading...' },
      { title: 'Building & Publishing', content: 'Loading...' },
    ]
  },
}

const TOPIC_COLORS: Record<string, string> = {
  'Getting Started': 'from-green-500 to-emerald-600',
  'AI Tools': 'from-purple-500 to-pink-600',
  'Development Setup': 'from-blue-500 to-cyan-600',
  'Emerging AI': 'from-indigo-500 to-violet-600',
}

export default function GuideContent({ guideId }: { guideId: string }) {
  const router = useRouter()
  const [currentLesson, setCurrentLesson] = useState(0)
  
  const guide = GUIDES_DATA[guideId]
  
  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guide Not Found</h1>
          <Link href="/guides"><Button>Back to Guides</Button></Link>
        </div>
      </div>
    )
  }

  const lesson = guide.lessons[currentLesson]
  const progress = ((currentLesson + 1) / guide.lessons.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/guides')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Guides
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-gray-600">
              Lesson {currentLesson + 1} of {guide.lessons.length}
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {guide.lessons.map((l, i) => (
              <button
                key={i}
                onClick={() => setCurrentLesson(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  i === currentLesson
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {i + 1}. {l.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {lesson.content}
            </p>
          </div>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
            disabled={currentLesson === 0}
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Previous
          </Button>
          
          {currentLesson < guide.lessons.length - 1 ? (
            <Button onClick={() => setCurrentLesson(currentLesson + 1)}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Guide Complete!</span>
              </div>
              <Link href="/guides">
                <Button>Browse More Guides</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
