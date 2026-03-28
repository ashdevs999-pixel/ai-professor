/**
 * Research Agent - Automated research for latest developments
 * 
 * Uses Perplexity API and web scraping to gather latest information
 * for keeping course content up-to-date.
 */

import type {
  TopicCategory,
  ResearchTopic,
  ResearchSource,
  ResearchRequest,
  ResearchResult,
  ResearchedSource,
  Trend
} from '../../types/content';

import type {
  AIProvider,
  AIRequest,
  AIResponse,
  ResearchSourceType
} from '../../types/ai';

// ============================================
// Research Agent Configuration
// ============================================

export interface ResearchAgentConfig {
  perplexityApiKey?: string;
  openaiApiKey?: string;
  cacheResults: boolean;
  cacheTTL: number; // seconds
  maxConcurrentRequests: number;
  requestTimeout: number;
}

const defaultConfig: ResearchAgentConfig = {
  cacheResults: true,
  cacheTTL: 86400, // 24 hours
  maxConcurrentRequests: 5,
  requestTimeout: 30000
};

// ============================================
// Research Prompts
// ============================================

const researchPrompts = {
  systemPrompt: `You are an expert technology researcher specializing in tracking the latest developments in rapidly evolving tech fields. Your role is to:

1. Identify significant recent developments
2. Separate signal from noise
3. Assess credibility and impact
4. Summarize complex topics clearly
5. Highlight actionable insights

Research Focus Areas:
- AI/ML Engineering: New models, frameworks, techniques, research papers
- Web Development: Framework updates, standards, best practices
- Cloud Computing: New services, pricing, architecture patterns
- Cybersecurity: Vulnerabilities, tools, threat landscape
- DevOps/SRE: Tools, practices, platform updates

Provide factual, well-sourced information with clear relevance indicators.`,

  latestDevelopmentsPrompt: `Research the latest developments in {{topic}} over the past {{timeframe}}.

**Category:** {{category}}
**Focus Areas:** {{focusAreas}}
**Depth:** {{depth}}

Provide:
1. **Major Announcements** (2-3 most significant)
   - What was announced/released
   - When and by whom
   - Why it matters

2. **Key Updates** (3-5 important changes)
   - Version updates
   - Deprecations
   - New features

3. **Emerging Trends** (2-3 trends)
   - What's gaining traction
   - Industry adoption
   - Future implications

4. **Notable Content** (3-5 resources)
   - Papers, articles, tutorials
   - Why they're valuable

5. **Impact Assessment**
   - Who should care
   - What actions to take
   - Learning recommendations

Format as structured JSON.`,

  topicDeepDivePrompt: `Conduct a deep research dive on: {{topic}}

**Context:** {{context}}
**Questions to Answer:** {{questions}}
**Sources to Prioritize:** {{sources}}

Provide comprehensive research covering:

1. **Current State**
   - Where the technology/practice stands today
   - Key players and ecosystem
   - Adoption levels

2. **Recent Evolution**
   - How it has changed in the last 6-12 months
   - Major milestones
   - Turning points

3. **Technical Details**
   - Core concepts explained
   - How it works
   - Best practices

4. **Practical Applications**
   - Real-world use cases
   - Success stories
   - Common pitfalls

5. **Future Outlook**
   - Where it's heading
   - Upcoming developments
   - Long-term predictions

6. **Learning Path**
   - Prerequisites
   - Recommended resources
   - Skills to develop

Format as comprehensive JSON.`,

  contentFreshnessPrompt: `Analyze whether the following content is still accurate and relevant:

**Topic:** {{topic}}
**Category:** {{category}}
**Current Content:** {{currentContent}}
**Content Age:** {{contentAge}}

Provide:

1. **Freshness Score** (0-100)
   - How current is the information
   - What's outdated

2. **Outdated Elements**
   - Specific sections needing update
   - What has changed
   - Severity of outdatedness

3. **Missing Information**
   - New developments to add
   - Recently important concepts
   - Updated best practices

4. **Update Recommendations**
   - Priority level
   - Specific changes needed
   - Resources for updates

5. **Still Relevant Elements**
   - What remains accurate
   - Timeless concepts
   - No changes needed

Format as JSON with actionable recommendations.`
};

// ============================================
// Research Agent Class
// ============================================

export class ResearchAgent {
  private config: ResearchAgentConfig;
  private cache: Map<string, { data: ResearchResult; timestamp: number }>;

  constructor(config: Partial<ResearchAgentConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.cache = new Map();
  }

  /**
   * Research latest developments in a topic
   */
  async researchLatestDevelopments(
    topic: string,
    category: TopicCategory,
    timeframe: 'day' | 'week' | 'month' = 'week',
    depth: 'shallow' | 'medium' | 'deep' = 'medium'
  ): Promise<ResearchResult> {
    const cacheKey = `latest_${topic}_${category}_${timeframe}_${depth}`;
    
    // Check cache
    if (this.config.cacheResults) {
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Use Perplexity for real-time research
    const result = await this.queryPerplexity({
      topic,
      category,
      timeframe,
      depth,
      type: 'latest'
    });

    // Cache result
    if (this.config.cacheResults) {
      this.cacheResult(cacheKey, result);
    }

    return result;
  }

  /**
   * Deep dive research on a specific topic
   */
  async deepDive(
    topic: string,
    category: TopicCategory,
    questions: string[] = [],
    sources: ResearchSourceType[] = ['documentation', 'article', 'paper']
  ): Promise<ResearchResult> {
    const cacheKey = `deep_${topic}_${category}_${questions.join('_')}`;
    
    if (this.config.cacheResults) {
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.queryPerplexity({
      topic,
      category,
      questions,
      sources,
      type: 'deep-dive'
    });

    if (this.config.cacheResults) {
      this.cacheResult(cacheKey, result);
    }

    return result;
  }

  /**
   * Check if content needs updating
   */
  async checkContentFreshness(
    topic: string,
    category: TopicCategory,
    currentContent: string,
    contentAge: number // days
  ): Promise<{
    freshnessScore: number;
    needsUpdate: boolean;
    outdatedElements: string[];
    missingInformation: string[];
    recommendations: string[];
  }> {
    // Use GPT-4o for content analysis
    const analysis = await this.queryOpenAI({
      systemPrompt: researchPrompts.systemPrompt,
      userPrompt: researchPrompts.contentFreshnessPrompt
        .replace('{{topic}}', topic)
        .replace('{{category}}', category)
        .replace('{{currentContent}}', currentContent.substring(0, 2000))
        .replace('{{contentAge}}', `${contentAge} days`)
    });

    return this.parseFreshnessAnalysis(analysis.content);
  }

  /**
   * Research multiple topics in parallel
   */
  async researchMultipleTopics(
    topics: Array<{ topic: string; category: TopicCategory }>
  ): Promise<Map<string, ResearchResult>> {
    const results = new Map<string, ResearchResult>();
    
    // Process in batches to respect rate limits
    const batchSize = this.config.maxConcurrentRequests;
    
    for (let i = 0; i < topics.length; i += batchSize) {
      const batch = topics.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(({ topic, category }) => 
          this.researchLatestDevelopments(topic, category)
        )
      );
      
      batch.forEach((item, index) => {
        results.set(item.topic, batchResults[index]);
      });
    }

    return results;
  }

  /**
   * Identify trending topics in a category
   */
  async identifyTrends(category: TopicCategory): Promise<Trend[]> {
    const result = await this.researchLatestDevelopments(
      `${category} trends and emerging topics`,
      category,
      'month',
      'shallow'
    );

    return this.extractTrends(result);
  }

  /**
   * Get recommended sources for a topic
   */
  async getRecommendedSources(
    topic: string,
    category: TopicCategory
  ): Promise<ResearchSource[]> {
    const result = await this.deepDive(topic, category);
    return result.sources;
  }

  // ============================================
  // Private Methods
  // ============================================

  private async queryPerplexity(params: {
    topic: string;
    category: TopicCategory;
    type: 'latest' | 'deep-dive';
    [key: string]: unknown;
  }): Promise<ResearchResult> {
    if (!this.config.perplexityApiKey) {
      throw new Error('Perplexity API key required for research');
    }

    const prompt = params.type === 'latest'
      ? researchPrompts.latestDevelopmentsPrompt
      : researchPrompts.topicDeepDivePrompt;

    const formattedPrompt = this.formatPrompt(prompt, params);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.perplexityApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: researchPrompts.systemPrompt },
          { role: 'user', content: formattedPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return this.parseResearchResult(params.topic, params.category, data);
  }

  private async queryOpenAI(params: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<AIResponse> {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      provider: 'openai',
      model: 'gpt-4o',
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost: this.calculateCost(data.usage)
      },
      finishReason: data.choices[0].finish_reason,
      latency: 0,
      cached: false,
      createdAt: new Date()
    };
  }

  private formatPrompt(template: string, params: Record<string, unknown>): string {
    let prompt = template;
    for (const [key, value] of Object.entries(params)) {
      prompt = prompt.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    }
    return prompt;
  }

  private parseResearchResult(
    topic: string,
    category: TopicCategory,
    data: { choices: Array<{ message: { content: string } }> }
  ): ResearchResult {
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured extraction
    let parsed;
    try {
      // Extract JSON from response if wrapped in markdown
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonContent);
    } catch {
      parsed = this.extractStructuredData(content);
    }

    return {
      id: `research_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      request: {
        topic,
        category,
        depth: 'medium',
        sources: ['documentation', 'article', 'news'],
        timeframe: 'week',
        maxResults: 10
      },
      sources: parsed.sources || [],
      summary: parsed.summary || content.substring(0, 500),
      keyInsights: parsed.keyInsights || parsed.keyFindings || [],
      trends: parsed.trends || [],
      recommendations: parsed.recommendations || [],
      generatedAt: new Date(),
      tokensUsed: 0 // Would be extracted from API response
    };
  }

  private extractStructuredData(content: string): Record<string, unknown> {
    // Simple extraction logic for non-JSON responses
    const sections = content.split(/\n##\s+/);
    const data: Record<string, unknown> = {
      summary: sections[0]?.substring(0, 500) || ''
    };

    for (const section of sections.slice(1)) {
      const lines = section.split('\n');
      const title = lines[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      data[title] = lines.slice(1).filter(l => l.trim());
    }

    return data;
  }

  private parseFreshnessAnalysis(content: string): {
    freshnessScore: number;
    needsUpdate: boolean;
    outdatedElements: string[];
    missingInformation: string[];
    recommendations: string[];
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      
      return {
        freshnessScore: parsed.freshnessScore || 50,
        needsUpdate: (parsed.freshnessScore || 50) < 70,
        outdatedElements: parsed.outdatedElements || [],
        missingInformation: parsed.missingInformation || [],
        recommendations: parsed.recommendations || []
      };
    } catch {
      // Default values if parsing fails
      return {
        freshnessScore: 50,
        needsUpdate: true,
        outdatedElements: [],
        missingInformation: [],
        recommendations: ['Review content for accuracy']
      };
    }
  }

  private extractTrends(result: ResearchResult): Trend[] {
    return result.trends || [];
  }

  private getCachedResult(key: string): ResearchResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = (Date.now() - cached.timestamp) / 1000;
    if (age > this.config.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private cacheResult(key: string, result: ResearchResult): void {
    this.cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
  }

  private calculateCost(usage: { prompt_tokens: number; completion_tokens: number }): number {
    // GPT-4o pricing (as of 2024)
    const inputCostPer1k = 0.005;
    const outputCostPer1k = 0.015;
    
    return (
      (usage.prompt_tokens / 1000) * inputCostPer1k +
      (usage.completion_tokens / 1000) * outputCostPer1k
    );
  }
}

// ============================================
// Topic Monitoring Service
// ============================================

export class TopicMonitor {
  private agent: ResearchAgent;
  private monitoredTopics: Map<string, ResearchTopic>;

  constructor(config: Partial<ResearchAgentConfig> = {}) {
    this.agent = new ResearchAgent(config);
    this.monitoredTopics = new Map();
  }

  /**
   * Add a topic to monitor
   */
  addTopic(topic: ResearchTopic): void {
    this.monitoredTopics.set(topic.id, topic);
  }

  /**
   * Check all monitored topics for updates
   */
  async checkForUpdates(): Promise<Map<string, {
    hasUpdates: boolean;
    updates: string[];
    relevanceScore: number;
  }>> {
    const results = new Map();

    for (const [id, topic] of this.monitoredTopics) {
      const research = await this.agent.researchLatestDevelopments(
        topic.topic,
        topic.category
      );

      const hasUpdates = research.keyInsights.length > 0;
      
      results.set(id, {
        hasUpdates,
        updates: research.keyInsights,
        relevanceScore: research.recommendations ? 1 : 0
      });

      // Update last researched time
      topic.lastResearched = new Date();
      topic.needsUpdate = false;
    }

    return results;
  }

  /**
   * Get topics that need research
   */
  getTopicsNeedingResearch(): ResearchTopic[] {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Array.from(this.monitoredTopics.values()).filter(
      topic => topic.needsUpdate || topic.lastResearched < oneWeekAgo
    );
  }
}

// ============================================
// Export Singleton Instance
// ============================================

let defaultResearchAgent: ResearchAgent | null = null;

export function getResearchAgent(config?: Partial<ResearchAgentConfig>): ResearchAgent {
  if (!defaultResearchAgent) {
    defaultResearchAgent = new ResearchAgent(config);
  }
  return defaultResearchAgent;
}

export default ResearchAgent;
