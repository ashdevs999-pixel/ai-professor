'use client'

import React, { useState } from 'react'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { STRIPE_CONFIG } from '@/lib/stripe-config'

export function PricingSection() {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async (courseId: string) => {
    setLoading(true)
    
    // For demo, redirect to signup if not logged in
    // In production, check auth first
    
    setLoading(false)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            One price. Full access. No subscriptions.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary-500 dark:border-primary-400 shadow-xl">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold">
              Best Value
            </div>

            <div className="p-8">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {STRIPE_CONFIG.priceDisplay}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/course</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  One-time payment, lifetime access
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {[
                  'Full course access',
                  '10+ hours of content',
                  'Downloadable resources',
                  'Certificate of completion',
                  'Lifetime updates',
                  'Community access',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => window.location.href = '/courses'}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Browse Courses'}
              </Button>

              {/* Guarantee */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                30-day money-back guarantee
              </p>
            </div>
          </Card>
        </div>

        {/* Free Alternative */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not ready to commit? Start with our free Quick Guides.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/guides'}>
            <Sparkles className="w-4 h-4 mr-2" />
            View Free Guides
          </Button>
        </div>
      </div>
    </section>
  )
}
