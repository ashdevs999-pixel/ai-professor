# 🚀 Pulse News - Quick Start Guide

**Pulse News** - The pulse of AI innovation

Get the news aggregation system running in 5 minutes!

## Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key

## Step 1: Install Dependencies (1 minute)

```bash
cd /home/watson/.openclaw/workspace/projects/ai-professor
npm install
```

This installs:
- `cheerio` - HTML parsing
- `react-share` - Social sharing buttons
- `framer-motion` - Animations
- And all other required packages

## Step 2: Set Up Database (2 minutes)

### Option A: Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the contents of `supabase/news-schema.sql`
4. Paste and click "Run"

### Option B: Using Command Line

```bash
# If you have psql installed
psql -h your-supabase-host -U postgres -d postgres -f supabase/news-schema.sql
```

This creates:
- `news_items` table
- `news_scrape_errors` table
- `news_sources` table
- All necessary indexes
- RLS policies

## Step 3: Configure Environment (30 seconds)

Add these to your `.env` file:

```env
# Existing variables (should already be there)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key

# New variables for news system
NEWS_SCRAPE_INTERVAL_HOURS=6
NEWS_MAX_ITEMS_PER_SOURCE=10
```

## Step 4: Run Initial Scrape (1 minute)

```bash
npm run scrape:news
```

This will:
- Scrape all 19 news sources
- Store items in database
- Generate AI summaries
- Show progress in console

Expected output:
```
📰 AI Professor News Scraper

Scraping all enabled sources...

Scraping OpenAI Blog...
✓ OpenAI Blog: 10 items scraped
Scraping Anthropic News...
✓ Anthropic News: 10 items scraped
...
✓ Scraping completed

Processing summaries with AI...
✓ Processed 50 items

Total news items in database: 190
```

## Step 5: Start Development Server (30 seconds)

```bash
npm run dev
```

Visit:
- **News Hub**: http://localhost:3000/news
- **Homepage**: http://localhost:3000 (scroll to "Latest AI News" section)

## 🎉 You're Done!

The news aggregation system is now running!

## What's Next?

### Browse News
- Visit `/news` to see the full news feed
- Use filters to find specific categories
- Search for topics
- Share articles on social media

### Keep It Updated
Run manually:
```bash
npm run scrape:news
```

Or set up automated scraping:
```bash
npm run news:watch
```

### Monitor Performance
Check scraping stats:
```bash
npm run scrape:news:stats
```

### Customize
- Edit scrapers in `lib/news/sources/`
- Adjust summaries in `lib/news/summarizer.ts`
- Modify UI in `components/news/`

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### "Database connection error"
- Check your Supabase credentials in `.env`
- Verify the news tables were created

### "OpenAI API error"
- Check your OpenAI API key in `.env`
- Ensure you have credits available

### Scrapers not finding items
- Some sites may have changed their HTML structure
- Check the scrapers in `lib/news/sources/` and adjust selectors

### RSS feed not working
- Ensure you have at least 1 news item in the database
- Visit `/api/news/rss` directly to see XML output

## Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Set Up Cron Job (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Add this line (runs every 6 hours)
0 */6 * * * cd /home/watson/.openclaw/workspace/projects/ai-professor && /usr/bin/npm run scrape:news >> /var/log/news-scrape.log 2>&1
```

### Or Use PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start the cron job as a PM2 process
pm2 start npm run news:watch --name "news-cron"

# Save PM2 configuration
pm2 save

# Start on boot
pm2 startup
```

## API Examples

### Get all news
```bash
curl http://localhost:3000/api/news
```

### Get research papers
```bash
curl http://localhost:3000/api/news?category=research
```

### Search for "GPT"
```bash
curl http://localhost:3000/api/news?search=gpt
```

### Get RSS feed
```bash
curl http://localhost:3000/api/news/rss
```

### Trigger scrape (requires auth)
```bash
curl -X POST http://localhost:3000/api/news/scrape \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Component Usage

```typescript
import { NewsFeed, NewsCard } from '@/components/news'

// Full news feed
<NewsFeed 
  showFilters={true}
  infiniteScroll={true}
  itemsPerPage={20}
/>

// Single news card
<NewsCard 
  item={newsItem}
  showShareButtons={true}
  showSummary={true}
/>
```

## Need Help?

- Check the full documentation in `README.md`
- Review the implementation summary in `NEWS-IMPLEMENTATION-SUMMARY.md`
- Check the database schema in `supabase/news-schema.sql`

---

Built with ❤️ for AI Professor
