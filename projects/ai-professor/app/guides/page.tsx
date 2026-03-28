import { Metadata } from 'next'
import QuickGuidesClient from './QuickGuidesClient'

export const metadata: Metadata = {
  title: 'Quick Guides - Free Tutorials',
  description: 'Free, hands-on tutorials for everyone. Learn to set up tools, use AI, and get started quickly. No experience needed.',
}

export default function QuickGuidesPage() {
  return <QuickGuidesClient />
}
