import { Metadata } from 'next'
import LearningPathsClient from './LearningPathsClient'

export const metadata: Metadata = {
  title: 'Programs - CXO Academy',
  description: 'Structured learning programs from beginner to expert. Follow curated paths and master AI, cybersecurity, and leadership step by step.',
  openGraph: {
    title: 'Programs - CXO Academy',
    description: 'Structured learning programs from beginner to expert. Follow curated paths and master AI, cybersecurity, and leadership step by step.',
    type: 'website',
    url: 'https://cxoacademy.co/paths',
  },
}

export default function LearningPathsPage() {
  return <LearningPathsClient />
}
