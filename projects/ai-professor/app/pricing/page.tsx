import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing - CXO Academy',
  description: 'Simple, transparent pricing. Start free with quick guides, or unlock full courses and programs.',
  openGraph: {
    title: 'Pricing - CXO Academy',
    description: 'Simple, transparent pricing. Start free with quick guides, or unlock full courses and programs.',
    type: 'website',
    url: 'https://cxoacademy.co/pricing',
  },
}

export default function PricingPage() {
  return <PricingClient />
}
