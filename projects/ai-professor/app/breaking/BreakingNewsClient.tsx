'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ExternalLink, Clock, TrendingUp, RefreshCw, Zap } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

interface BreakingArticle {
  id: string
  title: string
  summary: string
  source_url: string
  source_name: string
  category: string
  published_at: string
  created_at: string
}

const SOURCE_COLORS: Record<string, string> = {
  'TechCrunch': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'The Verge': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Ars Technica': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Wired': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Engadget': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'MIT Tech Review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Recode': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'OpenAI': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Anthropic': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
}

export default function BreakingNewsClient() {
  const [articles, setArticles] = useState<BreakingArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const fetchBreakingNews = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    
    try {
      // Try breaking category first, fall back to all news
      let response = await fetch('/api/news?category=breaking&limit=50')
      let data = await response.json()
      
      let items = data.data || data
      
      // If no breaking news, fetch all news
      if (!items || items.length === 0) {
        response = await fetch('/api/news?limit=50')
        data = await response.json()
        items = data.data || data
      }
      
      setArticles(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Error fetching breaking news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchBreakingNews()
  }, [fetchBreakingNews])

  const handleRefresh = async () => {
    setRefreshing(true)
    
    try {
      // Trigger scrape
      await fetch('/api/news/scrape', { method: 'POST' })
      
      // Wait then fetch
      await new Promise(resolve => setTimeout(resolve, 3000))
      await fetchBreakingNews()
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.source_name === filter)

  const sources = ['all', ...new Set(articles.map(a => a.source_name))]

  // Pull-to-refresh handler
  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY
    let currentY = startY
    
    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY
    }
    
    const handleTouchEnd = () => {
      if (currentY - startY > 100 && window.scrollY === 0) {
        handleRefresh()
      }
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" onTouchStart={handleTouchStart}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Breaking Tech News</h1>
          </div>
          <p className="text-orange-100 text-lg max-w-2xl">
            Latest tech news from top sources. Updated throughout the day.
          </p>
          
          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Badge className="bg-white/20 text-white">
              {articles.length} articles
            </Badge>
          </div>
          
          {/* Pull to refresh indicator */}
          {refreshing && (
            <div className="text-center mt-4 text-orange-100 text-sm">
              <RefreshCw className="w-4 h-4 inline animate-spin mr-2" />
              Pulling latest news...
            </div>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {sources.slice(0, 8).map((source) => (
              <button
                key={source}
                onClick={() => setFilter(source)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === source
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {source === 'all' ? 'All Sources' : source}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {refreshing ? 'Fetching Latest News...' : 'No Breaking News Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {refreshing 
                ? 'Please wait while we fetch the latest articles.'
                : 'Click refresh to fetch the latest tech news from top sources.'
              }
            </p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Fetching...' : 'Fetch News Now'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-all duration-200 group">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Source & Time */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          SOURCE_COLORS[article.source_name] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {article.source_name}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(article.published_at || article.created_at)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      {article.summary && article.summary.length > 0 ? (
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                          Click to read the full article...
                        </p>
                      )}
                    </div>

                    {/* External Link Icon */}
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>News aggregated from TechCrunch, The Verge, Ars Technica, Wired, Engadget, MIT Tech Review</p>
          <p className="mt-2">Auto-updated daily • <Link href="/news" className="text-primary-600 hover:underline">View AI News</Link></p>
        </div>
      </div>
    </div>
  )
}
