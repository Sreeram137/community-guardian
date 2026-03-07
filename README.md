# 🛡 Community Guardian — AI-Powered Community Safety & Digital Wellness

> An intelligent community safety platform that aggregates local safety and digital security data, uses AI to filter noise from real threats, and delivers calm, actionable safety digests — inspired by how security operations centers protect enterprises, reimagined for everyday communities.

![Palo Alto Networks](https://img.shields.io/badge/Palo%20Alto%20Networks-Case%20Study-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=flat-square&logo=openai)
![Tests](https://img.shields.io/badge/Tests-14%20Passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Candidate Information

| Field | Details |
|---|---|
| **Candidate Name** | Sriram Bandi |
| **Scenario Chosen** | 🛡 Scenario 3: Community Safety & Digital Wellness |
| **Estimated Time Spent** | ~6 hours |
| **Repository** | [github.com/Sreeram137/community-guardian](https://github.com/Sreeram137/community-guardian) |

---

## 🎥 Video Presentation

> **[📹 Watch the Demo Video — YouTube](https://youtube.com)** _(Link to be added before submission)_

The 5–7 minute video covers:
1. 🎯 Problem overview and why this scenario matters
2. ⚙️ Architecture walkthrough and AI integration design
3. 🖥 Live demo: Dashboard → Threat Meter → Alert Detail → AI Analysis → Noise Filtering → Live Feed
4. 🤖 AI vs. Fallback mode demonstration (with and without API key)
5. 🧪 Test suite execution (14 passing tests)
6. ⚖️ Responsible AI considerations and tradeoffs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **OpenAI API Key** *(optional — the app works fully without it via rule-based fallback)*

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Sreeram137/community-guardian.git
cd community-guardian

# 2. Install dependencies
npm install

# 3. (Optional) Set up OpenAI for AI features
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# 4. Start the development server
npm run dev

# 5. Open in browser
# → http://localhost:3000
```

### Run Tests

```bash
# Run all 14 tests (happy path + edge cases)
npm test

# Run in watch mode
npm run test:watch
```

---

## 🎯 Problem Understanding

### The Problem

As digital and physical security threats grow in complexity, individuals and communities face a critical challenge: **alert fatigue**. Safety information is scattered across social media, local news, government advisories, and neighborhood forums. People either:

- **Miss genuine threats** buried in noise (social media venting, complaints, hearsay)
- **Become overwhelmed** by unfiltered threat data, leading to anxiety without actionable steps
- **Cannot distinguish** between verified threats and unverified social media posts

This mirrors a core challenge in enterprise cybersecurity — the same "noise vs. signal" problem that SOC analysts face daily, which is central to **Palo Alto Networks' mission**.

### My Solution: Community Guardian

A **community-level Security Operations Center (SOC)** that:

1. **Aggregates** community safety alerts from multiple sources into a unified dashboard
2. **Filters noise** using AI (OpenAI GPT-3.5) or rule-based NLP to separate venting/complaints from genuine threats
3. **Categorizes and triages** alerts by type (Cyber Threat, Data Breach, Scam, Theft, Infrastructure, Weather) and severity (Critical → Info)
4. **Generates proactive defense checklists** — specific, actionable steps tailored to each threat category
5. **Produces Safety Digests** — calm, empowering summaries instead of anxiety-inducing raw feeds
6. **Monitors in real-time** with a live network activity feed and community threat level meter
7. **Filters by location** — users can focus on their specific Buffalo, NY neighborhood

### Why Scenario 3?

This scenario directly aligns with **Palo Alto Networks' cybersecurity mission**:
- **Threat categorization** → mirrors how PANW products classify threats
- **Noise-to-signal filtering** → the fundamental SOC challenge
- **Proactive defense** → actionable checklists echo how PANW provides remediation
- **AI with fallback** → demonstrates defense-in-depth thinking

---

## ⚙️ Technical Stack & Architecture

### Technology Choices

| Component | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Unified frontend + API routes in one project. Server-side rendering for performance. Industry standard. |
| **Frontend** | React 19 | Component-based architecture with hooks. No external state management — lean and maintainable. |
| **Styling** | Vanilla CSS (Custom Properties) | Maximum design control, zero CSS framework overhead. 1800+ lines of hand-crafted cybersecurity-themed CSS. |
| **AI Engine** | OpenAI GPT-3.5-turbo | Fast (~300ms), cost-effective ($0.0015/1K tokens), excellent at structured JSON output for categorization. |
| **Fallback Engine** | Custom Rule-Based NLP | Zero external deps. Keyword analysis + heuristic scoring. Guarantees the app works without any API key. |
| **Testing** | Jest | 14 tests (5 happy path + 9 edge cases). Runs in <1 second. |
| **Data** | Synthetic JSON | 15 curated alerts set in Buffalo, NY with realistic threat mix including noise. |
| **Animations** | HTML5 Canvas | GPU-accelerated animated network mesh for cybersecurity aesthetic. |

### System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Cyber Background   │  Threat Level Meter           │ │
│  │  (Canvas Animation) │  (Real-time score)            │ │
│  ├─────────────────────┤───────────────────────────────┤ │
│  │  Dashboard  │  All Alerts  │  Safety Digest         │ │
│  │  (Stats +   │  (Search +   │  (AI-generated         │ │
│  │  Recent)    │  Filters)    │  summary)              │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  Location Selector  │  Live Activity Feed           │ │
│  │  (Buffalo, NY)      │  (Simulated network events)   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────┬────────────────────────────────────────┘
                  │  REST API Calls
┌─────────────────┴────────────────────────────────────────┐
│              Next.js API Routes (Server)                  │
│  GET/POST /api/alerts       │  Validation + CRUD         │
│  GET/PUT/DELETE /api/alerts/:id  │  Single alert ops     │
│  POST /api/analyze          │  AI analysis dispatch      │
└─────────┬───────────────────┴──────────┬─────────────────┘
          │                              │
  ┌───────┴──────────┐     ┌────────────┴──────────────┐
  │   OpenAI API     │     │  Rule-Based Fallback      │
  │   (Primary)      │     │  (Secondary)              │
  │                  │     │                            │
  │  • Noise detect  │ ──▶ │  • Keyword scoring        │
  │  • Categorize    │fail │  • Pattern matching        │
  │  • Summarize     │     │  • Heuristic analysis      │
  │  • Checklists    │     │  • Pre-curated checklists  │
  └──────────────────┘     └───────────────────────────┘
          │                              │
  ┌───────┴──────────────────────────────┴──────────────┐
  │          Data Layer (In-Memory Store)                │
  │   synthetic_alerts.json → alertsStore[]             │
  │   15 alerts × Buffalo, NY locations                 │
  └─────────────────────────────────────────────────────┘
```

### Project Structure

```
community-guardian/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/
│   │   │   │   ├── route.js          # CRUD: GET (list+filter), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.js      # CRUD: GET (single), PUT (update), DELETE
│   │   │   └── analyze/
│   │   │       └── route.js          # AI: analyze, checklist, digest
│   │   ├── layout.js                 # Root layout with SEO metadata
│   │   ├── globals.css               # 1800+ line design system (CSS custom properties)
│   │   └── page.js                   # Main application (1400+ lines)
│   └── lib/
│       └── aiService.js              # AI + Rule-based fallback engine (244 lines)
├── data/
│   └── synthetic_alerts.json         # 15 synthetic Buffalo, NY alerts
├── __tests__/
│   └── aiService.test.js             # 14 tests (happy path + edge cases)
├── .env.example                      # Environment variable template
├── DESIGN.md                         # Detailed design documentation
└── README.md                         # This file
```

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/alerts` | GET | List alerts with filtering (category, severity, search, status) |
| `/api/alerts` | POST | Create new alert with server-side validation |
| `/api/alerts/:id` | GET | Retrieve single alert by ID |
| `/api/alerts/:id` | PUT | Update alert fields (title, description, status) |
| `/api/alerts/:id` | DELETE | Delete alert |
| `/api/analyze` | POST | AI analysis — supports `analyze`, `checklist`, and `digest` actions |

---

## 💡 Key Features & Creativity

### 1. Animated Cybersecurity Background
A **GPU-accelerated HTML5 Canvas** renders 60 floating network nodes connected by dynamic edges, creating a living "neural network" effect. A scanning beam sweeps across the screen. A subtle CSS grid overlay completes the SOC aesthetic.

### 2. Community Threat Level Meter
A **real-time threat gauge** calculates a 0–100 threat score based on alert severities:
- `Critical × 25 + High × 12 + Medium × 5`
- Color-coded: 🟢 LOW → 🟡 GUARDED → 🟠 ELEVATED → 🔴 CRITICAL
- Animated gradient bar with severity breakdown

### 3. Live Network Activity Feed
A **simulated real-time feed** shows cybersecurity events (firewall blocks, scans, VPN connections) updating every 5 seconds with slide-in animations. Gives the app a "live operations center" feel.

### 4. AI-Powered Noise Filtering
Dual-engine noise detection:
- **AI Mode**: GPT-3.5-turbo analyzes text semantics with structured JSON output
- **Fallback Mode**: Keyword scoring + pattern analysis (punctuation, CAPS ratio, text length)
- Noise alerts are **dimmed, not hidden** — transparency and user control

### 5. Proactive Defense Checklists
For each alert, the system generates **5 actionable defense steps**:
- AI Mode: Context-specific steps generated by GPT
- Fallback Mode: Expert-curated checklists per category (cyber, scam, theft, etc.)

### 6. Safety Digest
An AI-generated **calm, empowering summary** of all alerts:
- Critical item count, top concern categories
- Reassuring overall assessment
- Clear indication of AI vs. rule-based generation

### 7. Location Selector
Filter alerts by **real Buffalo, NY neighborhoods** (Elmwood Village, Allentown, Delaware Park, etc.) with a glassmorphism dropdown and custom location input.

### 8. Full CRUD Operations
Create → Read → Update → Delete → Search → Filter by category, severity, location, and text.

---

## 🤖 AI Integration — Deep Dive

### Three AI Capabilities

| Capability | Input | Output | Use Case |
|---|---|---|---|
| **Noise Detection** | Alert text | `isNoise`, `category`, `severity`, `summary`, `confidence` | Separate venting from real threats |
| **Defense Checklist** | Alert category + context | 5 actionable steps | Empower users with concrete actions |
| **Safety Digest** | All alerts array | Calm empowering summary | Daily safety snapshot |

### Fallback Architecture (Defense-in-Depth)

```
User Request → Try OpenAI API
                ├── ✅ Success → Return AI response (method: "ai")
                └── ❌ Failure → Run Rule-Based Engine
                                  ├── Noise Detection: 15 noise keywords vs 21 signal keywords
                                  ├── Categorization: 7 keyword dictionaries
                                  ├── Summarization: Sentence extraction + truncation
                                  └── Checklists: Expert-curated per category
                                  → Return response (method: "rule-based" + reason)
```

**Noise Detection Algorithm (Fallback):**
1. Score against 15 noise keywords (+1 each): "omg", "annoying", "terrible", etc.
2. Score against 21 actionable keywords (+2 each): "breach", "phishing", "alert", etc.
3. Penalize excessive punctuation (>3 exclamation marks = +2 noise)
4. Penalize high CAPS ratio (>30% = +1 noise)
5. Penalize very short texts with no signal keywords
6. Decision: `isNoise = noiseScore > signalScore`

### Transparency & Trust
- **Header badge**: 🟢 "AI Active" or 🟡 "Fallback Mode"
- **Per-analysis labels**: "🤖 AI Analysis" or "⚙️ Rule-Based Analysis"
- **Fallback reason**: Shown in footer (e.g., "No API key configured")

---

## 🛠 Prototype Quality

### What Works

| Feature | Status | Notes |
|---|---|---|
| Dashboard with stats | ✅ Complete | 4 stat cards with animated glow effects |
| Threat Level Meter | ✅ Complete | Real-time scoring with animated gradient bar |
| Alert CRUD | ✅ Complete | Create, Read, Update, Delete with modal form |
| Search & Filters | ✅ Complete | Text search + category + severity + noise toggle |
| Location Filtering | ✅ Complete | 13 Buffalo, NY neighborhoods |
| AI Noise Detection | ✅ Complete | OpenAI with rule-based fallback |
| Defense Checklists | ✅ Complete | AI-generated or pre-curated per category |
| Safety Digest | ✅ Complete | AI or rule-based community summary |
| Live Activity Feed | ✅ Complete | Real-time simulated cyber events |
| Animated Background | ✅ Complete | Canvas network mesh + scan line |
| 14 Automated Tests | ✅ Complete | Jest: 5 happy path + 9 edge cases |

### Test Results

```
PASS  __tests__/aiService.test.js
 AI Service - Rule-Based Fallback
   Happy Path
     ✓ should identify actionable alert as NOT noise
     ✓ should identify venting/noise as noise
     ✓ should categorize phishing text as cyber_threat
     ✓ should generate non-empty summary
     ✓ should return defense checklist for known category
   Edge Cases
     ✓ should handle empty string without crashing
     ✓ should handle symbols-only input gracefully
     ✓ should handle extremely long text without crashing
     ✓ should handle unknown category in getDefenseChecklistFallback
     ✓ should handle empty alerts array in generateDigestFallback
     ✓ should correctly classify mixed noise+signal text by dominant signal
     ✓ should handle unknown category in formatCategoryName
     ✓ should return 0 for unknown severity in getSeverityWeight
     ✓ should handle text with excessive punctuation

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

---

## ⚖️ Responsible AI

### Ethical Considerations

| Principle | Implementation |
|---|---|
| **Transparency** | Users always see whether AI or rules analyzed each alert. Method and confidence displayed. |
| **User Control** | Noise filtering is a toggle — users see dimmed noise alerts and can show/hide them freely. |
| **No Real Data** | Only synthetic data used. No scraping, no real personal information. |
| **Graceful Degradation** | App works 100% without OpenAI. Fallback engine provides comparable analysis with honest confidence scores. |
| **No Automated Decisions** | AI provides *analysis and recommendations*, never takes action on the user's behalf. |
| **Bias Awareness** | Keyword-based fallback may have cultural bias in "noise" classification. AI mode provides more nuanced analysis. |
| **Security** | API keys in `.env.local` (gitignored). No keys committed. Server-side validation on all inputs. |

### Limitations Acknowledged

1. **In-memory data store** — resets on server restart (acceptable for prototype; would use PostgreSQL in production)
2. **Sequential AI calls** — noise analysis calls are not batched (would optimize with Promise.all in production)
3. **No pagination** — fine for 15 alerts, would need pagination for 1000+
4. **Keyword-based fallback** — less nuanced than LLM analysis; may misclassify ambiguous text
5. **No user authentication** — all users see the same data (would add auth + personalization in production)
6. **Simulated live feed** — network activity events are simulated, not from real monitoring

### AI Disclosure

| Question | Answer |
|---|---|
| Did you use AI tools? | Yes — GitHub Copilot and Gemini for code scaffolding, iteration, and documentation |
| How did you verify? | Manual code review, running the app, writing comprehensive tests, visual QA in browser |
| Example of rejected suggestion | AI suggested Redux for state management. Rejected — React's built-in `useState`/`useCallback` is sufficient for this prototype's scope, keeping the codebase lean. |

---

## 🎨 Design Decisions

### Cybersecurity Operations Center Aesthetic
- Dark theme with navy/midnight primary (`#0a0e1a`)
- Accent palette: Blue (`#3b82f6`) + Purple (`#8b5cf6`) gradients
- Animated canvas background with network mesh visualization
- Cyber grid overlay, scan line effects, glowing borders
- Monospace timestamps in the live feed

### Empowering, Not Alarming
- Safety Digest provides calm summaries, not raw threat feeds
- Defense checklists give users concrete actions, reducing anxiety
- Verified vs. unverified status helps users assess information quality
- Noise alerts are dimmed, not hidden — transparency and control

### Progressive Disclosure
Information is layered: Dashboard stats → Alert cards → Full detail with AI analysis. Users dive as deep as they need without being overwhelmed.

---

## ⚖️ Tradeoffs & Prioritization

### What I Cut (Time Constraints)
| Feature | Reason |
|---|---|
| Database persistence | In-memory is sufficient for prototype demo |
| User authentication | Focus was on core safety + AI features |
| Real-time WebSocket | Polling + simulated feed demonstrates the concept |
| Map visualization | Location filtering covers the use case for now |
| E2E tests | Focused unit tests on the most critical module (AI engine) |

### What I'd Build Next
1. PostgreSQL/MongoDB persistence with migrations
2. User accounts + personalized alert preferences
3. WebSocket real-time updates + push notifications
4. Interactive map with geocoded alert pins
5. Community voting (upvote/downvote alert validity)
6. Mobile PWA with offline support
7. Historical trend analysis over weeks/months

---

## 📜 License

MIT — Built for the Palo Alto Networks New Grad SWE Case Study Challenge
