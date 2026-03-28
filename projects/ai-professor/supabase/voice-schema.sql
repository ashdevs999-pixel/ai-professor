-- Voice Feature Schema Extension
-- Add to main schema or run separately after news-schema.sql

-- Add voice preference to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_voice TEXT DEFAULT 'female' 
  CHECK (preferred_voice IN ('male', 'female'));

-- Audio cache table
CREATE TABLE IF NOT EXISTS news_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_item_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  voice_type TEXT NOT NULL CHECK (voice_type IN ('male', 'female')),
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  play_count INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(news_item_id, voice_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_audio_news_item ON news_audio(news_item_id);
CREATE INDEX IF NOT EXISTS idx_news_audio_voice_type ON news_audio(voice_type);
CREATE INDEX IF NOT EXISTS idx_news_audio_generated_at ON news_audio(generated_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE news_audio ENABLE ROW LEVEL SECURITY;

-- Audio is publicly readable (shared cache)
CREATE POLICY "Audio files are viewable by everyone"
  ON news_audio FOR SELECT
  USING (true);

-- Only authenticated users can trigger generation
CREATE POLICY "Authenticated users can insert audio"
  ON news_audio FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Function to cleanup old audio files (older than 7 days with low play count)
CREATE OR REPLACE FUNCTION cleanup_old_audio()
RETURNS void AS $$
BEGIN
  DELETE FROM news_audio
  WHERE generated_at < NOW() - INTERVAL '7 days'
    AND play_count < 5;
END;
$$ LANGUAGE plpgsql;

-- Function to update play count
CREATE OR REPLACE FUNCTION increment_audio_play_count(
  p_audio_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE news_audio
  SET 
    play_count = play_count + 1,
    last_played_at = NOW()
  WHERE id = p_audio_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create audio
CREATE OR REPLACE FUNCTION get_or_create_audio(
  p_news_item_id UUID,
  p_voice_type TEXT
)
RETURNS TABLE (
  id UUID,
  audio_url TEXT,
  duration_seconds INTEGER,
  exists BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    na.id,
    na.audio_url,
    na.duration_seconds,
    TRUE as exists
  FROM news_audio na
  WHERE na.news_item_id = p_news_item_id
    AND na.voice_type = p_voice_type;
  
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      NULL::UUID as id,
      NULL::TEXT as audio_url,
      NULL::INTEGER as duration_seconds,
      FALSE as exists;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE news_audio IS 'Cache of generated audio files for news items. Shared across all users for cost optimization.';
COMMENT ON COLUMN news_audio.voice_type IS 'Voice type: male or female';
COMMENT ON COLUMN news_audio.play_count IS 'Number of times this audio has been played';
COMMENT ON COLUMN news_audio.duration_seconds IS 'Duration of audio in seconds';
