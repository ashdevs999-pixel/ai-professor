-- AI Course Suggester + Learning Paths Schema
-- Run in Supabase SQL Editor

-- ============================================
-- TRACK A: Course Suggestions
-- ============================================

-- Table to store AI-generated course suggestions
CREATE TABLE IF NOT EXISTS course_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  difficulty difficulty_level DEFAULT 'beginner',
  duration_weeks INTEGER DEFAULT 8,
  reason TEXT, -- Why this course was suggested (trending topic, etc.)
  source_news_ids UUID[], -- Related news articles that triggered this suggestion
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'generated')),
  suggested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  created_course_id UUID REFERENCES courses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying pending suggestions
CREATE INDEX IF NOT EXISTS idx_course_suggestions_status ON course_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_course_suggestions_topic ON course_suggestions(topic);

-- ============================================
-- TRACK B: Learning Paths
-- ============================================

-- Table to store learning paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  difficulty difficulty_level DEFAULT 'beginner',
  total_weeks INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for path courses (ordered)
CREATE TABLE IF NOT EXISTS path_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(path_id, course_id)
);

-- User enrollments in learning paths
CREATE TABLE IF NOT EXISTS path_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  current_course_id UUID REFERENCES courses(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, path_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_path_courses_path ON path_courses(path_id);
CREATE INDEX IF NOT EXISTS idx_path_courses_course ON path_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_path_enrollments_user ON path_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_path_enrollments_path ON path_enrollments(path_id);

-- Enable RLS
ALTER TABLE course_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Course suggestions are viewable by everyone" ON course_suggestions FOR SELECT USING (true);
CREATE POLICY "Learning paths are viewable by everyone" ON learning_paths FOR SELECT USING (is_published = true);
CREATE POLICY "Path courses are viewable by everyone" ON path_courses FOR SELECT USING (true);
CREATE POLICY "Users can view own path enrollments" ON path_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own path enrollments" ON path_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update path stats when courses are added
CREATE OR REPLACE FUNCTION update_path_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE learning_paths
  SET 
    total_courses = (
      SELECT COUNT(*) FROM path_courses WHERE path_id = COALESCE(NEW.path_id, OLD.path_id)
    ),
    total_weeks = (
      SELECT COALESCE(SUM(c.duration_weeks), 0)
      FROM path_courses pc
      JOIN courses c ON pc.course_id = c.id
      WHERE pc.path_id = COALESCE(NEW.path_id, OLD.path_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.path_id, OLD.path_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_path_stats_on_insert ON path_courses;
CREATE TRIGGER update_path_stats_on_insert
  AFTER INSERT ON path_courses
  FOR EACH ROW EXECUTE FUNCTION update_path_stats();

DROP TRIGGER IF EXISTS update_path_stats_on_delete ON path_courses;
CREATE TRIGGER update_path_stats_on_delete
  AFTER DELETE ON path_courses
  FOR EACH ROW EXECUTE FUNCTION update_path_stats();

-- ============================================
-- SEED DATA: Learning Paths
-- ============================================

INSERT INTO learning_paths (id, title, description, slug, difficulty, is_published, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'AI Fundamentals', 'Start from zero and build a strong foundation in artificial intelligence and machine learning.', 'ai-fundamentals', 'beginner', true, NOW(), NOW()),
  (gen_random_uuid(), 'AI Engineer', 'Master the skills needed to build and deploy AI systems in production.', 'ai-engineer', 'intermediate', true, NOW(), NOW()),
  (gen_random_uuid(), 'AI Researcher', 'Deep dive into cutting-edge AI research and contribute to the field.', 'ai-researcher', 'advanced', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

SELECT 'Schema created successfully!' as status;
