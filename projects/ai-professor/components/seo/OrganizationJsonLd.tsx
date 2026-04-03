'use client'

import Script from 'next/script'

interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export function OrganizationJsonLd({
  name = 'CXO Academy',
  url = 'https://cxoacademy.co',
  logo = 'https://cxoacademy.co/icons/icon.svg',
  description = 'Real-time AI news aggregation meets AI-powered learning. Stay current with the latest AI developments and get smarter with expert-led courses.',
  sameAs = [
    'https://twitter.com/pulseaiprof',
  ],
}: OrganizationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebSiteJsonLdProps {
  name?: string
  url?: string
  description?: string
}

export function WebSiteJsonLd({
  name = 'CXO Academy',
  url = 'https://cxoacademy.co',
  description = 'Real-time AI news aggregation meets AI-powered learning.',
}: WebSiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
