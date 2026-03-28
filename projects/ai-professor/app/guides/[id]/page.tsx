import { Metadata } from 'next'
import GuideContent from './GuideContent'

export const metadata: Metadata = {
  title: 'Quick Guide - AI Professor',
  description: 'Free hands-on tutorial from AI Professor',
}

export default function GuidePage({ params }: { params: { id: string } }) {
  return <GuideContent guideId={params.id} />
}
