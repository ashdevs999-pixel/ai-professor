/**
 * CXO Academy - Intelligent Content Generation System
 * 
 * Main entry point for the AI content generation library.
 */

// ============================================
// Type Exports
// ============================================

export * from './types/content';
export * from './types/ai';

// ============================================
// Generator Exports
// ============================================

export { 
  CourseGenerator, 
  getCourseGenerator,
  type CourseGeneratorConfig 
} from './lib/ai/course-generator';

export { 
  LessonGenerator, 
  getLessonGenerator,
  type LessonGeneratorConfig 
} from './lib/ai/lesson-generator';

export { 
  QuizGenerator, 
  getQuizGenerator,
  type QuizGeneratorConfig 
} from './lib/ai/quiz-generator';

export { 
  CodeExamplesGenerator, 
  getCodeExamplesGenerator,
  type CodeExamplesConfig 
} from './lib/ai/code-examples';

export { 
  ResearchAgent, 
  getResearchAgent,
  TopicMonitor,
  type ResearchAgentConfig 
} from './lib/ai/research-agent';

// ============================================
// Template Exports
// ============================================

export { 
  courseTemplate, 
  coursePrompts, 
  categoryTemplates,
  validateCourseMetadata,
  generateCourseSlug,
  createEmptyCourse,
  getModuleCount
} from './lib/ai/templates/course-template';

export { 
  lessonTemplate, 
  lessonPrompts, 
  skillLevelGuidance,
  validateLesson,
  createEmptyLesson,
  getLessonDuration,
  getCodeExampleCount,
  getExerciseCount,
  createContentSection,
  createCodeBlock
} from './lib/ai/templates/lesson-template';

export { 
  quizTemplate, 
  quizPrompts,
  validateAssessment,
  validateQuestion,
  getQuestionCount,
  getTimeLimit,
  getPassingScore,
  getQuestionTypeDistribution,
  getQuestionPoints,
  createMultipleChoiceQuestion,
  createCodeAnalysisQuestion,
  createTrueFalseQuestion,
  suggestBloomsLevel,
  bloomsVerbs,
  type BloomsLevel
} from './lib/ai/templates/quiz-template';

export { 
  codeTemplate, 
  codePrompts,
  validateCodeExample,
  getCodeComplexity,
  getRequiredElements,
  getTestRequirements,
  getLanguageStandard,
  createHeaderCodeBlock
} from './lib/ai/templates/code-template';

// ============================================
// Script Exports
// ============================================

export { 
  WeeklyContentGenerator,
  type WeeklyGeneratorConfig,
  type WeeklySummary
} from './scripts/generate-weekly-content';

export { 
  ContentUpdater,
  type ContentUpdaterConfig,
  type ContentAudit,
  type UpdateReport
} from './scripts/update-existing-courses';

export { 
  TopicResearcher,
  type ResearchConfig,
  type ResearchReport,
  type ContentOpportunity,
  type KnowledgeGap
} from './scripts/research-topics';

// ============================================
// Convenience Functions
// ============================================

import { getCourseGenerator } from './lib/ai/course-generator';
import { getLessonGenerator } from './lib/ai/lesson-generator';
import { getQuizGenerator } from './lib/ai/quiz-generator';
import { getCodeExamplesGenerator } from './lib/ai/code-examples';
import { getResearchAgent } from './lib/ai/research-agent';

import type { TopicCategory, SkillLevel, ProgrammingLanguage } from './types/content';

/**
 * Initialize all generators with a single configuration
 */
export function initializeGenerators(config: {
  openaiApiKey: string;
  perplexityApiKey?: string;
  cacheEnabled?: boolean;
}) {
  return {
    course: getCourseGenerator({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey,
      cacheEnabled: config.cacheEnabled
    }),
    lesson: getLessonGenerator({
      openaiApiKey: config.openaiApiKey,
      cacheEnabled: config.cacheEnabled
    }),
    quiz: getQuizGenerator({
      openaiApiKey: config.openaiApiKey,
      cacheEnabled: config.cacheEnabled
    }),
    code: getCodeExamplesGenerator({
      openaiApiKey: config.openaiApiKey,
      cacheEnabled: config.cacheEnabled
    }),
    research: getResearchAgent({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey,
      cacheResults: config.cacheEnabled
    })
  };
}

/**
 * Quick content generation helper
 */
export async function generateQuickContent(
  topic: string,
  category: TopicCategory,
  skillLevel: SkillLevel,
  apiKey: string
) {
  const generators = initializeGenerators({
    openaiApiKey: apiKey,
    cacheEnabled: true
  });

  // Research the topic
  const research = await generators.research.researchLatestDevelopments(
    topic,
    category,
    'week'
  );

  // Generate a lesson
  const lesson = await generators.lesson.generateLesson(
    `Introduction to ${topic}`,
    topic,
    category,
    skillLevel
  );

  // Generate code examples
  const codeExamples = await generators.code.generateExamples(
    topic,
    'python',
    skillLevel,
    { count: 2 }
  );

  // Generate a quiz
  const quiz = await generators.quiz.generateAssessment(
    `${topic} Quiz`,
    topic,
    category,
    'quiz',
    skillLevel
  );

  return {
    research,
    lesson,
    codeExamples,
    quiz
  };
}

// Default export
export default {
  initializeGenerators,
  generateQuickContent,
  getCourseGenerator,
  getLessonGenerator,
  getQuizGenerator,
  getCodeExamplesGenerator,
  getResearchAgent
};
