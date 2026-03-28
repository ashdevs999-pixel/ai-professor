// Course Types
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  instructor: Instructor;
  level: CourseLevel;
  duration: string;
  weeklyHours: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  topics: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  curriculum: CurriculumWeek[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CurriculumWeek {
  week: number;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
}

export interface Lesson {
  id: string;
  week: number;
  order: number;
  title: string;
  description: string;
  videoUrl?: string;
  videoDuration?: string;
  content: string;
  codeExamples?: CodeExample[];
  quiz?: Quiz;
  completed?: boolean;
}

export interface CodeExample {
  language: string;
  code: string;
  filename?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// Instructor Types
export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  expertise: string[];
  rating: number;
  courseCount: number;
  studentCount: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  enrolledCourses: EnrolledCourse[];
  certificates: Certificate[];
  createdAt: string;
}

export type UserRole = 'student' | 'instructor' | 'admin';

export interface EnrolledCourse {
  courseId: string;
  course: Course;
  progress: number;
  completedLessons: string[];
  currentLesson?: string;
  enrolledAt: string;
  lastAccessedAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  credentialUrl: string;
}

// Review Types
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter Types
export interface CourseFilters {
  search?: string;
  level?: CourseLevel;
  topics?: string[];
  sortBy?: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';
  page?: number;
}

// Pricing Types
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
  cta: string;
}

// UI Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
