import { Metadata } from 'next'
import CompareProgramsClient from './CompareProgramsClient'

export const metadata: Metadata = {
  title: 'Compare Programs - CXO Academy',
  description: 'Compare CXO Academy learning programs side by side. Find the program that fits your goals, experience level, and career aspirations.',
  openGraph: {
    title: 'Compare Programs - CXO Academy',
    description: 'Compare CXO Academy learning programs side by side. Find the program that fits your goals.',
    type: 'website',
    url: 'https://cxoacademy.co/paths/compare',
  },
}

export default function CompareProgramsPage() {
  return <CompareProgramsClient />
}
