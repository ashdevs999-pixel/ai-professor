/**
 * AI Types - AI-related type definitions for CXO Academy Platform
 * 
 * These types define interfaces for AI model interactions,
 * prompt engineering, and token management.
 */

import type { 
  SkillLevel, 
  TopicCategory, 
  GenerationRequest,
  GenerationResult,
  ProgrammingLanguage
} from './content';

// ============================================
// AI Provider Types
// ============================================

export type AIProvider = 'openai' | 'perplexity' | 'anthropic';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl?: string;
  maxRetries: number;
  timeout: number;
  defaultTemperature: number;
  defaultMaxTokens: number;
}

export interface OpenAIConfig extends AIConfig {
  provider: 'openai';
  model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
}

export interface PerplexityConfig extends AIConfig {
  provider: 'perplexity';
  model: 'llama-3.1-sonar-large-128k-online' | 'llama-3.1-sonar-small-128k-online';
}

// ============================================
// Prompt Types
// ============================================

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  examples?: PromptExample[];
  metadata: PromptMetadata;
}

export type PromptCategory = 
  | 'lesson-generation'
  | 'quiz-generation'
  | 'code-generation'
  | 'research'
  | 'content-update'
  | 'summarization'
  | 'personalization';

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'object' | 'boolean';
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

export interface PromptExample {
  input: Record<string, unknown>;
  output: string;
  explanation?: string;
}

export interface PromptMetadata {
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  performance: PromptPerformance;
  tags: string[];
}

export interface PromptPerformance {
  averageTokens: number;
  averageLatency: number;
  successRate: number;
  qualityScore: number;
  sampleSize: number;
}

// ============================================
// API Request/Response Types
// ============================================

export interface AIRequest {
  provider: AIProvider;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
  metadata?: RequestMetadata;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface RequestMetadata {
  requestId: string;
  promptTemplateId?: string;
  cacheKey?: string;
  priority: 'high' | 'normal' | 'low';
  timeout: number;
}

export interface AIResponse {
  id: string;
  provider: AIProvider;
  model: string;
  content: string;
  usage: TokenUsage;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  latency: number;
  cached: boolean;
  createdAt: Date;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface StreamingResponse {
  id: string;
  delta: string;
  done: boolean;
  usage?: TokenUsage;
}

// ============================================
// Cost Management Types
// ============================================

export interface CostConfig {
  openai: OpenAIPricing;
  perplexity: PerplexityPricing;
  budget: BudgetConfig;
}

export interface OpenAIPricing {
  gpt4o: ModelPricing;
  gpt4oMini: ModelPricing;
  gpt4Turbo: ModelPricing;
  gpt35Turbo: ModelPricing;
}

export interface ModelPricing {
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export interface PerplexityPricing {
  sonarLarge: ModelPricing;
  sonarSmall: ModelPricing;
}

export interface BudgetConfig {
  dailyLimit: number;
  monthlyLimit: number;
  alertThreshold: number;
}

export interface CostTracker {
  date: Date;
  provider: AIProvider;
  model: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

// ============================================
// Content Quality Types
// ============================================

export interface QualityCheck {
  id: string;
  contentId: string;
  contentType: string;
  checks: QualityCheckResult[];
  overallScore: number;
  passed: boolean;
  checkedAt: Date;
  recommendations: string[];
}

export interface QualityCheckResult {
  type: QualityCheckType;
  score: number;
  passed: boolean;
  details: string;
  issues: QualityIssue[];
}

export type QualityCheckType = 
  | 'technical-accuracy'
  | 'readability'
  | 'code-quality'
  | 'seo-optimization'
  | 'accessibility'
  | 'completeness'
  | 'relevance';

export interface QualityIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  location?: string;
  suggestion?: string;
}

// ============================================
// Research Agent Types
// ============================================

export interface ResearchRequest {
  topic: string;
  category: TopicCategory;
  depth: 'shallow' | 'medium' | 'deep';
  sources: ResearchSourceType[];
  timeframe: 'day' | 'week' | 'month' | 'year' | 'all';
  maxResults: number;
  focusAreas?: string[];
}

export type ResearchSourceType = 
  | 'arxiv'
  | 'github'
  | 'news'
  | 'documentation'
  | 'blogs'
  | 'twitter'
  | 'reddit'
  | 'hackernews';

export interface ResearchResult {
  id: string;
  request: ResearchRequest;
  sources: ResearchedSource[];
  summary: string;
  keyInsights: string[];
  trends: Trend[];
  recommendations: string[];
  generatedAt: Date;
  tokensUsed: number;
}

export interface ResearchedSource {
  id: string;
  title: string;
  url: string;
  source: ResearchSourceType;
  author?: string;
  publishedAt?: Date;
  summary: string;
  relevance: number;
  credibility: number;
  quotes: string[];
}

export interface Trend {
  topic: string;
  momentum: 'rising' | 'stable' | 'declining';
  relevance: number;
  description: string;
}

// ============================================
// Personalization Types
// ============================================

export interface PersonalizationContext {
  userId: string;
  skillLevel: SkillLevel;
  learningStyle: LearningStyle;
  interests: string[];
  goals: string[];
  history: LearningHistory;
  preferences: UserPreferences;
}

export type LearningStyle = 
  | 'visual'
  | 'auditory'
  | 'reading'
  | 'kinesthetic'
  | 'mixed';

export interface LearningHistory {
  completedCourses: string[];
  completedLessons: string[];
  assessmentScores: Map<string, number>;
  timeSpentPerTopic: Map<TopicCategory, number>;
  strugglingAreas: string[];
  strongAreas: string[];
}

export interface UserPreferences {
  preferredLanguage: ProgrammingLanguage[];
  contentLength: 'concise' | 'standard' | 'detailed';
  codeExampleDensity: 'minimal' | 'moderate' | 'extensive';
  difficulty: 'easier' | 'standard' | 'challenging';
  pace: 'slow' | 'normal' | 'fast';
}

export interface PersonalizedContent {
  originalContentId: string;
  adaptations: ContentAdaptation[];
  generatedAt: Date;
}

export interface ContentAdaptation {
  type: AdaptationType;
  original: string;
  adapted: string;
  reason: string;
}

export type AdaptationType = 
  | 'difficulty'
  | 'length'
  | 'examples'
  | 'explanations'
  | 'language';

// ============================================
// Error Types
// ============================================

export interface AIError {
  code: AIErrorCode;
  message: string;
  provider: AIProvider;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export type AIErrorCode = 
  | 'RATE_LIMIT'
  | 'TOKEN_LIMIT'
  | 'CONTENT_FILTER'
  | 'INVALID_REQUEST'
  | 'AUTHENTICATION_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'BUDGET_EXCEEDED'
  | 'CACHE_ERROR'
  | 'QUALITY_CHECK_FAILED';

// ============================================
// Analytics Types
// ============================================

export interface GenerationAnalytics {
  date: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  totalTokens: number;
  totalCost: number;
  cacheHitRate: number;
  byProvider: Map<AIProvider, ProviderStats>;
  byCategory: Map<PromptCategory, CategoryStats>;
}

export interface ProviderStats {
  requests: number;
  tokens: number;
  cost: number;
  averageLatency: number;
  errorRate: number;
}

export interface CategoryStats {
  requests: number;
  averageQuality: number;
  averageTokens: number;
}

// ============================================
// Export convenience types
// ============================================

export type GenerationRequestWithAI = GenerationRequest & {
  aiConfig?: Partial<AIConfig>;
  cacheConfig?: CacheConfig;
  qualityCheck?: boolean;
};

export interface CacheConfig {
  enabled: boolean;
  ttlSeconds: number;
  tags?: string[];
}

export type GenerationResultWithAI<T> = GenerationResult<T> & {
  aiResponse?: AIResponse;
  qualityCheck?: QualityCheck;
};
