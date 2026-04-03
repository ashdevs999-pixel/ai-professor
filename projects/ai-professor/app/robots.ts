import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/', '/_next/', '/private/'],
      },
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'ChatGPT-User', // OpenAI
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'Claude-Web', // Anthropic
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended', // Google AI training
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'Applebot-Extended', // Apple AI training
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/dashboard/'],
      },
    ],
    sitemap: 'https://cxoacademy.co/sitemap.xml',
  }
}
