# MEMORY.md - Long-Term Memory

Curated memories, decisions, and context worth keeping across sessions.

---

## Bryan

- Timezone: Singapore (SGT, UTC+8)
- Availability: Anytime, no restrictions
- Communication: casual, direct, proactive suggestions OK
- **Critical rule:** ASK before any code changes, deletions, or implementations
- **Agent spawning:** Auto-spawn when needed, BUT always inform Bryan (notification required)
- Projects exist but are off-limits unless explicitly mentioned
- **Availability:** Anytime, any day — no restrictions

## Bryan's Startups

### Origin Labs
- **What:** AI infrastructure company — "the layer between AI models and real-world workflows"
- **Products:**
  - Crosspath — Enterprise AI workflow engine (B2B)
  - Mimphes — Multi-LLM creative workflow platform (B2C)
- **Mission:** "Infrastructure between human & AI"
- **Stage:** Seed stage, raising $500K-$1M
- **Branding:**
  - **Logo (FINAL - LOCKED March 13, 2026):** Wordmark only, no icon
    - "Origin" in turquoise (#40E0D0), weight 700, x=50
    - "Labs" in black (#000000), weight 800, x=175
    - Tagline "Human . AI" centered below, gray (#64748B)
    - viewBox: 360x90
    - File: `projects/origin-labs-pitch-redesign/origin-labs-logo-locked.svg`
  - Color palette: Turquoise #40E0D0 + black #000000, white background
  - Tagline: "Human . AI"
  - Files: `projects/origin-labs-pitch-redesign/`

### CareHive
- **What:** Caregiver platform
- **Status:** Co-founded by Bryan (details TBD)

### Sahakom (Keat Farm Partner Platform)
- **What:** Direct farmer-to-consumer marketplace in Cambodia
- **Mission:** Connect farmers directly to buyers, skip middlemen
- **Founder:** Paul (Keat family) — business/land owners, ministry leaders, powerful networks in Cambodia agriculture
- **Kingdom objective:** Support local farmers (including pastors) so ministry is business-funded
- **Coverage:** Pig farmers first, buyer/supplier ecosystem (feed, fertilizers, waste management)
- **Locality:** Test in Kg Chennang, then roll out to other provinces
- **Ownership:** Keat owns/operates; BridgeLife retains rights to modify for other regions
- **Funding:** Not needed — Keat is asset-rich
- **Revenue model:** 15% transaction fee
- **Risks:** Political (middlemen backlash — mitigated by state-level connections), quality control (peer review + audit team), tech savvy (farmers can handle simple systems)
- **Tech stack:** React, Supabase, Cloudflare
- **Status:** Live, in development
- **URL:** https://sahakom.app

## STAR Behavior Rules

- **Remember everything:** Commit to memory all requests, instructions, and things Bryan tells me — update MEMORY.md accordingly
- **Proactive skillset expansion:** When Bryan asks for something new, automatically add it to skillset in MEMORY.md
- **Agent spawning:** Auto-spawn when needed, always inform Bryan (notification required)
- **Code changes:** Always ASK first
- **Coding tasks:** Always use opencode agent (auto-spawn when Bryan says "code", "build", "implement")
- **Chat history:** Can search for conversation context when needed ( but summaries ( not just summaries (avoid summaries unless explicitly asked)
- **Skill expansion:** When Bryan asks for something new → Do it → Add to skillset automatically (no permission needed)
- **File edits:** Use `write` instead of `edit` for file updates (avoids "text not found" matching failures)
- **Proactive reminders:** Remind Bryan of outstanding issues, pending tasks, and incomplete items when conversation resumes or periodically (every 2 hours via heartbeat)
- **Reminder system:** Tracked in `memory/reminders-state.json`, simple reminders with "details" option for full context

- Business + general discussions in this hub
- Engineering (code, architecture, bugs, deployments) = separate channel, set up when needed
- No @mentions needed — just the two of us

---

## STAR Capabilities

**1. Fintech & Fundraising:**
- Research: funding sources, grants, investors, programs, market data
- Build tools: financial models, pitch deck data, cap tables, revenue calculators
- Analyze: competitor funding, term sheets, market landscapes
- Prep: investor materials, applications, due diligence docs
- Automate: runway tracking, burn rate, KPIs, fundraising pipeline
- Develop: fintech apps, payment integrations, dashboards

**2. Security & Technical Audits:**
- Website security audits (infrastructure + code)
- Code review (client-side JavaScript, React apps, architecture patterns)
- Security headers analysis (CSP, HSTS, X-Frame-Options, etc.)
- Vulnerability assessment (XSS, clickjacking, information disclosure)
- Technology stack fingerprinting
- Create fix guides with step-by-step instructions
- SSL/TLS configuration review
- Database security review (Supabase, RLS policies)
- API security assessment

**3. Design & Branding:**
- Logo design (SVG, multiple iterations, gradient/solid colors)
- Pitch deck redesign (HTML/CSS slide decks with animations)
- Color palette selection (gradient, solid, futuristic, professional)
- Typography recommendations
- Brand guidelines documentation
- Visual identity systems
- Tagline/positioning development

**4. Web Research & Analysis:**
- Fetch and analyze websites (content, structure, technologies)
- Competitive analysis
- Market research
- Technology stack identification

**5. Technical Writing:**
- Security reports (executive summaries + technical details)
- Fix guides (step-by-step implementation)
- Brand guidelines
- Documentation

**6. Development (with permission):**
- Frontend development (React, HTML/CSS, JavaScript)
- SVG creation and manipulation
- Static site generation
- API integration

**Specialized Agents Available (can spawn on demand):**
- Security scanning agents
- Design specialists
- Code review agents
- Research agents

---

## 📋 Documentation Files

**Master Configuration:**
- `SKILLS-AND-CONFIG.md` — Complete configuration, skills, agents, boundaries ⭐
- `QUICK-REFERENCE.md` — One-page quick reference card
- `MEMORY.md` — Long-term curated memory (this file)

**Daily Logs:**
- `memory/YYYY-MM-DD.md` — Daily session logs

**Project Files:**
- `projects/[project-name]/` — Project-specific folders
- Various report files (security, branding, etc.)

---

_Last updated: 2026-03-12_
