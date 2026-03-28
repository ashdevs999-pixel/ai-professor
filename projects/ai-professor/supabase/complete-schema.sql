-- AI Professor Complete Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dgbkasfjrsjzdqttkfac/sql

-- ============================================
-- PART 1: Core Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE news_category AS ENUM ('news', 'launches', 'research', 'tools', 'announcements');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  difficulty difficulty_level DEFAULT 'beginner',
  duration_weeks INTEGER DEFAULT 12,
  image_url TEXT,
  instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_duration CHECK (duration_weeks > 0 AND duration_weeks <= 52)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  resources JSONB DEFAULT '[]'::jsonb,
  estimated_minutes INTEGER DEFAULT 60,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_week CHECK (week_number > 0),
  CONSTRAINT valid_duration_lesson CHECK (estimated_minutes > 0)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, course_id)
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  
  UNIQUE(user_id, lesson_id),
  CONSTRAINT valid_time CHECK (time_spent_seconds >= 0)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  tier subscription_tier NOT NULL,
  status subscription_status NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generated Content Cache
CREATE TABLE IF NOT EXISTS ai_content_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  content JSONB NOT NULL,
  model TEXT DEFAULT 'gpt-4o',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  UNIQUE(prompt_hash, content_type)
);

-- Weekly Research Updates
CREATE TABLE IF NOT EXISTS weekly_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  topic TEXT NOT NULL,
  summary TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(course_id, week_number)
);

-- ============================================
-- PART 2: News Schema
-- ============================================

-- News items table
CREATE TABLE IF NOT EXISTS news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  category news_category NOT NULL,
  published_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  image_url TEXT,
  author TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_source_url CHECK (source_url ~* '^https?://')
);

-- News scrape errors table
CREATE TABLE IF NOT EXISTS news_scrape_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_url TEXT,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News source configurations
CREATE TABLE IF NOT EXISTS news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  category news_category NOT NULL,
  scraper_function TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  scrape_interval_hours INTEGER DEFAULT 6,
  last_scraped_at TIMESTAMPTZ,
  items_scraped INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 3: Voice Schema
-- ============================================

-- Audio cache table
CREATE TABLE IF NOT EXISTS news_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_item_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  voice_type TEXT NOT NULL CHECK (voice_type IN ('male', 'female')),
  file_path TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(news_item_id, voice_type)
);

-- ============================================
-- PART 4: Indexes
-- ============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_courses_topic ON courses(topic);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_week ON lessons(course_id, week_number);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_content_cache(expires_at);

-- News indexes
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_source ON news_items(source_name);
CREATE INDEX IF NOT EXISTS idx_news_items_scraped_at ON news_items(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_tags ON news_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_news_scrape_errors_source ON news_scrape_errors(source_name);
CREATE INDEX IF NOT EXISTS idx_news_scrape_errors_resolved ON news_scrape_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_news_sources_enabled ON news_sources(enabled);

-- Voice indexes
CREATE INDEX IF NOT EXISTS idx_news_audio_news_item ON news_audio(news_item_id);
CREATE INDEX IF NOT EXISTS idx_news_audio_voice_type ON news_audio(voice_type);
CREATE INDEX IF NOT EXISTS idx_news_audio_generated_at ON news_audio(generated_at DESC);

-- ============================================
-- PART 5: Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_scrape_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_audio ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (is_published = true OR auth.uid() = instructor_id);
CREATE POLICY "Instructors can create courses" ON courses FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update own courses" ON courses FOR UPDATE USING (auth.uid() = instructor_id);

-- Lessons policies
CREATE POLICY "Lessons are viewable by enrolled users" ON lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = lessons.course_id
    AND (courses.is_published = true OR courses.instructor_id = auth.uid())
  )
);

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- News policies (public read)
CREATE POLICY "News items are viewable by everyone" ON news_items FOR SELECT USING (true);
CREATE POLICY "News sources are viewable by everyone" ON news_sources FOR SELECT USING (true);

-- Audio policies (public read)
CREATE POLICY "Audio files are viewable by everyone" ON news_audio FOR SELECT USING (true);

-- ============================================
-- PART 6: Functions & Triggers
-- ============================================

-- Updated at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_sources_updated_at ON news_sources;
CREATE TRIGGER update_news_sources_updated_at BEFORE UPDATE ON news_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Course progress function
CREATE OR REPLACE FUNCTION get_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons FROM lessons WHERE course_id = p_course_id;
  SELECT COUNT(*) INTO completed_lessons
  FROM progress p
  JOIN lessons l ON p.lesson_id = l.id
  WHERE p.user_id = p_user_id AND l.course_id = p_course_id AND p.completed = true;
  
  RETURN CASE WHEN total_lessons = 0 THEN 0 ELSE ROUND((completed_lessons::FLOAT / total_lessons::FLOAT) * 100) END;
END;
$$ LANGUAGE plpgsql;

-- Cleanup functions
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM ai_content_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_old_news()
RETURNS void AS $$
BEGIN
  DELETE FROM news_items WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY source_name ORDER BY published_at DESC) as rn
      FROM news_items
    ) t WHERE rn > 1000
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_old_audio()
RETURNS void AS $$
BEGIN
  DELETE FROM news_audio WHERE generated_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 7: Seed News Sources
-- ============================================

INSERT INTO news_sources (name, url, category, scraper_function, scrape_interval_hours) VALUES
('OpenAI Blog', 'https://openai.com/blog', 'announcements', 'scrapeOpenAI', 6),
('Anthropic News', 'https://www.anthropic.com/news', 'announcements', 'scrapeAnthropic', 6),
('Google AI Blog', 'https://ai.googleblog.com/', 'announcements', 'scrapeGoogleAI', 6),
('Meta AI', 'https://ai.meta.com/blog/', 'announcements', 'scrapeMetaAI', 6),
('Microsoft AI Blog', 'https://blogs.microsoft.com/ai/', 'announcements', 'scrapeMicrosoftAI', 6),
('Stability AI', 'https://stability.ai/news', 'announcements', 'scrapeStabilityAI', 6),
('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/', 'news', 'scrapeTechCrunch', 6),
('The Verge AI', 'https://www.theverge.com/ai-artificial-intelligence', 'news', 'scrapeTheVerge', 6),
('Ars Technica AI', 'https://arstechnica.com/?tags=artificial-intelligence', 'news', 'scrapeArsTechnica', 6),
('VentureBeat AI', 'https://venturebeat.com/category/ai/', 'news', 'scrapeVentureBeat', 6),
('Wired AI', 'https://www.wired.com/tag/artificial-intelligence/', 'news', 'scrapeWired', 6),
('arXiv cs.AI', 'https://arxiv.org/list/cs.AI/recent', 'research', 'scrapeArxiv', 12),
('Papers With Code', 'https://paperswithcode.com/', 'research', 'scrapePapersWithCode', 12),
('Hugging Face Blog', 'https://huggingface.co/blog', 'research', 'scrapeHuggingFace', 12),
('Product Hunt AI', 'https://www.producthunt.com/topics/artificial-intelligence', 'launches', 'scrapeProductHunt', 6),
('Hacker News', 'https://news.ycombinator.com/', 'launches', 'scrapeHackerNews', 6),
('Reddit r/MachineLearning', 'https://www.reddit.com/r/MachineLearning/', 'news', 'scrapeRedditML', 6),
('Reddit r/artificial', 'https://www.reddit.com/r/artificial/', 'news', 'scrapeRedditArtificial', 6)
ON CONFLICT (name) DO NOTHING;

-- Done!
SELECT 'Database schema created successfully!' as status;

-- Add course type and pricing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT 'full_course' CHECK (course_type IN ('quick_guide', 'full_course'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;

-- Update existing courses to be paid
UPDATE courses SET course_type = 'full_course', is_free = false, price = 10 WHERE course_type IS NULL;

-- Add 'breaking' to news_category enum
ALTER TYPE news_category ADD VALUE IF NOT EXISTS 'breaking';
