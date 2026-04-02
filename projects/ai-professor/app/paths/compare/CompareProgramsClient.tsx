'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, BookOpen, Clock, GraduationCap } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'

const programInfo: Record<string, { focus: string; audience: string }> = {
  'cybersecurity': { focus: 'Cybersecurity & Risk', audience: 'Security professionals and IT leaders seeking comprehensive cyber risk management skills' },
  'chief-technology-officer': { focus: 'Technology Leadership', audience: 'Senior engineers transitioning to CTO or VP of Engineering roles' },
  'chief-data-ai-officer': { focus: 'Data & AI Leadership', audience: 'Data scientists and analytics leaders moving into executive positions' },
  'digital-transformation': { focus: 'Digital Transformation', audience: 'Business leaders driving technology adoption across organizations' },
  'ai-strategy': { focus: 'AI Strategy & Governance', audience: 'Executives and strategists building AI-powered business initiatives' },
  'leading-through-change': { focus: 'Change Leadership', audience: 'Managers and leaders navigating organizational transformation' },
  'risk-mastery': { focus: 'Enterprise Risk Management', audience: 'Risk officers and compliance professionals mastering modern risk frameworks' },
}

export default function CompareProgramsClient() {
  const { data: pathsData, isLoading } = useQuery({
    queryKey: ['learning-paths-compare'],
    queryFn: async () => {
      const res = await fetch('/api/paths')
      const data = await res.json()
      return data.data?.paths || []
    },
  })

  const paths = pathsData || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/paths" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Programs
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GraduationCap className="w-12 h-12 mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare Programs</h1>
            <p className="text-xl text-white/80 max-w-2xl">Find the program that fits your goals and career stage.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paths.map((path: any, index: number) => {
              const info = programInfo[path.slug] || { focus: path.title, audience: 'Professionals seeking to advance their skills' }
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{path.title}</h3>
                    <Badge variant="info" className="mb-3 self-start">{info.focus}</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{info.audience}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <BookOpen className="w-4 h-4 text-primary-500" />
                        <span>{path.total_courses || 0} modules</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{path.total_weeks || 0} weeks</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-3">$49.99</div>

                    <Link href={`/paths/${path.slug}`}>
                      <Button className="w-full" variant="outline">View Details</Button>
                    </Link>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Comparison table */}
          {paths.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Side-by-Side Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Program</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Focus Area</th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Modules</th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Duration</th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paths.map((path: any, i: number) => {
                      const info = programInfo[path.slug] || { focus: path.title }
                      return (
                        <tr key={path.id} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'}>
                          <td className="p-4">
                            <Link href={`/paths/${path.slug}`} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                              {path.title}
                            </Link>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{info.focus}</td>
                          <td className="p-4 text-center text-gray-900 dark:text-white">{path.total_courses || 0}</td>
                          <td className="p-4 text-center text-gray-900 dark:text-white">{path.total_weeks || 0} weeks</td>
                          <td className="p-4 text-center font-semibold text-gray-900 dark:text-white">$49.99</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
