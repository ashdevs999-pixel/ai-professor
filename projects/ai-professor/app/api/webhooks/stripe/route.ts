import { NextRequest, NextResponse } from 'next/server'

// Stripe webhook handler - placeholder
export async function POST(request: NextRequest) {
  return NextResponse.json({ received: true })
}
