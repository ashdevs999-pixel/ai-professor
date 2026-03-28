/**
 * Lesson Generator - Generates individual lessons with content
 * 
 * Creates comprehensive lesson content including explanations,
 * code examples, and exercises.
 */

import type {
  Lesson,
  LessonContent,
  ContentSection,
  CodeExample,
  Exercise,
  SkillLevel,
  TopicCategory,
  ProgrammingLanguage,
  GenerationResult
} from '../../types/content';

import type { AIResponse, PersonalizationContext } from '../../types/ai';

import { 
  lessonPrompts, 
  lessonTemplate, 
  skillLevelGuidance,
  getLessonDuration,
  getCodeExampleCount,
  getExerciseCount,
  createContentSection,
  createCodeBlock
} from './templates/lesson-template';

import { CourseGenerator } from './course-generator';

// ============================================
// Lesson Generator Configuration
// ============================================

export interface LessonGeneratorConfig {
  openaiApiKey: string;
  defaultModel: 'gpt-4o' | 'gpt-4o-mini';
  cacheEnabled: boolean;
  cacheTTL: number;
  includeCodeExamples: boolean;
  includeExercises: boolean;
  personalizationEnabled: boolean;
}

const defaultConfig: Partial<LessonGeneratorConfig> = {
  defaultModel: 'gpt-4o',
  cacheEnabled: true,
  cacheTTL: 604800,
  includeCodeExamples: true,
  includeExercises: true,
  personalizationEnabled: true
};

// ============================================
// Lesson Generator Class
// ============================================

export class LessonGenerator {
  private config: LessonGeneratorConfig;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private tokenUsage: number;

  constructor(config: Partial<LessonGeneratorConfig> & { openaiApiKey: string }) {
    this.config = { ...defaultConfig, ...config } as LessonGeneratorConfig;
    this.cache = new Map();
    this.tokenUsage = 0;
  }

  /**
   * Generate a complete lesson
   */
  async generateLesson(
    title: string,
    topic: string,
    category: TopicCategory,
    skillLevel: SkillLevel,
    options: {
      moduleId?: string;
      prerequisites?: string[];
      learningObjectives?: string[];
      previousLessons?: string[];
      language?: ProgrammingLanguage;
      context?: string;
    } = {}
  ): Promise<GenerationResult<Lesson>> {
    try {
      const duration = getLessonDuration(skillLevel);
      
      // Step 1: Generate main lesson content
      const content = await this.generateLessonContent(
        title,
        topic,
        skillLevel,
        options
      );

      // Step 2: Generate code examples
      const codeExamples = this.config.includeCodeExamples
        ? await this.generateCodeExamples(
            title,
            topic,
            skillLevel,
            options.language || 'python'
          )
        : [];

      // Step 3: Generate exercises
      const exercises = this.config.includeExercises
        ? await this.generateExercises(
            title,
            topic,
            skillLevel,
            options.language || 'python'
          )
        : [];

      // Step 4: Generate summary
      const summary = await this.generateSummary(
        title,
        content,
        skillLevel
      );

      // Step 5: Compile final lesson
      const lesson: Lesson = {
        id: this.generateId('lesson'),
        moduleId: options.moduleId || '',
        order: 0,
        title,
        slug: this.generateSlug(title),
        description: content.introduction.substring(0, 200),
        content: {
          ...content,
          summary: summary.tldr
        },
        codeExamples,
        exercises,
        resources: [],
        duration,
        skillLevel,
        learningObjectives: options.learningObjectives || [],
        keyTakeaways: summary.keyTakeaways,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      };

      return {
        success: true,
        content: lesson,
        tokensUsed: this.tokenUsage,
        cached: false,
        generatedAt: new Date()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tokensUsed: this.tokenUsage,
        cached: false,
        generatedAt: new Date()
      };
    }
  }

  /**
   * Generate lesson content sections
   */
  private async generateLessonContent(
    title: string,
    topic: string,
    skillLevel: SkillLevel,
    options: {
      prerequisites?: string[];
      previousLessons?: string[];
      context?: string;
    }
  ): Promise<LessonContent> {
    const guidance = skillLevelGuidance[skillLevel];
    const duration = getLessonDuration(skillLevel);

    const prompt = lessonPrompts.contentPrompt
      .replace('{{lessonTitle}}', title)
      .replace('{{moduleContext}}', options.context || topic)
      .replace('{{courseTitle}}', topic)
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{duration}}', String(duration))
      .replace('{{prerequisites}}', options.prerequisites?.join(', ') || 'None')
      .replace('{{learningObjectives}}', `Understand ${topic}`);

    const response = await this.callOpenAI({
      systemPrompt: lessonPrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseLessonContent(response.content);
  }

  /**
   * Generate code examples for a lesson
   */
  async generateCodeExamples(
    lessonTitle: string,
    concept: string,
    skillLevel: SkillLevel,
    language: ProgrammingLanguage
  ): Promise<CodeExample[]> {
    const count = getCodeExampleCount(skillLevel);
    const complexity = this.getComplexityForLevel(skillLevel);

    const prompt = lessonPrompts.codeExamplePrompt
      .replace('{{lessonTitle}}', lessonTitle)
      .replace('{{concept}}', concept)
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{language}}', language)
      .replace('{{count}}', String(count))
      .replace('{{previousExamples}}', 'None');

    const response = await this.callOpenAI({
      systemPrompt: lessonPrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseCodeExamples(response.content, language, complexity);
  }

  /**
   * Generate exercises for a lesson
   */
  async generateExercises(
    lessonTitle: string,
    topic: string,
    skillLevel: SkillLevel,
    language: ProgrammingLanguage
  ): Promise<Exercise[]> {
    const count = getExerciseCount(skillLevel);
    const duration = getLessonDuration(skillLevel);

    const prompt = lessonPrompts.exercisePrompt
      .replace('{{lessonTitle}}', lessonTitle)
      .replace('{{concepts}}', topic)
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{language}}', language)
      .replace('{{count}}', String(count))
      .replace('{{duration}}', String(duration));

    const response = await this.callOpenAI({
      systemPrompt: lessonPrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseExercises(response.content);
  }

  /**
   * Generate lesson summary
   */
  private async generateSummary(
    title: string,
    content: LessonContent,
    skillLevel: SkillLevel
  ): Promise<{
    tldr: string;
    keyTakeaways: string[];
  }> {
    const allContent = [
      content.introduction,
      ...content.sections.map(s => s.content),
      content.conclusion
    ].join('\n\n');

    const prompt = lessonPrompts.summaryPrompt
      .replace('{{lessonTitle}}', title)
      .replace('{{lessonContent}}', allContent.substring(0, 3000))
      .replace('{{keyConcepts}}', content.sections.map(s => s.title).join(', '))
      .replace('{{skillLevel}}', skillLevel);

    const response = await this.callOpenAI({
      systemPrompt: lessonPrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseSummary(response.content);
  }

  /**
   * Personalize lesson content for a specific learner
   */
  async personalizeLesson(
    lesson: Lesson,
    context: PersonalizationContext
  ): Promise<Lesson> {
    if (!this.config.personalizationEnabled) {
      return lesson;
    }

    const prompt = lessonPrompts.personalizationPrompt
      .replace('{{originalContent}}', JSON.stringify(lesson.content))
      .replace('{{skillLevel}}', context.skillLevel)
      .replace('{{learningStyle}}', context.learningStyle)
      .replace('{{struggles}}', context.history.strugglingAreas.join(', '))
      .replace('{{interests}}', context.interests.join(', '))
      .replace('{{preferredLanguage}}', context.preferences.preferredLanguage.join(', '));

    const response = await this.callOpenAI({
      systemPrompt: lessonPrompts.systemPrompt,
      userPrompt: prompt
    });

    const personalization = this.parsePersonalization(response.content);
    
    // Apply personalizations
    return {
      ...lesson,
      content: this.applyPersonalizations(lesson.content, personalization),
      skillLevel: context.skillLevel
    };
  }

  /**
   * Update existing lesson with new information
   */
  async updateLesson(
    lesson: Lesson,
    updates: {
      newInformation?: string;
      correctedContent?: Partial<LessonContent>;
      additionalExamples?: CodeExample[];
    }
  ): Promise<Lesson> {
    const updatedLesson = { ...lesson };

    if (updates.correctedContent) {
      updatedLesson.content = {
        ...updatedLesson.content,
        ...updates.correctedContent
      };
    }

    if (updates.additionalExamples) {
      updatedLesson.codeExamples = [
        ...updatedLesson.codeExamples,
        ...updates.additionalExamples
      ];
    }

    updatedLesson.updatedAt = new Date();
    
    // Increment version
    const versionParts = updatedLesson.version.split('.');
    versionParts[2] = String(parseInt(versionParts[2] || '0') + 1);
    updatedLesson.version = versionParts.join('.');

    return updatedLesson;
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
    
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          ...(cached as AIResponse),
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
        max_tokens: params.maxTokens ?? 3000
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

    this.tokenUsage += aiResponse.usage.totalTokens;

    if (this.config.cacheEnabled) {
      this.saveToCache(cacheKey, aiResponse);
    }

    return aiResponse;
  }

  // ============================================
  // Parsing Methods
  // ============================================

  private parseLessonContent(content: string): LessonContent {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return {
        introduction: parsed.introduction || '',
        sections: (parsed.sections || []).map((s: ContentSection) => ({
          id: s.id || this.generateId('section'),
          title: s.title,
          content: s.content,
          type: s.type || 'text',
          codeBlock: s.codeBlock
        })),
        conclusion: parsed.conclusion || '',
        summary: parsed.summary || ''
      };
    } catch {
      // Fallback: parse from markdown structure
      return this.parseFromMarkdown(content);
    }
  }

  private parseFromMarkdown(content: string): LessonContent {
    const sections = content.split(/^##\s+/m).filter(Boolean);
    
    return {
      introduction: sections[0]?.trim() || '',
      sections: sections.slice(1).map(section => {
        const lines = section.split('\n');
        const title = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();
        
        return {
          id: this.generateId('section'),
          title,
          content: body,
          type: body.includes('```') ? 'code' : 'text'
        };
      }),
      conclusion: '',
      summary: ''
    };
  }

  private parseCodeExamples(
    content: string,
    language: ProgrammingLanguage,
    complexity: string
  ): CodeExample[] {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return (Array.isArray(parsed) ? parsed : [parsed]).map((example, index) => ({
        id: this.generateId('code'),
        lessonId: '',
        title: example.title || `Example ${index + 1}`,
        description: example.description || '',
        language,
        code: example.code || '',
        explanation: example.explanation || '',
        complexity: example.complexity || complexity,
        tags: example.concepts || [],
        prerequisites: example.prerequisites || [],
        expectedOutput: example.expectedOutput,
        testCases: example.testCases || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch {
      return [];
    }
  }

  private parseExercises(content: string): Exercise[] {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return (Array.isArray(parsed) ? parsed : [parsed]).map((ex, index) => ({
        id: ex.id || this.generateId('exercise'),
        lessonId: '',
        title: ex.title || `Exercise ${index + 1}`,
        description: ex.description || '',
        type: ex.type || 'coding',
        difficulty: ex.difficulty || 'intermediate',
        instructions: ex.instructions || [],
        starterCode: ex.starterCode,
        solution: ex.solution,
        hints: ex.hints || [],
        testCases: ex.testCases || [],
        points: ex.points || 10
      }));
    } catch {
      return [];
    }
  }

  private parseSummary(content: string): {
    tldr: string;
    keyTakeaways: string[];
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return {
        tldr: parsed.tldr || parsed.summary || '',
        keyTakeaways: parsed.keyTakeaways || []
      };
    } catch {
      return {
        tldr: content.substring(0, 200),
        keyTakeaways: []
      };
    }
  }

  private parsePersonalization(content: string): PersonalizationResult {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonContent);
    } catch {
      return {
        adaptations: [],
        addedExercises: [],
        modifiedExamples: [],
        personalizedSummary: ''
      };
    }
  }

  private applyPersonalizations(
    content: LessonContent,
    personalization: PersonalizationResult
  ): LessonContent {
    let adapted = { ...content };

    for (const adaptation of personalization.adaptations) {
      // Apply adaptations to relevant sections
      adapted.sections = adapted.sections.map(section => {
        if (section.title.toLowerCase().includes(adaptation.section.toLowerCase())) {
          return {
            ...section,
            content: adaptation.adapted
          };
        }
        return section;
      });
    }

    if (personalization.personalizedSummary) {
      adapted.summary = personalization.personalizedSummary;
    }

    return adapted;
  }

  // ============================================
  // Helper Methods
  // ============================================

  private getComplexityForLevel(skillLevel: SkillLevel): string {
    const complexityMap: Record<SkillLevel, string> = {
      beginner: 'basic',
      intermediate: 'intermediate',
      advanced: 'advanced',
      expert: 'advanced'
    };
    return complexityMap[skillLevel];
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }

  private generateCacheKey(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `lesson_cache_${hash}`;
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

  /**
   * Get total tokens used
   */
  getTotalTokens(): number {
    return this.tokenUsage;
  }

  /**
   * Reset token counter
   */
  resetTokenCounter(): void {
    this.tokenUsage = 0;
  }
}

// ============================================
// Type Definitions
// ============================================

interface PersonalizationResult {
  adaptations: Array<{
    section: string;
    original: string;
    adapted: string;
    reason: string;
  }>;
  addedExercises: Exercise[];
  modifiedExamples: CodeExample[];
  personalizedSummary: string;
}

// ============================================
// Export Singleton Factory
// ============================================

let defaultLessonGenerator: LessonGenerator | null = null;

export function getLessonGenerator(config?: Partial<LessonGeneratorConfig> & { openaiApiKey: string }): LessonGenerator {
  if (!defaultLessonGenerator && config) {
    defaultLessonGenerator = new LessonGenerator(config);
  }
  if (!defaultLessonGenerator) {
    throw new Error('Lesson generator not initialized. Provide config.');
  }
  return defaultLessonGenerator;
}

export default LessonGenerator;
