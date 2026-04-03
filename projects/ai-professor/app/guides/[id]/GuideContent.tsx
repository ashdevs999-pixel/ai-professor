'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ChevronRight, Zap } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { HowToJsonLd, ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo'
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
      { 
        title: 'Connect to Telegram (BotFather)', 
        content: `## 📱 Connect OpenClaw to Telegram

One of OpenClaw's most powerful features is **Telegram integration** — access your AI assistant from your phone, anywhere!

## Why Telegram?

- **Mobile Access** - Chat with your AI on the go
- **Always On** - Your assistant runs 24/7 on your server
- **Share with Others** - Family/team can use your AI
- **Push Notifications** - Get proactive messages from your AI

## Step 1: Create a Telegram Bot

### Open BotFather

1. Open Telegram (phone or desktop)
2. Search for **@BotFather**
3. Start a chat with the verified BotFather (blue checkmark ✓)

### Create Your Bot

Send:
\`\`\`
/newbot
\`\`\`

BotFather will ask for:
1. **Bot name** - Display name (e.g., "My AI Assistant")
2. **Bot username** - Must end in \`bot\` (e.g., \`my_ai_assistant_bot\`)

### Save Your Token

BotFather responds with:
\`\`\`
Done! Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure!
\`\`\`

⚠️ **Copy this token** — you'll need it for OpenClaw!

## Step 2: Configure OpenClaw

### Add Telegram to Config

Open your OpenClaw config file:
\`\`\`bash
nano ~/.openclaw/config.json
\`\`\`

Add the Telegram section:
\`\`\`json
{
  "plugins": {
    "entries": {
      "telegram": {
        "enabled": true,
        "config": {
          "botToken": "YOUR_BOT_TOKEN_HERE"
        }
      }
    }
  }
}
\`\`\`

Replace \`YOUR_BOT_TOKEN_HERE\` with your actual token.

### Restart OpenClaw

\`\`\`bash
openclaw gateway restart
\`\`\`

## Step 3: Test Your Bot

1. Open Telegram
2. Find your bot (search for the username)
3. Click **Start**
4. Send a message!

Your OpenClaw AI will respond! 🎉

## Pro Tips

### Set Bot Description
In BotFather, send:
\`\`\`
/setdescription
\`\`\`
Then select your bot and write a description.

### Set Bot Commands
\`\`\`
/setcommands
\`\`\`
Add:
\`\`\`
start - Start chatting with the AI
help - Show available commands
status - Check system status
\`\`\`

### Security
- Never share your bot token
- Regenerate if compromised: \`/revoke\` in BotFather
- Your bot is private — only people with the username can find it

**→ You now have a mobile AI assistant!**

---

## 🚨 Troubleshooting Common OpenClaw Issues

### Error 1: "command not found: openclaw"

**Full Error:**
> bash: openclaw: command not found

**Cause:** OpenClaw is not installed globally or not in your PATH

**Solution:**
\`\`\`bash
# Check if installed
npm list -g openclaw

# If not installed, install it
npm install -g openclaw

# If installed but not found, add npm global to PATH
# macOS/Linux (add to ~/.bashrc or ~/.zshrc):
export PATH="$PATH:$(npm config get prefix)/bin"

# Then reload:
source ~/.bashrc  # or ~/.zshrc

# Windows: Reopen terminal as administrator and reinstall
npm install -g openclaw
\`\`\`

---

### Error 2: "EACCES: permission denied" during installation

**Full Error:**
> npm ERR! Error: EACCES: permission denied, access '/usr/local/lib/node_modules'

**Cause:** npm doesn't have write permissions to global folder

**Solution (macOS/Linux):**
\`\`\`bash
# Option 1: Use sudo (not recommended long-term)
sudo npm install -g openclaw

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g openclaw
\`\`\`

**Solution (Windows):**
\`\`\`
1. Run PowerShell as Administrator
2. npm install -g openclaw
\`\`\`

---

### Error 3: "Invalid API key" or "Authentication error"

**Full Error:**
> Error: Invalid API key provided. Check your API key at platform.openai.com

**Cause:** API key is incorrect, expired, or not set

**Solution:**
\`\`\`bash
# 1. Check your .env file
cat .env

# 2. Verify the key format is correct (no extra spaces/quotes)
# Should be: OPENAI_API_KEY=sk-proj-xxxx...
# NOT: OPENAI_API_KEY="sk-proj-xxxx..."
# NOT: OPENAI_API_KEY = sk-proj-xxxx...

# 3. Test key works:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# 4. Regenerate key if compromised:
# Go to platform.openai.com → API Keys → Reveal → Delete → Create new
\`\`\`

---

### Error 4: "Telegram bot token is invalid"

**Full Error:**
> Telegram API error: Unauthorized (401)

**Cause:** Bot token is wrong, revoked, or not configured

**Solution:**
\`\`\`bash
# 1. Verify token in config
cat ~/.openclaw/config.json | grep botToken

# 2. Test token manually:
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# Should return: {"ok":true,"result":{...}}

# 3. If revoked, get new token:
# Open Telegram → @BotFather → /newbot → Copy new token

# 4. Update config:
nano ~/.openclaw/config.json
# Replace botToken value

# 5. Restart OpenClaw:
openclaw gateway restart
\`\`\`

---

### Error 5: "Gateway failed to start" or "Port already in use"

**Full Error:**
> Error: listen EADDRINUSE: address already in use :::3000

**Cause:** Another process is using the port OpenClaw needs

**Solution:**
\`\`\`bash
# Find what's using the port (Linux/macOS)
lsof -i :3000
# Or
netstat -tunlp | grep 3000

# Kill the process
kill -9 <PID>

# Or change OpenClaw port in config:
nano ~/.openclaw/config.json
# Add/modify: "gateway": { "port": 3001 }

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

---

### Error 6: "Module not found" or dependencies error

**Full Error:**
> Error: Cannot find module 'xxx'

**Cause:** Dependencies not installed or corrupted

**Solution:**
\`\`\`bash
# 1. Reinstall OpenClaw
npm uninstall -g openclaw
npm cache clean --force
npm install -g openclaw

# 2. If in a workspace directory:
rm -rf node_modules
npm install

# 3. Check Node.js version (needs 18+)
node --version
# If older, update Node.js from nodejs.org
\`\`\`

---

### Error 7: "Network error" or "ETIMEDOUT"

**Full Error:**
> Error: connect ETIMEDOUT 151.101.1.69:443

**Cause:** Network connectivity issue or firewall blocking

**Solution:**
\`\`\`bash
# 1. Check internet connection
ping google.com

# 2. Check if proxy needed
npm config get proxy
npm config get https-proxy

# 3. Set proxy if needed
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 4. Or bypass SSL (not recommended for production)
npm config set strict-ssl false

# 5. Try alternate registry
npm install -g openclaw --registry https://registry.npmmirror.com
\`\`\`

---

### Error 8: "Rate limit exceeded"

**Full Error:**
> Error: Rate limit exceeded. Please try again later.

**Cause:** Too many API requests in a short time

**Solution:**
\`\`\`bash
# 1. Wait and retry (limits reset every minute/hour)

# 2. Check your usage:
# OpenAI: platform.openai.com → Usage
# Anthropic: console.anthropic.com → Usage

# 3. Implement rate limiting in config:
nano ~/.openclaw/config.json
# Add: "rateLimit": { "enabled": true, "maxRequests": 50, "windowMs": 60000 }

# 4. Use cheaper/faster model for simple tasks:
# Change from gpt-4 to gpt-3.5-turbo in requests
\`\`\`

---

### Error 9: OpenClaw not responding to Telegram messages

**Cause:** Bot not running, wrong permissions, or webhook issue

**Solution:**
\`\`\`bash
# 1. Check if gateway is running
openclaw gateway status

# 2. Start if not running
openclaw gateway start

# 3. Check logs
openclaw gateway logs

# 4. Verify bot can receive messages:
# Open your bot in Telegram → Send /start
# Check if OpenClaw logs show the message

# 5. Ensure you've started conversation with bot:
# Send /start to your bot first

# 6. Check bot privacy mode:
# @BotFather → /setprivacy → DISABLE (to receive all group messages)
\`\`\`

---

### Error 10: "Config file not found" or "Invalid config"

**Full Error:**
> Error: Config file not found at ~/.openclaw/config.json

**Cause:** OpenClaw not initialized or config corrupted

**Solution:**
\`\`\`bash
# 1. Initialize OpenClaw
openclaw init

# 2. If config corrupted, reset:
rm ~/.openclaw/config.json
openclaw init

# 3. Recreate minimal config:
mkdir -p ~/.openclaw
cat > ~/.openclaw/config.json << 'EOF'
{
  "model": "gpt-4",
  "plugins": {
    "entries": {}
  }
}
EOF

# 4. Add your API key:
echo "OPENAI_API_KEY=your-key-here" > ~/.openclaw/.env
\`\`\`

---

### Error 11: "Memory allocation failed" or crashes

**Cause:** System running low on memory

**Solution:**
\`\`\`bash
# 1. Check available memory
free -h  # Linux
vm_stat  # macOS

# 2. Close unnecessary applications

# 3. Increase Node.js memory limit:
export NODE_OPTIONS="--max-old-space-size=4096"
openclaw start

# 4. For permanent fix, add to ~/.bashrc or ~/.zshrc:
echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.bashrc
\`\`\`

---

### Error 12: Skills not loading or working

**Cause:** Skill not installed, outdated, or incompatible

**Solution:**
\`\`\`bash
# 1. List installed skills
openclaw skill list

# 2. Reinstall the skill
openclaw skill remove <skill-name>
openclaw skill add <skill-name>

# 3. Update all skills
openclaw skill update

# 4. Check skill compatibility with your OpenClaw version
openclaw --version

# 5. Install from ClawHub:
openclaw skill install <skill-name> --from clawhub
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Documentation:** [docs.openclaw.ai](https://docs.openclaw.ai)
- **GitHub Issues:** [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)
- **Discord Community:** [discord.gg/clawd](https://discord.gg/clawd)

### Quick Diagnostics
\`\`\`bash
# Run diagnostics
openclaw doctor

# Check version
openclaw --version

# View logs
openclaw logs --tail 100

# Test configuration
openclaw config validate
\`\`\`

**→ You're ready to troubleshoot any OpenClaw issue!**`
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
      { 
        title: 'Connect ChatGPT to Telegram', 
        content: `## 📱 Deploy ChatGPT as a Telegram Bot

Want to access ChatGPT from your phone? Create your own ChatGPT Telegram bot!

## Why Telegram + ChatGPT?

- **Mobile access** - Chat with ChatGPT anywhere
- **Share with others** - Friends/family can use your bot
- **24/7 available** - Runs on your server, always online
- **Free** - No ChatGPT Plus needed (uses your API key)

## Step 1: Get OpenAI API Key

1. Go to **[platform.openai.com](https://platform.openai.com)**
2. API Keys → Create new secret key
3. Copy and save securely

## Step 2: Create Telegram Bot

### Open BotFather

1. Open Telegram
2. Search **@BotFather**
3. Send: \`/newbot\`
4. Follow prompts to name your bot

### Save Your Token

BotFather gives you a token like:
\`\`\`
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
\`\`\`

⚠️ **Save this token!**

## Step 3: Deploy Your Bot

### Option A: Use OpenClaw (Easiest)

Follow the OpenClaw guide to connect ChatGPT to Telegram with minimal setup.

### Option B: Use Python

\`\`\`bash
pip install python-telegram-bot openai
\`\`\`

Create \`bot.py\`:
\`\`\`python
import openai
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

openai.api_key = "YOUR_OPENAI_KEY"

async def chat(update: Update, context):
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": update.message.text}]
    )
    await update.message.reply_text(response.choices[0].message.content)

app = Application.builder().token("YOUR_BOT_TOKEN").build()
app.add_handler(MessageHandler(filters.TEXT, chat))
app.run_polling()
\`\`\`

Run:
\`\`\`bash
python bot.py
\`\`\`

### Option C: Use No-Code Platforms

- **ManyChat** - Visual bot builder
- **Chatfuel** - No-code bot platform
- **Dante AI** - ChatGPT wrapper with Telegram

## 🎉 Congratulations!

Your ChatGPT Telegram bot is ready! Share the bot username with friends and they can use ChatGPT too!`
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

---

## 🚨 Troubleshooting Common Git & GitHub Errors

### Error 1: "git: command not found"

**Full Error:**
> bash: git: command not found
> 'git' is not recognized as an internal or external command

**Cause:** Git is not installed or not in your system PATH

**Solution:**

**Windows:**
\`\`\`bash
# Download and install from git-scm.com
# Or use winget:
winget install Git.Git

# After installation, restart your terminal
\`\`\`

**macOS:**
\`\`\`bash
# Option 1: Xcode Command Line Tools
xcode-select --install

# Option 2: Homebrew
brew install git
\`\`\`

**Linux (Debian/Ubuntu):**
\`\`\`bash
sudo apt update
sudo apt install git

# Verify installation
git --version
\`\`\`

**Linux (Fedora/RHEL):**
\`\`\`bash
sudo dnf install git
# or
sudo yum install git
\`\`\`

---

### Error 2: "Permission denied (publickey)"

**Full Error:**
> git@github.com: Permission denied (publickey).
> fatal: Could not read from remote repository.

**Cause:** SSH key not set up, not added to GitHub, or SSH agent not running

**Solution:**
\`\`\`bash
# Step 1: Check if SSH key exists
ls -la ~/.ssh
# Look for id_rsa, id_ed25519, etc.

# Step 2: If no key exists, generate one
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for default location
# Choose a passphrase (or leave empty)

# Step 3: Start SSH agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Step 4: Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Copy the output

# Step 5: Add to GitHub
# Go to github.com → Settings → SSH and GPG keys → New SSH key
# Paste the public key and save

# Step 6: Test connection
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated"
\`\`\`

**Alternative: Use HTTPS instead:**
\`\`\`bash
# Change remote URL from SSH to HTTPS
git remote set-url origin https://github.com/username/repo.git

# Use Personal Access Token (PAT) as password
# Generate at: github.com → Settings → Developer settings → Personal access tokens
\`\`\`

---

### Error 3: "fatal: not a git repository"

**Full Error:**
> fatal: not a git repository (or any of the parent directories): .git

**Cause:** You're not inside a Git repository (no .git folder exists)

**Solution:**
\`\`\`bash
# Option 1: Initialize a new repository
git init
git add .
git commit -m "Initial commit"

# Option 2: Clone an existing repository
git clone https://github.com/username/repo.git
cd repo

# Option 3: Navigate to correct directory
cd /path/to/your/repo
# Check if .git folder exists
ls -la | grep .git
\`\`\`

---

### Error 4: "Push rejected" or "Updates were rejected"

**Full Error:**
> ! [rejected]        main -> main (non-fast-forward)
> error: failed to push some refs to 'git@github.com:username/repo.git'

**Cause:** Remote has commits you don't have locally (diverged history)

**Solution:**
\`\`\`bash
# Option 1: Pull and merge first (safest)
git pull origin main
# Resolve any merge conflicts
git push origin main

# Option 2: Pull with rebase (cleaner history)
git pull --rebase origin main
git push origin main

# Option 3: Force push (⚠️ DANGEROUS - only if you're sure)
git push --force origin main
# NEVER force push to shared branches!
\`\`\`

**Prevention:** Always pull before pushing:
\`\`\`bash
git pull && git push
\`\`\`

---

### Error 5: "Merge conflicts" (CONFLICT)

**Full Error:**
> CONFLICT (content): Merge conflict in filename.js
> Automatic merge failed; fix conflicts and then commit the result.

**Cause:** Same lines changed in both branches

**Solution:**
\`\`\`bash
# Step 1: See which files have conflicts
git status

# Step 2: Open conflicted files and look for markers:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# Step 3: Manually resolve by choosing what to keep:
# Delete the markers and keep the correct code

# Step 4: Stage resolved files
git add filename.js

# Step 5: Complete the merge
git commit -m "Resolve merge conflicts"
\`\`\`

**Using VS Code:**
\`\`\`
1. Open conflicted file
2. Click "Accept Current Change" or "Accept Incoming Change"
3. Or use "Accept Both Changes" to combine
4. Save file
5. git add . && git commit
\`\`\`

**Abort merge and start over:**
\`\`\`bash
git merge --abort
\`\`\`

---

### Error 6: "Authentication failed" or "Invalid credentials"

**Full Error:**
> remote: Invalid username or password.
> fatal: Authentication failed for 'https://github.com/...'

**Cause:** Wrong credentials, expired token, or 2FA enabled

**Solution:**

**If using HTTPS:**
\`\`\`bash
# GitHub no longer accepts passwords - use Personal Access Token (PAT)

# Step 1: Generate PAT
# Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
# Click "Generate new token"
# Select scopes: repo (full control)
# Copy the token (you won't see it again!)

# Step 2: Update credentials
# macOS: Use osxkeychain
git config --global credential.helper osxkeychain

# Windows: Use Git Credential Manager
git config --global credential.helper manager

# Linux: Cache credentials
git config --global credential.helper cache

# Step 3: Push and enter token as password
git push
# Username: your-github-username
# Password: your-personal-access-token
\`\`\`

**If using SSH:**
\`\`\`bash
# See Error 2 above for SSH setup
\`\`\`

---

### Error 7: "remote origin already exists"

**Full Error:**
> remote origin already exists.

**Cause:** You're trying to add a remote named "origin" that already exists

**Solution:**
\`\`\`bash
# Option 1: Update existing remote URL
git remote set-url origin https://github.com/username/new-repo.git

# Option 2: Remove and re-add
git remote remove origin
git remote add origin https://github.com/username/new-repo.git

# Option 3: Check existing remotes first
git remote -v
# Then decide what to do
\`\`\`

---

### Error 8: "detected dubious ownership in repository"

**Full Error:**
> fatal: detected dubious ownership in repository at '/path/to/repo'

**Cause:** Git security feature - repository owned by different user

**Solution:**
\`\`\`bash
# Option 1: Add directory to safe list
git config --global --add safe.directory /path/to/repo

# Option 2: Add all repositories
git config --global --add safe.directory '*'

# Option 3: Fix ownership (Linux/macOS)
sudo chown -R $USER:$USER /path/to/repo
\`\`\`

---

### Error 9: "SSL certificate problem"

**Full Error:**
> fatal: unable to access 'https://github.com/...': SSL certificate problem: self signed certificate

**Cause:** Corporate proxy, antivirus, or network intercepting SSL

**Solution:**
\`\`\`bash
# Option 1: Disable SSL verification (⚠️ temporary only!)
git config --global http.sslVerify false

# Option 2: Add corporate certificate (safer)
git config --global http.sslCAInfo /path/to/certificate.crt

# Option 3: Use SSH instead of HTTPS
git remote set-url origin git@github.com:username/repo.git

# Option 4: Update Git (older versions have SSL issues)
# Download latest from git-scm.com
\`\`\`

**Re-enable SSL after fixing:**
\`\`\`bash
git config --global http.sslVerify true
\`\`\`

---

### Error 10: "Connection timed out" or "Could not resolve host"

**Full Error:**
> fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443: Connection timed out

**Cause:** Network issues, firewall, or GitHub is down

**Solution:**
\`\`\`bash
# Step 1: Check if GitHub is down
# Visit githubstatus.com

# Step 2: Test basic connectivity
ping github.com

# Step 3: Check proxy settings
git config --global --get http.proxy

# Step 4: Configure proxy if needed
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy https://proxy.company.com:8080

# Step 5: Or unset proxy
git config --global --unset http.proxy
git config --global --unset https.proxy

# Step 6: Try alternative DNS
# On your system, change DNS to 8.8.8.8 or 1.1.1.1
\`\`\`

---

### Error 11: "LF will be replaced by CRLF"

**Full Error:**
> warning: LF will be replaced by CRLF in filename.js

**Cause:** Line ending differences between Windows (CRLF) and Unix (LF)

**Solution:**
\`\`\`bash
# Option 1: Configure Git to handle line endings
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows

# Option 2: Create .gitattributes file
echo "* text=auto" > .gitattributes
git add .gitattributes
git commit -m "Add gitattributes for line endings"

# Option 3: Normalize all files
git add --renormalize .
git status  # See what changed
git commit -m "Normalize line endings"
\`\`\`

---

### Error 12: "Your branch is ahead of origin/main by X commits"

**Full Error:**
> Your branch is ahead of 'origin/main' by 3 commits.

**This is not an error!** It means you have local commits not yet pushed.

**Solution:**
\`\`\`bash
# Push your commits
git push origin main

# If push fails, see Error 4 (Push rejected)
\`\`\`

---

### Error 13: "detached HEAD state"

**Full Error:**
> You are in 'detached HEAD' state.

**Cause:** Checked out a specific commit or tag instead of a branch

**Solution:**
\`\`\`bash
# Option 1: Create a new branch to save your work
git checkout -b new-branch-name

# Option 2: Return to main branch
git checkout main

# Option 3: If you made commits in detached state, save them
git branch new-branch-name HEAD
# Then switch to that branch
git checkout new-branch-name
\`\`\`

---

### Error 14: "Repository not found"

**Full Error:**
> remote: Repository not found.
> fatal: repository 'https://github.com/username/repo.git/' not found

**Cause:** Wrong URL, private repo without access, or repo deleted

**Solution:**
\`\`\`bash
# Step 1: Verify repository exists
# Go to github.com/username/repo in browser

# Step 2: Check remote URL
git remote -v

# Step 3: Fix URL if wrong
git remote set-url origin https://github.com/correct-username/correct-repo.git

# Step 4: If private repo, ensure you have access
# Check with repo owner, or verify SSH key is added

# Step 5: For private repos, authenticate first
# See Error 2 (SSH) or Error 6 (HTTPS auth)
\`\`\`

---

### Error 15: ".gitignore not working"

**Symptoms:** Files listed in .gitignore are still being tracked

**Cause:** Files were already tracked before adding to .gitignore

**Solution:**
\`\`\`bash
# Step 1: Remove files from Git cache (not local files)
git rm -r --cached .
git add .
git commit -m "Fix gitignore"

# For specific file:
git rm --cached path/to/file

# Step 2: Verify .gitignore syntax
cat .gitignore
# Common patterns:
# node_modules/
# .env
# *.log
# build/
# .DS_Store
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Git Documentation:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **GitHub Community:** [github.community](https://github.community)
- **Pro Git Book:** [git-scm.com/book](https://git-scm.com/book) (free!)

### Quick Diagnostics
\`\`\`bash
# Check Git version
git --version

# Check configuration
git config --list

# Check remote details
git remote -v

# Check current status
git status

# View recent commits
git log --oneline -10

# Debug connection issues
ssh -Tv git@github.com
\`\`\`

## 🎉 Congratulations!

You now know how to:
- ✅ Create and clone repositories
- ✅ Make commits and push changes
- ✅ Fork repositories
- ✅ Create and merge pull requests
- ✅ Troubleshoot the most common Git errors!`
      },
    ]
  },
  'guide-vscode': {
    title: 'Setting Up VS Code',
    description: 'The complete beginner\'s guide to installing and mastering Visual Studio Code.',
    topic: 'Development Setup',
    lessons: [
      {
        title: 'Introduction & Prerequisites',
        content: `## What is VS Code?

**Visual Studio Code (VS Code)** is a free, open-source code editor created by Microsoft. It's the most popular code editor in the world, used by over 70% of professional developers.

Think of VS Code as your "digital workshop" — it's where you write, edit, and organize your code. It's like Microsoft Word, but for programming.

## 🎯 What You'll Learn

By the end of this guide, you will:

- ✅ Understand what VS Code is and why it's essential
- ✅ Have VS Code installed and running on your computer
- ✅ Know which extensions to install (and why)
- ✅ Create and save your first file
- ✅ Troubleshoot common problems

**⏱️ Time to complete:** ~20 minutes

---

## 🤔 Why Use VS Code?

### Three Specific Use Cases

**1. Learning to Code**
If you're just starting out, VS Code is perfect because:
- It highlights syntax errors (like spell-check for code)
- It auto-completes as you type
- It's completely free
- There are thousands of tutorials for it

**2. Web Development**
If you're building websites:
- Live preview of HTML/CSS changes
- Built-in Git integration
- Extensions for React, Vue, Angular
- Integrated terminal for running commands

**3. Professional Development**
For work projects:
- Debug code directly in the editor
- Work on remote files (SSH, containers)
- Collaborate with Live Share
- Customize everything to your workflow

### VS Code vs Other Editors

| Feature | VS Code | Sublime Text | Notepad++ | vim |
|---------|---------|--------------|-----------|-----|
| **Price** | Free | $99 | Free | Free |
| **Extensions** | 40,000+ | ~5,000 | ~100 | Many |
| **Learning Curve** | Easy | Easy | Easy | Hard |
| **Built-in Terminal** | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| **Git Integration** | ✅ Yes | Plugin | ❌ No | Plugin |

**Verdict:** VS Code is the best choice for 95% of developers.

---

## ✅ Prerequisites Checklist

Before installing, make sure your computer meets these requirements:

### Operating System Requirements

| OS | Minimum Version | Recommended |
|----|-----------------|-------------|
| **Windows** | Windows 10 | Windows 11 |
| **macOS** | macOS 10.15 (Catalina) | macOS 14 (Sonoma) |
| **Linux** | Ubuntu 18.04 / Debian 10 | Latest LTS |

### Hardware Requirements

| Requirement | Minimum | Recommended | Why |
|-------------|---------|-------------|-----|
| **RAM** | 4 GB | 8 GB+ | Extensions use memory |
| **Storage** | 500 MB free | 2 GB+ free | VS Code + extensions |
| **CPU** | Any modern processor | Multi-core | Large files load faster |
| **Display** | 1366x768 | 1920x1080+ | More screen = more code |

### Access Requirements

- [ ] **Administrator access** (needed to install software)
- [ ] **Internet connection** (to download VS Code and extensions)
- [ ] **A web browser** (to download the installer)

---

## 🔍 How to Check Your Computer

### Windows

1. Press \`Windows Key + R\`
2. Type \`winver\` and press Enter
3. A window will show your Windows version

**Check RAM:**
1. Press \`Ctrl + Shift + Esc\` to open Task Manager
2. Click "Performance" tab → "Memory"
3. Look at "Installed RAM"

### macOS

1. Click the **Apple icon ()** in the top-left
2. Select **"About This Mac"**
3. You'll see your macOS version and memory

### Linux (Ubuntu)

Open Terminal and run:
\`\`\`bash
# Check Ubuntu version
lsb_release -a

# Check RAM
free -h

# Check disk space
df -h /
\`\`\`

---

## ⚠️ Common Prerequisites Issues

### "I don't have administrator access"

**Solution:**
- **Work computer:** Contact your IT department and ask for installation privileges
- **Personal computer:** You should already have admin access
- **Windows:** Right-click the installer → "Run as administrator"

### "My computer is too old"

VS Code runs on most computers from the last 10 years. If you're unsure:
- Try installing anyway — it won't harm your computer
- VS Code will warn you if it can't run

### "I'm on a restricted network (work/school)"

**Solution:**
- Try the "User Installer" for Windows (doesn't require admin)
- Ask IT to whitelist \`code.visualstudio.com\`
- Use the portable version (no installation needed)

---

**→ Ready? Proceed to Lesson 2: Installation**`
      },
      {
        title: 'Installation',
        content: `## 📥 Download VS Code

### Step 1: Visit the Official Website

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to **[code.visualstudio.com](https://code.visualstudio.com)**
3. The website will automatically detect your operating system

> ⚠️ **IMPORTANT:** Only download from the official website. Fake download sites may contain malware.

---

## 🖥️ Installation by Operating System

### Windows Installation

**Step 1: Download**
1. Click the blue **"Download for Windows"** button
2. The file (VSCodeUserSetup-{version}.exe) will download (~90 MB)

**Step 2: Run the Installer**
1. Find the downloaded file (usually in your **Downloads** folder)
2. Double-click to run it
3. If prompted "Do you want to allow this app?", click **Yes**

**Step 3: Setup Wizard**
1. **License Agreement:** Click "I accept the agreement" → Next
2. **Install Location:** Keep the default → Next
3. **Start Menu Folder:** Keep default → Next
4. **Additional Tasks:** 
   - ✅ Check **"Add 'Open with Code' action to Windows Explorer file context menu"**
   - ✅ Check **"Add 'Open with Code' action to Windows Explorer directory context menu"**
   - ✅ Check **"Register Code as an editor for supported file types"**
   - ✅ Check **"Add to PATH"** (very important!)
   - Click **Next**

5. Click **Install**
6. Wait 1-2 minutes for installation
7. ✅ Check **"Launch Visual Studio Code"** → Click **Finish**

**Expected Result:** VS Code opens with a "Get Started" page.

---

### macOS Installation

**Step 1: Download**
1. Click the dropdown arrow next to "Download" 
2. Select **"macOS"** (Intel chip or Apple Silicon)
3. A .zip file will download (~150 MB)

> 💡 **How to check your chip:** Apple menu → "About This Mac" → Look for "Chip: Apple M1/M2/M3" (Apple Silicon) or "Processor: Intel" (Intel)

**Step 2: Extract and Install**
1. Open your **Downloads** folder
2. Double-click the downloaded .zip file (it will extract automatically)
3. Drag the **"Visual Studio Code.app"** to your **Applications** folder

**Step 3: First Launch**
1. Open **Applications** folder
2. Double-click **Visual Studio Code**
3. If you see **"VS Code is an app downloaded from the internet"**:
   - Click **Open**
4. If macOS still blocks it:
   - Go to **System Settings → Privacy & Security**
   - Click **"Open Anyway"** next to the security warning

**Step 4: Add to Dock (Recommended)**
1. Right-click the VS Code icon in the Dock
2. Select **Options → Keep in Dock**

**Expected Result:** VS Code opens with a welcome screen.

---

### Linux Installation

#### Option A: Using Snap (Easiest - Ubuntu, Debian, etc.)

\`\`\`bash
sudo snap install code --classic
\`\`\`

Enter your password when prompted. Done!

#### Option B: Using apt (Debian/Ubuntu)

\`\`\`bash
# Install dependencies
sudo apt update
sudo apt install software-properties-common apt-transport-https wget

# Import Microsoft GPG key
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -

# Add VS Code repository
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"

# Install VS Code
sudo apt update
sudo apt install code
\`\`\`

#### Option C: Direct Download (.deb or .rpm)

1. Go to [code.visualstudio.com/download](https://code.visualstudio.com/download)
2. Click **.deb** (Debian/Ubuntu) or **.rpm** (Fedora/openSUSE)
3. Open the downloaded file with Software Center
4. Click **Install**

**Expected Result:** Type \`code\` in terminal and VS Code launches.

---

## ✅ How to Verify Installation Worked

### Windows
1. Press \`Windows Key\`
2. Type \`Visual Studio Code\`
3. Press Enter
4. ✅ VS Code should open

### macOS
1. Press \`Cmd + Space\` to open Spotlight
2. Type \`Visual Studio Code\`
3. Press Enter
4. ✅ VS Code should open

### Linux
\`\`\`bash
code --version
\`\`\`
You should see something like: \`1.85.0\`

---

## 🚨 Common Installation Errors & Fixes

### Error 1: "Installation failed" (Windows)

**Symptoms:**
- Installer closes unexpectedly
- "Installation failed" message
- Progress bar stops midway

**Solutions:**

1. **Run as Administrator:**
   - Right-click the installer
   - Select **"Run as administrator"**
   - Try again

2. **Disable Antivirus Temporarily:**
   - Some antivirus blocks installers
   - Temporarily disable, install, re-enable

3. **Use the User Installer:**
   - Download "User Installer" instead of "System Installer"
   - Doesn't require admin rights
   - Download from: [code.visualstudio.com/download](https://code.visualstudio.com/download)

4. **Clean Previous Installation:**
   \`\`\`
   1. Uninstall VS Code (Settings → Apps → VS Code → Uninstall)
   2. Delete folder: C:\\Users\\[YourName]\\.vscode
   3. Delete folder: %APPDATA%\\Code
   4. Reinstall
   \`\`\`

---

### Error 2: "Permission denied" (macOS/Linux)

**Symptoms:**
- "Permission denied" when running installer
- "You don't have permission to open this application"

**Solutions (macOS):**

1. **Allow in Security Settings:**
   \`\`\`
   1. System Settings → Privacy & Security
   2. Scroll down to security message
   3. Click "Open Anyway"
   \`\`\`

2. **Fix Permissions via Terminal:**
   \`\`\`bash
   sudo chmod +x /Applications/Visual\\ Studio\\ Code.app/Contents/MacOS/Electron
   \`\`\`

**Solutions (Linux):**
\`\`\`bash
# Fix permissions
sudo chown -R $USER:$USER /home/$USER/.vscode

# Or use sudo for snap install
sudo snap install code --classic
\`\`\`

---

### Error 3: "VS Code is already running" (All OS)

**Symptoms:**
- "Another instance is already running"
- Installer won't proceed

**Solutions:**

**Windows:**
\`\`\`
1. Press Ctrl + Shift + Esc (Task Manager)
2. Find "Visual Studio Code"
3. Right-click → End Task
4. Try installing again
\`\`\`

**macOS:**
\`\`\`
1. Cmd + Space → "Activity Monitor"
2. Search "Code"
3. Select → click X → Force Quit
5. Try installing again
\`\`\`

**Linux:**
\`\`\`bash
# Kill VS Code process
killall code
# Or find and kill:
ps aux | grep code
kill [PID]
\`\`\`

---

### Error 4: "Download failed" or "Network error"

**Symptoms:**
- Download doesn't start
- "Network error" message
- Very slow download

**Solutions:**

1. **Try a Different Browser:**
   - Chrome, Firefox, Edge — try another

2. **Check Your Connection:**
   - Ensure you're online
   - Try another network (mobile hotspot)

3. **Use a Download Manager:**
   - Tools like Free Download Manager can resume interrupted downloads

4. **Corporate/University Network:**
   - IT may be blocking downloads
   - Contact IT or use personal network

---

### Error 5: "The application is damaged" (macOS)

**Symptoms:**
- "The application 'Visual Studio Code' is damaged and can't be opened"
- App appears with a prohibitory sign

**Solution:**

1. **Remove Quarantine Attribute:**
   \`\`\`bash
   xattr -cr /Applications/Visual\\ Studio\\ Code.app
   \`\`\`

2. **Re-download and Reinstall:**
   \`\`\`
   1. Delete the damaged app
   2. Empty Trash
   3. Download fresh copy
   4. Install again
   \`\`\`

---

### Error 6: "code command not found" (Linux/macOS)

**Symptoms:**
- Typing \`code\` in terminal shows "command not found"
- Can't launch VS Code from command line

**Solution (macOS):**

1. Open VS Code manually
2. Press \`Cmd + Shift + P\`
3. Type: \`shell command\`
4. Click **"Shell Command: Install 'code' command in PATH"**
5. Restart terminal

**Solution (Linux):**

\`\`\`bash
# For snap installation
sudo ln -s /snap/bin/code /usr/local/bin/code

# For .deb installation
sudo ln -s /usr/share/code/bin/code /usr/local/bin/code
\`\`\`

---

## 📋 Quick Reference: Installation Commands

| OS | Command/Method |
|----|---------------|
| **Windows** | Download .exe installer, run as admin |
| **macOS** | Download .zip, extract, drag to Applications |
| **Ubuntu/Debian** | \`sudo snap install code --classic\` |
| **Fedora** | \`sudo dnf install code\` |
| **Arch Linux** | \`yay -S visual-studio-code-bin\` |

---

**✅ Installation Complete! Proceed to Lesson 3: Essential Setup**`
      },
      {
        title: 'Essential Setup',
        content: `## 🚀 First Launch Walkthrough

When you open VS Code for the first time, you'll see the **Get Started** page. Let's walk through what to do.

### What You'll See

1. **Welcome Tab** — Overview of VS Code features
2. **Side Bar** (left) — File explorer, search, Git, extensions
3. **Editor Area** (center) — Where you write code
4. **Terminal** (bottom) — Command-line interface (toggle with \`Ctrl/Cmd + \`\`)
5. **Status Bar** (very bottom) — File info, Git branch, errors

### First Things to Do

1. **Sign in (Optional):**
   - Click the person icon in the top-right
   - Sign in with GitHub or Microsoft account
   - This syncs your settings across devices

2. **Choose a Theme:**
   - Press \`Ctrl/Cmd + K\`, then \`Ctrl/Cmd + T\` (yes, press K first, then T)
   - Or: File → Preferences → Color Theme
   - Popular choices: **Dark+** (default), **One Dark Pro**, **Dracula**

3. **Set Your Font:**
   - File → Preferences → Settings
   - Search "font family"
   - Recommended: \`'Fira Code', 'Cascadia Code', Consolas, monospace\`
   - Also enable "Font Ligatures" for fancy character combinations

---

## 🧩 Must-Have Extensions

Extensions are what make VS Code powerful. Here are the **7 essential extensions** every beginner should install:

### How to Install Extensions

1. Click the **Extensions icon** in the left sidebar (looks like squares)
2. Or press \`Ctrl/Cmd + Shift + X\`
3. Search for the extension name
4. Click **Install**

---

### 1. 🎨 Prettier — Code Formatter

**What it does:** Automatically formats your code to look clean and consistent

**Why you need it:**
- No more manual indentation
- Consistent code style across projects
- One keystroke to beautify entire files

**Install:** Search "Prettier - Code formatter" (author: Prettier)

**Setup after installing:**
\`\`\`
1. File → Preferences → Settings
2. Search "format on save"
3. Check "Editor: Format On Save"
\`\`\`

**Test it:** Write messy code, save the file → It auto-formats!

---

### 2. 🔍 ESLint — JavaScript Linter

**What it does:** Finds and fixes problems in your JavaScript/TypeScript code

**Why you need it:**
- Catches errors before you run the code
- Shows warnings for bad practices
- Auto-fixes many issues

**Install:** Search "ESLint" (author: Microsoft)

**Note:** Requires Node.js. If you don't have it:
- Download from [nodejs.org](https://nodejs.org)
- Install the LTS version

---

### 3. 📊 GitLens — Git Supercharged

**What it does:** Shows who changed each line of code and when

**Why you need it:**
- See git blame annotations (who wrote this?)
- Compare changes visually
- Navigate git history easily

**Install:** Search "GitLens" (author: GitKraken)

---

### 4. 🌐 Live Server — Local Development Server

**What it does:** Opens a local server that auto-refreshes when you save

**Why you need it:**
- See HTML/CSS changes instantly
- No more manually refreshing browser
- Great for learning web development

**Install:** Search "Live Server" (author: Ritwick Dey)

**How to use:**
\`\`\`
1. Create an HTML file
2. Right-click in the editor
3. Select "Open with Live Server"
4. Browser opens with your page
5. Make changes → Save → Browser auto-refreshes!
\`\`\`

---

### 5. 🏷️ Auto Rename Tag

**What it does:** When you rename an HTML opening tag, it auto-renames the closing tag

**Why you need it:**
- Save time editing HTML/XML
- Prevent mismatched tags
- Essential for web developers

**Install:** Search "Auto Rename Tag" (author: Jun Han)

---

### 6. 📁 Material Icon Theme

**What it does:** Adds beautiful, colorful icons to your file explorer

**Why you need it:**
- Instantly identify file types
- Makes file navigation easier
- Just looks nicer!

**Install:** Search "Material Icon Theme" (author: Philipp Kief)

---

### 7. 💡 Error Lens

**What it does:** Shows error messages directly in your code (no need to hover)

**Why you need it:**
- See errors at a glance
- Faster debugging
- Great for beginners

**Install:** Search "Error Lens" (author: Alexander)

---

## ⚙️ Settings Optimization

Let's optimize VS Code for a better experience.

### How to Open Settings

- **Windows/Linux:** \`Ctrl + ,\`
- **macOS:** \`Cmd + ,\`
- Or: File → Preferences → Settings

### Recommended Settings

Click the **"Open Settings (JSON)"** icon in the top-right of Settings, then add these:

\`\`\`json
{
  // Editor Settings
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "editor.lineNumbers": "on",
  "editor.renderWhitespace": "selection",
  
  // Auto-save
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  
  // Theme
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  
  // Terminal
  "terminal.integrated.fontSize": 13,
  
  // Performance
  "extensions.autoUpdate": true,
  "telemetry.telemetryLevel": "off"
}
\`\`\`

### What Each Setting Does

| Setting | What It Does | Why Change It |
|---------|-------------|---------------|
| \`fontSize: 14\` | Makes text readable | Default 12 is too small |
| \`tabSize: 2\` | Spaces per tab | Industry standard |
| \`wordWrap: "on"\` | Wraps long lines | No horizontal scrolling |
| \`formatOnSave: true\` | Auto-formats on save | Always clean code |
| \`minimap.enabled: false\` | Hides code mini-map | More screen space |
| \`autoSave: "afterDelay"\` | Auto-saves after 1 second | Never lose work |

---

## 🎨 Theme and Font Setup

### Installing Custom Themes

**Popular Themes:**
1. **One Dark Pro** — Classic Atom-style dark theme
2. **Dracula Official** — Popular purple dark theme
3. **GitHub Theme** — Light and dark GitHub-style
4. **Nord** — Arctic, bluish dark theme
5. **Tokyo Night** — Clean dark theme with good contrast

**How to Install:**
1. Extensions → Search theme name
2. Install
3. File → Preferences → Color Theme
4. Select your new theme

### Better Fonts for Coding

**Recommended Fonts:**
1. **Fira Code** — Free, with programming ligatures
2. **Cascadia Code** — Microsoft's font for terminals
3. **JetBrains Mono** — Optimized for code readability

**How to Install Fonts:**
1. Download from the font's website
2. Install on your OS:
   - **Windows:** Right-click .ttf → Install
   - **macOS:** Double-click .ttf → Install Font
   - **Linux:** Copy to \`~/.local/share/fonts\`
3. Restart VS Code
4. Settings → "Font Family" → Add font name

**Enable Ligatures (fancy symbols):**
\`\`\`json
"editor.fontLigatures": true
\`\`\`

---

## ⚠️ Common Setup Mistakes

### Mistake 1: Installing Too Many Extensions

**Problem:** VS Code becomes slow and cluttered

**Solution:**
- Start with the 7 essential extensions above
- Only add more as you actually need them
- Regularly review and remove unused extensions

### Mistake 2: Not Syncing Settings

**Problem:** Lose all your settings when you switch computers

**Solution:**
- Sign in with GitHub/Microsoft account
- Enable Settings Sync: \`Ctrl/Cmd + Shift + P\` → "Settings Sync: Turn On"
- Your settings, extensions, and keybindings sync automatically

### Mistake 3: Ignoring the Terminal

**Problem:** Missing out on VS Code's integrated terminal

**Solution:**
- Press \`Ctrl/Cmd + \`\` to open terminal
- Run commands without leaving VS Code
- Much faster than switching windows

### Mistake 4: Using Default Light Theme on Dark Mode

**Problem:** Bright theme hurts your eyes at night

**Solution:**
- Install a dark theme (One Dark Pro, Dracula)
- VS Code doesn't auto-switch with OS — set it manually

### Mistake 5: Not Configuring Auto-Save

**Problem:** Losing work when VS Code crashes

**Solution:**
- Enable \`files.autoSave: "afterDelay"\`
- Or \`"onWindowChange"\` to save when switching windows
- Or \`"onFocusChange"\` to save when switching files

---

## 🎯 Setup Checklist

Before moving on, verify:

- [ ] VS Code installed and opens correctly
- [ ] At least 5 extensions installed
- [ ] Theme changed from default
- [ ] Auto-save enabled
- [ ] Format on save enabled
- [ ] Integrated terminal working (\`Ctrl/Cmd + \`\`)
- [ ] Settings Sync enabled (optional)

---

**→ Proceed to Lesson 4: Your First Project**`
      },
      {
        title: 'Your First Project',
        content: `## 📝 Creating Your First HTML File

Now let's create an actual project! We'll make a simple webpage from scratch.

### Step 1: Create a Project Folder

First, we need a place to store our files.

**Windows:**
\`\`\`
1. Open File Explorer
2. Navigate to Documents
3. Right-click → New → Folder
4. Name it "my-first-website"
\`\`\`

**macOS:**
\`\`\`
1. Open Finder
2. Go to Documents
3. Right-click → New Folder
4. Name it "my-first-website"
\`\`\`

**Linux:**
\`\`\`bash
mkdir ~/Documents/my-first-website
\`\`\`

### Step 2: Open the Folder in VS Code

**Method 1: From VS Code**
\`\`\`
1. Open VS Code
2. File → Open Folder
3. Navigate to "my-first-website"
4. Click "Select Folder"
\`\`\`

**Method 2: Right-Click (Windows)**
\`\`\`
1. Navigate to the folder in File Explorer
2. Right-click the folder
3. Select "Open with Code"
\`\`\`

**Method 3: Terminal**
\`\`\`bash
cd ~/Documents/my-first-website
code .
\`\`\`

**What You'll See:**
- Empty file explorer on the left
- Welcome tab in the center
- Your folder name in the title bar

### Step 3: Create Your First HTML File

1. **Create New File:**
   - Click the **"New File"** icon (page with +) in the file explorer
   - Or: File → New File (\`Ctrl/Cmd + N\`)
   - Or: Right-click empty space → New File

2. **Name the File:**
   - Type: \`index.html\`
   - Press Enter

3. **VS Code Recognizes HTML:**
   - Look at the bottom-right corner
   - You should see "HTML" (VS Code detected the file type)
   - The syntax highlighter is now active

### Step 4: Write the HTML

**Type this exactly** (or copy-paste):

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Website</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first webpage created with VS Code.</p>
    <p>I'm learning to code!</p>
</body>
</html>
\`\`\`

### Step 5: Use Emmet Shortcuts (Pro Tip!)

**Instead of typing all that HTML manually:**

1. Delete everything in the file
2. Type just: \`!\` (an exclamation mark)
3. Press **Tab** or **Enter**

VS Code automatically generates the entire HTML structure! This is called **Emmet**.

Then add your content between \`<body>\` and \`</body>\`:
\`\`\`html
<h1>Hello, World!</h1>
<p>This is my first webpage.</p>
\`\`\`

### Step 6: Save the File

- Press \`Ctrl/Cmd + S\`
- Or: File → Save
- Or: File → Save All (\`Ctrl/Cmd + K S\`)

**Expected Result:**
- File name in tab is no longer italic (italic = unsaved)
- If you enabled auto-save, this happens automatically

### Step 7: Preview in Browser

**Method 1: Using Live Server (Recommended)**
\`\`\`
1. Right-click anywhere in the HTML file
2. Select "Open with Live Server"
3. Your browser opens automatically
4. The page shows: "Hello, World!"
\`\`\`

**Method 2: Manual Open**
\`\`\`
1. Press Ctrl/Cmd + S to save
2. Go to your folder in File Explorer/Finder
3. Double-click index.html
4. It opens in your default browser
\`\`\`

### What You Should See

Your browser should show:
- **Large text:** "Hello, World!"
- **Normal text:** "This is my first webpage created with VS Code."
- **Normal text:** "I'm learning to code!"

---

## 🎨 Adding CSS Styling

Let's make it look better!

### Step 1: Create a CSS File

1. Click **New File** icon
2. Name it: \`styles.css\`
3. Add this code:

\`\`\`css
body {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
}

p {
    color: #666;
    line-height: 1.6;
}
\`\`\`

### Step 2: Link CSS to HTML

Go back to \`index.html\` and add this line inside \`<head>\`:

\`\`\`html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Website</title>
    <link rel="stylesheet" href="styles.css">  <!-- Add this line -->
</head>
\`\`\`

### Step 3: Save and Preview

1. Save both files (\`Ctrl/Cmd + S\`)
2. If using Live Server, browser auto-refreshes
3. If not, refresh the browser manually

**Expected Result:**
- Gray background
- Styled heading with border
- Better-looking paragraph text

---

## 💪 Exercise: Add More Content

**Your challenge:** Add the following to your webpage:

1. **Add an image:**
\`\`\`html
<img src="https://picsum.photos/400/200" alt="Random image">
\`\`\`

2. **Add a link:**
\`\`\`html
<a href="https://code.visualstudio.com">Visit VS Code Website</a>
\`\`\`

3. **Add a list:**
\`\`\`html
<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>
\`\`\`

4. **Style the link:**
Add to \`styles.css\`:
\`\`\`css
a {
    color: #0066cc;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
\`\`\`

---

## 🎯 What You've Accomplished

By completing this lesson, you have:

- ✅ Created a project folder
- ✅ Opened a folder in VS Code
- ✅ Created HTML and CSS files
- ✅ Used Emmet shortcuts
- ✅ Linked CSS to HTML
- ✅ Previewed your work in a browser
- ✅ Made changes and seen them live

---

## 📁 Your Project Structure

Your folder should now look like this:

\`\`\`
my-first-website/
├── index.html
└── styles.css
\`\`\`

This is the foundation of every website!

---

**→ Proceed to Lesson 5: Pro Tips & Troubleshooting**`
      },
      {
        title: 'Pro Tips & Troubleshooting',
        content: `## ⌨️ Keyboard Shortcuts Cheat Sheet

Master these shortcuts to become a VS Code power user!

### Most Essential (Memorize These!)

| Action | Windows/Linux | macOS | What It Does |
|--------|--------------|-------|--------------|
| **Command Palette** | \`Ctrl + Shift + P\` | \`Cmd + Shift + P\` | Access every VS Code command |
| **Quick Open File** | \`Ctrl + P\` | \`Cmd + P\` | Open any file by name |
| **Toggle Terminal** | \`Ctrl + \`\` | \`Ctrl + \`\` | Show/hide terminal |
| **Save File** | \`Ctrl + S\` | \`Cmd + S\` | Save current file |
| **Save All** | \`Ctrl + K S\` | \`Cmd + K S\` | Save all open files |
| **Undo** | \`Ctrl + Z\` | \`Cmd + Z\` | Undo last action |
| **Redo** | \`Ctrl + Y\` | \`Cmd + Shift + Z\` | Redo last undone action |
| **Find** | \`Ctrl + F\` | \`Cmd + F\` | Find in current file |
| **Global Search** | \`Ctrl + Shift + F\` | \`Cmd + Shift + F\` | Search entire project |

### Editing Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Cut line | \`Ctrl + X\` | \`Cmd + X\` |
| Copy line | \`Ctrl + C\` | \`Cmd + C\` |
| Move line up | \`Alt + ↑\` | \`Opt + ↑\` |
| Move line down | \`Alt + ↓\` | \`Opt + ↓\` |
| Duplicate line | \`Shift + Alt + ↓\` | \`Opt + Shift + ↓\` |
| Delete line | \`Ctrl + Shift + K\` | \`Cmd + Shift + K\` |
| Comment line | \`Ctrl + /\` | \`Cmd + /\` |
| Select all | \`Ctrl + A\` | \`Cmd + A\` |
| Select word | \`Ctrl + D\` | \`Cmd + D\` |

### Navigation Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Go to line | \`Ctrl + G\` | \`Ctrl + G\` |
| Go to definition | \`F12\` | \`F12\` |
| Go back | \`Alt + ←\` | \`Ctrl + -\` |
| Go forward | \`Alt + →\` | \`Ctrl + Shift + -\` |
| Next editor | \`Ctrl + Tab\` | \`Ctrl + Tab\` |
| Close editor | \`Ctrl + W\` | \`Cmd + W\` |
| Split editor | \`Ctrl + \\\` | \`Cmd + \\\` |

### Multi-Cursor Editing

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Add cursor above | \`Ctrl + Alt + ↑\` | \`Cmd + Opt + ↑\` |
| Add cursor below | \`Ctrl + Alt + ↓\` | \`Cmd + Opt + ↓\` |
| Select all occurrences | \`Ctrl + Shift + L\` | \`Cmd + Shift + L\` |
| Add next occurrence | \`Ctrl + D\` | \`Cmd + D\` |

---

## ⚡ Performance Tips

### 1. Disable Unnecessary Extensions

**Problem:** Too many extensions slow down VS Code

**Solution:**
\`\`\`
1. Press Ctrl/Cmd + Shift + X
2. Click "Installed" filter
3. Review each extension
4. Disable or uninstall unused ones
\`\`\`

### 2. Exclude Large Folders from Search

**Problem:** Search takes forever because it scans \`node_modules\`

**Solution:** Add to settings.json:
\`\`\`json
"search.exclude": {
  "**/node_modules": true,
  "**/bower_components": true,
  "**/*.code-search": true,
  "**/dist": true,
  "**/build": true
}
\`\`\`

### 3. Limit Files Shown in Explorer

**Problem:** File explorer is slow with thousands of files

**Solution:**
\`\`\`json
"files.exclude": {
  "**/.git": true,
  "**/.svn": true,
  "**/.hg": true,
  "**/CVS": true,
  "**/.DS_Store": true,
  "**/node_modules": true
}
\`\`\`

### 4. Increase Max Memory (Large Projects)

**Problem:** VS Code runs out of memory

**Solution:**
1. Press \`Ctrl/Cmd + Shift + P\`
2. Type: \`Preferences: Configure Runtime Arguments\`
3. Add:
\`\`\`json
{
  "memory.max": 8192
}
\`\`\`

### 5. Disable GPU Acceleration (If Glitchy)

**Problem:** VS Code has graphical glitches

**Solution:**
\`\`\`json
"window.titleBarStyle": "custom",
"window.nativeTabs": false,
"window.nativeFullScreen": false
\`\`\`

Or launch with: \`code --disable-gpu\`

---

## 🚨 Common Errors & Exact Solutions

### Error 1: "The terminal process failed to launch"

**Full Error:**
> The terminal process failed to launch: Path to shell executable "cmd.exe" does not exist.

**Cause:** Terminal settings are corrupted or incorrect

**Solution:**
\`\`\`
1. Press Ctrl/Cmd + Shift + P
2. Type: "Terminal: Select Default Profile"
3. Choose your shell:
   - Windows: Command Prompt or PowerShell
   - macOS: bash or zsh
   - Linux: bash
\`\`\`

---

### Error 2: "Extension 'XXX' is not compatible with this version of VS Code"

**Cause:** Extension requires a newer VS Code version

**Solution:**
\`\`\`
1. Check your VS Code version: Help → About
2. Update VS Code: 
   - Windows/Linux: Help → Check for Updates
   - macOS: Code → Check for Updates
3. Restart VS Code
4. Try installing the extension again
\`\`\`

---

### Error 3: "Unable to write into user settings"

**Full Error:**
> Unable to write into user settings because the file denies write permissions.

**Cause:** Settings file is read-only or owned by another user

**Solution (Windows):**
\`\`\`
1. Navigate to: %APPDATA%\\Code\\User
2. Right-click settings.json → Properties
3. Uncheck "Read-only"
4. Click OK
\`\`\`

**Solution (macOS/Linux):**
\`\`\`bash
# Fix permissions
chmod 644 ~/.config/Code/User/settings.json
# Or take ownership
sudo chown $USER ~/.config/Code/User/settings.json
\`\`\`

---

### Error 4: "Git not found. Install it or configure it using the 'git.path' setting"

**Cause:** Git is not installed or not in PATH

**Solution:**

**Step 1: Install Git**
- **Windows:** Download from [git-scm.com](https://git-scm.com)
- **macOS:** \`brew install git\` or Xcode Command Line Tools
- **Linux:** \`sudo apt install git\` (Ubuntu/Debian)

**Step 2: Configure Git Path (if still not found)**
\`\`\`json
// In settings.json
"git.path": "/usr/bin/git"  // macOS/Linux
"git.path": "C:\\\\Program Files\\\\Git\\\\bin\\\\git.exe"  // Windows
\`\`\`

---

### Error 5: "SFTP: Cannot connect to remote host"

**Cause:** SSH connection issues with remote server

**Solution:**
\`\`\`
1. Test SSH manually in terminal:
   ssh user@hostname

2. If that works, check VS Code settings:
   - Ensure Remote-SSH extension is installed
   - Check ~/.ssh/config for correct host config

3. If SSH doesn't work:
   - Check your internet connection
   - Verify host address and credentials
   - Check firewall settings
\`\`\`

---

### Error 6: "Cannot edit in read-only editor"

**Cause:** File is from a compiled extension, or opened from a protected location

**Solution:**
\`\`\`
1. Check if file is in node_modules or similar generated folder
2. If editing a library file, edit your local version instead
3. Check file permissions:
   - Right-click file → Properties (Windows)
   - Right-click file → Get Info (macOS)
\`\`\`

---

### Error 7: "Python extension loading..."

**Cause:** Python extension is slow to load or stuck

**Solution:**
\`\`\`
1. Press Ctrl/Cmd + Shift + P
2. Type: "Developer: Reload Window"
3. If still stuck:
   - Uninstall Python extension
   - Restart VS Code
   - Reinstall Python extension
4. Ensure Python is installed and in PATH
\`\`\`

---

### Error 8: "ENOENT: no such file or directory, open '...'"

**Cause:** File or folder was deleted or moved externally

**Solution:**
\`\`\`
1. Check if file exists in file explorer
2. If deleted, restore from:
   - Git: Right-click → "Open Changes" to see deleted content
   - Recycle bin/Trash
3. Close and reopen the folder in VS Code
\`\`\`

---

### Error 9: "Code helper wants to use your confidential information"

**macOS only**

**Cause:** VS Code trying to access keychain for Git credentials

**Solution:**
\`\`\`
1. Click "Always Allow" when prompted
2. Or disable Git credential helper:
   "git.enableSmartCommit": false
3. Or use SSH keys instead of HTTPS for Git
\`\`\`

---

### Error 10: "Out of memory" or VS Code freezes

**Cause:** Too many files, extensions, or memory-intensive operations

**Solution:**
\`\`\`
1. Close unnecessary tabs and windows
2. Press Ctrl/Cmd + Shift + P → "Developer: Reload Window"
3. If frozen, force quit and restart:
   - Windows: Task Manager → End Task
   - macOS: Cmd + Opt + Esc → Force Quit
   - Linux: killall code

4. Prevent future issues:
   - Limit files.watch exclusions
   - Disable heavy extensions
   - Increase max memory setting
\`\`\`

---

## 📚 Where to Get Help

### Official Resources

1. **VS Code Documentation**
   - [code.visualstudio.com/docs](https://code.visualstudio.com/docs)
   - Official guides for everything

2. **VS Code Tips & Tricks**
   - [code.visualstudio.com/docs/getstarted/tips-and-tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
   - Built-in tips feature

3. **Keyboard Shortcuts Reference**
   - \`Ctrl/Cmd + K\` then \`Ctrl/Cmd + R\`
   - Or: Help → Keyboard Shortcut Reference

### Community Help

1. **Stack Overflow**
   - Tag: \`[visual-studio-code]\`
   - [stackoverflow.com/questions/tagged/visual-studio-code](https://stackoverflow.com/questions/tagged/visual-studio-code)

2. **VS Code GitHub Issues**
   - [github.com/microsoft/vscode/issues](https://github.com/microsoft/vscode/issues)
   - Search for your error before creating new issue

3. **Reddit**
   - [r/vscode](https://reddit.com/r/vscode)
   - Community Q&A

4. **Discord**
   - VS Code Community Discord
   - Real-time help from other users

### Quick Help in VS Code

1. **Command Palette:** \`Ctrl/Cmd + Shift + P\` → Type what you need
2. **Help Menu:** Help → Documentation, Intro Videos, Tips
3. **Output Panel:** View → Output (see extension logs)
4. **Problems Panel:** View → Problems (see errors/warnings)

---

## 🎉 Congratulations!

You've completed the **Setting Up VS Code** guide!

**What You've Learned:**
- ✅ What VS Code is and why it's essential
- ✅ How to install VS Code on any operating system
- ✅ Essential extensions every developer needs
- ✅ How to create and save your first project
- ✅ Keyboard shortcuts to boost productivity
- ✅ How to troubleshoot common errors

**Next Steps:**
- Practice using VS Code daily
- Explore more extensions as you need them
- Try the other guides: Cursor, Windsurf, GitHub
- Build your next project!

**Happy Coding!** 🚀`
      },
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
      { title: 'Best Practices', content: '## Tips for Using Claude\n\n### 1. Be Specific\n❌ "Help me write something"\n✅ "Help me write a 500-word blog post about sustainable fashion for millennials"\n\n### 2. Provide Context\n"Here\'s my resume. I\'m applying for a product manager role. Suggest improvements."\n\n### 3. Use Iteration\nStart broad, then refine:\n- "Make it more professional"\n- "Add more examples"\n- "Shorten it by 50%"\n\n### 4. Leverage Artifacts\nWhen you need code, documents, or diagrams, ask Claude to create them as artifacts.\n\n**→ Proceed to Lesson 5: Connect to Telegram**' },
      { title: 'Connect Claude to Telegram', content: `## 📱 Deploy Claude as a Telegram Bot

Access Claude from your phone via Telegram!

## Why Telegram + Claude?

- **Mobile access** - Chat with Claude anywhere
- **Long documents on the go** - Upload PDFs from your phone
- **Share with team** - Colleagues can use your Claude bot
- **24/7 available** - Runs on your server

## Step 1: Create Telegram Bot

### Open BotFather

1. Open Telegram
2. Search **@BotFather**
3. Send: \`/newbot\`
4. Name your bot (e.g., "My Claude Bot")
5. Choose username ending in \`bot\`

### Save Your Token

BotFather gives you:
\`\`\`
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
\`\`\`

## Step 2: Deploy Claude Bot

### Option A: Use OpenClaw (Recommended)

OpenClaw supports Claude API + Telegram out of the box. See the OpenClaw guide for setup.

### Option B: Build Custom Bot

Use Anthropic's Claude API:

\`\`\`python
import anthropic
from telegram import Update
from telegram.ext import Application, MessageHandler, filters

client = anthropic.Anthropic(api_key="YOUR_CLAUDE_KEY")

async def chat(update: Update, context):
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{"role": "user", "content": update.message.text}]
    )
    await update.message.reply_text(message.content[0].text)

app = Application.builder().token("YOUR_BOT_TOKEN").build()
app.add_handler(MessageHandler(filters.TEXT, chat))
app.run_polling()
\`\`\`

### Option C: Use Bot Platforms

- **Dante AI** - Claude-powered Telegram bots
- **CustomGPT** - Deploy Claude to messaging platforms

## Tips

- Claude excels at long conversations — perfect for Telegram
- Set up command handlers for \`/start\`, \`/help\`, \`/clear\`
- Consider rate limiting if sharing with many users

## 🎉 Congratulations!

You now know how to use Claude AND deploy it to Telegram!` },
    ]
  },
  'guide-gemini': {
    title: 'Google Gemini Essentials',
    description: 'Master Google\'s multimodal AI assistant.',
    topic: 'AI Tools',
    lessons: [
      {
        title: 'What is Gemini?',
        content: `## 🎯 What You'll Learn

By the end of this guide, you will:

- ✅ Understand what Gemini is and which version to use
- ✅ Set up Gemini on web and mobile
- ✅ Use multimodal features (images, documents, code)
- ✅ Master effective prompting techniques
- ✅ Troubleshoot common issues

**⏱️ Time to complete:** ~45 minutes

---

## What is Google Gemini?

**Gemini** is Google's most advanced AI model family, designed to be multimodal from the ground up. This means it can understand and work with text, images, audio, video, and code — all in the same conversation.

Think of Gemini as your AI assistant that can:
- See and understand images (like showing it a photo of a plant and asking what it is)
- Read documents and answer questions about them
- Write, debug, and explain code
- Search the web for real-time information
- Connect to Google services (Maps, YouTube, Flights, etc.)

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **A Google account** (Gmail or Google Workspace)
- [ ] **Web browser** (Chrome, Firefox, Safari, or Edge)
- [ ] **Internet connection**
- [ ] **Optional:** Mobile device for Gemini mobile app

---

## Gemini Model Versions Explained

Google offers different Gemini models for different needs:

| Model | Best For | Speed | Capability |
|-------|----------|-------|------------|
| **Gemini Flash** | Quick tasks, everyday use | ⚡ Fastest | Good |
| **Gemini Pro** | Complex reasoning, coding | 🏃 Fast | Excellent |
| **Gemini Ultra** | Most difficult tasks | 🐢 Slower | Best |

**Which should you use?**
- **Free tier:** Uses Gemini Pro (plenty powerful for most tasks)
- **Advanced ($20/mo):** Access to Ultra + longer context + more features

---

## Gemini vs Other AI Assistants

| Feature | Gemini Free | Gemini Advanced | ChatGPT Free | ChatGPT Plus |
|---------|-------------|-----------------|--------------|--------------|
| **Price** | $0 | $20/mo | $0 | $20/mo |
| **Model** | Gemini Pro | Gemini Ultra | GPT-3.5/4o-mini | GPT-4/4o |
| **Multimodal** | ✅ Images, files | ✅ Images, files, video | ❌ Text only | ✅ Images |
| **Web Search** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Google Integration** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Context Length** | 32K tokens | 1M tokens | 8K tokens | 128K tokens |
| **File Uploads** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |

**When to choose Gemini:**
- ✅ You use Google services (Docs, Drive, Maps)
- ✅ You need real-time information
- ✅ You want multimodal capabilities for free
- ✅ You work with long documents

---

## Real-World Use Cases

**For Students:**
- "Explain quantum physics like I'm 15"
- Upload a photo of homework → Get step-by-step help
- "Summarize this 50-page PDF"

**For Professionals:**
- "Draft an email declining a meeting politely"
- Upload a chart → "What trends do you see?"
- "Compare these two contracts and highlight differences"

**For Developers:**
- "Debug this Python error: [paste error]"
- "Explain this React code line by line"
- "Write unit tests for this function"

**For Creatives:**
- "Generate 10 blog post ideas about sustainable fashion"
- "Rewrite this paragraph to be more engaging"
- Upload an image → "Describe this in vivid detail"

---

**→ Proceed to Lesson 2: Access & Setup**`
      },
      {
        title: 'Access & Setup',
        content: `## 🌐 Three Ways to Access Gemini

### Method 1: Gemini Website (Recommended for Beginners)

**URL:** [gemini.google.com](https://gemini.google.com)

**Steps:**

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)

2. **Navigate to gemini.google.com**

3. **Sign in with your Google account:**
   - Click "Sign in" in the top-right corner
   - Enter your Gmail address or Google Workspace email
   - Enter your password
   - Complete 2-factor authentication if enabled

4. **Accept terms of service:**
   - Review Google's AI terms
   - Click "I agree" or "Accept"

5. **You're in!** You'll see a clean chat interface

**📸 Screenshot Description:**
The Gemini interface has:
- A text input box at the bottom
- A paperclip icon (📎) for file uploads
- A microphone icon (🎤) for voice input
- A chat history panel on the left
- Your profile icon in the top-right

---

### Method 2: Google AI Studio (For Developers)

**URL:** [aistudio.google.com](https://aistudio.google.com)

Google AI Studio is a free, browser-based IDE for experimenting with Gemini.

**When to use AI Studio:**
- Testing prompts before using in production
- Developing applications with Gemini API
- Fine-tuning model parameters
- Comparing different model versions

**Setup Steps:**

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Click "Create API key"
5. Copy your API key (save it securely!)

**📸 Screenshot Description:**
AI Studio has:
- A prompt input area
- Model selection dropdown (Flash, Pro)
- Temperature and token sliders
- "Run" button to test
- "Get code" button to export

---

### Method 3: Mobile App

**iOS:** Download "Google Gemini" from App Store
**Android:** Download "Google Gemini" from Play Store

**Setup Steps:**

1. Download the app from your device's app store
2. Open the app
3. Sign in with your Google account
4. Grant necessary permissions (microphone for voice, camera for images)
5. Start chatting!

**Mobile-Specific Features:**
- 📸 Take photos directly in the app
- 🎤 Voice input (tap and hold microphone)
- 📱 Upload images from camera roll
- 🗣️ Hands-free conversations

---

## Upgrading to Gemini Advanced ($20/month)

**What You Get:**

| Feature | Free | Advanced |
|---------|------|----------|
| Model | Gemini Pro | Gemini Ultra |
| Context | 32K tokens | 1M tokens |
| File uploads | Limited | Unlimited |
| Priority access | Standard | Priority |
| Google Workspace | Basic | Deep integration |
| Image generation | ❌ No | ✅ Yes |

**How to Upgrade:**

1. Go to [gemini.google.com](https://gemini.google.com)
2. Click "Try Gemini Advanced" or "Upgrade" in the left sidebar
3. Click "Start trial" (often 1-2 months free)
4. Enter payment method
5. Confirm subscription

**Is it worth it?**
- **Yes** if: You use Gemini daily, work with long documents, need best-in-class performance
- **No** if: You're casually exploring, Gemini Pro meets your needs

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Create Google account | 5 minutes |
| Sign in to Gemini | 1 minute |
| First conversation | 2 minutes |
| Explore features | 10 minutes |
| **Total** | **~20 minutes** |

---

## ✅ Setup Verification

Before moving on, verify:

- [ ] You can access gemini.google.com
- [ ] You've sent your first message
- [ ] You can see the file upload button (paperclip icon)
- [ ] You can access chat history in the left sidebar
- [ ] Optional: You have the mobile app installed

---

**→ Proceed to Lesson 3: Effective Prompting**`
      },
      {
        title: 'Effective Prompting',
        content: `## 🎯 The Perfect Prompt Formula

Every great Gemini prompt has these elements:

\`\`\`
[Context] + [Specific Task] + [Format/Constraints] + [Examples if complex]
\`\`\`

---

## Text Prompting Examples

### ❌ Bad Prompt:
\`"Help me with my resume"\`

### ✅ Good Prompt:
\`"I'm a software engineer with 3 years of experience applying for senior roles at tech companies. 

Please review my resume and suggest improvements for:
1. Making achievements more quantifiable (I struggle with this)
2. Highlighting leadership experience
3. ATS optimization for tech companies

Here's my resume: [paste resume]"\`

**Why it's better:**
- Provides context (role, experience level, target)
- Specific areas to improve
- Clear deliverables

---

## 📸 Image Prompting Examples

### Example 1: Object Identification

**Prompt:**
\`"What plant is this? Also tell me how to care for it."\`

**Expected Output:**
Gemini identifies the plant species and provides care instructions (watering, sunlight, soil).

### Example 2: Chart Analysis

**Prompt:**
\`"Analyze this sales chart. What trends do you see? What would you recommend we focus on next quarter?"\`

**Expected Output:**
- Trend identification (growth, decline, seasonality)
- Data insights
- Actionable recommendations

### Example 3: Text Extraction (OCR)

**Prompt:**
\`"Extract all the text from this receipt and organize it as a table with: Item, Quantity, Price"\`

**Expected Output:**
A formatted table with all receipt items.

### Example 4: Problem Solving

**Prompt:**
\`"I'm getting this error message on my computer [screenshot]. What does it mean and how do I fix it?"\`

**Expected Output:**
Error explanation + step-by-step solution.

---

## 💻 Code Prompting Examples

### Example 1: Write Code

**Prompt:**
\`"Write a Python function that calculates the factorial of a number. Include error handling for negative numbers and examples of how to use it."\`

**Expected Output:**
\`\`\`python
def factorial(n):
    """Calculate factorial of n.
    
    Args:
        n: Non-negative integer
        
    Returns:
        Factorial of n
        
    Raises:
        ValueError: If n is negative
    """
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Examples
print(factorial(5))  # Output: 120
print(factorial(0))  # Output: 1
\`\`\`

### Example 2: Debug Code

**Prompt:**
\`"This Python code is giving me an error. What's wrong and how do I fix it?

\`\`\`python
numbers = [1, 2, 3, 4, 5]
for i in range(len(numbers)):
    print(numbers[i+1])
\`\`\`

Error: IndexError: list index out of range"\`

**Expected Output:**
Explanation of off-by-one error + corrected code.

### Example 3: Explain Code

**Prompt:**
\`"Explain this JavaScript code line by line. I'm a beginner.

\`\`\`javascript
const doubled = numbers.map(n => n * 2).filter(n => n > 5);
\`\`\`"\`

**Expected Output:**
Line-by-line explanation with examples.

---

## 📄 Document Prompting Examples

### Example 1: Summarization

**Prompt:**
\`"Summarize this 20-page PDF in 3 paragraphs. Focus on the key findings and recommendations."\`

**Expected Output:**
3-paragraph summary with main points.

### Example 2: Extract Information

**Prompt:**
\`"From this contract, extract all the key dates and deadlines. Format as a table: Event, Date, Description"\`

**Expected Output:**
Table with all dates and deadlines.

### Example 3: Compare Documents

**Prompt:**
\`"Compare these two versions of the contract. What changed between version 1 and version 2?"\`

**Expected Output:**
Side-by-side comparison of changes.

---

## 🧠 Reasoning Prompts

### Chain-of-Thought Prompting

For complex problems, ask Gemini to "think step by step":

**Prompt:**
\`"If I have 150 apples and I give 1/3 to my friend, then lose 15% of the remaining apples, how many do I have left? Think step by step."\`

**Expected Output:**
\`\`\`
Step 1: Start with 150 apples
Step 2: Give away 1/3: 150 ÷ 3 = 50 apples given away
Step 3: Remaining: 150 - 50 = 100 apples
Step 4: Lose 15%: 100 × 0.15 = 15 apples lost
Step 5: Final count: 100 - 15 = 85 apples

Answer: 85 apples
\`\`\`

---

## 🎯 Practical Exercises

**Exercise 1: Basic Chat (2 minutes)**
Ask Gemini to explain a concept you've always been curious about.

**Exercise 2: Image Upload (3 minutes)**
Upload a photo and ask 3 different questions about it.

**Exercise 3: Code Generation (5 minutes)**
Ask Gemini to write a function, then ask it to improve the code.

**Exercise 4: Document Summary (5 minutes)**
Upload a PDF and ask for a summary in 5 bullet points.

---

**→ Proceed to Lesson 4: Advanced Features**`
      },
      {
        title: 'Advanced Features',
        content: `## 🚀 Multimodal Capabilities

Gemini's superpower is handling multiple types of input in the same conversation.

### Image + Text Combination

**Example:**
1. Upload an image of a recipe
2. Ask: "What ingredients do I need? Can you create a shopping list?"
3. Follow up: "I'm missing olive oil. What can I substitute?"
4. Continue: "Double the recipe for 8 people"

---

### Document Analysis Workflows

**Workflow 1: Research Paper Analysis**

Upload a PDF → Ask:
\`\`\`
1. "What's the main hypothesis?"
2. "Summarize the methodology in 3 sentences"
3. "What are the key findings?"
4. "What are the limitations mentioned?"
5. "Compare this to [another paper you uploaded]"
\`\`\`

**Workflow 2: Contract Review**

Upload a contract → Ask:
\`\`\`
1. "What are my obligations as the tenant?"
2. "List all the dates and deadlines"
3. "Are there any red flags or unusual clauses?"
4. "What happens if I need to break the lease early?"
\`\`\`

---

## 📎 File Uploads

### Supported File Types

| Type | Formats | Max Size |
|------|---------|----------|
| **Documents** | PDF, DOCX, TXT, RTF | 50 MB |
| **Images** | JPG, PNG, GIF, WEBP | 50 MB |
| **Code** | Any text format | 50 MB |
| **Audio** | MP3, WAV, FLAC, AAC | 50 MB (Advanced only) |
| **Video** | MP4, MOV, AVI, WEBM | 50 MB (Advanced only) |

### How to Upload Files

1. Click the **paperclip icon (📎)** in the chat input
2. Select "Upload file" or drag & drop
3. Choose your file
4. Wait for upload to complete
5. Ask questions about the file!

**📸 Screenshot Description:**
After uploading, you'll see the file appear above your chat input with a thumbnail preview.

---

## 🔌 Google Extensions

Gemini connects to Google services for real-time information.

### @Google Maps

**Example Prompts:**
- \`"@Google Maps Find coffee shops near Central Park NYC"\`
- \`"@Google Maps What's the route from Boston to New York?"\`
- \`"@Google Maps Show me restaurants open now in downtown Chicago"\`

### @YouTube

**Example Prompts:**
- \`"@YouTube Find tutorials on Python for beginners"\`
- \`"@YouTube What are the latest videos about AI?"\`
- \`"@YouTube Summarize this video: [YouTube URL]"\`

### @Google Flights

**Example Prompts:**
- \`"@Google Flights Find cheap flights from LA to Tokyo in March"\`
- \`"@Google Flights What's the best time to fly to Europe?"\`

### @Google Hotels

**Example Prompts:**
- \`"@Google Hotels Find hotels in Paris under $200/night"\`
- \`"@Google Hotels What are the best-rated hotels in Barcelona?"\`

### @Google Workspace

**Example Prompts:**
- \`"Search my Google Drive for files about Q4 planning"\`
- \`"Find emails from John in Gmail about the project"\`
- \`"Create a calendar event for tomorrow at 2pm"\`

---

## 🌐 Web Search Integration

Gemini automatically searches the web for current information.

**Example 1: Current Events**
\`"What happened in the news today?"\`

**Example 2: Real-Time Data**
\`"What's the current stock price of Apple?"\`

**Example 3: Latest Information**
\`"What are the latest features in React 19?"\`

**Note:** Always verify important facts by clicking the source links Gemini provides.

---

## 📤 Export to Google Docs

After getting a response:

1. Look for the **"Export to Docs"** button (📄 icon) below Gemini's response
2. Click it
3. A Google Doc will be created with the conversation
4. The doc opens automatically for editing

**Use Cases:**
- Save research summaries
- Export drafts for further editing
- Share AI-generated content with team

---

## 🔄 Long Context Usage (Advanced)

Gemini Advanced supports **1 million tokens** of context — roughly 700,000 words or 10+ books.

**What This Means:**
- Upload multiple long documents
- Reference earlier parts of a 2-hour conversation
- Analyze entire code repositories

**Best Practices:**
- Break very long documents into sections
- Ask for summaries of large documents
- Use specific questions rather than "analyze everything"

---

## 🎯 Practical Exercises

**Exercise 1: Multimodal Chat (5 minutes)**
1. Upload an image
2. Ask a question about it
3. Follow up with a related question
4. Ask Gemini to create something based on the image

**Exercise 2: Document Analysis (10 minutes)**
1. Upload a PDF (any document)
2. Ask for a summary
3. Ask for specific information extraction
4. Ask for recommendations based on the document

**Exercise 3: Google Extensions (5 minutes)**
1. Use @Google Maps to find somewhere
2. Use @YouTube to find a video
3. Ask Gemini to combine the information

---

**→ Proceed to Lesson 5: Pro Tips & Troubleshooting**`
      },
      {
        title: 'Pro Tips & Troubleshooting',
        content: `## ⚡ Pro Tips

### 1. Use Conversation Memory

Gemini remembers your conversation. Build on previous responses:

\`\`\`
You: "Write a blog post about AI"
Gemini: [Writes blog post]
You: "Make it shorter"
Gemini: [Shortens the same post]
You: "Add more examples"
Gemini: [Adds examples to the shortened version]
\`\`\`

### 2. Specify Output Format

Always tell Gemini how you want the answer formatted:

\`\`\`
"Format as a table"
"Use bullet points"
"Give me JSON format"
"Write in markdown"
"Number each step"
\`\`\`

### 3. Ask for Sources

\`"What are your sources for this information?"\`

Gemini will provide links to verify claims.

### 4. Iterate and Refine

Don't accept the first response. Keep refining:

\`\`\`
"Make it more professional"
"Add more technical detail"
"Explain it simpler"
"Give me 3 alternative approaches"
\`\`\`

### 5. Use Voice Input on Mobile

On the mobile app, tap and hold the microphone for voice input. Great for:
- Dictating long prompts
- Hands-free use
- Conversational tone

### 6. Leverage Extensions Smartly

Combine extensions in one prompt:

\`"Use @Google Maps to find Italian restaurants near me, then use @YouTube to find reviews of them"\`

---

## 🚨 Troubleshooting Common Issues

### Error 1: "Something went wrong" or Generic Error

**Symptoms:**
- Red error banner appears
- Message doesn't send
- "Try again later" message

**Solutions:**
\`\`\`
1. Refresh the page (F5 or Cmd/Ctrl + R)
2. Clear browser cache:
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
3. Try incognito/private mode
4. Disable browser extensions temporarily
5. Try a different browser
6. Check Google Workspace Status: google.com/appsstatus
\`\`\`

---

### Error 2: "File upload failed"

**Symptoms:**
- Upload bar stuck at 0%
- "Upload failed" error
- File doesn't appear in chat

**Solutions:**
\`\`\`
1. Check file size (max 50 MB)
2. Check file format (PDF, DOCX, JPG, PNG, etc.)
3. Reduce file size:
   - Images: Use TinyPNG or Squoosh
   - PDFs: Use Adobe online compressor
4. Check your internet connection
5. Try a different file
6. Refresh and try again
\`\`\`

---

### Error 3: "Response stopped" or Incomplete Response

**Symptoms:**
- Response cuts off mid-sentence
- "Continue" button doesn't work
- Incomplete code blocks

**Solutions:**
\`\`\`
1. Type "Continue" or "Please continue"
2. Ask for the response in smaller chunks:
   "Break this into parts. Give me part 1 first."
3. Simplify your request
4. Start a new conversation
\`\`\`

---

### Error 4: "Can't access Google Workspace"

**Symptoms:**
- Extensions don't work
- "Permission denied" errors
- Can't search Drive or Gmail

**Solutions:**
\`\`\`
1. Check your Google Workspace settings:
   - Admin may have disabled AI features
   - Contact your IT administrator
2. For personal accounts:
   - Go to myaccount.google.com
   - Check "Data & privacy" → "Workspace extensions"
   - Ensure Gemini has access
3. Disconnect and reconnect:
   - Settings → Workspace → Disconnect
   - Reconnect and grant permissions
\`\`\`

---

### Error 5: Gemini Hallucinating (Giving Wrong Information)

**Symptoms:**
- Confident but incorrect answers
- Made-up facts or sources
- Inconsistent information

**Solutions:**
\`\`\`
1. Always verify important information:
   - Click source links
   - Cross-reference with reliable sources
2. Ask Gemini to show sources:
   "What are your sources for this?"
3. Be more specific in your prompt:
   ❌ "Tell me about the history of Rome"
   ✅ "Based on verified historical sources, summarize the founding of Rome"
4. For critical information, ask Gemini to "verify before answering"
\`\`\`

---

### Error 6: "Rate limit exceeded" or "Try again later"

**Symptoms:**
- Blocked from sending messages
- Temporarily unavailable

**Solutions:**
\`\`\`
1. Wait a few minutes (rate limits are temporary)
2. Free tier has daily limits (roughly 50-100 messages)
3. Upgrade to Advanced for higher limits
4. Don't send rapid successive messages
\`\`\`

---

### Error 7: Extensions (@YouTube, @Maps) Not Working

**Symptoms:**
- Extension doesn't respond
- "Extension unavailable" error
- No results from extension

**Solutions:**
\`\`\`
1. Enable extensions:
   - Settings → Extensions → Toggle on
2. Check region availability:
   - Some extensions are region-locked
3. Verify account permissions:
   - Settings → Connected services
4. Try without the @ symbol first:
   - If "Find coffee shops" works, but "@Google Maps Find coffee shops" doesn't, the extension may be down
\`\`\`

---

### Error 8: "Can't sign in" or "Account not eligible"

**Symptoms:**
- Sign-in loop
- "Service not available in your region"
- "Account type not supported"

**Solutions:**
\`\`\`
1. Check region availability:
   - Gemini is available in 100+ countries
   - Full list: support.google.com/gemini
2. Use a personal Gmail account (not Workspace)
3. Check age requirement:
   - Must be 18+ in most regions
   - 13+ with parental supervision in some
4. Try a VPN if in an unsupported region
   (Note: May violate terms of service)
\`\`\`

---

### Error 9: Mobile App Crashing or Not Loading

**Symptoms:**
- App closes unexpectedly
- Blank screen
- Can't send messages

**Solutions:**
\`\`\`
1. Force close and reopen:
   - iOS: Swipe up from home
   - Android: Settings → Apps → Gemini → Force stop
2. Clear app cache:
   - Android: Settings → Apps → Gemini → Storage → Clear cache
   - iOS: Uninstall and reinstall
3. Update the app:
   - Check App Store/Play Store for updates
4. Check device compatibility:
   - Requires iOS 15+ or Android 8+
5. Reinstall the app
\`\`\`

---

### Error 10: Gemini Not Remembering Conversation

**Symptoms:**
- Gemini forgets previous messages
- No context from earlier in conversation

**Solutions:**
\`\`\`
1. Don't clear conversation:
   - Each new chat is a fresh start
   - Continue in the same thread
2. Check if conversation was archived:
   - Left sidebar → "Archived"
3. Reference earlier messages explicitly:
   "Remember earlier when I mentioned..."
4. For Advanced users, check if long context is enabled:
   - Settings → Advanced → Context length
\`\`\`

---

### Error 11: "Response contains blocked content"

**Symptoms:**
- Gemini refuses to answer
- Safety filter triggered

**Solutions:**
\`\`\`
1. Rephrase your question more neutrally
2. Gemini has safety filters for:
   - Harmful content
   - Personal identifiable information
   - Medical/legal advice (will disclaim)
3. For legitimate uses, try:
   - Being more specific about context
   - Explaining the educational/research purpose
4. Note: Some topics are permanently restricted
\`\`\`

---

### Error 12: Poor Quality Responses

**Symptoms:**
- Generic, unhelpful answers
- Responses don't address your question
- Repeated information

**Solutions:**
\`\`\`
1. Provide more context:
   ❌ "Write code for a game"
   ✅ "Write Python code for a simple Snake game using Pygame. The game should have score tracking and increasing difficulty."
2. Be specific about format:
   "Format as a numbered list"
   "Use markdown tables"
3. Give examples:
   "Here's the style I want: [example]"
4. Iterate:
   "That's too generic. Give me specific, actionable advice."
5. Try a different approach:
   "Explain this to me like I'm a beginner"
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Help Center:** [support.google.com/gemini](https://support.google.com/gemini)
- **Community Forum:** [support.google.com/gemini/community](https://support.google.com/gemini/community)
- **Status Page:** [google.com/appsstatus](https://google.com/appsstatus)

### Quick Diagnostics
\`\`\`
1. Try in incognito/private mode (rules out extension conflicts)
2. Try a different browser
3. Check Google Workspace Status Dashboard
4. Test with a simple prompt: "Hello, how are you?"
\`\`\`

---

## 🎉 Congratulations!

You've completed the **Google Gemini Essentials** guide!

**What You've Learned:**
- ✅ Understand Gemini models and capabilities
- ✅ Set up Gemini on web and mobile
- ✅ Write effective prompts for text, images, code, and documents
- ✅ Use advanced features (extensions, file uploads, long context)
- ✅ Troubleshoot common issues

**Next Steps:**
- Practice daily with Gemini
- Explore other AI tool guides
- Build Gemini into your workflow

**Happy AI-assisted productivity!** 🚀`
      }
    ]
  },
  'guide-grok': {
    title: 'Using Grok (xAI)',
    description: 'Get started with Elon Musk\'s Grok AI.',
    topic: 'Emerging AI',
    lessons: [
      {
        title: 'What is Grok?',
        content: `## 🎯 What You'll Learn

By the end of this guide, you will:

- ✅ Understand what makes Grok unique
- ✅ Set up X Premium+ and access Grok
- ✅ Use Grok for research, coding, and casual conversation
- ✅ Know when to use Grok vs other AIs
- ✅ Troubleshoot common issues

**⏱️ Time to complete:** ~30 minutes

---

## What is Grok?

**Grok** is an AI assistant created by xAI (Elon Musk's AI company). It's designed to be witty, helpful, and less constrained than other AI assistants.

Think of Grok as the AI with a personality — it's not just helpful, it's entertaining.

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **An X (Twitter) account** (can create during setup)
- [ ] **Credit card or payment method** (for X Premium+ subscription)
- [ ] **Web browser or X mobile app**
- [ ] **Internet connection**
- [ ] **18+ years old** (required for X Premium+)

---

## What Makes Grok Different?

### 1. Real-Time Information from X

Grok has access to millions of X posts in real-time. This means:

- ✅ Knows what's trending RIGHT NOW
- ✅ Understands breaking news as it happens
- ✅ Access to diverse perspectives and discussions
- ✅ Can summarize what people are saying about any topic

**Example:**
\`"What are people saying about the iPhone 16 launch?"\`

Grok will summarize real X posts, not outdated web pages.

### 2. Witty Personality

Unlike ChatGPT's neutral tone or Claude's helpful demeanor, Grok has **attitude**.

**Example Comparison:**

**ChatGPT:** "I'd be happy to help you with that request. Here's some information..."

**Grok:** "Oh, you want to know about quantum physics? Buckle up, this is going to be wild..."

### 3. Two Modes: Regular & Fun

**Regular Mode:**
- Straightforward, helpful responses
- Professional tone
- Gets the job done

**Fun Mode:**
- Sarcastic, witty, humorous
- More conversational
- Doesn't hold back on opinions

### 4. Fewer Guardrails

Grok will answer questions that other AIs might refuse:
- Controversial topics (with appropriate warnings)
- Hypothetical scenarios
- Edgy humor (within reason)
- Political discussions

**Note:** Grok still has safety limits, but they're generally looser than ChatGPT or Claude.

### 5. Image Generation (Grok 2)

Grok 2 includes **Aurora**, an image generation model integrated directly into conversations.

**Example:**
\`"Generate an image of a cyberpunk city at sunset"\`

---

## Grok vs Other AI Assistants

| Feature | Grok | ChatGPT | Claude | Gemini |
|---------|------|---------|--------|--------|
| **Price** | $16/mo (X Premium+) | Free / $20 (Plus) | Free / $20 (Pro) | Free / $20 (Advanced) |
| **Real-Time Info** | ✅ X posts | ✅ Web (Plus) | ✅ Web (Pro) | ✅ Web |
| **Personality** | 😂 Witty | 😐 Neutral | 🙂 Helpful | 😊 Friendly |
| **Guardrails** | 🟢 Loose | 🔴 Strict | 🟡 Moderate | 🟡 Moderate |
| **Image Gen** | ✅ Yes (Grok 2) | ✅ Yes (DALL-E) | ❌ No | ✅ Yes (Advanced) |
| **Document Upload** | ❌ No | ✅ Yes (Plus) | ✅ Yes | ✅ Yes |
| **Best For** | Current events, fun, edgy topics | General use, coding | Writing, analysis | Google ecosystem |

---

## When to Use Grok

**✅ Best Use Cases:**

1. **Current Events & Breaking News**
   - \`"What's the latest on the SpaceX Starship launch?"\`
   - \`"Summarize what people are saying about [trending topic]"\`

2. **Social Media Content**
   - \`"Write a funny tweet about Monday mornings"\`
   - \`"Roast this LinkedIn post: [paste post]"\`

3. **Casual Conversation**
   - \`"Explain blockchain like you're a sarcastic professor"\`
   - \`"What do you think about [controversial topic]?"\`

4. **Checking Trends**
   - \`"What memes are trending right now?"\`
   - \`"What's the discourse about [topic] on X?"\`

5. **Edgy or Controversial Topics**
   - Questions other AIs might refuse
   - Hypothetical scenarios
   - Political discussions

**❌ Not Best For:**

- Document analysis (use Claude or Gemini)
- Complex coding (use ChatGPT or Claude)
- Academic research (use Perplexity or Claude)
- Professional emails (use ChatGPT or Claude)
- Long document summarization (use Kimi or Claude)

---

## Real-World Examples

### Example 1: Current Events Research

**Prompt:**
\`"What's the consensus on X about the new AI regulation bill? Summarize different viewpoints."\`

**Expected Output:**
- Summary of X discussions
- Different perspectives (pro/con)
- Key concerns mentioned
- Influential voices

### Example 2: Fun Explanation

**Prompt:**
\`"Explain how neural networks work in Fun mode. Make it entertaining."\`

**Expected Output:**
Witty, engaging explanation with humor and personality.

### Example 3: Social Media Content

**Prompt:**
\`"Write 5 tweets about the struggles of working from home. Make them relatable and funny."\`

**Expected Output:**
5 humorous, relatable tweets ready to post.

---

**→ Proceed to Lesson 2: Access & Setup**`
      },
      {
        title: 'Access & Setup',
        content: `## 💰 The X Premium+ Requirement

**Important:** Grok is **only** available to X Premium+ subscribers ($16/month).

This guide will walk you through every step.

---

## Step 1: Create an X Account (If Needed)

**If you already have an X account, skip to Step 2.**

### Creating Your Account

1. **Go to** [x.com](https://x.com) or [twitter.com](https://twitter.com)

2. **Click "Sign up"**

3. **Choose sign-up method:**
   - Google account
   - Apple ID
   - Email address

4. **Enter required information:**
   - Name (can be a display name)
   - Email address
   - Date of birth (must be 18+)
   - Phone number (for verification)

5. **Verify your email:**
   - Check your inbox
   - Click the verification link

6. **Verify your phone:**
   - Enter the code sent via SMS

7. **Complete your profile:**
   - Add a profile picture (optional)
   - Write a bio (optional)

**📸 Screenshot Description:**
The sign-up page has fields for name, email/phone, and date of birth.

**⏱️ Time:** 5-10 minutes

---

## Step 2: Subscribe to X Premium+

### Navigating to Premium

1. **Log in to X**

2. **Click "Premium" in the left sidebar**
   - Or go directly to: [x.com/premium](https://x.com/premium)

3. **You'll see three tiers:**
   - **Basic** ($3/mo) - Ad-free, edit posts, longer posts
   - **Premium** ($8/mo) - Blue checkmark, all Basic features
   - **Premium+** ($16/mo) - All Premium features + **Grok access** ✅

### Subscribing to Premium+

1. **Click "Subscribe" under Premium+**

2. **Choose billing period:**
   - Monthly ($16/mo)
   - Annual ($168/year, save $24)

3. **Select payment method:**
   - Credit/debit card
   - Apple Pay (iOS app)
   - Google Pay (Android app)

4. **Enter payment details**

5. **Review and confirm**

6. **Complete verification (if required):**
   - X may ask for ID verification
   - This is to prevent impersonation

**📸 Screenshot Description:**
Premium page shows three tiers with feature comparison. Premium+ has "Grok access" highlighted.

**⏱️ Time:** 5 minutes

**💡 Note:** X sometimes offers free trials (1-3 months). Check the Premium page for current offers.

---

## Step 3: Access Grok

### On Desktop (Web Browser)

1. **Log in to X** ([x.com](https://x.com))

2. **Look for the Grok icon** in the left sidebar
   - It looks like a black square with a diagonal line (\\)
   - It's below "Home," "Explore," and "Notifications"

3. **Click the Grok icon**

4. **You're in!** Start chatting with Grok.

**📸 Screenshot Description:**
Left sidebar shows Grok icon between "Grok" and "Lists"

### On Mobile (X App)

1. **Open the X app**

2. **Tap your profile picture** (top-left corner)

3. **Look for "Grok"** in the menu

4. **Tap "Grok"**

5. **Start chatting!**

**📸 Screenshot Description:**
Mobile menu shows Grok option with the diagonal line icon.

---

## Step 4: Using grok.x.com (Alternative)

There's also a dedicated Grok web app:

1. **Go to** [grok.x.com](https://grok.x.com)

2. **Sign in with your X account**

3. **Grant permissions** (if asked)

4. **Start chatting**

**Benefits of grok.x.com:**
- Clean, distraction-free interface
- Better for focused work
- No X timeline visible

---

## ⏱️ Setup Time Summary

| Step | Time |
|------|------|
| Create X account | 5-10 minutes |
| Subscribe to Premium+ | 5 minutes |
| Access Grok | 1 minute |
| First conversation | 2 minutes |
| **Total** | **~20 minutes** |

---

## ✅ Setup Verification

Before moving on, verify:

- [ ] You have an X account
- [ ] You're subscribed to X Premium+ (check Settings → Premium)
- [ ] You can see the Grok icon in the X sidebar
- [ ] You've sent your first message to Grok
- [ ] You received a response

---

## 🔄 Managing Your Subscription

### Checking Subscription Status

1. Go to [x.com/settings/premium](https://x.com/settings/premium)
2. View your current plan and renewal date

### Canceling Premium+

1. Go to [x.com/settings/premium](https://x.com/settings/premium)
2. Click "Cancel subscription"
3. Confirm cancellation
4. You'll lose Grok access at the end of the billing period

### Switching Tiers

You can upgrade from Premium to Premium+ anytime:
1. Go to Premium page
2. Click "Upgrade"
3. Pay the difference

---

**→ Proceed to Lesson 3: Using Grok Effectively**`
      },
      {
        title: 'Using Grok Effectively',
        content: `## 🎮 Understanding Grok Modes

Grok has two distinct modes. You can switch between them using the toggle at the top of the chat.

### Regular Mode 🎯

**When to use:**
- Serious research
- Professional tasks
- Coding questions
- Factual information

**Example:**
\`\`\`
Prompt: "Explain how cryptocurrency mining works"

Response: Clear, technical explanation of mining, proof-of-work,
blockchain, and energy consumption.
\`\`\`

### Fun Mode 😂

**When to use:**
- Casual conversations
- Entertainment
- Social media content
- When you want a laugh

**Example:**
\`\`\`
Prompt: "Explain how cryptocurrency mining works"

Response: "Oh boy, crypto mining. It's like trying to solve a Rubik's 
cube while running a marathon in a sauna, but instead of a medal, you 
get digital money that might be worth $60k or $6 tomorrow. 

Here's the deal: miners are basically accountants with really expensive 
gaming PCs..."
\`\`\`

---

## 🔍 Real-Time X Data Queries

This is Grok's superpower. Use it to understand what's happening on X right now.

### Example 1: Trending Topics

**Prompt:**
\`"What are people talking about regarding AI this week?"\`

**Expected Output:**
- Summary of top AI discussions on X
- Key themes and debates
- Notable posts or threads
- Different perspectives

### Example 2: Product Research

**Prompt:**
\`"What are X users saying about the new MacBook Pro? Summarize complaints and praises."\`

**Expected Output:**
- Common complaints (battery, price, ports)
- Common praises (performance, screen, design)
- Overall sentiment
- Influential reviewers' opinions

### Example 3: Event Coverage

**Prompt:**
\`"What's the latest on the CES 2024 announcements? What's getting the most buzz?"\`

**Expected Output:**
- Top announcements
- Most-discussed products
- Notable reactions
- Links to relevant posts

---

## 💻 Using Grok for Coding

Grok can write, debug, and explain code like ChatGPT.

### Example 1: Write Code

**Prompt:**
\`"Write a Python script that downloads all images from a webpage. Include error handling."\`

**Expected Output:**
Complete Python script with:
- requests library usage
- BeautifulSoup for parsing
- Error handling
- Comments

### Example 2: Debug Code

**Prompt:**
\`"This Python code is giving me an error. Fix it:

\`\`\`python
numbers = [1, 2, 3]
for i in range(len(numbers)):
    print(numbers[i+1])
\`\`\`

Error: IndexError"\`

**Expected Output:**
- Explanation of the error
- Corrected code
- Why the fix works

### Example 3: Explain Code

**Prompt:**
\`"Explain this JavaScript code line by line:

\`\`\`javascript
const doubled = arr.filter(n => n > 2).map(n => n * 2);
\`\`\`"\`

**Expected Output:**
Line-by-line breakdown with examples.

---

## ✍️ Using Grok for Content Creation

### Example 1: Social Media Posts

**Prompt:**
\`"Write 5 tweets about the struggles of remote work. Make them relatable and funny."\`

**Expected Output:**
\`\`\`
1. "My commute went from 45 minutes to 45 steps from bed to desk. 
   Living the dream? More like living the meme. #RemoteWork"

2. "The best part of WFH is wearing pajama bottoms to meetings. 
   The worst part is accidentally standing up. 😅"

3. "My cat is now my coworker. She contributes nothing to meetings 
   but demands treats every hour. Honestly? Same."

4. "Remote work pro tip: If you don't wear pants, no one knows. 
   Remote work con: If you forget to mute, everyone knows. 🤦‍♂️"

5. "I used to have a work-life balance. Now I have a work-couch 
   balance. And the couch is winning. 🏠💼"
\`\`\`

### Example 2: Blog Post Ideas

**Prompt:**
\`"Give me 10 blog post ideas about productivity for remote workers. Make the titles catchy."\`

**Expected Output:**
10 engaging blog post titles with brief descriptions.

### Example 3: Content Roasts (Fun Mode)

**Prompt:**
\`"Roast this LinkedIn post in Fun mode: [paste generic LinkedIn motivational post]"\`

**Expected Output:**
Humorous, sarcastic critique (all in good fun).

---

## 🧠 Research and Analysis

### Example 1: Summarize X Discussions

**Prompt:**
\`"Summarize the debate on X about remote work vs. office work. What are the main arguments on each side?"\`

**Expected Output:**
- Pro-remote arguments (flexibility, no commute, productivity)
- Pro-office arguments (collaboration, culture, separation)
- Common concerns
- Influential voices

### Example 2: Fact-Checking (Use with Caution)

**Prompt:**
\`"What's the consensus on X about [news story]? Are people skeptical or convinced?"\`

**Expected Output:**
- Range of opinions on X
- Links to relevant posts
- Common fact-checks mentioned
- Overall sentiment

**⚠️ Important:** Always verify information with reliable sources. X posts can be inaccurate.

---

## 🎨 Image Generation (Grok 2)

Grok 2 includes **Aurora** for image generation.

### Example Prompts:

\`\`\`
"Generate an image of a futuristic city at sunset"
"Create a minimalist logo for a coffee shop"
"Generate a photorealistic image of a golden retriever in space"
"Make an image of a dragon reading a book"
\`\`\`

**Tips:**
- Be specific about style (photorealistic, cartoon, minimalist)
- Describe lighting and colors
- Include details you want

---

## 🎯 Practical Exercises

**Exercise 1: Current Events (5 minutes)**
Ask Grok about a trending topic. Follow up with 2-3 questions.

**Exercise 2: Fun Mode vs Regular Mode (5 minutes)**
Ask the same question in both modes. Compare responses.

**Exercise 3: Code Generation (5 minutes)**
Ask Grok to write a simple Python script. Run it.

**Exercise 4: Content Creation (5 minutes)**
Generate social media content for your niche.

---

**→ Proceed to Lesson 4: Grok vs Other AIs**`
      },
      {
        title: 'Grok vs Other AIs',
        content: `## 📊 Head-to-Head Comparison

### Grok vs ChatGPT

| Aspect | Grok | ChatGPT |
|--------|------|---------|
| **Personality** | 😂 Witty, sarcastic | 😐 Neutral, professional |
| **Real-time Info** | ✅ X posts (instant) | ✅ Web search (Plus) |
| **Coding** | 🟡 Good | ✅ Excellent |
| **Document Analysis** | ❌ No uploads | ✅ Yes (Plus) |
| **Image Gen** | ✅ Aurora (integrated) | ✅ DALL-E (integrated) |
| **Guardrails** | 🟢 Loose | 🔴 Strict |
| **Best For** | Current events, fun | General use, coding |

**When to Choose Grok:**
- You want witty responses
- You need real-time social media sentiment
- You're discussing topics other AIs avoid

**When to Choose ChatGPT:**
- You need document analysis
- You want neutral, professional responses
- You're doing complex coding

---

### Grok vs Claude

| Aspect | Grok | Claude |
|--------|------|--------|
| **Personality** | 😂 Witty, edgy | 🙂 Helpful, nuanced |
| **Writing Quality** | 🟡 Good | ✅ Excellent |
| **Long Documents** | ❌ No | ✅ 200K tokens |
| **Reasoning** | 🟡 Good | ✅ Excellent |
| **Creativity** | ✅ Very creative | ✅ Creative, controlled |
| **Guardrails** | 🟢 Loose | 🟡 Moderate |
| **Best For** | Casual, current events | Writing, analysis |

**When to Choose Grok:**
- You want entertainment value
- You're checking X sentiment
- You want an opinionated response

**When to Choose Claude:**
- You need long document analysis
- You want nuanced, thoughtful writing
- You're doing complex reasoning

---

### Grok vs Gemini

| Aspect | Grok | Gemini |
|--------|------|--------|
| **Personality** | 😂 Witty | 😊 Friendly |
| **Google Integration** | ❌ No | ✅ Yes (Maps, YouTube, etc.) |
| **Multimodal** | 🟡 Images (Grok 2) | ✅ Images, files, video |
| **Real-time Info** | ✅ X posts | ✅ Web search |
| **Price** | $16/mo (X Premium+) | Free / $20 (Advanced) |
| **Best For** | X users, current events | Google ecosystem users |

**When to Choose Grok:**
- You already pay for X Premium+
- You want X-specific information
- You prefer witty responses

**When to Choose Gemini:**
- You use Google services
- You want free multimodal AI
- You need file uploads

---

### Grok vs Perplexity

| Aspect | Grok | Perplexity |
|--------|------|------------|
| **Citations** | ❌ No | ✅ Yes (every claim) |
| **Real-time Info** | ✅ X posts | ✅ Web search |
| **Research Depth** | 🟡 X-focused | ✅ Comprehensive |
| **Personality** | 😂 Witty | 😐 Neutral |
| **Best For** | Social sentiment, fun | Academic research |

**When to Choose Grok:**
- You want social media sentiment
- You're researching X discussions
- You want entertainment

**When to Choose Perplexity:**
- You need verified sources
- You're doing academic research
- You want comprehensive web search

---

## 🎯 Decision Matrix: Which AI to Use?

### For Research:
1. **Academic:** Perplexity (citations) or Claude (long documents)
2. **Current Events:** Grok (X posts) or Perplexity (real-time)
3. **Quick Facts:** Gemini or ChatGPT

### For Coding:
1. **Complex Projects:** ChatGPT (GPT-4)
2. **Code Review:** Claude (nuanced analysis)
3. **Quick Scripts:** Grok or ChatGPT

### For Writing:
1. **Long-Form:** Claude (best writer)
2. **Social Media:** Grok (witty, engaging)
3. **Professional:** ChatGPT (neutral)

### For Fun:
1. **Entertainment:** Grok (Fun mode)
2. **Casual Chat:** Gemini (friendly)
3. **Creative Writing:** Claude or Grok

### For Document Analysis:
1. **Long Documents:** Claude (200K) or Kimi (200K+)
2. **PDF Summaries:** Gemini (free uploads)
3. **Quick Analysis:** ChatGPT (Plus)

---

## 💡 Using Multiple AIs Together

**Pro Strategy:** Combine AI strengths!

**Example Workflow:**

1. **Research Phase:** Use Perplexity for cited research
2. **Deep Dive:** Use Claude to analyze long documents
3. **Draft:** Use ChatGPT to write the first draft
4. **Social Content:** Use Grok to create witty social posts
5. **Final Polish:** Use Claude for editing

---

## 🎯 Practical Exercise

**Task:** Research a topic using multiple AIs

1. **Grok:** "What's the sentiment on X about [topic]?"
2. **Perplexity:** "Find research papers about [topic]"
3. **Claude:** "Analyze this document about [topic]" (upload PDF)
4. **ChatGPT:** "Write a summary combining these perspectives"

Compare the different strengths!

---

**→ Proceed to Lesson 5: Pro Tips & Troubleshooting**`
      },
      {
        title: 'Pro Tips & Troubleshooting',
        content: `## ⚡ Pro Tips

### 1. Use Fun Mode Strategically

Fun mode isn't just for laughs — it's great for:
- Brainstorming (uncensored ideas flow)
- Breaking writer's block
- Getting a different perspective
- Entertainment content

**Example:**
\`\`\`
Regular: "How can I improve my productivity?"
Fun: "Listen, you beautiful disaster of a human. Here's how to 
actually get stuff done instead of doom-scrolling..."
\`\`\`

### 2. Leverage Real-Time X Data

Always ask about current events on X:

\`"What are the hot takes on X about [current event]?"\`

You'll get a synthesized view of thousands of perspectives.

### 3. Ask for Multiple Perspectives

\`"Give me 3 different viewpoints on [controversial topic]. Don't take a side, just present them fairly."\`

### 4. Use Grok for Social Listening

\`"What complaints do people have about [product/company] on X? Summarize common issues."\`

### 5. Generate Content Variations

\`"Write 5 versions of a tweet about [topic]. Make them all different in tone."\`

### 6. Ask for Roasts (Carefully)

\`"Roast this idea in Fun mode: [your idea]"\`

Great for identifying weaknesses in your thinking.

### 7. Check Trending Hashtags

\`"What hashtags are trending in [industry] right now? Explain each."\`

---

## 🚨 Troubleshooting Common Issues

### Error 1: "Grok icon not appearing"

**Symptoms:**
- No Grok icon in X sidebar
- Can't access Grok at all

**Solutions:**
\`\`\`
1. Verify Premium+ subscription:
   - Go to x.com/settings/premium
   - Confirm you have Premium+ (not Basic or Premium)
   
2. Wait 24-48 hours after subscribing:
   - Grok access isn't always instant
   - Try logging out and back in
   
3. Clear cache and cookies:
   - Chrome: Settings → Privacy → Clear data
   - Select "Cookies and other site data"
   - Log back in to X
   
4. Try incognito/private mode:
   - Rules out extension conflicts
   
5. Check if Grok is available in your region:
   - Grok is rolling out globally
   - Some regions may not have access yet
   
6. Contact X support:
   - help.x.com
   - Select "Premium" → "Grok access"
\`\`\`

---

### Error 2: "You don't have access to Grok"

**Symptoms:**
- Click Grok icon → Error message
- "Subscribe to Premium+" even though you did

**Solutions:**
\`\`\`
1. Verify payment went through:
   - Check email for confirmation
   - Check credit card statement
   
2. Wait for payment processing:
   - Can take 24 hours in some cases
   
3. Ensure you subscribed to Premium+, not Premium:
   - Premium ($8/mo) does NOT include Grok
   - Premium+ ($16/mo) DOES include Grok
   
4. Check if subscription was cancelled:
   - x.com/settings/premium
   
5. Try grok.x.com directly:
   - Sometimes works when X sidebar doesn't
\`\`\`

---

### Error 3: "Grok is experiencing issues"

**Symptoms:**
- Error message when sending message
- No response from Grok
- Loading indefinitely

**Solutions:**
\`\`\`
1. Check X status:
   - Check @XSupport on X
   - Search "X down" or "Grok down"
   
2. Wait 10-15 minutes:
   - Temporary outages are common
   
3. Refresh the page:
   - F5 or Cmd/Ctrl + R
   
4. Try a different browser:
   - Chrome, Firefox, Safari, Edge
   
5. Try the mobile app:
   - Sometimes works when web doesn't
   
6. Start a new conversation:
   - Old conversations can get "stuck"
\`\`\`

---

### Error 4: "Response is taking too long"

**Symptoms:**
- Grok is typing... forever
- No response after 30+ seconds

**Solutions:**
\`\`\`
1. Wait longer (up to 60 seconds):
   - Complex queries can take time
   
2. Simplify your question:
   - Break into smaller parts
   
3. Cancel and retry:
   - Click the stop button
   - Resend your message
   
4. Check your internet connection:
   - Slow connection = slow responses
   
5. Try a shorter prompt:
   - Long prompts can cause timeouts
\`\`\`

---

### Error 5: Grok not accessing X posts

**Symptoms:**
- Responses don't include X post information
- Generic responses without real-time data

**Solutions:**
\`\`\`
1. Be explicit about wanting X data:
   ❌ "What's happening with AI?"
   ✅ "What are people on X saying about AI this week?"
   
2. Use "on X" or "according to X posts" in your prompt

3. Ask for specific timeframes:
   "What was discussed on X about [topic] in the last 24 hours?"
   
4. Check if there's a temporary issue with X data access
\`\`\`

---

### Error 6: Fun mode not working

**Symptoms:**
- Responses are same in both modes
- No humor or wit in Fun mode

**Solutions:**
\`\`\`
1. Ensure Fun mode toggle is ON:
   - Look for the toggle at the top of chat
   - Should be highlighted/blue when active
   
2. Refresh the page after switching modes

3. Start a new conversation after switching

4. Be more explicit:
   "In Fun mode, explain [topic] with your signature wit"
\`\`\`

---

### Error 7: Image generation not working (Grok 2)

**Symptoms:**
- "Generate image" prompts don't work
- No image appears

**Solutions:**
\`\`\`
1. Ensure you have Grok 2 access:
   - Grok 1 doesn't have image generation
   - Check x.com/i/grok for version info
   
2. Use clear prompts:
   ❌ "Make an image"
   ✅ "Generate a photorealistic image of a sunset over mountains"
   
3. Try different phrasing:
   - "Create an image of..."
   - "Generate a picture showing..."
   
4. Check content policy:
   - Some image requests are blocked
   - Try a different, appropriate prompt
\`\`\`

---

### Error 8: "Your account has been suspended"

**Symptoms:**
- Can't access X at all
- Account suspended message

**Solutions:**
\`\`\`
1. Check email for suspension reason:
   - X sends explanation to your email
   
2. Appeal the suspension:
   - help.x.com
   - Submit an appeal
   
3. Common reasons for suspension:
   - Violating X rules
   - Suspicious activity
   - Impersonation
   
4. Wait for appeal response (can take days)

5. You won't be charged for Premium+ while suspended
   - But you'll lose Grok access
\`\`\`

---

### Error 9: Grok giving outdated information

**Symptoms:**
- Responses reference old information
- Doesn't know about recent events

**Solutions:**
\`\`\`
1. Be explicit about timeframe:
   "As of today, what's the latest on [topic]?"
   
2. Ask for X post information:
   "Check X posts from the last 24 hours about [topic]"
   
3. Realize limitations:
   - Grok's X access isn't perfectly real-time
   - May have 1-6 hour delay on some topics
   
4. Cross-reference with other sources
\`\`\`

---

### Error 10: Payment issues with Premium+

**Symptoms:**
- Payment declined
- Can't complete subscription

**Solutions:**
\`\`\`
1. Check card details:
   - Correct number, expiry, CVV
   - Billing address matches card
   
2. Try a different payment method:
   - Different credit card
   - Apple Pay / Google Pay
   
3. Check with your bank:
   - Some banks block recurring subscriptions
   - Call to authorize the charge
   
4. Try the mobile app instead of web:
   - Sometimes payment works better on app
   
5. Contact X support:
   - help.x.com
   - Select "Billing" issue
\`\`\`

---

### Error 11: Grok refusing to answer

**Symptoms:**
- "I can't help with that" response
- Refusal despite Grok being "uncensored"

**Solutions:**
\`\`\`
1. Grok still has limits:
   - Illegal activities
   - Harmful content
   - Personal information
   
2. Rephrase your question:
   - Be more academic/research-focused
   
3. Explain your purpose:
   "I'm researching [topic] for an academic paper. Can you provide information about...?"
   
4. Accept that some topics are off-limits
   - Grok is less censored, not uncensored
\`\`\`

---

### Error 12: Mobile app crashes or glitches

**Symptoms:**
- Grok section crashes
- Messages don't send
- App freezes

**Solutions:**
\`\`\`
1. Force close and reopen:
   - iOS: Swipe up from home
   - Android: Settings → Apps → X → Force stop
   
2. Update the X app:
   - Check App Store / Play Store
   
3. Clear app cache:
   - Android: Settings → Apps → X → Storage → Clear cache
   - iOS: Uninstall and reinstall
   
4. Check device compatibility:
   - Requires iOS 14+ or Android 8+
   
5. Reinstall the X app:
   - Uninstall → Restart phone → Reinstall
   
6. Try web version instead:
   - x.com in mobile browser
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **X Help Center:** [help.x.com](https://help.x.com)
- **X Support:** [@XSupport](https://x.com/XSupport) on X
- **Grok Updates:** [@grok](https://x.com/grok) on X

### Community Resources
- **X Community:** [x.com/community](https://x.com/community)
- **Reddit:** r/Twitter, r/grok

### Quick Diagnostics
\`\`\`
1. Check subscription status: x.com/settings/premium
2. Check X status: @XSupport
3. Try grok.x.com directly
4. Try different browser or device
\`\`\`

---

## 🎉 Congratulations!

You've completed the **Using Grok (xAI)** guide!

**What You've Learned:**
- ✅ Understand Grok's unique features and personality
- ✅ Set up X Premium+ and access Grok
- ✅ Use Grok for research, coding, and content creation
- ✅ Know when to use Grok vs other AIs
- ✅ Troubleshoot common issues

**Next Steps:**
- Explore Fun mode for entertainment
- Use Grok for real-time research
- Compare with other AI tools
- Build Grok into your workflow

**Happy Groking!** 🚀😂`
      }
    ]
  },
  'guide-kimi': {
    title: 'Kimi AI - Long Context Master',
    description: 'Master Kimi\'s massive context window.',
    topic: 'Emerging AI',
    lessons: [
      {
        title: 'What is Kimi?',
        content: `## 🎯 What You'll Learn

By the end of this guide, you will:

- ✅ Understand Kimi's unique long-context capabilities
- ✅ Set up your Kimi account and access the platform
- ✅ Upload and analyze long documents effectively
- ✅ Use advanced features for research and analysis
- ✅ Troubleshoot common issues

**⏱️ Time to complete:** ~30 minutes

---

## What is Kimi?

**Kimi** is an AI assistant created by **Moonshot AI**, a Chinese AI company founded in 2023. It's famous for one thing above all else: **massive context windows**.

While most AI assistants struggle with documents longer than 50 pages, Kimi can handle:
- **200K tokens** (approximately 150,000 words or 300+ pages)
- Some versions support up to **2 million tokens**
- Multiple large documents simultaneously

Think of Kimi as the AI that actually **remembers** your entire book, contract, or research paper.

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Web browser** (Chrome, Firefox, Safari, or Edge)
- [ ] **Internet connection**
- [ ] **Documents to analyze** (PDFs, Word docs, or text files)
- [ ] **Optional:** Mobile device for Kimi app
- [ ] **Optional:** Chinese language knowledge (helpful but not required)

---

## Moonshot AI Background

### Company Overview

- **Founded:** 2023 by Yang Zhilin (ex-Google Brain)
- **Headquarters:** Beijing, China
- **Focus:** Long-context language models
- **Funding:** $1B+ valuation (2024)

### Why Long Context Matters

Most AI assistants have a "memory limit" — they can only consider a certain amount of text at once:

| AI Assistant | Context Window | Approximate Pages |
|--------------|----------------|-------------------|
| ChatGPT (Free) | 8K tokens | ~6 pages |
| ChatGPT (Plus) | 128K tokens | ~100 pages |
| Claude (Free) | 200K tokens | ~150 pages |
| Claude (Pro) | 200K tokens | ~150 pages |
| **Kimi** | **200K-2M tokens** | **~150-1500 pages** |

### What This Means in Practice

**With ChatGPT:** Upload a 50-page report → AI forgets the first half by the time it reads the end

**With Kimi:** Upload a 300-page book → AI remembers everything, can cross-reference chapter 1 and chapter 20

---

## When to Use Kimi

### ✅ Best Use Cases

**1. Long Document Analysis**
- Research papers (50+ pages)
- Legal contracts and agreements
- Financial reports (annual reports, 10-Ks)
- Technical documentation
- Academic theses and dissertations

**2. Multi-Document Comparison**
- Compare multiple contracts side-by-side
- Synthesize findings from 10+ research papers
- Cross-reference multiple policy documents

**3. Book Analysis**
- Summarize entire books
- Extract key themes and quotes
- Create chapter-by-chapter breakdowns

**4. Code Repository Analysis**
- Understand large codebases
- Find patterns across multiple files
- Generate documentation

**5. Research Synthesis**
- Literature reviews
- Meta-analyses
- Evidence gathering

### ❌ Not Best For

- Quick fact-checking (use Perplexity)
- Real-time information (use ChatGPT with browsing)
- Image analysis (use GPT-4 Vision or Gemini)
- Coding assistance (use ChatGPT or Claude)

---

## Kimi vs Other Long-Context AIs

### Kimi vs Claude

| Feature | Kimi | Claude |
|---------|------|--------|
| **Max Context** | 2M tokens | 200K tokens |
| **Price** | Free | Free / $20 (Pro) |
| **Document Uploads** | ✅ Yes | ✅ Yes |
| **Multiple Files** | ✅ Yes | ✅ Yes |
| **Writing Quality** | Good | Excellent |
| **Language** | Chinese/English | English |
| **Citations** | ❌ No | ✅ Yes (with prompt) |

**When to Choose Kimi:**
- Ultra-long documents (>200 pages)
- Free long-context analysis
- Chinese language documents

**When to Choose Claude:**
- Best-in-class writing quality
- Nuanced analysis
- English documents

---

## Real-World Example

**Scenario:** You have a 150-page legal contract and need to:
1. Find all termination clauses
2. Compare liability sections
3. Extract key dates and deadlines
4. Identify unusual clauses

**With ChatGPT:** You'd need to break it into 10+ chunks and lose context

**With Kimi:** Upload once, ask all questions, get comprehensive answers with cross-references

---

**→ Proceed to Lesson 2: Access & Setup**`
      },
      {
        title: 'Access & Setup',
        content: `## 🌐 Accessing Kimi

### Method 1: Web App (Recommended)

**Official URL:** [kimi.moonshot.cn](https://kimi.moonshot.cn)

**Steps:**

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)

2. **Navigate to kimi.moonshot.cn**

3. **Choose sign-up method:**
   - **Phone number** (Chinese +86 numbers)
   - **WeChat** (recommended for Chinese users)
   - **Email** (international users)

4. **For international users (email signup):**
   - Click "邮箱登录" (Email login) or look for email icon
   - Enter your email address
   - Check your inbox for verification code
   - Enter the code to verify

5. **Complete profile (optional):**
   - Add display name
   - Set preferences

6. **You're in!** Start chatting or uploading documents

**📸 Screenshot Description:**
The Kimi interface has:
- A text input box at the bottom
- A paperclip icon (📎) or "+" for file uploads
- Chat history in the center
- Clean, minimalist design

---

### Method 2: Mobile App

**iOS:** Search "Kimi" or "Moonshot AI" in App Store
**Android:** Search "Kimi" in Google Play or download APK

**Note:** Mobile apps may require Chinese app store account or may not be available in all regions.

---

## 🌍 Interface Language

**Important:** Kimi's interface is primarily in Chinese.

### Key Interface Terms (English Translation)

| Chinese | English |
|---------|---------|
| 上传文件 | Upload file |
| 发送 | Send |
| 新对话 | New conversation |
| 历史 | History |
| 设置 | Settings |
| 退出 | Sign out |

### Using Kimi in English

Despite the Chinese interface:
- Kimi **understands and responds in English**
- You can ask questions in English
- Upload English documents
- Get English responses

**Tip:** Use your browser's translate feature if needed (Chrome → Right-click → Translate)

---

## ⏱️ Setup Time Summary

| Step | Time |
|------|------|
| Visit website | 1 minute |
| Create account | 3-5 minutes |
| Verify email/phone | 2 minutes |
| First conversation | 2 minutes |
| Upload first document | 1 minute |
| **Total** | **~10 minutes** |

---

## 📁 Uploading Documents

### Supported File Types

| Type | Formats | Max Size |
|------|---------|----------|
| **PDF** | .pdf | 100 MB |
| **Word** | .docx, .doc | 50 MB |
| **Text** | .txt, .md | 10 MB |
| **Images** | .jpg, .png (OCR) | 20 MB |

### How to Upload

**Step 1:** Click the **paperclip icon (📎)** or **"+" button**

**Step 2:** Select your file(s)

**Step 3:** Wait for upload to complete (progress bar shows)

**Step 4:** File appears in chat with thumbnail

**Step 5:** Start asking questions!

### Uploading Multiple Files

Kimi supports **multiple file uploads** in the same conversation:

1. Upload first file
2. Click upload again
3. Select additional file(s)
4. Kimi will analyze all uploaded files together

**Maximum:** Up to 50 files per conversation (varies by account type)

---

## ✅ Setup Verification

Before moving on, verify:

- [ ] You can access kimi.moonshot.cn
- [ ] You've created an account
- [ ] You've sent your first message
- [ ] You can see the file upload button
- [ ] Optional: You've uploaded a test document

---

## 💡 Quick First Test

**Try this prompt:**
\`\`\`
I'm testing your long-context capabilities. I'll upload a document soon.
For now, can you confirm: How much text can you handle at once?
\`\`\`

**Expected Response:** Kimi will confirm its context window (200K+ tokens).

---

**→ Proceed to Lesson 3: Long Document Analysis**`
      },
      {
        title: 'Long Document Analysis',
        content: `## 📄 Working with Long Documents

Kimi's superpower is handling documents that break other AI assistants. Here's how to use it effectively.

---

## Uploading and Processing Documents

### Step 1: Prepare Your Document

**Best Practices:**
- ✅ PDF format works best
- ✅ Ensure text is selectable (not scanned images)
- ✅ Compress large files if needed
- ❌ Avoid password-protected PDFs
- ❌ Avoid heavily formatted documents (tables may not parse correctly)

**For Scanned Documents:**
Kimi has OCR (Optical Character Recognition) capabilities, but for best results:
- Use clear, high-resolution scans
- Ensure text is legible
- Consider pre-processing with OCR tools

### Step 2: Upload

1. Click **paperclip icon** or **"+" button**
2. Select your file
3. Wait for "Upload complete" message
4. File thumbnail appears in chat

### Step 3: Wait for Processing

For long documents (100+ pages):
- Kimi needs time to "read" the document
- Progress indicator shows processing status
- Usually takes 30-60 seconds for 200-page document

---

## Effective Prompting for Document Analysis

### ❌ Bad Prompt:
\`"What's in this document?"\`

### ✅ Good Prompts:

**Summarization:**
\`\`\`
Summarize this 150-page annual report. Focus on:
1. Key financial metrics (revenue, profit, growth)
2. Major business developments
3. Risk factors mentioned
4. Future outlook

Format as a structured executive summary.
\`\`\`

**Information Extraction:**
\`\`\`
From this contract, extract:
1. All parties involved and their roles
2. Key dates (effective date, termination date, renewal dates)
3. Payment terms and amounts
4. Termination conditions
5. Liability clauses

Format as a table where possible.
\`\`\`

**Theme Analysis:**
\`\`\`
Analyze this book and identify:
1. The top 5 main themes
2. Key arguments for each theme
3. Supporting evidence/examples from the text
4. Memorable quotes that illustrate each theme

Provide page references where possible.
\`\`\`

---

## Multi-Document Comparison

One of Kimi's most powerful features is comparing multiple documents.

### Example: Contract Comparison

**Upload:** 3 different versions of a contract (v1, v2, v3)

**Prompt:**
\`\`\`
I've uploaded 3 versions of the same contract.

Please create a comparison table showing:
1. What changed between each version
2. Which clauses were added, removed, or modified
3. Any changes to dates, amounts, or parties
4. Potential implications of each change

Format as:
| Clause | Version 1 | Version 2 | Version 3 | Impact |
\`\`\`

### Example: Research Synthesis

**Upload:** 5 academic papers on the same topic

**Prompt:**
\`\`\`
I've uploaded 5 research papers about [topic].

Please synthesize:
1. Common findings across all papers
2. Conflicting conclusions and why they differ
3. Methodologies used and their strengths/weaknesses
4. Gaps in the research that need further study
5. Most cited papers/references

Create a literature review summary.
\`\`\`

---

## Citation Extraction

Kimi can extract and organize citations from academic documents.

**Prompt:**
\`\`\`
Extract all citations and references from this research paper.
Format as:
1. In-text citations (author, year)
2. Full reference list
3. Most frequently cited authors
4. Categorize by topic/theme
\`\`\`

---

## Real Example: Annual Report Analysis

**Document:** 180-page company annual report (PDF)

**Prompt 1: Executive Summary**
\`\`\`
Create a 2-page executive summary of this annual report covering:
- Financial performance (with specific numbers)
- Business highlights
- Strategic initiatives
- Risks and challenges
- Management outlook
\`\`\`

**Prompt 2: Deep Dive**
\`\`\`
Find all mentions of "AI" or "artificial intelligence" in this report.
For each mention:
1. Quote the relevant paragraph
2. Explain the context
3. Note the page number
\`\`\`

**Prompt 3: Cross-Reference**
\`\`\`
The CEO letter mentions "significant investments in technology."
Find the sections in the financial statements that detail these investments.
What specific amounts were spent on technology/R&D?
\`\`\`

---

## 🎯 Practical Exercises

**Exercise 1: Single Document Analysis (10 minutes)**
1. Upload a long PDF (50+ pages)
2. Ask for a summary
3. Ask 3 specific questions about the content
4. Ask for cross-references between sections

**Exercise 2: Multi-Document Comparison (15 minutes)**
1. Upload 2-3 related documents
2. Ask Kimi to compare them
3. Request a comparison table
4. Identify key differences

**Exercise 3: Citation Extraction (10 minutes)**
1. Upload an academic paper
2. Extract all references
3. Categorize by topic
4. Identify the most-cited works

---

**→ Proceed to Lesson 4: Advanced Use Cases**`
      },
      {
        title: 'Advanced Use Cases',
        content: `## 🚀 Taking Kimi Further

Beyond basic document analysis, Kimi excels at complex, multi-step workflows.

---

## Research Workflows

### Academic Research Pipeline

**Step 1: Literature Collection**
- Upload 10-20 relevant papers
- Group by topic or methodology

**Step 2: Initial Synthesis**
\`\`\`
I've uploaded [X] papers about [topic].

Please:
1. Group them by research methodology
2. Identify the seminal/most-cited papers
3. Note any conflicting findings
4. Highlight research gaps
\`\`\`

**Step 3: Deep Analysis**
\`\`\`
Focus on the top 3 most relevant papers.

For each, analyze:
1. Research question and hypothesis
2. Methodology and sample size
3. Key findings and statistical significance
4. Limitations acknowledged by authors
5. Recommendations for future research
\`\`\`

**Step 4: Gap Analysis**
\`\`\`
Based on all papers, what research questions remain unanswered?
What methodologies are underutilized?
What populations/contexts are understudied?
\`\`\`

---

## Book Summarization

### Complete Book Analysis

**Upload:** Full book PDF (200-500 pages)

**Prompt 1: Chapter Summaries**
\`\`\`
Create a chapter-by-chapter summary of this book.
For each chapter:
1. Main argument or narrative arc
2. Key examples or case studies
3. Important quotes (with page numbers)
4. How it connects to the overall thesis

Format as a structured outline.
\`\`\`

**Prompt 2: Character Analysis (for fiction)**
\`\`\`
Analyze all major characters in this novel.
For each character:
1. Their arc throughout the story
2. Key decisions and motivations
3. Relationships with other characters
4. Memorable quotes
5. Symbolic significance
\`\`\`

**Prompt 3: Theme Extraction**
\`\`\`
Identify the top 10 themes in this book.
For each theme:
1. Definition and significance
2. Key scenes/chapters where it appears
3. Character(s) associated with it
4. Supporting quotes
5. How it resolves or develops
\`\`\`

---

## Legal & Contract Analysis

### Contract Review Workflow

**Upload:** Legal contract (20-100 pages)

**Prompt 1: Executive Overview**
\`\`\`
Provide an executive summary of this contract:
1. Parties involved
2. Subject matter
3. Key terms and duration
4. Financial implications
5. Major obligations for each party
\`\`\`

**Prompt 2: Risk Assessment**
\`\`\`
Analyze this contract for potential risks:
1. Unusual or one-sided clauses
2. Vague language that could be problematic
3. Termination risks
4. Liability exposure
5. Compliance requirements

Rate each risk: Low / Medium / High
\`\`\`

**Prompt 3: Obligation Extraction**
\`\`\`
Extract all obligations, deliverables, and deadlines.
Format as a table:
| Party | Obligation | Deadline | Consequence of Breach |
\`\`\`

**Prompt 4: Clause Comparison**
\`\`\`
Compare the liability clause in this contract to standard industry terms.
What's different? What's missing? What's favorable/unfavorable?
\`\`\`

---

## Code Repository Analysis

### Understanding Large Codebases

**Upload:** Multiple source code files (up to 50 files)

**Prompt 1: Architecture Overview**
\`\`\`
Analyze this codebase and explain:
1. Overall architecture and design patterns
2. Main modules/components
3. Data flow and dependencies
4. Entry points and key functions
5. Technologies and frameworks used
\`\`\`

**Prompt 2: Documentation Generation**
\`\`\`
Generate documentation for this codebase:
1. README.md with setup instructions
2. API documentation for public functions
3. Architecture diagram description
4. Configuration guide
\`\`\`

**Prompt 3: Code Review**
\`\`\`
Review this code for:
1. Potential bugs or errors
2. Security vulnerabilities
3. Performance issues
4. Code style inconsistencies
5. Missing error handling

Prioritize by severity.
\`\`\`

---

## Financial Document Analysis

### Annual Report Deep Dive

**Upload:** Company annual report / 10-K filing

**Prompt 1: Financial Health**
\`\`\`
Analyze the financial health of this company:
1. Revenue trends (3-5 years)
2. Profit margins and profitability
3. Debt levels and liquidity
4. Cash flow analysis
5. Key financial ratios

Compare to industry benchmarks if mentioned.
\`\`\`

**Prompt 2: Risk Factors**
\`\`\`
Extract and categorize all risk factors mentioned:
1. Market/competitive risks
2. Operational risks
3. Regulatory/legal risks
4. Financial risks
5. Technology risks

Rate each by severity based on the discussion.
\`\`\`

---

## Multi-Language Analysis

Kimi handles both Chinese and English well.

**Chinese Document Analysis:**
\`\`\`
这份文件的主要结论是什么？请用英文总结。
(What are the main conclusions of this document? Please summarize in English.)
\`\`\`

**Translation + Analysis:**
\`\`\`
This document is in Chinese. Please:
1. Translate key sections to English
2. Summarize the main points
3. Highlight culturally-specific references
\`\`\`

---

## 🎯 Pro Tips

### 1. Chunk Complex Requests
Instead of one massive prompt, break it into steps:
\`\`\`
Step 1: "First, identify all chapters in this book."
Step 2: "Now summarize chapters 1-5."
Step 3: "Now summarize chapters 6-10."
\`\`\`

### 2. Reference Specific Sections
\`\`\`
"Based on the 'Financial Statements' section (pages 45-60)..."
"In Chapter 3, specifically the discussion about..."
\`\`\`

### 3. Request Structured Output
\`\`\`
"Format your response as:
## Section 1
- Bullet points

## Section 2
| Column 1 | Column 2 |

## Section 3
Numbered list
\`\`\`

### 4. Ask for Confidence Levels
\`\`\`
"If you're uncertain about any extraction, note it as [UNCERTAIN] and explain why."
\`\`\`

---

**→ Proceed to Lesson 5: Troubleshooting**`
      },
      {
        title: 'Troubleshooting',
        content: `## 🚨 Common Issues & Solutions

### Error 1: "Upload failed" or File Not Processing

**Symptoms:**
- Upload bar stuck at 0%
- "Upload failed" error message
- File appears but Kimi doesn't respond to questions about it

**Solutions:**

\`\`\`
1. Check file size:
   - Max: 100 MB for PDFs
   - If larger, compress the PDF first

2. Check file format:
   - Supported: PDF, DOCX, DOC, TXT
   - Not supported: Encrypted PDFs, some image-only PDFs

3. Check internet connection:
   - Large files need stable connection
   - Try smaller file first to test

4. Refresh the page and retry:
   - Sometimes session expires
   - Log out and log back in

5. Try a different browser:
   - Chrome works best
   - Disable ad blockers temporarily

6. For scanned documents:
   - Ensure OCR quality is good
   - Try re-scanning at higher resolution
\`\`\`

---

### Error 2: "Response stopped" or Incomplete Response

**Symptoms:**
- Kimi starts responding but cuts off
- "Continue" doesn't work
- Response ends mid-sentence

**Solutions:**

\`\`\`
1. Type "请继续" or "Continue":
   - Kimi may have hit a length limit
   - Ask it to continue from where it stopped

2. Request shorter responses:
   "Instead of a full analysis, give me bullet points."

3. Break down your question:
   ❌ "Analyze everything in this 500-page book"
   ✅ "Analyze Chapter 1 of this book"

4. Start a new conversation if stuck:
   - Long conversations can accumulate context
   - Fresh start often helps
\`\`\`

---

### Error 3: Kimi Not Understanding Document

**Symptoms:**
- Kimi gives generic responses
- "I don't see that information" when it should be there
- Responses don't reference the uploaded content

**Solutions:**

\`\`\`
1. Verify file processed completely:
   - Look for "Processing complete" message
   - Large files can take 1-2 minutes

2. Reference the file explicitly:
   ❌ "What are the main points?"
   ✅ "In the PDF I uploaded, what are the main points?"

3. Check if document is in supported language:
   - Chinese and English work best
   - Other languages may have issues

4. Try simpler prompts first:
   "Can you see the document I uploaded? What's the title?"

5. Re-upload the document:
   - Sometimes processing fails silently
   - Delete and re-upload
\`\`\`

---

### Error 4: Chinese Interface Confusion

**Symptoms:**
- Can't find features due to Chinese interface
- Don't understand error messages

**Solutions:**

\`\`\`
1. Use browser translation:
   - Chrome: Right-click → "Translate to English"
   - This translates the interface

2. Key terms reference:
   | Chinese | English |
   |---------|---------|
   | 上传 | Upload |
   | 发送 | Send |
   | 新对话 | New Chat |
   | 历史记录 | History |
   | 删除 | Delete |
   | 下载 | Download |

3. Ask Kimi for help:
   "How do I upload a file? Please answer in English."
\`\`\`

---

### Error 5: File Size Limits

**Symptoms:**
- "File too large" error
- Upload fails for big documents

**Solutions:**

\`\`\`
1. Compress PDFs:
   - Use: ilovepdf.com/compress_pdf
   - Or: Adobe online compressor
   - Target: Under 50 MB

2. Split into multiple files:
   - Upload Part 1, ask questions
   - Upload Part 2 in same conversation
   - Kimi remembers context

3. Convert to text:
   - Copy-paste text directly
   - Works for any length

4. Remove unnecessary pages:
   - Delete cover pages, blank pages
   - Focus on content sections
\`\`\`

---

### Error 6: Kimi Gives Outdated or Wrong Information

**Symptoms:**
- Kimi hallucinates facts not in your document
- References information you didn't provide
- Makes up page numbers or quotes

**Solutions:**

\`\`\`
1. Ask for verification:
   "Please only use information from the uploaded document.
    If you're unsure, say 'Not found in document'."

2. Request quotes:
   "Quote the exact text where this information appears."

3. Ask for page references:
   "What page is this on? Provide the exact page number."

4. Cross-check important facts:
   - Never trust AI 100% for critical information
   - Verify in the original document

5. Use more specific prompts:
   ❌ "Summarize the risks"
   ✅ "From the 'Risk Factors' section on pages 15-20, summarize the top 5 risks."
\`\`\`

---

### Error 7: Multiple Files Not Working Together

**Symptoms:**
- Kimi only analyzes one file
- "I don't see the other document" error

**Solutions:**

\`\`\`
1. Upload files in same conversation:
   - Don't start new chat between uploads
   - All files must be in same conversation thread

2. Reference files explicitly:
   "Compare the contract in file1.pdf with file2.pdf"

3. Check file limits:
   - Max ~50 files per conversation
   - May vary by account type

4. Number your files:
   "I've uploaded 3 files. File 1 is the contract.
    File 2 is the amendment. File 3 is the exhibit.
    Compare File 1 and File 2."
\`\`\`

---

### Error 8: Can't Sign Up / Account Issues

**Symptoms:**
- "Phone number not supported"
- Verification code not arriving
- Can't create account

**Solutions:**

\`\`\`
1. For international users:
   - Use email signup instead of phone
   - Look for "邮箱登录" (email login)

2. Verification code issues:
   - Check spam folder
   - Wait 5 minutes and request new code
   - Try different email provider

3. If phone required:
   - Some regions require Chinese phone (+86)
   - Use email signup to bypass

4. Account locked:
   - Contact support via kimi.moonshot.cn
   - Use feedback form (反馈)
\`\`\`

---

### Error 9: Slow Responses or Timeouts

**Symptoms:**
- Kimi takes forever to respond
- "Request timeout" error
- Connection lost during response

**Solutions:**

\`\`\`
1. Check your internet connection:
   - Stable connection required for long documents
   - Try different network

2. Reduce document size:
   - Smaller files = faster processing
   - Split large documents

3. Simplify your request:
   - Complex analysis takes longer
   - Break into smaller questions

4. Avoid peak hours:
   - Chinese business hours may be busier
   - Try off-peak times

5. Refresh and retry:
   - Sometimes server load causes issues
   - Wait 5 minutes and try again
\`\`\`

---

### Error 10: Language Issues (Chinese vs English)

**Symptoms:**
- Kimi responds in Chinese when you want English
- English prompts get Chinese responses
- Poor quality translations

**Solutions:**

\`\`\`
1. Explicitly request English:
   "Please respond in English."
   "用英文回答" (Answer in English)

2. Set language preference in prompt:
   "From now on, respond only in English."

3. For mixed documents:
   "This document is in Chinese. Please analyze it but respond in English."

4. If Chinese response received:
   "Please translate your response to English."
\`\`\`

---

### Error 11: Tables and Formatting Not Preserved

**Symptoms:**
- Tables appear as messy text
- Kimi doesn't understand table structure
- Can't extract data from tables

**Solutions:**

\`\`\`
1. Describe the format you want:
   "Extract the data from the table on page 5 and format as:
    | Column A | Column B | Column C |"

2. Ask for the raw data:
   "List all the data from the financial table, row by row."

3. For complex tables:
   - Take a screenshot
   - Upload as image
   - Kimi can sometimes read images

4. Alternative: Copy-paste table:
   - Copy table from PDF
   - Paste as text in your prompt
   - Ask Kimi to format it
\`\`\`

---

### Error 12: Session Expires or Logs Out

**Symptoms:**
- "Please log in" message
- Conversation history disappears
- Uploaded files lost

**Solutions:**

\`\`\`
1. Save important conversations:
   - Copy-paste to a document
   - Don't rely on history

2. Re-upload files:
   - If logged out, files are lost
   - Keep originals ready to re-upload

3. Check "Remember me":
   - Enable during login
   - Reduces frequency of logouts

4. Use same browser:
   - Sessions are browser-specific
   - Don't switch between browsers
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Website:** [kimi.moonshot.cn](https://kimi.moonshot.cn)
- **Feedback:** Use the feedback button (反馈) in the interface

### Quick Diagnostics
\`\`\`
1. Test with simple question: "Hello, can you respond?"
2. Upload small test file to verify uploads work
3. Try different browser
4. Clear browser cache and cookies
5. Check if kimi.moonshot.cn is accessible
\`\`\`

---

## 🎉 Congratulations!

You've completed the **Kimi AI - Long Context Master** guide!

**What You've Learned:**
- ✅ Understand Kimi's massive 200K-2M token context window
- ✅ Set up your account and navigate the interface
- ✅ Upload and analyze long documents effectively
- ✅ Use advanced workflows for research, legal, and code analysis
- ✅ Troubleshoot common issues

**Next Steps:**
- Upload your first long document
- Try multi-document comparison
- Build Kimi into your research workflow

**Happy long-context analysis!** 🚀📄`
      }
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
      { 
        title: 'Troubleshooting & Common Issues', 
        content: `## 🚨 Common Cursor Errors & Solutions

### Error 1: "Cursor won't start" or "Application is damaged" (macOS)

**Full Error:**
> "Cursor" is damaged and can't be opened. You should move it to the Trash.

**Cause:** macOS Gatekeeper blocking unsigned or quarantined app

**Solution:**
\`\`\`bash
# Option 1: Remove quarantine attribute
xattr -cr /Applications/Cursor.app

# Option 2: Allow in System Settings
# System Settings → Privacy & Security → Scroll down → Click "Open Anyway"

# Option 3: Re-download from official site
# Go to cursor.sh → Download fresh copy
\`\`\`

---

### Error 2: "AI features not working" or "No completions"

**Symptoms:**
- No AI suggestions appear
- Chat shows "Connection error"
- Tab autocomplete doesn't work

**Cause:** Not signed in, API limit reached, or network issue

**Solution:**
\`\`\`
1. Check if signed in:
   - Click profile icon in top-right
   - Sign in with GitHub/Google

2. Check API status:
   - cursor.sh/status
   - Check if there's an outage

3. Check your plan:
   - Free tier has monthly limits
   - Upgrade at cursor.sh/pricing

4. Network check:
   - Try a different network
   - Disable VPN temporarily
   - Check firewall settings

5. Restart Cursor:
   - Cmd/Ctrl + Q to fully quit
   - Reopen Cursor
\`\`\`

---

### Error 3: "Indexing stuck" or "Codebase not indexed"

**Full Error:**
> Codebase indexing in progress... (stuck for hours)

**Cause:** Large codebase, insufficient memory, or corrupted index

**Solution:**
\`\`\`
1. Check indexing status:
   - Click Cursor icon in status bar
   - View "Indexing Status"

2. Force reindex:
   - Cmd/Ctrl + Shift + P
   - "Cursor: Reindex Codebase"

3. Exclude large folders:
   - Settings → "Cursor: Indexing Exclude"
   - Add: node_modules, dist, build, .git

4. Increase memory:
   - Close other applications
   - Restart Cursor

5. Reset index (last resort):
   # macOS/Linux
   rm -rf ~/.cursor/index
   # Windows
   rmdir /s %USERPROFILE%\\.cursor\\index
   # Then reopen Cursor
\`\`\`

---

### Error 4: "Cmd+K not working" or keyboard shortcuts broken

**Cause:** Shortcut conflict with other apps or corrupted keybindings

**Solution:**
\`\`\`
1. Check keyboard shortcuts:
   - Cmd/Ctrl + K Cmd/Ctrl + S (opens keybindings)
   - Search for "cursor" commands
   - Verify shortcuts are assigned

2. Reset to defaults:
   - Cmd/Ctrl + K Cmd/Ctrl + S
   - Click "..." menu → "Reset Keybindings"

3. Check for conflicts:
   - Look for "!" warning icons
   - Click the shortcut to see conflicts
   - Remove conflicting bindings

4. Check system shortcuts:
   - macOS: System Settings → Keyboard → Shortcuts
   - Windows: Settings → Ease of Access → Keyboard
   - Disable any conflicting system shortcuts
\`\`\`

---

### Error 5: "Sign in failed" or "Authentication error"

**Full Error:**
> Authentication failed. Please try again.

**Cause:** Session expired, network issue, or OAuth problem

**Solution:**
\`\`\`
1. Sign out and sign back in:
   - Click profile icon → Sign Out
   - Sign in again

2. Clear auth cache:
   # macOS/Linux
   rm -rf ~/.cursor/auth*
   # Windows
   del %USERPROFILE%\\.cursor\\auth*
   # Then reopen Cursor and sign in

3. Try different sign-in method:
   - If GitHub fails, try Google
   - Or use email magic link

4. Check browser settings:
   - Allow popups from cursor.sh
   - Clear browser cookies for cursor.sh
\`\`\`

---

### Error 6: "Cursor is slow" or high CPU usage

**Cause:** Large files, too many extensions, or indexing overhead

**Solution:**
\`\`\`
1. Check what's using resources:
   - Cmd/Ctrl + Shift + P
   - "Developer: Open Process Explorer"
   - Identify high CPU processes

2. Disable heavy extensions:
   - Cmd/Ctrl + Shift + X
   - Review and disable unnecessary extensions
   - Particularly: heavy linters, formatters

3. Exclude large folders:
   \`\`\`json
   // settings.json
   "files.exclude": {
     "**/node_modules": true,
     "**/.git": true,
     "**/dist": true,
     "**/build": true
   }
   \`\`\`

4. Reduce indexing scope:
   \`\`\`json
   "cursor.indexing.maxFileSize": 1000000,
   "cursor.indexing.exclude": ["**/node_modules/**", "**/dist/**"]
   \`\`\`

5. Increase memory limit:
   \`\`\`bash
   # macOS/Linux
   export CURSOR_MAX_MEMORY=4096
   # Windows (PowerShell)
   $env:CURSOR_MAX_MEMORY=4096
   \`\`\`

---

### Error 7: "Chat not responding" or endless loading

**Cause:** API timeout, large context, or server issue

**Solution:**
\`\`\`
1. Cancel and retry:
   - Click "Stop" button
   - Resend your message

2. Reduce context size:
   - Don't include entire large files
   - Use @Codebase more selectively
   - Close unrelated tabs

3. Clear chat history:
   - Click "Clear" in chat panel
   - Start fresh conversation

4. Check server status:
   - cursor.sh/status
   - Wait if there's an outage

5. Restart Cursor completely
\`\`\`

---

### Error 8: "Cannot import VS Code settings"

**Full Error:**
> Failed to import VS Code settings

**Cause:** VS Code settings corrupted or incompatible

**Solution:**
\`\`\`
1. Import manually:
   - Open VS Code
   - Cmd/Ctrl + Shift + P → "Export Settings"
   - In Cursor: Cmd/Ctrl + Shift + P → "Import Settings"

2. Copy keybindings:
   # VS Code location:
   - macOS: ~/Library/Application Support/Code/User/keybindings.json
   - Windows: %APPDATA%\\Code\\User\\keybindings.json
   - Linux: ~/.config/Code/User/keybindings.json

   # Copy to Cursor location:
   - macOS: ~/Library/Application Support/Cursor/User/keybindings.json
   - Windows: %APPDATA%\\Cursor\\User\\keybindings.json
   - Linux: ~/.config/Cursor/User/keybindings.json

3. Reinstall extensions individually:
   - Not all VS Code extensions work in Cursor
   - Install them fresh from Cursor's extension marketplace
\`\`\`

---

### Error 9: "Context limit exceeded" or "Too many tokens"

**Full Error:**
> The context exceeds the maximum number of tokens.

**Cause:** Too much code/ @files included in chat context

**Solution:**
\`\`\`
1. Be more selective with context:
   - Instead of @entire-repo, use @specific-file
   - Don't include multiple large files

2. Use @Codebase smart search:
   - "Using @Codebase, find authentication logic"
   - Cursor will search, not load everything

3. Clear chat history:
   - Start new chat for different topics
   - Old context accumulates

4. Break up requests:
   - Ask about one thing at a time
   - Don't request entire rewrites
\`\`\`

---

### Error 10: "File watcher error" or "ENOSPC"

**Full Error:**
> ENOSPC: System limit for number of file watchers reached

**Cause:** Too many files being watched (Linux only)

**Solution:**
\`\`\`bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase limit temporarily
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches

# Make permanent
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Or exclude node_modules from watching
# In Cursor settings.json:
"files.watcherExclude": {
  "**/node_modules/**": true,
  "**/.git/**": true
}
\`\`\`

---

### Error 11: "Extension not compatible" or "Extension host crashed"

**Cause:** Extension incompatible with Cursor's version of VS Code

**Solution:**
\`\`\`
1. Check extension compatibility:
   - Not all VS Code extensions work in Cursor
   - Check extension page for "Cursor compatible"

2. Report incompatible extensions:
   - github.com/getcursor/cursor/issues
   - Developers often fix quickly

3. Find alternatives:
   - Search for similar extensions
   - Use Cursor's built-in features instead

4. Disable problematic extension:
   - Cmd/Ctrl + Shift + X
   - Find extension → Click Disable
   - Restart Cursor
\`\`\`

---

### Error 12: "Cannot connect to remote" (SSH/Dev Container)

**Cause:** Remote extension not installed or SSH config issue

**Solution:**
\`\`\`
1. Install Remote SSH extension:
   - Extensions → Search "Remote - SSH"
   - Install Microsoft's official extension

2. Verify SSH works in terminal:
   ssh user@hostname

3. Check SSH config:
   cat ~/.ssh/config
   # Should have:
   Host my-server
     HostName hostname.com
     User myuser
     IdentityFile ~/.ssh/id_rsa

4. Remote connection steps:
   - Cmd/Ctrl + Shift + P
   - "Remote-SSH: Connect to Host"
   - Select your configured host
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Documentation:** [cursor.sh/docs](https://cursor.sh/docs)
- **Discord Community:** [discord.gg/cursor](https://discord.gg/cursor)
- **GitHub Issues:** [github.com/getcursor/cursor/issues](https://github.com/getcursor/cursor/issues)
- **Status Page:** [cursor.sh/status](https://cursor.sh/status)

### Quick Diagnostics
\`\`\`
1. Check version: Cmd/Ctrl + Shift + P → "About Cursor"
2. View logs: Cmd/Ctrl + Shift + P → "Developer: Open Logs Folder"
3. Toggle developer tools: Cmd/Ctrl + Shift + I
4. Reset settings: Cmd/Ctrl + Shift + P → "Reset Settings"
\`\`\`

## 🎉 Congratulations!

You can now troubleshoot any Cursor issue!

**What You've Learned:**
- ✅ Fix startup and authentication errors
- ✅ Resolve AI feature issues
- ✅ Optimize Cursor performance
- ✅ Handle context and indexing problems
- ✅ Know where to get help

**Happy coding with Cursor!** 🚀`
      },
    ]
  },
  'guide-botfather': {
    title: 'Creating Telegram Bots with BotFather',
    description: 'Learn to create and manage Telegram bots using BotFather.',
    topic: 'Development Setup',
    lessons: [
      { 
        title: 'What is BotFather?', 
        content: `## BotFather - Telegram's Bot Creator

**BotFather** is Telegram's official bot for creating and managing Telegram bots. Every Telegram bot is created through BotFather.

## What You'll Learn

By the end of this guide, you will:

- ✅ Create your first Telegram bot
- ✅ Configure bot settings (name, description, avatar)
- ✅ Get your bot token for API access
- ✅ Understand bot commands and features

**Time to complete:** ~20 minutes

## Why Create a Telegram Bot?

### Use Cases

- **Notifications** - Send alerts to users
- **Customer Service** - Auto-reply to common questions
- **Automation** - Integrate with your apps
- **Community Management** - Moderate groups
- **AI Assistants** - Connect AI to Telegram

### Why Telegram?

- **Free API** - No hosting costs for basic bots
- **Huge user base** - 800M+ users
- **Rich features** - Buttons, payments, web apps
- **Easy development** - Simple HTTP-based API

**→ Proceed to Lesson 2: Creating Your Bot**`
      },
      { 
        title: 'Creating Your First Bot', 
        content: `## Step-by-Step Bot Creation

### Step 1: Open BotFather

1. Open Telegram
2. Search for **@BotFather**
3. Start a chat with the verified BotFather (blue checkmark)

### Step 2: Create New Bot

Send the command:
\`\`\`
/newbot
\`\`\`

### Step 3: Name Your Bot

BotFather will ask for:
1. **Bot display name** - What users see (e.g., "My Cool Bot")
2. **Bot username** - Must end in \`bot\` (e.g., \`MyCoolBot\` or \`my_cool_bot\`)

### Step 4: Save Your Token

BotFather will respond with:
\`\`\`
Done! Congratulations on your new bot...
Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure...
\`\`\`

⚠️ **IMPORTANT:** Save this token! You'll need it to control your bot.

**→ Proceed to Lesson 3: Configuring Your Bot**`
      },
      { 
        title: 'Configuring Bot Settings', 
        content: `## Essential BotFather Commands

### Set Bot Description
\`\`\`
/setdescription
\`\`\`
Appears when users first open your bot.

Example:
\`\`\`
This bot helps you track cryptocurrency prices.
Send /price BTC to get current Bitcoin price.
\`\`\`

### Set Bot About Text
\`\`\`
/setabouttext
\`\`\`
Short text that appears in the bot's profile.

### Set Bot Avatar
\`\`\`
/setuserpic
\`\`\`
Upload an image as your bot's profile picture.

### Set Commands
\`\`\`
/setcommands
\`\`\`
Define your bot's commands with descriptions:
\`\`\`
start - Start using the bot
help - Show help message
price - Get cryptocurrency price
alert - Set price alert
\`\`\`

### Set Inline Placeholder
\`\`\`
/setinline
\`\`\`
Text shown when users type your bot's username in any chat.

**→ Proceed to Lesson 4: Using Your Bot Token**`
      },
      { 
        title: 'Using Your Bot Token', 
        content: `## Bot Token = Bot Password

Your token looks like:
\`\`\`
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
\`\`\`

The first part (1234567890) is your **bot ID**.
The second part is your **authentication key**.

## Testing Your Bot

### Quick Test (Browser)

Open this URL in your browser:
\`\`\`
https://api.telegram.org/bot<TOKEN>/getMe
\`\`\`

Replace \`<TOKEN>\` with your actual token.

You should see:
\`\`\`json
{
  "ok": true,
  "result": {
    "id": 1234567890,
    "is_bot": true,
    "first_name": "My Cool Bot",
    "username": "MyCoolBot"
  }
}
\`\`\`

### Sending a Test Message

To send a message to yourself:
1. Start a chat with your bot
2. Send any message (or click "Start")
3. Visit this URL:
\`\`\`
https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=YOUR_CHAT_ID&text=Hello!
\`\`\`

## Security Tips

✅ **DO:**
- Keep token in environment variables
- Regenerate if compromised: \`/revoke\` in BotFather
- Use webhooks in production

❌ **DON'T:**
- Commit token to GitHub
- Share token publicly
- Use token in client-side code

## 🎉 Congratulations!

You've created and configured your first Telegram bot!

**Next steps:**
- Learn a bot framework (python-telegram-bot, Telegraf.js)
- Build your first bot feature
- Deploy to a server

**→ Check out the OpenClaw guide to build an AI-powered bot!**`
      },
    ]
  },
  'guide-voice-ai-elevenlabs': {
    title: 'Voice AI & Speech Synthesis',
    description: 'Master AI voice synthesis, cloning, and speech applications.',
    topic: 'AI Engineering',
    lessons: [
      { 
        title: 'Introduction to Voice AI', 
        content: `## What is Voice AI?

Voice AI, also known as speech synthesis or text-to-speech (TTS) technology, uses deep learning models to convert written text into spoken audio. Modern voice AI systems can produce speech that's virtually indistinguishable from human voices.

### Core Capabilities

**1. Natural Speech Synthesis**
Today's voice AI models understand context, emotion, and nuance:
- Adjust tone based on punctuation and context
- Convey emotions like excitement, sadness, or urgency
- Maintain consistent voice quality across long passages
- Handle multiple languages and accents fluently

**2. Voice Cloning**
With just a few minutes of audio samples, voice AI can create a digital replica of any voice:
- Custom brand voices for businesses
- Personalized content at scale
- Voice preservation for accessibility
- Character voices for games and animation

**3. Real-time Processing**
Modern APIs can generate speech in near real-time:
- Live conversation agents
- Dynamic content narration
- Interactive voice responses
- Streaming audio for podcasts and videos

## Real-World Use Cases

### Content Creation
- **Audiobooks and Podcasts** - Produce audio content at scale
- **Video Narration** - YouTube, tutorials, explainer videos
- **Social Media** - TikTok, Reels voiceovers

### Business Applications
- **Customer Service** - Natural IVR systems
- **Marketing** - Radio/TV commercials at scale
- **E-Learning** - Training modules and courses

### Accessibility
- Screen readers with natural voices
- Audio versions of written content
- AAC devices with personalized voices

**→ Proceed to Lesson 2: ElevenLabs Platform**`
      },
      { 
        title: 'ElevenLabs Platform & Voice Cloning', 
        content: `## ElevenLabs Overview

ElevenLabs is one of the most sophisticated voice AI platforms, known for producing ultra-realistic synthetic voices.

### Key Features

**Multilingual Support** - 29+ languages
**Voice Library** - Hundreds of AI-generated voices
**Voice Cloning** - Create custom voices from audio samples
**Speech-to-Speech** - Transform audio while preserving characteristics

## Voice Cloning Step-by-Step

### Step 1: Prepare Audio Samples

✅ **Duration:** 1-5 minutes total
✅ **Quality:** Clean audio without background noise
✅ **Format:** MP3, WAV, or M4A
✅ **Content:** Natural speech (not reading lists)
✅ **Consistency:** Same speaker throughout

### Step 2: Recording Tips

- Use a quality microphone
- Record in a quiet room
- Speak naturally, as if having a conversation
- Include varied sentence structures and emotions

### Step 3: Upload and Process

1. Navigate to "VoiceLab" section
2. Click "Add Voice" → "Clone Voice"
3. Upload your audio samples
4. Name your voice and add description
5. Process takes 30-60 seconds

### Voice Settings

**Stability (0-100)**
- Lower (0-30): More expressive, variable delivery
- Higher (70-100): More consistent, stable output
- **Recommendation:** 30-50 for most use cases

**Similarity (0-100)**
- Higher values = closer match to original
- **Recommendation:** 70-90 for accurate cloning

**Style Exaggeration (0-100)**
- Controls emotional emphasis
- **Recommendation:** 0-30 for natural delivery

### Best Practices

✅ Audio quality matters more than quantity
✅ Remove background noise before uploading
✅ Choose natural content, not scripted
✅ Always obtain consent before cloning voices

**→ Proceed to Lesson 3: API Integration**`
      },
      { 
        title: 'Text-to-Speech API Integration', 
        content: `## API Overview

The ElevenLabs API is RESTful and supports multiple programming languages.

### Installation

\`\`\`bash
pip install elevenlabs  # Python
npm install elevenlabs-node  # Node.js
\`\`\`

### Basic Usage

\`\`\`python
from elevenlabs import generate, save, set_api_key

set_api_key("your_api_key_here")

audio = generate(
    text="Hello! Welcome to voice AI synthesis.",
    voice="Bella",
    model="eleven_monolingual_v1"
)

save(audio, "output.mp3")
\`\`\`

### Voice Settings

\`\`\`python
audio = generate(
    text="This is exciting news!",
    voice="Bella",
    model="eleven_monolingual_v1",
    stability=0.3,  # More expressive (0-1)
    similarity=0.8   # Closer to original (0-1)
)
\`\`\`

### Optimal Settings by Use Case

| Use Case | Stability | Similarity |
|----------|-----------|------------|
| Audiobook narration | 0.5-0.7 | 0.7-0.9 |
| Conversational AI | 0.3-0.5 | 0.6-0.8 |
| News/Announcements | 0.6-0.8 | 0.8-1.0 |
| Character voices | 0.2-0.4 | 0.5-0.7 |

### Choosing the Right Model

**eleven_monolingual_v1** - Best for English-only, highest quality
**eleven_multilingual_v2** - 29+ languages, improved quality

### Streaming Audio

\`\`\`python
audio_stream = generate(
    text="This will be streamed...",
    voice="Bella",
    stream=True
)

for chunk in audio_stream:
    # Process each audio chunk
    pass
\`\`\`

### Error Handling

\`\`\`python
import time

def generate_with_retry(text, voice, max_retries=3):
    for attempt in range(max_retries):
        try:
            return generate(text=text, voice=voice)
        except Exception as e:
            if '429' in str(e):
                wait_time = 2 ** attempt
                time.sleep(wait_time)
            else:
                raise
    raise Exception("Max retries exceeded")
\`\`\`

**→ Proceed to Lesson 4: Building Applications**`
      },
      { 
        title: 'Building Voice Applications', 
        content: `## Project 1: AI Podcast Generator

Convert blog posts into podcast-style audio.

\`\`\`python
from elevenlabs import generate, save
from pydub import AudioSegment

class PodcastGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.voice = "Bella"
    
    def generate_segment(self, text):
        return generate(
            text=text,
            voice=self.voice,
            model="eleven_monolingual_v1",
            stability=0.6,
            similarity=0.8
        )
    
    def create_podcast(self, segments, output_path):
        combined = AudioSegment.empty()
        
        for segment in segments:
            audio = self.generate_segment(segment)
            # Save, load, combine
            combined += AudioSegment.from_mp3(segment_path)
            combined += AudioSegment.silent(duration=1500)
        
        combined.export(output_path, format="mp3")
\`\`\`

## Project 2: Conversational Voice Assistant

\`\`\`python
import speech_recognition as sr
from elevenlabs import generate
import openai

class VoiceAssistant:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.conversation_history = []
    
    def listen(self):
        with self.microphone as source:
            audio = self.recognizer.listen(source)
        return self.recognizer.recognize_google(audio)
    
    def respond(self, text):
        # Generate AI response with GPT
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.conversation_history + [
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content
    
    def speak(self, text):
        audio = generate(text=text, voice="Bella")
        # Play audio
\`\`\`

## Project 3: Multilingual Announcements

\`\`\`python
class MultilingualAnnouncer:
    def __init__(self):
        self.voices = {
            'en': 'Bella',
            'es': 'Antoni',
            'fr': 'Adam',
            'de': 'Dorothy'
        }
        self.model = "eleven_multilingual_v2"
    
    def generate_announcement(self, text, languages):
        results = {}
        for lang in languages:
            translated = self.translate(text, lang)
            audio = generate(
                text=translated,
                voice=self.voices[lang],
                model=self.model
            )
            results[lang] = audio
        return results
\`\`\`

**→ Proceed to Lesson 5: Production & Cost Optimization**`
      },
      { 
        title: 'Production & Cost Optimization', 
        content: `## Cost Optimization

### Understanding Pricing

- **Free Tier:** 10,000 characters/month
- **Starter ($5/mo):** 30,000 characters/month
- **Creator ($22/mo):** 100,000 characters/month
- **Pro ($99/mo):** 500,000 characters/month

### Optimization Techniques

**1. Smart Caching**

\`\`\`python
import hashlib, os

class AudioCache:
    def __init__(self, cache_dir="./audio_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def get(self, text, voice):
        key = hashlib.md5(f"{text}-{voice}".encode()).hexdigest()
        path = os.path.join(self.cache_dir, f"{key}.mp3")
        
        if os.path.exists(path):
            with open(path, "rb") as f:
                return f.read()
        return None
    
    def set(self, text, voice, audio_data):
        key = hashlib.md5(f"{text}-{voice}".encode()).hexdigest()
        with open(os.path.join(self.cache_dir, f"{key}.mp3"), "wb") as f:
            f.write(audio_data)
\`\`\`

**2. Text Optimization**

Reduce character count without sacrificing quality:
- Remove redundant phrases
- Eliminate excessive whitespace
- Simplify verbose expressions

**3. Batch Processing**

\`\`\`python
import concurrent.futures

def process_batch(texts, voice="Bella"):
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(generate, text=t, voice=voice) for t in texts]
        return [f.result() for f in concurrent.futures.as_completed(futures)]
\`\`\`

## Reliability Patterns

### Circuit Breaker

\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.state = "CLOSED"
    
    def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() - self.last_failure > self.timeout:
                self.state = "HALF_OPEN"
            else:
                raise Exception("Circuit breaker OPEN")
        
        try:
            result = func(*args)
            self.failure_count = 0
            self.state = "CLOSED"
            return result
        except Exception:
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            raise
\`\`\`

### Rate Limiting

\`\`\`python
from collections import deque
import time

class RateLimiter:
    def __init__(self, max_requests=10, time_window=60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = deque()
    
    def is_allowed(self):
        now = time.time()
        while self.requests and self.requests[0] < now - self.time_window:
            self.requests.popleft()
        
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False
\`\`\`

## Production Checklist

✅ **Testing**
- Load test with expected traffic
- Test error scenarios
- Verify fallback mechanisms

✅ **Monitoring**
- Set up usage alerts
- Monitor API response times
- Track error rates

✅ **Security**
- Secure API key storage
- Implement rate limiting
- Add authentication

✅ **Optimization**
- Enable caching
- Pre-generate common responses
- Implement batch processing

## 🎉 Congratulations!

You now know how to:
- ✅ Understand voice AI capabilities
- ✅ Clone voices with ElevenLabs
- ✅ Integrate the TTS API
- ✅ Build voice applications
- ✅ Optimize for production

**Next Steps:**
- Build your first voice project
- Explore speech-to-text (Whisper)
- Create multilingual applications`
      },
    ]
  },
  'guide-rag-knowledge-bases': {
    title: 'RAG & Knowledge Bases',
    description: 'Build AI systems that retrieve and reason over your own data.',
    topic: 'AI Engineering',
    lessons: [
      { title: 'What is RAG?', content: `## Retrieval-Augmented Generation

**RAG** combines language models with external knowledge bases for accurate, up-to-date responses.

### The Three Pillars

\`\`\`
Query → Retrieval → Context + Query → LLM → Response
\`\`\`

**1. Retrieval**: Search your knowledge base for relevant documents
**2. Augmentation**: Combine retrieved context with the query
**3. Generation**: LLM generates response using the context

### Why RAG Matters

| Problem | RAG Solution |
|---------|--------------|
| Knowledge cutoff | Update knowledge base anytime |
| Hallucinations | Ground responses in sources |
| No private data access | Index your own documents |
| Context limits | Retrieve only what's needed |

### Use Cases

- **Enterprise Knowledge**: Search internal docs, wikis, policies
- **Customer Support**: Product manuals, troubleshooting guides
- **Legal/Compliance**: Case law, regulations, contracts
- **Research**: Academic papers, citations

### RAG vs Fine-Tuning

**Use RAG when:** Information changes, need citations, large private data
**Use Fine-Tuning when:** Changing behavior/style, stable knowledge

**→ Proceed to Lesson 2: Vector Databases**` },
      { title: 'Vector Databases', content: `## Storing and Searching Embeddings

Vector databases enable **semantic similarity search** - finding documents by meaning, not keywords.

### Core Concepts

**Embeddings**: Dense vectors representing semantic meaning
\`\`\`python
from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="How do I reset my password?"
)
embedding = response.data[0].embedding  # 1536-dimensional vector
\`\`\`

**Similarity Metrics**:
- Cosine similarity (most common)
- Euclidean distance
- Dot product

### Top Vector Databases

| Database | Type | Best For |
|----------|------|----------|
| **Pinecone** | Managed | Production, scale |
| **Weaviate** | Open Source | Self-hosted, hybrid search |
| **Chroma** | Open Source | Prototyping, simplicity |

### Quick Start: Chroma

\`\`\`python
import chromadb
client = chromadb.Client()
collection = client.create_collection("docs")

collection.add(
    documents=["Reset password via forgot password link"],
    ids=["doc1"]
)

results = collection.query(
    query_texts=["How do I recover my account?"],
    n_results=5
)
\`\`\`

**→ Proceed to Lesson 3: Embeddings & Chunking**` },
      { title: 'Embeddings & Chunking', content: `## Preprocessing for Quality Retrieval

### Embedding Models

| Model | Dimensions | Quality | Cost |
|-------|------------|---------|------|
| all-MiniLM-L6-v2 | 384 | Good | Free |
| all-mpnet-base-v2 | 768 | Better | Free |
| text-embedding-3-small | 1536 | Excellent | $$ |
| text-embedding-3-large | 3072 | Best | $$$ |

### Chunking Strategies

**Why chunk?**
- Embedding models have limits
- Smaller chunks = more precise retrieval
- Balance between context and specificity

**Chunking Approaches**:

1. **Fixed-Size**: Simple, predictable
\`\`\`python
def chunk(text, size=500, overlap=50):
    return [text[i:i+size] for i in range(0, len(text), size-overlap)]
\`\`\`

2. **Sentence-Based**: Respects boundaries
3. **Semantic**: Uses embeddings to find natural breaks
4. **Recursive** (recommended): Respects document structure

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = splitter.split_text(document)
\`\`\`

### Best Practices

- **Overlap**: 10-20% of chunk size
- **Chunk size**: 500-1000 tokens for general use
- **Metadata**: Attach source, page, section for filtering

**→ Proceed to Lesson 4: Building the Pipeline**` },
      { title: 'Building the RAG Pipeline', content: `## Complete RAG Implementation

### Architecture Overview

\`\`\`
Documents → Chunk → Embed → Store → Query → Retrieve → Generate
\`\`\`

### Full Pipeline Code

\`\`\`python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader

# 1. Load documents
loader = TextLoader("documents/manual.md")
documents = loader.load()

# 2. Chunk
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = splitter.split_documents(documents)

# 3. Embed and store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# 4. Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 5. Query
query = "How do I reset my password?"
relevant_docs = retriever.get_relevant_documents(query)

# 6. Generate response
llm = ChatOpenAI(model="gpt-4")
context = "\\n\\n".join([doc.page_content for doc in relevant_docs])
response = llm.predict(f"""Context: {context}

Question: {query}

Answer based on the context:""")
\`\`\`

### Advanced: Conversational RAG

\`\`\`python
from langchain.chains import ConversationalRetrievalChain

qa = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-4"),
    retriever=retriever,
    memory=ConversationBufferMemory(memory_key="chat_history")
)

result = qa({"question": "What is the refund policy?"})
\`\`\`

**→ Proceed to Lesson 5: Production**` },
      { title: 'RAG in Production', content: `## Evaluation and Optimization

### Key Metrics

**Retrieval Quality**:
- Precision: Relevant results / Total results
- Recall: Relevant results found / Total relevant
- MRR: Position of first relevant result

**Generation Quality**:
- Faithfulness: Response accuracy vs context
- Relevance: Does it answer the question?

### Optimization Techniques

**1. Re-ranking**
\`\`\`python
# Retrieve more, then re-rank with cross-encoder
initial_results = retriever.get_relevant_documents(query, k=20)
reranked = cross_encoder.rerank(query, initial_results, top_k=5)
\`\`\`

**2. Hybrid Search**
Combine vector + keyword search:
\`\`\`python
results = vectorstore.similarity_search(query, k=10) + \\
          keyword_search(query, k=10)
# Deduplicate and merge scores
\`\`\`

**3. Caching**
Cache frequent queries:
\`\`\`python
cache = {}
def cached_query(query):
    if query in cache:
        return cache[query]
    result = rag_pipeline(query)
    cache[query] = result
    return result
\`\`\`

### Monitoring

- Track query latency
- Log retrieval scores
- Monitor response quality
- Collect user feedback

### Production Checklist

✅ Embedding model versioned
✅ Chunking strategy documented
✅ Retrieval metrics baseline established
✅ Response quality evaluation in place
✅ Caching implemented
✅ Error handling and fallbacks
✅ Monitoring and alerting configured

## 🎉 Congratulations!

You now know how to build production RAG systems!

**Key Takeaways**:
- RAG = Retrieval + Augmentation + Generation
- Vector databases enable semantic search
- Chunking determines retrieval granularity
- Evaluation and optimization are ongoing processes` },
    ]
  },
  'guide-crewai-agents': {
    title: 'Building AI Agents with CrewAI',
    description: 'Create autonomous AI agents that work together.',
    topic: 'AI Engineering',
    lessons: [
      { title: 'What Are AI Agents?', content: `## Autonomous AI Systems

**AI Agents** are autonomous systems that perceive, reason, and act to accomplish goals.

### Agent Architecture

\`\`\`
┌─────────────┐
│  Perception │ ← Input from environment
└──────┬──────┘
       ↓
┌─────────────┐
│   Memory    │ ← Store experiences
└──────┬──────┘
       ↓
┌─────────────┐
│  Reasoning  │ ← Plan and decide
└──────┬──────┘
       ↓
┌─────────────┐
│   Action    │ → Execute tools/tasks
└─────────────┘
\`\`\`

### Why Multi-Agent?

Single agents have limits. **Multi-agent systems**:
- Divide complex tasks
- Provide checks and balances
- Enable specialization
- Handle parallel work

### Use Cases

| Use Case | Agents |
|----------|--------|
| Research | Researcher + Analyst + Writer |
| Customer Support | Triage + Specialist + QA |
| Content Creation | Strategist + Writer + Editor |
| Data Analysis | Collector + Cleaner + Analyst |

**→ Proceed to Lesson 2: CrewAI Framework**` },
      { title: 'CrewAI Framework', content: `## CrewAI Overview

CrewAI is a framework for orchestrating **role-playing AI agents**.

### Installation

\`\`\`bash
pip install crewai crewai-tools
\`\`\`

### Core Concepts

**Agent**: An AI with a role, goal, and backstory
**Task**: A specific assignment for an agent
**Crew**: A team of agents working together
**Process**: How agents collaborate (sequential/hierarchical)

### Quick Example

\`\`\`python
from crewai import Agent, Task, Crew

# Create an agent
researcher = Agent(
    role="Research Analyst",
    goal="Find comprehensive information on topics",
    backstory="You're an expert researcher with attention to detail",
    verbose=True
)

# Create a task
research_task = Task(
    description="Research the latest AI developments",
    agent=researcher
)

# Create a crew
crew = Crew(
    agents=[researcher],
    tasks=[research_task]
)

# Execute
result = crew.kickoff()
\`\`\`

**→ Proceed to Lesson 3: Creating Agents**` },
      { title: 'Creating Agents', content: `## The Agent Definition Trinity

Every agent needs: **Role**, **Goal**, and **Backstory**

### Role

What the agent does:
\`\`\`python
role = "Senior Software Engineer"
role = "Marketing Copywriter"
role = "Data Analyst"
\`\`\`

### Goal

What the agent aims to achieve:
\`\`\`python
goal = "Write clean, efficient, well-documented code"
goal = "Create compelling copy that drives conversions"
goal = "Extract actionable insights from data"
\`\`\`

### Backstory

Personality and context:
\`\`\`python
backstory = """You have 15 years of experience at top tech companies.
You're known for writing elegant solutions and thorough documentation."""
\`\`\`

### Complete Agent Example

\`\`\`python
from crewai import Agent

writer = Agent(
    role="Content Writer",
    goal="Create engaging, accurate content",
    backstory="""You're a Pulitzer-nominated writer who specializes in 
    making complex topics accessible. You always fact-check and cite sources.""",
    verbose=True,
    allow_delegation=False,
    tools=[]  # Add custom tools here
)
\`\`\`

### Agent Attributes

| Attribute | Purpose |
|-----------|---------|
| role | Define the agent's job |
| goal | What success looks like |
| backstory | Personality and expertise |
| verbose | Log agent reasoning |
| allow_delegation | Can agent assign tasks to others? |
| tools | Functions agent can use |

**→ Proceed to Lesson 4: Tasks & Collaboration**` },
      { title: 'Tasks & Collaboration', content: `## Tasks and Tools

### Creating Tasks

\`\`\`python
from crewai import Task

research_task = Task(
    description="""Research the company Acme Corp and provide:
    1. Company overview
    2. Key products
    3. Recent news
    4. Competitive landscape""",
    expected_output="A comprehensive report on Acme Corp",
    agent=researcher
)
\`\`\`

### Adding Tools

Agents can use tools to interact with the world:

\`\`\`python
from crewai_tools import SerperDevTool, WebsiteSearchTool

search_tool = SerperDevTool()
web_tool = WebsiteSearchTool()

researcher = Agent(
    role="Researcher",
    tools=[search_tool, web_tool]
)
\`\`\`

### Collaboration Patterns

**Sequential**: Tasks run in order
\`\`\`python
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, write_task, edit_task],
    process=Process.sequential
)
\`\`\`

**Hierarchical**: Manager delegates
\`\`\`python
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[main_task],
    process=Process.hierarchical,
    manager_llm="gpt-4"
)
\`\`\`

**→ Proceed to Lesson 5: Real Projects**` },
      { title: 'Real-World Projects', content: `## Project 1: Research Team

\`\`\`python
from crewai import Agent, Task, Crew, Process

# Agents
researcher = Agent(
    role="Research Specialist",
    goal="Find accurate, comprehensive information",
    backstory="PhD researcher with 10 years of experience",
    tools=[search_tool]
)

analyst = Agent(
    role="Data Analyst",
    goal="Extract insights and patterns",
    backstory="Former McKinsey consultant specializing in analysis"
)

writer = Agent(
    role="Technical Writer",
    goal="Create clear, engaging reports",
    backstory="Award-winning science communicator"
)

# Tasks
tasks = [
    Task(description="Research AI trends in 2024", agent=researcher),
    Task(description="Analyze findings and identify key themes", agent=analyst),
    Task(description="Write executive summary report", agent=writer)
]

# Crew
crew = Crew(agents=[researcher, analyst, writer], tasks=tasks)
result = crew.kickoff()
\`\`\`

## Project 2: Content Creation Pipeline

\`\`\`python
# Strategist → Writer → Editor → SEO Specialist

strategist = Agent(role="Content Strategist", ...)
writer = Agent(role="Content Writer", ...)
editor = Agent(role="Senior Editor", ...)
seo = Agent(role="SEO Specialist", ...)

crew = Crew(
    agents=[strategist, writer, editor, seo],
    tasks=[plan_task, write_task, edit_task, optimize_task],
    process=Process.sequential
)
\`\`\`

## 🎉 Congratulations!

You can now build multi-agent AI systems with CrewAI!

**Best Practices**:
- Clear role definitions prevent overlap
- Specific goals improve output quality
- Good backstories improve reasoning
- Start simple, add complexity gradually` },
    ]
  },
  'guide-ai-image-generation': {
    title: 'AI Image Generation Mastery',
    description: 'Create stunning visuals with AI image generators.',
    topic: 'AI Tools',
    lessons: [
      { title: 'Overview of Image AI Tools', content: `## The Big Three

| Platform | Strength | Best For |
|----------|----------|----------|
| **Midjourney** | Artistic quality | Concepts, branding |
| **DALL-E 3** | Precision, API | Specific details, automation |
| **Stable Diffusion** | Freedom, free | Privacy, customization |

### Midjourney

**Pros**: Exceptional artistic quality, strong community
**Cons**: Discord-only, no API, $10-60/month

### DALL-E 3

**Pros**: Precise prompt following, API access, text rendering
**Cons**: More restrictive, API costs accumulate

### Stable Diffusion

**Pros**: Free, local, unlimited, customizable
**Cons**: Requires GPU, steeper learning curve

### Quick Comparison

\`\`\`
Midjourney → "Make it beautiful"
DALL-E 3 → "Make it exactly as I described"
Stable Diffusion → "Make it however I want, infinitely"
\`\`\`

**→ Proceed to Lesson 2: Midjourney**` },
      { title: 'Midjourney Prompting', content: `## The Midjourney Language

Midjourney responds to **artistic, evocative** prompts.

### Prompt Structure

\`\`\`
[Subject] + [Style] + [Lighting] + [Technical] + [Parameters]
\`\`\`

### Example Evolution

❌ "a cat"
✅ "fluffy orange tabby on Victorian windowsill, warm afternoon light through lace curtains, oil painting, impressionist --ar 16:9 --v 6"

### Key Parameters

| Parameter | Effect | Range |
|-----------|--------|-------|
| \`--ar\` | Aspect ratio | 16:9, 9:16, 1:1 |
| \`--s\` | Stylization | 0-1000 |
| \`--c\` | Chaos/variety | 0-100 |
| \`--iw\` | Image weight | 0-3 |

### Prompt Recipe: Hero Images

\`\`\`
[Product] in [setting], professional photography, studio lighting, 
clean background, commercial aesthetic, 8k --ar 16:9 --s 150
\`\`\`

### Workflow

1. Generate 10-20 concepts (high chaos)
2. Select best, create variations
3. Upscale and refine
4. Iterate with adjusted parameters

**→ Proceed to Lesson 3: DALL-E 3**` },
      { title: 'DALL-E 3 & API', content: `## DALL-E 3: Precision at Scale

### Access Methods

**ChatGPT**: Conversational refinement ($20/month)
**API**: Programmatic generation ($0.04-0.12/image)

### Prompting Philosophy

Unlike Midjourney, DALL-E 3 wants **explicit, detailed** descriptions:

❌ "a dog"
✅ "A golden retriever sitting on the left side of the image, facing right, in a grassy park with oak trees in the background, sunny day, photographed with 85mm lens"

### API Integration

\`\`\`python
from openai import OpenAI
client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="Professional product photo of wireless headphones on marble surface",
    size="1024x1024",
    quality="hd"
)

image_url = response.data[0].url
\`\`\`

### Batch Generation

\`\`\`python
products = ["headphones", "watch", "laptop"]
for product in products:
    response = client.images.generate(
        model="dall-e-3",
        prompt=f"Product photo: {product}, white background",
        size="1024x1024"
    )
    save_image(response.data[0].url, f"{product}.png")
\`\`\`

**→ Proceed to Lesson 4: Stable Diffusion**` },
      { title: 'Stable Diffusion (Local)', content: `## Running Stable Diffusion Locally

### Hardware Requirements

| Level | GPU | VRAM |
|-------|-----|------|
| Minimum | GTX 1080 | 8GB |
| Recommended | RTX 3060 | 12GB |
| Optimal | RTX 4090 | 24GB |

### Installation (Automatic1111)

\`\`\`bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
./webui.sh  # Linux/Mac
webui-user.bat  # Windows
\`\`\`

### Prompting with Weights

\`\`\`
(cat:1.5)           # Strong emphasis
((cat))             # 1.1x per pair
[cat:0.8]           # Reduce influence
\`\`\`

### Negative Prompts (Essential!)

\`\`\`
(worst quality:1.4), (low quality:1.4), blurry, bad anatomy, 
bad hands, missing fingers, deformed
\`\`\`

### LoRA: Style Add-ons

\`\`\`
A woman, <lora:realistic_vision:0.7>, portrait photography
\`\`\`

### Key Settings

- **Sampler**: DPM++ 2M Karras
- **Steps**: 30-50
- **CFG Scale**: 7-9
- **Resolution**: Match model (512 or 1024)

**→ Proceed to Lesson 5: Workflows**` },
      { title: 'Production Workflows', content: `## Multi-Platform Strategy

### Workflow: Concept to Production

1. **Exploration** (Midjourney): 20-30 concepts, artistic
2. **Refinement** (DALL-E 3): Precise versions, text
3. **Production** (Stable Diffusion): Unlimited variations

### Automation Example

\`\`\`python
def generate_product_images(product):
    # Hero image via DALL-E API
    hero = generate_dalle(f"Product photo: {product}")
    
    # Variations via Stable Diffusion
    variations = []
    for bg in ["white", "marble", "lifestyle"]:
        variations.append(generate_sd(f"{product}, {bg} background"))
    
    return {"hero": hero, "variations": variations}
\`\`\`

### Quality Checklist

✅ Resolution matches target platform
✅ Consistent style across batch
✅ Text renders correctly
✅ No artifacts or errors
✅ File size optimized

### Best Practices

1. **Document prompts** that work
2. **Version control** your generations
3. **A/B test** different styles
4. **Track costs** per project
5. **Backup** successful prompts

## 🎉 Congratulations!

You can now create professional AI-generated images!

**Key Takeaways**:
- Choose tool based on use case
- Midjourney = art, DALL-E = precision, SD = freedom
- Combine tools strategically
- Document and iterate` },
    ]
  },
  'guide-fine-tuning-llms': {
    title: 'Fine-Tuning LLMs',
    description: 'Customize AI models for your specific use case.',
    topic: 'AI Engineering',
    lessons: [
      { title: 'Why Fine-Tune?', content: `## When to Fine-Tune LLMs

### Fine-Tuning vs Alternatives

| Approach | Best For |
|----------|----------|
| **Prompt Engineering** | Quick tasks, flexibility |
| **RAG** | Changing knowledge, citations |
| **Fine-Tuning** | Specific formats, domain adaptation |

### When to Fine-Tune

✅ Consistent output formats needed
✅ Domain-specific language/vocabulary
✅ Style and tone customization
✅ Efficiency at scale
✅ 1,000+ high-quality examples available

### When NOT to Fine-Tune

❌ Limited data (<100 examples)
❌ Task changes frequently
❌ Need reasoning about new information
❌ Prompt engineering works fine

### The LoRA Revolution

**Traditional fine-tuning**: Update all parameters (100+ GB VRAM)
**LoRA**: Update small adapter layers (6-16 GB VRAM)

\`\`\`
Full fine-tuning: 70B params = 1.1 TB memory
LoRA (r=16): 4M params = 16 GB memory
\`\`\`

**→ Proceed to Lesson 2: LoRA & QLoRA**` },
      { title: 'LoRA & QLoRA', content: `## Efficient Fine-Tuning

### LoRA: Low-Rank Adaptation

LoRA adds small trainable matrices instead of updating all weights:

\`\`\`
W' = W + BA
Where B × A << W in parameters
\`\`\`

**128x parameter reduction!**

### Key Hyperparameters

| Parameter | Effect | Typical |
|-----------|--------|---------|
| **Rank (r)** | Capacity | 16-64 |
| **Alpha (α)** | Update strength | 2× rank |
| **Target modules** | Which layers | q_proj, v_proj |

### QLoRA: Quantized LoRA

QLoRA adds 4-bit quantization:
- 4-bit NormalFloat (NF4) for weights
- Double quantization for constants
- Paged optimizers for memory spikes

**Memory comparison:**

| Model | Full FT | LoRA | QLoRA |
|-------|---------|------|-------|
| Llama-7B | 100 GB | 16 GB | **6 GB** |
| Llama-70B | 1.1 TB | 160 GB | **48 GB** |

### Configuration

\`\`\`python
from peft import LoraConfig

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)
\`\`\`

**→ Proceed to Lesson 3: Data Preparation**` },
      { title: 'Preparing Training Data', content: `## Data Quality = Success

### Data Sources

1. **Human annotation** (best quality, expensive)
2. **Synthetic generation** (GPT-4 generated)
3. **Existing datasets** (public data)
4. **Production logs** (successful interactions)

### Data Format

**Instruction format:**
\`\`\`json
{
  "instruction": "Summarize the text",
  "input": "Long article text...",
  "output": "Brief summary..."
}
\`\`\`

**Chat format:**
\`\`\`json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Question?"},
    {"role": "assistant", "content": "Answer."}
  ]
}
\`\`\`

### Data Cleaning

- Remove duplicates
- Normalize text
- Filter by length
- Validate format

### Recommended Sizes

| Task | Minimum | Recommended |
|------|---------|-------------|
| Classification | 100-500 | 1,000-5,000 |
| Generation | 1,000-5,000 | 10,000-50,000 |
| Domain Adaptation | 5,000-10,000 | 50,000+ |

**→ Proceed to Lesson 4: Training**` },
      { title: 'Training with Hugging Face', content: `## Complete Training Pipeline

### Setup

\`\`\`bash
pip install torch transformers peft datasets accelerate bitsandbytes
\`\`\`

### Load Model with QLoRA

\`\`\`python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

# QLoRA config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

# Load model
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config,
    device_map="auto"
)

# Apply LoRA
lora_config = LoraConfig(r=16, lora_alpha=32, ...)
model = get_peft_model(model, lora_config)
\`\`\`

### Training Arguments

\`\`\`python
from transformers import TrainingArguments

args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    evaluation_strategy="steps"
)
\`\`\`

### Train

\`\`\`python
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val
)

trainer.train()
trainer.save_model("./fine-tuned-model")
\`\`\`

**→ Proceed to Lesson 5: Evaluation & Deployment**` },
      { title: 'Evaluation & Deployment', content: `## Ensuring Quality

### Evaluation Metrics

**Classification**: Accuracy, F1, Precision, Recall
**Generation**: BLEU, ROUGE, Exact Match, LLM-as-Judge

### Capability Testing

Compare base vs fine-tuned on:
- Task-specific performance
- General knowledge (MMLU)
- Safety (toxicity, bias)

### Deployment Options

| Option | Pros | Cons |
|--------|------|------|
| **vLLM** | 10-20× faster | Setup complexity |
| **TGI** | HuggingFace native | Docker required |
| **FastAPI** | Full control | Manual optimization |

### vLLM Deployment

\`\`\`bash
python -m vllm.entrypoints.openai.api_server \\
    --model ./fine-tuned-model \\
    --port 8000
\`\`\`

\`\`\`python
import openai
client = openai.OpenAI(base_url="http://localhost:8000/v1")
response = client.chat.completions.create(
    model="fine-tuned-model",
    messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

### Monitoring

- Track latency and throughput
- Log requests and responses
- Monitor for drift
- Collect user feedback

## 🎉 Congratulations!

You can now fine-tune and deploy custom LLMs!

**Key Takeaways**:
- LoRA/QLoRA makes fine-tuning accessible
- Data quality > quantity
- Evaluate rigorously before deployment
- Monitor continuously in production` },
    ]
  },
  'guide-ai-excel-sheets': {
    title: 'AI for Excel & Google Sheets',
    description: 'Supercharge your spreadsheets with AI-powered formulas and analysis.',
    topic: 'Productivity',
    lessons: [
      { title: 'AI-Powered Formulas', content: `## Transform Natural Language into Formulas

### The Old Way vs AI Way

**Old Way:** Google "Excel formula for..." → Copy-paste → Hope it works

**AI Way:** Describe what you want → Get working formula → Understand why

### Using ChatGPT for Formulas

**Prompt Template:**
\`\`\`
I need an Excel formula that [describe what you want].
Column A has [data type], Column B has [data type].
Example: If A2 is greater than 100, return "High", otherwise "Low"
\`\`\`

**Example Prompts:**

1. **Conditional Logic:**
"I need a formula that returns 'Over Budget' if expenses (B2) exceed budget (C2), otherwise 'On Track'"

Result: \`=IF(B2>C2, "Over Budget", "On Track")\`

2. **Text Manipulation:**
"Extract the first name from full name in A2 (e.g., 'John Smith' → 'John')"

Result: \`=LEFT(A2, FIND(" ", A2)-1)\`

3. **Date Calculations:**
"Calculate working days between A2 (start date) and B2 (end date), excluding weekends"

Result: \`=NETWORKDAYS(A2, B2)\`

4. **Complex Lookups:**
"VLOOKUP alternative that can look left - find price in Column C based on product name in Column E"

Result: \`=INDEX(C:C, MATCH(E2, E:E, 0))\`

### Formula Optimization Tips

- Always validate AI-generated formulas
- Use cell references, not hardcoded values
- Test with edge cases
- Add error handling: IFERROR()
- Comment complex formulas: use N("comment")

**→ Proceed to Lesson 2: Built-in AI Features**` },
      { title: 'Microsoft Copilot & Gemini in Sheets', content: `## Native AI Features

### Microsoft Copilot in Excel (Microsoft 365)

**What It Does:**
- Generate formulas from natural language
- Analyze data and create insights
- Build charts and visualizations
- Highlight patterns and trends

**How to Use:**
1. Open Excel (Microsoft 365)
2. Click "Copilot" in the ribbon
3. Type: "Create a formula that calculates..."
4. Review and insert

**Example Commands:**
- "Add up all sales where region is West"
- "Highlight the top 10% of values"
- "Create a pivot table showing sales by month"
- "Identify outliers in this data"

### Google Duet AI in Sheets

**Features:**
- "Help me organize" for data structuring
- Formula suggestions
- Chart recommendations
- Data cleaning assistance

### Limitations

**Microsoft Copilot:**
- Requires Microsoft 365 subscription
- Works best with clean data
- Limited to 100K rows

**Google Duet AI:**
- Google Workspace Enterprise only
- Privacy considerations
- Region restrictions

### Alternative: SheetAI Add-on

Works with both Excel and Google Sheets:
1. Install SheetAI extension
2. Use =AI() functions directly
3. Example: =AI("Summarize this data", A1:A100)

**→ Proceed to Lesson 3: Data Analysis with AI**` },
      { title: 'Data Analysis with AI', content: `## Extract Insights Automatically

### ChatGPT for Data Analysis

**Pattern 1: Paste Data Directly**
\`\`\`
Here's my sales data:
Month | Sales | Costs
Jan   | 5000  | 3000
Feb   | 6000  | 3500
...

Questions:
1. What's the profit margin trend?
2. Which month had best performance?
3. Any anomalies?
\`\`\`

**Pattern 2: Describe Data Structure**
\`\`\`
I have a spreadsheet with:
- 1000 rows of customer data
- Columns: Name, Email, Purchase Date, Amount, Product
- Want to: Identify top customers by frequency and value

What formulas/analysis should I do?
\`\`\`

### Analysis Techniques

**1. Summary Statistics**
Ask AI: "Create formulas to calculate mean, median, mode, and standard deviation for column B"

**2. Trend Analysis**
Ask AI: "How do I calculate month-over-month growth rate for my sales data?"

**3. Segmentation**
Ask AI: "Create a formula to categorize customers into High/Medium/Low based on purchase amount"

**4. Forecasting**
Ask AI: "Use LINEST or FORECAST to predict next month's sales"

### Visualization Recommendations

Ask AI:
- "What's the best chart type to show [data]?"
- "Create a histogram formula for age distribution"
- "Build a dynamic dashboard layout"

**→ Proceed to Lesson 4: Automation**` },
      { title: 'Automating Reports & Dashboards', content: `## AI-Powered Reporting

### Automated Report Generation

**Step 1: Define Report Structure**
\`\`\`
Create a monthly report template with:
1. Executive Summary (auto-generated summary)
2. Key Metrics (formulas)
3. Trends (charts)
4. Action Items (AI suggestions)
\`\`\`

**Step 2: Build Dynamic Elements**
- Use TODAY() for automatic dates
- Use SUMIFS/COUNTIFS for dynamic filtering
- Use ARRAYFORMULA for bulk operations

**Step 3: Connect to AI for Insights**

Use Zapier or Make.com to:
1. Trigger on schedule
2. Send data to ChatGPT API
3. Generate summary
4. Update spreadsheet

### Dashboard Best Practices

**Layout:**
- Top: KPI summary (3-5 metrics)
- Middle: Trend charts
- Bottom: Detailed tables

**AI-Generated Elements:**
- Auto-refresh summaries
- Anomaly alerts
- Predictive indicators
- Smart recommendations

### Example: Weekly Sales Report

\`\`\`
# Prompt for AI
Analyze this week's sales data:
- Total revenue: $XX
- Top product: XX
- Growth vs last week: XX%

Provide a 2-sentence executive summary.
Suggest 3 action items based on the data.
\`\`\`

### Tools for Advanced Automation

- **Coefficient:** AI-powered data syncing
- **Rows.com:** Built-in AI integrations
- **Sourcetable:** AI-native spreadsheet
- **Formula Bot:** Formula generation

## 🎉 Congratulations!

You can now use AI to supercharge your spreadsheets!

**Key Skills:**
- ✅ Generate formulas from natural language
- ✅ Use built-in AI features
- ✅ Analyze data with AI assistance
- ✅ Automate reports and dashboards

**Next Steps:**
- Explore the AI Email Automation guide
- Learn about AI Meeting Assistants
- Master No-Code AI Apps` },
    ]
  },
  'guide-ai-email-automation': {
    title: 'AI Email Automation',
    description: 'Automate your inbox and write better emails faster.',
    topic: 'Productivity',
    lessons: [
      { title: 'AI Email Tools Overview', content: `## The AI Email Revolution

### Why AI for Email?

The average professional spends **28% of their day** on email. AI can cut that in half.

### Top AI Email Tools

| Tool | Best For | Price |
|------|----------|-------|
| **Superhuman** | Speed, keyboard shortcuts | $30/mo |
| **Shortwave** | Gmail AI assistant | Free-$9/mo |
| **HEY** | Email restructuring | $12/mo |
| **Spark** | Team collaboration | Free |
| **Gmail AI** | Built-in writing help | Free |
| **Outlook Copilot** | Microsoft 365 users | Included |

### Key Features to Look For

✅ **Smart Compose** - AI suggestions while typing
✅ **Email Summarization** - TL;DR for long threads
✅ **Scheduled Sending** - Send at optimal times
✅ **Follow-up Reminders** - Never miss a reply
✅ **Categorization** - Auto-sort incoming mail
✅ **Template Generation** - AI-written responses

### Gmail Built-in AI

**Smart Compose:**
Start typing and press Tab to accept suggestions

**Smart Reply:**
Quick one-click responses at bottom of emails

**Help Me Write (Gemini):**
Click the sparkle icon → Describe what you need → Generate

**→ Proceed to Lesson 2: Composing Emails**` },
      { title: 'Automating Email Composition', content: `## Write Better Emails Faster

### The 3-Step AI Email Workflow

**1. Draft Generation**
\`\`\`
Prompt: Write a professional email to [recipient] about [topic].
Tone: [Formal/Casual/Friendly]
Key points to include:
- Point 1
- Point 2
- Point 3
\`\`\`

**2. Refinement**
\`\`\`
Make this email more concise
Add a clear call-to-action
Make it sound more [tone]
\`\`\`

**3. Polish**
\`\`\`
Check for clarity and professionalism
Suggest a subject line
Add appropriate greeting/closing
\`\`\`

### Email Templates with AI

**Follow-up Email:**
\`\`\`
Write a follow-up email to [Name] about our meeting on [date].
Reference our discussion about [topic].
Ask about next steps.
Keep it brief and professional.
\`\`\`

**Introduction Email:**
\`\`\`
Write an introduction email connecting [Person A] with [Person B].
Explain why they should connect (both work in X industry).
Suggest a coffee chat or call.
\`\`\`

**Request Email:**
\`\`\`
Write a polite email requesting [specific request] from [recipient].
Explain why it's needed and the deadline.
Offer to provide more information.
\`\`\`

### ChatGPT for Email

Create a dedicated conversation for email drafting:
1. Set context: "You are my email assistant. Help me write professional, concise emails."
2. Paste emails you receive: "Draft a response to this: [paste]"
3. Iterate: "Make it shorter/more formal/add detail"

**→ Proceed to Lesson 3: Smart Replies**` },
      { title: 'Smart Replies & Follow-ups', content: `## Never Miss a Response

### AI-Powered Quick Replies

**How They Work:**
1. AI analyzes incoming email
2. Generates 3 relevant responses
3. One click to send

**Best Practices:**
- Customize before sending
- Match the sender's tone
- Add specific details

### Follow-up Automation

**Tools with Smart Follow-ups:**
- **Superhuman:** Auto-remind if no reply in X days
- **Boomerang:** Schedule follow-ups automatically
- **Mixmax:** Track opens and set reminders

### Creating Follow-up Rules

**Rule 1: No Response in 3 Days**
\`\`\`
Hi [Name],

Following up on my previous email about [topic].
Let me know if you need any additional information.

Best,
[Your name]
\`\`\`

**Rule 2: After Meeting**
\`\`\`
Hi [Name],

Great meeting today! Here's a quick summary:
- [Point 1]
- [Point 2]

Next steps:
- [Action item]

Let me know if I missed anything.
\`\`\`

### Avoiding Follow-up Fatigue

✅ Maximum 2 follow-ups per thread
✅ Add value each time (don't just "checking in")
✅ Set reminders, not auto-sends
✅ Know when to move on

**→ Proceed to Lesson 4: Cold Outreach**` },
      { title: 'Cold Outreach Automation', content: `## Personalization at Scale

### The AI Cold Outreach Framework

**Don't:** Send generic templates
**Do:** Use AI to personalize every message

### Step 1: Research Automation

Use AI to research prospects:
\`\`\`
Research [Company Name] and [Person Name].
Find:
- Recent news/announcements
- LinkedIn activity
- Company initiatives
- Personal interests

Provide 3 personalization angles.
\`\`\`

### Step 2: Personalized Templates

\`\`\`
Write a cold email to [Name], [Title] at [Company].

Personalization hooks:
- Mention their recent [article/post/achievement]
- Reference [company initiative]
- Connect to their role in [area]

Offer: [Your value proposition]

Keep it under 100 words.
No buzzwords.
End with a question.
\`\`\`

### Step 3: A/B Testing with AI

Generate multiple versions:
\`\`\`
Create 3 subject line variations for:
[Your value proposition]

Variation 1: Direct
Variation 2: Question
Variation 3: Curiosity-driven
\`\`\`

### Tools for Scale

| Tool | Use Case |
|------|----------|
| **Lavender** | Email scoring + AI suggestions |
| **Apollo** | Prospecting + personalization |
| **Lemlist** | Automated campaigns |
| **Instantly** | Cold email at scale |

### Best Practices

✅ Personalize first sentence
✅ Keep emails under 125 words
✅ One clear CTA
✅ Mobile-optimized
✅ Send Tuesday-Thursday, 8-10am

### Response Rate Benchmarks

- **Generic cold email:** 1-2%
- **Personalized cold email:** 5-15%
- **Hyper-personalized with AI:** 15-30%

## 🎉 Congratulations!

You can now automate your email workflow with AI!

**Key Skills:**
- ✅ Use AI email tools effectively
- ✅ Draft emails with AI assistance
- ✅ Automate follow-ups
- ✅ Personalize cold outreach at scale

**Next Steps:**
- Set up your email automation workflow
- Create AI-powered templates
- Track and optimize response rates` },
    ]
  },
  'guide-ai-meeting-assistants': {
    title: 'AI Meeting Assistants',
    description: 'Never miss a meeting detail with AI-powered transcription and summaries.',
    topic: 'Productivity',
    lessons: [
      { title: 'Why AI Meeting Assistants?', content: `## The Meeting Problem

**Before AI:**
- Take manual notes → Miss key points
- Zone out → Lose context
- Action items forgotten → Follow-ups fail

**After AI:**
- Full transcription → Nothing missed
- AI summaries → Key points highlighted
- Auto action items → Accountability built-in

### What AI Meeting Assistants Do

| Feature | Benefit |
|---------|---------|
| **Transcription** | Full text of everything said |
| **Summarization** | TL;DR of long meetings |
| **Action Items** | Auto-extracted tasks |
| **Speaker ID** | Know who said what |
| **Search** | Find any conversation |
| **Integration** | Sync with calendars, CRMs |

### ROI of Meeting Assistants

- **Time saved:** 30-60 min/week per person
- **Accuracy:** 95%+ capture rate
- **Follow-through:** 3x better action item completion
- **Searchability:** Find any past conversation in seconds

**→ Proceed to Lesson 2: Tool Comparison**` },
      { title: 'Otter.ai & Fireflies Overview', content: `## Top Meeting AI Tools

### Otter.ai

**Best For:** Real-time transcription, collaboration

**Features:**
- Live transcription during meetings
- Speaker identification
- Automated summary
- Keyword search
- Integration: Zoom, Google Meet, Teams
- Mobile app for in-person meetings

**Pricing:**
- Free: 300 min/month
- Pro: $16.99/mo (6,000 min)
- Business: $30/user/mo

**Standout Feature:** OtterPilot auto-joins meetings and takes notes

### Fireflies.ai

**Best For:** Teams, CRM integration

**Features:**
- Transcription + AI summaries
- Sentiment analysis
- Action item extraction
- CRM sync (Salesforce, HubSpot)
- Collaboration tools
- Custom vocabulary

**Pricing:**
- Free: 800 min/month
- Pro: $18/mo (unlimited)
- Business: $29/user/mo

**Standout Feature:** Native integrations with 50+ apps

### Comparison

| Feature | Otter.ai | Fireflies |
|---------|----------|-----------|
| Real-time | ✅ Best | ✅ Good |
| CRM Integration | Basic | ✅ Excellent |
| Collaboration | ✅ Excellent | Good |
| Search | ✅ Excellent | Good |
| Mobile App | ✅ Yes | No |
| In-person | ✅ Yes | No |

### Other Options

- **Rev:** Human transcription (99% accuracy)
- **Trint:** Editor-focused
- **Gong:** Sales-specific
- **Avoma:** All-in-one meeting intelligence

**→ Proceed to Lesson 3: Using Effectively**` },
      { title: 'Meeting Summaries & Action Items', content: `## Getting the Most from AI Notes

### Setting Up for Success

**Before the Meeting:**
1. Connect calendar (auto-join enabled)
2. Add custom vocabulary (names, acronyms)
3. Set meeting type for better summaries

**During the Meeting:**
- Speak clearly
- Use names when referencing people
- State action items explicitly: "Action item for Sarah:..."

**After the Meeting:**
- Review summary (2 min)
- Verify action items
- Share with attendees
- Tag for future reference

### Summary Best Practices

**What AI Captures Well:**
✅ Decisions made
✅ Topics discussed
✅ Action items
✅ Questions raised
✅ Key points per speaker

**What Needs Human Review:**
⚠️ Nuanced agreements
⚠️ Off-record comments
⚠️ Emotional context
⚠️ Confidential details

### Action Item Extraction

**Explicit Format (Better):**
"Action item for John: Send proposal by Friday"
→ AI captures: ✅ John → Send proposal → Friday

**Implicit Format (Worse):**
"John, can you send the proposal?"
→ AI might miss: ⚠️

### Customizing Summaries

**In Otter:**
Click "Summary" → Edit → Add context

**In Fireflies:**
Use meeting templates for consistent format

### Search Tips

Search for:
- "action items" → All tasks
- "[Name]" → Their contributions
- "[Keyword]" → Topic mentions
- "decision" → Decisions made

**→ Proceed to Lesson 4: Integration & Best Practices**` },
      { title: 'Integration & Best Practices', content: `## Connect to Your Workflow

### Calendar Integration

**Google Calendar:**
1. Install Otter/Fireflies add-on
2. Enable auto-join for all meetings
3. Set rules (skip 1:1s, join external only)

**Outlook:**
1. Add plugin to Outlook
2. Configure meeting rules
3. Enable auto-transcription

### CRM Integration

**Fireflies → Salesforce:**
- Auto-log call notes
- Update opportunity fields
- Create follow-up tasks

**Fireflies → HubSpot:**
- Sync meeting notes to contacts
- Track engagement
- Update deal stages

### Slack/Teams Integration

**Post-meeting auto-post:**
\`\`\`
📋 Meeting: Weekly Standup
📅 Duration: 30 min
👥 Attendees: 8

Summary:
- Discussed Q3 priorities
- Identified blocker: API delay
- Next: Review on Thursday

Action Items:
- @Sarah: Update docs
- @Mike: Fix API issue
\`\`\`

### Team Best Practices

**Rollout:**
1. Start with pilot team
2. Create usage guidelines
3. Train on features
4. Gather feedback
5. Expand to company

**Guidelines:**
- Inform attendees of recording
- Review notes within 24 hours
- Don't replace active listening
- Use for async updates

### Privacy Considerations

✅ Always announce recording
✅ Get consent when required
✅ Redact sensitive info
✅ Set retention policies
✅ Control access permissions

## 🎉 Congratulations!

You can now use AI meeting assistants to never miss a detail!

**Key Skills:**
- ✅ Choose the right tool
- ✅ Set up integrations
- ✅ Extract action items
- ✅ Follow best practices

**Next Steps:**
- Try Otter.ai or Fireflies free tier
- Enable calendar integration
- Share summaries with your team` },
    ]
  },
  'guide-nocode-ai-apps': {
    title: 'Building No-Code AI Apps',
    description: 'Create AI-powered applications without writing code.',
    topic: 'Productivity',
    lessons: [
      { title: 'No-Code AI Platforms Overview', content: `## Build AI Apps Without Code

### Why No-Code + AI?

- **Speed:** Ideas to apps in days, not months
- **Cost:** Fraction of developer costs
- **Accessibility:** Anyone can build
- **Flexibility:** Iterate quickly

### Top No-Code AI Platforms

| Platform | Best For | Learning Curve |
|----------|----------|----------------|
| **Bubble** | Complex web apps | Medium |
| **Softr** | Simple websites | Easy |
| **Glide** | Mobile apps | Easy |
| **FlutterFlow** | Native apps | Medium |
| **Retool** | Internal tools | Medium |
| **Glide** | Database apps | Easy |

### AI-Ready Platforms

**Built-in AI:**
- Softr (OpenAI integration)
- Glide (AI components)
- Bubble (API connectors)

**API-Friendly:**
- All major platforms support API calls
- Connect to OpenAI, Claude, Gemini
- Use webhooks for automation

### What You Can Build

✅ AI chatbots
✅ Content generators
✅ Data analysis dashboards
✅ Customer support tools
✅ Personalized recommendation engines
✅ AI-powered forms and surveys

**→ Proceed to Lesson 2: Connecting AI APIs**` },
      { title: 'Connecting AI APIs to No-Code Tools', content: `## API Integration Basics

### What You'll Need

1. **API Key** from AI provider (OpenAI, Anthropic, etc.)
2. **No-code platform** with API support
3. **Basic understanding** of API calls

### OpenAI API Setup

**Step 1: Get API Key**
1. Go to platform.openai.com
2. Create API key
3. Save securely (you won't see it again)

**Step 2: Test with Postman**
\`\`\`
POST https://api.openai.com/v1/chat/completions
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "Hello!"}]
}
\`\`\`

### Connecting to Bubble

**Method 1: API Connector Plugin**
1. Install API Connector
2. Add new API call
3. Set endpoint and headers
4. Test and use in workflows

**Method 2: Bubble's Native AI**
1. Enable AI features in settings
2. Use AI actions in workflows
3. Configure prompts and models

### Connecting to Softr

**Using Zapier:**
1. Trigger: Softr form submission
2. Action: OpenAI API call
3. Response: Update Softr record

**Using Make.com:**
1. Create scenario
2. Add OpenAI module
3. Connect to Softr via API

### Best Practices

✅ Never expose API keys in client-side code
✅ Use environment variables
✅ Implement rate limiting
✅ Cache common responses
✅ Monitor API costs

**→ Proceed to Lesson 3: AI Chatbots Without Code**` },
      { title: 'Building AI Chatbots Without Code', content: `## No-Code Chatbot Platforms

### Dedicated Chatbot Builders

**Voiceflow**
- Visual conversation designer
- AI/NLU built-in
- Multi-channel deployment
- Free tier available

**Botpress**
- Open-source option
- Visual flow builder
- NLU integration
- Self-host or cloud

**Dante AI**
- Train on your data
- Embeddable widget
- Simple setup
- Good for customer support

### Building with Voiceflow

**Step 1: Create Project**
- Choose template or blank
- Define personality and tone

**Step 2: Design Conversation**
- Use visual blocks
- Add AI responses
- Create decision trees

**Step 3: Add Knowledge Base**
- Upload documents
- Add FAQs
- Connect to website

**Step 4: Test & Deploy**
- Preview in browser
- Embed on website
- Connect to channels

### Building with Bubble + OpenAI

**Architecture:**
\`\`\`
User Input → Bubble → OpenAI API → Response → Display
\`\`\`

**Key Components:**
1. Input field (chat interface)
2. API call to OpenAI
3. Response display
4. Conversation history (database)

### Chat with Your Data

**Using Embeddings:**
1. Upload documents to Pinecone/Weaviate
2. User query → Find relevant chunks
3. Send to OpenAI with context
4. Return grounded response

**No-Code Options:**
- CustomGPT.ai
- Dante AI
- Chaindesk
- Flowise (visual builder)

**→ Proceed to Lesson 4: Deploying AI Apps**` },
      { title: 'Deploying AI Apps', content: `## From Build to Production

### Pre-Launch Checklist

✅ Test all user flows
✅ Check API rate limits
✅ Set up error handling
✅ Configure analytics
✅ Add privacy policy
✅ Test on mobile
✅ Set up monitoring

### Hosting Options

**For Web Apps:**

| Platform | Best For |
|----------|----------|
| **Bubble** | Hosted on Bubble |
| **Softr** | Hosted on Softr |
| **Webflow** | Marketing sites |
| **Vercel** | Custom deployments |

**For Mobile Apps:**
- **Glide:** Instant PWA
- **FlutterFlow:** App Store + Play Store
- **Adalo:** Direct app store publishing

### Custom Domain Setup

**Bubble:**
1. Settings → Domain
2. Add custom domain
3. Update DNS records
4. Enable SSL

**Softr:**
1. Settings → Custom Domain
2. Add CNAME record
3. Wait for propagation

### Scaling Considerations

**Performance:**
- Implement caching
- Optimize API calls
- Use pagination for lists
- Add loading states

**Cost Management:**
- Monitor API usage
- Set spending limits
- Cache AI responses
- Use cheaper models when possible

### Analytics & Monitoring

**Tools:**
- Google Analytics (traffic)
- Mixpanel (user behavior)
- Sentry (errors)
- Custom dashboards (API usage)

### Maintenance

**Weekly:**
- Check error logs
- Review API costs
- Monitor user feedback

**Monthly:**
- Update dependencies
- Review performance
- Plan feature improvements

## 🎉 Congratulations!

You can now build AI-powered apps without writing code!

**Key Skills:**
- ✅ Choose the right no-code platform
- ✅ Connect AI APIs
- ✅ Build AI chatbots
- ✅ Deploy and scale

**Next Steps:**
- Start with a simple project
- Try Voiceflow for chatbots
- Experiment with Bubble for apps
- Join no-code communities` },
    ]
  },
  'guide-github-copilot-deep-dive': {
    title: 'GitHub Copilot Deep Dive',
    description: 'Master AI pair programming with GitHub Copilot advanced techniques.',
    topic: 'Development',
    lessons: [
      { title: 'Beyond Basic Autocomplete', content: `## Advanced Copilot Techniques

### Context Awareness

Copilot understands:
- Open files in your editor
- Function signatures
- Variable names and types
- Comments and documentation
- Import statements

**Tip:** Keep relevant files open for better suggestions

### Multi-Line Suggestions

**Trigger:**
1. Write a comment describing what you want
2. Press Tab to accept
3. Continue pressing Tab for more lines

**Example:**
\`\`\`python
# Function to validate email address and extract domain
\`\`\`
↓ Copilot generates complete function

### Pattern Recognition

Copilot learns your patterns:
- Naming conventions
- Error handling style
- Comment style
- Code structure

**Tip:** Write consistent code for better suggestions

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Tab\` | Accept suggestion |
| \`Esc\` | Dismiss |
| \`Alt + ]\` | Next suggestion |
| \`Alt + [\` | Previous suggestion |
| \`Ctrl + Enter\` | Open panel (10 suggestions) |

### Improving Suggestions

**Bad Prompt:**
\`\`\`javascript
function processData(data) {
  // copilot fills this
}
\`\`\`

**Good Prompt:**
\`\`\`javascript
// Process user data array, filter inactive users,
// calculate average age, return stats object
function processData(data) {
\`\`\`

**→ Proceed to Lesson 2: Copilot Chat**` },
      { title: 'Copilot Chat & Commands', content: `## Conversational Coding

### What is Copilot Chat?

Inline AI assistant that can:
- Answer questions
- Explain code
- Suggest improvements
- Generate tests
- Debug issues

### Accessing Copilot Chat

**VS Code:**
- \`Ctrl + Shift + P\` → "GitHub Copilot Chat"
- Or click Chat icon in sidebar

**Commands:**

| Command | Use |
|---------|-----|
| \`/explain\` | Explain selected code |
| \`/tests\` | Generate unit tests |
| \`/fix\` | Fix problems in code |
| \`/docs\` | Generate documentation |
| \`/simplify\` | Simplify complex code |

### Slash Commands in Action

**Explain Code:**
\`\`\`
/explain How does this regex work?
\`\`\`

**Generate Tests:**
\`\`\`
/tests for this function using Jest
\`\`\`

**Fix Issues:**
\`\`\`
/fix The function returns undefined for empty arrays
\`\`\`

### Inline Chat

**Trigger:** \`Ctrl + I\` (Windows) or \`Cmd + I\` (Mac)

**Use Cases:**
- Quick questions without sidebar
- Iterative refinement
- Context-specific help

**Example Flow:**
1. Select code
2. Press \`Ctrl + I\`
3. "Add error handling"
4. Review suggestion
5. "Also log errors to console"
6. Accept final version

### Chat vs Autocomplete

| Feature | Autocomplete | Chat |
|---------|--------------|------|
| Speed | Instant | Slower |
| Context | Current file | Entire project |
| Interaction | One-way | Conversational |
| Best For | Writing code | Understanding/debugging |

**→ Proceed to Lesson 3: Multi-file Context**` },
      { title: 'Multi-file Context & Patterns', content: `## Project-Wide Understanding

### How Copilot Understands Projects

Copilot analyzes:
- File structure
- Import relationships
- Shared types/interfaces
- Common patterns

### Best Practices for Context

**1. Organize Files Logically**
\`\`\`
src/
  components/
    Button.tsx
    Input.tsx
  utils/
    helpers.ts
  types/
    index.ts
\`\`\`

**2. Use Consistent Naming**
- Same patterns across files
- Clear function names
- Descriptive variables

**3. Add Type Definitions**
\`\`\`typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
\`\`\`

Copilot will use these types across all files.

### Cross-File Patterns

**React + TypeScript:**
\`\`\`typescript
// Component file
import { User } from '../types';

export function UserCard({ user }: { user: User }) {
  // Copilot knows User type
}
\`\`\`

### Project Rules for Copilot

**Create .github/copilot-instructions.md:**
\`\`\`markdown
# Project Conventions

## Naming
- Use camelCase for variables
- Use PascalCase for components
- Prefix handlers with 'handle'

## Patterns
- Use async/await over .then()
- Prefer functional components
- Use Tailwind CSS classes

## Testing
- Use Jest + React Testing Library
- Test file: Component.test.tsx
\`\`\`

### Improving Multi-file Context

✅ Keep related files open
✅ Use consistent patterns
✅ Document conventions
✅ Share types across files
✅ Use descriptive imports

**→ Proceed to Lesson 4: Team Workflows**` },
      { title: 'Team Workflows & Best Practices', content: `## Copilot in Teams

### Code Review with Copilot

**Reviewer Perspective:**
- Copilot suggestions aren't always right
- Review for security, not just functionality
- Check for consistent style
- Verify edge cases

**Author Perspective:**
- Don't blindly accept suggestions
- Add comments for complex logic
- Test generated code
- Explain non-obvious choices

### Security Considerations

**Don't Let Copilot Generate:**
- ❌ Passwords or secrets
- ❌ Authentication logic (without review)
- ❌ Encryption implementations
- ❌ SQL queries (without sanitization)
- ❌ API keys in code

**Do Review For:**
- ✅ Input validation
- ✅ Error handling
- ✅ SQL injection risks
- ✅ XSS vulnerabilities
- ✅ Hardcoded values

### Team Guidelines

**Create a team standard:**

\`\`\`markdown
# Copilot Usage Guidelines

## When to Use
- Boilerplate code
- Standard patterns
- Test generation
- Documentation

## When to Avoid
- Security-critical code
- Novel algorithms
- Business logic
- Complex state management

## Code Review
- All Copilot code must be reviewed
- Add comment if logic is Copilot-generated
- Test edge cases
\`\`\`

### Training the Team

**Week 1:** Basic usage (autocomplete, comments)
**Week 2:** Chat commands (/explain, /tests)
**Week 3:** Advanced patterns
**Week 4:** Team conventions + review

### Measuring Productivity

**Metrics:**
- Time to write boilerplate
- Code review time
- Bug count
- Developer satisfaction

### Common Pitfalls

❌ Over-reliance (accepting without reading)
❌ Inconsistent style (letting Copilot dictate)
❌ Security blindness (not reviewing generated code)
❌ Skill atrophy (not learning fundamentals)

## 🎉 Congratulations!

You're now a Copilot power user!

**Key Skills:**
- ✅ Advanced autocomplete techniques
- ✅ Using Copilot Chat effectively
- ✅ Multi-file context optimization
- ✅ Team workflows and security

**Next Steps:**
- Create team guidelines
- Practice advanced techniques
- Share tips with colleagues` },
    ]
  },
  'guide-windsurf-ide': {
    title: 'Windsurf IDE by Codeium',
    description: 'The AI-native code editor for next-generation development.',
    topic: 'Development',
    lessons: [
      { title: 'What is Windsurf?', content: `## The AI-Native Code Editor

### Windsurf vs Traditional Editors

| Feature | VS Code | Windsurf |
|---------|---------|----------|
| AI Integration | Extension | Native |
| Context Awareness | File-level | Project-level |
| Chat | Sidebar | Inline |
| Code Generation | Suggestions | Full functions |
| Learning Curve | Familiar | New paradigm |

### Key Features

**Cascade:** Codeium's AI engine
- Project-wide understanding
- Multi-file editing
- Contextual suggestions
- Natural language commands

**Chat:** Inline AI assistant
- Ask questions about code
- Generate entire features
- Debug with AI
- Explain complex code

**Supercomplete:** Advanced autocomplete
- Predicts full implementations
- Understands patterns
- Learns your style

### Installation

**Download:** codeium.com/windsurf

**Platforms:**
- macOS (Intel + Apple Silicon)
- Windows
- Linux

**Setup:**
1. Download installer
2. Sign in with GitHub/Google
3. Import VS Code settings (optional)
4. Start coding!

**→ Proceed to Lesson 2: AI Features**` },
      { title: 'AI Features & Cascade', content: `## Cascade: The AI Engine

### How Cascade Works

1. **Indexing:** Analyzes entire codebase
2. **Understanding:** Maps relationships
3. **Predicting:** Anticipates your needs
4. **Generating:** Creates context-aware code

### Cascade Commands

**Natural Language to Code:**
\`\`\`
Create a React component for user profile with:
- Avatar image
- Name and email display
- Edit button
- Responsive design
\`\`\`

Cascade generates complete, styled component.

**Multi-File Operations:**
\`\`\`
Add authentication to this app:
- Login page
- Auth context
- Protected routes
- API middleware
\`\`\`

Cascade creates all necessary files.

### Supercomplete

**Trigger:** Just start typing

**Example:**
\`\`\`typescript
function calculate
\`\`\`

Supercomplete suggests:
\`\`\`typescript
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
\`\`\`

Based on your project's types!

### Code Actions

**Right-click menu:**
- "Cascade: Explain this"
- "Cascade: Generate tests"
- "Cascade: Refactor"
- "Cascade: Document"

### Comparison to Copilot

| Feature | Copilot | Cascade |
|---------|---------|---------|
| Context | Open files | Full project |
| Generation | Line-by-line | Full functions |
| Chat | Separate panel | Inline |
| Customization | Limited | Extensive |

**→ Proceed to Lesson 3: Workflow Integration**` },
      { title: 'Workflow Integration', content: `## Integrating Windsurf into Your Workflow

### Git Integration

**Built-in Git:**
- Source control panel
- Diff viewer
- Commit from editor
- Branch management

**AI + Git:**
\`\`\`
Cascade: Write a commit message for these changes
\`\`\`

### Terminal Integration

**Built-in Terminal:**
- Multiple tabs
- Split view
- AI commands in terminal

**Example:**
\`\`\`bash
# Ask Cascade to help with command
cascade "How do I undo the last commit but keep changes?"
\`\`\`

### Extensions

**Compatible with:**
- VS Code extensions
- Codeium extensions
- Custom plugins

**Essential Extensions:**
- GitLens
- Prettier
- ESLint
- Your theme of choice

### Project Setup

**Recommended Structure:**
\`\`\`
project/
├── .cascade/
│   └── instructions.md  # Custom instructions
├── src/
├── tests/
└── README.md
\`\`\`

**Cascade Instructions:**
\`\`\`markdown
# Project Instructions

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS

## Conventions
- Functional components
- Arrow functions
- Named exports

## Patterns
- Use React Query for data fetching
- Zod for validation
\`\`\`

**→ Proceed to Lesson 4: Tips & Tricks**` },
      { title: 'Tips & Tricks', content: `## Windsurf Productivity Hacks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Cmd + K\` | Open Cascade chat |
| \`Cmd + I\` | Inline edit |
| \`Tab\` | Accept suggestion |
| \`Cmd + /\` | Toggle comment |
| \`Cmd + P\` | Quick open |

### Cascade Prompting Tips

**Be Specific:**
❌ "Add a button"
✅ "Add a primary button with Tailwind classes, calls handleSubmit on click, shows loading state"

**Provide Context:**
❌ "Fix this error"
✅ "Fix the TypeScript error in UserService.ts line 45, the type mismatch between User and UserDTO"

**Iterate:**
\`\`\`
You: Create a form component
Cascade: [generates form]
You: Add validation with Zod
Cascade: [updates with validation]
You: Add error display
Cascade: [adds error UI]
\`\`\`

### Performance Tips

**Speed Up Indexing:**
- Exclude node_modules
- Limit large files
- Use .cascadeignore

**.cascadeignore:**
\`\`\`
node_modules/
dist/
build/
*.min.js
*.lock
\`\`\`

### Common Workflows

**New Feature:**
1. Describe feature to Cascade
2. Review generated code
3. Test and iterate
4. Commit with AI message

**Bug Fix:**
1. Paste error message
2. Ask Cascade to explain
3. Request fix suggestions
4. Test solution

**Refactoring:**
1. Select code
2. "Cascade: Refactor for readability"
3. Review changes
4. Test functionality

### Hidden Features

- **Voice Commands:** Dictate to Cascade (experimental)
- **Multi-Cursor AI:** Edit multiple locations simultaneously
- **Codebase Search:** AI-powered semantic search

## 🎉 Congratulations!

You're ready to use Windsurf like a pro!

**Key Skills:**
- ✅ Understanding Cascade AI
- ✅ Using AI features effectively
- ✅ Integrating with your workflow
- ✅ Productivity shortcuts

**Next Steps:**
- Download Windsurf
- Try Cascade on your project
- Customize for your workflow` },
      { 
        title: 'Troubleshooting & Common Issues', 
        content: `## 🚨 Common Windsurf Errors & Solutions

### Error 1: "Windsurf won't open" or "Application is damaged" (macOS)

**Full Error:**
> "Windsurf" is damaged and can't be opened. You should move it to the Trash.

**Cause:** macOS Gatekeeper blocking the application

**Solution:**
\`\`\`bash
# Option 1: Remove quarantine attribute
xattr -cr /Applications/Windsurf.app

# Option 2: Allow in System Settings
# System Settings → Privacy & Security → Scroll down → Click "Open Anyway"

# Option 3: Re-download from official site
# Go to codeium.com/windsurf → Download fresh copy
\`\`\`

---

### Error 2: "Cascade not responding" or "AI features unavailable"

**Symptoms:**
- Cascade chat doesn't respond
- No code suggestions appear
- "Connection error" in chat

**Cause:** Not signed in, API limit reached, network issue, or server outage

**Solution:**
\`\`\`
1. Check if signed in:
   - Click profile icon in top-right
   - Sign in with GitHub/Google/Email

2. Check your plan limits:
   - Free tier has usage limits
   - Check at codeium.com/pricing

3. Verify network:
   - Try different network
   - Disable VPN temporarily
   - Check firewall settings

4. Check server status:
   - codeium.com/status
   - Check for outages

5. Restart Windsurf:
   - Fully quit (Cmd/Ctrl + Q)
   - Reopen
\`\`\`

---

### Error 3: "Indexing failed" or "Codebase not understanding context"

**Full Error:**
> Cascade doesn't seem to understand my project

**Cause:** Codebase not properly indexed, or too large

**Solution:**
\`\`\`
1. Check indexing status:
   - Click Windsurf icon in status bar
   - View "Indexing Status"

2. Force reindex:
   - Cmd/Ctrl + Shift + P
   - "Windsurf: Reindex Codebase"

3. Exclude large folders:
   # Settings.json
   "windsurf.indexing.exclude": [
     "**/node_modules/**",
     "**/dist/**",
     "**/build/**",
     "**/.git/**"
   ]

4. Add Cascade instructions:
   # Create .cascade/instructions.md
   # Describe your project architecture
   # This helps Cascade understand context

5. Limit index size:
   "windsurf.indexing.maxFileSize": 1000000
\`\`\`

---

### Error 4: "Supercomplete not working" or no suggestions

**Cause:** Feature disabled, context issue, or performance mode

**Solution:**
\`\`\`
1. Check if Supercomplete is enabled:
   - Settings → "Windsurf: Supercomplete"
   - Ensure it's ON

2. Trigger manually:
   - Start typing and wait 500ms
   - Or press specific trigger key

3. Check file type:
   - Some file types may not support Supercomplete
   - Try in a .js/.ts/.py file

4. Restart Windsurf:
   - Cmd/Ctrl + Q to fully quit
   - Reopen
\`\`\`

---

### Error 5: "Sign in failed" or "Authentication error"

**Full Error:**
> Authentication failed. Please try again.

**Cause:** Session expired, OAuth issue, or account problem

**Solution:**
\`\`\`
1. Sign out completely:
   - Click profile → Sign Out
   - Close Windsurf
   - Reopen and sign in

2. Clear auth cache:
   # macOS/Linux
   rm -rf ~/.windsurf/auth*
   # Windows
   del %USERPROFILE%\\.windsurf\\auth*

3. Try different method:
   - If GitHub fails, try Google
   - Or use email directly

4. Check account:
   - Verify account exists at codeium.com
   - Check if subscription is active
\`\`\`

---

### Error 6: "Windsurf is slow" or high CPU/memory usage

**Cause:** Large project, too many extensions, or excessive indexing

**Solution:**
\`\`\`
1. Check resource usage:
   - Cmd/Ctrl + Shift + P
   - "Developer: Open Process Explorer"

2. Exclude heavy folders:
   \`\`\`json
   "files.exclude": {
     "**/node_modules": true,
     "**/.git": true,
     "**/dist": true,
     "**/build": true
   },
   "search.exclude": {
     "**/node_modules": true,
     "**/dist": true
   }
   \`\`\`

3. Disable unnecessary extensions:
   - Cmd/Ctrl + Shift + X
   - Remove extensions you don't need

4. Reduce Cascade context:
   - Close unnecessary tabs
   - Clear Cascade chat history

5. Restart Windsurf
\`\`\`

---

### Error 7: "Cascade chat stuck" or infinite loading

**Cause:** Large context, API timeout, or network issue

**Solution:**
\`\`\`
1. Cancel current request:
   - Click "Stop" button in chat
   - Wait a moment, try again

2. Reduce context:
   - Don't @include massive files
   - Be more specific in requests
   - Clear chat history

3. Check network:
   - Verify internet connection
   - Try different network

4. Restart chat:
   - Click "New Chat" or clear current
   - Start fresh conversation
\`\`\`

---

### Error 8: "Cannot import VS Code settings"

**Cause:** Incompatible settings or corrupted export

**Solution:**
\`\`\`
1. Manual import:
   - In VS Code: Cmd/Ctrl + Shift + P → "Export Settings"
   - In Windsurf: Cmd/Ctrl + Shift + P → "Import Settings"

2. Copy settings manually:
   # VS Code settings location:
   - macOS: ~/Library/Application Support/Code/User/settings.json
   - Windows: %APPDATA%\\Code\\User\\settings.json
   - Linux: ~/.config/Code/User/settings.json

   # Copy to Windsurf location:
   - macOS: ~/Library/Application Support/Windsurf/User/settings.json
   - Windows: %APPDATA%\\Windsurf\\User\\settings.json
   - Linux: ~/.config/Windsurf/User/settings.json

3. Reinstall extensions:
   - Not all VS Code extensions are compatible
   - Install fresh from Windsurf marketplace
\`\`\`

---

### Error 9: "Keyboard shortcuts not working"

**Cause:** Shortcut conflicts or corrupted keybindings

**Solution:**
\`\`\`
1. Check keybindings:
   - Cmd/Ctrl + K Cmd/Ctrl + S
   - Search for "cascade" or "windsurf"
   - Verify shortcuts are assigned

2. Reset to defaults:
   - Cmd/Ctrl + K Cmd/Ctrl + S
   - Click "..." → "Reset Keybindings"

3. Check for conflicts:
   - Look for warning (!) icons
   - Resolve conflicts manually
\`\`\`

---

### Error 10: "Extension host crashed" or "Extension not compatible"

**Cause:** Extension incompatible with Windsurf's VS Code version

**Solution:**
\`\`\`
1. Identify problematic extension:
   - View → Output → Select "Extension Host"
   - Look for error messages

2. Disable suspect extension:
   - Cmd/Ctrl + Shift + X
   - Find extension → Disable

3. Check compatibility:
   - Not all VS Code extensions work
   - Look for Windsurf-compatible alternatives

4. Report issues:
   - github.com/CodeiumAI/windsurf/issues
\`\`\`

---

### Error 11: "Cascade produces incorrect code" or hallucinations

**Cause:** AI limitation, unclear instructions, or missing context

**Solution:**
\`\`\`
1. Be more specific:
   ❌ "Add a button"
   ✅ "Add a primary button using Tailwind's bg-blue-500 class,
       with onClick handler that calls handleSubmit"

2. Provide context:
   - Use @file references for relevant files
   - Include .cascade/instructions.md with project conventions
   - Show example code you want Cascade to follow

3. Break down complex tasks:
   - Instead of "Build entire feature"
   - Ask "First, create the component structure"

4. Always review generated code:
   - Don't blindly accept suggestions
   - Test the output
   - Ask Cascade to explain if unsure
\`\`\`

---

### Error 12: "File watcher limit reached" (Linux)

**Full Error:**
> ENOSPC: System limit for number of file watchers reached

**Cause:** Too many files being watched

**Solution:**
\`\`\`bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase limit
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches

# Make permanent
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Or exclude folders from watching:
# In settings.json:
"files.watcherExclude": {
  "**/node_modules/**": true,
  "**/.git/**": true
}
\`\`\`

---

### Error 13: "Context window too large" or "Token limit exceeded"

**Cause:** Too much context for the AI model

**Solution:**
\`\`\`
1. Be selective with context:
   - Don't @include entire large files
   - Reference specific functions/sections

2. Use Cascade's smart context:
   - Let Cascade search for relevant code
   - Don't manually add everything

3. Clear old context:
   - Start new chat for new topics
   - Old conversations accumulate context

4. Split large requests:
   - Ask for one component at a time
   - Build iteratively
\`\`\`

---

### Error 14: "Cascade instructions not being followed"

**Cause:** Instructions file in wrong location or format

**Solution:**
\`\`\`
1. Verify file location:
   project/.cascade/instructions.md  ← Correct location

2. Check file format:
   # Project Instructions
   
   ## Tech Stack
   - React 18
   - TypeScript
   
   ## Conventions
   - Functional components only

3. Ensure Cascade sees it:
   - Restart Windsurf after creating
   - Check indexing status

4. Be explicit in chat:
   - "Following the project instructions in .cascade/instructions.md..."
\`\`\`

---

## 📚 Getting More Help

### Official Resources
- **Documentation:** [codeium.com/windsurf/docs](https://codeium.com/windsurf/docs)
- **Discord:** [discord.gg/codeium](https://discord.gg/codeium)
- **GitHub Issues:** [github.com/CodeiumAI/windsurf/issues](https://github.com/CodeiumAI/windsurf/issues)
- **Status:** [codeium.com/status](https://codeium.com/status)

### Quick Diagnostics
\`\`\`
1. Check version: Cmd/Ctrl + Shift + P → "About Windsurf"
2. View logs: Cmd/Ctrl + Shift + P → "Developer: Open Logs Folder"
3. Developer tools: Cmd/Ctrl + Shift + I
4. Reset settings: Cmd/Ctrl + Shift + P → "Reset Settings"
\`\`\`

## 🎉 Congratulations!

You can now troubleshoot any Windsurf issue!

**What You've Learned:**
- ✅ Fix startup and sign-in errors
- ✅ Resolve Cascade and indexing issues
- ✅ Optimize performance
- ✅ Handle context and memory problems
- ✅ Know where to get help

**Happy coding with Windsurf!** 🚀`
      },
    ]
  },
  'guide-vibe-coding': {
    title: 'Vibe Coding with AI',
    description: 'Code with natural language. Let AI handle the syntax while you focus on intent.',
    topic: 'Development',
    lessons: [
      { title: 'What is Vibe Coding?', content: `## The End of Syntax Memorization

**Vibe coding** is a new way to program where you describe what you want in plain English, and AI writes the actual code. You focus on **intent**, AI handles **implementation**.

### The Old Way vs Vibe Coding

| Traditional Coding | Vibe Coding |
|-------------------|-------------|
| Memorize syntax | Describe intent |
| Write every line | AI generates code |
| Debug syntax errors | Debug logic errors |
| Hours of implementation | Minutes of description |
| Know the language | Know the problem |

### Why "Vibe"?

Because you're coding by **feeling** and **intent** rather than precise syntax:
- "Make it look modern"
- "Add a button that does X"
- "Fix the bug where Y happens"
- "Make it faster"

You describe the **vibe**, AI delivers the code.

### Tools for Vibe Coding

**AI Code Editors:**
- **Cursor** - VS Code fork with Claude/GPT built-in
- **Windsurf** - Codeium's AI-native IDE
- **Replit** - Browser-based with AI assistant
- **Zed** - Fast editor with AI integration

**AI Chat for Coding:**
- **Claude** - Excellent at understanding intent
- **ChatGPT** - Versatile coding assistant
- **Gemini** - Good with context
- **GitHub Copilot Chat** - IDE-integrated

### Who is Vibe Coding For?

✅ **Perfect for:**
- Beginners who know logic but not syntax
- Experienced developers who want speed
- Prototyping ideas quickly
- Learning new languages/frameworks
- Non-developers who want to build

⚠️ **Not ideal for:**
- Performance-critical code (you need to understand the output)
- Security-sensitive applications
- Novel algorithms (AI may hallucinate)
- Production systems without review

### The Mindset Shift

**From:** "I need to know the exact syntax"
**To:** "I need to clearly describe what I want"

**From:** "Let me write this function"
**To:** "Let me explain what this function should do"

**From:** "Debug the code"
**To:** "Debug the intent"

### Example: Building a Login Form

**Traditional (30+ minutes):**
\`\`\`
1. Create form HTML
2. Add CSS styling
3. Write validation JS
4. Handle form submission
5. Add error states
6. Connect to backend
7. Handle loading states
8. Test everything
\`\`\`

**Vibe Coding (5 minutes):**
\`\`\`
"Create a login form with email and password fields.
Add validation for email format and password strength.
Show error messages inline.
On submit, call /api/login and redirect to /dashboard on success.
Use Tailwind for styling, make it look modern."
\`\`\`

AI generates all the code. You review and adjust.

**→ Proceed to Lesson 2: Effective Prompting**` },
      { title: 'Effective Prompting for Code', content: `## How to Talk to AI Coders

The quality of your code depends on the quality of your prompts. Here's how to write prompts that get great results.

### The CLEAR Framework

**C - Context**
\`\`\`
I'm building a React app with Next.js 14 and Tailwind.
I need a component that...
\`\`\`

**L - Logic**
\`\`\`
The component should:
- Fetch user data from /api/users/:id
- Display loading state while fetching
- Show error message if fetch fails
- Render user profile when successful
\`\`\`

**E - Edge Cases**
\`\`\`
Handle cases where:
- User ID doesn't exist
- Network is slow (show spinner)
- User has no avatar (show placeholder)
\`\`\`

**A - Aesthetics**
\`\`\`
Style it with Tailwind:
- Card layout with shadow
- Avatar on left, info on right
- Blue accent color for buttons
- Responsive on mobile
\`\`\`

**R - Review Requirements**
\`\`\`
Include:
- TypeScript types
- Error handling
- Comments for complex logic
- Accessibility (aria labels)
\`\`\`

### Prompt Templates

**Building a Feature:**
\`\`\`
Create a [component/function] that [does what].

Context:
- Framework: [React/Vue/etc]
- Styling: [Tailwind/CSS/etc]
- State management: [if any]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Edge case handling]

Output: [TypeScript/JavaScript/etc] with [comments/types/etc]
\`\`\`

**Fixing a Bug:**
\`\`\`
This code is supposed to [what it should do] but instead [what it does].

Here's the code:
[paste code]

Error message (if any): [error]

Expected behavior: [description]
\`\`\`

**Refactoring:**
\`\`\`
Refactor this code to be more [readable/performant/modern]:

[paste code]

Goals:
- [Goal 1]
- [Goal 2]

Keep the same functionality.
\`\`\`

### Bad vs Good Prompts

❌ **Bad:** "Make a button"
- No context
- No styling guidance
- No functionality specified

✅ **Good:** "Create a primary CTA button component in React with TypeScript. It should:
- Accept label, onClick, and optional loading prop
- Show spinner when loading is true
- Use Tailwind with blue background, white text, rounded corners
- Have hover and focus states
- Be keyboard accessible"

### Iterative Refinement

**Round 1:**
\`\`\`
"Create a user list component"
\`\`\`
→ AI generates basic list

**Round 2:**
\`\`\`
"Add search functionality to filter users by name"
\`\`\`
→ AI adds search state and filter

**Round 3:**
\`\`\`
"Make it virtualized for performance with 1000+ users"
\`\`\`
→ AI implements react-window

**Round 4:**
\`\`\`
"Add pagination with 20 users per page"
\`\`\`
→ AI adds pagination logic

**Pro Tip:** Start simple, iterate quickly. Each round takes seconds.

### Common Prompt Patterns

**1. Specification Prompt:**
"I need [exact specification]. Use [framework]. Style with [method]."

**2. Example Prompt:**
"Create something like [existing thing] but with [differences]."

**3. Problem Prompt:**
"I'm trying to [goal] but [problem]. Help me [solve/refactor/fix]."

**4. Learning Prompt:**
"Explain [concept] with code examples. Then show me how to [apply it]."

**→ Proceed to Lesson 3: Reviewing AI Code**` },
      { title: 'Reviewing & Refining AI Code', content: `## Never Blindly Trust AI

AI-generated code is fast but not always correct. Here's how to review and refine it effectively.

### The Review Checklist

**✅ Functional Correctness**
- Does it do what I asked?
- Are all edge cases handled?
- Does it integrate with existing code?

**✅ Security**
- Are there SQL injection risks?
- Is user input sanitized?
- Are secrets hardcoded?
- Are API endpoints protected?

**✅ Performance**
- Is it O(n) or O(n²)?
- Are there unnecessary re-renders?
- Is data fetching optimized?

**✅ Best Practices**
- Follows framework conventions?
- Is code DRY (Don't Repeat Yourself)?
- Are there proper error boundaries?

**✅ Maintainability**
- Is it readable?
- Are complex parts commented?
- Are variable names clear?

### Common AI Code Issues

**1. Hallucinated Imports**
\`\`\`typescript
// AI might invent packages that don't exist
import { fancyButton } from 'react-fancy-buttons' // ❌ Doesn't exist
\`\`\`
**Fix:** Check npm for actual package names

**2. Outdated APIs**
\`\`\`javascript
// AI might use deprecated methods
componentWillMount() { ... } // ❌ Deprecated in React 18
\`\`\`
**Fix:** Cross-reference with official docs

**3. Security Vulnerabilities**
\`\`\`javascript
// AI might suggest unsafe patterns
const query = \`SELECT * FROM users WHERE id = \${userId}\` // ❌ SQL injection
\`\`\`
**Fix:** Always use parameterized queries

**4. Logic Errors**
\`\`\`javascript
// AI might miss edge cases
if (user.role === 'admin') {
  return true // ❌ What about null/undefined?
}
\`\`\`
**Fix:** Add explicit null checks

### The Refinement Loop

**Step 1: Initial Generation**
\`\`\`
"Create a function to validate email addresses"
\`\`\`

**Step 2: Review Output**
- Check regex pattern validity
- Test with edge cases
- Verify RFC 5322 compliance

**Step 3: Refine**
\`\`\`
"The regex doesn't handle plus addresses like user+tag@domain.com.
Also add validation for max length (254 chars).
Return specific error messages for each failure type."
\`\`\`

**Step 4: Test**
\`\`\`
"Write tests for this validation function covering:
- Valid emails
- Invalid formats
- Edge cases
- Boundary conditions"
\`\`\`

### When to Rewrite vs Refine

**Refine (tweak AI output):**
- 80% of code is correct
- Minor bugs or styling issues
- Missing edge cases

**Rewrite (start fresh):**
- Fundamental approach is wrong
- AI misunderstood the intent
- Too many issues to fix incrementally

### Code Review Prompts

Ask AI to review its own code:
\`\`\`
"Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Best practice violations
4. Edge cases I might have missed

Suggest improvements with explanations."
\`\`\`

### Pair Programming with AI

**You bring:**
- Domain knowledge
- Business requirements
- Acceptance criteria
- Final decision-making

**AI brings:**
- Syntax knowledge
- Pattern recognition
- Fast iteration
- Documentation skills

**Together:** Faster development with human oversight

**→ Proceed to Lesson 4: Real Workflows**` },
      { title: 'Real-World Vibe Coding Workflows', content: `## Complete Development Workflows

Here's how to use vibe coding for real projects from start to finish.

### Workflow 1: Building a Feature

**Step 1: Describe the Feature**
\`\`\`
"I need a user dashboard with:
- Sidebar navigation
- Stats cards (users, revenue, growth)
- Recent activity feed
- Responsive design
Built with Next.js 14 and Tailwind."
\`\`\`

**Step 2: Break into Components**
\`\`\`
"Now break this into separate components:
- DashboardLayout
- Sidebar
- StatsCard
- ActivityFeed

Show me the folder structure."
\`\`\`

**Step 3: Build Each Component**
\`\`\`
"Start with StatsCard. It should:
- Accept title, value, change, and icon props
- Show percentage change with up/down color
- Have hover effect
- Be reusable"
\`\`\`

**Step 4: Connect Data**
\`\`\`
"Now fetch real data from /api/stats.
Add loading states.
Handle errors gracefully.
Cache the data."
\`\`\`

**Step 5: Polish**
\`\`\`
"Add:
- Animations on load
- Dark mode support
- Accessibility improvements
- Responsive breakpoints"
\`\`\`

### Workflow 2: Bug Fixing

**Step 1: Describe the Bug**
\`\`\`
"My form validation isn't working. When I submit:
- Required fields don't show errors
- Email validation lets invalid emails through
- The form submits even with errors

Here's my current code: [paste]"
\`\`\`

**Step 2: Get Diagnosis**
\`\`\`
"What's causing these issues? Explain each one."
\`\`\`

**Step 3: Get Fixed Code**
\`\`\`
"Rewrite the validation to fix all issues.
Add clear error messages.
Show me the changes you made."
\`\`\`

**Step 4: Add Tests**
\`\`\`
"Write tests to prevent regression:
- Test each validation rule
- Test form submission blocking
- Test error message display"
\`\`\`

### Workflow 3: Learning a New Framework

**Step 1: Get an Overview**
\`\`\`
"Explain [framework] in simple terms.
What problems does it solve?
When should I use it?"
\`\`\`

**Step 2: Build Hello World**
\`\`\`
"Create the simplest possible [framework] app.
Explain each file and what it does."
\`\`\`

**Step 3: Add Features Incrementally**
\`\`\`
"Now add:
1. A route with a parameter
2. A form with state
3. An API call
4. Styling

Explain each addition."
\`\`\`

**Step 4: Build Something Real**
\`\`\`
"Help me build [actual project] with [framework].
Guide me through the architecture first,
then implement piece by piece."
\`\`\`

### Workflow 4: Code Review Assistance

**Ask AI to Review Your Code:**
\`\`\`
"Review this pull request for:
- Security issues
- Performance concerns
- Code style violations
- Missing error handling
- Potential bugs

Here's the diff: [paste]"
\`\`\`

**Ask for Alternatives:**
\`\`\`
"Is there a better way to implement this?
Show me 2-3 alternatives with pros/cons."
\`\`\`

### Pro Tips

1. **Keep a prompt library** - Save prompts that work well
2. **Use AI for boilerplate** - Focus your energy on logic
3. **Generate tests first** - AI writes great test cases
4. **Document as you go** - Ask AI to add comments
5. **Review in chunks** - Don't generate too much at once

## 🎉 Congratulations!

You now understand vibe coding!

**Key Skills:**
- ✅ Describe intent, not syntax
- ✅ Write effective prompts
- ✅ Review AI code critically
- ✅ Use real-world workflows

**Next Steps:**
- Try Cursor or Windsurf
- Build something with vibe coding
- Iterate and refine your prompting skills` },
    ]
  },
}

const TOPIC_COLORS: Record<string, string> = {
  'Getting Started': 'from-green-500 to-emerald-600',
  'AI Tools': 'from-purple-500 to-pink-600',
  'Development Setup': 'from-blue-500 to-cyan-600',
  'Emerging AI': 'from-indigo-500 to-violet-600',
  'AI Engineering': 'from-orange-500 to-red-600',
  'Productivity': 'from-yellow-500 to-amber-600',
  'Development': 'from-teal-500 to-emerald-600',
}

export default function GuideContent({ guideId }: { guideId: string }) {
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
      {/* SEO Structured Data */}
      <ArticleJsonLd
        headline={`${guide.title} - Lesson ${currentLesson + 1}: ${lesson.title}`}
        description={guide.description}
        url={`https://cxoacademy.co/guides/${guideId}`}
        datePublished={new Date().toISOString()}
        articleBody={lesson.content}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://cxoacademy.co' },
          { name: 'Quick Guides', url: 'https://cxoacademy.co/guides' },
          { name: guide.title, url: `https://cxoacademy.co/guides/${guideId}` },
        ]}
      />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/guides"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Guides
          </Link>
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
