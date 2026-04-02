import { Metadata } from 'next'
import CompareProgramsClient from './CompareProgramsClient'

export const metadata: Metadata = {
  title: 'Compare Programs - AI Professor',
  description: 'Compare AI Professor learning programs side by side. Find the program that fits your goals, experience level, and career aspirations.',
  openGraph: {
    title: 'Compare Programs - AI Professor',
    description: 'Compare AI Professor learning programs side by side. Find the program that fits your goals.',
    type: 'website',
    url: 'https://pulseaiprofessor.com/paths/compare',
  },
}

export default function CompareProgramsPage() {
  return <CompareProgramsClient />
}
