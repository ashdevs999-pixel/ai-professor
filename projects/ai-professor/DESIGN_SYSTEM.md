# Pulse + AI Professor - Design System v2.0

> Premium, modern design inspired by Linear, Notion, and Stripe

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-50: #f0fdfa    /* Lightest */
--primary-100: #ccfbf1
--primary-200: #99f6e4
--primary-300: #5eead4
--primary-400: #2dd4bf
--primary-500: #14b8a6   /* Base */
--primary-600: #0d9488   /* Default */
--primary-700: #0f766e   /* Dark */
--primary-800: #115e59
--primary-900: #134e4a   /* Darkest */
```

### Neutral Colors
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
--gray-950: #030712
```

### Accent Colors
```css
--orange-500: #f97316    /* Breaking news */
--purple-500: #a855f7    /* AI Tools */
--green-500: #22c55e     /* Free/Sucess */
--red-500: #ef4444       /* Error */
--yellow-500: #eab308    /* Warning */
--blue-500: #3b82f6      /* Links */
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height | Tailwind |
|---------|------|--------|-------------|----------|
| **H1** | 48px / 3rem | 800 | 1.1 | `text-5xl font-extrabold` |
| **H2** | 36px / 2.25rem | 700 | 1.2 | `text-4xl font-bold` |
| **H3** | 24px / 1.5rem | 700 | 1.3 | `text-2xl font-bold` |
| **H4** | 20px / 1.25rem | 600 | 1.4 | `text-xl font-semibold` |
| **Body** | 16px / 1rem | 400 | 1.6 | `text-base` |
| **Small** | 14px / 0.875rem | 400 | 1.5 | `text-sm` |
| **Tiny** | 12px / 0.75rem | 500 | 1.4 | `text-xs font-medium` |

---

## 📐 Spacing System

### Base Unit: 4px
```css
--space-1: 4px    /* 0.25rem */
--space-2: 8px    /* 0.5rem */
--space-3: 12px   /* 0.75rem */
--space-4: 16px   /* 1rem */
--space-5: 20px   /* 1.25rem */
--space-6: 24px   /* 1.5rem */
--space-8: 32px   /* 2rem */
--space-10: 40px  /* 2.5rem */
--space-12: 48px  /* 3rem */
--space-16: 64px  /* 4rem */
--space-20: 80px  /* 5rem */
```

---

## 🧩 Components

### Cards
```tsx
// Base Card
<div className="bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-800 
                rounded-2xl p-6 
                shadow-sm hover:shadow-lg 
                transition-all duration-300">

// Featured Card (gradient header)
<div className="bg-gradient-to-r from-primary-600 to-primary-700 
                rounded-t-2xl p-6 text-white">

// Pricing Card (highlighted)
<div className="border-2 border-primary-500 
                rounded-2xl overflow-hidden 
                shadow-xl">
```

### Buttons
```tsx
// Primary
<button className="bg-primary-600 hover:bg-primary-700 
                   text-white px-6 py-3 
                   rounded-lg font-semibold 
                   transition-colors duration-200">

// Secondary
<button className="bg-gray-100 dark:bg-gray-800 
                   hover:bg-gray-200 dark:hover:bg-gray-700
                   text-gray-900 dark:text-white 
                   px-6 py-3 rounded-lg font-semibold">

// Outline
<button className="border-2 border-gray-300 dark:border-gray-700
                   hover:border-primary-500 dark:hover:border-primary-500
                   text-gray-700 dark:text-gray-300
                   px-6 py-3 rounded-lg font-semibold">

// Ghost
<button className="text-gray-600 dark:text-gray-400
                   hover:text-gray-900 dark:hover:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   px-4 py-2 rounded-lg">
```

### Badges
```tsx
// Default
<span className="px-3 py-1 rounded-full text-xs font-medium 
                 bg-gray-100 dark:bg-gray-800 
                 text-gray-700 dark:text-gray-300">

// Success/Free
<span className="px-3 py-1 rounded-full text-xs font-medium 
                 bg-green-100 dark:bg-green-900/30 
                 text-green-700 dark:text-green-400">

// Warning/Paid
<span className="px-3 py-1 rounded-full text-xs font-medium 
                 bg-yellow-100 dark:bg-yellow-900/30 
                 text-yellow-700 dark:text-yellow-400">

// Primary
<span className="px-3 py-1 rounded-full text-xs font-medium 
                 bg-primary-100 dark:bg-primary-900/30 
                 text-primary-700 dark:text-primary-400">
```

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Container Widths
```tsx
// Content container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Narrow container (text)
<div className="max-w-3xl mx-auto px-4">

// Wide container
<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
```

---

## 🎭 Page Layouts

### Homepage
```
┌─────────────────────────────────────────┐
│  HEADER (sticky, blur backdrop)         │
├─────────────────────────────────────────┤
│  HERO                                    │
│  - Bold headline (5xl-8xl)              │
│  - Subheadline (xl)                     │
│  - 2 CTAs (primary + outline)           │
│  - Stats grid (4 cols)                  │
├─────────────────────────────────────────┤
│  FEATURES (3 cols)                      │
│  - Icon + title + description           │
│  - Hover: card lift                     │
├─────────────────────────────────────────┤
│  QUICK GUIDES HIGHLIGHT                 │
│  - 2 cols: text + preview cards        │
├─────────────────────────────────────────┤
│  CTA SECTION                            │
│  - Dark background                      │
│  - Strong headline                      │
│  - 2 CTAs                               │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### News Page
```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  - Title + description                  │
│  - Category filters (pills)             │
├─────────────────────────────────────────┤
│  ARTICLE GRID                           │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ Card │ │ Card │ │ Card │            │
│  │      │ │      │ │      │            │
│  └──────┘ └──────┘ └──────┘            │
│  - Title (2 lines max)                  │
│  - Preview (3 lines)                    │
│  - Source badge + time                  │
├─────────────────────────────────────────┤
│  PAGINATION / LOAD MORE                 │
└─────────────────────────────────────────┘
```

### Course Page
```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│  COURSE HEADER                          │
│  - Thumbnail (16:9)                     │
│  - Title (4xl)                          │
│  - Meta: duration, lessons, rating     │
│  - Instructor                           │
│  - Enroll CTA                           │
├─────────────────────────────────────────┤
│  CURRICULUM                             │
│  Week 1: Introduction                   │
│    └─ Lesson 1.1: What is ML?           │
│    └─ Lesson 1.2: History               │
│  Week 2: Supervised Learning            │
│    └─ Lesson 2.1: Classification        │
│    └─ Lesson 2.2: Regression            │
├─────────────────────────────────────────┤
│  INSTRUCTOR CARD                        │
│  - Avatar                               │
│  - Bio                                  │
└─────────────────────────────────────────┘
```

### Lesson Page
```
┌─────────────────────────────────────────┐
│  HEADER (progress bar)                  │
├─────────────────────────────────────────┤
│  LESSON CONTENT                         │
│  - Breadcrumb nav                       │
│  - Title (3xl)                          │
│  - Content (prose, max-w-3xl)           │
│  - Code blocks (syntax highlighted)     │
│  - Images (rounded, shadow)             │
├─────────────────────────────────────────┤
│  NAVIGATION                             │
│  - Prev lesson | Next lesson            │
│  - Mark complete button                 │
├─────────────────────────────────────────┤
│  SIDEBAR (sticky on desktop)            │
│  - Lesson list                          │
│  - Progress indicator                   │
└─────────────────────────────────────────┘
```

---

## ✨ Animations

### Hover Effects
```tsx
// Card lift
className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// Button press
className="active:scale-95 transition-transform"

// Link underline
className="hover:underline underline-offset-4"
```

### Page Transitions
```tsx
// Fade in on load
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
```

---

## 🌙 Dark Mode

### Toggle Implementation
```tsx
// Use system preference
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

// Toggle class
document.documentElement.classList.toggle('dark')
```

### Dark Mode Classes
```tsx
// Background
bg-white dark:bg-gray-900

// Text
text-gray-900 dark:text-white

// Border
border-gray-200 dark:border-gray-800

// Card
bg-gray-50 dark:bg-gray-800
```

---

## 📐 Grid System

### 3-Column Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### 4-Column Grid
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

### 2-Column Layout
```tsx
<div className="grid lg:grid-cols-2 gap-12">
```

---

## 🔤 Prose (Content)

```tsx
// Article content
<div className="prose prose-lg dark:prose-invert max-w-none
               prose-headings:font-bold
               prose-a:text-primary-600 dark:prose-a:text-primary-400
               prose-code:bg-gray-100 dark:prose-code:bg-gray-800
               prose-code:px-2 prose-code:py-1 prose-code:rounded">
```

---

## 📋 Component Checklist

- [ ] Header (sticky, blur, dark mode)
- [ ] Footer (minimal, links)
- [ ] Hero Section (animated stats)
- [ ] Feature Cards (hover effects)
- [ ] Course Cards (gradient headers)
- [ ] News Cards (source badges, previews)
- [ ] Lesson Cards (progress indicators)
- [ ] Pricing Cards (highlighted)
- [ ] Badges (categories, status)
- [ ] Buttons (3 variants)
- [ ] Input Fields (with icons)
- [ ] Progress Bars
- [ ] Pagination
- [ ] Loading Spinners
- [ ] Empty States

---

**Design System v2.0** - Ready to implement
