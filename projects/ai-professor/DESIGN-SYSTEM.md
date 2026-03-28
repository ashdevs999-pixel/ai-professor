# Pulse + AI Professor Design System

> A comprehensive design system for Pulse + AI Professor - Real-time AI news aggregation meets AI-powered learning

**Brand:** Pulse + AI Professor
**Tagline:** Stay current. Get smarter. One platform.

**Primary Brand:** Pulse (News aggregation)
**Secondary Brand:** AI Professor (Courses and learning)

---

## 1. Color Palette

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#2563EB` | Primary buttons, links, active states |
| **Primary Hover** | `#1D4ED8` | Primary button hover state |
| **Primary Light** | `#DBEAFE` | Primary backgrounds, badges |
| **Secondary** | `#64748B` | Secondary text, icons |
| **Secondary Hover** | `#475569` | Secondary button hover |
| **Accent** | `#7C3AED` | Highlights, special features |
| **Accent Light** | `#EDE9FE` | Accent backgrounds |

### Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#F8FAFC` | Page background |
| `gray-100` | `#F1F5F9` | Card background, dividers |
| `gray-200` | `#E2E8F0` | Borders, disabled backgrounds |
| `gray-300` | `#CBD5E1` | Placeholder text |
| `gray-400` | `#94A3B8` | Icon default |
| `gray-500` | `#64748B` | Secondary text |
| `gray-600` | `#475569` | Body text |
| `gray-700` | `#334155` | Headings |
| `gray-800` | `#1E293B` | Emphasized text |
| `gray-900` | `#0F172A` | Primary text |

### Dark Mode

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `#F8FAFC` | `#0F172A` | Page background |
| Surface | `#FFFFFF` | `#1E293B` | Cards, modals |
| Surface Elevated | `#FFFFFF` | `#334155` | Elevated cards |
| Border | `#E2E8F0` | `#334155` | Borders |
| Text Primary | `#0F172A` | `#F8FAFC` | Main text |
| Text Secondary | `#64748B` | `#94A3B8` | Secondary text |
| Primary | `#2563EB` | `#3B82F6` | Primary color |
| Primary Light | `#DBEAFE` | `#1E3A5F` | Primary backgrounds |

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| **Success** | `#059669` | `#10B981` | Confirmations, completed |
| Success Light | `#D1FAE5` | `#064E3B` | Success backgrounds |
| **Warning** | `#D97706` | `#F59E0B` | Warnings, alerts |
| Warning Light | `#FEF3C7` | `#78350F` | Warning backgrounds |
| **Error** | `#DC2626` | `#EF4444` | Errors, destructive |
| Error Light | `#FEE2E2` | `#7F1D1D` | Error backgrounds |
| **Info** | `#0284C7` | `#38BDF8` | Informational |
| Info Light | `#E0F2FE` | `#0C4A6E` | Info backgrounds |

---

## 2. Typography

### Font Families

```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Font Scale

| Token | Desktop | Mobile | Line Height | Letter Spacing |
|-------|---------|--------|-------------|----------------|
| `text-xs` | 12px | 12px | 1.5 | 0.025em |
| `text-sm` | 14px | 14px | 1.5 | 0 |
| `text-base` | 16px | 16px | 1.6 | 0 |
| `text-lg` | 18px | 17px | 1.6 | 0 |
| `text-xl` | 20px | 18px | 1.5 | 0 |
| `text-2xl` | 24px | 20px | 1.4 | -0.01em |
| `text-3xl` | 30px | 24px | 1.3 | -0.015em |
| `text-4xl` | 36px | 28px | 1.25 | -0.02em |
| `text-5xl` | 48px | 32px | 1.15 | -0.025em |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasis, buttons |
| `font-semibold` | 600 | Subheadings |
| `font-bold` | 700 | Headings, CTAs |

---

## 3. Component Specifications

### 3.1 Buttons

#### Primary Button
```
┌─────────────────────────────┐
│     Get Started             │
└─────────────────────────────┘
```
- **Background:** Primary (`#2563EB`)
- **Text:** White (`#FFFFFF`)
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Font:** 14px, Medium (500)
- **Hover:** Background darkens 10%
- **Active:** Scale 0.98
- **Focus:** 2px ring, Primary Light
- **Disabled:** 50% opacity, no pointer events

#### Secondary Button
```
┌─────────────────────────────┐
│     Learn More              │
└─────────────────────────────┘
```
- **Background:** Transparent
- **Border:** 1px solid `gray-300`
- **Text:** `gray-700`
- **Padding:** 12px 24px
- **Hover:** Background `gray-50`, border `gray-400`

#### Ghost Button
```
   Cancel
```
- **Background:** Transparent
- **Text:** `gray-600`
- **Padding:** 8px 16px
- **Hover:** Background `gray-100`, Text `gray-700`

#### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 32px | 8px 16px | 13px |
| Medium | 40px | 12px 24px | 14px |
| Large | 48px | 16px 32px | 16px |

### 3.2 Cards

#### Course Card
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        Course Image             │ │
│ │       (16:9 ratio)              │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│  AI & Machine Learning              │
│  Master neural networks in 4 weeks  │
│                                     │
│  ●●●●●○○○○○  5/10 lessons          │
│                                     │
│  ┌────────────────────────────────┐ │
│  │       Continue Learning        │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Background:** Surface (`#FFFFFF` / `#1E293B`)
- **Border:** 1px solid `gray-200` / `#334155`
- **Border Radius:** 12px
- **Padding:** 16px
- **Shadow:** `0 1px 3px rgba(0,0,0,0.1)`
- **Hover:** Shadow `0 4px 12px rgba(0,0,0,0.15)`, translateY(-2px)

#### Lesson Card
```
┌─────────────────────────────────────┐
│  01                                 │
│  Introduction to Neural Networks    │
│  15 min · Video + Quiz              │
│                                     │
│  ✓ Completed                        │
└─────────────────────────────────────┘
```
- **Padding:** 16px
- **Border:** 1px solid `gray-200`
- **Border Radius:** 8px
- **Hover:** Background `gray-50`

#### Progress Card
```
┌─────────────────────────────────────┐
│  This Week's Progress               │
│                                     │
│  ████████████░░░░░░░░  65%         │
│                                     │
│  3 of 5 lessons completed           │
│  Quiz score: 87%                    │
└─────────────────────────────────────┘
```
- **Progress Bar Height:** 8px
- **Progress Bar Radius:** 4px
- **Progress Fill:** Primary

### 3.3 Forms

#### Text Input
```
┌─────────────────────────────────────┐
│  Email Address                      │
│  ┌─────────────────────────────────┐│
│  │ name@company.com                ││
│  └─────────────────────────────────┘│
│  Enter your work email              │
└─────────────────────────────────────┘
```
- **Label:** 14px, Medium, `gray-700`
- **Input Height:** 44px
- **Input Padding:** 12px 16px
- **Border:** 1px solid `gray-300`
- **Border Radius:** 8px
- **Focus:** Border Primary, 2px ring Primary Light
- **Error:** Border Error, Helper text in Error color

#### Select
```
┌─────────────────────────────────────┐
│  Course Category                    │
│  ┌─────────────────────────────────┐│
│  │ Technology                ▼     ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```
- **Same as Input** with dropdown icon

#### Checkbox
```
  ☑ I agree to the terms of service
  ☐ Subscribe to weekly updates
```
- **Size:** 20px × 20px
- **Border Radius:** 4px
- **Checked:** Background Primary, white checkmark

#### Radio
```
  ○ Individual
  ● Team (5+ members)
```
- **Size:** 20px diameter
- **Selected:** Primary border with Primary dot

### 3.4 Navigation

#### Header
```
┌─────────────────────────────────────────────────────────────────┐
│  ⭐ AI Professor     Courses  Pricing  About     [Search] [👤]  │
└─────────────────────────────────────────────────────────────────┘
```
- **Height:** 64px (desktop), 56px (mobile)
- **Background:** Surface with subtle shadow
- **Logo:** 24px icon + 20px text
- **Nav Links:** 14px, Medium, `gray-600`, hover `gray-900`
- **Active Link:** Primary color

#### Sidebar (Dashboard)
```
┌──────────────┐
│  📊 Dashboard│
│  📚 Courses  │
│  📈 Progress │
│  ⚙️ Settings │
│              │
│  ──────────  │
│  ❓ Help     │
└──────────────┘
```
- **Width:** 240px (collapsible to 64px)
- **Item Height:** 44px
- **Active Item:** Background Primary Light, text Primary

#### Mobile Menu
- **Hamburger icon** top-right
- **Full-screen overlay** with slide-in animation
- **Large touch targets** (min 44px)

### 3.5 Modals
```
┌─────────────────────────────────────────┐
│  Complete Lesson?                    ✕  │
├─────────────────────────────────────────┤
│                                         │
│  You're about to mark this lesson as    │
│  complete. You can revisit it anytime.  │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Cancel    │  │  Mark Complete  │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```
- **Overlay:** `rgba(0,0,0,0.5)`
- **Background:** Surface
- **Border Radius:** 16px
- **Padding:** 24px
- **Max Width:** 480px
- **Animation:** Fade + scale from 95% to 100%

### 3.6 Toasts
```
┌─────────────────────────────────────┐
│  ✓  Lesson saved successfully       │
└─────────────────────────────────────┘
```
- **Position:** Top-right corner
- **Height:** 48px
- **Border Radius:** 8px
- **Shadow:** Elevated
- **Auto-dismiss:** 4 seconds
- **Variants:** Success (green), Error (red), Warning (yellow), Info (blue)

### 3.7 Tooltips
```
        ▼
┌───────────────┐
│  Helpful tip  │
└───────────────┘
```
- **Background:** `gray-800`
- **Text:** White
- **Padding:** 8px 12px
- **Border Radius:** 6px
- **Font Size:** 12px
- **Max Width:** 240px

---

## 4. Layout Grid

### Breakpoints

| Name | Min Width | Max Width | Usage |
|------|-----------|-----------|-------|
| `xs` | 0px | 479px | Mobile portrait |
| `sm` | 480px | 639px | Mobile landscape |
| `md` | 640px | 767px | Tablet portrait |
| `lg` | 768px | 1023px | Tablet landscape |
| `xl` | 1024px | 1279px | Small desktop |
| `2xl` | 1280px | ∞ | Large desktop |

### Container Widths

| Breakpoint | Container Width | Padding |
|------------|-----------------|---------|
| xs-sm | 100% | 16px |
| md | 640px | 24px |
| lg | 768px | 32px |
| xl | 1024px | 32px |
| 2xl | 1280px | 48px |

### Spacing Scale (4px base)

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Compact spacing |
| `space-3` | 12px | Default tight |
| `space-4` | 16px | Standard spacing |
| `space-5` | 20px | Comfortable |
| `space-6` | 24px | Section padding |
| `space-8` | 32px | Component gaps |
| `space-10` | 40px | Section gaps |
| `space-12` | 48px | Large sections |
| `space-16` | 64px | Page sections |
| `space-20` | 80px | Hero spacing |
| `space-24` | 96px | Major sections |

### Grid Columns

| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| xs-sm | 4 | 16px |
| md | 8 | 24px |
| lg+ | 12 | 32px |

---

## 5. Page Wireframes

### 5.1 Landing Page
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Features | Pricing | About | [Login] [Get Started]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                    ┌──────────────────────┐                        │
│                    │                      │                        │
│                    │      HERO IMAGE      │                        │
│                    │                      │                        │
│                    └──────────────────────┘                        │
│                                                                    │
│            Master AI. One Week at a Time.                         │
│                                                                    │
│       Weekly courses designed for busy professionals.             │
│       Learn in 15-minute segments, apply immediately.             │
│                                                                    │
│              [Get Started Free] [Watch Demo]                      │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    TRUSTED BY TEAMS AT                                            │
│    [Logo] [Logo] [Logo] [Logo] [Logo]                             │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    HOW IT WORKS                                                   │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│    │    1     │  │    2     │  │    3     │                       │
│    │  Choose  │  │  Learn   │  │  Apply   │                       │
│    │  Topic   │  │ Weekly   │  │ At Work  │                       │
│    └──────────┘  └──────────┘  └──────────┘                       │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    FEATURED COURSES                                               │
│    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│    │   Course 1  │ │   Course 2  │ │   Course 3  │                │
│    │             │ │             │ │             │                │
│    └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│                    [View All Courses →]                           │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    TESTIMONIALS                                                   │
│    "This transformed how our team learns AI."                     │
│    — Sarah Chen, CTO at TechCorp                                 │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    PRICING TEASER                                                 │
│    Start free. Upgrade when you're ready.                         │
│    [View Pricing →]                                               │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  FOOTER: Links | Social | Legal | © 2024 AI Professor            │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 Course Catalog
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER                                                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    Courses                                                        │
│                                                                    │
│    ┌────────────────────────────────────────────────────────────┐ │
│    │ 🔍 Search courses...                    [Category ▼]       │ │
│    └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│    │ All     │ │ Tech    │ │ Business│ │ Creative│               │
│    └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                    │
│    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│    │   [Image]   │ │   [Image]   │ │   [Image]   │                │
│    │             │ │             │ │             │                │
│    │ Course Title│ │ Course Title│ │ Course Title│                │
│    │ Description │ │ Description │ │ Description │                │
│    │ 10 lessons  │ │ 8 lessons   │ │ 12 lessons  │                │
│    │ ★ 4.8       │ │ ★ 4.9       │ │ ★ 4.7       │                │
│    └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│    │   [Image]   │ │   [Image]   │ │   [Image]   │                │
│    │             │ │             │ │             │                │
│    │ Course Title│ │ Course Title│ │ Course Title│                │
│    │ Description │ │ Description │ │ Description │                │
│    │ 6 lessons   │ │ 10 lessons  │ │ 8 lessons   │                │
│    │ ★ 4.6       │ │ ★ 4.8       │ │ ★ 4.9       │                │
│    └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│                    [1] [2] [3] ... [10]                           │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                            │
└────────────────────────────────────────────────────────────────────┘
```

### 5.3 Course Detail
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER                                                            │
├────────────────────────────────────────────────────────────────────┤
│    Home > Courses > AI & Machine Learning                         │
│                                                                    │
│    ┌────────────────────────────────────┐ ┌───────────────────┐   │
│    │                                    │ │                   │   │
│    │         Course Preview             │ │  ENROLL CARD      │   │
│    │            Video                   │ │                   │   │
│    │                                    │ │  $49 one-time     │   │
│    │                                    │ │  or $0 with Pro   │   │
│    └────────────────────────────────────┘ │                   │   │
│                                            │  [Enroll Now]     │   │
│    AI & Machine Learning                   │                   │   │
│    Master neural networks in 4 weeks       │  Includes:        │   │
│                                            │  ✓ 10 lessons     │   │
│    By Dr. Sarah Chen · Updated Mar 2024    │  ✓ 5 quizzes      │   │
│                                            │  ✓ Certificate    │   │
│    ★ 4.8 (2,847 reviews) · 10 lessons      │  ✓ Lifetime       │   │
│    · 2.5 hours total                       │                   │   │
│                                            └───────────────────┘   │
│    ─────────────────────────────────────────────────────────────   │
│                                                                    │
│    About This Course                                              │
│    ────────────────                                               │
│    Learn the fundamentals of AI and machine learning...           │
│                                                                    │
│    What You'll Learn                                              │
│    ──────────────────                                             │
│    ✓ Build neural networks from scratch                          │
│    ✓ Implement common ML algorithms                              │
│    ✓ Deploy models to production                                  │
│                                                                    │
│    Course Content                                                 │
│    ────────────────                                               │
│    Week 1: Foundations                                    ▼      │
│    ┌────────────────────────────────────────────────────────────┐ │
│    │ 01. Introduction to AI                      15 min  [Free] │ │
│    │ 02. What is Machine Learning?               12 min         │ │
│    │ 03. Your First ML Model                     18 min         │ │
│    └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│    Week 2: Neural Networks                                 ▶      │
│    Week 3: Deep Learning                                   ▶      │
│    Week 4: Production ML                                   ▶      │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                            │
└────────────────────────────────────────────────────────────────────┘
```

### 5.4 Lesson View
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER: [← Back to Course]              Progress: 3/10    [👤]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    ┌─────────────────────────────────────────────────────────┐    │
│    │                                                         │    │
│    │                                                         │    │
│    │                    VIDEO PLAYER                         │    │
│    │                                                         │    │
│    │                         ▶                               │    │
│    │                                                         │    │
│    │  ────────────────────────────────────────○──            │    │
│    │  0:00                                    15:32          │    │
│    │                                                         │    │
│    └─────────────────────────────────────────────────────────┘    │
│                                                                    │
│    Lesson 3: Your First ML Model                                  │
│                                                                    │
│    ┌────────────────────────────────────────────────────────────┐ │
│    │  [Overview] [Notes] [Resources] [Discussion]               │ │
│    └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│    Overview                                                       │
│    ──────────                                                     │
│    In this lesson, you'll build your first machine learning      │
│    model from scratch. We'll cover:                              │
│                                                                    │
│    • Data preparation                                             │
│    • Feature selection                                            │
│    • Model training                                               │
│    • Evaluation metrics                                           │
│                                                                    │
│    ┌────────────────────────────────────────────────────────────┐ │
│    │  QUIZ: Test Your Knowledge                     [Start Quiz]│ │
│    └────────────────────────────────────────────────────────────┘ │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│    ┌────────────────────────────────────────────────────────────┐ │
│    │  ← Previous: What is ML?      |    Next: Neural Networks → │ │
│    │       [Review]                |         [Continue]         │ │
│    └────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                            │
└────────────────────────────────────────────────────────────────────┘
```

### 5.5 User Dashboard
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER                                                            │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                     │
│  SIDEBAR     │  Dashboard                                          │
│              │                                                     │
│  📊 Dashboard│  ┌───────────────┐ ┌───────────────┐                │
│  📚 Courses  │  │ Courses       │ │ Lessons       │                │
│  📈 Progress │  │ In Progress   │ │ This Week     │                │
│  🏆 Achieve- │  │      3        │ │      12       │                │
│     ments    │  └───────────────┘ └───────────────┘                │
│  ⚙️ Settings │                                                     │
│              │  ┌───────────────┐ ┌───────────────┐                │
│  ──────────  │  │ Streak        │ │ Quiz Avg      │                │
│              │  │    7 days     │ │    87%        │                │
│  ❓ Help     │  └───────────────┘ └───────────────┘                │
│              │                                                     │
│              │  Continue Learning                                  │
│              │  ──────────────────                                 │
│              │  ┌─────────────────────────────────────────────┐   │
│              │  │ [Image]  AI & Machine Learning              │   │
│              │  │          Lesson 5 of 10                     │   │
│              │  │          ████████░░░░░░░░░░░░ 50%           │   │
│              │  │          [Continue]                         │   │
│              │  └─────────────────────────────────────────────┘   │
│              │                                                     │
│              │  Weekly Progress                                    │
│              │  ──────────────                                     │
│              │  ┌─────────────────────────────────────────────┐   │
│              │  │  M   T   W   T   F   S   S                   │   │
│              │  │  ●   ●   ●   ○   ○   ○   ○                   │   │
│              │  │  3   2   4   -   -   -   -   lessons/day     │   │
│              │  └─────────────────────────────────────────────┘   │
│              │                                                     │
│              │  Upcoming                                           │
│              │  ──────────                                         │
│              │  • New course: "Prompt Engineering" - Tomorrow     │
│              │  • Certificate ready: "AI Basics" - Download       │
│              │                                                     │
├──────────────┴─────────────────────────────────────────────────────┤
│  FOOTER                                                            │
└────────────────────────────────────────────────────────────────────┘
```

### 5.6 Pricing Page
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER                                                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                    Simple, Transparent Pricing                     │
│                                                                    │
│         Choose the plan that fits your learning journey           │
│                                                                    │
│         [Monthly]  [Annual - Save 20%]                            │
│                                                                    │
│    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│    │    FREE         │ │    PRO          │ │    TEAM         │    │
│    │                 │ │                 │ │                 │    │
│    │    $0           │ │    $29/mo       │ │    $99/mo       │    │
│    │    forever      │ │    per user     │ │    5 users      │    │
│    │                 │ │                 │ │                 │    │
│    │ ─────────────── │ │ ─────────────── │ │ ─────────────── │    │
│    │                 │ │                 │ │                 │    │
│    │ ✓ 1 course/week │ │ ✓ All courses   │ │ ✓ All courses   │    │
│    │ ✓ Basic quizzes │ │ ✓ Unlimited     │ │ ✓ Unlimited     │    │
│    │ ✗ Certificates  │ │ ✓ Certificates  │ │ ✓ Certificates  │    │
│    │ ✗ Offline       │ │ ✓ Offline mode  │ │ ✓ Offline mode  │    │
│    │ ✗ Priority      │ │ ✓ Priority      │ │ ✓ Admin panel   │    │
│    │                 │ │   support       │ │ ✓ Analytics     │    │
│    │                 │ │                 │ │ ✓ Priority      │    │
│    │                 │ │                 │ │   support       │    │
│    │                 │ │                 │ │                 │    │
│    │ [Get Started]   │ │ [Subscribe]     │ │ [Contact Sales] │    │
│    │                 │ │                 │ │                 │    │
│    └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                    │
│                                                                    │
│    ─────────────────────────────────────────────────────────────   │
│                                                                    │
│    Frequently Asked Questions                                     │
│    ──────────────────────────                                     │
│                                                                    │
│    ▼ Can I switch plans anytime?                                  │
│      Yes! Upgrade or downgrade at any time...                     │
│                                                                    │
│    ▶ What payment methods do you accept?                          │
│    ▶ Is there a student discount?                                 │
│    ▶ Can I get a refund?                                          │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. Icon System

### Recommended Library: **Lucide Icons**

**Why Lucide:**
- Clean, consistent 24×24 grid
- Excellent accessibility support
- Tree-shakeable (only load used icons)
- React, Vue, and vanilla JS support
- Regular updates and growing library

### Usage Guidelines

```jsx
// Correct usage
import { BookOpen, Play, CheckCircle } from 'lucide-react';

<BookOpen size={20} strokeWidth={1.5} />
```

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| Small | 16px | Inline with text, badges |
| Medium | 20px | Buttons, nav items |
| Large | 24px | Section icons, empty states |
| XL | 32px | Feature highlights |
| XXL | 48px | Hero sections |

### Stroke Width

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 1.5 | Default, clean look |
| Regular | 2 | Emphasis |
| Bold | 2.5 | High emphasis |

### Common Icons for AI Professor

| Category | Icons |
|----------|-------|
| Navigation | `Menu`, `X`, `ChevronLeft`, `ChevronRight`, `ArrowRight` |
| Courses | `BookOpen`, `Play`, `FileText`, `Video`, `Headphones` |
| Progress | `CheckCircle`, `Circle`, `Clock`, `TrendingUp`, `Award` |
| User | `User`, `Settings`, `LogOut`, `Bell`, `Search` |
| Status | `AlertCircle`, `Check`, `Info`, `AlertTriangle`, `X` |
| Media | `Play`, `Pause`, `Volume2`, `Maximize`, `SkipBack`, `SkipForward` |

---

## 7. Animation Guidelines

### Principles

1. **Purposeful** - Every animation serves a function
2. **Subtle** - Enhance, don't distract
3. **Fast** - Respect user's time
4. **Consistent** - Same patterns everywhere

### Transition Durations

| Token | Duration | Usage |
|-------|----------|-------|
| `fast` | 100ms | Hover states, toggles |
| `normal` | 200ms | Button clicks, dropdowns |
| `slow` | 300ms | Modals, page transitions |
| `slower` | 500ms | Complex animations |

### Easing Functions

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);      /* Smooth in-out */
--ease-in: cubic-bezier(0.4, 0, 1, 1);             /* Accelerate */
--ease-out: cubic-bezier(0, 0, 0.2, 1);            /* Decelerate */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Slight overshoot */
```

### Micro-interactions

#### Button Hover
```css
.button {
  transition: background-color 150ms var(--ease-default),
              transform 150ms var(--ease-default);
}
.button:hover {
  transform: translateY(-1px);
}
.button:active {
  transform: scale(0.98);
}
```

#### Card Hover
```css
.card {
  transition: box-shadow 200ms var(--ease-default),
              transform 200ms var(--ease-default);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

#### Modal Entry
```css
.modal-overlay {
  animation: fadeIn 200ms var(--ease-out);
}
.modal-content {
  animation: scaleIn 300ms var(--ease-bounce);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

#### Toast Entry
```css
.toast {
  animation: slideInRight 300ms var(--ease-out);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Loading States

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Spinner
```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

#### Progress Bar
```css
.progress-bar {
  transition: width 500ms var(--ease-out);
}
```

### Reduce Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility (WCAG 2.1 AA)

### Color Contrast
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+ or 14px bold):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 against adjacent colors

### Focus States
- All interactive elements have visible focus rings
- Focus ring: 2px solid, Primary color
- Never remove focus outlines without replacement

### Touch Targets
- Minimum 44×44px for all interactive elements
- 8px minimum spacing between touch targets

### Screen Readers
- All images have meaningful alt text
- Icons have `aria-label` or are hidden from AT
- Form inputs have associated labels
- Use semantic HTML elements

### Motion
- Respect `prefers-reduced-motion`
- No auto-playing video/audio
- Provide pause controls for animations

---

## 9. CSS Variables Summary

```css
:root {
  /* Colors - Light */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #DBEAFE;
  --color-secondary: #64748B;
  --color-accent: #7C3AED;
  
  /* Backgrounds */
  --bg-page: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  
  /* Text */
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  
  /* Semantic */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #0284C7;
  
  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode */
[data-theme="dark"] {
  --bg-page: #0F172A;
  --bg-surface: #1E293B;
  --bg-elevated: #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --color-primary: #3B82F6;
  --color-primary-light: #1E3A5F;
}
```

---

## 10. Implementation Notes

### Tech Stack Recommendations
- **CSS Framework:** Tailwind CSS with custom config
- **Component Library:** Radix UI primitives for accessibility
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts), JetBrains Mono

### File Structure
```
src/
├── styles/
│   ├── tokens.css          # CSS variables
│   ├── reset.css           # Normalize
│   └── globals.css         # Base styles
├── components/
│   ├── ui/                 # Base components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── ...
│   └── layout/             # Layout components
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── Footer.jsx
└── lib/
    └── cn.js               # Class name utility
```

### Design Tokens Package
Consider extracting tokens to a shared package:
```json
{
  "name": "@ai-professor/design-tokens",
  "exports": {
    "./colors": "./colors.json",
    "./typography": "./typography.json",
    "./spacing": "./spacing.json"
  }
}
```

---

*Design System v1.0 - AI Professor Platform*
*Last updated: March 2024*
