'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';
import { NewsFeed } from '@/components/news';
import { Button } from '@/components/ui';

export default function NewsClient() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              CXO News
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              The pulse of AI innovation. Your one-stop destination for the latest AI developments,
              research breakthroughs, product launches, and industry news from 19 trusted sources.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/api/news/rss" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" leftIcon={<Rss className="w-4 h-4" />}>
                  Subscribe to RSS
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Feed */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsFeed
            showFilters={true}
            showSearch={true}
            infiniteScroll={true}
            itemsPerPage={20}
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                19 Trusted Sources
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aggregated from leading AI companies, research institutions, and tech publications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Summaries
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get concise, AI-generated summaries of complex AI developments in seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Updated Every 6 Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fresh content delivered automatically, keeping you ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
