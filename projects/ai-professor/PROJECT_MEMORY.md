# Pulse + AI Professor - Project Memory

> **Purpose:** Single source of truth for the entire project. Read this first every session.

---

## 📋 Project Overview

**What:** AI-powered learning platform combining real-time AI news with expert-led courses

**Mission:** "Stay current. Get smarter." - Real-time AI news aggregation meets AI-powered learning

**Live Site:** https://ai-professor-red.vercel.app

**GitHub:** https://github.com/ashdevs999-pixel/ai-professor

**Owner:** Bryan Benjamin Leong

**Status:** Production, seed stage

---

## 🏗️ Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Authentication | NextAuth.js |
| AI | OpenAI API |
| Deployment | Vercel (Hobby plan) |
| CI/CD | GitHub Actions |

### Key Files
| File | Purpose |
|------|---------|
| `/lib/supabase.ts` | Database client + db helper object |
| `/lib/auth.ts` | Auth utilities, error handlers |
| `/lib/openai.ts` | OpenAI client |
| `/app/guides/[id]/GuideContent.tsx` | All 24 quick guides (5000+ lines) |
| `/app/api/` | All API routes |
| `/middleware.ts` | CORS middleware |
| `/next.config.js` | Next.js config + security headers |
| `/.github/workflows/` | CI/CD pipelines |

### Database Tables
| Table | Purpose | RLS Status |
|-------|---------|------------|
| users | User accounts | ✅ Protected |
| profiles | User profiles | ✅ Protected |
| courses | Course content | ✅ Protected |
| lessons | Lesson content | ✅ Protected |
| enrollments | User enrollments | ✅ Protected |
| progress | Learning progress | ✅ Protected |
| subscriptions | Payment data | ✅ Protected |
| news_items | Scraped news | ✅ Protected |
| news_sources | RSS feeds | ✅ Protected |
| news_audio | TTS audio | ✅ Protected |
| ratings | Course ratings | ✅ Protected |
| ai_content_cache | AI cache | ✅ Protected |
| weekly_research | Research content | ✅ Protected |
| news_scrape_errors | Error logs | ✅ Protected |

---

## 📊 Content Inventory

### Quick Guides (24 Total - FREE)
**Location:** `/app/guides/[id]/GuideContent.tsx`

| Category | Guides |
|----------|--------|
| Getting Started | OpenClaw, Website, BotFather |
| AI Tools | ChatGPT, Claude, Gemini, Grok, Kimi, Perplexity |
| Development Setup | VS Code, Cursor, Windsurf, GitHub, Copilot |
| AI Engineering | RAG, CrewAI, Voice AI, Image Gen, Fine-Tuning |
| Productivity | Excel/Sheets, Email, Meetings, No-Code Apps |
| Development | Vibe Coding |

**Quality Status (as of 2026-03-29):**
- ✅ **Tier 1 (Comprehensive):** OpenClaw, ChatGPT, Voice AI, RAG, CrewAI, BotFather, Vibe Coding, Claude
- ⚠️ **Tier 2 (Need Expansion):** VS Code (rewritten), Gemini, Grok, Kimi, Perplexity, Image Gen, others

### Paid Courses (5 Total)
| Course | Duration | Status |
|--------|----------|--------|
| Introduction to Machine Learning | 8 weeks | Live |
| Deep Learning | 10 weeks | Live |
| Natural Language Processing | 8 weeks | Live |
| Vibe Coding Masterclass | 4 weeks | Live |
| AI Engineer Bootcamp | 12 weeks | Live |

**Note:** Course content is stored in Supabase database, not in repository.

### News Sources (19 Total)
| Type | Sources |
|------|---------|
| **AI News (11)** | OpenAI Blog, Anthropic, Google DeepMind, Google AI, Meta AI, Microsoft AI, TechCrunch AI, VentureBeat AI, Nature AI, MIT Tech Review AI, Hacker News, Reddit r/MachineLearning, AI News |
| **Breaking Tech (8)** | TechCrunch, The Verge, Ars Technica, Wired, Engadget, MIT Tech Review, Bloomberg Tech, BBC Tech |

---

## 🤖 Agents & Skills

### Specialized Agent Team
| Agent | Label | When to Use |
|-------|-------|-------------|
| Frontend Dev | `frontend-dev-ui` | React, Next.js, Tailwind, UI components |
| Backend Dev | `backend-api-dev` | Node.js APIs, Supabase, auth |
| Content Writer | `content-writer-courses` | Course lessons, projects, assessments |
| Security Guard | `security-audit-guard` | OWASP, auth security, vulnerability audits |
| Stripe Specialist | `stripe-payments-integration` | Stripe Checkout, webhooks, subscriptions |
| QA Tester | `qa-tester-debugger` | Testing, bug reproduction, edge cases |
| Technical Content Creator | `content-creator` | Guide writing, course content |

### Skills to Use
| Skill | When to Use |
|-------|-------------|
| `opencode` | AI-assisted coding tasks (use `opencode run "prompt"`) |
| `github` | GitHub operations via `gh` CLI |
| `clawhub` | Install/manage agent skills |

---

## 📐 SOPs (Standard Operating Procedures)

### Code Quality Rules
1. **Never commit without testing** - Run `npm run build` first
2. **Never bypass TypeScript errors** - Fix them or document why
3. **Always add tests for new features** - E2E tests required
4. **Always update this file** when making architectural changes
5. **Use `write` instead of `edit`** for file updates (avoids matching failures)

### Deployment Process
1. Make code changes
2. Run `npm run build` locally
3. Fix any errors
4. `git add . && git commit -m "message"`
5. `git push ai-professor master`
6. `vercel --prod --yes`
7. Verify deployment at https://ai-professor-red.vercel.app

### Security Checklist
- [ ] Never commit `.env.local` or secrets
- [ ] All API routes must use `requireAuth()` or be public by design
- [ ] All database tables must have RLS policies
- [ ] CORS must only allow approved domains
- [ ] CSP headers must be restrictive
- [ ] CRON_SECRET must be set for cron jobs

### Content Creation Process
1. **Quick Guides:** Edit `/app/guides/[id]/GuideContent.tsx`
   - Follow 5-lesson structure
   - Include troubleshooting section (10+ errors)
   - Add prerequisites checklist
   - Add time estimates
   - Add practical exercises

2. **Paid Courses:** Update database via Supabase
   - Use content generation scripts in `/scripts/`
   - Run `npx ts-node scripts/generate-course-lessons.ts`

### Agent Spawning Rules
- **Always inform Bryan** when spawning agents
- Use specialized agents for specific tasks
- Use `opencode` skill for coding tasks
- Set appropriate timeout (600s for complex tasks)

---

## 🔧 Known Issues & Solutions

### Issue 1: TypeScript Errors (329 total)
**Status:** Known, tracked
**Root Cause:** Codebase was never properly typed
**Workaround:** `ignoreBuildErrors: true` in next.config.js
**Long-term Fix:** Incrementally fix type errors, tracked in STABILITY_PLAN.md
**Monitoring:** E2E tests catch runtime bugs

### Issue 2: Vercel Cron Limitations
**Status:** Resolved
**Problem:** Vercel Hobby only allows daily crons
**Solution:** GitHub Actions runs hourly (`/.github/workflows/cron.yml`)
**Required Secret:** `CRON_SECRET` in GitHub

### Issue 3: In-Memory Rate Limiting
**Status:** Known limitation
**Problem:** Doesn't work in serverless (resets per request)
**Recommendation:** Use Upstash Redis
**Priority:** Low (not critical)

### Issue 4: Guides Hardcoded
**Status:** Known
**Problem:** Guides in TSX file, not database
**Impact:** Code changes required for content updates
**Priority:** Medium (future improvement)

---

## 💰 Revenue Model

### Pricing Tiers
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | News, Breaking News, 24 Quick Guides |
| Pro | $29/mo | All courses, certificates, priority support |
| Enterprise | Custom | Team licenses, custom courses, SSO |

### Payment Processing
- **Provider:** Stripe (not yet implemented)
- **Webhook:** `/api/webhooks/stripe` (placeholder)
- **Implementation Status:** Pending

### Future Revenue Streams
1. Course subscriptions
2. Enterprise licenses
3. Certification fees
4. Corporate training
5. API access (for news data)

---

## 🎯 Quality Standards

### For Quick Guides (Idiot-Proof Test)
> "Would a complete beginner with zero technical knowledge successfully complete this guide without asking for help?"

If NO → Rewrite until YES

**Required Components:**
- [ ] Prerequisites checklist
- [ ] Step-by-step instructions
- [ ] Screenshot descriptions
- [ ] 10+ troubleshooting errors
- [ ] Practical exercises
- [ ] Time estimates
- [ ] "What you'll learn" section

### For Paid Courses (University Test)
> "Would completing this course qualify someone for an entry-level job?"

If NO → Expand content until YES

**Required Components:**
- [ ] Pre-assessment quiz
- [ ] Week-by-week objectives
- [ ] Hands-on projects
- [ ] Code examples
- [ ] Assessments + rubrics
- [ ] Certificate criteria

---

## ⚠️ Outstanding Tasks

### Critical (Do Immediately)
- [ ] **OpenAI API Key Rotation** - Delete old key, create new, update Vercel env vars
- [ ] **Add GitHub Secrets** - `CRON_SECRET`, `SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

### High Priority (This Week)
- [ ] **Telegram Bot Setup** - Create bot via @BotFather, get chat ID
- [ ] **Expand Gemini, Grok, Kimi guides** - Currently too brief
- [ ] **Add practical exercises** to AI tools guides

### Medium Priority (This Month)
- [ ] **Fix TypeScript errors** - Reduce from 329 to 0
- [ ] **Implement Stripe** - Complete webhook, subscription flow
- [ ] **Move guides to database** - Enable CMS-style editing

### Low Priority (Backlog)
- [ ] **Add Upstash Redis** for rate limiting
- [ ] **Add video content** to courses
- [ ] **Mobile app** (PWA or native)

---

## 📚 Key Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-03-28 | Use ashdevs999-pixel GitHub account | Bryan's preference |
| 2026-03-28 | Keep `ignoreBuildErrors: true` | 329 TS errors, E2E tests catch bugs |
| 2026-03-28 | Hourly news via GitHub Actions | Vercel Hobby plan limitation |
| 2026-03-29 | Use `write` instead of `edit` | Avoids text matching failures |
| 2026-03-29 | Spawn agents with notification | Keep Bryan informed |
| 2026-03-29 | **NO SHORTCUTS** | Leads to more work later |
| 2026-03-29 | Protect paid content | Revenue leak - must fix |
| 2026-03-29 | Update memory continuously | Don't forget context |

---

## 🚨 Critical Issues (2026-03-29)

### Issue: Paid Content Not Protected
**Severity:** 🔴 CRITICAL - Revenue Leak
**Status:** Fix in progress

**Problem:**
- Lesson pages accessible without enrollment check
- Anyone can view paid course content
- "Enroll Now" button does nothing
- No Stripe integration

**Impact:**
- Zero revenue from courses
- Users have no incentive to pay

**Required Fix:**
- Add enrollment check to lesson pages
- Show paywall for non-enrolled users
- Implement Stripe payments
- Admin bypass for bryanbleong@gmail.com

### Issue: TypeScript Errors Hiding Bugs
**Severity:** 🟠 HIGH
**Status:** Partially fixed (329 → 286)

**Problem:**
- `ignoreBuildErrors: true` hides type errors
- Undefined variables crash pages at runtime
- Examples: `avgRating`, `ratingCount` on course pages

**Pattern:**
1. TypeScript errors hidden
2. Code deploys
3. User hits page → crash
4. Fix individually
5. Repeat

**Required Fix:**
- Fix all 286 remaining TS errors
- Remove `ignoreBuildErrors: true`
- Never re-enable it

### Issue: No Admin Dashboard
**Severity:** 🟡 MEDIUM
**Status:** Being created

**Problem:**
- No `/admin` page exists
- Can't manage users/content visually
- Only API routes available

---

## ⚠️ Patterns to Avoid

### Pattern: Shortcut → More Work Later
**Examples:**
1. Ignored TS errors → Course page crash
2. Didn't add enrollment check → Revenue leak
3. Didn't create admin UI → Can't manage site

**Rule:** If there's a problem, FIX IT PERMANENTLY. No workarounds.

### Pattern: Forgetting Context
**Problem:** Starting each session without knowing what happened before

**Solution:**
- Update PROJECT_MEMORY.md after every significant discussion
- Read it at start of every session
- Prompt Bryan when deviating from documented parameters

---

## 🔗 Quick Links

### Dashboards
- **Vercel:** https://vercel.com/dashboard → ai-professor
- **Supabase:** https://supabase.com/dashboard
- **GitHub:** https://github.com/ashdevs999-pixel/ai-professor
- **OpenAI:** https://platform.openai.com/api-keys
- **Admin Login:** https://ai-professor-red.vercel.app/auth/signin

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
OPENAI_API_KEY
CRON_SECRET
TELEGRAM_BOT_TOKEN ✅
TELEGRAM_CHAT_ID ✅
```

### Important Files
- **Project Memory:** `PROJECT_MEMORY.md` (this file)
- **Auth & Security:** `AUTH_SECURITY.md` ⭐
- **Stability Plan:** `STABILITY_PLAN.md`
- **Security Guide:** `SECURITY_SETUP.md`
- **Telegram Setup:** `TELEGRAM_ALERTS.md`

---

## 📞 Communication Preferences

**Bryan's Preferences:**
- Timezone: Singapore (SGT, UTC+8)
- Availability: Anytime, any day
- Communication: Casual, direct
- Ask before: Code changes, deletions, implementations
- Notification required: Agent spawning
- **CRITICAL:** Prompt when deviating from documented parameters
- **CRITICAL:** No shortcuts - fix problems permanently

---

## 🎓 Lessons Learned

1. **Never ignore TypeScript errors** - They hide real bugs
2. **Always test locally before deploying** - Prevents broken deploys
3. **Document everything** - Future sessions have no memory
4. **Use specialized agents** - Better results than general-purpose
5. **E2E tests > TypeScript checks** - Catch real runtime bugs
6. **Write > Edit** - `write` tool avoids matching failures
7. **Security first** - RLS, CORS, CSP must be configured
8. **Content quality = conversion** - Free guides sell paid courses

---

**Last Updated:** 2026-03-29
**Next Review:** Every session (read this first)
