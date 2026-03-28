#!/bin/bash

# Voice Feature Verification Script
# Verifies all components are properly created

echo "🔍 Voice Feature Verification"
echo "============================"
echo ""

ERRORS=0
WARNINGS=0

# Check backend files
echo "📦 Checking Backend Files..."

if [ -f "lib/voice/elevenlabs.ts" ]; then
    echo "✓ ElevenLabs client"
else
    echo "✗ ElevenLabs client missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "lib/voice/audio-generator.ts" ]; then
    echo "✓ Audio generator"
else
    echo "✗ Audio generator missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "app/api/news/[id]/audio/route.ts" ]; then
    echo "✓ Audio API route"
else
    echo "✗ Audio API route missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "app/api/voice/route.ts" ]; then
    echo "✓ Voice preference API"
else
    echo "✗ Voice preference API missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "supabase/voice-schema.sql" ]; then
    echo "✓ Database schema"
else
    echo "✗ Database schema missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check frontend files
echo "🎨 Checking Frontend Files..."

if [ -f "components/news/AudioPlayer.tsx" ]; then
    echo "✓ AudioPlayer component"
else
    echo "✗ AudioPlayer component missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "components/news/VoiceSelector.tsx" ]; then
    echo "✓ VoiceSelector component"
else
    echo "✗ VoiceSelector component missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "components/news/MiniPlayer.tsx" ]; then
    echo "✓ MiniPlayer component"
else
    echo "✗ MiniPlayer component missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "hooks/useAudioPlayer.ts" ]; then
    echo "✓ useAudioPlayer hook"
else
    echo "✗ useAudioPlayer hook missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "types/voice.ts" ]; then
    echo "✓ Voice types"
else
    echo "✗ Voice types missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check scripts
echo "🛠️  Checking Scripts..."

if [ -f "scripts/generate-audio.ts" ]; then
    echo "✓ Generate audio script"
else
    echo "✗ Generate audio script missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "scripts/voice-cron.ts" ]; then
    echo "✓ Voice cron script"
else
    echo "✗ Voice cron script missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "scripts/setup-voice.sh" ]; then
    echo "✓ Setup script"
else
    echo "✗ Setup script missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check tests
echo "🧪 Checking Tests..."

if [ -f "__tests__/voice/elevenlabs.test.ts" ]; then
    echo "✓ ElevenLabs tests"
else
    echo "⚠ ElevenLabs tests missing"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check documentation
echo "📚 Checking Documentation..."

if [ -f "docs/VOICE_FEATURE.md" ]; then
    echo "✓ Feature documentation"
else
    echo "⚠ Feature documentation missing"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "docs/VOICE_INTEGRATION.md" ]; then
    echo "✓ Integration guide"
else
    echo "⚠ Integration guide missing"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "docs/VOICE_FILES.md" ]; then
    echo "✓ Files summary"
else
    echo "⚠ Files summary missing"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "docs/VOICE_QUICK_REFERENCE.md" ]; then
    echo "✓ Quick reference"
else
    echo "⚠ Quick reference missing"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check configuration
echo "⚙️  Checking Configuration..."

if grep -q "ELEVENLABS_API_KEY" .env.example; then
    echo "✓ Environment variables documented"
else
    echo "⚠ Environment variables not documented"
    WARNINGS=$((WARNINGS + 1))
fi

if grep -q "AudioPlayer" components/news/index.ts; then
    echo "✓ Components exported"
else
    echo "⚠ Components not exported"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Summary
echo "📊 Verification Summary"
echo "======================"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ All required files present!"
else
    echo "❌ $ERRORS required file(s) missing"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️  $WARNINGS optional file(s) missing"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo "🎉 Voice feature is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./scripts/setup-voice.sh"
    echo "  2. Configure .env.local with API keys"
    echo "  3. Apply database schema: psql \$DATABASE_URL < supabase/voice-schema.sql"
    echo "  4. Start dev server: npm run dev"
    echo "  5. Test at: http://localhost:3000/news"
    echo ""
    exit 0
else
    echo "❌ Voice feature setup incomplete"
    echo "Please check missing files above"
    echo ""
    exit 1
fi
