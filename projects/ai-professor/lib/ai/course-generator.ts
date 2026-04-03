/**
 * Course Generator - Main course generation logic
 * 
 * Orchestrates the creation of complete courses including
 * modules, lessons, and assessments.
 */

import type {
  Course,
  CourseMetadata,
  Module,
  Lesson,
  Assessment,
  TopicCategory,
  SkillLevel,
  GenerationRequest,
  GenerationResult,
  ContentUpdate
} from '../../types/content';

import type {
  AIProvider,
  AIRequest,
  AIResponse,
  TokenUsage,
  CacheConfig
} from '../../types/ai';

import { coursePrompts, courseTemplate, categoryTemplates } from './templates/course-template';
import { ResearchAgent, getResearchAgent } from './research-agent';

// ============================================
// Course Generator Configuration
// ============================================

export interface CourseGeneratorConfig {
  openaiApiKey: string;
  perplexityApiKey?: string;
  defaultModel: 'gpt-4o' | 'gpt-4o-mini';
  cacheEnabled: boolean;
  cacheTTL: number;
  maxRetries: number;
  qualityCheck: boolean;
}

const defaultConfig: Partial<CourseGeneratorConfig> = {
  defaultModel: 'gpt-4o',
  cacheEnabled: true,
  cacheTTL: 604800, // 7 days
  maxRetries: 3,
  qualityCheck: true
};

// ============================================
// Course Generator Class
// ============================================

export class CourseGenerator {
  private config: CourseGeneratorConfig;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private researchAgent: ResearchAgent;
  private tokenUsage: TokenUsage[];

  constructor(config: Partial<CourseGeneratorConfig> & { openaiApiKey: string }) {
    this.config = { ...defaultConfig, ...config } as CourseGeneratorConfig;
    this.cache = new Map();
    this.researchAgent = getResearchAgent({ 
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey 
    });
    this.tokenUsage = [];
  }

  /**
   * Generate a complete course from a topic
   */
  async generateCourse(
    topic: string,
    category: TopicCategory,
    skillLevel: SkillLevel,
    options: {
      prerequisites?: string[];
      estimatedHours?: number;
      includeCapstone?: boolean;
    } = {}
  ): Promise<GenerationResult<Course>> {
    try {
      // Step 1: Research the topic for latest developments
      const research = await this.researchAgent.researchLatestDevelopments(
        topic,
        category,
        'month',
        'medium'
      );

      // Step 2: Generate course outline
      const outline = await this.generateCourseOutline(
        topic,
        category,
        skillLevel,
        research.keyInsights,
        options
      );

      // Step 3: Create course metadata
      const metadata = await this.generateCourseMetadata(outline, category, skillLevel);

      // Step 4: Generate modules
      const modules = await this.generateModules(outline, skillLevel);

      // Step 5: Create course-level assessments
      const assessments = await this.generateCourseAssessments(outline, skillLevel);

      // Step 6: Compile final course
      const course: Course = {
        metadata: {
          ...metadata,
          id: this.generateId('course'),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'draft',
          version: '1.0.0'
        },
        modules,
        assessments,
        resources: this.extractResources(research)
      };

      // Step 7: Quality check if enabled
      if (this.config.qualityCheck) {
        const qualityResult = await this.performQualityCheck(course);
        if (!qualityResult.passed) {
          console.warn('Quality check warnings:', qualityResult.issues);
        }
      }

      return {
        success: true,
        content: course,
        tokensUsed: this.calculateTotalTokens(),
        cached: false,
        generatedAt: new Date()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tokensUsed: this.calculateTotalTokens(),
        cached: false,
        generatedAt: new Date()
      };
    }
  }

  /**
   * Generate course outline
   */
  private async generateCourseOutline(
    topic: string,
    category: TopicCategory,
    skillLevel: SkillLevel,
    latestInsights: string[],
    options: {
      prerequisites?: string[];
      estimatedHours?: number;
      includeCapstone?: boolean;
    }
  ): Promise<CourseOutline> {
    const moduleCount = this.getModuleCount(skillLevel);
    const categoryTemplate = categoryTemplates[category];

    const prompt = coursePrompts.outlinePrompt
      .replace('{{topic}}', topic)
      .replace('{{category}}', this.formatCategory(category))
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{estimatedHours}}', String(options.estimatedHours || 40))
      .replace('{{prerequisites}}', options.prerequisites?.join(', ') || categoryTemplate.commonPrerequisites.join(', '))
      .replace('{{moduleCount}}', String(moduleCount));

    const response = await this.callOpenAI({
      systemPrompt: coursePrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseOutline(response.content);
  }

  /**
   * Generate course metadata
   */
  private async generateCourseMetadata(
    outline: CourseOutline,
    category: TopicCategory,
    skillLevel: SkillLevel
  ): Promise<CourseMetadata> {
    const prompt = coursePrompts.metadataPrompt
      .replace('{{courseTitle}}', outline.title)
      .replace('{{courseDescription}}', outline.description)
      .replace('{{category}}', this.formatCategory(category))
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{keyTopics}}', outline.modules.map(m => m.title).join(', '));

    const response = await this.callOpenAI({
      systemPrompt: coursePrompts.systemPrompt,
      userPrompt: prompt
    });

    const metadata = this.parseMetadata(response.content);
    
    return {
      ...metadata,
      id: metadata.id || '',
      title: metadata.title || 'Untitled Course',
      description: metadata.description || '',
      slug: metadata.slug || '',
      tags: metadata.tags || [],
      prerequisites: metadata.prerequisites || [],
      learningObjectives: metadata.learningObjectives || [],
      estimatedHours: metadata.estimatedHours || 10,
      category,
      skillLevel,
      author: 'CXO Academy',
      createdAt: metadata.createdAt || new Date(),
      updatedAt: metadata.updatedAt || new Date(),
      status: metadata.status || 'draft',
      version: metadata.version || '1.0.0',
      seoMetadata: {
        title: metadata.title || '',
        description: metadata.description || '',
        keywords: metadata.tags || []
      }
    };
  }

  /**
   * Generate all modules for a course
   */
  private async generateModules(
    outline: CourseOutline,
    skillLevel: SkillLevel
  ): Promise<Module[]> {
    const modules: Module[] = [];

    for (let i = 0; i < outline.modules.length; i++) {
      const moduleOutline = outline.modules[i];
      
      const prompt = coursePrompts.modulePrompt
        .replace('{{moduleNumber}}', String(i + 1))
        .replace('{{courseTitle}}', outline.title)
        .replace('{{moduleTitle}}', moduleOutline.title)
        .replace('{{moduleDescription}}', moduleOutline.description)
        .replace('{{skillLevel}}', skillLevel)
        .replace('{{previousModules}}', modules.map(m => m.title).join(', ') || 'None')
        .replace('{{keyConcepts}}', moduleOutline.keyConcepts?.join(', ') || '');

      const response = await this.callOpenAI({
        systemPrompt: coursePrompts.systemPrompt,
        userPrompt: prompt
      });

      const module = this.parseModule(response.content, i + 1);
      modules.push(module);
    }

    return modules;
  }

  /**
   * Generate course assessments
   */
  private async generateCourseAssessments(
    outline: CourseOutline,
    skillLevel: SkillLevel
  ): Promise<Assessment[]> {
    const assessments: Assessment[] = [];

    // Generate a final exam
    const finalExam = await this.generateAssessment(
      outline.title + ' - Final Exam',
      'exam',
      skillLevel,
      outline.modules.flatMap(m => m.keyConcepts || [])
    );
    assessments.push(finalExam);

    return assessments;
  }

  /**
   * Generate a single assessment
   */
  private async generateAssessment(
    title: string,
    type: 'quiz' | 'exam',
    skillLevel: SkillLevel,
    concepts: string[]
  ): Promise<Assessment> {
    const questionCount = type === 'exam' ? 40 : 15;

    const response = await this.callOpenAI({
      systemPrompt: coursePrompts.systemPrompt,
      userPrompt: `Generate a ${type} for the course "${title}" covering: ${concepts.join(', ')}.
      
Skill level: ${skillLevel}
Question count: ${questionCount}

Create questions testing:
- Conceptual understanding (40%)
- Practical application (40%)
- Problem-solving (20%)

Format as JSON with questions array.`
    });

    return this.parseAssessment(response.content, title, type, skillLevel);
  }

  /**
   * Update existing course with new content
   */
  async updateCourse(
    courseId: string,
    updates: ContentUpdate[]
  ): Promise<GenerationResult<Course>> {
    // Implementation for updating existing courses
    // This would fetch the course and apply updates
    
    return {
      success: false,
      error: 'Not implemented',
      tokensUsed: 0,
      cached: false,
      generatedAt: new Date()
    };
  }

  // ============================================
  // OpenAI API Methods
  // ============================================

  private async callOpenAI(params: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    const cacheKey = this.generateCacheKey(params.userPrompt);
    
    // Check cache
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          ...cached as AIResponse,
          cached: true
        };
      }
    }

    const startTime = Date.now();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.defaultModel,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt }
        ],
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    const aiResponse: AIResponse = {
      id: data.id,
      provider: 'openai',
      model: this.config.defaultModel,
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost: this.calculateCost(data.usage)
      },
      finishReason: data.choices[0].finish_reason,
      latency,
      cached: false,
      createdAt: new Date()
    };

    // Track token usage
    this.tokenUsage.push(aiResponse.usage);

    // Cache result
    if (this.config.cacheEnabled) {
      this.saveToCache(cacheKey, aiResponse);
    }

    return aiResponse;
  }

  // ============================================
  // Helper Methods
  // ============================================

  private getModuleCount(skillLevel: SkillLevel): number {
    const counts = {
      beginner: 6,
      intermediate: 8,
      advanced: 10,
      expert: 12
    };
    return counts[skillLevel];
  }

  private formatCategory(category: TopicCategory): string {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private parseOutline(content: string): CourseOutline {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonContent);
    } catch {
      // Return basic outline if parsing fails
      return {
        title: 'Course',
        description: content.substring(0, 200),
        learningObjectives: [],
        modules: []
      };
    }
  }

  private parseMetadata(content: string): Partial<CourseMetadata> {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonContent);
    } catch {
      return {
        title: 'Course',
        description: '',
        tags: [],
        learningObjectives: []
      };
    }
  }

  private parseModule(content: string, order: number): Module {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      
      return {
        id: this.generateId('module'),
        courseId: '',
        order,
        title: parsed.title || `Module ${order}`,
        description: parsed.description || '',
        lessons: (parsed.lessons || []).map((l: Lesson, i: number) => ({
          ...l,
          id: this.generateId('lesson'),
          order: i + 1
        })),
        duration: parsed.duration || 60
      };
    } catch {
      return {
        id: this.generateId('module'),
        courseId: '',
        order,
        title: `Module ${order}`,
        description: '',
        lessons: [],
        duration: 60
      };
    }
  }

  private parseAssessment(
    content: string,
    title: string,
    type: 'quiz' | 'exam',
    skillLevel: SkillLevel
  ): Assessment {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      
      return {
        id: this.generateId('assessment'),
        title,
        description: parsed.description || '',
        type,
        difficulty: skillLevel,
        questions: (parsed.questions || []).map((q: Question) => ({
          ...q,
          id: this.generateId('q')
        })),
        passingScore: 70,
        timeLimit: type === 'exam' ? 90 : 30,
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch {
      return {
        id: this.generateId('assessment'),
        title,
        description: '',
        type,
        difficulty: skillLevel,
        questions: [],
        passingScore: 70,
        timeLimit: type === 'exam' ? 90 : 30,
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }

  private extractResources(research: { sources: ResearchSource[] }): Resource[] {
    return research.sources.map(source => ({
      id: this.generateId('resource'),
      title: source.title,
      description: source.summary,
      type: this.mapResourceType(source.type),
      url: source.url,
      author: source.author,
      publishedAt: source.publishedAt,
      tags: []
    }));
  }

  private mapResourceType(type: string): ResourceType {
    const typeMap: Record<string, ResourceType> = {
      paper: 'paper',
      article: 'article',
      documentation: 'documentation',
      video: 'video',
      tool: 'tool',
      repository: 'repository'
    };
    return typeMap[type] || 'article';
  }

  private async performQualityCheck(course: Course): Promise<{
    passed: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check course structure
    if (course.modules.length < 3) {
      issues.push('Course has fewer than 3 modules');
    }

    // Check learning objectives
    if (course.metadata.learningObjectives.length < 3) {
      issues.push('Fewer than 3 learning objectives defined');
    }

    // Check module content
    for (const module of course.modules) {
      if (module.lessons.length < 2) {
        issues.push(`Module "${module.title}" has fewer than 2 lessons`);
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateCacheKey(content: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `cache_${hash}`;
  }

  private getFromCache(key: string): AIResponse | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = (Date.now() - cached.timestamp) / 1000;
    if (age > this.config.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as AIResponse;
  }

  private saveToCache(key: string, data: AIResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private calculateCost(usage: { prompt_tokens: number; completion_tokens: number }): number {
    const pricing = this.config.defaultModel === 'gpt-4o' 
      ? { input: 0.005, output: 0.015 }
      : { input: 0.00015, output: 0.0006 };

    return (
      (usage.prompt_tokens / 1000) * pricing.input +
      (usage.completion_tokens / 1000) * pricing.output
    );
  }

  private calculateTotalTokens(): number {
    return this.tokenUsage.reduce((sum, usage) => sum + usage.totalTokens, 0);
  }

  /**
   * Get total cost of all API calls
   */
  getTotalCost(): number {
    return this.tokenUsage.reduce((sum, usage) => sum + usage.cost, 0);
  }

  /**
   * Clear token usage history
   */
  clearUsageHistory(): void {
    this.tokenUsage = [];
  }
}

// ============================================
// Type Definitions
// ============================================

interface CourseOutline {
  title: string;
  description: string;
  targetAudience?: string;
  learningObjectives: string[];
  prerequisites?: string[];
  modules: Array<{
    order: number;
    title: string;
    description: string;
    duration: number;
    lessons: Array<{
      order: number;
      title: string;
      duration: number;
    }>;
    keyConcepts?: string[];
  }>;
  assessments?: Array<{
    type: string;
    module: number;
    description: string;
  }>;
}

interface Question {
  id: string;
  type: string;
  question: string;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  author?: string;
  publishedAt?: Date;
  tags: string[];
}

type ResourceType = 'article' | 'video' | 'documentation' | 'book' | 'tool' | 'repository' | 'paper' | 'cheatsheet';

interface ResearchSource {
  title: string;
  url: string;
  type: string;
  summary: string;
  author?: string;
  publishedAt?: Date;
}

// ============================================
// Export Singleton Factory
// ============================================

let defaultCourseGenerator: CourseGenerator | null = null;

export function getCourseGenerator(config?: Partial<CourseGeneratorConfig> & { openaiApiKey: string }): CourseGenerator {
  if (!defaultCourseGenerator && config) {
    defaultCourseGenerator = new CourseGenerator(config);
  }
  if (!defaultCourseGenerator) {
    throw new Error('Course generator not initialized. Provide config.');
  }
  return defaultCourseGenerator;
}

export default CourseGenerator;
