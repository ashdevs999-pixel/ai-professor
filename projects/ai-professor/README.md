# Pulse + AI Professor

**Stay current. Get smarter. One platform.**

Real-time AI news aggregation meets AI-powered learning. Fresh content weekly.

An intelligent platform that combines comprehensive AI news aggregation with expert-led educational courses, automatically creating and curating fresh, high-quality content weekly.

## 🚀 Features

- **Automated Weekly Content Generation** - Research, create, and update content on a schedule
- **Multi-Topic Support** - AI/ML, Web Dev, Cloud, Cybersecurity, DevOps/SRE
- **Quality Assurance** - Built-in quality checks for technical accuracy and readability
- **Content Personalization** - Adapt content to different skill levels and learning styles
- **Research Integration** - Automatic research using Perplexity API for latest developments
- **Cost Optimization** - Caching, token management, and efficient API usage

## 📁 Project Structure

```
ai-professor/
├── lib/
│   └── ai/
│       ├── course-generator.ts      # Main course generation logic
│       ├── lesson-generator.ts      # Lesson content generation
│       ├── quiz-generator.ts        # Quiz/assessment generation
│       ├── code-examples.ts         # Code example generation
│       ├── research-agent.ts        # Research and trend detection
│       └── templates/
│           ├── course-template.ts   # Course structure templates
│           ├── lesson-template.ts   # Lesson structure templates
│           ├── quiz-template.ts     # Quiz structure templates
│           └── code-template.ts     # Code example templates
├── scripts/
│   ├── generate-weekly-content.ts   # Weekly content pipeline
│   ├── update-existing-courses.ts   # Content update system
│   └── research-topics.ts           # Topic research CLI
├── types/
│   ├── content.ts                   # Content type definitions
│   └── ai.ts                        # AI-related types
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

```bash
cd projects/ai-professor
npm install
```

## ⚙️ Configuration

Create a `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key  # Optional, for research
OUTPUT_DIR=./content
CONTENT_DIR=./content
```

## 📚 Usage

### Weekly Content Generation

Run the full weekly pipeline:

```bash
npm run generate:weekly
```

This executes:
- **Monday**: Research latest developments
- **Tuesday**: Generate new lesson content
- **Wednesday**: Create code examples
- **Thursday**: Generate quizzes
- **Friday**: Update existing content

### Research Topics

```bash
# Research all configured topics
npm run research

# Research a specific topic
npm run research:topic "Large Language Models" ai-ml-engineering

# Identify emerging topics
npm run research:emerging

# Analyze coverage gaps
npm run research:gaps

# Generate weekly brief
npm run research:brief
```

### Content Updates

```bash
# Audit content for freshness
npm run audit

# Audit without making changes
npm run audit:dry

# Update all outdated content
npm run update:content
```

## 🏗️ Architecture

### Content Generation Pipeline

```
┌─────────────────┐
│ Research Agent  │ ← Perplexity API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Course Generator│ ← OpenAI GPT-4o
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Lesson │ │ Quiz  │
│ Gen   │ │ Gen   │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────────────┐
│  Code Examples  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Quality Check   │
└─────────────────┘
```

### Key Components

#### Course Generator
Generates complete courses with:
- Course outline and structure
- Learning objectives
- Module organization
- Assessments

#### Lesson Generator
Creates comprehensive lessons with:
- Introduction and hooks
- Core content sections
- Code examples
- Exercises
- Summaries

#### Quiz Generator
Produces assessments with:
- Multiple question types
- Adaptive difficulty
- Detailed explanations
- Bloom's taxonomy alignment

#### Code Examples Generator
Generates code with:
- Progressive complexity
- Test cases
- Explanations
- Best practices

#### Research Agent
Stays current with:
- Latest developments
- Trend identification
- Content freshness checking
- Knowledge gap detection

## 📊 Content Types

### Supported Topics

| Category | Example Topics |
|----------|---------------|
| AI/ML Engineering | LLMs, RAG, Fine-tuning, MLOps |
| Web Development | React, Next.js, TypeScript |
| Cloud Computing | Kubernetes, Serverless, IaC |
| Cybersecurity | Zero Trust, DevSecOps |
| DevOps/SRE | GitOps, Observability, SRE |

### Skill Levels

- **Beginner**: Foundational concepts, extensive explanations
- **Intermediate**: Building on basics, practical applications
- **Advanced**: Deep dives, edge cases, optimization
- **Expert**: Cutting-edge, research-oriented

## 🎯 Prompt Engineering

The system uses carefully crafted prompts for each generation type:

### Lesson Generation Prompt
```
Create comprehensive lesson content for:
- Topic: {{topic}}
- Skill Level: {{skillLevel}}
- Duration: {{duration}} minutes

Include:
1. Engaging introduction
2. Core content with explanations
3. Code examples
4. Practice exercises
5. Summary and key takeaways
```

### Quiz Generation Prompt
```
Generate assessment questions:
- Topic: {{topic}}
- Question Types: MC, MS, Code Analysis
- Difficulty: {{skillLevel}}
- Bloom's Level: {{bloomsLevel}}

Each question needs:
- Clear stem
- Plausible distractors
- Detailed explanation
```

## 🔧 Customization

### Adding New Topics

Edit `scripts/generate-weekly-content.ts`:

```typescript
topics: [
  { topic: 'Your Topic', category: 'ai-ml-engineering', priority: 'high' }
]
```

### Customizing Templates

Modify templates in `lib/ai/templates/`:
- Adjust structure requirements
- Change prompt wording
- Add new content types

### Adding New Categories

1. Update `types/content.ts` TopicCategory
2. Add category config in `templates/course-template.ts`
3. Add topics in `scripts/research-topics.ts`

## 📈 Quality Assurance

### Content Validation
- Technical accuracy verification
- Code example testing
- Reading level adjustment
- SEO optimization

### Quality Checks
- Minimum content length
- Required sections
- Code example standards
- Assessment validity

## 💰 Cost Optimization

### Token Management
- Response caching
- Prompt optimization
- Batch processing
- Model selection (GPT-4o vs GPT-4o-mini)

### Caching Strategy
- Research results: 24 hours
- Generated content: 7 days
- Metadata: 30 days

## 🧪 Testing

```bash
npm test
```

## 📝 API Reference

### CourseGenerator

```typescript
const generator = getCourseGenerator({ openaiApiKey: '...' });

const result = await generator.generateCourse(
  'Large Language Models',
  'ai-ml-engineering',
  'intermediate'
);
```

### LessonGenerator

```typescript
const generator = getLessonGenerator({ openaiApiKey: '...' });

const result = await generator.generateLesson(
  'Introduction to Transformers',
  'Large Language Models',
  'ai-ml-engineering',
  'beginner'
);
```

### QuizGenerator

```typescript
const generator = getQuizGenerator({ openaiApiKey: '...' });

const result = await generator.generateAssessment(
  'LLM Fundamentals Quiz',
  'Large Language Models',
  'ai-ml-engineering',
  'quiz',
  'intermediate'
);
```

### CodeExamplesGenerator

```typescript
const generator = getCodeExamplesGenerator({ openaiApiKey: '...' });

const result = await generator.generateExamples(
  'RAG Implementation',
  'python',
  'intermediate',
  { count: 3 }
);
```

### ResearchAgent

```typescript
const agent = getResearchAgent({ openaiApiKey: '...' });

const result = await agent.researchLatestDevelopments(
  'Prompt Engineering',
  'ai-ml-engineering',
  'week'
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI GPT-4o for content generation
- Perplexity API for research capabilities
- Educational design principles from cognitive science

---

## 📰 Pulse News - News Aggregation System

Pulse + AI Professor includes a comprehensive AI news aggregation system called **Pulse News** that automatically collects, summarizes, and categorizes news from 19 trusted sources across the AI industry.

### Features

- **19 Trusted Sources**: Aggregated from leading AI companies, research institutions, and tech publications
- **AI-Powered Summaries**: Get concise, AI-generated summaries of complex AI developments
- **5 News Categories**: News, Launches, Research, Tools, and Announcements
- **Updated Every 6 Hours**: Fresh content delivered automatically
- **RSS Feed**: Subscribe to the latest AI news
- **Social Sharing**: Share articles on Twitter, LinkedIn, and Facebook
- **Search & Filters**: Find relevant news quickly with powerful filtering

### News Sources

#### Company Blogs (7)
- OpenAI Blog
- Anthropic News
- Google AI Blog
- Meta AI
- Microsoft AI Blog
- Stability AI
- Midjourney

#### Tech News (5)
- TechCrunch AI
- The Verge AI
- Ars Technica AI
- VentureBeat AI
- Wired AI

#### Research (3)
- arXiv cs.AI
- Papers With Code
- Hugging Face Blog

#### Products (2)
- Product Hunt AI
- Hacker News

#### Community (2)
- Reddit r/MachineLearning
- Reddit r/artificial

### Usage

#### Manual Scraping

Scrape all sources:
```bash
npm run scrape:news
```

Scrape specific source:
```bash
npm run scrape:news "OpenAI Blog"
```

View scraping statistics:
```bash
npm run scrape:news:stats
```

#### Automated Scraping

Run continuous scraping (every 6 hours):
```bash
npm run news:watch
```

### Environment Variables

Add these to your `.env` file:
```env
NEWS_SCRAPE_INTERVAL_HOURS=6
NEWS_MAX_ITEMS_PER_SOURCE=10
```

### Database Setup

Run the news schema migration:
```bash
psql -d your_database -f supabase/news-schema.sql
```

### API Endpoints

- `GET /api/news` - Get news items with filters and pagination
- `GET /api/news/[id]` - Get single news item
- `POST /api/news/scrape` - Trigger manual scrape (admin only)
- `GET /api/news/scrape` - Get scraping statistics
- `GET /api/news/rss` - RSS feed (50 most recent items)

### Frontend Pages

- `/news` - Full news feed with filters and infinite scroll
- `/news/[id]` - Individual news article page
- `/` - Homepage with latest 6 news items

### Components

```typescript
import { NewsCard, NewsFeed, NewsFilters, NewsSearch } from '@/components/news';

// Display a single news item
<NewsCard item={newsItem} showShareButtons={true} />

// Full news feed with filters
<NewsFeed showFilters={true} infiniteScroll={true} />

// Filter controls
<NewsFilters filters={filters} onFilterChange={handleFilterChange} />

// Search bar
<NewsSearch onSearch={handleSearch} />
```

### Categories

1. **News** - General AI news and updates
2. **Launches** - New product launches, features, or companies
3. **Research** - Research papers, studies, or breakthroughs
4. **Tools** - New AI tools, libraries, or frameworks
5. **Announcements** - Company announcements or official statements

### RSS Feed

Subscribe to the RSS feed at:
```
https://pulseaiprofessor.com/api/news/rss
```

Filter by category:
```
https://pulseaiprofessor.com/api/news/rss?category=research
```

### Technical Details

#### Scraping System
- Uses Cheerio for HTML parsing
- Respects robots.txt and rate limits
- 3-attempt retry logic with exponential backoff
- Error logging to database
- Configurable items per source (default: 10)

#### AI Summarization
- Uses GPT-4o-mini for cost efficiency
- Generates 2-3 sentence summaries (max 200 characters)
- Automatic tag extraction (3-5 tags per item)
- Category classification with AI
- Batch processing with rate limiting

#### Performance
- 1-hour client-side caching
- Lazy-loaded images
- Infinite scroll pagination
- Debounced search (300ms)
- Optimized database indexes

### Architecture

```
lib/news/
├── scraper.ts          # Main scraper orchestration
├── summarizer.ts       # AI summarization logic
├── sources/            # Individual source scrapers
│   ├── openai.ts
│   ├── anthropic.ts
│   ├── techcrunch.ts
│   ├── arxiv.ts
│   └── ... (15 more)
└── index.ts

app/api/news/
├── route.ts            # GET news items
├── [id]/route.ts       # GET single item
├── scrape/route.ts     # POST trigger scrape
└── rss/route.ts        # GET RSS feed

app/news/
├── page.tsx            # News feed page
└── [id]/page.tsx       # Article detail page

components/news/
├── NewsCard.tsx        # News item card
├── NewsFeed.tsx        # News feed with infinite scroll
├── NewsFilters.tsx     # Category/source filters
├── NewsSearch.tsx      # Search bar
└── index.ts
```

### Quality Features

✅ TypeScript strict mode
✅ Proper error handling
✅ Rate limiting respect
✅ Mobile responsive
✅ Dark mode support
✅ SEO optimized
✅ Accessible (ARIA labels)
✅ Fast loading

---

Built with ❤️ for better AI education and news aggregation

**Pulse + AI Professor** - Stay current. Get smarter. One platform.
