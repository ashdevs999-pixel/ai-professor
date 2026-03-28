# Pulse + AI Professor - Technical Architecture Document

**Version:** 1.0.0
**Last Updated:** 2026-03-26
**Status:** Ready for Implementation

**Platform:** Pulse + AI Professor
**Tagline:** Stay current. Get smarter. One platform.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Architecture](#2-system-architecture)
3. [Database Schema](#3-database-schema)
4. [API Endpoints](#4-api-endpoints)
5. [File/Folder Structure](#5-filefolder-structure)
6. [Integration Specifications](#6-integration-specifications)
7. [Security Considerations](#7-security-considerations)
8. [Deployment Checklist](#8-deployment-checklist)

---

## 1. System Overview

### 1.1 Purpose

Pulse + AI Professor is a dual-feature platform that enables:
- **Pulse News:** Real-time AI news aggregation from 19 trusted sources with AI-powered summaries
- **AI Professor:** AI-powered learning with expert-led courses and certificates
- **Course Creation:** Instructors create and manage courses with AI assistance
- **AI-Generated Content:** GPT-4o generates lessons, quizzes, explanations, and summaries
- **Student Learning:** Progress tracking, quizzes, certificates
- **Monetization:** Stripe-powered subscriptions and one-time course purchases

### 1.2 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+ App Router | React-based UI with Server Components |
| Backend | Next.js API Routes | Serverless REST endpoints |
| Database | Supabase (PostgreSQL) | Primary data store + Auth + RLS |
| AI | OpenAI GPT-4o | Content generation, tutoring |
| Payments | Stripe | Subscriptions, one-time purchases |
| Email | Resend | Transactional emails, notifications |
| Hosting | Vercel | Edge deployment, auto-scaling |

### 1.3 Key Features

- User authentication (email/password, OAuth)
- Role-based access (Student, Instructor, Admin)
- Course catalog with categories and search
- AI-assisted lesson generation
- Interactive quizzes with instant feedback
- Progress tracking and analytics
- Certificate generation upon completion
- Subscription plans + individual course purchases
- Email notifications (welcome, enrollment, completion)

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐     │
│   │   Web Browser    │    │   Mobile Web     │    │   Tablet Web     │     │
│   │  (Next.js SSR)   │    │  (Responsive)    │    │  (Responsive)    │     │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘     │
│            │                       │                       │                │
└────────────┼───────────────────────┼───────────────────────┼────────────────┘
             │                       │                       │
             └───────────────────────┼───────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE NETWORK                                │
│                      (CDN + Edge Functions + SSL)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                  │
│                        (Next.js 14+ App Router)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    SERVER COMPONENTS (RSC)                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │   /app       │  │   /courses   │  │   /dashboard │              │    │
│  │  │   (landing)  │  │   (catalog)  │  │   (learn)    │              │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    CLIENT COMPONENTS                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │   Search     │  │   Quiz UI    │  │   Video      │              │    │
│  │  │   Filters    │  │   Player     │  │   Progress   │              │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                      API ROUTES (/api/*)                            │    │
│  │                                                                     │    │
│  │  /auth/*    /courses/*    /lessons/*    /ai/*    /payments/*       │    │
│  │  /users/*   /enroll/*     /progress/*   /quiz/*   /webhooks/*      │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE (middleware.ts)                       │    │
│  │  - Auth token verification                                          │    │
│  │  - Route protection                                                 │    │
│  │  - Rate limiting headers                                            │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│                   │   │                   │   │                   │
│     SUPABASE      │   │     OPENAI        │   │     STRIPE        │
│                   │   │                   │   │                   │
│  ┌─────────────┐  │   │  ┌─────────────┐  │   │  ┌─────────────┐  │
│  │ PostgreSQL  │  │   │  │   GPT-4o    │  │   │  │  Customers  │  │
│  │  Database   │  │   │  │   API       │  │   │  │  Products   │  │
│  └─────────────┘  │   │  └─────────────┘  │   │  │  Prices     │  │
│                   │   │                   │   │  │  Subs       │  │
│  ┌─────────────┐  │   │  ┌─────────────┐  │   │  └─────────────┘  │
│  │    Auth     │  │   │  │  Embedding  │  │   │                   │
│  │   Service   │  │   │  │   API       │  │   │  ┌─────────────┐  │
│  └─────────────┘  │   │  └─────────────┘  │   │  │  Checkout   │  │
│                   │   │                   │   │  │  Sessions   │  │
│  ┌─────────────┐  │   │  ┌─────────────┐  │   │  └─────────────┘  │
│  │    RLS      │  │   │  │   Models    │  │   │                   │
│  │  Policies   │  │   │  │   List      │  │   │  ┌─────────────┐  │
│  └─────────────┘  │   │  └─────────────┘  │   │  │  Webhooks   │  │
│                   │   │                   │   │  └─────────────┘  │
└───────────────────┘   └───────────────────┘   └───────────────────┘
            │                        │
            │                        │
            ▼                        │
┌───────────────────┐                │
│                   │                │
│      RESEND       │                │
│   (Email API)     │                │
│                   │                │
│  ┌─────────────┐  │                │
│  │ Transactional│  │                │
│  │   Emails    │  │                │
│  └─────────────┘  │                │
│                   │                │
│  ┌─────────────┐  │                │
│  │  Templates  │  │                │
│  └─────────────┘  │                │
│                   │                │
└───────────────────┘                │
                                     │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW EXAMPLES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER AUTHENTICATION:                                                     │
│     Client → /api/auth/login → Supabase Auth → JWT Token → Client           │
│                                                                              │
│  2. COURSE CREATION (with AI):                                               │
│     Instructor → /api/courses/create → Supabase (insert)                    │
│                → /api/ai/generate-outline → OpenAI → Supabase (update)      │
│                                                                              │
│  3. STUDENT ENROLLMENT:                                                      │
│     Student → /api/payments/checkout → Stripe Checkout                      │
│            → Stripe Webhook → /api/webhooks/stripe → Supabase (enrollment)  │
│            → Resend (welcome email)                                         │
│                                                                              │
│  4. LESSON GENERATION:                                                       │
│     Instructor → /api/ai/generate-lesson → OpenAI GPT-4o                   │
│                → Supabase (store lesson)                                    │
│                                                                              │
│  5. QUIZ ATTEMPT:                                                            │
│     Student → /api/quiz/submit → Supabase (store attempt)                   │
│            → /api/ai/grade-response (optional) → OpenAI                     │
│            → Supabase (update progress)                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────┐         ┌─────────┐         ┌──────────┐         ┌─────────┐
│  User   │         │  App    │         │ Supabase │         │  App    │
│         │         │Client   │         │   Auth   │         │ Server  │
└────┬────┘         └────┬────┘         └────┬─────┘         └────┬────┘
     │                   │                   │                    │
     │  1. Login Form    │                   │                    │
     │──────────────────>│                   │                    │
     │                   │                   │                    │
     │                   │  2. signInWith    │                    │
     │                   │   Password()      │                    │
     │                   │──────────────────>│                    │
     │                   │                   │                    │
     │                   │  3. JWT + User    │                    │
     │                   │<──────────────────│                    │
     │                   │                   │                    │
     │  4. Set Cookie    │                   │                    │
     │<──────────────────│                   │                    │
     │                   │                   │                    │
     │                   │  5. Protected     │                    │
     │                   │  Request          │                    │
     │                   │───────────────────────────────────────>│
     │                   │                   │                    │
     │                   │                   │  6. Verify JWT     │
     │                   │                   │<───────────────────│
     │                   │                   │                    │
     │                   │                   │  7. User Data      │
     │                   │                   │───────────────────>│
     │                   │                   │                    │
     │                   │  8. Response      │                    │
     │                   │<───────────────────────────────────────│
     │                   │                   │                    │
```

### 2.3 Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW (Stripe)                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  User   │    │  App    │    │  API    │    │ Stripe  │    │ Supabase│
│         │    │ Client  │    │ Routes  │    │         │    │         │
└────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │              │              │              │              │
     │ 1. Purchase  │              │              │              │
     │─────────────>│              │              │              │
     │              │              │              │              │
     │              │ 2. POST      │              │              │
     │              │ /checkout    │              │              │
     │              │─────────────>│              │              │
     │              │              │              │              │
     │              │              │ 3. Create    │              │
     │              │              │ Checkout     │              │
     │              │              │ Session      │              │
     │              │              │─────────────>│              │
     │              │              │              │              │
     │              │              │ 4. Session   │              │
     │              │              │ URL          │              │
     │              │              │<─────────────│              │
     │              │              │              │              │
     │              │ 5. Redirect  │              │              │
     │              │<─────────────│              │              │
     │              │              │              │              │
     │ 6. Stripe    │              │              │              │
     │ Checkout     │              │              │              │
     │<─────────────│              │              │              │
     │              │              │              │              │
     │ 7. Payment   │              │              │              │
     │ Complete     │              │              │              │
     │─────────────────────────────────────────────>              │
     │              │              │              │              │
     │              │              │ 8. Webhook   │              │
     │              │              │ (checkout.   │              │
     │              │              │ completed)   │              │
     │              │              │<─────────────│              │
     │              │              │              │              │
     │              │              │ 9. Create    │              │
     │              │              │ Enrollment   │              │
     │              │              │──────────────────────────────>│
     │              │              │              │              │
     │              │              │ 10. Send     │              │
     │              │              │ Confirmation │              │
     │              │              │ Email        │              │
     │              │              │ (via Resend) │              │
     │              │              │              │              │
```

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA (Supabase/PostgreSQL)                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐       ┌───────────────────┐
│     profiles      │       │       roles       │
├───────────────────┤       ├───────────────────┤
│ id (FK → auth)    │──┐    │ id (PK)           │
│ email             │  │    │ name              │
│ full_name         │  │    │ description       │
│ avatar_url        │  │    │ permissions       │
│ role_id (FK)──────│──┼───>│ created_at        │
│ stripe_customer_id│  │    └───────────────────┘
│ created_at        │  │
│ updated_at        │  │    ┌───────────────────┐
└───────────────────┘  │    │   subscriptions   │
                       │    ├───────────────────┤
                       │    │ id (PK)           │
                       └────│ user_id (FK)      │
                            │ stripe_sub_id     │
                            │ stripe_price_id   │
                            │ status            │
                            │ current_period_end│
                            │ cancel_at         │
                            │ created_at        │
                            └───────────────────┘

┌───────────────────┐       ┌───────────────────┐
│   categories      │       │     courses       │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │<──────│ id (PK)           │
│ name              │       │ instructor_id(FK)─│──┐
│ slug              │       │ category_id (FK)  │  │
│ description       │       │ title             │  │
│ icon              │       │ slug              │  │
│ parent_id (FK)    │       │ description       │  │
│ order_index       │       │ thumbnail_url     │  │
│ created_at        │       │ price_cents       │  │
└───────────────────┘       │ is_published      │  │
                            │ difficulty_level  │  │
                            │ estimated_hours   │  │
                            │ tags (TEXT[])     │  │
                            │ created_at        │  │
                            │ updated_at        │  │
                            └───────────────────┘  │
                                                   │
┌───────────────────┐       ┌───────────────────┐  │
│     modules       │       │    enrollments    │  │
├───────────────────┤       ├───────────────────┤  │
│ id (PK)           │       │ id (PK)           │  │
│ course_id (FK)────│──┐    │ user_id (FK)      │<─┤
│ title             │  │    │ course_id (FK)    │<─┘
│ description       │  │    │ enrolled_at       │
│ order_index       │  │    │ completed_at      │
│ created_at        │  │    │ progress_percent  │
└───────────────────┘  │    │ last_accessed_at  │
                       │    │ payment_id (FK)   │
┌───────────────────┐  │    └───────────────────┘
│     lessons       │  │
├───────────────────┤  │    ┌───────────────────┐
│ id (PK)           │  │    │     payments      │
│ module_id (FK)────│──┘    ├───────────────────┤
│ title             │       │ id (PK)           │
│ slug              │       │ user_id (FK)      │
│ content_type      │       │ course_id (FK)    │
│ content           │       │ amount_cents      │
│ video_url         │       │ currency          │
│ duration_minutes  │       │ stripe_payment_id │
│ order_index       │       │ status            │
│ is_preview        │       │ created_at        │
│ ai_generated      │       └───────────────────┘
│ created_at        │
│ updated_at        │       ┌───────────────────┐
└───────────────────┘       │ lesson_progress   │
                            ├───────────────────┤
┌───────────────────┐       │ id (PK)           │
│      quizzes      │       │ user_id (FK)      │
├───────────────────┤       │ lesson_id (FK)    │
│ id (PK)           │       │ completed_at      │
│ lesson_id (FK)    │       │ time_spent_seconds│
│ title             │       │ created_at        │
│ description       │       └───────────────────┘
│ passing_score     │
│ max_attempts      │       ┌───────────────────┐
│ created_at        │       │  quiz_attempts    │
└───────────────────┘       ├───────────────────┤
                            │ id (PK)           │
┌───────────────────┐       │ quiz_id (FK)      │
│   quiz_questions  │       │ user_id (FK)      │
├───────────────────┤       │ answers (JSONB)   │
│ id (PK)           │       │ score             │
│ quiz_id (FK)      │       │ passed            │
│ question_text     │       │ attempted_at      │
│ question_type     │       │ time_spent_seconds│
│ options (JSONB)   │       └───────────────────┘
│ correct_answer    │
│ explanation       │       ┌───────────────────┐
│ points            │       │   certificates    │
│ order_index       │       ├───────────────────┤
│ ai_generated      │       │ id (PK)           │
└───────────────────┘       │ user_id (FK)      │
                            │ course_id (FK)    │
┌───────────────────┐       │ certificate_url   │
│  ai_generations   │       │ issued_at         │
├───────────────────┤       │ verification_code │
│ id (PK)           │       └───────────────────┘
│ user_id (FK)      │
│ resource_type     │       ┌───────────────────┐
│ resource_id       │       │   email_logs      │
│ prompt_used       │       ├───────────────────┤
│ tokens_used       │       │ id (PK)           │
│ model_version     │       │ user_id (FK)      │
│ generated_content │       │ email_type        │
│ created_at        │       │ recipient         │
└───────────────────┘       │ subject           │
                            │ status            │
┌───────────────────┐       │ sent_at           │
│     reviews       │       │ resend_id         │
├───────────────────┤       └───────────────────┘
│ id (PK)           │
│ course_id (FK)    │
│ user_id (FK)      │
│ rating (1-5)      │
│ comment           │
│ created_at        │
│ updated_at        │
└───────────────────┘
```

### 3.2 Table Definitions

#### 3.2.1 profiles

Extends Supabase auth.users with application-specific data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role_id INTEGER REFERENCES roles(id) DEFAULT 3, -- Default: student
  stripe_customer_id TEXT,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
```

#### 3.2.2 roles

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Full system access', '["*"]'),
  ('instructor', 'Can create and manage courses', '["courses:create", "courses:update", "courses:delete", "lessons:*", "quizzes:*"]'),
  ('student', 'Can enroll and learn', '["courses:read", "enrollments:*", "progress:*"]');
```

#### 3.2.3 categories

Hierarchical course categories.

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

#### 3.2.4 courses

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  promo_video_url TEXT,
  price_cents INTEGER DEFAULT 0, -- 0 = free
  currency TEXT DEFAULT 'usd',
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours DECIMAL(4,1),
  prerequisites TEXT[],
  learning_objectives TEXT[],
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(is_published, published_at);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_courses_tags ON courses USING GIN(tags);
CREATE INDEX idx_courses_search ON courses USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

#### 3.2.5 modules

Course sections/chapters.

```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(course_id, order_index)
);

CREATE INDEX idx_modules_course ON modules(course_id);
```

#### 3.2.6 lessons

Individual lesson content.

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'interactive', 'quiz')),
  content TEXT, -- Markdown/HTML content for text lessons
  video_url TEXT,
  video_duration_seconds INTEGER,
  thumbnail_url TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN DEFAULT FALSE, -- Free preview lesson
  is_published BOOLEAN DEFAULT TRUE,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT, -- Prompt used to generate content
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(module_id, slug)
);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);
CREATE INDEX idx_lessons_preview ON lessons(is_preview) WHERE is_preview = TRUE;
```

#### 3.2.7 enrollments

Student course enrollments.

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percent DECIMAL(5,2) DEFAULT 0.00,
  last_accessed_at TIMESTAMPTZ,
  last_lesson_id UUID REFERENCES lessons(id),
  certificate_issued BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_progress ON enrollments(progress_percent);
```

#### 3.2.8 lesson_progress

Track individual lesson completion.

```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  notes TEXT,
  bookmark_position INTEGER, -- For video lessons
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
```

#### 3.2.9 quizzes

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  passing_score INTEGER DEFAULT 70, -- Percentage
  max_attempts INTEGER DEFAULT 3, -- NULL = unlimited
  time_limit_minutes INTEGER, -- NULL = no limit
  shuffle_questions BOOLEAN DEFAULT TRUE,
  shuffle_options BOOLEAN DEFAULT TRUE,
  show_correct_answers BOOLEAN DEFAULT TRUE, -- After completion
  is_published BOOLEAN DEFAULT TRUE,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);
```

#### 3.2.10 quiz_questions

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'matching')),
  options JSONB, -- For multiple choice: [{"text": "Option A", "id": "a"}, ...]
  correct_answer JSONB NOT NULL, -- Format depends on question_type
  explanation TEXT, -- Shown after answering
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(quiz_id, order_index)
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
```

#### 3.2.11 quiz_attempts

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- [{"question_id": "uuid", "answer": "a"}, ...]
  score DECIMAL(5,2), -- Percentage
  points_earned INTEGER,
  points_possible INTEGER,
  passed BOOLEAN,
  time_spent_seconds INTEGER,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_passed ON quiz_attempts(passed);
```

#### 3.2.12 payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('course', 'subscription', 'tip')),
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_course ON payments(course_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### 3.2.13 subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

#### 3.2.14 certificates

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  verification_code TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_course ON certificates(course_id);
CREATE INDEX idx_certificates_code ON certificates(verification_code);
```

#### 3.2.15 reviews

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

#### 3.2.16 ai_generations

Track AI usage for cost monitoring.

```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('course_outline', 'lesson_content', 'quiz_question', 'explanation', 'summary')),
  resource_id UUID,
  prompt_used TEXT,
  model_version TEXT DEFAULT 'gpt-4o',
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  estimated_cost_usd DECIMAL(10,6),
  generation_time_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_type ON ai_generations(resource_type);
CREATE INDEX idx_ai_generations_created ON ai_generations(created_at);
```

#### 3.2.17 email_logs

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'enrollment', 'completion', 'certificate', 'receipt', 'password_reset', 'notification')),
  recipient TEXT NOT NULL,
  subject TEXT,
  template_id TEXT,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  resend_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_resend ON email_logs(resend_id);
```

### 3.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- COURSES: Published courses are readable by all
CREATE POLICY "Published courses are readable by all"
  ON courses FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Instructors can manage their own courses"
  ON courses FOR ALL
  USING (
    instructor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'instructor'))
    )
  );

-- ENROLLMENTS: Users can only see their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  USING (user_id = auth.uid());

-- LESSONS: Accessible if enrolled or lesson is preview
CREATE POLICY "Lessons readable if enrolled or preview"
  ON lessons FOR SELECT
  USING (
    is_preview = TRUE
    OR EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      JOIN enrollments e ON e.course_id = c.id
      WHERE m.id = lessons.module_id
      AND e.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM courses c
      JOIN modules m ON m.course_id = c.id
      WHERE m.id = lessons.module_id
      AND c.instructor_id = auth.uid()
    )
  );

-- QUIZ_ATTEMPTS: Users can only see their own attempts
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- PAYMENTS: Users can only see their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

-- CERTIFICATES: Users can view own, public verification
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (user_id = auth.uid() OR verification_code IS NOT NULL);

-- Add similar policies for other tables...
```

### 3.4 Database Functions & Triggers

```sql
-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update enrollment progress when lesson progress changes
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  course_id UUID;
BEGIN
  -- Get course_id from enrollment
  SELECT e.course_id INTO course_id
  FROM enrollments e
  WHERE e.id = NEW.enrollment_id;
  
  -- Count total lessons in course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = course_id;
  
  -- Count completed lessons
  SELECT COUNT(DISTINCT lp.lesson_id) INTO completed_lessons
  FROM lesson_progress lp
  JOIN lessons l ON l.id = lp.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE lp.enrollment_id = NEW.enrollment_id
  AND lp.completed_at IS NOT NULL;
  
  -- Update enrollment progress
  UPDATE enrollments
  SET progress_percent = (completed_lessons::DECIMAL / total_lessons * 100),
      last_accessed_at = NOW(),
      last_lesson_id = NEW.lesson_id
  WHERE id = NEW.enrollment_id;
  
  -- If 100% complete, set completed_at
  IF (completed_lessons::DECIMAL / total_lessons * 100) >= 100 THEN
    UPDATE enrollments
    SET completed_at = NOW()
    WHERE id = NEW.enrollment_id AND completed_at IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enrollment_progress_trigger
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 4. API Endpoints

### 4.1 API Structure Overview

```
/api
├── /auth
│   ├── /login              [POST]     Login user
│   ├── /register           [POST]     Register new user
│   ├── /logout             [POST]     Logout user
│   ├── /reset-password     [POST]     Request password reset
│   ├── /callback           [GET]      OAuth callback
│   └── /session            [GET]      Get current session
│
├── /users
│   ├── /                   [GET]      List users (admin)
│   ├── /:id                [GET]      Get user profile
│   ├── /:id                [PATCH]    Update user profile
│   ├── /:id                [DELETE]   Delete user (admin)
│   ├── /me                 [GET]      Get current user
│   └── /me                 [PATCH]    Update current user
│
├── /courses
│   ├── /                   [GET]      List courses (public)
│   ├── /                   [POST]     Create course (instructor)
│   ├── /:slug              [GET]      Get course by slug
│   ├── /:id                [PATCH]    Update course (instructor)
│   ├── /:id                [DELETE]   Delete course (instructor)
│   ├── /:id/publish        [POST]     Publish course
│   ├── /:id/unpublish      [POST]     Unpublish course
│   └── /:id/reviews        [GET]      Get course reviews
│
├── /modules
│   ├── /                   [POST]     Create module
│   ├── /:id                [GET]      Get module
│   ├── /:id                [PATCH]    Update module
│   ├── /:id                [DELETE]   Delete module
│   └── /:id/reorder        [POST]     Reorder module
│
├── /lessons
│   ├── /                   [POST]     Create lesson
│   ├── /:id                [GET]      Get lesson
│   ├── /:id                [PATCH]    Update lesson
│   ├── /:id                [DELETE]   Delete lesson
│   └── /:id/reorder        [POST]     Reorder lesson
│
├── /enrollments
│   ├── /                   [GET]      List user enrollments
│   ├── /                   [POST]     Enroll in course
│   ├── /:id                [GET]      Get enrollment details
│   └── /:id                [DELETE]   Unenroll from course
│
├── /progress
│   ├── /lesson/:id         [POST]     Mark lesson progress
│   ├── /lesson/:id         [GET]      Get lesson progress
│   └── /course/:id         [GET]      Get course progress
│
├── /quizzes
│   ├── /                   [POST]     Create quiz
│   ├── /:id                [GET]      Get quiz
│   ├── /:id                [PATCH]    Update quiz
│   ├── /:id                [DELETE]   Delete quiz
│   ├── /:id/submit         [POST]     Submit quiz answers
│   └── /:id/attempts       [GET]      Get user attempts
│
├── /ai
│   ├── /generate-outline   [POST]     Generate course outline
│   ├── /generate-lesson    [POST]     Generate lesson content
│   ├── /generate-quiz      [POST]     Generate quiz questions
│   ├── /explain            [POST]     Explain concept
│   ├── /summarize          [POST]     Summarize content
│   └── /chat               [POST]     AI tutor chat
│
├── /payments
│   ├── /checkout           [POST]     Create checkout session
│   ├── /subscription       [POST]     Create subscription
│   ├── /subscription/:id   [DELETE]   Cancel subscription
│   └── /history            [GET]      Get payment history
│
├── /webhooks
│   ├── /stripe             [POST]     Handle Stripe webhooks
│   └── /resend             [POST]     Handle Resend webhooks
│
├── /certificates
│   ├── /                   [GET]      List user certificates
│   ├── /generate/:courseId [POST]     Generate certificate
│   └── /verify/:code       [GET]      Verify certificate
│
├── /reviews
│   ├── /                   [POST]     Create review
│   ├── /:id                [PATCH]    Update review
│   └── /:id                [DELETE]   Delete review
│
├── /categories
│   ├── /                   [GET]      List categories
│   ├── /                   [POST]     Create category (admin)
│   ├── /:id                [PATCH]    Update category (admin)
│   └── /:id                [DELETE]   Delete category (admin)
│
└── /admin
    ├── /stats              [GET]      Platform statistics
    ├── /users              [GET]      List all users
    ├── /revenue            [GET]      Revenue analytics
    └── /ai-usage           [GET]      AI usage analytics
```

### 4.2 Detailed API Specifications

#### 4.2.1 Authentication Endpoints

##### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

**Errors:**
- 400: Invalid input
- 409: Email already exists

---

##### POST /api/auth/login

Authenticate user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student",
    "avatar_url": "https://..."
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

**Errors:**
- 401: Invalid credentials
- 400: Missing fields

---

##### POST /api/auth/logout

Logout current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

##### POST /api/auth/reset-password

Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### 4.2.2 Course Endpoints

##### GET /api/courses

List courses with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by category slug
- `difficulty` (string): Filter by difficulty level
- `instructor` (uuid): Filter by instructor ID
- `search` (string): Search in title/description
- `tags` (string): Comma-separated tags
- `sort` (string): Sort field (created_at, price, rating, popularity)
- `order` (string): Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction to Machine Learning",
      "slug": "intro-to-ml",
      "description": "...",
      "thumbnail_url": "https://...",
      "instructor": {
        "id": "uuid",
        "full_name": "Dr. Jane Smith",
        "avatar_url": "https://..."
      },
      "category": {
        "id": 1,
        "name": "Technology",
        "slug": "technology"
      },
      "price_cents": 4999,
      "difficulty_level": "beginner",
      "estimated_hours": 12.5,
      "tags": ["machine-learning", "python", "ai"],
      "enrollment_count": 1234,
      "average_rating": 4.8,
      "review_count": 156,
      "is_enrolled": false,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

##### POST /api/courses

Create a new course (instructor only).

**Request:**
```json
{
  "title": "Advanced React Patterns",
  "subtitle": "Master advanced React concepts",
  "description": "Deep dive into advanced React patterns...",
  "category_id": 1,
  "price_cents": 7999,
  "difficulty_level": "advanced",
  "estimated_hours": 15,
  "prerequisites": ["Basic React knowledge", "JavaScript ES6+"],
  "learning_objectives": [
    "Understand compound components pattern",
    "Master render props and hooks"
  ],
  "tags": ["react", "javascript", "frontend"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Advanced React Patterns",
    "slug": "advanced-react-patterns",
    "is_published": false,
    "created_at": "2026-03-26T10:00:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden (not an instructor)
- 400: Validation error

---

##### GET /api/courses/:slug

Get course details with modules and lessons.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Introduction to Machine Learning",
    "slug": "intro-to-ml",
    "subtitle": "...",
    "description": "...",
    "thumbnail_url": "https://...",
    "promo_video_url": "https://...",
    "instructor": {
      "id": "uuid",
      "full_name": "Dr. Jane Smith",
      "avatar_url": "https://...",
      "bio": "..."
    },
    "category": {
      "id": 1,
      "name": "Technology"
    },
    "price_cents": 4999,
    "currency": "usd",
    "difficulty_level": "beginner",
    "estimated_hours": 12.5,
    "prerequisites": ["Basic Python"],
    "learning_objectives": ["...", "..."],
    "tags": ["machine-learning", "python"],
    "modules": [
      {
        "id": "uuid",
        "title": "Introduction",
        "description": "...",
        "order_index": 0,
        "lessons": [
          {
            "id": "uuid",
            "title": "What is Machine Learning?",
            "slug": "what-is-ml",
            "content_type": "video",
            "duration_minutes": 15,
            "is_preview": true,
            "order_index": 0
          }
        ]
      }
    ],
    "enrollment_count": 1234,
    "average_rating": 4.8,
    "review_count": 156,
    "is_enrolled": false,
    "user_progress": null,
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-03-20T15:30:00Z"
  }
}
```

---

##### POST /api/courses/:id/publish

Publish a course.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_published": true,
    "published_at": "2026-03-26T10:00:00Z"
  }
}
```

**Errors:**
- 400: Course not ready (missing content, etc.)
- 403: Not course owner

---

#### 4.2.3 AI Endpoints

##### POST /api/ai/generate-outline

Generate course outline using AI.

**Request:**
```json
{
  "title": "Introduction to Quantum Computing",
  "description": "Learn the basics of quantum computing",
  "target_audience": "developers with basic math background",
  "num_modules": 8,
  "difficulty": "beginner"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "outline": [
      {
        "module_title": "Introduction to Quantum Mechanics",
        "module_description": "...",
        "lessons": [
          {
            "title": "Classical vs Quantum Computing",
            "content_type": "video",
            "duration_minutes": 20,
            "description": "..."
          }
        ]
      }
    ],
    "generation_id": "uuid",
    "estimated_total_hours": 16
  }
}
```

**Errors:**
- 400: Invalid input
- 401: Unauthorized
- 429: Rate limit exceeded
- 500: AI generation failed

---

##### POST /api/ai/generate-lesson

Generate lesson content.

**Request:**
```json
{
  "module_id": "uuid",
  "title": "Quantum Superposition",
  "lesson_type": "text",
  "difficulty": "beginner",
  "include_examples": true,
  "target_length_words": 800
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": "# Quantum Superposition\n\n...",
    "metadata": {
      "word_count": 850,
      "reading_time_minutes": 5,
      "model_used": "gpt-4o"
    },
    "generation_id": "uuid"
  }
}
```

---

##### POST /api/ai/generate-quiz

Generate quiz questions for a lesson.

**Request:**
```json
{
  "lesson_id": "uuid",
  "num_questions": 10,
  "question_types": ["multiple_choice", "true_false"],
  "difficulty": "mixed",
  "include_explanations": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "question_text": "What is quantum superposition?",
        "question_type": "multiple_choice",
        "options": [
          {"id": "a", "text": "..."},
          {"id": "b", "text": "..."},
          {"id": "c", "text": "..."},
          {"id": "d", "text": "..."}
        ],
        "correct_answer": {"id": "b"},
        "explanation": "The correct answer is B because...",
        "points": 1
      }
    ],
    "generation_id": "uuid"
  }
}
```

---

##### POST /api/ai/chat

AI tutor chat for students.

**Request:**
```json
{
  "course_id": "uuid",
  "lesson_id": "uuid",
  "message": "Can you explain quantum entanglement in simpler terms?",
  "conversation_history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "response": "Of course! Quantum entanglement is like...",
    "suggested_follow_ups": [
      "Tell me more about Bell's theorem",
      "How is entanglement used in quantum computing?"
    ]
  }
}
```

---

#### 4.2.4 Payment Endpoints

##### POST /api/payments/checkout

Create Stripe checkout session for course purchase.

**Request:**
```json
{
  "course_id": "uuid",
  "success_url": "https://app.com/courses/slug?success=true",
  "cancel_url": "https://app.com/courses/slug?canceled=true"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "session_id": "cs_test_..."
  }
}
```

---

##### POST /api/payments/subscription

Create subscription checkout.

**Request:**
```json
{
  "price_id": "price_123",
  "success_url": "https://app.com/dashboard?success=true",
  "cancel_url": "https://app.com/pricing?canceled=true"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "session_id": "cs_test_..."
  }
}
```

---

##### DELETE /api/payments/subscription/:id

Cancel subscription.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "status": "canceled",
    "cancel_at_period_end": true,
    "current_period_end": "2026-04-26T00:00:00Z"
  }
}
```

---

#### 4.2.5 Webhook Endpoints

##### POST /api/webhooks/stripe

Handle Stripe webhook events.

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

**Implementation:**
```typescript
// Verify webhook signature
// Handle event type
// Update database
// Send confirmation email
// Return 200
```

---

##### POST /api/webhooks/resend

Handle Resend webhook events.

**Supported Events:**
- `email.delivered`
- `email.opened`
- `email.clicked`
- `email.bounced`
- `email.complained`

---

#### 4.2.6 Progress Endpoints

##### POST /api/progress/lesson/:id

Update lesson progress.

**Request:**
```json
{
  "completed": true,
  "time_spent_seconds": 450,
  "bookmark_position": 120,
  "notes": "Great explanation of quantum states"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lesson_id": "uuid",
    "completed_at": "2026-03-26T10:00:00Z",
    "course_progress": {
      "completed_lessons": 5,
      "total_lessons": 20,
      "progress_percent": 25.0
    }
  }
}
```

---

##### GET /api/progress/course/:id

Get detailed course progress.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "uuid",
      "enrolled_at": "2026-03-01T00:00:00Z",
      "progress_percent": 45.5,
      "last_accessed_at": "2026-03-26T09:30:00Z"
    },
    "modules": [
      {
        "id": "uuid",
        "title": "Introduction",
        "completed": true,
        "lessons": [
          {
            "id": "uuid",
            "title": "What is ML?",
            "completed": true,
            "completed_at": "2026-03-02T10:00:00Z",
            "time_spent_seconds": 900
          }
        ]
      }
    ],
    "quiz_scores": [
      {
        "quiz_title": "Module 1 Quiz",
        "score": 85,
        "passed": true
      }
    ]
  }
}
```

---

#### 4.2.7 Quiz Endpoints

##### POST /api/quizzes/:id/submit

Submit quiz attempt.

**Request:**
```json
{
  "answers": [
    {"question_id": "uuid", "answer": "b"},
    {"question_id": "uuid", "answer": "true"}
  ],
  "time_spent_seconds": 300
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attempt_id": "uuid",
    "score": 85,
    "passed": true,
    "points_earned": 17,
    "points_possible": 20,
    "results": [
      {
        "question_id": "uuid",
        "correct": true,
        "your_answer": "b",
        "correct_answer": "b",
        "explanation": "..."
      }
    ],
    "attempt_number": 1,
    "attempts_remaining": 2
  }
}
```

---

#### 4.2.8 Certificate Endpoints

##### POST /api/certificates/generate/:courseId

Generate certificate upon completion.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "certificate_url": "https://storage.../certificates/uuid.pdf",
    "verification_code": "CERT-ABC123XYZ",
    "issued_at": "2026-03-26T10:00:00Z"
  }
}
```

---

##### GET /api/certificates/verify/:code

Verify certificate authenticity (public).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "certificate": {
      "verification_code": "CERT-ABC123XYZ",
      "issued_at": "2026-03-26T10:00:00Z",
      "recipient": {
        "full_name": "John Doe"
      },
      "course": {
        "title": "Introduction to Machine Learning",
        "instructor": "Dr. Jane Smith"
      }
    }
  }
}
```

---

### 4.3 Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**Standard Error Codes:**
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

---

## 5. File/Folder Structure

```
ai-professor/
├── .env.local                    # Local environment variables
├── .env.example                  # Environment template
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── middleware.ts                # Next.js middleware (auth, rate limiting)
│
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   │
│   ├── (auth)/                 # Auth route group (no layout wrapper)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Auth-specific layout
│   │
│   ├── (dashboard)/            # Dashboard route group (protected)
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Student dashboard
│   │   ├── my-courses/
│   │   │   └── page.tsx        # Enrolled courses
│   │   ├── settings/
│   │   │   └── page.tsx        # User settings
│   │   └── certificates/
│   │       └── page.tsx        # User certificates
│   │
│   ├── (instructor)/           # Instructor route group
│   │   ├── layout.tsx          # Instructor layout
│   │   ├── instructor/
│   │   │   ├── page.tsx        # Instructor dashboard
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx    # Course list
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx         # Course editor
│   │   │   │       ├── modules/
│   │   │   │       │   └── page.tsx     # Module management
│   │   │   │       └── analytics/
│   │   │   │           └── page.tsx     # Course analytics
│   │   │   └── earnings/
│   │   │       └── page.tsx    # Earnings dashboard
│   │   └── create-course/
│   │       └── page.tsx        # Course creation wizard
│   │
│   ├── courses/                # Public course pages
│   │   ├── page.tsx            # Course catalog
│   │   └── [slug]/
│   │       ├── page.tsx        # Course landing page
│   │       └── learn/
│   │           ├── page.tsx    # Course learning view
│   │           └── [lessonSlug]/
│   │               └── page.tsx # Lesson view
│   │
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx        # Category page
│   │
│   ├── certificates/
│   │   └── verify/
│   │       └── [code]/
│   │           └── page.tsx    # Certificate verification
│   │
│   ├── pricing/
│   │   └── page.tsx            # Pricing page
│   │
│   ├── search/
│   │   └── page.tsx            # Search results
│   │
│   ├── admin/                  # Admin pages
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── courses/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── reset-password/
│   │   │   │   └── route.ts
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── session/
│   │   │       └── route.ts
│   │   │
│   │   ├── users/
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   ├── me/
│   │   │   │   └── route.ts    # GET, PATCH current user
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET, PATCH, DELETE
│   │   │
│   │   ├── courses/
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   └── [slug]/
│   │   │       └── route.ts    # GET, PATCH, DELETE
│   │   │
│   │   ├── modules/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── reorder/
│   │   │           └── route.ts
│   │   │
│   │   ├── lessons/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── reorder/
│   │   │           └── route.ts
│   │   │
│   │   ├── enrollments/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   ├── progress/
│   │   │   ├── lesson/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── course/
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   │
│   │   ├── quizzes/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── submit/
│   │   │       │   └── route.ts
│   │   │       └── attempts/
│   │   │           └── route.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── generate-outline/
│   │   │   │   └── route.ts
│   │   │   ├── generate-lesson/
│   │   │   │   └── route.ts
│   │   │   ├── generate-quiz/
│   │   │   │   └── route.ts
│   │   │   ├── explain/
│   │   │   │   └── route.ts
│   │   │   ├── summarize/
│   │   │   │   └── route.ts
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts
│   │   │   ├── subscription/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── history/
│   │   │       └── route.ts
│   │   │
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   │   └── route.ts
│   │   │   └── resend/
│   │   │       └── route.ts
│   │   │
│   │   ├── certificates/
│   │   │   ├── route.ts
│   │   │   ├── generate/
│   │   │   │   └── [courseId]/
│   │   │   │       └── route.ts
│   │   │   └── verify/
│   │   │       └── [code]/
│   │   │           └── route.ts
│   │   │
│   │   ├── reviews/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   └── admin/
│   │       ├── stats/
│   │       │   └── route.ts
│   │       ├── users/
│   │       │   └── route.ts
│   │       ├── revenue/
│   │       │   └── route.ts
│   │       └── ai-usage/
│   │           └── route.ts
│   │
│   └── not-found.tsx           # 404 page
│
├── components/                  # React components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── CourseSidebar.tsx
│   │
│   ├── course/                 # Course-specific components
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseHero.tsx
│   │   ├── CourseCurriculum.tsx
│   │   ├── ModuleAccordion.tsx
│   │   ├── LessonItem.tsx
│   │   └── CourseReviews.tsx
│   │
│   ├── learning/               # Learning interface components
│   │   ├── VideoPlayer.tsx
│   │   ├── LessonContent.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── LessonNavigation.tsx
│   │   ├── NoteTaking.tsx
│   │   └── AITutorChat.tsx
│   │
│   ├── quiz/                   # Quiz components
│   │   ├── QuizContainer.tsx
│   │   ├── MultipleChoice.tsx
│   │   ├── TrueFalse.tsx
│   │   ├── ShortAnswer.tsx
│   │   ├── QuizResults.tsx
│   │   └── QuizTimer.tsx
│   │
│   ├── instructor/             # Instructor components
│   │   ├── CourseEditor.tsx
│   │   ├── ModuleEditor.tsx
│   │   ├── LessonEditor.tsx
│   │   ├── AIGenerator.tsx
│   │   ├── DragDropList.tsx
│   │   └── AnalyticsChart.tsx
│   │
│   ├── payment/                # Payment components
│   │   ├── PricingCard.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentHistory.tsx
│   │
│   └── shared/                 # Shared components
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Rating.tsx
│       ├── SearchBar.tsx
│       ├── CategoryFilter.tsx
│       ├── Pagination.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── lib/                        # Library/utility code
│   ├── supabase/              # Supabase client and helpers
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   ├── admin.ts           # Admin client (service role)
│   │   └── middleware.ts      # Auth middleware helper
│   │
│   ├── openai/                # OpenAI integration
│   │   ├── client.ts          # OpenAI client setup
│   │   ├── prompts/           # Prompt templates
│   │   │   ├── course-outline.ts
│   │   │   ├── lesson-content.ts
│   │   │   ├── quiz-generation.ts
│   │   │   └── tutor-chat.ts
│   │   └── rate-limiter.ts    # AI rate limiting
│   │
│   ├── stripe/                # Stripe integration
│   │   ├── client.ts          # Stripe client setup
│   │   ├── products.ts        # Product/price helpers
│   │   ├── subscriptions.ts   # Subscription helpers
│   │   └── webhooks.ts        # Webhook handlers
│   │
│   ├── resend/                # Resend email integration
│   │   ├── client.ts          # Resend client setup
│   │   └── templates/         # Email templates
│   │       ├── welcome.tsx
│   │       ├── enrollment.tsx
│   │       ├── completion.tsx
│   │       └── certificate.tsx
│   │
│   ├── auth/                  # Authentication utilities
│   │   ├── index.ts
│   │   ├── permissions.ts     # Role-based permissions
│   │   └── session.ts         # Session management
│   │
│   ├── validators/            # Zod validation schemas
│   │   ├── auth.ts
│   │   ├── course.ts
│   │   ├── lesson.ts
│   │   ├── quiz.ts
│   │   └── payment.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── cn.ts              # Class name helper
│   │   ├── format.ts          # Formatting utilities
│   │   ├── date.ts            # Date utilities
│   │   └── slugify.ts         # URL slug generation
│   │
│   └── constants.ts           # App constants
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useCourse.ts
│   ├── useEnrollment.ts
│   ├── useProgress.ts
│   ├── useQuiz.ts
│   ├── useAIGeneration.ts
│   ├── useToast.ts
│   └── useMediaQuery.ts
│
├── types/                      # TypeScript types
│   ├── index.ts               # Barrel export
│   ├── database.ts            # Supabase generated types
│   ├── course.ts
│   ├── user.ts
│   ├── quiz.ts
│   ├── payment.ts
│   └── api.ts
│
├── context/                    # React context providers
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   └── ToastProvider.tsx
│
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.png
│   └── fonts/
│
├── scripts/                    # Build/utility scripts
│   ├── seed-categories.ts     # Seed database categories
│   ├── generate-types.ts      # Generate Supabase types
│   └── create-admin.ts        # Create admin user
│
└── supabase/                   # Supabase configuration
    ├── config.toml
    ├── migrations/            # SQL migrations
    │   ├── 001_initial_schema.sql
    │   ├── 002_rls_policies.sql
    │   └── 003_functions_triggers.sql
    └── seed.sql               # Seed data
```

---

## 6. Integration Specifications

### 6.1 OpenAI Integration (GPT-4o)

#### 6.1.1 Client Setup

```typescript
// lib/openai/client.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODEL = 'gpt-4o-2024-08-06';

export const TOKEN_LIMITS = {
  'gpt-4o': {
    input: 128000,
    output: 16384,
  },
};
```

#### 6.1.2 Prompt Templates

**Course Outline Generation:**
```typescript
// lib/openai/prompts/course-outline.ts
export const COURSE_OUTLINE_PROMPT = `
You are an expert instructional designer. Generate a comprehensive course outline.

Course Title: {{title}}
Description: {{description}}
Target Audience: {{target_audience}}
Difficulty Level: {{difficulty}}
Number of Modules: {{num_modules}}

Generate a JSON course outline with the following structure:
{
  "modules": [
    {
      "title": "Module title",
      "description": "Brief module description",
      "lessons": [
        {
          "title": "Lesson title",
          "content_type": "video|text|interactive",
          "duration_minutes": number,
          "description": "Brief lesson description"
        }
      ]
    }
  ],
  "prerequisites": ["list of prerequisites"],
  "learning_objectives": ["list of objectives"]
}

Ensure the content is pedagogically sound and progressively builds knowledge.
`;
```

**Lesson Content Generation:**
```typescript
// lib/openai/prompts/lesson-content.ts
export const LESSON_CONTENT_PROMPT = `
You are an expert educator creating engaging lesson content.

Course: {{course_title}}
Module: {{module_title}}
Lesson: {{lesson_title}}
Difficulty: {{difficulty}}
Target Length: {{target_length_words}} words

Create comprehensive lesson content in Markdown format:
- Start with a brief introduction
- Use clear headings and subheadings
- Include practical examples
- Add code blocks where appropriate
- End with a summary
- Include 3-5 discussion questions

Format the output as clean Markdown.
`;
```

**Quiz Generation:**
```typescript
// lib/openai/prompts/quiz-generation.ts
export const QUIZ_GENERATION_PROMPT = `
You are an assessment expert creating quiz questions.

Lesson Content: {{lesson_content}}
Number of Questions: {{num_questions}}
Question Types: {{question_types}}
Difficulty: {{difficulty}}

Generate a JSON array of quiz questions:
[
  {
    "question_text": "The question",
    "question_type": "multiple_choice|true_false|short_answer",
    "options": [
      {"id": "a", "text": "Option A"},
      {"id": "b", "text": "Option B"},
      {"id": "c", "text": "Option C"},
      {"id": "d", "text": "Option D"}
    ],
    "correct_answer": {"id": "b"},
    "explanation": "Why this is the correct answer",
    "points": 1
  }
]

Ensure questions test comprehension, not just memorization.
`;
```

**AI Tutor Chat:**
```typescript
// lib/openai/prompts/tutor-chat.ts
export const TUTOR_CHAT_SYSTEM_PROMPT = `
You are a helpful AI tutor for the course "{{course_title}}".

Your role:
- Answer questions about the course material
- Provide clear, pedagogical explanations
- Use analogies and examples to clarify concepts
- Encourage critical thinking with follow-up questions
- Stay within the scope of the course content

Current Lesson: {{lesson_title}}
Student's Progress: {{progress_summary}}

Guidelines:
- Be encouraging and patient
- Adapt explanations to the student's level
- If unsure, acknowledge limitations
- Suggest relevant lesson sections when appropriate
`;
```

#### 6.1.3 Rate Limiting

```typescript
// lib/openai/rate-limiter.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIMITS = {
  free: { requests: 10, window: 3600 },      // 10/hour
  student: { requests: 50, window: 3600 },   // 50/hour
  instructor: { requests: 200, window: 3600 }, // 200/hour
  admin: { requests: 1000, window: 3600 },   // 1000/hour
};

export async function checkRateLimit(
  userId: string,
  role: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const limit = LIMITS[role] || LIMITS.free;
  const key = `ai-rate-limit:${userId}`;
  
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, limit.window);
  }
  
  const ttl = await redis.ttl(key);
  
  return {
    allowed: current <= limit.requests,
    remaining: Math.max(0, limit.requests - current),
    resetAt: Date.now() + (ttl * 1000),
  };
}
```

#### 6.1.4 Usage Tracking

```typescript
// Track all AI usage for cost monitoring
export async function trackAIGeneration(params: {
  userId: string;
  resourceType: string;
  resourceId?: string;
  prompt: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  success: boolean;
  errorMessage?: string;
}) {
  const cost = calculateCost(params.model, params.inputTokens, params.outputTokens);
  
  await supabase.from('ai_generations').insert({
    user_id: params.userId,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    prompt_used: params.prompt,
    model_version: params.model,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.inputTokens + params.outputTokens,
    estimated_cost_usd: cost,
    success: params.success,
    error_message: params.errorMessage,
  });
}

function calculateCost(model: string, input: number, output: number): number {
  const pricing = {
    'gpt-4o': { input: 2.50 / 1_000_000, output: 10.00 / 1_000_000 },
    'gpt-4o-mini': { input: 0.15 / 1_000_000, output: 0.60 / 1_000_000 },
  };
  
  const p = pricing[model] || pricing['gpt-4o'];
  return (input * p.input) + (output * p.output);
}
```

---

### 6.2 Stripe Integration

#### 6.2.1 Client Setup

```typescript
// lib/stripe/client.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
```

#### 6.2.2 Product Structure

**Stripe Products to Create:**

1. **Individual Courses** (dynamic)
   - Type: One-time payment
   - Price per course: Variable ($9.99 - $199.99)

2. **Subscription Plans** (static)
   - Basic: $19.99/month - Access to basic courses
   - Pro: $49.99/month - Access to all courses
   - Enterprise: Custom pricing

```typescript
// lib/stripe/products.ts
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    amount: 1999, // $19.99
    interval: 'month',
    features: [
      'Access to basic courses',
      'Email support',
      'Course certificates',
    ],
  },
  pro: {
    name: 'Pro Plan',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    amount: 4999, // $49.99
    interval: 'month',
    features: [
      'Access to all courses',
      'Priority support',
      'AI tutor chat',
      'Course certificates',
      'Downloadable resources',
    ],
  },
};
```

#### 6.2.3 Checkout Flow

```typescript
// lib/stripe/checkout.ts
import { stripe } from './client';

export async function createCourseCheckoutSession(params: {
  courseId: string;
  courseTitle: string;
  priceCents: number;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // Get or create Stripe customer
  let customerId = await getStripeCustomerId(params.userId);
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: params.userEmail,
      metadata: {
        userId: params.userId,
      },
    });
    customerId = customer.id;
    await updateStripeCustomerId(params.userId, customerId);
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: params.priceCents,
          product_data: {
            name: params.courseTitle,
            metadata: {
              courseId: params.courseId,
            },
          },
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      courseId: params.courseId,
      type: 'course_purchase',
    },
  });
  
  return session;
}

export async function createSubscriptionCheckoutSession(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  let customerId = await getStripeCustomerId(params.userId);
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: params.userEmail,
      metadata: { userId: params.userId },
    });
    customerId = customer.id;
    await updateStripeCustomerId(params.userId, customerId);
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      type: 'subscription',
    },
  });
  
  return session;
}
```

#### 6.2.4 Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/client';
import { handleCheckoutComplete } from '@/lib/stripe/webhooks';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
```

```typescript
// lib/stripe/webhooks.ts
import { sendEnrollmentEmail } from '@/lib/resend/client';

export async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { userId, courseId, type } = session.metadata as {
    userId: string;
    courseId?: string;
    type: string;
  };
  
  if (type === 'course_purchase' && courseId) {
    // Create payment record
    const { data: payment } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount_cents: session.amount_total,
        currency: session.currency,
        payment_type: 'course',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        status: 'completed',
      })
      .select()
      .single();
    
    // Create enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_id: payment.id,
      })
      .select('*, courses(*), profiles(*)')
      .single();
    
    // Send confirmation email
    await sendEnrollmentEmail(
      enrollment.profiles.email,
      enrollment.courses.title
    );
  }
}
```

---

### 6.3 Resend Integration (Email)

#### 6.3.1 Client Setup

```typescript
// lib/resend/client.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'AI Professor <noreply@professor.ai>';
export const SUPPORT_EMAIL = 'support@professor.ai';
```

#### 6.3.2 Email Templates

```typescript
// lib/resend/templates/welcome.tsx
import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

export function WelcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Welcome to AI Professor!</Heading>
          <Text>Hi {userName},</Text>
          <Text>
            Welcome to AI Professor! We're excited to have you on board.
            Start your learning journey today.
          </Text>
          <Link href={loginUrl}>Get Started</Link>
          <Text>
            If you have any questions, feel free to reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

```typescript
// lib/resend/templates/enrollment.tsx
import { Html, Head, Body, Container, Heading, Text, Link, Button } from '@react-email/components';

interface EnrollmentEmailProps {
  userName: string;
  courseTitle: string;
  courseUrl: string;
  instructorName: string;
}

export function EnrollmentEmail({
  userName,
  courseTitle,
  courseUrl,
  instructorName,
}: EnrollmentEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>You're enrolled!</Heading>
          <Text>Hi {userName},</Text>
          <Text>
            You've been enrolled in <strong>{courseTitle}</strong> by {instructorName}.
          </Text>
          <Button href={courseUrl}>Start Learning</Button>
          <Text>Happy learning!</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

```typescript
// lib/resend/templates/certificate.tsx
import { Html, Head, Body, Container, Heading, Text, Link, Button } from '@react-email/components';

interface CertificateEmailProps {
  userName: string;
  courseTitle: string;
  certificateUrl: string;
  verificationCode: string;
}

export function CertificateEmail({
  userName,
  courseTitle,
  certificateUrl,
  verificationCode,
}: CertificateEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>🎉 Congratulations!</Heading>
          <Text>Hi {userName},</Text>
          <Text>
            You've completed <strong>{courseTitle}</strong>!
          </Text>
          <Text>Your certificate is ready for download.</Text>
          <Button href={certificateUrl}>Download Certificate</Button>
          <Text>
            Verification Code: <strong>{verificationCode}</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

#### 6.3.3 Email Sending Functions

```typescript
// lib/resend/emails.ts
import { resend, FROM_EMAIL } from './client';
import { WelcomeEmail } from './templates/welcome';
import { EnrollmentEmail } from './templates/enrollment';
import { CertificateEmail } from './templates/certificate';

export async function sendWelcomeEmail(email: string, userName: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to AI Professor!',
    react: WelcomeEmail({
      userName,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    }),
  });
  
  if (error) throw error;
  
  await logEmailSent(email, 'welcome', data.id);
  return data;
}

export async function sendEnrollmentEmail(
  email: string,
  courseTitle: string,
  userName?: string,
  courseSlug?: string,
  instructorName?: string
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `You're enrolled in ${courseTitle}!`,
    react: EnrollmentEmail({
      userName: userName || 'Student',
      courseTitle,
      courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseSlug}`,
      instructorName: instructorName || 'Your Instructor',
    }),
  });
  
  if (error) throw error;
  
  await logEmailSent(email, 'enrollment', data.id);
  return data;
}

export async function sendCertificateEmail(
  email: string,
  userName: string,
  courseTitle: string,
  certificateUrl: string,
  verificationCode: string
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `🎓 Your Certificate for ${courseTitle}`,
    react: CertificateEmail({
      userName,
      courseTitle,
      certificateUrl,
      verificationCode,
    }),
  });
  
  if (error) throw error;
  
  await logEmailSent(email, 'certificate', data.id);
  return data;
}

async function logEmailSent(
  recipient: string,
  type: string,
  resendId: string,
  userId?: string
) {
  await supabase.from('email_logs').insert({
    user_id: userId,
    email_type: type,
    recipient,
    resend_id: resendId,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });
}
```

---

## 7. Security Considerations

### 7.1 Authentication & Authorization

#### 7.1.1 Supabase Auth Configuration

```typescript
// Authentication requirements:
// - Email verification required
// - Strong password policy (min 8 chars, mixed case, number, special)
// - Session timeout: 7 days
// - Refresh token rotation enabled
// - MFA optional (TOTP)
```

#### 7.1.2 Role-Based Access Control (RBAC)

```typescript
// lib/auth/permissions.ts
export const PERMISSIONS = {
  // Courses
  'courses:create': ['instructor', 'admin'],
  'courses:read': ['student', 'instructor', 'admin'],
  'courses:update': ['instructor', 'admin'], // Own courses only
  'courses:delete': ['admin'],
  'courses:publish': ['instructor', 'admin'],
  
  // Users
  'users:read': ['admin'],
  'users:update': ['admin'], // Other users
  'users:delete': ['admin'],
  
  // AI
  'ai:generate': ['instructor', 'admin'],
  'ai:tutor': ['student', 'instructor', 'admin'],
  
  // Analytics
  'analytics:view': ['instructor', 'admin'],
  'analytics:admin': ['admin'],
} as const;

export function hasPermission(role: string, permission: string): boolean {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

export function canModifyCourse(userId: string, course: Course): boolean {
  if (course.instructor_id === userId) return true;
  // Check if admin
  return false; // Will check role separately
}
```

#### 7.1.3 API Route Protection

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/instructor', '/settings', '/api'];
const INSTRUCTOR_ROUTES = ['/instructor', '/api/courses', '/api/modules', '/api/lessons', '/api/ai'];
const ADMIN_ROUTES = ['/admin', '/api/admin'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;
  
  // Check if route requires authentication
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  // Check instructor routes
  if (INSTRUCTOR_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_id, roles(name)')
      .eq('id', session.user.id)
      .single();
    
    const role = profile?.roles?.name;
    if (!['instructor', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  
  // Check admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_id, roles(name)')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.roles?.name !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### 7.2 Data Security

#### 7.2.1 Input Validation

```typescript
// All inputs validated with Zod schemas
// Example: lib/validators/course.ts
import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(5).max(100),
  subtitle: z.string().max(200).optional(),
  description: z.string().min(50).max(5000),
  category_id: z.number().int().positive(),
  price_cents: z.number().int().min(0).max(1000000),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimated_hours: z.number().positive().max(1000).optional(),
  prerequisites: z.array(z.string().max(200)).max(10).optional(),
  learning_objectives: z.array(z.string().max(300)).max(15).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
```

#### 7.2.2 SQL Injection Prevention

```typescript
// All database queries use Supabase client with parameterized queries
// Never use raw SQL with string interpolation

// GOOD:
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('slug', userProvidedSlug);

// BAD:
// Never do this:
// const query = `SELECT * FROM courses WHERE slug = '${userProvidedSlug}'`;
```

#### 7.2.3 XSS Prevention

```typescript
// 1. React auto-escapes JSX content
// 2. Sanitize any user-generated HTML before rendering
import DOMPurify from 'dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href'],
  });
}

// 3. Content Security Policy headers
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://api.openai.com https://api.stripe.com https://*.supabase.co;
      frame-src https://js.stripe.com https://hooks.stripe.com;
    `.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

### 7.3 API Security

#### 7.3.1 Rate Limiting

```typescript
// middleware.ts or API route wrapper
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RATE_LIMITS = {
  '/api/auth/login': { requests: 5, window: 900 },     // 5 per 15 min
  '/api/auth/register': { requests: 3, window: 3600 }, // 3 per hour
  '/api/ai': { requests: 50, window: 3600 },           // 50 per hour
  'default': { requests: 100, window: 60 },            // 100 per min
};

export async function rateLimiter(
  identifier: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const limitConfig = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const key = `rate-limit:${endpoint}:${identifier}`;
  
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, limitConfig.window);
  }
  
  const ttl = await redis.ttl(key);
  
  return {
    allowed: current <= limitConfig.requests,
    remaining: Math.max(0, limitConfig.requests - current),
    resetAt: Date.now() + (ttl * 1000),
  };
}
```

#### 7.3.2 CSRF Protection

```typescript
// Next.js handles CSRF automatically for same-origin requests
// For API routes, verify Origin/Referer headers

export function validateCSRF(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  if (!origin && !referer) return false;
  
  const allowedOrigins = [
    `https://${host}`,
    process.env.NEXT_PUBLIC_APP_URL,
  ];
  
  if (origin && !allowedOrigins.includes(origin)) return false;
  if (referer && !allowedOrigins.some(o => referer.startsWith(o))) return false;
  
  return true;
}
```

### 7.4 Sensitive Data Protection

#### 7.4.1 Environment Variables

```bash
# .env.local (NEVER commit)
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://professor.ai
JWT_SECRET=...

# Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### 7.4.2 Secrets Management

```typescript
// Never expose secrets to client
// NEXT_PUBLIC_ prefix for client-safe values only

// Server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server only
});

// Safe for client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Safe (restricted by RLS)
);
```

### 7.5 Content Security

#### 7.5.1 User Content Moderation

```typescript
// For user-generated content (reviews, comments)
// Consider implementing:
// 1. Profanity filter
// 2. Spam detection
// 3. Manual review queue for flagged content

// lib/utils/content-moderation.ts
export async function moderateContent(text: string): Promise<{
  approved: boolean;
  flags: string[];
}> {
  // Use OpenAI moderation API or similar
  const response = await openai.moderations.create({
    input: text,
  });
  
  const result = response.results[0];
  
  return {
    approved: !result.flagged,
    flags: Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category),
  };
}
```

### 7.6 Security Checklist

- [ ] Enable RLS on all tables
- [ ] Validate all inputs with Zod
- [ ] Sanitize user-generated HTML
- [ ] Use parameterized queries (Supabase client)
- [ ] Implement rate limiting on all API routes
- [ ] Set secure HTTP headers (CSP, X-Frame-Options, etc.)
- [ ] Never expose secrets to client
- [ ] Validate Stripe webhook signatures
- [ ] Use HTTPS everywhere
- [ ] Enable Supabase email verification
- [ ] Implement password strength requirements
- [ ] Set up logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Set up error tracking (Sentry)

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment

#### 8.1.1 Environment Setup

- [ ] Create Supabase project
  - [ ] Configure authentication providers
  - [ ] Set up email templates
  - [ ] Enable RLS
  - [ ] Run migrations
  - [ ] Seed categories

- [ ] Create Stripe account
  - [ ] Complete account verification
  - [ ] Create products and prices
  - [ ] Set up webhook endpoint
  - [ ] Get API keys

- [ ] Create OpenAI account
  - [ ] Set usage limits
  - [ ] Get API key
  - [ ] Enable GPT-4o access

- [ ] Create Resend account
  - [ ] Verify domain
  - [ ] Create email templates
  - [ ] Get API key

- [ ] Create Upstash Redis (for rate limiting)
  - [ ] Get REST URL and token

#### 8.1.2 Vercel Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add RESEND_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN

# Repeat for preview and production environments
```

### 8.2 Deployment Steps

#### 8.2.1 First Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 8.2.2 Configure Custom Domain

```bash
# Add domain in Vercel dashboard or CLI
vercel domains add professor.ai
vercel domains add www.professor.ai

# Configure DNS records as instructed
```

#### 8.2.3 Configure Webhooks

**Stripe Webhook:**
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://professor.ai/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

**Resend Webhook (optional):**
1. Go to Resend Dashboard > Webhooks
2. Add endpoint: `https://professor.ai/api/webhooks/resend`
3. Select events (delivered, opened, bounced, etc.)

### 8.3 Post-Deployment

#### 8.3.1 Verification Checklist

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Email verification sends
- [ ] Login works
- [ ] Course catalog displays
- [ ] Course detail pages load
- [ ] Stripe checkout works (test mode)
- [ ] Webhooks received (check Stripe/Resend dashboards)
- [ ] Enrollment created after payment
- [ ] Email notifications sent
- [ ] AI generation works
- [ ] Progress tracking works
- [ ] Certificate generation works

#### 8.3.2 Monitoring Setup

```typescript
// Set up error tracking with Sentry
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});

// Set up logging
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production' 
    ? { target: 'pino-pretty' } 
    : undefined,
});
```

#### 8.3.3 Analytics Setup

- [ ] Set up Vercel Analytics
- [ ] Configure Google Analytics (optional)
- [ ] Set up conversion tracking for payments

### 8.4 Production Checklist

#### 8.4.1 Security

- [ ] All environment variables set in Vercel
- [ ] Stripe in live mode (switch API keys)
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] RLS policies verified
- [ ] Rate limiting active
- [ ] Error tracking active

#### 8.4.2 Performance

- [ ] Images optimized (Next.js Image component)
- [ ] Fonts optimized
- [ ] API routes cached where appropriate
- [ ] Database indexes created
- [ ] CDN configured (Vercel Edge Network)

#### 8.4.3 Reliability

- [ ] Error boundaries implemented
- [ ] Fallback pages (404, error)
- [ ] Database backups configured (Supabase)
- [ ] Uptime monitoring (Vercel, Uptime Robot)

#### 8.4.4 Legal

- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if EU users)
- [ ] Refund policy

### 8.5 Maintenance

#### 8.5.1 Regular Tasks

- **Daily:** Monitor error logs
- **Weekly:** Review Stripe dashboard for failed payments
- **Weekly:** Check AI usage and costs
- **Monthly:** Review security logs
- **Monthly:** Update dependencies
- **Quarterly:** Security audit

#### 8.5.2 Backup Strategy

```bash
# Supabase automatic backups (Pro plan)
# - Daily backups retained for 7 days
# - Weekly backups retained for 4 weeks
# - Point-in-time recovery enabled

# Manual backup script (scripts/backup.ts)
import { exec } from 'child_process';

async function backup() {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `backup-${timestamp}.sql`;
  
  exec(
    `pg_dump ${process.env.DATABASE_URL} > backups/${filename}`,
    (error) => {
      if (error) console.error('Backup failed:', error);
      else console.log('Backup created:', filename);
    }
  );
}

backup();
```

#### 8.5.3 Update Procedure

```bash
# 1. Update dependencies
npm update

# 2. Check for security vulnerabilities
npm audit

# 3. Fix vulnerabilities
npm audit fix

# 4. Test locally
npm run dev
npm run test
npm run build

# 5. Deploy to preview
vercel

# 6. Test preview deployment

# 7. Deploy to production
vercel --prod

# 8. Monitor for issues
```

---

## Appendix

### A. Database Migration Commands

```bash
# Generate Supabase types
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts

# Run migrations locally
npx supabase db reset

# Push migrations to remote
npx supabase db push
```

### B. Useful Scripts

```bash
# Create admin user
npx ts-node scripts/create-admin.ts

# Seed categories
npx ts-node scripts/seed-categories.ts

# Generate sample courses (development)
npx ts-node scripts/seed-courses.ts
```

### C. Testing Strategy

```typescript
// Unit tests: Jest + React Testing Library
// Integration tests: Playwright
// E2E tests: Playwright

// Example test structure
describe('Course Enrollment', () => {
  it('should enroll user after successful payment', async () => {
    // 1. Create user
    // 2. Add course to cart
    // 3. Complete checkout
    // 4. Verify enrollment created
    // 5. Verify email sent
  });
});
```

### D. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |
| API Response Time (p95) | < 500ms |
| AI Generation Time | < 10s |

---

**Document End**

*This architecture document is a living specification. Update as the system evolves.*
