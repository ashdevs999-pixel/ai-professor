/**
 * Lesson Template - Structure and prompts for lesson generation
 * 
 * Defines the blueprint for creating engaging, educational lessons
 * with proper pacing, examples, and exercises.
 */

import type {
  Lesson,
  LessonContent,
  ContentSection,
  CodeBlock,
  SkillLevel,
  TopicCategory,
  ProgrammingLanguage
} from '../../../types/content';

// ============================================
// Lesson Structure Template
// ============================================

export interface LessonTemplate {
  structure: LessonStructureTemplate;
  prompts: LessonPrompts;
  formatting: LessonFormattingTemplate;
}

export interface LessonStructureTemplate {
  sections: {
    introduction: SectionTemplate;
    coreContent: SectionTemplate;
    codeExamples: SectionTemplate;
    exercises: SectionTemplate;
    summary: SectionTemplate;
  };
  duration: {
    [key in SkillLevel]: {
      minMinutes: number;
      maxMinutes: number;
    };
  };
  codeExampleCount: {
    [key in SkillLevel]: { min: number; max: number };
  };
  exerciseCount: {
    [key in SkillLevel]: { min: number; max: number };
  };
}

export interface SectionTemplate {
  required: boolean;
  minWords: number;
  maxWords: number;
  elements: string[];
}

export interface LessonFormattingTemplate {
  headingStyle: {
    h2: string;
    h3: string;
    h4: string;
  };
  codeBlockStyle: {
    theme: string;
    lineNumbers: boolean;
    highlightLines: boolean;
  };
  calloutTypes: string[];
  includeTableOfContents: boolean;
  includeProgressIndicator: boolean;
}

// ============================================
// Lesson Generation Prompts
// ============================================

export interface LessonPrompts {
  systemPrompt: string;
  contentPrompt: string;
  codeExamplePrompt: string;
  exercisePrompt: string;
  summaryPrompt: string;
  personalizationPrompt: string;
}

export const lessonPrompts: LessonPrompts = {
  systemPrompt: `You are an expert educator and technical writer specializing in creating clear, engaging lesson content for technology topics. Your lessons should:

1. Start with a compelling hook that relates to real-world scenarios
2. Explain concepts in layers: simple → detailed → technical
3. Use analogies and metaphors to clarify complex ideas
4. Include practical, runnable code examples
5. Provide progressive exercises that build confidence
6. Summarize key points for retention
7. Connect to previous and upcoming lessons
8. Adapt language and depth to the target skill level

Writing style guidelines:
- Use active voice and conversational tone
- Break up long paragraphs (max 4-5 sentences)
- Use formatting (bold, lists, headers) for scanability
- Include "Why it matters" sections for motivation
- Address common misconceptions proactively
- Provide context before technical details

You excel at making complex topics accessible without oversimplifying.`,

  contentPrompt: `Create comprehensive lesson content for:

**Lesson Title:** {{lessonTitle}}
**Module Context:** {{moduleContext}}
**Course:** {{courseTitle}}
**Skill Level:** {{skillLevel}}
**Duration:** {{duration}} minutes
**Prerequisites:** {{prerequisites}}
**Learning Objectives:** {{learningObjectives}}

Generate complete lesson content with:

## 1. Introduction (10% of content)
- Engaging hook with real-world relevance
- Connection to previous lessons
- Clear statement of what learners will achieve
- Prerequisite check (if needed)

## 2. Core Content (50% of content)
For each major concept:
- Concept introduction with analogy
- Technical explanation
- Visual description (if helpful)
- Common pitfalls to avoid
- "Try this" micro-exercises

Structure with clear headers:
### Understanding [Concept]
### How [Concept] Works
### [Concept] in Practice

## 3. Code Examples (25% of content)
- 2-4 well-commented code examples
- Progressive complexity
- Expected output shown
- Explanation of key lines

## 4. Practice Exercises (10% of content)
- 2-3 hands-on exercises
- Clear instructions
- Hints available
- Solutions separate

## 5. Summary & Next Steps (5% of content)
- Key takeaways (3-5 bullet points)
- Common questions answered
- Connection to next lesson
- Additional resources

Format as JSON:
{
  "title": "string",
  "slug": "string",
  "introduction": "string",
  "sections": [{
    "id": "string",
    "title": "string",
    "content": "string",
    "type": "text|code|diagram",
    "codeBlock": { optional }
  }],
  "conclusion": "string",
  "summary": "string",
  "keyTakeaways": ["string"],
  "learningObjectives": ["string"],
  "duration": number,
  "difficulty": "beginner|intermediate|advanced"
}`,

  codeExamplePrompt: `Generate {{count}} code examples for the lesson "{{lessonTitle}}":

**Concept Being Taught:** {{concept}}
**Skill Level:** {{skillLevel}}
**Programming Language:** {{language}}
**Previous Examples:** {{previousExamples}}

For each code example, provide:

1. **Example 1: Basic (Foundational)**
   - Simple, minimal example
   - Extensive comments
   - Clear variable names
   - Expected output

2. **Example 2: Intermediate (Practical)**
   - Real-world use case
   - Error handling
   - Best practices
   - Expected output

3. **Example 3: Advanced (Optional, for higher skill levels)**
   - Complex scenario
   - Performance considerations
   - Alternative approaches
   - Expected output

Each example should:
- Be runnable without modification
- Include inline comments explaining key lines
- Follow language conventions and best practices
- Show expected output
- Be 20-50 lines (basic), 50-100 lines (intermediate)

Format as JSON array:
[{
  "title": "string",
  "description": "string",
  "language": "string",
  "code": "string",
  "explanation": "string",
  "expectedOutput": "string",
  "complexity": "basic|intermediate|advanced",
  "tags": ["string"]
}]`,

  exercisePrompt: `Create {{count}} practice exercises for the lesson "{{lessonTitle}}":

**Concepts Covered:** {{concepts}}
**Skill Level:** {{skillLevel}}
**Programming Language:** {{language}}
**Time Available:** {{duration}} minutes

Generate exercises with progressive difficulty:

## Exercise Types to Include:
1. **Conceptual Check** - Test understanding without coding
2. **Code Completion** - Fill in missing parts
3. **Debugging Challenge** - Find and fix bugs
4. **Build from Scratch** - Apply knowledge independently

For each exercise provide:
- Clear, specific instructions
- Starter code (if applicable)
- 2-3 progressive hints
- Complete solution
- Explanation of solution approach
- Estimated time to complete

Format as JSON:
[{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "coding|conceptual|debugging|design",
  "difficulty": "beginner|intermediate|advanced",
  "instructions": ["string"],
  "starterCode": "string (optional)",
  "hints": ["string"],
  "solution": "string",
  "explanation": "string",
  "testCases": [{
    "input": "string",
    "expectedOutput": "string",
    "description": "string"
  }],
  "points": number,
  "estimatedMinutes": number
}]`,

  summaryPrompt: `Generate a comprehensive summary for the lesson "{{lessonTitle}}":

**Lesson Content:** {{lessonContent}}
**Key Concepts:** {{keyConcepts}}
**Skill Level:** {{skillLevel}}

Create:

1. **TL;DR Summary** (2-3 sentences)
2. **Key Takeaways** (5-7 bullet points)
3. **Concept Map** (relationships between concepts)
4. **Common Mistakes to Avoid** (3-5 items)
5. **Quick Reference** (syntax, commands, patterns)
6. **Further Reading** (2-3 curated resources)
7. **Practice Recommendations** (what to try next)

Format as JSON:
{
  "tldr": "string",
  "keyTakeaways": ["string"],
  "conceptMap": {
    "nodes": ["concept"],
    "edges": [["from", "to", "relationship"]]
  },
  "commonMistakes": [{
    "mistake": "string",
    "correction": "string",
    "why": "string"
  }],
  "quickReference": {
    "syntax": [{"code": "string", "description": "string"}],
    "commands": [{"command": "string", "description": "string"}],
    "patterns": [{"name": "string", "description": "string"}]
  },
  "furtherReading": [{
    "title": "string",
    "url": "string",
    "description": "string"
  }],
  "nextSteps": ["string"]
}`,

  personalizationPrompt: `Adapt the following lesson content for a personalized learning experience:

**Original Content:** {{originalContent}}
**Target Skill Level:** {{skillLevel}}
**Learning Style:** {{learningStyle}}
**Known Struggles:** {{struggles}}
**Interests:** {{interests}}
**Preferred Language:** {{preferredLanguage}}

Personalize the content by:

1. **Difficulty Adjustment**
   - Add more foundational explanations (if struggling)
   - Skip basics and dive deeper (if advanced)
   - Provide alternative explanations

2. **Learning Style Adaptation**
   - Visual: Add diagram descriptions, analogies
   - Reading: Expand text explanations
   - Kinesthetic: Add more hands-on exercises
   - Mixed: Balance all approaches

3. **Interest Integration**
   - Use examples related to interests
   - Connect concepts to familiar domains
   - Reference relevant applications

4. **Struggle Addressing**
   - Add extra practice for difficult areas
   - Provide alternative explanations
   - Include confidence-building exercises

Format as JSON with adaptations clearly marked:
{
  "adaptations": [{
    "section": "string",
    "original": "string",
    "adapted": "string",
    "reason": "string"
  }],
  "addedExercises": [Exercise],
  "modifiedExamples": [CodeExample],
  "personalizedSummary": "string"
}`
};

// ============================================
// Lesson Template Configuration
// ============================================

export const lessonTemplate: LessonTemplate = {
  structure: {
    sections: {
      introduction: {
        required: true,
        minWords: 100,
        maxWords: 300,
        elements: ['hook', 'context', 'objectives', 'prerequisites']
      },
      coreContent: {
        required: true,
        minWords: 500,
        maxWords: 2000,
        elements: ['concepts', 'explanations', 'examples', 'diagrams']
      },
      codeExamples: {
        required: true,
        minWords: 0,
        maxWords: 1000,
        elements: ['code', 'explanation', 'output', 'best-practices']
      },
      exercises: {
        required: true,
        minWords: 0,
        maxWords: 500,
        elements: ['instructions', 'starter-code', 'hints', 'solutions']
      },
      summary: {
        required: true,
        minWords: 100,
        maxWords: 300,
        elements: ['key-takeaways', 'next-steps', 'resources']
      }
    },
    duration: {
      beginner: { minMinutes: 15, maxMinutes: 30 },
      intermediate: { minMinutes: 20, maxMinutes: 45 },
      advanced: { minMinutes: 30, maxMinutes: 60 },
      expert: { minMinutes: 45, maxMinutes: 90 }
    },
    codeExampleCount: {
      beginner: { min: 2, max: 3 },
      intermediate: { min: 3, max: 5 },
      advanced: { min: 4, max: 6 },
      expert: { min: 5, max: 8 }
    },
    exerciseCount: {
      beginner: { min: 2, max: 3 },
      intermediate: { min: 3, max: 4 },
      advanced: { min: 3, max: 5 },
      expert: { min: 4, max: 6 }
    }
  },
  prompts: lessonPrompts,
  formatting: {
    headingStyle: {
      h2: '## {title}',
      h3: '### {title}',
      h4: '#### {title}'
    },
    codeBlockStyle: {
      theme: 'github-dark',
      lineNumbers: true,
      highlightLines: true
    },
    calloutTypes: [
      'info',
      'warning',
      'tip',
      'note',
      'advanced',
      'try-this',
      'common-mistake'
    ],
    includeTableOfContents: true,
    includeProgressIndicator: true
  }
};

// ============================================
// Lesson Generation Helpers
// ============================================

export function getLessonDuration(skillLevel: SkillLevel): number {
  const range = lessonTemplate.structure.duration[skillLevel];
  return Math.floor((range.minMinutes + range.maxMinutes) / 2);
}

export function getCodeExampleCount(skillLevel: SkillLevel): number {
  const range = lessonTemplate.structure.codeExampleCount[skillLevel];
  return Math.floor((range.min + range.max) / 2);
}

export function getExerciseCount(skillLevel: SkillLevel): number {
  const range = lessonTemplate.structure.exerciseCount[skillLevel];
  return Math.floor((range.min + range.max) / 2);
}

export function validateLesson(lesson: Partial<Lesson>): string[] {
  const errors: string[] = [];
  
  if (!lesson.title || lesson.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!lesson.content) {
    errors.push('Lesson content is required');
  } else {
    const sections = lessonTemplate.structure.sections;
    
    if (!lesson.content.introduction || 
        lesson.content.introduction.length < sections.introduction.minWords) {
      errors.push('Introduction is too short');
    }
    
    if (!lesson.content.sections || lesson.content.sections.length === 0) {
      errors.push('At least one content section is required');
    }
    
    if (!lesson.content.summary || 
        lesson.content.summary.length < sections.summary.minWords) {
      errors.push('Summary is too short');
    }
  }
  
  if (!lesson.learningObjectives || lesson.learningObjectives.length < 3) {
    errors.push('At least 3 learning objectives required');
  }
  
  if (!lesson.keyTakeaways || lesson.keyTakeaways.length < 3) {
    errors.push('At least 3 key takeaways required');
  }
  
  return errors;
}

export function createEmptyLesson(
  moduleId: string,
  order: number,
  title: string,
  skillLevel: SkillLevel
): Lesson {
  return {
    id: generateLessonId(),
    moduleId,
    order,
    title,
    slug: generateLessonSlug(title),
    description: '',
    content: {
      introduction: '',
      sections: [],
      conclusion: '',
      summary: ''
    },
    codeExamples: [],
    exercises: [],
    resources: [],
    duration: getLessonDuration(skillLevel),
    skillLevel,
    learningObjectives: [],
    keyTakeaways: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  };
}

function generateLessonId(): string {
  return `lesson_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function generateLessonSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// ============================================
// Content Section Builder
// ============================================

export function createContentSection(
  title: string,
  content: string,
  type: ContentSection['type'] = 'text',
  codeBlock?: CodeBlock
): ContentSection {
  return {
    id: `section_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    title,
    content,
    type,
    codeBlock
  };
}

export function createCodeBlock(
  language: ProgrammingLanguage,
  code: string,
  explanation: string,
  filename?: string,
  expectedOutput?: string
): CodeBlock {
  return {
    language,
    code,
    explanation,
    filename,
    runnable: true,
    expectedOutput
  };
}

// ============================================
// Skill-Level Specific Guidance
// ============================================

export const skillLevelGuidance: Record<SkillLevel, {
  explanationDepth: string;
  exampleComplexity: string;
  exerciseType: string;
  terminology: string;
}> = {
  beginner: {
    explanationDepth: 'Explain every concept from first principles. Use analogies extensively. Define all technical terms.',
    exampleComplexity: 'Keep examples under 30 lines. Focus on single concepts. Avoid advanced features.',
    exerciseType: 'Guided exercises with step-by-step instructions. Fill-in-the-blank and multiple choice.',
    terminology: 'Define every term when first used. Provide glossary references. Avoid jargon.'
  },
  intermediate: {
    explanationDepth: 'Build on known fundamentals. Explain new concepts in context. Reference prior knowledge.',
    exampleComplexity: 'Combine multiple concepts. Show real-world patterns. 30-80 lines.',
    exerciseType: 'Semi-guided exercises. Debugging challenges. Small projects.',
    terminology: 'Use standard terminology. Brief reminders for less common terms.'
  },
  advanced: {
    explanationDepth: 'Focus on nuances and edge cases. Compare approaches. Discuss trade-offs.',
    exampleComplexity: 'Production-quality examples. Handle edge cases. Show optimization. 50-150 lines.',
    exerciseType: 'Open-ended challenges. Architecture decisions. Performance optimization.',
    terminology: 'Use expert terminology freely. Reference industry standards.'
  },
  expert: {
    explanationDepth: 'Cut to advanced insights. Focus on cutting-edge developments. Challenge assumptions.',
    exampleComplexity: 'Complex, realistic scenarios. Full implementations. Performance-critical code.',
    exerciseType: 'Research-oriented tasks. Novel problem solving. Contribution to real projects.',
    terminology: 'Use cutting-edge terminology. Reference academic papers and RFCs.'
  }
};

export default lessonTemplate;
