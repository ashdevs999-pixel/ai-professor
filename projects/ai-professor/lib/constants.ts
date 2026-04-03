// Application Constants

// API Configuration
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  RATE_LIMITS: {
    DEFAULT: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 60 * 1000, // 1 minute
    },
    AUTH: {
      MAX_REQUESTS: 10,
      WINDOW_MS: 60 * 1000,
    },
    AI_GENERATION: {
      FREE: {
        MAX_REQUESTS: 10,
        WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
      },
      BASIC: {
        MAX_REQUESTS: 50,
        WINDOW_MS: 24 * 60 * 60 * 1000,
      },
      PRO: {
        MAX_REQUESTS: 500,
        WINDOW_MS: 24 * 60 * 60 * 1000,
      },
      ENTERPRISE: {
        MAX_REQUESTS: Infinity,
        WINDOW_MS: 0,
      },
    },
  },
} as const

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    courses: 3,
    ai_generations_per_month: 10,
    storage_gb: 1,
    features: ['basic_courses', 'community_support'],
  },
  basic: {
    courses: 10,
    ai_generations_per_month: 100,
    storage_gb: 5,
    features: [
      'basic_courses',
      'ai_assistant',
      'email_support',
      'certificates',
    ],
  },
  pro: {
    courses: Infinity,
    ai_generations_per_month: 1000,
    storage_gb: 25,
    features: [
      'all_courses',
      'advanced_ai',
      'priority_support',
      'analytics',
      'custom_paths',
      'research_updates',
    ],
  },
  enterprise: {
    courses: Infinity,
    ai_generations_per_month: Infinity,
    storage_gb: Infinity,
    features: [
      'all_courses',
      'advanced_ai',
      'priority_support',
      'analytics',
      'custom_paths',
      'research_updates',
      'team_management',
      'custom_courses',
      'api_access',
      'sso',
    ],
  },
} as const

// Course constants
export const COURSE_CONFIG = {
  MIN_DURATION_WEEKS: 1,
  MAX_DURATION_WEEKS: 52,
  DEFAULT_DURATION_WEEKS: 12,
  DIFFICULTY_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert'] as const,
  TOPICS: [
    'Machine Learning',
    'Artificial Intelligence',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'Blockchain',
    'Product Management',
    'UX/UI Design',
    'Business Strategy',
    'Digital Marketing',
    'Finance',
    'Leadership',
  ] as const,
} as const

// Lesson constants
export const LESSON_CONFIG = {
  MIN_DURATION_MINUTES: 5,
  MAX_DURATION_MINUTES: 480, // 8 hours
  DEFAULT_DURATION_MINUTES: 60,
  MAX_CONTENT_LENGTH: 50000, // characters
  RESOURCE_TYPES: ['article', 'video', 'book', 'tool', 'other'] as const,
} as const

// AI Generation constants
export const AI_CONFIG = {
  MODEL: 'gpt-4o',
  MAX_TOKENS: {
    DEFAULT: 2000,
    LESSON_OUTLINE: 1500,
    LESSON_CONTENT: 4000,
    QUIZ: 2000,
    SUMMARY: 1000,
    EXERCISES: 2500,
    RESEARCH: 4000,
  },
  TEMPERATURE: {
    DEFAULT: 0.7,
    CREATIVE: 0.9,
    FACTUAL: 0.3,
  },
  CACHE_DURATION_DAYS: {
    DEFAULT: 7,
    QUIZ: 30,
    SUMMARY: 1,
  },
} as const

// Email constants
export const EMAIL_CONFIG = {
  FROM: process.env.EMAIL_FROM || 'CXO Academy <noreply@cxoacademy.co>',
  TEMPLATES: {
    WELCOME: 'welcome',
    ENROLLMENT_CONFIRMATION: 'enrollment_confirmation',
    COURSE_COMPLETION: 'course_completion',
    SUBSCRIPTION_CONFIRMATION: 'subscription_confirmation',
    PASSWORD_RESET: 'password_reset',
    WEEKLY_RESEARCH: 'weekly_research',
  },
} as const

// Stripe constants
export const STRIPE_CONFIG = {
  CURRENCY: 'usd',
  BILLING_INTERVALS: ['month', 'year'] as const,
  TRIAL_DAYS: 0,
  PRORATION_BEHAVIOR: 'always_invoice',
} as const

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Invalid input data',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INTERNAL_ERROR: 'An unexpected error occurred',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  COURSE_NOT_FOUND: 'Course not found',
  LESSON_NOT_FOUND: 'Lesson not found',
  NOT_ENROLLED: 'You must be enrolled in this course',
  SUBSCRIPTION_REQUIRED: 'This feature requires a subscription upgrade',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  LESSON_CREATED: 'Lesson created successfully',
  LESSON_UPDATED: 'Lesson updated successfully',
  LESSON_DELETED: 'Lesson deleted successfully',
  ENROLLED: 'Successfully enrolled in course',
  PROGRESS_UPDATED: 'Progress updated successfully',
  SUBSCRIPTION_CREATED: 'Subscription activated successfully',
  SUBSCRIPTION_CANCELED: 'Subscription canceled successfully',
} as const

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const
