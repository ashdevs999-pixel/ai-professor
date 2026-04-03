import { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import PathDetailClient from './PathDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPath(slug: string) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('learning_paths')
    .select('id, title, description, slug, difficulty')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error || !data) return null
  return data as { id: string; title: string; description: string | null; slug: string; difficulty: string | null }
}

export async function generateStaticParams() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: paths } = await supabaseAdmin
      .from('learning_paths')
      .select('slug')
      .eq('is_published', true)
    return (paths || []).map((p: any) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const path = await getPath(slug)

  if (!path) {
    return { title: 'Program Not Found' }
  }

  const title = `${path.title} - CXO Academy`
  const description = path.description || `Learn ${path.title} with structured, expert-led modules.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://cxoacademy.co/paths/${slug}`,
    },
  }
}

export default async function PathDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <PathDetailClient slug={slug} />
}
