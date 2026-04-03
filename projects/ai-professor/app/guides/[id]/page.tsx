import { Metadata } from 'next'
import GuideContent from './GuideContent'

export const metadata: Metadata = {
  title: 'Quick Guide - CXO Academy',
  description: 'Free hands-on tutorial from CXO Academy',
}

export default function GuidePage({ params }: { params: { id: string } }) {
  return <GuideContent guideId={params.id} />
}
