-- Fix RLS Policies for Exposed Tables
-- Run this in Supabase SQL Editor IMMEDIATELY

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. RATINGS TABLE
-- ============================================
-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Everyone can view ratings
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

-- Users can create their own ratings
CREATE POLICY "Users can create own ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON ratings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. AI_CONTENT_CACHE TABLE
-- ============================================
-- Enable RLS
ALTER TABLE ai_content_cache ENABLE ROW LEVEL SECURITY;

-- System/Service role only - no user access
-- This is internal cache data, should only be accessed via API
CREATE POLICY "Service role only access" ON ai_content_cache
  FOR ALL USING (auth.role() = 'service_role');

-- If you need enrolled users to read cached content:
-- CREATE POLICY "Enrolled users can read cache" ON ai_content_cache
--   FOR SELECT USING (
--     course_id IN (
--       SELECT course_id FROM enrollments WHERE user_id = auth.uid()
--     )
--   );

-- ============================================
-- 4. WEEKLY_RESEARCH TABLE
-- ============================================
-- Enable RLS
ALTER TABLE weekly_research ENABLE ROW LEVEL SECURITY;

-- Users enrolled in course can view research
CREATE POLICY "Enrolled users can view research" ON weekly_research
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- Instructors can manage their course's research
CREATE POLICY "Instructors can manage research" ON weekly_research
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Service role can manage all
CREATE POLICY "Service role can manage research" ON weekly_research
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 5. NEWS_SCRAPE_ERROR TABLE
-- ============================================
-- Enable RLS
ALTER TABLE news_scrape_errors ENABLE ROW LEVEL SECURITY;

-- Admin only - no public access
CREATE POLICY "Service role only access" ON news_scrape_errors
  FOR ALL USING (auth.role() = 'service_role');

-- If you want admins to view errors via dashboard:
-- CREATE POLICY "Admins can view errors" ON news_scrape_errors
--   FOR SELECT USING (
--     auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
--   );

-- ============================================
-- VERIFY ALL TABLES ARE NOW PROTECTED
-- ============================================
-- Run this after to confirm
SELECT 
  t.tablename,
  CASE 
    WHEN p.policyname IS NULL THEN '⚠️ STILL AT RISK!'
    ELSE '✅ Protected'
  END as status
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('ai_content_cache', 'news_scrape_errors', 'profiles', 'ratings', 'weekly_research')
GROUP BY t.tablename, p.policyname
ORDER BY t.tablename;
