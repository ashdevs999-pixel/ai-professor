/**
 * Code Template - Structure and prompts for code example generation
 * 
 * Defines the blueprint for creating educational code examples
 * that are clear, working, and pedagogically effective.
 */

import type {
  CodeExample,
  CodeBlock,
  TestCase,
  ProgrammingLanguage,
  SkillLevel,
  TopicCategory
} from '../../../types/content';

// ============================================
// Code Structure Template
// ============================================

export interface CodeTemplate {
  structure: CodeStructureTemplate;
  prompts: CodePrompts;
  standards: CodeStandardsTemplate;
}

export interface CodeStructureTemplate {
  complexity: {
    [key in SkillLevel]: {
      minLines: number;
      maxLines: number;
      maxComplexity: 'low' | 'medium' | 'high';
    };
  };
  requiredElements: {
    [key in SkillLevel]: string[];
  };
  testingRequirements: {
    [key in SkillLevel]: {
      minTestCases: number;
      requireEdgeCases: boolean;
      requireErrorHandling: boolean;
    };
  };
}

export interface CodeStandardsTemplate {
  languages: Record<ProgrammingLanguage, LanguageStandard>;
  generalPrinciples: string[];
  commentGuidelines: CommentGuidelines;
}

export interface LanguageStandard {
  styleGuide: string;
  linter: string;
  formatter: string;
  namingConventions: NamingConventions;
  bestPractices: string[];
}

export interface NamingConventions {
  variables: string;
  functions: string;
  classes: string;
  constants: string;
  files: string;
}

export interface CommentGuidelines {
  headerComment: boolean;
  inlineCommentFrequency: 'minimal' | 'moderate' | 'extensive';
  docstrings: boolean;
  todoFormat: string;
}

// ============================================
// Code Generation Prompts
// ============================================

export interface CodePrompts {
  systemPrompt: string;
  codeExamplePrompt: string;
  explanationPrompt: string;
  testCasePrompt: string;
  refactorPrompt: string;
  debugPrompt: string;
}

export const codePrompts: CodePrompts = {
  systemPrompt: `You are an expert software engineer and technical educator who creates exceptional code examples for learning. Your code should:

1. **Be immediately runnable** - No placeholders or "implement this" sections
2. **Follow best practices** - Industry-standard patterns and conventions
3. **Progress in complexity** - Start simple, add complexity gradually
4. **Include comprehensive comments** - Explain the "why", not just the "what"
5. **Handle errors gracefully** - Show real-world error handling
6. **Be production-conscious** - Mention security, performance, scalability
7. **Demonstrate good practices** - Testing, documentation, maintainability

Code Quality Standards:
- Clear, descriptive naming
- Consistent formatting
- Appropriate abstraction levels
- No clever tricks that confuse learners
- Explicit is better than implicit
- Show the straightforward solution first

Your examples should be worthy of being in a textbook - clear, correct, and instructive.`,

  codeExamplePrompt: `Generate {{count}} code examples for teaching:

**Concept:** {{concept}}
**Skill Level:** {{skillLevel}}
**Programming Language:** {{language}}
**Context:** {{context}}
**Previous Examples:** {{previousExamples}}

Create {{count}} progressive examples:

## Example 1: Basic/Foundation (if skillLevel != expert)
- Minimal, focused on single concept
- Extensive comments explaining each line
- Simple, predictable output
- 15-30 lines
- No error handling yet

## Example 2: Practical Application
- Real-world use case
- Proper error handling
- Best practices applied
- 30-60 lines
- Configuration options

## Example 3: Production-Ready (if skillLevel >= intermediate)
- Complete, robust implementation
- Comprehensive error handling
- Performance considerations
- Testing examples
- 60-150 lines

For each example provide:
{
  "title": "Descriptive title",
  "description": "What this example demonstrates",
  "language": "string",
  "code": "The complete, runnable code",
  "explanation": "Detailed explanation of approach",
  "lineByLine": [
    {"line": number, "explanation": "string"}
  ],
  "expectedOutput": "What running this produces",
  "complexity": "basic|intermediate|advanced",
  "concepts": ["concepts demonstrated"],
  "prerequisites": ["what you need to know first"],
  "extensions": ["how to extend this"],
  "commonMistakes": ["mistakes to avoid"],
  "testCases": [{
    "description": "string",
    "input": "string",
    "expectedOutput": "string"
  }]
}

Code Guidelines:
- Use meaningful variable names (not x, y, temp)
- Add comments for non-obvious logic
- Include shebang/imports for complete runnable code
- Show expected output as comments
- Follow language-specific conventions
- Handle common edge cases
- Include type hints/annotations where applicable`,

  explanationPrompt: `Provide a comprehensive explanation for this code:

**Code:**
\`\`\`{{language}}
{{code}}
\`\`\`

**Context:** {{context}}
**Skill Level:** {{skillLevel}}

Create an explanation with:

## 1. Overview (2-3 sentences)
- What this code does
- Why it's useful
- Key concepts demonstrated

## 2. Prerequisites
- What you need to understand first
- Required imports/packages
- Environment setup if needed

## 3. Line-by-Line Walkthrough
For important sections:
- What the code does
- Why it's written this way
- Alternative approaches

## 4. Key Concepts
Explain each concept used:
- Definition
- How it's applied here
- Where else it's used

## 5. Common Pitfalls
- What could go wrong
- How to avoid issues
- Debugging tips

## 6. Extensions
- How to modify for different use cases
- Performance improvements
- Additional features

## 7. Related Patterns
- Similar code patterns
- When to use each

Format as structured JSON with all sections.`,

  testCasePrompt: `Generate comprehensive test cases for this code:

**Code:**
\`\`\`{{language}}
{{code}}
\`\`\`

**Purpose:** {{purpose}}
**Skill Level:** {{skillLevel}}

Create test cases covering:

## 1. Happy Path Tests (50%)
- Normal inputs with expected outputs
- Various valid input ranges
- Boundary values

## 2. Edge Cases (30%)
- Empty inputs
- Single element
- Maximum size
- Boundary values
- Unicode/special characters

## 3. Error Cases (20%)
- Invalid inputs
- Type mismatches
- Out of bounds
- Null/undefined handling

For each test case:
{
  "id": "test_001",
  "description": "What is being tested",
  "category": "happy|edge|error",
  "input": "The input (formatted appropriately)",
  "expectedOutput": "Expected result or error",
  "explanation": "Why this test matters",
  "assertion": "Specific assertion to make"
}

Provide at least {{minTestCases}} test cases.

Also include:
- Test setup/teardown if needed
- Mock data examples
- Performance test suggestions`,

  refactorPrompt: `Refactor this code to improve quality while maintaining functionality:

**Original Code:**
\`\`\`{{language}}
{{code}}
\`\`\`

**Issues to Address:** {{issues}}
**Skill Level:** {{skillLevel}}

Refactor focusing on:

## 1. Readability
- Clearer variable/function names
- Better code organization
- Improved comments
- Consistent formatting

## 2. Maintainability
- Reduce duplication (DRY)
- Single responsibility
- Modular design
- Dependency injection

## 3. Performance
- Algorithm optimization
- Memory efficiency
- Lazy evaluation
- Caching opportunities

## 4. Error Handling
- Comprehensive error checking
- Meaningful error messages
- Graceful degradation
- Input validation

## 5. Testing
- Make code more testable
- Dependency injection
- Pure functions where possible

Provide:
{
  "refactoredCode": "string",
  "changes": [{
    "type": "readability|maintainability|performance|error-handling|testing",
    "original": "string",
    "refactored": "string",
    "reason": "string",
    "impact": "string"
  }],
  "metricsBefore": {
    "lines": number,
    "cyclomaticComplexity": number,
    "maintainabilityIndex": number
  },
  "metricsAfter": {
    "lines": number,
    "cyclomaticComplexity": number,
    "maintainabilityIndex": number
  },
  "tradeoffs": ["any compromises made"],
  "furtherImprovements": ["additional refactor opportunities"]
}`,

  debugPrompt: `Debug and fix this code:

**Code:**
\`\`\`{{language}}
{{code}}
\`\`\`

**Expected Behavior:** {{expectedBehavior}}
**Actual Behavior:** {{actualBehavior}}
**Error Messages:** {{errors}}

Analyze and fix:

## 1. Problem Identification
- Identify all bugs
- Categorize by severity
- Root cause analysis

## 2. Debugging Process
- How to reproduce
- What to check first
- Tools/techniques to use

## 3. Solutions
For each bug:
- What's wrong
- Why it's wrong
- How to fix it
- Prevention strategies

## 4. Corrected Code
Provide the fixed version with:
- Changes highlighted
- Comments explaining fixes
- Test cases to prevent regression

## 5. Prevention
- How this bug could be prevented
- Code review checklist
- Testing recommendations

Format as JSON with:
{
  "bugs": [{
    "line": number,
    "type": "syntax|logic|runtime|performance|security",
    "severity": "critical|major|minor",
    "description": "string",
    "cause": "string",
    "fix": "string"
  }],
  "correctedCode": "string",
  "debuggingSteps": ["string"],
  "testCases": [TestCase],
  "preventionTips": ["string"]
}`
};

// ============================================
// Code Template Configuration
// ============================================

export const codeTemplate: CodeTemplate = {
  structure: {
    complexity: {
      beginner: {
        minLines: 10,
        maxLines: 30,
        maxComplexity: 'low'
      },
      intermediate: {
        minLines: 20,
        maxLines: 80,
        maxComplexity: 'medium'
      },
      advanced: {
        minLines: 40,
        maxLines: 150,
        maxComplexity: 'high'
      },
      expert: {
        minLines: 50,
        maxLines: 300,
        maxComplexity: 'high'
      }
    },
    requiredElements: {
      beginner: [
        'header comment',
        'inline comments for key lines',
        'expected output',
        'simple error handling'
      ],
      intermediate: [
        'header comment with description',
        'docstrings/doc comments',
        'error handling',
        'input validation',
        'type hints/annotations',
        'example usage'
      ],
      advanced: [
        'comprehensive documentation',
        'robust error handling',
        'logging',
        'configuration options',
        'performance considerations',
        'security considerations',
        'test examples'
      ],
      expert: [
        'production-ready documentation',
        'comprehensive error handling',
        'logging and monitoring',
        'configuration management',
        'performance optimization',
        'security hardening',
        'scalability considerations',
        'complete test suite'
      ]
    },
    testingRequirements: {
      beginner: {
        minTestCases: 2,
        requireEdgeCases: false,
        requireErrorHandling: false
      },
      intermediate: {
        minTestCases: 4,
        requireEdgeCases: true,
        requireErrorHandling: true
      },
      advanced: {
        minTestCases: 6,
        requireEdgeCases: true,
        requireErrorHandling: true
      },
      expert: {
        minTestCases: 10,
        requireEdgeCases: true,
        requireErrorHandling: true
      }
    }
  },
  standards: {
    languages: {
      python: {
        styleGuide: 'PEP 8',
        linter: 'ruff',
        formatter: 'black',
        namingConventions: {
          variables: 'snake_case',
          functions: 'snake_case',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'snake_case.py'
        },
        bestPractices: [
          'Use type hints',
          'Write docstrings',
          'Use context managers',
          'Prefer composition over inheritance',
          'Use list/dict comprehensions judiciously'
        ]
      },
      javascript: {
        styleGuide: 'Airbnb / Standard',
        linter: 'eslint',
        formatter: 'prettier',
        namingConventions: {
          variables: 'camelCase',
          functions: 'camelCase',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'kebab-case.js'
        },
        bestPractices: [
          'Use const/let, not var',
          'Prefer arrow functions',
          'Use async/await',
          'Destructure assignments',
          'Use optional chaining'
        ]
      },
      typescript: {
        styleGuide: 'TypeScript Handbook',
        linter: 'eslint',
        formatter: 'prettier',
        namingConventions: {
          variables: 'camelCase',
          functions: 'camelCase',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'kebab-case.ts'
        },
        bestPractices: [
          'Prefer interfaces for object shapes',
          'Use strict mode',
          'Avoid any type',
          'Use union types',
          'Leverage type inference'
        ]
      },
      java: {
        styleGuide: 'Google Java Style',
        linter: 'checkstyle',
        formatter: 'google-java-format',
        namingConventions: {
          variables: 'camelCase',
          functions: 'camelCase',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'PascalCase.java'
        },
        bestPractices: [
          'Use Optional for nullable returns',
          'Prefer immutability',
          'Use streams for collections',
          'Follow effective Java guidelines',
          'Use dependency injection'
        ]
      },
      go: {
        styleGuide: 'Effective Go',
        linter: 'golangci-lint',
        formatter: 'gofmt',
        namingConventions: {
          variables: 'camelCase',
          functions: 'PascalCase (exported) / camelCase',
          classes: 'N/A',
          constants: 'PascalCase / camelCase',
          files: 'lowercase.go'
        },
        bestPractices: [
          'Handle errors explicitly',
          'Defer cleanup operations',
          'Use goroutines judiciously',
          'Prefer channels for communication',
          'Keep interfaces small'
        ]
      },
      rust: {
        styleGuide: 'Rust API Guidelines',
        linter: 'clippy',
        formatter: 'rustfmt',
        namingConventions: {
          variables: 'snake_case',
          functions: 'snake_case',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'lowercase.rs'
        },
        bestPractices: [
          'Leverage ownership system',
          'Use Result for error handling',
          'Prefer iterators',
          'Document public APIs',
          'Avoid unwrap in production'
        ]
      },
      sql: {
        styleGuide: 'SQL Style Guide',
        linter: 'sqlfluff',
        formatter: 'sqlfluff',
        namingConventions: {
          variables: 'snake_case',
          functions: 'snake_case',
          classes: 'N/A',
          constants: 'N/A',
          files: 'kebab-case.sql'
        },
        bestPractices: [
          'Use meaningful table names',
          'Always specify columns',
          'Use parameterized queries',
          'Index strategically',
          'Avoid SELECT *'
        ]
      },
      bash: {
        styleGuide: 'Google Shell Style Guide',
        linter: 'shellcheck',
        formatter: 'shfmt',
        namingConventions: {
          variables: 'UPPER_SNAKE_CASE',
          functions: 'lowercase_with_underscores',
          classes: 'N/A',
          constants: 'UPPER_SNAKE_CASE',
          files: 'kebab-case.sh'
        },
        bestPractices: [
          'Use shellcheck',
          'Quote variables',
          'Use set -euo pipefail',
          'Prefer [[ ]]',
          'Use functions for reuse'
        ]
      },
      other: {
        styleGuide: 'Language-specific guidelines',
        linter: 'default',
        formatter: 'default',
        namingConventions: {
          variables: 'camelCase',
          functions: 'camelCase',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
          files: 'lowercase'
        },
        bestPractices: []
      }
    },
    generalPrinciples: [
      'Write self-documenting code',
      'Keep functions small and focused',
      'Use meaningful names',
      'Avoid magic numbers',
      'Handle errors gracefully',
      'Write testable code',
      'Follow the principle of least surprise',
      'Document public interfaces',
      'Keep it simple (KISS)',
      "Don't repeat yourself (DRY)"
    ],
    commentGuidelines: {
      headerComment: true,
      inlineCommentFrequency: 'moderate',
      docstrings: true,
      todoFormat: 'TODO(username): Description'
    }
  },
  prompts: codePrompts
};

// ============================================
// Code Generation Helpers
// ============================================

export function getCodeComplexity(skillLevel: SkillLevel): {
  minLines: number;
  maxLines: number;
  maxComplexity: string;
} {
  return codeTemplate.structure.complexity[skillLevel];
}

export function getRequiredElements(skillLevel: SkillLevel): string[] {
  return codeTemplate.structure.requiredElements[skillLevel];
}

export function getTestRequirements(skillLevel: SkillLevel): {
  minTestCases: number;
  requireEdgeCases: boolean;
  requireErrorHandling: boolean;
} {
  return codeTemplate.structure.testingRequirements[skillLevel];
}

export function getLanguageStandard(language: ProgrammingLanguage): LanguageStandard {
  return codeTemplate.standards.languages[language];
}

export function validateCodeExample(example: Partial<CodeExample>): string[] {
  const errors: string[] = [];
  
  if (!example.title || example.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!example.code || example.code.length < 10) {
    errors.push('Code must be provided');
  }
  
  if (!example.language) {
    errors.push('Programming language is required');
  }
  
  if (!example.explanation || example.explanation.length < 20) {
    errors.push('Explanation must be at least 20 characters');
  }
  
  // Check for required elements based on complexity
  const requiredElements = getRequiredElements(example.complexity || 'beginner');
  if (example.complexity === 'advanced' || example.complexity === 'intermediate') {
    if (!example.testCases || example.testCases.length === 0) {
      errors.push('Test cases are required for intermediate/advanced examples');
    }
  }
  
  return errors;
}

export function createEmptyCodeExample(
  title: string,
  language: ProgrammingLanguage,
  complexity: SkillLevel = 'intermediate'
): CodeExample {
  return {
    id: generateCodeExampleId(),
    lessonId: '',
    title,
    description: '',
    language,
    code: '',
    explanation: '',
    complexity: complexity === 'beginner' ? 'basic' : 
                complexity === 'intermediate' ? 'intermediate' : 'advanced',
    tags: [],
    prerequisites: [],
    testCases: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function generateCodeExampleId(): string {
  return `code_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================
// Code Snippet Builders
// ============================================

export function createHeaderCodeBlock(
  language: ProgrammingLanguage,
  title: string,
  description: string
): string {
  const commentStyle = getCommentStyle(language);
  return `${commentStyle.start} ${title}
${commentStyle.start} ${description}
${commentStyle.start}
${commentStyle.start} Language: ${language}
${commentStyle.start} Generated: ${new Date().toISOString()}
`;
}

function getCommentStyle(language: ProgrammingLanguage): {
  start: string;
  end?: string;
  inline: string;
} {
  const styles: Record<ProgrammingLanguage, { start: string; end?: string; inline: string }> = {
    python: { start: '#', inline: '#' },
    javascript: { start: '/**', end: ' */', inline: '//' },
    typescript: { start: '/**', end: ' */', inline: '//' },
    java: { start: '/**', end: ' */', inline: '//' },
    go: { start: '//', inline: '//' },
    rust: { start: '//!', inline: '//' },
    sql: { start: '--', inline: '--' },
    bash: { start: '#', inline: '#' },
    other: { start: '#', inline: '#' }
  };
  return styles[language];
}

export function formatCodeWithComments(
  code: string,
  language: ProgrammingLanguage,
  comments: Array<{ line: number; text: string }>
): string {
  const lines = code.split('\n');
  const commentStyle = getCommentStyle(language);
  
  // Sort comments by line in reverse to insert from bottom
  const sortedComments = [...comments].sort((a, b) => b.line - a.line);
  
  for (const comment of sortedComments) {
    if (comment.line >= 0 && comment.line <= lines.length) {
      lines.splice(comment.line, 0, `${commentStyle.inline} ${comment.text}`);
    }
  }
  
  return lines.join('\n');
}

// ============================================
// Test Case Generation
// ============================================

export function generateBasicTestCases(
  functionName: string,
  inputType: string,
  outputType: string
): Partial<TestCase>[] {
  return [
    {
      id: `test_${functionName}_basic`,
      input: `<${inputType} example>`,
      expectedOutput: `<${outputType} expected>`,
      description: `Basic test for ${functionName} with valid input`
    },
    {
      id: `test_${functionName}_edge`,
      input: `<edge case ${inputType}>`,
      expectedOutput: `<${outputType} for edge case>`,
      description: `Edge case test for ${functionName}`
    }
  ];
}

export default codeTemplate;
