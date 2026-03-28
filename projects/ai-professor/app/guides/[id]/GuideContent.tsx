'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ChevronRight, Zap } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import ReactMarkdown from 'react-markdown'

// Real guide content from content/guides/*.json
const GUIDES_DATA: Record<string, {
  title: string
  description: string
  topic: string
  lessons: { title: string; content: string }[]
}> = {
  'guide-openclaw': {
    title: 'Installing OpenClaw',
    description: 'Set up your own AI assistant. Step-by-step for beginners.',
    topic: 'Getting Started',
    lessons: [
      { 
        title: 'What is OpenClaw?', 
        content: `**OpenClaw** is your personal AI assistant that runs on your own computer. Think of it like having ChatGPT, but private, customizable, and connected to your own tools.

## 🎯 What You'll Learn

By the end of this guide, you will:

- ✅ Understand what OpenClaw can do for you
- ✅ Know if your computer is ready
- ✅ Have OpenClaw installed and running
- ✅ Be chatting with your first AI assistant

**Time to complete:** ~30 minutes

## 🤔 Why Use OpenClaw?

### Privacy
Your conversations stay on your computer. No data sent to third parties unless you choose to connect services.

### Customizable
Add skills and tools for YOUR specific needs:
- Connect to your calendar
- Read your files
- Search the web
- Control smart home devices

### Multiple AI Models
Not locked into one AI provider:
- **OpenAI GPT-4** - Most capable
- **Anthropic Claude** - Great for writing
- **Local models** - Run offline, completely private

### Cost-Effective
- Use your existing API keys
- Pay only for what you use
- No monthly subscription required

## 💡 Real-World Use Cases

### For Developers
- "Review my pull request and suggest improvements"
- "Generate unit tests for this function"
- "Explain this error message and how to fix it"

### For Writers
- "Help me outline this article"
- "Rewrite this paragraph to be more engaging"
- "Check this for grammar and clarity"

### For Business
- "Summarize this meeting transcript"
- "Draft a response to this email"
- "Create a project timeline based on these requirements"

**→ Proceed to Lesson 2: System Requirements**`
      },
      { 
        title: 'System Requirements', 
        content: `## 📋 Minimum Requirements

| Requirement | Minimum | Recommended | Why It Matters |
|-------------|---------|-------------|----------------|
| **RAM** | 4 GB | 8 GB+ | AI models need memory |
| **Storage** | 2 GB free | 5 GB+ free | OpenClaw + cache |
| **OS** | Windows 10, macOS 10.15, Ubuntu 20.04 | Latest versions | Compatibility |
| **Internet** | Required for setup | Broadband | Download + API calls |

## 🔍 Step 1: Check Your Computer

### Windows
1. Press \`Windows Key + R\`
2. Type \`dxdiag\` and press Enter
3. Look at Memory (4GB+) and OS (Windows 10+)

### macOS
1. Click  Apple Menu → About This Mac
2. Check Memory (4GB+) and macOS Version (10.15+)

### Linux (Ubuntu)
\`\`\`bash
free -h        # Check RAM
lsb_release -a # Check Ubuntu version
\`\`\`

## 🔑 Step 2: Get Your API Key

### Option A: OpenAI (GPT-4, GPT-3.5) - Recommended

1. Go to **[platform.openai.com](https://platform.openai.com)**
2. Click **Sign Up**
3. Go to **API Keys** → **Create new secret key**
4. **Copy and save it securely** (you won't see it again!)
5. Add a payment method (minimum $5)

**Cost estimate:** GPT-4 ~$0.03/conversation, GPT-3.5 ~$0.002/conversation

## 🛠️ Step 3: Install Node.js

Check if installed:
\`\`\`bash
node --version
\`\`\`

If not, download from **[nodejs.org](https://nodejs.org)** (LTS version).

**→ Proceed to Lesson 3: Installation Step-by-Step**`
      },
      { 
        title: 'Installation Step-by-Step', 
        content: `## 🖥️ Install OpenClaw

### macOS / Linux
\`\`\`bash
npm install -g openclaw
\`\`\`

### Windows (Run as Administrator)
\`\`\`cmd
npm install -g openclaw
\`\`\`

### Verify Installation
\`\`\`bash
openclaw --version
\`\`\`

## 📁 Create Your Workspace

\`\`\`bash
# Create a folder for your AI assistant
mkdir ~/my-ai-assistant
cd ~/my-ai-assistant

# Initialize OpenClaw
openclaw init
\`\`\`

This creates:
\`\`\`
my-ai-assistant/
├── .env              # Your API keys (keep secret!)
├── config.yaml        # OpenClaw settings
├── conversations/     # Your chat history
└── skills/            # Custom skills you add
\`\`\`

## 🔐 Add Your API Key

Create a \`.env\` file:
\`\`\`bash
nano .env
\`\`\`

Add your key:
\`\`\`
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
\`\`\`

Save and exit (Ctrl+X, then Y, then Enter).

> ⚠️ **IMPORTANT:** Never share your \`.env\` file!

**→ Proceed to Lesson 4: Your First AI Assistant**`
      },
      { 
        title: 'Your First AI Assistant', 
        content: `## 🚀 Start OpenClaw

\`\`\`bash
cd ~/my-ai-assistant
openclaw start
\`\`\`

You'll see:
\`\`\`
🤖 OpenClaw is ready!
Model: gpt-4

You: _
\`\`\`

**Congratulations!** 🎉 Your AI assistant is running!

## 💬 Your First Conversation

\`\`\`
You: Hello! Can you help me write a professional email?
\`\`\`

The AI will respond and help you!

## 🎯 Try These Example Prompts

### For Writing
- "Write a LinkedIn post about AI trends in 2024"
- "Help me rewrite this paragraph to be more professional"

### For Learning
- "Explain machine learning like I'm 12 years old"
- "What's the difference between SQL and NoSQL databases?"

### For Coding
- "Write a Python function to sort a list of numbers"
- "Debug this code: [paste your code]"

## 🛠️ Add Skills

\`\`\`bash
openclaw skill add web-search
openclaw skill add weather
\`\`\`

Now you can ask: "What's the weather in Singapore?" or "Search for the latest AI news"

## ⌨️ Useful Commands

| Command | What It Does |
|---------|-------------|
| \`clear\` | Clear the screen |
| \`exit\` | Quit OpenClaw |
| \`help\` | Show all commands |

## 🎉 Congratulations!

You now have your own personal AI assistant running locally on your computer!

**Next Steps:**
- Explore more skills at **[clawhub.com](https://clawhub.com)**
- Read docs at **[docs.openclaw.ai](https://docs.openclaw.ai)**
- Join the community at **[discord.gg/clawd](https://discord.gg/clawd)**`
      },
    ]
  },
  'guide-chatgpt': {
    title: 'Using ChatGPT Effectively',
    description: 'Master ChatGPT prompts and get better results.',
    topic: 'AI Tools',
    lessons: [
      { 
        title: 'Introduction to ChatGPT', 
        content: `**ChatGPT** is an AI assistant created by OpenAI that can understand and generate human-like text. It's like having a knowledgeable assistant available 24/7.

## 🎯 What You'll Learn

- ✅ Understand what ChatGPT can and cannot do
- ✅ Know which version to use (Free vs Plus)
- ✅ Be ready to write effective prompts
- ✅ Avoid common mistakes

## 🤔 What is ChatGPT?

ChatGPT is a **large language model** trained on billions of words. It can:

- ✅ Answer questions
- ✅ Write and edit text
- ✅ Explain complex topics
- ✅ Help with coding
- ✅ Brainstorm ideas
- ✅ Translate languages
- ✅ Summarize content

## 🆓 Free vs Plus: Which Should You Use?

| Feature | Free (GPT-3.5) | Plus ($20/mo) |
|---------|---------------|---------------|
| **Model** | GPT-3.5 | GPT-4 + GPT-3.5 |
| **Speed** | Fast | GPT-4 slower |
| **Accuracy** | Good | Excellent |
| **File Upload** | ❌ No | ✅ Yes |
| **Web Browsing** | ❌ No | ✅ Yes |
| **Image Input** | ❌ No | ✅ Yes |

**Recommendation:** Start with Free. Upgrade to Plus if you need more accuracy or file analysis.

## ⚠️ What ChatGPT Cannot Do

- ❌ Access real-time information (Free version)
- ❌ Browse the internet (Free version)
- ❌ Remember previous conversations (starts fresh each chat)
- ⚠️ Be 100% accurate - always verify important facts

## 🚀 Getting Started

1. Go to **[chat.openai.com](https://chat.openai.com)**
2. Click **Sign Up**
3. Use Google, Microsoft, or email
4. Verify your email

**→ Proceed to Lesson 2: Writing Great Prompts**`
      },
      { 
        title: 'Writing Great Prompts', 
        content: `The quality of ChatGPT's responses depends on the quality of your prompts.

## 🎯 The CTF Framework

Every great prompt has three parts:

- **C**ontext - Background information
- **T**ask - What you want done
- **F**ormat - How you want it delivered

## 📝 Before & After Examples

### ❌ Bad: "Write an email"
### ✅ Good:
\`\`\`
[Context] I'm a software developer who needs to request time off
[Task] Write a professional email to my manager asking for 3 days off
[Format] Keep it under 150 words, include dates (March 15-17)
\`\`\`

## 🎨 Prompt Templates

### For Writing
\`\`\`
Write a [type of content] about [topic] for [audience].
The tone should be [formal/casual/professional].
Length: [word count]
Key points to include: [list]
\`\`\`

### For Learning
\`\`\`
Explain [topic] like I'm [age/level].
Use analogies related to [field I know].
Give me 3 practice questions to test my understanding.
\`\`\`

### For Coding
\`\`\`
Write a [language] function that [task].
Requirements:
- [requirement 1]
- [requirement 2]
Include: Error handling, example usage, comments
\`\`\`

## 💡 Pro Tips

### 1. Be Specific
❌ "Help me with my presentation"
✅ "Create an outline for a 10-minute presentation about AI trends in healthcare for doctors"

### 2. Set Constraints
"Explain blockchain in 3 paragraphs maximum, using words a 10-year-old would understand"

### 3. Role-Play
"You are a senior marketing executive with 20 years of experience. Review this marketing plan and provide critical feedback:"

**→ Proceed to Lesson 3: Advanced Techniques**`
      },
      { 
        title: 'Advanced Techniques', 
        content: `## 🧠 Chain of Thought Prompting

Get better reasoning by asking ChatGPT to "think out loud."

### ❌ Basic: "What's 15% of 847?"
### ✅ Chain of Thought:
\`\`\`
"Calculate 15% of 847. Think step by step, showing your work."
\`\`\`

## 🎭 Role Playing

Give ChatGPT a specific persona for specialized help.

### Marketing Expert
\`\`\`
"You are a senior marketing executive with 20 years of experience in B2B SaaS.
I'm launching a new productivity app.

1. Review my landing page copy
2. Suggest improvements
3. Identify gaps in my value proposition"
\`\`\`

### Interview Coach
\`\`\`
"You are an interview coach who has helped 500+ people land jobs at FAANG companies.
Practice a behavioral interview with me. Ask me one question at a time,
then provide feedback before moving to the next question."
\`\`\`

## 🔄 Few-Shot Prompting

Give examples to show exactly what you want.

\`\`\`
"Convert these sentences to professional business language.

Examples:
Input: "This thing is broken"
Output: "This feature requires troubleshooting"

Input: "I need help with this"
Output: "I would appreciate your assistance with this matter"

Now convert:
1. "That's a bad idea"
2. "Can we meet tomorrow?"
\`\`\`

## 📏 Output Formatting

### Tables
\`\`\`
"Compare these 3 laptops in a table with columns: Price, Weight, Battery Life, Screen Quality"
\`\`\`

### JSON
\`\`\`
"Extract all email addresses from this text and return as JSON: { emails: [...] }"
\`\`\`

## 🔁 Iterative Refinement

Don't settle for the first response!

\`\`\`
Initial: "Write a product description"
ChatGPT: [First draft]

You: "Make it more emotional and focus on benefits"
ChatGPT: [Revised draft]

You: "Add a technical specs section at the end"
ChatGPT: [Draft with specs]

You: "Make it 50% shorter"
ChatGPT: [Concise version]
\`\`\`

**→ Proceed to Lesson 4: Pro Tips & Best Practices**`
      },
      { 
        title: 'Pro Tips & Best Practices', 
        content: `## 💡 Power User Tips

### 1. Use Custom Instructions (Plus)

Set preferences once, apply to all chats:

**Settings → Custom Instructions**

**What to tell ChatGPT about you:**
\`\`\`
I'm a software developer working in fintech.
I prefer concise, technical answers.
When showing code, use TypeScript and React.
\`\`\`

**How you want ChatGPT to respond:**
\`\`\`
- Be direct and concise
- Use bullet points for lists
- Include code examples when relevant
- If you're unsure, say so
\`\`\`

### 2. Create Prompt Templates

Save your best prompts for reuse!

### 3. Use Voice Input (Mobile)

Don't type - talk! Tap the headphones icon in the mobile app.

## ✅ Do's

- ✅ Verify important facts from authoritative sources
- ✅ Save important conversations (copy to a document)
- ✅ Ask for clarification if responses are unclear
- ✅ Use ChatGPT for first drafts, then edit

## ❌ Don'ts

- ❌ Share passwords, API keys, or personal info
- ❌ Assume it's always right (hallucinations happen)
- ❌ Use for medical/legal advice
- ❌ Copy-paste directly into production without reviewing

## 🎯 When to Use ChatGPT

### ✅ Great For
- First drafts (emails, reports, content)
- Learning new concepts
- Brainstorming ideas
- Code assistance
- Summarizing long content

### ⚠️ Use With Caution
- Fact-checking (verify elsewhere)
- Mathematical calculations
- Current events (data may be outdated)

### ❌ Not Suitable For
- Medical diagnosis
- Legal advice
- Financial advice
- Emergency situations

## 🎉 Congratulations!

You now know how to:

✅ Understand ChatGPT's capabilities and limits
✅ Write effective prompts using CTF framework
✅ Use advanced techniques (CoT, role-play, few-shot)
✅ Apply best practices and avoid common mistakes

**Practice makes perfect! Use ChatGPT daily and keep a "prompts that worked" document.** 🚀`
      },
    ]
  },
  'guide-github': {
    title: 'GitHub Basics',
    description: 'Learn Git and GitHub from scratch.',
    topic: 'Development Setup',
    lessons: [
      { 
        title: 'What is Git & GitHub?', 
        content: `## Version Control Basics

**Git** is a version control system — it tracks changes to your files over time. Think of it like a "save game" feature for code. You can go back to any previous version, see who changed what, and work on features without breaking everything.

**GitHub** is a website that hosts Git repositories online. It's where you store your code, collaborate with others, and discover open-source projects.

## Why Does This Matter?

- **Never lose work** — Every change is saved
- **Collaborate easily** — Multiple people can work on the same project
- **Track history** — See exactly what changed and when
- **Undo mistakes** — Revert to any previous version

## Key Concepts

- **Repository (repo)** — A project folder tracked by Git
- **Commit** — A snapshot of your changes (like a save point)
- **Branch** — A parallel version for experimenting
- **Merge** — Combine changes from different branches

## Check if Git is Installed

\`\`\`bash
git --version
\`\`\`

**Expected output:** \`git version 2.43.0\`

If you see a version number, Git is installed!

**→ Proceed to Lesson 2: Setting Up GitHub**`
      },
      { 
        title: 'Setting Up GitHub', 
        content: `## Create Your GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Enter your email, create a password, choose a username
4. Verify your email

## Install Git

### macOS
\`\`\`bash
brew install git
\`\`\`

### Linux (Debian/Ubuntu)
\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

### Windows
Download from [git-scm.com](https://git-scm.com/download/win)

## Configure Git

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

Replace with your actual name and the email you used for GitHub.

### Verify:
\`\`\`bash
git config --list
\`\`\`

## Connect to GitHub (SSH Setup - Optional but Recommended)

\`\`\`bash
# Generate SSH Key
ssh-keygen -t ed25519 -C "your.email@example.com"

# View Your Public Key
cat ~/.ssh/id_ed25519.pub
\`\`\`

Copy the output and add it to GitHub: Settings → SSH and GPG keys → New SSH key

**→ Proceed to Lesson 3: Your First Repository**`
      },
      { 
        title: 'Your First Repository', 
        content: `## Create a Repository on GitHub

1. Go to github.com and click the **+** icon (top right)
2. Select **"New repository"**
3. Name it: \`my-first-repo\`
4. Choose **Public** or **Private**
5. Check **"Add a README file"**
6. Click **"Create repository"**

## Clone to Your Computer

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/my-first-repo.git
cd my-first-repo
\`\`\`

## Make Changes and Commit

\`\`\`bash
# Create a New File
echo "# My First Repo" > hello.md

# Check Status
git status

# Stage the File
git add hello.md

# Commit
git commit -m "Add hello.md"
\`\`\`

## Push to GitHub

\`\`\`bash
git push origin main
\`\`\`

Refresh your GitHub page — your file is there!

**The cycle:** Edit → \`git add\` → \`git commit\` → \`git push\`

**→ Proceed to Lesson 4: Collaboration Basics**`
      },
      { 
        title: 'Collaboration Basics', 
        content: `## Fork a Repository

A **fork** is your personal copy of someone else's repository.

1. Go to any public repository on GitHub
2. Click **"Fork"** (top right)
3. Click **"Create fork"**

## Clone Your Fork

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/forked-repo.git
cd forked-repo
\`\`\`

## Make Changes

\`\`\`bash
echo "Contributing!" >> README.md
git add README.md
git commit -m "Update README"
git push origin main
\`\`\`

## Create a Pull Request

A **pull request (PR)** asks the original owner to include your changes.

1. Go to your forked repo on GitHub
2. Click **"Contribute"** → **"Open pull request"**
3. Add a title and description
4. Click **"Create pull request"**

## Merge a Pull Request (For Repo Owners)

1. Go to the **"Pull requests"** tab
2. Click the PR
3. Review the changes
4. Click **"Merge pull request"**

## Keep Your Fork Updated

\`\`\`bash
git remote add upstream https://github.com/ORIGINAL_OWNER/original-repo.git
git fetch upstream
git checkout main
git merge upstream/main
\`\`\`

**Collaboration flow:** Fork → Clone → Edit → Push → Pull Request → Merge

## 🎉 Congratulations!

You now know how to:
- ✅ Create and clone repositories
- ✅ Make commits and push changes
- ✅ Fork repositories
- ✅ Create and merge pull requests`
      },
    ]
  },
  'guide-vscode': {
    title: 'Setting Up VS Code',
    description: 'Configure VS Code for productivity.',
    topic: 'Development Setup',
    lessons: [
      { title: 'Installing VS Code', content: '## Download VS Code\n\n1. Go to [code.visualstudio.com](https://code.visualstudio.com)\n2. Download for your operating system\n3. Run the installer\n\n### macOS\nDownload the .dmg file, drag to Applications\n\n### Windows\nDownload the installer, run and follow prompts\n\n### Linux\n```bash\nsudo snap install code --classic\n```\n\n**→ Proceed to Lesson 2: Essential Extensions**' },
      { title: 'Essential Extensions', content: '## Top 10 VS Code Extensions\n\n### 1. **Prettier** - Code formatter\nAuto-format your code on save\n\n### 2. **ESLint** - JavaScript linter\nCatch errors before running\n\n### 3. **GitLens** - Git supercharged\nSee who changed what, blame info, file history\n\n### 4. **Live Server** - Local dev server\nRight-click HTML → "Open with Live Server"\n\n### 5. **Auto Rename Tag** - HTML helper\nRename opening tag, closing tag updates automatically\n\n### 6. **Path Intellisense** - Autocomplete filenames\nType paths and get suggestions\n\n### 7. **Material Icon Theme** - Better icons\nBeautiful file icons for every file type\n\n### 8. **GitHub Copilot** - AI assistant\nAI-powered code suggestions (requires subscription)\n\n### 9. **Thunder Client** - API testing\nTest APIs without leaving VS Code\n\n### 10. **Error Lens** - Inline errors\nSee error messages directly in your code\n\n**→ Proceed to Lesson 3: Customization**' },
      { title: 'Customization', content: '## Settings.json\n\nOpen settings: \`Ctrl/Cmd + Shift + P\` → "Open User Settings (JSON)"\n\n### Useful Settings:\n\`\`\`json\n{\n  "editor.fontSize": 14,\n  "editor.tabSize": 2,\n  "editor.wordWrap": "on",\n  "editor.formatOnSave": true,\n  "editor.minimap.enabled": false,\n  "workbench.colorTheme": "One Dark Pro",\n  "files.autoSave": "afterDelay",\n  "files.autoSaveDelay": 1000\n}\n\`\`\`\n\n## Key Shortcuts\n\n| Action | Mac | Windows/Linux |\n|--------|-----|---------------|\n| Command Palette | \`Cmd+Shift+P\` | \`Ctrl+Shift+P\` |\n| Quick Open | \`Cmd+P\` | \`Ctrl+P\` |\n| Terminal | \`Ctrl+\`\` | \`Ctrl+\`\` |\n| Split Editor | \`Cmd+\\\` | \`Ctrl+\\\` |\n| Find | \`Cmd+F\` | \`Ctrl+F\` |\n| Global Search | \`Cmd+Shift+F\` | \`Ctrl+Shift+F\` |\n\n## 🎉 Congratulations!\n\nYou now have a fully configured VS Code setup!' },
    ]
  },
  'guide-website': {
    title: 'Your First Website (No Code)',
    description: 'Build a website without coding.',
    topic: 'Getting Started',
    lessons: [
      { title: 'Choose Your Platform', content: '## No-Code Website Builders\n\n### Wix\n- **Best for:** Beginners, small businesses\n- **Price:** Free plan, $16/mo premium\n- **Pros:** Drag-and-drop, templates\n- **Cons:** Limited customization on free plan\n\n### Squarespace\n- **Best for:** Portfolios, creative businesses\n- **Price:** $16/mo\n- **Pros:** Beautiful templates, all-in-one\n- **Cons:** Less flexible than others\n\n### Framer\n- **Best for:** Designers, modern sites\n- **Price:** Free plan, $15/mo\n- **Pros:** Design-first, animations\n- **Cons:** Learning curve\n\n### Carrd\n- **Best for:** One-page sites, landing pages\n- **Price:** Free, $19/year premium\n- **Pros:** Simple, affordable\n- **Cons:** Only single-page sites\n\n**→ Proceed to Lesson 2: Planning Your Site**' },
      { title: 'Planning Your Site', content: '## Site Structure\n\n### 1. Define Your Goal\n- What do you want visitors to do?\n- Contact you? Buy something? Learn more?\n\n### 2. List Your Pages\nTypical structure:\n- Home\n- About\n- Services/Products\n- Contact\n\n### 3. Gather Content\n- Text for each page\n- Images (use Unsplash for free photos)\n- Logo and brand colors\n\n### 4. Wireframe\nSketch your layout before building:\n- Header (logo + navigation)\n- Hero section (main message)\n- Content sections\n- Footer\n\n**→ Proceed to Lesson 3: Building & Publishing**' },
      { title: 'Building & Publishing', content: '## Step-by-Step Build\n\n### 1. Sign up for your chosen platform\n\n### 2. Choose a template\nPick one close to your vision\n\n### 3. Customize\n- Replace placeholder text\n- Add your images\n- Adjust colors/fonts\n\n### 4. Add pages\nCreate your site structure\n\n### 5. Connect a domain\n- Use free subdomain (yoursite.wix.com)\n- Or connect custom domain ($)\n\n### 6. Publish!\nClick "Publish" or "Go Live"\n\n## Tips\n- Keep it simple\n- Mobile-first design\n- Clear call-to-action\n- Fast loading images (compress!)\n\n## 🎉 Congratulations!\n\nYour website is now live!' },
    ]
  },
  'guide-claude': {
    title: 'Using Claude AI',
    description: 'Get started with Claude AI assistant.',
    topic: 'AI Tools',
    lessons: [
      { title: 'Introduction to Claude', content: '## What is Claude?\n\n**Claude** is an AI assistant created by Anthropic. It\'s known for:\n- Being helpful, harmless, and honest\n- Great at writing and analysis\n- Long context window (can read entire documents)\n- Artifacts feature (generates files you can download)\n\n## Claude vs ChatGPT\n\n| Feature | Claude | ChatGPT |\n|---------|--------|---------|\n| **Writing** | Excellent | Very Good |\n| **Analysis** | Excellent | Very Good |\n| **Coding** | Very Good | Excellent |\n| **Context Length** | 200K tokens | 128K tokens |\n| **Artifacts** | ✅ Yes | ❌ No |\n| **Web Browsing** | ✅ Yes | ✅ Yes |\n\n## Getting Started\n\n1. Go to **[claude.ai](https://claude.ai)**\n2. Sign up with email or Google\n3. Choose Free or Pro ($20/mo)\n\n**→ Proceed to Lesson 2: Getting Started**' },
      { title: 'Getting Started', content: '## Your First Conversation\n\nType: \`"Hello! Can you help me write a blog post about AI?"\`\n\nClaude will respond and help you!\n\n## Claude\'s Strengths\n\n### 1. Long Documents\nUpload PDFs, documents, or paste long text. Claude can analyze entire documents.\n\n### 2. Writing\nClaude excels at:\n- Blog posts\n- Marketing copy\n- Technical writing\n- Creative writing\n\n### 3. Analysis\n- Summarize documents\n- Extract key points\n- Compare texts\n- Find patterns\n\n**→ Proceed to Lesson 3: Using Artifacts**' },
      { title: 'Using Artifacts', content: '## What are Artifacts?\n\nArtifacts are files Claude generates that appear in a separate panel. You can:\n- Preview them\n- Download them\n- Edit them\n- Iterate with Claude\n\n## Types of Artifacts\n\n- **Code** - Python, JavaScript, HTML, etc.\n- **Documents** - Markdown, plain text\n- **Diagrams** - Mermaid flowcharts\n- **React Components** - Interactive UI\n- **HTML** - Web pages\n\n## How to Create Artifacts\n\nAsk Claude: "Create a React component for a contact form"\n\nClaude will generate it as an artifact you can preview and download!\n\n**→ Proceed to Lesson 4: Best Practices**' },
      { title: 'Best Practices', content: '## Tips for Using Claude\n\n### 1. Be Specific\n❌ "Help me write something"\n✅ "Help me write a 500-word blog post about sustainable fashion for millennials"\n\n### 2. Provide Context\n"Here\'s my resume. I\'m applying for a product manager role. Suggest improvements."\n\n### 3. Use Iteration\nStart broad, then refine:\n- "Make it more professional"\n- "Add more examples"\n- "Shorten it by 50%"\n\n### 4. Leverage Artifacts\nWhen you need code, documents, or diagrams, ask Claude to create them as artifacts.\n\n## 🎉 Congratulations!\n\nYou now know how to use Claude effectively!' },
    ]
  },
  'guide-gemini': {
    title: 'Google Gemini Essentials',
    description: 'Master Google\'s multimodal AI assistant.',
    topic: 'AI Tools',
    lessons: [
      { title: 'What is Gemini?', content: '## Google Gemini\n\n**Gemini** is Google\'s most advanced AI model. It\'s:\n- Multimodal (text, images, audio, video)\n- Integrated with Google services\n- Available free with Google account\n\n## Gemini vs ChatGPT\n\n| Feature | Gemini | ChatGPT |\n|---------|--------|---------|\n| **Free** | ✅ Yes | ✅ Yes |\n| **Multimodal** | ✅ Native | ✅ Plus only |\n| **Google Integration** | ✅ Yes | ❌ No |\n| **Real-time Info** | ✅ Yes | ✅ Plus only |\n\n## Getting Started\n\n1. Go to **[gemini.google.com](https://gemini.google.com)**\n2. Sign in with Google account\n3. Start chatting!\n\n**→ Proceed to Lesson 2: Getting Started**' },
      { title: 'Getting Started with Gemini', content: '## Key Features\n\n### 1. Multimodal Input\nUpload images and ask questions about them:\n- "What\'s in this image?"\n- "Describe this chart"\n- "Transcribe this text"\n\n### 2. Google Integration\n- Search the web for current info\n- Connect to Google Workspace\n- Export to Google Docs\n\n### 3. Extensions\nConnect to:\n- Google Maps\n- YouTube\n- Google Flights\n- Google Hotels\n\n**→ Proceed to Lesson 3: Multimodal Capabilities**' },
      { title: 'Multimodal Capabilities', content: '## What Can You Do?\n\n### Images\n- Analyze photos and screenshots\n- Extract text from images (OCR)\n- Describe visual content\n- Identify objects and places\n\n### Documents\n- Upload PDFs\n- Summarize long documents\n- Extract key information\n\n### Code\n- Write and debug code\n- Explain code snippets\n- Generate documentation\n\n**→ Proceed to Lesson 4: Pro Tips**' },
      { title: 'Pro Tips & Integrations', content: '## Tips for Gemini\n\n### 1. Use @mentions\nType \`@\` to access:\n- \`@YouTube\` - Search and summarize videos\n- \`@Google Maps\` - Find places\n- \`@Google Flights\` - Search flights\n\n### 2. Export to Docs\nAfter getting a response:\n- Click "Export to Docs"\n- Edit in Google Docs\n\n### 3. Double-Check\nGemini can make mistakes. Always verify important information.\n\n## 🎉 Congratulations!\n\nYou now know how to use Google Gemini!' },
    ]
  },
  'guide-grok': {
    title: 'Using Grok (xAI)',
    description: 'Get started with Elon Musk\'s Grok AI.',
    topic: 'Emerging AI',
    lessons: [
      { title: 'What is Grok?', content: '## xAI\'s Grok\n\n**Grok** is an AI assistant created by xAI (Elon Musk\'s AI company). It\'s known for:\n- Real-time information from X (Twitter)\n- Witty and humorous personality\n- Two modes: Regular and Fun\n\n## Access\n\nGrok is available to X Premium+ subscribers ($16/mo):\n1. Subscribe to X Premium+\n2. Look for Grok in the X sidebar\n3. Start chatting!\n\n## Key Features\n\n- Real-time info from X posts\n- "Fun mode" with humorous responses\n- Image generation (Grok 2)\n- Less censorship than other AIs\n\n**→ Proceed to Lesson 2: Accessing Grok**' },
      { title: 'Accessing Grok via X', content: '## How to Use Grok\n\n### 1. Subscribe to X Premium+\nGo to X → Premium → Subscribe\n\n### 2. Find Grok\nLook for the Grok icon in the left sidebar\n\n### 3. Start Chatting\nType your question or prompt\n\n## Modes\n\n### Regular Mode\nStraightforward, helpful responses\n\n### Fun Mode\nWitty, sarcastic, humorous responses (Grok\'s signature style)\n\n**→ Proceed to Lesson 3: Unique Features**' },
      { title: 'Unique Features & Tips', content: '## What Makes Grok Different\n\n### 1. Real-Time Info\nAccess to X posts means Grok knows what\'s happening NOW.\n\n### 2. Personality\nUnlike other AIs, Grok has a distinct sense of humor.\n\n### 3. Less Guardrails\nGrok will answer questions other AIs might refuse.\n\n## Best Use Cases\n\n- Current events and news\n- Social media content\n- Fun, casual conversations\n- Checking what\'s trending\n\n## 🎉 Congratulations!\n\nYou now know how to use Grok!' },
    ]
  },
  'guide-kimi': {
    title: 'Kimi AI - Long Context Master',
    description: 'Master Kimi\'s massive context window.',
    topic: 'Emerging AI',
    lessons: [
      { title: 'What is Kimi?', content: '## Kimi AI\n\n**Kimi** is an AI assistant by Moonshot AI. It\'s famous for:\n- **200K+ token context window** (extremely long!)\n- Ability to read entire books\n- Document analysis powerhouse\n- Free to use\n\n## Why Use Kimi?\n\nWhen you need to analyze:\n- Long documents (100+ pages)\n- Multiple files at once\n- Research papers\n- Legal documents\n- Codebases\n\n## Access\n\n1. Go to **[kimi.moonshot.cn](https://kimi.moonshot.cn)**\n2. Sign up (supports various methods)\n3. Upload documents and start chatting!\n\n**→ Proceed to Lesson 2: Long Context**' },
      { title: 'Long Context Capabilities', content: '## Why 200K Tokens Matters\n\nOther AIs:\n- ChatGPT: ~4K-128K tokens\n- Claude: ~200K tokens\n- **Kimi: 200K+ tokens**\n\n## What Can You Upload?\n\n- PDF documents (100+ pages)\n- Word documents\n- Text files\n- Multiple files at once\n- Entire code repositories\n\n## Example Use Cases\n\n1. "Summarize this 100-page report"\n2. "Find all mentions of \'revenue\' in these documents"\n3. "Compare these three contracts"\n4. "What are the main themes in this book?"\n\n**→ Proceed to Lesson 3: Document Analysis**' },
      { title: 'Document Analysis Workflows', content: '## Best Practices\n\n### 1. Upload Multiple Documents\nKimi can analyze several files simultaneously.\n\n### 2. Ask Specific Questions\n❌ "What\'s in this document?"\n✅ "What are the key financial metrics mentioned?"\n\n### 3. Iterate\nFollow up with more questions based on the analysis.\n\n### 4. Export Results\nCopy the analysis to your notes.\n\n## Pro Tips\n\n- Compress PDFs before uploading (faster)\n- Use for literature reviews\n- Great for legal document analysis\n- Perfect for research synthesis\n\n## 🎉 Congratulations!\n\nYou now know how to leverage Kimi\'s long context!' },
    ]
  },
  'guide-perplexity': {
    title: 'Perplexity AI Search',
    description: 'AI-powered research with citations.',
    topic: 'AI Tools',
    lessons: [
      { title: 'What is Perplexity?', content: '## Perplexity AI\n\n**Perplexity** is an AI-powered search engine that:\n- Provides answers with **citations**\n- Searches the web in real-time\n- Shows sources for every claim\n- Offers a "Pro" search with deeper analysis\n\n## Why Use Perplexity?\n\n- **Research** - Find information with sources\n- **Fact-checking** - Verify claims with citations\n- **Learning** - Deep dive into topics\n- **Current events** - Real-time information\n\n## Access\n\n1. Go to **[perplexity.ai](https://perplexity.ai)**\n2. Start searching (no account needed)\n3. Create account for Pro features ($20/mo)\n\n**→ Proceed to Lesson 2: Basic Search**' },
      { title: 'Basic Search & Citations', content: '## How It Works\n\n1. Type your question\n2. Perplexity searches the web\n3. AI summarizes with **citations**\n4. Click citations to see sources\n\n## Example\n\n**Query:** "What are the health benefits of green tea?"\n\n**Response:**\n- Bullet points with answers\n- Numbers like [1], [2] after each claim\n- Click to see the source website\n\n## Focus Modes\n\n- **All** - General web search\n- **Academic** - Scholarly sources\n- **Writing** - For content creation\n- **Wolfram|Alpha** - Math and data\n\n**→ Proceed to Lesson 3: Pro Search**' },
      { title: 'Pro Search & Collections', content: '## Pro Search ($20/mo)\n\n### Features:\n- Deeper analysis (5x more sources)\n- File uploads (analyze documents)\n- Multiple AI models (GPT-4, Claude)\n- Unlimited Pro searches\n\n## Collections\n\nOrganize your research:\n1. Create a Collection\n2. Save searches to it\n3. Share with others\n\n## Threads\n\nContinue conversations:\n- Ask follow-up questions\n- Dive deeper into topics\n- Build on previous searches\n\n**→ Proceed to Lesson 4: Research Workflows**' },
      { title: 'Research Workflows', content: '## Best Practices\n\n### 1. Start Broad, Then Narrow\n- "Overview of AI in healthcare"\n- Then: "What are the privacy concerns?"\n- Then: "How is HIPAA addressed?"\n\n### 2. Use Academic Focus\nFor research papers, switch to Academic mode.\n\n### 3. Verify Citations\nAlways click through to sources to verify.\n\n### 4. Save to Collections\nKeep research organized by topic.\n\n## Pro Tips\n\n- Use for literature reviews\n- Great for competitive research\n- Perfect for fact-checking\n- Excellent for learning new topics\n\n## 🎉 Congratulations!\n\nYou now know how to use Perplexity for research!' },
    ]
  },
  'guide-cursor': {
    title: 'Cursor AI Code Editor',
    description: 'Supercharge coding with AI.',
    topic: 'Development Setup',
    lessons: [
      { title: 'What is Cursor?', content: '## Cursor AI\n\n**Cursor** is an AI-native code editor built on VS Code. It includes:\n- AI chat inside your editor\n- Code autocomplete with AI\n- Codebase awareness\n- One-click refactoring\n\n## Why Use Cursor?\n\n- **Faster coding** - AI helps write code\n- **Better code** - AI catches bugs\n- **Learning** - AI explains code\n- **Refactoring** - AI improves your code\n\n## Install\n\n1. Go to **[cursor.sh](https://cursor.sh)**\n2. Download for your OS\n3. Import VS Code settings (optional)\n\n**→ Proceed to Lesson 2: Installation & Setup**' },
      { title: 'Installation & Setup', content: '## Install Cursor\n\n1. Download from cursor.sh\n2. Run the installer\n3. Open Cursor\n\n## Import VS Code Settings\n\nCursor can import:\n- Extensions\n- Keybindings\n- Settings\n\nJust click "Import" when prompted.\n\n## Sign In\n\nSign in to unlock:\n- AI features\n- Cloud sync\n- Team features\n\n**→ Proceed to Lesson 3: AI Chat & Autocomplete**' },
      { title: 'AI Chat & Autocomplete', content: '## AI Chat\n\nPress \`Cmd/Ctrl + L\` to open AI chat.\n\n### Ask anything:\n- "Explain this function"\n- "Find bugs in this code"\n- "Write tests for this"\n- "How do I use this library?"\n\n## Tab Autocomplete\n\nStart typing, and Cursor suggests:\n- Code completions\n- Function implementations\n- Variable names\n- Entire blocks of code\n\nPress \`Tab\` to accept.\n\n## Codebase Awareness\n\nCursor knows your entire project:\n- \`@Codebase\` - Search your code\n- \`@Files\` - Reference specific files\n- \`@Docs\` - Reference documentation\n\n**→ Proceed to Lesson 4: Pro Tips**' },
      { title: 'Pro Tips & Workflows', content: '## Power User Tips\n\n### 1. Cmd+K for Inline Edit\nSelect code → \`Cmd+K\` → Describe change\n\n### 2. @Codebase for Context\n"Using @Codebase, explain how authentication works"\n\n### 3. Generate Tests\nRight-click function → "Generate Tests"\n\n### 4. Fix Errors\nHover over error → "Fix with AI"\n\n## Best Practices\n\n- Review AI suggestions before accepting\n- Use AI for first drafts, then refine\n- Learn from AI explanations\n- Keep code readable for AI context\n\n## 🎉 Congratulations!\n\nYou now know how to use Cursor AI!' },
    ]
  },
}

const TOPIC_COLORS: Record<string, string> = {
  'Getting Started': 'from-green-500 to-emerald-600',
  'AI Tools': 'from-purple-500 to-pink-600',
  'Development Setup': 'from-blue-500 to-cyan-600',
  'Emerging AI': 'from-indigo-500 to-violet-600',
}

export default function GuideContent({ guideId }: { guideId: string }) {
  const router = useRouter()
  const [currentLesson, setCurrentLesson] = useState(0)
  
  const guide = GUIDES_DATA[guideId]
  
  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guide Not Found</h1>
          <Link href="/guides"><Button>Back to Guides</Button></Link>
        </div>
      </div>
    )
  }

  const lesson = guide.lessons[currentLesson]
  const progress = ((currentLesson + 1) / guide.lessons.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/guides')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Guides
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Lesson {currentLesson + 1} of {guide.lessons.length}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {guide.lessons.map((l, i) => (
              <button
                key={i}
                onClick={() => setCurrentLesson(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  i === currentLesson
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}. {l.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
            disabled={currentLesson === 0}
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Previous
          </Button>
          
          {currentLesson < guide.lessons.length - 1 ? (
            <Button onClick={() => setCurrentLesson(currentLesson + 1)}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Guide Complete!</span>
              </div>
              <Link href="/guides">
                <Button>Browse More Guides</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
