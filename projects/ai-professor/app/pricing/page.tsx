'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
  Crown,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';
import type { PricingTier } from '@/types';

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Pulse News (text only)',
      'Voice narration (5 articles/month)',
      'AI Professor (1 free course)',
      'Community forum access',
      'Email support',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited voice narration',
      'Access to all courses',
      'Verified certificates',
      'Personalized learning paths',
      'Priority support',
      'Live Q&A sessions',
      'Project reviews',
    ],
    recommended: true,
    cta: 'Start Free Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    interval: 'custom',
    features: [
      'Everything in Pro',
      'Team features',
      'Custom content',
      'Team analytics',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
  },
];

const featureComparison = [
  { feature: 'Pulse News', free: 'Text Only', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Voice Narration', free: '5 articles/mo', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Course Access', free: '1 course', pro: 'All courses', enterprise: 'All courses' },
  { feature: 'Certificates', free: false, pro: true, enterprise: true },
  { feature: 'Personalized Paths', free: false, pro: true, enterprise: true },
  { feature: 'Team Features', free: false, pro: false, enterprise: true },
  { feature: 'Custom Content', free: false, pro: false, enterprise: true },
  { feature: 'Analytics', free: false, pro: 'Personal', enterprise: 'Team' },
  { feature: 'API Access', free: false, pro: false, enterprise: true },
  { feature: 'SLA Guarantee', free: false, pro: false, enterprise: true },
];

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated based on your billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, our Pro plan includes a 7-day free trial. You can explore all features before committing to a subscription.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee if you are not satisfied with our service. No questions asked.',
  },
  {
    question: 'Do you offer discounts for students or teams?',
    answer:
      'Yes! We offer 50% off for students with a valid .edu email address. Teams of 5+ members receive a 20% discount.',
  },
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (price: number, interval: string) => {
    if (interval === 'custom') {
      return 'Custom';
    }
    if (billingInterval === 'year' && price > 0) {
      return price * 10; // 2 months free
    }
    return price;
  };

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your learning journey. No hidden fees, no
              surprises.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span
              className={cn(
                'text-sm font-medium',
                billingInterval === 'month'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingInterval(billingInterval === 'month' ? 'year' : 'month')
              }
              className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle billing interval"
            >
              <div
                className={cn(
                  'absolute top-1 w-5 h-5 bg-primary-600 rounded-full transition-transform',
                  billingInterval === 'year' ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
            <span
              className={cn(
                'text-sm font-medium',
                billingInterval === 'year'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              Yearly
            </span>
            {billingInterval === 'year' && (
              <Badge variant="success">Save 17%</Badge>
            )}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={cn(
                    'h-full relative',
                    tier.recommended &&
                      'border-2 border-primary-600 dark:border-primary-500 shadow-xl'
                  )}
                  padding="none"
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge variant="primary" className="px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      {tier.id === 'basic' && <Zap className="w-6 h-6 text-blue-600" />}
                      {tier.id === 'pro' && <Sparkles className="w-6 h-6 text-primary-600" />}
                      {tier.id === 'enterprise' && <Crown className="w-6 h-6 text-purple-600" />}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {tier.interval === 'custom' ? 'Custom' : formatCurrency(getPrice(tier.price, tier.interval))}
                        </span>
                        {tier.interval !== 'custom' && (
                          <span className="text-gray-600 dark:text-gray-400">
                            /{billingInterval}
                          </span>
                        )}
                      </div>
                      {billingInterval === 'year' && tier.price > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatCurrency(tier.price)}/month billed annually
                        </p>
                      )}
                    </div>

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

                    <Link href="/auth/signup">
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
                      Pro
                    </th>
                    <th className="p-6 text-center font-semibold text-gray-900 dark:text-white">
                      Enterprise
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
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {row.pro}
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {row.enterprise}
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
              Everything you need to know about our pricing
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
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Join thousands of students already learning with Pulse + AI Professor
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
