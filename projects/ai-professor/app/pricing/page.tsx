import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing - AI Professor',
  description: 'Simple, transparent pricing. Start free with quick guides, or unlock full courses and programs.',
  openGraph: {
    title: 'Pricing - AI Professor',
    description: 'Simple, transparent pricing. Start free with quick guides, or unlock full courses and programs.',
    type: 'website',
    url: 'https://pulseaiprofessor.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingClient />
}
