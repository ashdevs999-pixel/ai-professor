/**
 * Audio API Route
 * Generates and returns audio directly from OpenAI TTS
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { VoiceType } from '@/types/voice'

const OPENAI_VOICES = {
  male: 'onyx',
  female: 'nova',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = params.id
    const body = await request.json().catch(() => ({}))
    const voiceType: VoiceType = body.voice || body.voiceType || 'female'

    if (!['male', 'female'].includes(voiceType)) {
      return NextResponse.json({ success: false, error: 'Invalid voice type' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Check if audio already exists
    const { data: existingAudio } = await supabaseAdmin
      .from('news_audio')
      .select('*')
      .eq('news_item_id', newsId)
      .eq('voice_type', voiceType)
      .single()

    if (existingAudio) {
      // Check if file_path is already a full URL
      let audioUrl = existingAudio.file_path
      if (!audioUrl.startsWith('http')) {
        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('news-audio')
          .getPublicUrl(audioUrl)
        audioUrl = urlData?.publicUrl || audioUrl
      }
      
      return NextResponse.json({
        success: true,
        audioUrl: audioUrl,
        duration: existingAudio.duration_seconds,
      })
    }

    // Get news item
    const { data: newsItem, error: newsError } = await supabaseAdmin
      .from('news_items')
      .select('title, summary')
      .eq('id', newsId)
      .single()

    if (newsError || !newsItem) {
      return NextResponse.json({ success: false, error: 'News item not found' }, { status: 404 })
    }

    // Prepare text for TTS
    const text = `${newsItem.title}. ${newsItem.summary || ''}`.substring(0, 4000)

    console.log(`Generating audio for: ${newsItem.title}`)

    // Call OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: OPENAI_VOICES[voiceType],
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI TTS error:', errorText)
      return NextResponse.json({ success: false, error: 'OpenAI TTS failed' }, { status: 500 })
    }

    // Get audio data
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = Buffer.from(arrayBuffer)

    console.log(`Audio generated: ${audioBuffer.byteLength} bytes`)

    // Upload to storage
    const filePath = `audio/${newsId}-${voiceType}-${Date.now()}.mp3`
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('news-audio')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      // Return as base64 instead
      const base64Audio = audioBuffer.toString('base64')
      const dataUrl = `data:audio/mp3;base64,${base64Audio}`
      
      return NextResponse.json({
        success: true,
        audioUrl: dataUrl,
        duration: Math.ceil(audioBuffer.byteLength / 16000),
      })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('news-audio')
      .getPublicUrl(filePath)

    const audioUrl = urlData?.publicUrl || filePath

    // Save to database (store only the path, not full URL)
    await supabaseAdmin.from('news_audio').insert({
      news_item_id: newsId,
      voice_type: voiceType,
      file_path: filePath, // Store path only
      file_size: audioBuffer.byteLength,
      duration_seconds: Math.ceil(audioBuffer.byteLength / 16000),
      generated_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.error('DB insert error:', error)
    })

    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      duration: Math.ceil(audioBuffer.byteLength / 16000),
    })
  } catch (error: any) {
    console.error('Audio API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
