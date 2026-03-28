/**
 * Code Examples Generator - Generates educational code examples
 * 
 * Creates production-quality code examples with explanations,
 * test cases, and best practices.
 */

import type {
  CodeExample,
  TestCase,
  SkillLevel,
  ProgrammingLanguage,
  TopicCategory,
  GenerationResult
} from '../../types/content';

import type { AIResponse } from '../../types/ai';

import {
  codePrompts,
  codeTemplate,
  getCodeComplexity,
  getRequiredElements,
  getTestRequirements,
  getLanguageStandard,
  validateCodeExample,
  createHeaderCodeBlock
} from './templates/code-template';

// ============================================
// Code Examples Generator Configuration
// ============================================

export interface CodeExamplesConfig {
  openaiApiKey: string;
  defaultModel: 'gpt-4o' | 'gpt-4o-mini';
  cacheEnabled: boolean;
  cacheTTL: number;
  includeTestCases: boolean;
  includeExplanations: boolean;
  validateCode: boolean;
}

const defaultConfig: Partial<CodeExamplesConfig> = {
  defaultModel: 'gpt-4o',
  cacheEnabled: true,
  cacheTTL: 604800,
  includeTestCases: true,
  includeExplanations: true,
  validateCode: false
};

// ============================================
// Code Examples Generator Class
// ============================================

export class CodeExamplesGenerator {
  private config: CodeExamplesConfig;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private tokenUsage: number;

  constructor(config: Partial<CodeExamplesConfig> & { openaiApiKey: string }) {
    this.config = { ...defaultConfig, ...config } as CodeExamplesConfig;
    this.cache = new Map();
    this.tokenUsage = 0;
  }

  /**
   * Generate code examples for a concept
   */
  async generateExamples(
    concept: string,
    language: ProgrammingLanguage,
    skillLevel: SkillLevel,
    options: {
      count?: number;
      context?: string;
      includeAdvanced?: boolean;
    } = {}
  ): Promise<GenerationResult<CodeExample[]>> {
    try {
      const count = options.count || 3;
      const complexity = getCodeComplexity(skillLevel);
      const languageStandard = getLanguageStandard(language);

      const prompt = codePrompts.codeExamplePrompt
        .replace('{{concept}}', concept)
        .replace('{{skillLevel}}', skillLevel)
        .replace('{{language}}', language)
        .replace('{{count}}', String(count))
        .replace('{{context}}', options.context || concept)
        .replace('{{previousExamples}}', 'None');

      const response = await this.callOpenAI({
        systemPrompt: codePrompts.systemPrompt,
        userPrompt: prompt
      });

      let examples = this.parseCodeExamples(response.content, language, skillLevel);

      // Add test cases if enabled
      if (this.config.includeTestCases) {
        examples = await this.addTestCases(examples, language);
      }

      // Add detailed explanations if enabled
      if (this.config.includeExplanations) {
        examples = await this.addDetailedExplanations(examples, concept, skillLevel);
      }

      // Add header comments
      examples = examples.map(example => ({
        ...example,
        code: this.addHeaderComment(example, languageStandard)
      }));

      return {
        success: true,
        content: examples,
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
   * Generate a single code example
   */
  async generateSingleExample(
    title: string,
    concept: string,
    language: ProgrammingLanguage,
    skillLevel: SkillLevel,
    complexity: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<GenerationResult<CodeExample>> {
    const prompt = codePrompts.codeExamplePrompt
      .replace('{{concept}}', concept)
      .replace('{{skillLevel}}', skillLevel)
      .replace('{{language}}', language)
      .replace('{{count}}', '1')
      .replace('{{context}}', title)
      .replace('{{previousExamples}}', 'None');

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: prompt
    });

    const examples = this.parseCodeExamples(response.content, language, skillLevel);
    const example = examples[0];

    if (!example) {
      return {
        success: false,
        error: 'Failed to generate code example',
        tokensUsed: this.tokenUsage,
        cached: false,
        generatedAt: new Date()
      };
    }

    // Add test cases
    if (this.config.includeTestCases) {
      const withTests = await this.addTestCases([example], language);
      example.testCases = withTests[0].testCases;
    }

    return {
      success: true,
      content: {
        ...example,
        title,
        complexity
      },
      tokensUsed: this.tokenUsage,
      cached: false,
      generatedAt: new Date()
    };
  }

  /**
   * Generate explanation for existing code
   */
  async generateExplanation(
    code: string,
    language: ProgrammingLanguage,
    skillLevel: SkillLevel,
    context?: string
  ): Promise<string> {
    const prompt = codePrompts.explanationPrompt
      .replace('{{language}}', language)
      .replace('{{code}}', code)
      .replace('{{context}}', context || 'General explanation')
      .replace('{{skillLevel}}', skillLevel);

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: prompt
    });

    return response.content;
  }

  /**
   * Generate test cases for code
   */
  async generateTestCases(
    code: string,
    language: ProgrammingLanguage,
    skillLevel: SkillLevel,
    purpose: string
  ): Promise<TestCase[]> {
    const requirements = getTestRequirements(skillLevel);

    const prompt = codePrompts.testCasePrompt
      .replace('{{language}}', language)
      .replace('{{code}}', code)
      .replace('{{purpose}}', purpose)
      .replace('{{minTestCases}}', String(requirements.minTestCases));

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseTestCases(response.content);
  }

  /**
   * Refactor code for better quality
   */
  async refactorCode(
    code: string,
    language: ProgrammingLanguage,
    issues: string[],
    skillLevel: SkillLevel
  ): Promise<{
    refactoredCode: string;
    changes: Array<{
      type: string;
      original: string;
      refactored: string;
      reason: string;
    }>;
    improvements: string[];
  }> {
    const prompt = codePrompts.refactorPrompt
      .replace('{{language}}', language)
      .replace('{{code}}', code)
      .replace('{{issues}}', issues.join(', '))
      .replace('{{skillLevel}}', skillLevel);

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseRefactorResult(response.content);
  }

  /**
   * Debug code and provide fixes
   */
  async debugCode(
    code: string,
    language: ProgrammingLanguage,
    expectedBehavior: string,
    actualBehavior: string,
    errors?: string
  ): Promise<{
    bugs: Array<{
      line: number;
      type: string;
      severity: string;
      description: string;
      fix: string;
    }>;
    correctedCode: string;
    debuggingSteps: string[];
  }> {
    const prompt = codePrompts.debugPrompt
      .replace('{{language}}', language)
      .replace('{{code}}', code)
      .replace('{{expectedBehavior}}', expectedBehavior)
      .replace('{{actualBehavior}}', actualBehavior)
      .replace('{{errors}}', errors || 'None');

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: prompt
    });

    return this.parseDebugResult(response.content);
  }

  /**
   * Generate code variations (different approaches)
   */
  async generateVariations(
    code: string,
    language: ProgrammingLanguage,
    variationType: 'optimized' | 'simplified' | 'alternative' | 'modern'
  ): Promise<CodeExample[]> {
    const prompts = {
      optimized: 'Optimize this code for better performance while maintaining functionality',
      simplified: 'Simplify this code to be more readable for beginners',
      alternative: 'Provide an alternative implementation using a different approach',
      modern: 'Modernize this code using the latest language features and best practices'
    };

    const response = await this.callOpenAI({
      systemPrompt: codePrompts.systemPrompt,
      userPrompt: `${prompts[variationType]}:

\`\`\`${language}
${code}
\`\`\`

Provide the ${variationType} version with explanation of changes.`
    });

    const variations = this.parseCodeExamples(response.content, language, 'intermediate');
    return variations;
  }

  /**
   * Validate a code example
   */
  validateExample(example: CodeExample): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    const validationErrors = validateCodeExample(example);
    errors.push(...validationErrors);

    // Check for required elements
    const requiredElements = getRequiredElements(example.skillLevel || 'intermediate');
    for (const element of requiredElements) {
      if (element === 'header comment' && !example.code.startsWith('#') && !example.code.startsWith('//') && !example.code.startsWith('/*')) {
        warnings.push(`Missing ${element}`);
      }
    }

    // Check code length
    const complexity = getCodeComplexity(example.skillLevel || 'intermediate');
    const lines = example.code.split('\n').length;
    if (lines < complexity.minLines) {
      warnings.push(`Code is shorter than recommended (${lines} < ${complexity.minLines} lines)`);
    }
    if (lines > complexity.maxLines) {
      warnings.push(`Code is longer than recommended (${lines} > ${complexity.maxLines} lines)`);
    }

    // Check for test cases
    if (this.config.includeTestCases && (!example.testCases || example.testCases.length === 0)) {
      warnings.push('No test cases provided');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private async addTestCases(
    examples: CodeExample[],
    language: ProgrammingLanguage
  ): Promise<CodeExample[]> {
    return Promise.all(
      examples.map(async (example) => {
        if (!example.testCases || example.testCases.length === 0) {
          example.testCases = await this.generateTestCases(
            example.code,
            language,
            'intermediate',
            example.description
          );
        }
        return example;
      })
    );
  }

  private async addDetailedExplanations(
    examples: CodeExample[],
    concept: string,
    skillLevel: SkillLevel
  ): Promise<CodeExample[]> {
    return Promise.all(
      examples.map(async (example) => {
        if (!example.explanation || example.explanation.length < 50) {
          example.explanation = await this.generateExplanation(
            example.code,
            example.language,
            skillLevel,
            concept
          );
        }
        return example;
      })
    );
  }

  private addHeaderComment(
    example: CodeExample,
    standard: { styleGuide: string; namingConventions: Record<string, string> }
  ): string {
    const headerComment = createHeaderCodeBlock(
      example.language,
      example.title,
      example.description
    );
    return `${headerComment}\n${example.code}`;
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

  private parseCodeExamples(
    content: string,
    language: ProgrammingLanguage,
    skillLevel: SkillLevel
  ): CodeExample[] {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      const examples = Array.isArray(parsed) ? parsed : [parsed];

      return examples.map((example, index) => ({
        id: this.generateId('code'),
        lessonId: '',
        title: example.title || `Example ${index + 1}`,
        description: example.description || '',
        language,
        code: example.code || '',
        explanation: example.explanation || '',
        complexity: example.complexity || 'intermediate',
        tags: example.concepts || example.tags || [],
        prerequisites: example.prerequisites || [],
        expectedOutput: example.expectedOutput,
        testCases: example.testCases || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch {
      // Try to extract code blocks from markdown
      return this.extractCodeFromMarkdown(content, language);
    }
  }

  private extractCodeFromMarkdown(
    content: string,
    language: ProgrammingLanguage
  ): CodeExample[] {
    const codeBlockRegex = new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\`\`\``, 'g');
    const examples: CodeExample[] = [];
    let match;
    let index = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      examples.push({
        id: this.generateId('code'),
        lessonId: '',
        title: `Example ${index + 1}`,
        description: '',
        language,
        code: match[1],
        explanation: '',
        complexity: 'intermediate',
        tags: [],
        prerequisites: [],
        testCases: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      index++;
    }

    return examples;
  }

  private parseTestCases(content: string): TestCase[] {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      const testCases = Array.isArray(parsed) ? parsed : [parsed];

      return testCases.map((tc, index) => ({
        id: tc.id || `test_${index + 1}`,
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || tc.expected || '',
        description: tc.description || `Test case ${index + 1}`
      }));
    } catch {
      return [];
    }
  }

  private parseRefactorResult(content: string): {
    refactoredCode: string;
    changes: Array<{
      type: string;
      original: string;
      refactored: string;
      reason: string;
    }>;
    improvements: string[];
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return {
        refactoredCode: parsed.refactoredCode || '',
        changes: parsed.changes || [],
        improvements: parsed.tradeoffs || parsed.furtherImprovements || []
      };
    } catch {
      return {
        refactoredCode: '',
        changes: [],
        improvements: []
      };
    }
  }

  private parseDebugResult(content: string): {
    bugs: Array<{
      line: number;
      type: string;
      severity: string;
      description: string;
      fix: string;
    }>;
    correctedCode: string;
    debuggingSteps: string[];
  } {
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonContent);

      return {
        bugs: parsed.bugs || [],
        correctedCode: parsed.correctedCode || '',
        debuggingSteps: parsed.debuggingSteps || []
      };
    } catch {
      return {
        bugs: [],
        correctedCode: '',
        debuggingSteps: []
      };
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

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
    return `code_cache_${hash}`;
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

let defaultCodeExamplesGenerator: CodeExamplesGenerator | null = null;

export function getCodeExamplesGenerator(config?: Partial<CodeExamplesConfig> & { openaiApiKey: string }): CodeExamplesGenerator {
  if (!defaultCodeExamplesGenerator && config) {
    defaultCodeExamplesGenerator = new CodeExamplesGenerator(config);
  }
  if (!defaultCodeExamplesGenerator) {
    throw new Error('Code examples generator not initialized. Provide config.');
  }
  return defaultCodeExamplesGenerator;
}

export default CodeExamplesGenerator;
