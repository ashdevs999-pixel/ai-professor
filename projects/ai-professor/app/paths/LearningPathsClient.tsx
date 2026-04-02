'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, BookOpen, ArrowRight, GraduationCap } from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'

export default function LearningPathsClient() {
  const { data: pathsData, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: async () => {
      const res = await fetch('/api/paths')
      const data = await res.json()
      return data.data?.paths || []
    },
  })

  const paths = pathsData || []

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'info'
    }
  }

  const getPathImage = (slug: string) => {
    return `/images/programs/${slug}.svg`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Paths</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Structured journeys from beginner to expert. Follow a curated path 
              and master AI step by step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Paths Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paths.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No learning paths available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paths.map((path: any, index: number) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getPathImage(path.slug)}
                        alt={path.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={getDifficultyColor(path.difficulty) as any}>
                          {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {path.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {path.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{path.total_courses || 0} courses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{path.total_weeks || 0} weeks</span>
                        </div>
                      </div>
                      
                      <Link href={`/paths/${path.slug}`}>
                        <Button className="w-full">
                          View Path
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
