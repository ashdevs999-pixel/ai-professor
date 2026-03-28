// Stripe Configuration
export const STRIPE_CONFIG = {
  // Course pricing in cents (Stripe uses cents)
  coursePrice: 1499, // $14.99
  currency: 'usd',
  
  // URLs
  successUrl: '/courses?payment=success',
  cancelUrl: '/courses?payment=cancelled',
  
  // Display
  priceDisplay: '$14.99',
}

// Format price for display
export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
