-- AI News Aggregation System Schema
-- Add to main schema or run separately

-- News categories enum
CREATE TYPE news_category AS ENUM ('news', 'launches', 'research', 'tools', 'announcements');

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

-- Indexes for performance
CREATE INDEX idx_news_items_category ON news_items(category);
CREATE INDEX idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX idx_news_items_source ON news_items(source_name);
CREATE INDEX idx_news_items_scraped_at ON news_items(scraped_at DESC);
CREATE INDEX idx_news_items_tags ON news_items USING GIN(tags);
CREATE INDEX idx_news_scrape_errors_source ON news_scrape_errors(source_name);
CREATE INDEX idx_news_scrape_errors_resolved ON news_scrape_errors(resolved);
CREATE INDEX idx_news_sources_enabled ON news_sources(enabled);

-- Row Level Security (RLS) Policies
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_scrape_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;

-- News items policies (publicly readable)
CREATE POLICY "News items are viewable by everyone"
  ON news_items FOR SELECT
  USING (true);

-- News scrape errors policies (admin only)
CREATE POLICY "Scrape errors are viewable by admins only"
  ON news_scrape_errors FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- News sources policies (admin only for writes, public read)
CREATE POLICY "News sources are viewable by everyone"
  ON news_sources FOR SELECT
  USING (true);

CREATE POLICY "News sources are managed by admins only"
  ON news_sources FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to cleanup old news items (keep last 1000 per source)
CREATE OR REPLACE FUNCTION cleanup_old_news()
RETURNS void AS $$
BEGIN
  DELETE FROM news_items
  WHERE id IN (
    SELECT id FROM (
      SELECT id,
        ROW_NUMBER() OVER (PARTITION BY source_name ORDER BY published_at DESC) as rn
      FROM news_items
    ) t
    WHERE rn > 1000
  );
END;
$$ LANGUAGE plpgsql;

-- Function to update source stats
CREATE OR REPLACE FUNCTION update_source_stats(
  p_source_name TEXT,
  p_items_count INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE news_sources
  SET 
    last_scraped_at = NOW(),
    items_scraped = items_scraped + p_items_count,
    updated_at = NOW()
  WHERE name = p_source_name;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on news_sources
CREATE TRIGGER update_news_sources_updated_at
  BEFORE UPDATE ON news_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default news sources
INSERT INTO news_sources (name, url, category, scraper_function, scrape_interval_hours) VALUES
-- Company Blogs
('OpenAI Blog', 'https://openai.com/blog', 'announcements', 'scrapeOpenAI', 6),
('Anthropic News', 'https://www.anthropic.com/news', 'announcements', 'scrapeAnthropic', 6),
('Google AI Blog', 'https://ai.googleblog.com/', 'announcements', 'scrapeGoogleAI', 6),
('Meta AI', 'https://ai.meta.com/blog/', 'announcements', 'scrapeMetaAI', 6),
('Microsoft AI Blog', 'https://blogs.microsoft.com/ai/', 'announcements', 'scrapeMicrosoftAI', 6),
('Stability AI', 'https://stability.ai/news', 'announcements', 'scrapeStabilityAI', 6),

-- Tech News
('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/', 'news', 'scrapeTechCrunch', 6),
('The Verge AI', 'https://www.theverge.com/ai-artificial-intelligence', 'news', 'scrapeTheVerge', 6),
('Ars Technica AI', 'https://arstechnica.com/?tags=artificial-intelligence', 'news', 'scrapeArsTechnica', 6),
('VentureBeat AI', 'https://venturebeat.com/category/ai/', 'news', 'scrapeVentureBeat', 6),
('Wired AI', 'https://www.wired.com/tag/artificial-intelligence/', 'news', 'scrapeWired', 6),

-- Research
('arXiv cs.AI', 'https://arxiv.org/list/cs.AI/recent', 'research', 'scrapeArxiv', 12),
('Papers With Code', 'https://paperswithcode.com/', 'research', 'scrapePapersWithCode', 12),
('Hugging Face Blog', 'https://huggingface.co/blog', 'research', 'scrapeHuggingFace', 12),

-- Products
('Product Hunt AI', 'https://www.producthunt.com/topics/artificial-intelligence', 'launches', 'scrapeProductHunt', 6),
('Hacker News', 'https://news.ycombinator.com/', 'launches', 'scrapeHackerNews', 6),

-- Community
('Reddit r/MachineLearning', 'https://www.reddit.com/r/MachineLearning/', 'news', 'scrapeRedditML', 6),
('Reddit r/artificial', 'https://www.reddit.com/r/artificial/', 'news', 'scrapeRedditArtificial', 6)
ON CONFLICT (name) DO NOTHING;
