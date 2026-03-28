import { Metadata } from 'next'
import BreakingNewsClient from './BreakingNewsClient'

export const metadata: Metadata = {
  title: 'Breaking Tech News',
  description: 'Latest breaking tech news from top sources - TechCrunch, The Verge, Wired, Ars Technica, and more.',
}

export default function BreakingNewsPage() {
  return <BreakingNewsClient />
}
