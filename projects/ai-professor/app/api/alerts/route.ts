import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface AlertPayload {
  type: 'auth_failure' | 'api_error' | 'service_role' | 'high_volume' | 'custom'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details?: Record<string, any>
  timestamp?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const alertSecret = process.env.ALERT_SECRET
    
    if (alertSecret && authHeader !== `Bearer ${alertSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: AlertPayload = await request.json()
    
    // Validate required fields
    if (!body.type || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check Telegram config
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured')
      return NextResponse.json({ error: 'Alerts not configured' }, { status: 500 })
    }

    // Format alert message
    const severityEmoji = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
      critical: '🔴'
    }[body.severity] || '📢'

    const typeEmoji = {
      auth_failure: '🔐',
      api_error: '💥',
      service_role: '🔑',
      high_volume: '📈',
      custom: '📢'
    }[body.type] || '📢'

    const alertMessage = `
${severityEmoji} *CXO Academy Alert*

${typeEmoji} *${body.type.toUpperCase().replace(/_/g, ' ')}*
${body.message}

${body.details ? `\`\`\`\n${JSON.stringify(body.details, null, 2)}\n\`\`\`` : ''}
⏰ ${body.timestamp || new Date().toISOString()}
`.trim()

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: alertMessage,
        parse_mode: 'Markdown'
      })
    })

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text()
      console.error('Telegram error:', error)
      return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Alert sent successfully' 
    })

  } catch (error) {
    console.error('Alert error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// GET endpoint to test alerts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const alertSecret = process.env.ALERT_SECRET
  
  if (alertSecret && authHeader !== `Bearer ${alertSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Send test alert
  const testPayload: AlertPayload = {
    type: 'custom',
    severity: 'low',
    message: 'Test alert - monitoring system is working!',
    timestamp: new Date().toISOString()
  }

  // Call ourselves
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  
  const response = await fetch(`${baseUrl}/api/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${alertSecret || ''}`
    },
    body: JSON.stringify(testPayload)
  })

  return NextResponse.json({
    success: response.ok,
    message: response.ok ? 'Test alert sent!' : 'Test failed'
  })
}
