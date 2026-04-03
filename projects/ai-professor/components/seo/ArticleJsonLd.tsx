'use client'

import Script from 'next/script'

interface NewsArticleJsonLdProps {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  publisher?: {
    name: string
    logo?: string
  }
  imageUrl?: string
  category?: string
  sourceName?: string
}

export function NewsArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author = { name: 'CXO Academy' },
  publisher = { name: 'CXO Academy', logo: 'https://cxoacademy.co/icons/icon.svg' },
  imageUrl,
  category,
  sourceName,
}: NewsArticleJsonLdProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && {
        logo: {
          '@type': 'ImageObject',
          url: publisher.logo,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(category && { articleSection: category }),
    ...(sourceName && {
      sourceOrganization: {
        '@type': 'Organization',
        name: sourceName,
      },
    }),
  }

  return (
    <Script
      id="newsarticle-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArticleJsonLdProps {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  publisher?: {
    name: string
    logo?: string
  }
  imageUrl?: string
  articleBody?: string
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author = { name: 'CXO Academy' },
  publisher = { name: 'CXO Academy', logo: 'https://cxoacademy.co/icons/icon.svg' },
  imageUrl,
  articleBody,
}: ArticleJsonLdProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && {
        logo: {
          '@type': 'ImageObject',
          url: publisher.logo,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(articleBody && { articleBody }),
  }

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
