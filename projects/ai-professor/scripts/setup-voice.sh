#!/bin/bash

# Voice Feature Setup Script
# This script helps set up the voice narration feature

echo "🎙️  AI Professor Voice Feature Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo ""
fi

# Check for required environment variables
echo "🔍 Checking environment variables..."

if grep -q "ELEVENLABS_API_KEY=xi-your-elevenlabs-api-key-here" .env.local; then
    echo "⚠️  ELEVENLABS_API_KEY not set!"
    echo "   Please add your ElevenLabs API key to .env.local"
    echo "   Get your API key at: https://elevenlabs.io/app/settings/api-keys"
    echo ""
    MISSING_ENV=true
else
    echo "✓ ELEVENLABS_API_KEY is set"
fi

if grep -q "ELEVENLABS_MALE_VOICE_ID" .env.local; then
    echo "✓ ELEVENLABS_MALE_VOICE_ID is set"
else
    echo "⚠️  ELEVENLABS_MALE_VOICE_ID not set, using default"
fi

if grep -q "ELEVENLABS_FEMALE_VOICE_ID" .env.local; then
    echo "✓ ELEVENLABS_FEMALE_VOICE_ID is set"
else
    echo "⚠️  ELEVENLABS_FEMALE_VOICE_ID not set, using default"
fi

echo ""

# Check database connection
echo "🔍 Checking database connection..."
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL client found"
else
    echo "⚠️  PostgreSQL client not found (optional)"
fi

echo ""

# Check if Supabase is configured
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "✓ Supabase URL is configured"
else
    echo "⚠️  Supabase URL not configured"
    echo "   Please add NEXT_PUBLIC_SUPABASE_URL to .env.local"
fi

if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    echo "✓ Supabase service role key is configured"
else
    echo "⚠️  Supabase service role key not configured"
    echo "   Please add SUPABASE_SERVICE_ROLE_KEY to .env.local"
fi

echo ""

# Instructions for database setup
echo "📝 Database Setup Instructions"
echo "------------------------------"
echo ""
echo "1. Apply the voice schema to your database:"
echo "   psql \$DATABASE_URL < supabase/voice-schema.sql"
echo ""
echo "   Or run in Supabase SQL Editor:"
echo "   Copy contents of supabase/voice-schema.sql"
echo ""

# Instructions for storage setup
echo "2. Create storage bucket in Supabase:"
echo "   - Go to Storage in Supabase Dashboard"
echo "   - Create new bucket named 'audio'"
echo "   - Set to public"
echo ""

# Instructions for testing
echo "3. Test the voice feature:"
echo "   npm run dev"
echo "   Navigate to /news and click 'Listen' on any article"
echo ""

# Instructions for cron job
echo "4. (Optional) Set up cron job for automatic audio generation:"
echo "   npm run voice-cron"
echo ""

# Check if all requirements are met
if [ "$MISSING_ENV" = true ]; then
    echo "❌ Setup incomplete - please configure missing environment variables"
    echo ""
    exit 1
else
    echo "✅ Setup complete! You're ready to use the voice feature."
    echo ""
    echo "📚 Documentation:"
    echo "   - Full docs: docs/VOICE_FEATURE.md"
    echo "   - Integration guide: docs/VOICE_INTEGRATION.md"
    echo ""
    echo "🚀 Quick start:"
    echo "   1. npm run dev"
    echo "   2. Go to http://localhost:3000/news"
    echo "   3. Click 'Listen' on any article"
    echo ""
fi
