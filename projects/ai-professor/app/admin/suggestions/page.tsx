'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Check, X, Sparkles, Clock, BookOpen } from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function SuggestionsAdminPage() {
  const queryClient = useQueryClient()
  const [generating, setGenerating] = useState<string | null>(null)

  // Fetch suggestions
  const { data: suggestionsData, isLoading, refetch } = useQuery({
    queryKey: ['course-suggestions'],
    queryFn: async () => {
      const res = await fetch('/api/suggestions?status=pending')
      const data = await res.json()
      return data.data?.suggestions || []
    },
  })

  // Generate new suggestions
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/suggestions', { method: 'POST' })
      return res.json()
    },
    onSuccess: () => {
      refetch()
    },
  })

  // Process suggestion (approve/reject)
  const processMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      setGenerating(id)
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      return res.json()
    },
    onSuccess: () => {
      refetch()
      setGenerating(null)
    },
    onError: () => {
      setGenerating(null)
    },
  })

  const suggestions = suggestionsData || []

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'info'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Course Suggestions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                AI-generated course ideas based on trending AI news
              </p>
            </div>
            
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2"
            >
              {generateMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate New Ideas
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">{suggestions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
          </Card>
        </div>

        {/* Suggestions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading suggestions...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No suggestions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click "Generate New Ideas" to analyze trending AI news and suggest courses
            </p>
            <Button onClick={() => generateMutation.mutate()}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Suggestions
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion: any, index: number) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {suggestion.title}
                        </h3>
                        <Badge variant={getDifficultyColor(suggestion.difficulty) as any}>
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{suggestion.topic}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{suggestion.duration_weeks} weeks</span>
                        </div>
                      </div>
                      
                      {suggestion.reason && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Why this course:</strong> {suggestion.reason}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => processMutation.mutate({ id: suggestion.id, action: 'generate' })}
                        disabled={generating === suggestion.id}
                        className="flex items-center gap-1"
                      >
                        {generating === suggestion.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Generate Course
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => processMutation.mutate({ id: suggestion.id, action: 'reject' })}
                        disabled={generating === suggestion.id}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Generation Result */}
        {generateMutation.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <p className="text-green-700 dark:text-green-300">
              ✅ {generateMutation.data.data?.message || 'Suggestions generated!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
