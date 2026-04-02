import { Metadata } from 'next'
import NewsClient from './NewsClient'

export const metadata: Metadata = {
  title: 'Pulse News - AI Professor',
  description: 'Real-time AI news from 19 trusted sources. Stay current with the latest AI developments, research breakthroughs, and product launches.',
  openGraph: {
    title: 'Pulse News - AI Professor',
    description: 'Real-time AI news from 19 trusted sources. Stay current with the latest AI developments.',
    type: 'website',
    url: 'https://pulseaiprofessor.com/news',
  },
}

export default function NewsPage() {
  return <NewsClient />
}
