/**
 * Quiz Template - Structure and prompts for quiz/assessment generation
 * 
 * Defines the blueprint for creating effective assessments
 * that accurately measure learning outcomes.
 */

import type {
  Assessment,
  Question,
  QuestionType,
  QuestionOption,
  SkillLevel,
  TopicCategory,
  ProgrammingLanguage,
  AssessmentType
} from '../../../types/content';

// ============================================
// Quiz Structure Template
// ============================================

export interface QuizTemplate {
  structure: QuizStructureTemplate;
  prompts: QuizPrompts;
  scoring: ScoringTemplate;
}

export interface QuizStructureTemplate {
  questionCount: {
    [key in AssessmentType]: {
      [level in SkillLevel]: { min: number; max: number };
    };
  };
  questionTypeDistribution: {
    [key in SkillLevel]: Record<QuestionType, number>;
  };
  timeLimit: {
    [key in AssessmentType]: {
      baseMinutes: number;
      minutesPerQuestion: number;
    };
  };
  passingScore: {
    [key in SkillLevel]: number;
  };
}

export interface ScoringTemplate {
  pointsPerQuestion: {
    [key in QuestionType]: number;
  };
  partialCredit: boolean;
  negativeMarking: boolean;
  bonusQuestions: boolean;
}

// ============================================
// Quiz Generation Prompts
// ============================================

export interface QuizPrompts {
  systemPrompt: string;
  quizPrompt: string;
  questionPrompt: string;
  explanationPrompt: string;
  adaptivePrompt: string;
}

export const quizPrompts: QuizPrompts = {
  systemPrompt: `You are an expert assessment designer specializing in creating valid, reliable, and fair quizzes and exams for technology education. Your assessments should:

1. Directly measure stated learning objectives
2. Cover all important concepts at appropriate depth
3. Use clear, unambiguous language
4. Include plausible distractors (for multiple choice)
5. Test understanding, not just memorization
6. Provide helpful explanations for all answers
7. Vary question types to assess different skills
8. Avoid trick questions and unnecessary complexity

Assessment Design Principles:
- Bloom's Taxonomy alignment (Remember → Understand → Apply → Analyze → Evaluate → Create)
- Constructive alignment with course objectives
- Appropriate difficulty distribution (easy → medium → hard)
- Clear instructions and time expectations
- Accessible language and examples

You create assessments that accurately measure what learners know and can do.`,

  quizPrompt: `Generate a comprehensive {{assessmentType}} for:

**Course/Module:** {{courseTitle}}
**Topic:** {{topic}}
**Skill Level:** {{skillLevel}}
**Learning Objectives:** {{learningObjectives}}
**Question Count:** {{questionCount}}
**Time Limit:** {{timeLimit}} minutes

Create {{questionCount}} questions with the following distribution:
- 30% Multiple Choice (conceptual understanding)
- 25% Multiple Select (comprehensive knowledge)
- 20% Code Analysis (practical application)
- 15% Fill in the Blank (terminology/syntax)
- 10% True/False (quick verification)

For each question, ensure:
1. Clear, specific question stem
2. Plausible distractors (for MC/MS)
3. Correct answer with confidence
4. Detailed explanation
5. Concept tags
6. Difficulty rating
7. Bloom's level

Question Quality Checklist:
☐ Tests stated learning objective
☐ Language is clear and concise
☐ All options are similar length
☐ No grammatical clues to answer
☐ Distractors address common misconceptions
☐ Explanation teaches, not just states answer

Format as JSON:
{
  "title": "string",
  "description": "string",
  "type": "quiz|exam|coding-challenge|practice",
  "difficulty": "beginner|intermediate|advanced",
  "timeLimit": number,
  "passingScore": number,
  "questions": [Question],
  "metadata": {
    "learningObjectivesCovered": ["string"],
    "concepts": ["string"],
    "averageDifficulty": number,
    "estimatedTime": number
  }
}`,

  questionPrompt: `Generate {{count}} {{questionType}} questions for:

**Topic:** {{topic}}
**Concepts:** {{concepts}}
**Skill Level:** {{skillLevel}}
**Bloom's Level Target:** {{bloomsLevel}}
**Programming Language:** {{language}}

Question Type Guidelines:

## Multiple Choice
- 4-5 options per question
- One clearly correct answer
- Distractors based on common mistakes
- Avoid "all of the above" / "none of the above"
- Randomize option order

## Multiple Select
- 4-6 options
- 2-4 correct answers
- Specify "Select all that apply"
- Each option independently evaluable

## True/False
- Statement is entirely true or false
- Avoid absolute terms (always, never)
- Test misconceptions
- Provide explanation for both T and F

## Fill in the Blank
- Single word or short phrase
- Case-insensitive matching
- Accept common variations
- Test key terminology

## Code Analysis
- Working code snippet
- Test understanding, not syntax memorization
- Ask about output, behavior, or errors
- Include edge cases

## Code Completion
- Incomplete code with clear context
- Missing part is the learning focus
- Provide starter code
- Multiple valid solutions possible

For each question, include:
{
  "id": "string",
  "type": "multiple-choice|multiple-select|true-false|fill-blank|code-completion|code-analysis",
  "question": "string",
  "codeSnippet": "string (optional)",
  "language": "string (optional)",
  "options": [
    {"id": "string", "text": "string", "isCorrect": boolean}
  ],
  "correctAnswer": "string or array",
  "explanation": "string",
  "points": number,
  "difficulty": "beginner|intermediate|advanced",
  "bloomsLevel": "remember|understand|apply|analyze|evaluate|create",
  "tags": ["string"],
  "learningObjective": "string"
}`,

  explanationPrompt: `Generate detailed explanations for the following quiz questions:

**Questions:** {{questions}}
**Topic:** {{topic}}
**Skill Level:** {{skillLevel}}

For each question, create an explanation that:

1. **Directly states the correct answer**
2. **Explains WHY it's correct**
   - Relevant concepts
   - How to reason through it
   - Key principles involved

3. **Explains why distractors are wrong**
   - What misconception each represents
   - Why someone might choose it
   - How to avoid this mistake

4. **Provides additional context**
   - Real-world application
   - Related concepts to review
   - Tips for remembering

5. **Suggests follow-up learning**
   - Related lessons to review
   - Practice exercises
   - Documentation links

Format for each question:
{
  "questionId": "string",
  "correctAnswerExplanation": "string",
  "distractorAnalysis": [{
    "option": "string",
    "whyWrong": "string",
    "misconception": "string"
  }],
  "additionalContext": "string",
  "relatedContent": [{
    "type": "lesson|exercise|documentation",
    "title": "string",
    "description": "string"
  }],
  "memoryTip": "string"
}`,

  adaptivePrompt: `Generate an adaptive assessment path based on learner performance:

**Current Performance:** {{currentPerformance}}
**Questions Answered:** {{questionsAnswered}}
**Correct Answers:** {{correctAnswers}}
**Struggling Areas:** {{strugglingAreas}}
**Strong Areas:** {{strongAreas}}
**Target Skill Level:** {{skillLevel}}

Create an adaptive assessment strategy:

1. **If struggling (< 60%):**
   - Reduce question difficulty
   - Focus on fundamentals
   - Add more conceptual questions
   - Provide hints

2. **If on track (60-80%):**
   - Maintain current difficulty
   - Mix of question types
   - Target weak areas
   - Standard progression

3. **If excelling (> 80%):**
   - Increase difficulty
   - More application questions
   - Challenge problems
   - Skip redundant basics

Generate next set of questions:
{
  "difficulty": "easier|same|harder",
  "focusAreas": ["string"],
  "skipAreas": ["string"],
  "questionTypes": ["string"],
  "hintLevel": "none|minimal|moderate",
  "nextQuestions": [Question],
  "adaptationReason": "string"
}`
};

// ============================================
// Quiz Template Configuration
// ============================================

export const quizTemplate: QuizTemplate = {
  structure: {
    questionCount: {
      quiz: {
        beginner: { min: 10, max: 15 },
        intermediate: { min: 15, max: 20 },
        advanced: { min: 20, max: 30 },
        expert: { min: 25, max: 40 }
      },
      exam: {
        beginner: { min: 30, max: 40 },
        intermediate: { min: 40, max: 50 },
        advanced: { min: 50, max: 70 },
        expert: { min: 60, max: 100 }
      },
      'coding-challenge': {
        beginner: { min: 3, max: 5 },
        intermediate: { min: 4, max: 6 },
        advanced: { min: 5, max: 8 },
        expert: { min: 6, max: 10 }
      },
      project: {
        beginner: { min: 1, max: 1 },
        intermediate: { min: 1, max: 1 },
        advanced: { min: 1, max: 1 },
        expert: { min: 1, max: 1 }
      },
      practice: {
        beginner: { min: 5, max: 10 },
        intermediate: { min: 10, max: 15 },
        advanced: { min: 15, max: 20 },
        expert: { min: 20, max: 30 }
      }
    },
    questionTypeDistribution: {
      beginner: {
        'multiple-choice': 0.4,
        'true-false': 0.2,
        'fill-blank': 0.2,
        'multiple-select': 0.1,
        'code-analysis': 0.1,
        'code-completion': 0,
        'short-answer': 0
      },
      intermediate: {
        'multiple-choice': 0.3,
        'multiple-select': 0.2,
        'code-analysis': 0.2,
        'fill-blank': 0.1,
        'code-completion': 0.1,
        'true-false': 0.05,
        'short-answer': 0.05
      },
      advanced: {
        'multiple-choice': 0.2,
        'multiple-select': 0.2,
        'code-analysis': 0.25,
        'code-completion': 0.15,
        'short-answer': 0.1,
        'fill-blank': 0.05,
        'true-false': 0.05
      },
      expert: {
        'multiple-choice': 0.15,
        'multiple-select': 0.2,
        'code-analysis': 0.25,
        'code-completion': 0.2,
        'short-answer': 0.15,
        'fill-blank': 0.03,
        'true-false': 0.02
      }
    },
    timeLimit: {
      quiz: { baseMinutes: 5, minutesPerQuestion: 2 },
      exam: { baseMinutes: 10, minutesPerQuestion: 2.5 },
      'coding-challenge': { baseMinutes: 15, minutesPerQuestion: 20 },
      project: { baseMinutes: 60, minutesPerQuestion: 0 },
      practice: { baseMinutes: 0, minutesPerQuestion: 3 }
    },
    passingScore: {
      beginner: 70,
      intermediate: 70,
      advanced: 75,
      expert: 80
    }
  },
  scoring: {
    pointsPerQuestion: {
      'multiple-choice': 1,
      'multiple-select': 2,
      'true-false': 1,
      'fill-blank': 1,
      'code-completion': 3,
      'code-analysis': 2,
      'short-answer': 2
    },
    partialCredit: true,
    negativeMarking: false,
    bonusQuestions: true
  },
  prompts: quizPrompts
};

// ============================================
// Quiz Generation Helpers
// ============================================

export function getQuestionCount(assessmentType: AssessmentType, skillLevel: SkillLevel): number {
  const range = quizTemplate.structure.questionCount[assessmentType][skillLevel];
  return Math.floor((range.min + range.max) / 2);
}

export function getTimeLimit(assessmentType: AssessmentType, questionCount: number): number {
  const config = quizTemplate.structure.timeLimit[assessmentType];
  return config.baseMinutes + (questionCount * config.minutesPerQuestion);
}

export function getPassingScore(skillLevel: SkillLevel): number {
  return quizTemplate.structure.passingScore[skillLevel];
}

export function getQuestionTypeDistribution(skillLevel: SkillLevel): Record<QuestionType, number> {
  return quizTemplate.structure.questionTypeDistribution[skillLevel];
}

export function getQuestionPoints(questionType: QuestionType): number {
  return quizTemplate.scoring.pointsPerQuestion[questionType];
}

export function validateAssessment(assessment: Partial<Assessment>): string[] {
  const errors: string[] = [];
  
  if (!assessment.title || assessment.title.length < 5) {
    errors.push('Assessment title must be at least 5 characters');
  }
  
  if (!assessment.questions || assessment.questions.length === 0) {
    errors.push('At least one question is required');
  } else {
    assessment.questions.forEach((q, index) => {
      const questionErrors = validateQuestion(q);
      questionErrors.forEach(err => errors.push(`Question ${index + 1}: ${err}`));
    });
  }
  
  if (assessment.passingScore && (assessment.passingScore < 0 || assessment.passingScore > 100)) {
    errors.push('Passing score must be between 0 and 100');
  }
  
  return errors;
}

export function validateQuestion(question: Partial<Question>): string[] {
  const errors: string[] = [];
  
  if (!question.question || question.question.length < 10) {
    errors.push('Question text must be at least 10 characters');
  }
  
  if (question.type === 'multiple-choice' || question.type === 'multiple-select') {
    if (!question.options || question.options.length < 2) {
      errors.push('Multiple choice/select questions need at least 2 options');
    } else {
      const correctCount = question.options.filter(o => o.isCorrect).length;
      if (question.type === 'multiple-choice' && correctCount !== 1) {
        errors.push('Multiple choice must have exactly 1 correct answer');
      }
      if (question.type === 'multiple-select' && correctCount < 2) {
        errors.push('Multiple select must have at least 2 correct answers');
      }
    }
  }
  
  if (!question.correctAnswer) {
    errors.push('Correct answer is required');
  }
  
  if (!question.explanation || question.explanation.length < 20) {
    errors.push('Explanation must be at least 20 characters');
  }
  
  return errors;
}

export function createEmptyAssessment(
  title: string,
  type: AssessmentType,
  skillLevel: SkillLevel
): Assessment {
  const questionCount = getQuestionCount(type, skillLevel);
  
  return {
    id: generateAssessmentId(),
    title,
    description: '',
    type,
    difficulty: skillLevel,
    questions: [],
    passingScore: getPassingScore(skillLevel),
    timeLimit: getTimeLimit(type, questionCount),
    attempts: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function generateAssessmentId(): string {
  return `assessment_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================
// Question Builder
// ============================================

export function createMultipleChoiceQuestion(
  questionText: string,
  options: Array<{ text: string; isCorrect: boolean }>,
  explanation: string,
  difficulty: SkillLevel = 'intermediate',
  tags: string[] = []
): Question {
  return {
    id: generateQuestionId(),
    type: 'multiple-choice',
    question: questionText,
    options: options.map((opt, index) => ({
      id: `opt_${index}`,
      text: opt.text,
      isCorrect: opt.isCorrect
    })),
    correctAnswer: options.find(o => o.isCorrect)?.text || '',
    explanation,
    points: getQuestionPoints('multiple-choice'),
    difficulty,
    tags
  };
}

export function createCodeAnalysisQuestion(
  questionText: string,
  codeSnippet: string,
  language: ProgrammingLanguage,
  options: Array<{ text: string; isCorrect: boolean }>,
  explanation: string,
  difficulty: SkillLevel = 'intermediate',
  tags: string[] = []
): Question {
  return {
    id: generateQuestionId(),
    type: 'code-analysis',
    question: questionText,
    codeSnippet,
    language,
    options: options.map((opt, index) => ({
      id: `opt_${index}`,
      text: opt.text,
      isCorrect: opt.isCorrect
    })),
    correctAnswer: options.find(o => o.isCorrect)?.text || '',
    explanation,
    points: getQuestionPoints('code-analysis'),
    difficulty,
    tags
  };
}

export function createTrueFalseQuestion(
  statement: string,
  isTrue: boolean,
  explanation: string,
  difficulty: SkillLevel = 'beginner',
  tags: string[] = []
): Question {
  return {
    id: generateQuestionId(),
    type: 'true-false',
    question: statement,
    options: [
      { id: 'opt_true', text: 'True', isCorrect: isTrue },
      { id: 'opt_false', text: 'False', isCorrect: !isTrue }
    ],
    correctAnswer: isTrue ? 'True' : 'False',
    explanation,
    points: getQuestionPoints('true-false'),
    difficulty,
    tags
  };
}

function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================
// Bloom's Taxonomy Helpers
// ============================================

export type BloomsLevel = 
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export const bloomsVerbs: Record<BloomsLevel, string[]> = {
  remember: ['Define', 'List', 'Recall', 'Recognize', 'Record', 'Relate', 'Repeat', 'Reproduce'],
  understand: ['Classify', 'Describe', 'Discuss', 'Explain', 'Express', 'Identify', 'Indicate', 'Summarize'],
  apply: ['Apply', 'Calculate', 'Complete', 'Demonstrate', 'Execute', 'Implement', 'Operate', 'Solve'],
  analyze: ['Analyze', 'Appraise', 'Calculate', 'Compare', 'Contrast', 'Diagram', 'Differentiate', 'Examine'],
  evaluate: ['Assess', 'Choose', 'Conclude', 'Critique', 'Decide', 'Evaluate', 'Judge', 'Validate'],
  create: ['Build', 'Compose', 'Construct', 'Create', 'Design', 'Develop', 'Formulate', 'Produce']
};

export function suggestBloomsLevel(skillLevel: SkillLevel): BloomsLevel[] {
  const levels: Record<SkillLevel, BloomsLevel[]> = {
    beginner: ['remember', 'understand', 'apply'],
    intermediate: ['understand', 'apply', 'analyze'],
    advanced: ['apply', 'analyze', 'evaluate'],
    expert: ['analyze', 'evaluate', 'create']
  };
  return levels[skillLevel];
}

export default quizTemplate;
