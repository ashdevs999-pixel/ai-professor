import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://ai-professor-app.vercel.app',
  'https://ai-professor-red.vercel.app',
  'https://cxoacademy.co',
  'http://localhost:3000',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '',
].filter(Boolean) as string[]

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const origin = request.headers.get('origin')

  // Protect admin routes - redirect unauthenticated users
  if (pathname.startsWith('/admin')) {
    const hasToken = request.cookies.get('sb-access-token')?.value || 
                     request.cookies.get('sb-auth-token')?.value ||
                     request.headers.get('authorization')
    
    if (!hasToken) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // CORS: block non-allowed origins on API routes
  if (pathname.startsWith('/api/')) {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse(
        JSON.stringify({ error: 'Origin not allowed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Handle preflight
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.set('Access-Control-Max-Age', '86400')
      }
      return response
    }

    // Add CORS headers to responses
    const response = NextResponse.next()
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
