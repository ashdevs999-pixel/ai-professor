'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Zap, 
  Clock, 
  BookOpen, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Wrench,
  Rocket,
  Lightbulb
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

interface QuickGuide {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration_weeks: number
  image_url?: string
  course_type: string
  is_free: boolean
  lesson_count?: number
}

const CATEGORY_ICONS: Record<string, any> = {
  'Getting Started': Rocket,
  'AI Tools': Sparkles,
  'Development Setup': Wrench,
  'Productivity': Lightbulb,
  'Emerging AI': Zap,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Getting Started': 'from-green-500 to-emerald-600',
  'AI Tools': 'from-purple-500 to-pink-600',
  'Development Setup': 'from-blue-500 to-cyan-600',
  'Productivity': 'from-orange-500 to-yellow-600',
  'Emerging AI': 'from-indigo-500 to-violet-600',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

// Hardcoded quick guides
const QUICK_GUIDES: QuickGuide[] = [
  {
    id: 'guide-openclaw',
    title: 'Installing OpenClaw',
    description: 'Set up your own AI assistant on your computer. Step-by-step guide for beginners.',
    topic: 'Getting Started',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-chatgpt',
    title: 'Using ChatGPT Effectively',
    description: 'Master ChatGPT prompts, tips, and tricks to get the best results for your tasks.',
    topic: 'AI Tools',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-claude',
    title: 'Using Claude AI',
    description: 'Get started with Claude AI assistant. Learn prompting, artifacts, and best practices.',
    topic: 'AI Tools',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-gemini',
    title: 'Google Gemini Essentials',
    description: 'Master Google\'s Gemini AI. multimodal capabilities, integrations, and pro tips.',
    topic: 'AI Tools',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-grok',
    title: 'Using Grok (xAI)',
    description: 'Get started with Elon Musk\'s Grok AI. Real-time info, wit, and unique features.',
    topic: 'Emerging AI',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 3,
  },
  {
    id: 'guide-kimi',
    title: 'Kimi AI - Long Context Master',
    description: 'Master Kimi\'s 200K+ token context window. Perfect for document analysis and research.',
    topic: 'Emerging AI',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 3,
  },
  {
    id: 'guide-perplexity',
    title: 'Perplexity AI Search',
    description: 'Use Perplexity for AI-powered research. Citations, deep searches, and knowledge discovery.',
    topic: 'AI Tools',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-cursor',
    title: 'Cursor AI Code Editor',
    description: 'Supercharge your coding with Cursor. AI-native IDE features, chat, and autocomplete.',
    topic: 'Development Setup',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-vscode',
    title: 'Setting Up VS Code',
    description: 'Install and configure VS Code with essential extensions for coding productivity.',
    topic: 'Development Setup',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 3,
  },
  {
    id: 'guide-github',
    title: 'GitHub Basics',
    description: 'Learn Git and GitHub from scratch. Create repos, commit changes, and collaborate.',
    topic: 'Development Setup',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 4,
  },
  {
    id: 'guide-website',
    title: 'Your First Website (No Code)',
    description: 'Build a beautiful website without writing code using modern no-code tools.',
    topic: 'Getting Started',
    difficulty: 'beginner',
    duration_weeks: 1,
    course_type: 'quick_guide',
    is_free: true,
    lesson_count: 3,
  },
]

export default function QuickGuidesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [guides] = useState<QuickGuide[]>(QUICK_GUIDES)

  const categories = ['all', ...new Set(guides.map(g => g.topic))]

  const filteredGuides = selectedCategory === 'all'
    ? guides
    : guides.filter(g => g.topic === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Quick Guides</h1>
            </div>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Free, hands-on tutorials. No experience needed.
              <br />
              Learn practical skills in under an hour.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>3-5 Lessons Each</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Beginner Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category === 'all' ? BookOpen : CATEGORY_ICONS[category] || BookOpen
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category === 'all' ? 'All Guides' : category}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const Icon = CATEGORY_ICONS[guide.topic] || BookOpen
            const gradient = CATEGORY_COLORS[guide.topic] || 'from-gray-500 to-gray-600'
            
            return (
              <Card key={guide.id} className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      FREE
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {guide.lesson_count || 4} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      ~30 min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge className={DIFFICULTY_COLORS[guide.difficulty] || DIFFICULTY_COLORS.beginner}>
                      {guide.difficulty}
                    </Badge>
                    
                    <Link href={`/guides/${guide.id}`}>
                      <Button 
                        size="sm" 
                        className="group-hover:bg-green-600 transition-colors"
                      >
                        Start Free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-8 border-2 border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to Go Deeper?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Our Quick Guides are perfect for getting started. When you're ready to master a topic 
              and build real projects, check out our full courses.
            </p>
            <Link href="/courses">
              <Button size="lg">
                Browse Full Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
