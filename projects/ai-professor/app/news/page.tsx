import { Metadata } from 'next'
import NewsClient from './NewsClient'

export const metadata: Metadata = {
  title: 'CXO News - CXO Academy',
  description: 'Real-time AI news from 19 trusted sources. Stay current with the latest AI developments, research breakthroughs, and product launches.',
  openGraph: {
    title: 'CXO News - CXO Academy',
    description: 'Real-time AI news from 19 trusted sources. Stay current with the latest AI developments.',
    type: 'website',
    url: 'https://cxoacademy.co/news',
  },
}

export default function NewsPage() {
  return <NewsClient />
}
