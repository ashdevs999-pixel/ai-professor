// Subscription Types

import { SubscriptionTier, SubscriptionStatus } from './database'

export interface StripeProduct {
  id: string
  name: string
  description: string
  prices: StripePrice[]
}

export interface StripePrice {
  id: string
  product_id: string
  unit_amount: number
  currency: string
  recurring: {
    interval: 'month' | 'year'
    interval_count: number
  }
}

export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: {
    courses: number | null // null = unlimited
    ai_generations_per_month: number | null
    storage_gb: number | null
    support: 'community' | 'email' | 'priority'
  }
  stripe_price_id_monthly: string
  stripe_price_id_yearly: string
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Access to free courses',
      'Basic AI assistance',
      'Community support',
      'Progress tracking',
    ],
    limits: {
      courses: 3,
      ai_generations_per_month: 10,
      storage_gb: 1,
      support: 'community',
    },
    stripe_price_id_monthly: '',
    stripe_price_id_yearly: '',
  },
  basic: {
    tier: 'basic',
    name: 'Basic',
    description: 'Great for individual learners',
    price_monthly: 19,
    price_yearly: 190,
    features: [
      'Access to all basic courses',
      'Enhanced AI assistance',
      'Email support',
      'Unlimited progress tracking',
      'Course completion certificates',
    ],
    limits: {
      courses: 10,
      ai_generations_per_month: 100,
      storage_gb: 5,
      support: 'email',
    },
    stripe_price_id_monthly: 'price_basic_monthly',
    stripe_price_id_yearly: 'price_basic_yearly',
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    description: 'For serious learners and professionals',
    price_monthly: 49,
    price_yearly: 490,
    features: [
      'Access to all courses',
      'Priority AI assistance',
      'Priority email support',
      'Advanced analytics',
      'Custom learning paths',
      'Weekly research updates',
    ],
    limits: {
      courses: null, // unlimited
      ai_generations_per_month: 1000,
      storage_gb: 25,
      support: 'priority',
    },
    stripe_price_id_monthly: 'price_pro_monthly',
    stripe_price_id_yearly: 'price_pro_yearly',
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    price_monthly: 199,
    price_yearly: 1990,
    features: [
      'Everything in Pro',
      'Team management',
      'Custom course creation',
      'API access',
      'Dedicated account manager',
      'SSO integration',
      'Custom integrations',
    ],
    limits: {
      courses: null,
      ai_generations_per_month: null,
      storage_gb: null,
      support: 'priority',
    },
    stripe_price_id_monthly: 'price_enterprise_monthly',
    stripe_price_id_yearly: 'price_enterprise_yearly',
  },
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

export interface SubscriptionUpdatePayload {
  tier: SubscriptionTier
  billingInterval: 'month' | 'year'
}

export interface SubscriptionStatusResponse {
  tier: SubscriptionTier
  status: SubscriptionStatus
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  daysUntilRenewal: number | null
}

export interface BillingPortalResponse {
  url: string
}

// Stripe webhook event types
export interface StripeWebhookEvent {
  id: string
  object: string
  type: string
  data: {
    object: any
  }
}

export interface StripeSubscriptionObject {
  id: string
  customer: string
  status: SubscriptionStatus
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  items: {
    data: Array<{
      price: {
        id: string
        product: string
      }
    }>
  }
}

export interface StripeInvoiceObject {
  id: string
  customer: string
  subscription: string
  payment_intent: string
  status: string
}

// Helper functions
export function getPlanByPriceId(priceId: string): SubscriptionPlan | null {
  for (const plan of Object.values(SUBSCRIPTION_PLANS)) {
    if (
      plan.stripe_price_id_monthly === priceId ||
      plan.stripe_price_id_yearly === priceId
    ) {
      return plan
    }
  }
  return null
}

export function canUserAccessTier(
  currentTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const tierLevels: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3,
  }
  return tierLevels[currentTier] >= tierLevels[requiredTier]
}
