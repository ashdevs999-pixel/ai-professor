'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Newspaper, 
  Zap,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui'

interface Stats {
  articles: number
  guides: number
  courses: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    articles: 100,  // Fallback values
    guides: 24,
    courses: 28,
  })

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section - More Dynamic */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">The Future of AI Learning</span>
            </motion.div>
            
            {/* Main Headline - Bolder */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
              <span className="text-white">CXO Academy</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Stay ahead of the AI revolution with real-time news from 19 sources 
              and expert courses designed for the modern learner.
            </p>
            
            {/* CTA Buttons - More Prominent */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/news">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-700 hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-2xl"
                  >
                    <Newspaper className="w-5 h-5 mr-2" />
                    Explore News
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/guides">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Free Guides
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: '7', label: 'Programs' },
                { value: `${stats.courses}`, label: 'Courses' },
                { value: '226+', label: 'Lessons' },
                { value: '24/7', label: 'Updates' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              One platform. All the AI knowledge you need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                icon: Newspaper,
                title: 'Breaking Tech News',
                description: 'Real-time updates from 8 top tech sources. Know what matters, as it happens.',
                link: '/breaking',
                color: 'from-orange-500 to-red-500',
                cta: 'Read Breaking News'
              },
              {
                icon: Sparkles,
                title: 'AI-Focused Articles',
                description: 'Curated AI news from OpenAI, Anthropic, TechCrunch, and more. Stay current.',
                link: '/news',
                color: 'from-primary-500 to-teal-500',
                cta: 'Explore AI News'
              },
              {
                icon: BookOpen,
                title: 'Learn by Doing',
                description: 'Free quick guides for beginners. Premium courses for serious learners.',
                link: '/guides',
                color: 'from-purple-500 to-pink-500',
                cta: 'Start Learning Free'
              },
              {
                icon: GraduationCap,
                title: 'Learning Programs',
                description: '7 structured programs from cybersecurity to AI strategy. Master a domain end-to-end.',
                link: '/paths',
                color: 'from-blue-500 to-indigo-500',
                cta: 'Browse Programs'
              },
              {
                icon: BookOpen,
                title: 'Full Courses',
                description: '28 individual courses across all levels. Pick what you need, learn at your pace.',
                link: '/courses',
                color: 'from-teal-500 to-cyan-500',
                cta: 'Browse Courses'
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.link}>
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-transparent">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* CTA */}
                    <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
                      {item.cta}
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guides Highlight */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold mb-4">
                <Zap className="w-5 h-5" />
                FREE TO START
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Guides for Everyone
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Hands-on tutorials that get you results in 30 minutes. 
                No experience needed. No credit card required.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Installing OpenClaw - Your own AI assistant',
                  'Using ChatGPT Effectively - Prompt mastery',
                  'GitHub Basics - Version control made simple',
                  'VS Code Setup - Your coding environment',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/guides">
                <Button size="lg" className="px-8">
                  Browse Free Guides
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-teal-400 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {[
                    { title: 'Installing OpenClaw', category: 'Getting Started', time: '30 min' },
                    { title: 'Using ChatGPT Effectively', category: 'AI Tools', time: '25 min' },
                    { title: 'GitHub Basics', category: 'Development', time: '35 min' },
                  ].map((guide, i) => (
                    <div key={guide.title} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{guide.title}</div>
                        <div className="text-sm text-gray-500">{guide.category}</div>
                      </div>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {guide.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands learning AI the right way. Start free, upgrade when ready.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 px-10 py-5 text-lg">
                  Create Free Account
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 px-10 py-5 text-lg">
                  View Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">
              CXO Academy
            </div>
            <div className="flex gap-6 text-gray-400">
              <Link href="/breaking" className="hover:text-white transition-colors">Breaking</Link>
              <Link href="/news" className="hover:text-white transition-colors">AI News</Link>
              <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2026 CXO Academy. Stay current. Get smarter.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
