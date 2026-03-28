/**
 * Quiz Generator - Generates assessments and quizzes
 * 
 * Creates various types of assessments with different question types,
 * difficulty levels, and adaptive features.
 */

import type {
  Assessment,
  Question,
  QuestionType,
  AssessmentType,
  SkillLevel,
  TopicCategory,
  ProgrammingLanguage,
  GenerationResult,
  TestCase
} from '../../types/content';

import type { AIResponse } from '../../types/ai';

import {
  quizPrompts,
  quizTemplate,
  getQuestionCount,
  getTimeLimit,
  getPassingScore,
  getQuestionTypeDistribution,
  getQuestionPoints,
  validateQuestion,
  bloomsVerbs,
  suggestBloomsLevel
} from './templates/quiz-template';

// ============================================
// Quiz Generator Configuration
// ============================================

export interface QuizGeneratorConfig {
  openaiApiKey: string;
  defaultModel: 'gpt-4o' | 'gpt-4o-mini';
  cacheEnabled: boolean;
  cacheTTL: number;
  includeExplanations: boolean;
  adaptiveAssessment: boolean;
}

const defaultConfig: Partial<QuizGeneratorConfig> = {
  defaultModel: 'gpt-4o',
  cacheEnabled: true,
  cacheTTL: 604800,
  includeExplanations: true,
  adaptiveAssessment: true
};

// ============================================
// Quiz Generator Class
// ============================================

export class QuizGenerator {
  private config: QuizGeneratorConfig;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private tokenUsage: number;

  constructor(config: Partial<QuizGeneratorConfig> & { openaiApiKey: string }) {
    this.config = { ...defaultConfig, ...config } as QuizGeneratorConfig;
    this.cache = new Map();
    this.tokenUsage = 0;
  }

  /**
   * Generate a complete assessment
   */
  async generateAssessment(
    title: string,
    topic: string,
    category: TopicCategory,
    type: AssessmentType,
    skillLevel: SkillLevel,
    options: {
      learningObjectives?: string[];
      concepts?: string[];
      language?: ProgrammingLanguage;
      questionCount?: number;
    } = {}
  ): Promise<GenerationResult<Assessment>> {
    try {
      const questionCount = options.questionCount || getQuestionCount(type, skillLevel);
      const timeLimit = getTimeLimit(type, questionCount);
      const passingScore = getPassingScore(skillLevel);

      // Generate questions
      const questions = await this.generateQuestions(
        topic,
        skillLevel,
        questionCount,
        options
      );

      // Generate explanations if enabled
      if (this.config.includeExplanations) {
        await this.generateExplanations(questions, topic, skillLevel);
      }

      const assessment: Assessment = {
        id: this.generateId('assessment'),
        title,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} covering ${topic}`,
        type,
        difficulty: skillLevel,
        questions,
        passingScore,
        timeLimit,
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return {
        success: true,
        content: assessment,
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
   * Generate questions for an assessment
   */
  private async generateQuestions(
    topic: string,
    skillLevel: SkillLevel,
    count: number,
    options: {
      learningObjectives?: string[];
      concepts?: string[];
      language?: ProgrammingLanguage;
    }
  ): Promise<Question[]> {
    const distribution = getQuestionTypeDistribution(skillLevel);
    const bloomsLevels = suggestBloomsLevel(skillLevel);
    
    const questions: Question[] = [];
    const questionTypes = this.distributeQuestionTypes(count, distribution);

    for (const type of questionTypes) {
      const bloomsLevel = bloomsLevels[Math.floor(Math.random() * bloomsLevels.length)];
      
      const question = await this.generateSingleQuestion(
        topic,
        type,
        skillLevel,
        bloomsLevel,
        options
      );
      
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Generate a single question
   */
  private async generateSingleQuestion(
    topic: string,
    type: QuestionType,
    skillLevel: SkillLevel,
    bloomsLevel: string,
    options: {
      learningObjectives?: string[];
      concepts?: string[];
      language?: ProgrammingLanguage;
    }
  ): Promise<Question | null> {
    const prompt = quizPrompts.questionPrompt
      .replace('{{count}}', '1')
      .replace('{{questionType}}', type)
      .replace('{{topic}}', topic)
      .replace('{{concepts}}', options.concepts?.join(', ') || topic)
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{bloomsLevel}}', bloomsLevel)
      .replace('{{language}}', options.language || 'python');

    const response = await this.callOpenAI({
      systemPrompt: quizPrompts.systemPrompt,
      userPrompt: prompt
    });

    const questions = this.parseQuestions(response.content);
    return questions[0] || null;
  }

  /**
   * Generate explanations for questions
   */
  private async generateExplanations(
    questions: Question[],
    topic: string,
    skillLevel: SkillLevel
  ): Promise<void> {
    // Only generate explanations for questions that don't have them
    const questionsNeedingExplanations = questions.filter(q => !q.explanation || q.explanation.length < 20);

    if (questionsNeedingExplanations.length === 0) return;

    const prompt = quizPrompts.explanationPrompt
      .replace('{{questions}}', JSON.stringify(questionsNeedingExplanations.map(q => ({
        id: q.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        options: q.options
      }))))
      .replace('{{topic}}', topic)
      .replace('{{skillLevel}}', skillLevel);

    const response = await this.callOpenAI({
      systemPrompt: quizPrompts.systemPrompt,
      userPrompt: prompt
    });

    const explanations = this.parseExplanations(response.content);

    // Update questions with explanations
    for (const question of questionsNeedingExplanations) {
      const explanation = explanations.find(e => e.questionId === question.id);
      if (explanation) {
        question.explanation = explanation.correctAnswerExplanation;
      }
    }
  }

  /**
   * Generate adaptive assessment based on performance
   */
  async generateAdaptiveAssessment(
    topic: string,
    skillLevel: SkillLevel,
    previousPerformance: {
      correctAnswers: number;
      totalQuestions: number;
      strugglingAreas: string[];
      strongAreas: string[];
    },
    options: {
      concepts?: string[];
      language?: ProgrammingLanguage;
    } = {}
  ): Promise<GenerationResult<Assessment>> {
    if (!this.config.adaptiveAssessment) {
      return this.generateAssessment(
        `Adaptive Assessment - ${topic}`,
        topic,
        'ai-ml-engineering',
        'practice',
        skillLevel,
        options
      );
    }

    const prompt = quizPrompts.adaptivePrompt
      .replace('{{currentPerformance}}', `${previousPerformance.correctAnswers}/${previousPerformance.totalQuestions}`)
      .replace('{{questionsAnswered}}', String(previousPerformance.totalQuestions))
      .replace('{{correctAnswers}}', String(previousPerformance.correctAnswers))
      .replace('{{strugglingAreas}}', previousPerformance.strugglingAreas.join(', '))
      .replace('{{strongAreas}}', previousPerformance.strongAreas.join(', '))
      .replace('{{skillLevel}}', skillLevel);

    const response = await this.callOpenAI({
      systemPrompt: quizPrompts.systemPrompt,
      userPrompt: prompt
    });

    const adaptiveResult = this.parseAdaptiveResult(response.content);

    // Generate questions based on adaptive strategy
    const questions = await this.generateQuestions(
      topic,
      adaptiveResult.difficulty === 'easier' ? this.decreaseDifficulty(skillLevel) :
      adaptiveResult.difficulty === 'harder' ? this.increaseDifficulty(skillLevel) :
      skillLevel,
      5,
      { ...options, concepts: adaptiveResult.focusAreas }
    );

    const assessment: Assessment = {
      id: this.generateId('assessment'),
      title: `Adaptive Assessment - ${topic}`,
      description: adaptiveResult.adaptationReason,
      type: 'practice',
      difficulty: skillLevel,
      questions,
      passingScore: getPassingScore(skillLevel),
      timeLimit: 15,
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      success: true,
      content: assessment,
      tokensUsed: this.tokenUsage,
      cached: false,
      generatedAt: new Date()
    };
  }

  /**
   * Generate coding challenge
   */
  async generateCodingChallenge(
    title: string,
    topic: string,
    skillLevel: SkillLevel,
    language: ProgrammingLanguage,
    options: {
      timeLimit?: number;
      concepts?: string[];
    } = {}
  ): Promise<GenerationResult<Assessment>> {
    const prompt = `Generate a coding challenge for:

**Topic:** ${topic}
**Skill Level:** ${skillLevel}
**Language:** ${language}

Create a practical coding challenge that:
1. Tests real-world skills
2. Has clear requirements
3. Includes test cases
4. Allows multiple solution approaches

Format as JSON:
{
  "title": "string",
  "description": "string",
  "requirements": ["string"],
  "starterCode": "string",
  "testCases": [{
    "input": "string",
    "expectedOutput": "string",
    "description": "string",
    "isHidden": boolean
  }],
  "hints": ["string"],
  "evaluationCriteria": ["string"]
}`;

    const response = await this.callOpenAI({
      systemPrompt: quizPrompts.systemPrompt,
      userPrompt: prompt
    });

    const challenge = this.parseCodingChallenge(response.content);

    const assessment: Assessment = {
      id: this.generateId('assessment'),
      title,
      description: challenge.description,
      type: 'coding-challenge',
      difficulty: skillLevel,
      questions: [{
        id: this.generateId('q'),
        type: 'code-completion',
        question: challenge.description,
        codeSnippet: challenge.starterCode,
        language,
        correctAnswer: '', // Solutions are evaluated by test cases
        explanation: '',
        points: 100,
        difficulty: skillLevel,
        tags: options.concepts || []
      }],
      passingScore: 70,
      timeLimit: options.timeLimit || 60,
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      success: true,
      content: assessment,
      tokensUsed: this.tokenUsage,
      cached: false,
      generatedAt: new Date()
    };
  }

  /**
   * Validate an assessment
   */
  validateAssessment(assessment: Assessment): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check basic structure
    if (!assessment.title || assessment.title.length < 5) {
      errors.push('Assessment title must be at least 5 characters');
    }

    if (assessment.questions.length === 0) {
      errors.push('Assessment must have at least one question');
    }

    // Validate each question
    for (let i = 0; i < assessment.questions.length; i++) {
      const questionErrors = validateQuestion(assessment.questions[i]);
      questionErrors.forEach(err => errors.push(`Question ${i + 1}: ${err}`));
    }

    // Check for warnings
    if (assessment.questions.length < 5) {
      warnings.push('Assessment has fewer than 5 questions - consider adding more');
    }

    const hasExplanations = assessment.questions.every(q => q.explanation && q.explanation.length > 20);
    if (!hasExplanations) {
      warnings.push('Some questions lack detailed explanations');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
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

  private parseQuestions(content: string): Question[] {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      const questions = Array.isArray(parsed) ? parsed : [parsed];

      return questions.map(q => ({
        id: q.id || this.generateId('q'),
        type: q.type || 'multiple-choice',
        question: q.question,
        codeSnippet: q.codeSnippet,
        language: q.language,
        options: q.options?.map((o: { id: string; text: string; isCorrect: boolean }, i: number) => ({
          id: o.id || `opt_${i}`,
          text: o.text,
          isCorrect: o.isCorrect
        })),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        points: q.points || getQuestionPoints(q.type || 'multiple-choice'),
        difficulty: q.difficulty || 'intermediate',
        tags: q.tags || [],
        learningObjective: q.learningObjective
      }));
    } catch {
      return [];
    }
  }

  private parseExplanations(content: string): Array<{
    questionId: string;
    correctAnswerExplanation: string;
  }> {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }

  private parseAdaptiveResult(content: string): {
    difficulty: 'easier' | 'same' | 'harder';
    focusAreas: string[];
    skipAreas: string[];
    adaptationReason: string;
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      
      return {
        difficulty: parsed.difficulty || 'same',
        focusAreas: parsed.focusAreas || [],
        skipAreas: parsed.skipAreas || [],
        adaptationReason: parsed.adaptationReason || ''
      };
    } catch {
      return {
        difficulty: 'same',
        focusAreas: [],
        skipAreas: [],
        adaptationReason: ''
      };
    }
  }

  private parseCodingChallenge(content: string): {
    title: string;
    description: string;
    requirements: string[];
    starterCode: string;
    testCases: TestCase[];
    hints: string[];
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);
      
      return {
        title: parsed.title || 'Coding Challenge',
        description: parsed.description || '',
        requirements: parsed.requirements || [],
        starterCode: parsed.starterCode || '',
        testCases: parsed.testCases || [],
        hints: parsed.hints || []
      };
    } catch {
      return {
        title: 'Coding Challenge',
        description: content.substring(0, 200),
        requirements: [],
        starterCode: '',
        testCases: [],
        hints: []
      };
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  private distributeQuestionTypes(
    count: number,
    distribution: Record<QuestionType, number>
  ): QuestionType[] {
    const types: QuestionType[] = [];
    
    for (const [type, ratio] of Object.entries(distribution)) {
      const typeCount = Math.round(count * ratio);
      for (let i = 0; i < typeCount && types.length < count; i++) {
        types.push(type as QuestionType);
      }
    }

    // Fill remaining with random types if needed
    const availableTypes = Object.keys(distribution) as QuestionType[];
    while (types.length < count) {
      types.push(availableTypes[Math.floor(Math.random() * availableTypes.length)]);
    }

    // Shuffle
    return types.sort(() => Math.random() - 0.5);
  }

  private increaseDifficulty(level: SkillLevel): SkillLevel {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const index = levels.indexOf(level);
    return index < levels.length - 1 ? levels[index + 1] : level;
  }

  private decreaseDifficulty(level: SkillLevel): SkillLevel {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const index = levels.indexOf(level);
    return index > 0 ? levels[index - 1] : level;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateCacheKey(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `quiz_cache_${hash}`;
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
// Export Singleton Factory
// ============================================

let defaultQuizGenerator: QuizGenerator | null = null;

export function getQuizGenerator(config?: Partial<QuizGeneratorConfig> & { openaiApiKey: string }): QuizGenerator {
  if (!defaultQuizGenerator && config) {
    defaultQuizGenerator = new QuizGenerator(config);
  }
  if (!defaultQuizGenerator) {
    throw new Error('Quiz generator not initialized. Provide config.');
  }
  return defaultQuizGenerator;
}

export default QuizGenerator;
