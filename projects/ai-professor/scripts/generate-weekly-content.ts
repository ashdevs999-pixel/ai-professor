#!/usr/bin/env npx ts-node
/**
 * Weekly Content Generator - Automated weekly content generation
 * 
 * Runs a scheduled content generation pipeline:
 * - Monday: Research latest developments
 * - Tuesday: Generate new lesson content
 * - Wednesday: Create code examples
 * - Thursday: Generate quizzes
 * - Friday: Update existing content
 */

import { CourseGenerator, getCourseGenerator } from '../lib/ai/course-generator';
import { LessonGenerator, getLessonGenerator } from '../lib/ai/lesson-generator';
import { QuizGenerator, getQuizGenerator } from '../lib/ai/quiz-generator';
import { CodeExamplesGenerator, getCodeExamplesGenerator } from '../lib/ai/code-examples';
import { ResearchAgent, getResearchAgent, TopicMonitor } from '../lib/ai/research-agent';

import type {
  TopicCategory,
  SkillLevel,
  WeeklySchedule,
  DayTask,
  ScheduledTask,
  GenerationResult
} from '../types/content';

// ============================================
// Configuration
// ============================================

interface WeeklyGeneratorConfig {
  openaiApiKey: string;
  perplexityApiKey?: string;
  topics: Array<{
    topic: string;
    category: TopicCategory;
    priority: 'high' | 'medium' | 'low';
  }>;
  outputDir: string;
  notifyOnComplete?: (summary: WeeklySummary) => Promise<void>;
}

interface WeeklySummary {
  week: number;
  year: number;
  tasksCompleted: number;
  tasksFailed: number;
  contentGenerated: {
    courses: number;
    lessons: number;
    quizzes: number;
    codeExamples: number;
  };
  totalTokensUsed: number;
  totalCost: number;
  errors: string[];
}

// ============================================
// Weekly Content Generator Class
// ============================================

export class WeeklyContentGenerator {
  private config: WeeklyGeneratorConfig;
  private courseGenerator: CourseGenerator;
  private lessonGenerator: LessonGenerator;
  private quizGenerator: QuizGenerator;
  private codeGenerator: CodeExamplesGenerator;
  private researchAgent: ResearchAgent;
  private topicMonitor: TopicMonitor;

  constructor(config: WeeklyGeneratorConfig) {
    this.config = config;
    
    // Initialize generators
    this.courseGenerator = getCourseGenerator({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey
    });

    this.lessonGenerator = getLessonGenerator({
      openaiApiKey: config.openaiApiKey
    });

    this.quizGenerator = getQuizGenerator({
      openaiApiKey: config.openaiApiKey
    });

    this.codeGenerator = getCodeExamplesGenerator({
      openaiApiKey: config.openaiApiKey
    });

    this.researchAgent = getResearchAgent({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey
    });

    this.topicMonitor = new TopicMonitor({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey
    });
  }

  /**
   * Run the full weekly content generation pipeline
   */
  async runWeeklyPipeline(): Promise<WeeklySummary> {
    const now = new Date();
    const week = this.getWeekNumber(now);
    const year = now.getFullYear();

    const summary: WeeklySummary = {
      week,
      year,
      tasksCompleted: 0,
      tasksFailed: 0,
      contentGenerated: {
        courses: 0,
        lessons: 0,
        quizzes: 0,
        codeExamples: 0
      },
      totalTokensUsed: 0,
      totalCost: 0,
      errors: []
    };

    console.log(`\n🚀 Starting Weekly Content Generation - Week ${week}, ${year}`);
    console.log('=' .repeat(60));

    try {
      // Day 1: Research
      console.log('\n📅 Monday: Researching latest developments...');
      await this.runMondayTasks(summary);

      // Day 2: Generate Lessons
      console.log('\n📅 Tuesday: Generating lesson content...');
      await this.runTuesdayTasks(summary);

      // Day 3: Code Examples
      console.log('\n📅 Wednesday: Creating code examples...');
      await this.runWednesdayTasks(summary);

      // Day 4: Quizzes
      console.log('\n📅 Thursday: Generating quizzes...');
      await this.runThursdayTasks(summary);

      // Day 5: Updates
      console.log('\n📅 Friday: Updating existing content...');
      await this.runFridayTasks(summary);

      // Calculate totals
      summary.totalTokensUsed = this.getTotalTokens();
      summary.totalCost = this.getTotalCost();

      console.log('\n✅ Weekly Content Generation Complete!');
      this.printSummary(summary);

      // Notify if configured
      if (this.config.notifyOnComplete) {
        await this.config.notifyOnComplete(summary);
      }

      return summary;

    } catch (error) {
      summary.errors.push(error instanceof Error ? error.message : 'Unknown error');
      console.error('\n❌ Error in weekly pipeline:', error);
      return summary;
    }
  }

  /**
   * Monday: Research latest developments
   */
  private async runMondayTasks(summary: WeeklySummary): Promise<void> {
    for (const topicConfig of this.config.topics) {
      try {
        console.log(`  🔍 Researching: ${topicConfig.topic}`);
        
        const research = await this.researchAgent.researchLatestDevelopments(
          topicConfig.topic,
          topicConfig.category,
          'week',
          'medium'
        );

        // Save research results
        await this.saveResearchResults(topicConfig.topic, research);

        // Identify trending subtopics for content generation
        const trends = await this.researchAgent.identifyTrends(topicConfig.category);
        
        console.log(`    ✓ Found ${research.keyInsights.length} insights, ${trends.length} trends`);
        summary.tasksCompleted++;

      } catch (error) {
        summary.tasksFailed++;
        summary.errors.push(`Monday research failed for ${topicConfig.topic}: ${error}`);
        console.error(`    ✗ Failed: ${error}`);
      }
    }
  }

  /**
   * Tuesday: Generate new lesson content
   */
  private async runTuesdayTasks(summary: WeeklySummary): Promise<void> {
    // Load research results from Monday
    const researchResults = await this.loadResearchResults();

    for (const topicConfig of this.config.topics.filter(t => t.priority === 'high')) {
      try {
        console.log(`  📝 Generating lessons for: ${topicConfig.topic}`);

        // Generate 2-3 lessons per high-priority topic
        const lessonCount = 2;
        
        for (let i = 0; i < lessonCount; i++) {
          const lessonTitle = await this.generateLessonTitle(
            topicConfig.topic,
            topicConfig.category,
            i
          );

          const result = await this.lessonGenerator.generateLesson(
            lessonTitle,
            topicConfig.topic,
            topicConfig.category,
            'intermediate'
          );

          if (result.success && result.content) {
            await this.saveLesson(result.content);
            summary.contentGenerated.lessons++;
            console.log(`    ✓ Generated: ${lessonTitle}`);
          } else {
            throw new Error(result.error || 'Failed to generate lesson');
          }
        }

        summary.tasksCompleted++;

      } catch (error) {
        summary.tasksFailed++;
        summary.errors.push(`Tuesday lesson generation failed for ${topicConfig.topic}: ${error}`);
        console.error(`    ✗ Failed: ${error}`);
      }
    }
  }

  /**
   * Wednesday: Create code examples
   */
  private async runWednesdayTasks(summary: WeeklySummary): Promise<void> {
    for (const topicConfig of this.config.topics) {
      try {
        console.log(`  💻 Creating code examples for: ${topicConfig.topic}`);

        const result = await this.codeGenerator.generateExamples(
          topicConfig.topic,
          'python', // Default to Python, can be configured
          'intermediate',
          { count: 3 }
        );

        if (result.success && result.content) {
          for (const example of result.content) {
            await this.saveCodeExample(example);
            summary.contentGenerated.codeExamples++;
          }
          console.log(`    ✓ Generated ${result.content.length} examples`);
          summary.tasksCompleted++;
        } else {
          throw new Error(result.error || 'Failed to generate examples');
        }

      } catch (error) {
        summary.tasksFailed++;
        summary.errors.push(`Wednesday code generation failed for ${topicConfig.topic}: ${error}`);
        console.error(`    ✗ Failed: ${error}`);
      }
    }
  }

  /**
   * Thursday: Generate quizzes
   */
  private async runThursdayTasks(summary: WeeklySummary): Promise<void> {
    // Load lessons generated on Tuesday
    const lessons = await this.loadRecentLessons();

    for (const lesson of lessons.slice(0, 5)) { // Limit to 5 quizzes
      try {
        console.log(`  📋 Generating quiz for: ${lesson.title}`);

        const result = await this.quizGenerator.generateAssessment(
          `Quiz: ${lesson.title}`,
          lesson.title,
          lesson.category,
          'quiz',
          lesson.skillLevel,
          {
            concepts: lesson.keyTakeaways,
            questionCount: 10
          }
        );

        if (result.success && result.content) {
          await this.saveQuiz(result.content);
          summary.contentGenerated.quizzes++;
          console.log(`    ✓ Generated quiz with ${result.content.questions.length} questions`);
          summary.tasksCompleted++;
        } else {
          throw new Error(result.error || 'Failed to generate quiz');
        }

      } catch (error) {
        summary.tasksFailed++;
        summary.errors.push(`Thursday quiz generation failed: ${error}`);
        console.error(`    ✗ Failed: ${error}`);
      }
    }
  }

  /**
   * Friday: Update existing content
   */
  private async runFridayTasks(summary: WeeklySummary): Promise<void> {
    console.log('  🔄 Checking for content that needs updates...');

    // Get list of content to check
    const contentToCheck = await this.getContentNeedingUpdates();

    for (const content of contentToCheck.slice(0, 10)) { // Limit updates
      try {
        console.log(`  🔄 Updating: ${content.title}`);

        // Check freshness
        const freshness = await this.researchAgent.checkContentFreshness(
          content.topic,
          content.category,
          content.body,
          content.age
        );

        if (freshness.needsUpdate) {
          // Regenerate content with updates
          const updateResult = await this.updateContent(content, freshness);
          
          if (updateResult.success) {
            console.log(`    ✓ Updated (freshness: ${freshness.freshnessScore}%)`);
            summary.tasksCompleted++;
          } else {
            throw new Error(updateResult.error || 'Update failed');
          }
        } else {
          console.log(`    ✓ Content is fresh (${freshness.freshnessScore}%)`);
        }

      } catch (error) {
        summary.tasksFailed++;
        summary.errors.push(`Friday update failed for ${content.title}: ${error}`);
        console.error(`    ✗ Failed: ${error}`);
      }
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private async generateLessonTitle(
    topic: string,
    category: TopicCategory,
    index: number
  ): Promise<string> {
    const aspects = [
      'Introduction to',
      'Advanced',
      'Best Practices for',
      'Common Patterns in',
      'Real-world Applications of'
    ];
    return `${aspects[index % aspects.length]} ${topic}`;
  }

  private async saveResearchResults(topic: string, results: unknown): Promise<void> {
    const fs = await import('fs/promises');
    const path = `${this.config.outputDir}/research/${topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    await fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await fs.writeFile(path, JSON.stringify(results, null, 2));
  }

  private async loadResearchResults(): Promise<Map<string, unknown>> {
    // Implementation to load saved research
    return new Map();
  }

  private async saveLesson(lesson: unknown): Promise<void> {
    const fs = await import('fs/promises');
    const path = `${this.config.outputDir}/lessons/${Date.now()}.json`;
    await fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await fs.writeFile(path, JSON.stringify(lesson, null, 2));
  }

  private async saveCodeExample(example: unknown): Promise<void> {
    const fs = await import('fs/promises');
    const path = `${this.config.outputDir}/examples/${Date.now()}.json`;
    await fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await fs.writeFile(path, JSON.stringify(example, null, 2));
  }

  private async saveQuiz(quiz: unknown): Promise<void> {
    const fs = await import('fs/promises');
    const path = `${this.config.outputDir}/quizzes/${Date.now()}.json`;
    await fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await fs.writeFile(path, JSON.stringify(quiz, null, 2));
  }

  private async loadRecentLessons(): Promise<Array<{
    title: string;
    category: TopicCategory;
    skillLevel: SkillLevel;
    keyTakeaways: string[];
  }>> {
    // Implementation to load recent lessons
    return [];
  }

  private async getContentNeedingUpdates(): Promise<Array<{
    id: string;
    title: string;
    topic: string;
    category: TopicCategory;
    body: string;
    age: number;
  }>> {
    // Implementation to get content older than threshold
    return [];
  }

  private async updateContent(
    content: { id: string; title: string; topic: string; category: TopicCategory },
    freshness: { recommendations: string[] }
  ): Promise<{ success: boolean; error?: string }> {
    // Implementation to update content
    return { success: true };
  }

  private getTotalTokens(): number {
    return (
      this.courseGenerator.getTotalCost?.() * 100000 + // Rough estimate
      this.lessonGenerator.getTotalTokens() +
      this.quizGenerator.getTotalTokens() +
      this.codeGenerator.getTotalTokens()
    );
  }

  private getTotalCost(): number {
    // Rough cost calculation
    const tokens = this.getTotalTokens();
    return tokens * 0.00001; // Average cost per token
  }

  private printSummary(summary: WeeklySummary): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 WEEKLY SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Week: ${summary.week}, ${summary.year}`);
    console.log(`Tasks Completed: ${summary.tasksCompleted}`);
    console.log(`Tasks Failed: ${summary.tasksFailed}`);
    console.log('\nContent Generated:');
    console.log(`  - Lessons: ${summary.contentGenerated.lessons}`);
    console.log(`  - Code Examples: ${summary.contentGenerated.codeExamples}`);
    console.log(`  - Quizzes: ${summary.contentGenerated.quizzes}`);
    console.log(`\nTotal Tokens: ${summary.totalTokensUsed.toLocaleString()}`);
    console.log(`Estimated Cost: $${summary.totalCost.toFixed(2)}`);
    
    if (summary.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      summary.errors.forEach(err => console.log(`  - ${err}`));
    }
    console.log('=' .repeat(60) + '\n');
  }
}

// ============================================
// CLI Entry Point
// ============================================

async function main() {
  const config: WeeklyGeneratorConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    perplexityApiKey: process.env.PERPLEXITY_API_KEY,
    topics: [
      { topic: 'Large Language Models', category: 'ai-ml-engineering', priority: 'high' },
      { topic: 'Prompt Engineering', category: 'ai-ml-engineering', priority: 'high' },
      { topic: 'RAG Systems', category: 'ai-ml-engineering', priority: 'medium' },
      { topic: 'React 19', category: 'web-development', priority: 'medium' },
      { topic: 'Kubernetes', category: 'devops-sre', priority: 'low' }
    ],
    outputDir: process.env.OUTPUT_DIR || './content'
  };

  if (!config.openaiApiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const generator = new WeeklyContentGenerator(config);
  const summary = await generator.runWeeklyPipeline();

  // Exit with error code if there were failures
  process.exit(summary.tasksFailed > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default WeeklyContentGenerator;
