'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ChevronDown, Sparkles, Zap, Crown, BookOpen, Code } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Get started with quick guides and sample content',
    features: [
      '11 Quick Guides (detailed tutorials)',
      'CXO News access',
      '1 sample course lesson',
      'Community access',
    ],
    cta: 'Get Started Free',
    ctaLink: '/guides',
  },
  {
    id: 'single-course',
    name: 'Single Course',
    price: 14.99,
    interval: 'one-time',
    description: 'Buy individual courses, Keep forever',
    features: [
      'Full course access',
      'Hands-on projects',
      'Pass/fail assessment',
      'Certificate of completion',
      'Community challenges',
      'Priority support',
    ],
    recommended: true,
    cta: 'Buy Now',
    ctaLink: '/courses',
  },
  {
    id: 'bundle',
    name: 'All Courses Bundle',
    price: 29.99,
    interval: 'one-time',
    description: 'Get all 3 courses at Save $15',
    features: [
      'Everything in Single Course',
      '3 full courses included',
      'Save $15 vs buying separately',
      'Priority support',
    ],
    cta: 'Get All Courses',
    ctaLink: '/courses',
  },
];

const featureComparison = [
  { feature: 'Quick Guides', free: '11 guides', single: '11 guides', bundle: '11 guides' },
  { feature: 'Full Courses', free: '1 lesson', single: 'All 3 courses', bundle: 'All 3 courses' },
  { feature: 'Hands-on Projects', free: false, single: '3 projects', bundle: '9 projects' },
  { feature: 'Assessments', free: false, single: 'Pass/fail quizzes', bundle: 'All quizzes' },
  { feature: 'Community Challenges', free: false, single: '✓', bundle: '✓' },
  { feature: 'Support', free: 'Email', single: 'Priority', bundle: 'Priority' },
];

const faqs = [
  {
    question: 'Do courses expire?',
    answer: 'No, you keep access forever once purchased.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Our Quick Guides are completely free. For full courses, try the1-2 lessons free before deciding.',
  },
  {
    question: 'What payment methods?',
    answer: 'We accept all major credit cards via Stripe.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, if you complete less than 20% of the course and are not satisfied, contact us within 7 days for a full refund.',
  },
  {
    question: 'Do you offer team discounts?',
    answer: 'Yes! Contact us for custom enterprise pricing for teams.',
  },
];

export default function PricingClient() {
  const [billingInterval, setBillingInterval] = useState<'forever' | 'one-time'>('one-time');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Affordable Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn AI with practical, project-based courses. One-time payment, yours forever.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                <Card
                  className={cn(
                    'h-full',
                    tier.recommended &&
                      'border-2 border-primary-600 dark:border-primary-500 shadow-xl'
                  )}
                  padding="none"
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge variant="primary" className="px-4 py-1">
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      {tier.id === 'free' && <Zap className="w-6 h-6 text-blue-600" />}
                      {tier.id === 'single-course' && <BookOpen className="w-6 h-6 text-primary-600" />}
                      {tier.id === 'bundle' && <Crown className="w-6 h-6 text-yellow-600" />}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {tier.interval === 'forever' ? 'Free' : tier.interval === 'one-time' ? formatCurrency(tier.price) : `$${tier.price}`}
                        </span>
                        {tier.interval !== 'forever' && (
                          <span className="text-gray-600 dark:text-gray-400">
                            {tier.interval === 'one-time' ? 'one-time payment' : 'forever'}
                          </span>
                        )}
                      </div>
                      {tier.id === 'bundle' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save $15 compared to buying separately
                        </p>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {tier.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href={tier.ctaLink || '/courses'}>
                      <Button
                        className="w-full"
                        variant={tier.recommended ? 'primary' : 'outline'}
                        size="lg"
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What You Get for $14.99
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hands-on Projects</h3>
              <p className="text-gray-600 dark:text-gray-400">Build real applications with code you can add to your portfolio</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pass/Fail Assessments</h3>
              <p className="text-gray-600 dark:text-gray-400">Prove your skills with real evaluations</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Community Challenges</h3>
              <p className="text-gray-600 dark:text-gray-400">Compete with others and showcase your work</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              See what's included in each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card padding="none" className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="p-6 text-center font-semibold text-gray-900 dark:text-white">
                      Free
                    </th>
                    <th className="p-6 text-center font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20">
                      $14.99
                    </th>
                    <th className="p-6 text-center font-semibold text-gray-900 dark:text-white">
                      $29.99 Bundle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'border-b border-gray-200 dark:border-gray-700 last:border-0',
                        index % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/50'
                      )}
                    >
                      <td className="p-6 text-gray-700 dark:text-gray-300">
                        {row.feature}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {row.free}
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center bg-primary-50 dark:bg-primary-900/20">
                        {typeof row.single === 'boolean' ? (
                          row.single? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {row.single}
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.bundle === 'boolean' ? (
                          row.bundle? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {row.bundle}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need to know
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <Card key={index} padding="none">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
                      openFaq === index && 'rotate-180'
                    )}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Join learners building real AI skills with hands-on projects
            </p>
            <Link href="/courses">
              <Button size="lg" variant="secondary">
                Browse Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
