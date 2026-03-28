// News Types

export type NewsCategory = 'news' | 'launches' | 'research' | 'tools' | 'announcements'

export interface NewsItem {
  id: string
  title: string
  summary: string | null
  content: string | null
  source_url: string
  source_name: string
  category: NewsCategory
  published_at: string | null
  scraped_at: string
  image_url: string | null
  author: string | null
  tags: string[] | null
  created_at: string
}

export interface NewsSource {
  id: string
  name: string
  url: string
  category: NewsCategory
  scraper_function: string
  enabled: boolean
  scrape_interval_hours: number
  last_scraped_at: string | null
  items_scraped: number
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface NewsScrapeError {
  id: string
  source_name: string
  source_url: string | null
  error_message: string
  error_stack: string | null
  retry_count: number
  last_retry_at: string | null
  resolved: boolean
  created_at: string
}

// Insert types
export interface NewNewsItem {
  title: string
  summary?: string | null
  content?: string | null
  source_url: string
  source_name: string
  category: NewsCategory
  published_at?: string | null
  scraped_at?: string
  image_url?: string | null
  author?: string | null
  tags?: string[] | null
}

export interface NewNewsScrapeError {
  source_name: string
  source_url?: string | null
  error_message: string
  error_stack?: string | null
  retry_count?: number
  last_retry_at?: string | null
  resolved?: boolean
}

// API Response types
export interface NewsApiResponse {
  success: boolean
  data?: NewsItem[]
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleNewsApiResponse {
  success: boolean
  data?: NewsItem
  error?: string
}

// Filter types
export interface NewsFilters {
  category?: NewsCategory
  source?: string
  search?: string
  tags?: string[]
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: 'published_at' | 'scraped_at' | 'title'
  sortOrder?: 'asc' | 'desc'
}

// Scraping types
export interface ScraperResult {
  source: string
  items: Omit<NewNewsItem, 'summary'>[]
  errors: Array<{
    url?: string
    error: string
  }>
}

export interface ScrapingConfig {
  maxRetries: number
  retryDelayMs: number
  timeoutMs: number
  maxItemsPerSource: number
  respectRobotsTxt: boolean
  userAgent: string
}

// RSS types
export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  author?: string
  category?: string
}

export interface RSSFeed {
  version: string
  channel: {
    title: string
    link: string
    description: string
    language: string
    lastBuildDate: string
    items: RSSItem[]
  }
}

// Social sharing types
export interface ShareData {
  url: string
  title: string
  summary?: string
  hashtags?: string[]
}

// Component props types
export interface NewsCardProps {
  item: NewsItem
  featured?: boolean
  showSummary?: boolean
  showSource?: boolean
  showCategory?: boolean
  showShareButtons?: boolean
}

export interface NewsFeedProps {
  filters?: NewsFilters
  showFilters?: boolean
  showSearch?: boolean
  infiniteScroll?: boolean
  itemsPerPage?: number
}

export interface NewsFiltersProps {
  filters: NewsFilters
  onFilterChange: (filters: Partial<NewsFilters>) => void
  sources?: string[]
  showCategoryFilter?: boolean
  showSourceFilter?: boolean
  showDateFilter?: boolean
}

export interface NewsSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

// Utility types
export type NewsCategoryLabel = {
  [key in NewsCategory]: string
}

export const NEWS_CATEGORY_LABELS: NewsCategoryLabel = {
  news: 'General News',
  launches: 'Product Launches',
  research: 'Research Papers',
  tools: 'AI Tools & Libraries',
  announcements: 'Company Announcements',
}

export const NEWS_CATEGORY_COLORS: NewsCategoryLabel = {
  news: 'blue',
  launches: 'green',
  research: 'purple',
  tools: 'orange',
  announcements: 'red',
}
