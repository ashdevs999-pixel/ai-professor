/**
 * Course Template - Structure and prompts for course generation
 * 
 * Defines the blueprint for creating comprehensive courses
 * with proper structure, pacing, and learning objectives.
 */

import type { 
  Course, 
  CourseMetadata, 
  Module, 
  TopicCategory,
  SkillLevel,
  SEOMetadata
} from '../../../types/content';

// ============================================
// Course Structure Template
// ============================================

export interface CourseTemplate {
  metadata: CourseMetadataTemplate;
  structure: CourseStructureTemplate;
  prompts: CoursePrompts;
}

export interface CourseMetadataTemplate {
  titlePattern: string;
  descriptionGuidelines: string[];
  tagLimits: {
    min: number;
    max: number;
  };
  prerequisiteGuidelines: string[];
  learningObjectiveCount: {
    min: number;
    max: number;
  };
  estimatedHoursRange: {
    min: number;
    max: number;
  };
}

export interface CourseStructureTemplate {
  moduleCount: {
    [key in SkillLevel]: { min: number; max: number };
  };
  lessonsPerModule: {
    min: number;
    max: number;
  };
  assessmentFrequency: 'per-module' | 'per-course' | 'both';
  includeProject: boolean;
  includeCapstone: boolean;
}

// ============================================
// Course Generation Prompts
// ============================================

export interface CoursePrompts {
  systemPrompt: string;
  outlinePrompt: string;
  modulePrompt: string;
  metadataPrompt: string;
  seoPrompt: string;
}

export const coursePrompts: CoursePrompts = {
  systemPrompt: `You are an expert curriculum designer and educational content creator specializing in technology education. Your role is to create comprehensive, well-structured courses that:

1. Follow pedagogical best practices (scaffolding, spaced repetition, active learning)
2. Progress logically from fundamentals to advanced concepts
3. Include practical, hands-on examples and exercises
4. Adapt to the specified skill level
5. Incorporate real-world applications and industry relevance
6. Ensure diversity in examples and use cases
7. Follow SEO best practices for educational content

You have deep expertise in:
- AI/ML Engineering
- Web Development
- Cloud Computing
- Cybersecurity
- DevOps/SRE

Create content that is accurate, engaging, and immediately applicable.`,

  outlinePrompt: `Create a comprehensive course outline for the following:

**Topic:** {{topic}}
**Category:** {{category}}
**Skill Level:** {{skillLevel}}
**Target Duration:** {{estimatedHours}} hours
**Prerequisites:** {{prerequisites}}

Generate a complete course outline with:
1. Course title and compelling description (2-3 paragraphs)
2. 5-8 learning objectives (specific, measurable, achievable)
3. Target audience description
4. Course structure with {{moduleCount}} modules
5. For each module:
   - Module title and description
   - 3-5 lessons per module with titles
   - Estimated duration
   - Key concepts covered
6. Assessment strategy (quizzes, projects, final exam)
7. Recommended resources and tools

Format as JSON matching this structure:
{
  "title": "string",
  "description": "string",
  "targetAudience": "string",
  "learningObjectives": ["string"],
  "prerequisites": ["string"],
  "modules": [{
    "order": number,
    "title": "string",
    "description": "string",
    "duration": number,
    "lessons": [{
      "order": number,
      "title": "string",
      "duration": number
    }],
    "keyConcepts": ["string"]
  }],
  "assessments": [{
    "type": "quiz|project|exam",
    "module": number,
    "description": "string"
  }],
  "resources": ["string"]
}`,

  modulePrompt: `Generate detailed content for Module {{moduleNumber}} of the course "{{courseTitle}}":

**Module Title:** {{moduleTitle}}
**Module Description:** {{moduleDescription}}
**Skill Level:** {{skillLevel}}
**Previous Modules:** {{previousModules}}
**Key Concepts:** {{keyConcepts}}

Create comprehensive module content including:
1. Module introduction (engaging hook, relevance, roadmap)
2. For each lesson:
   - Lesson title and introduction
   - Core content with explanations
   - Code examples (where applicable)
   - Practical exercises
   - Summary and key takeaways
3. Module review and practice activities
4. Self-assessment questions

Ensure:
- Logical flow between lessons
- Progressive complexity
- Real-world examples
- Interactive elements
- Clear explanations appropriate for {{skillLevel}} level

Format as structured JSON.`,

  metadataPrompt: `Generate optimized metadata for the course "{{courseTitle}}":

**Course Description:** {{courseDescription}}
**Category:** {{category}}
**Skill Level:** {{skillLevel}}
**Key Topics:** {{keyTopics}}

Generate:
1. SEO-optimized title (50-60 characters)
2. Meta description (150-160 characters)
3. 10-15 relevant tags
4. 5-8 keywords for search optimization
5. Social media description (280 characters)
6. Short description for course cards (2-3 sentences)

Format as JSON:
{
  "title": "string",
  "slug": "string",
  "metaDescription": "string",
  "tags": ["string"],
  "keywords": ["string"],
  "socialDescription": "string",
  "cardDescription": "string",
  "ogTitle": "string",
  "ogDescription": "string"
}`,

  seoPrompt: `Optimize the following course content for search engines:

**Course Title:** {{courseTitle}}
**Current Description:** {{currentDescription}}
**Category:** {{category}}
**Target Keywords:** {{targetKeywords}}

Provide SEO recommendations for:
1. Title optimization (include primary keyword, compelling)
2. Description optimization (include keywords naturally, compelling CTA)
3. Header structure recommendations (H1, H2, H3 hierarchy)
4. Internal linking suggestions
5. Content length recommendations
6. Featured snippet optimization
7. Schema markup suggestions (Course, EducationalOccupationalCredential)

Format as actionable JSON recommendations.`
};

// ============================================
// Course Template Configuration
// ============================================

export const courseTemplate: CourseTemplate = {
  metadata: {
    titlePattern: '{topic} - From {skillLevel} to {endSkillLevel}',
    descriptionGuidelines: [
      'Start with a compelling hook that addresses learner pain points',
      'Clearly state what learners will achieve',
      'Mention real-world applications',
      'Include time commitment and prerequisites',
      'End with a call to action'
    ],
    tagLimits: {
      min: 5,
      max: 15
    },
    prerequisiteGuidelines: [
      'List technical prerequisites only',
      'Include both required and recommended',
      'Provide links to prerequisite courses when available',
      'Be specific about version numbers and tools'
    ],
    learningObjectiveCount: {
      min: 5,
      max: 10
    },
    estimatedHoursRange: {
      min: 10,
      max: 100
    }
  },
  structure: {
    moduleCount: {
      beginner: { min: 5, max: 8 },
      intermediate: { min: 6, max: 10 },
      advanced: { min: 7, max: 12 },
      expert: { min: 8, max: 15 }
    },
    lessonsPerModule: {
      min: 3,
      max: 6
    },
    assessmentFrequency: 'both',
    includeProject: true,
    includeCapstone: true
  },
  prompts: coursePrompts
};

// ============================================
// Course Generation Helpers
// ============================================

export function getModuleCount(skillLevel: SkillLevel): number {
  const range = courseTemplate.structure.moduleCount[skillLevel];
  return Math.floor((range.min + range.max) / 2);
}

export function validateCourseMetadata(metadata: Partial<CourseMetadata>): string[] {
  const errors: string[] = [];
  
  if (!metadata.title || metadata.title.length < 10) {
    errors.push('Title must be at least 10 characters');
  }
  
  if (!metadata.description || metadata.description.length < 100) {
    errors.push('Description must be at least 100 characters');
  }
  
  if (!metadata.tags || metadata.tags.length < courseTemplate.metadata.tagLimits.min) {
    errors.push(`At least ${courseTemplate.metadata.tagLimits.min} tags required`);
  }
  
  if (!metadata.learningObjectives || 
      metadata.learningObjectives.length < courseTemplate.metadata.learningObjectiveCount.min) {
    errors.push(`At least ${courseTemplate.metadata.learningObjectiveCount.min} learning objectives required`);
  }
  
  if (!metadata.estimatedHours || 
      metadata.estimatedHours < courseTemplate.metadata.estimatedHoursRange.min ||
      metadata.estimatedHours > courseTemplate.metadata.estimatedHoursRange.max) {
    errors.push(`Estimated hours must be between ${courseTemplate.metadata.estimatedHoursRange.min} and ${courseTemplate.metadata.estimatedHoursRange.max}`);
  }
  
  return errors;
}

export function generateCourseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

export function createEmptyCourse(metadata: Partial<CourseMetadata>): Course {
  return {
    metadata: {
      id: generateCourseId(),
      title: metadata.title || '',
      slug: metadata.slug || generateCourseSlug(metadata.title || ''),
      description: metadata.description || '',
      category: metadata.category || 'ai-ml-engineering',
      skillLevel: metadata.skillLevel || 'beginner',
      tags: metadata.tags || [],
      prerequisites: metadata.prerequisites || [],
      learningObjectives: metadata.learningObjectives || [],
      estimatedHours: metadata.estimatedHours || 20,
      author: metadata.author || 'CXO Academy',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      version: '1.0.0',
      seoMetadata: metadata.seoMetadata || createDefaultSEO(metadata)
    },
    modules: [],
    assessments: [],
    resources: []
  };
}

function generateCourseId(): string {
  return `course_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function createDefaultSEO(metadata: Partial<CourseMetadata>): SEOMetadata {
  return {
    title: metadata.title?.substring(0, 60) || '',
    description: metadata.description?.substring(0, 160) || '',
    keywords: metadata.tags || []
  };
}

// ============================================
// Category-Specific Templates
// ============================================

export const categoryTemplates: Record<TopicCategory, {
  defaultTopics: string[];
  commonPrerequisites: string[];
  recommendedTools: string[];
}> = {
  'ai-ml-engineering': {
    defaultTopics: [
      'Machine Learning Fundamentals',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'MLOps',
      'Prompt Engineering',
      'RAG Systems',
      'Model Fine-tuning'
    ],
    commonPrerequisites: [
      'Python programming',
      'Basic statistics',
      'Linear algebra fundamentals',
      'Calculus basics'
    ],
    recommendedTools: [
      'Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 
      'Jupyter', 'Hugging Face', 'OpenAI API', 'LangChain'
    ]
  },
  'web-development': {
    defaultTopics: [
      'HTML/CSS Fundamentals',
      'JavaScript',
      'React/Vue/Angular',
      'Node.js',
      'REST APIs',
      'GraphQL',
      'Web Security',
      'Performance Optimization'
    ],
    commonPrerequisites: [
      'Basic computer skills',
      'Understanding of internet basics'
    ],
    recommendedTools: [
      'VS Code', 'Chrome DevTools', 'Node.js', 
      'npm/yarn', 'Git', 'Postman'
    ]
  },
  'cloud-computing': {
    defaultTopics: [
      'Cloud Fundamentals',
      'AWS/Azure/GCP',
      'Containers & Kubernetes',
      'Serverless',
      'Infrastructure as Code',
      'Cloud Security',
      'Cost Optimization',
      'Multi-cloud Strategies'
    ],
    commonPrerequisites: [
      'Basic networking knowledge',
      'Linux fundamentals',
      'Scripting experience'
    ],
    recommendedTools: [
      'Terraform', 'Docker', 'Kubernetes', 
      'AWS CLI', 'Azure CLI', 'Pulumi'
    ]
  },
  'cybersecurity': {
    defaultTopics: [
      'Security Fundamentals',
      'Network Security',
      'Application Security',
      'Penetration Testing',
      'Security Operations',
      'Compliance & Governance',
      'Incident Response',
      'Threat Intelligence'
    ],
    commonPrerequisites: [
      'Networking basics',
      'Operating system knowledge',
      'Basic scripting'
    ],
    recommendedTools: [
      'Wireshark', 'Metasploit', 'Burp Suite', 
      'Nmap', 'Splunk', 'SIEM tools'
    ]
  },
  'devops-sre': {
    defaultTopics: [
      'DevOps Culture',
      'CI/CD Pipelines',
      'Infrastructure as Code',
      'Monitoring & Observability',
      'Site Reliability Engineering',
      'GitOps',
      'Platform Engineering',
      'Chaos Engineering'
    ],
    commonPrerequisites: [
      'Linux administration',
      'Scripting/programming',
      'Version control (Git)',
      'Basic networking'
    ],
    recommendedTools: [
      'Jenkins/GitHub Actions', 'Terraform', 'Ansible', 
      'Prometheus', 'Grafana', 'Datadog', 'PagerDuty'
    ]
  }
};

export default courseTemplate;
