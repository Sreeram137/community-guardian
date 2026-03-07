# 🛡 Community Guardian — AI-Powered Community Safety & Digital Wellness

> An intelligent community safety platform that aggregates local safety and digital security data, using AI to filter out noise and provide calm, actionable safety digests.

![Community Guardian](https://img.shields.io/badge/Palo%20Alto%20Networks-Case%20Study-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=flat-square&logo=openai)
![Tests](https://img.shields.io/badge/Tests-14%20Passing-brightgreen?style=flat-square)

---

## 📋 Candidate Information

| Field | Details |
|---|---|
| **Candidate Name** | Sriram Bandi |
| **Scenario Chosen** | 🛡 Scenario 3: Community Safety & Digital Wellness |
| **Estimated Time Spent** | ~5 hours |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **OpenAI API Key** (optional — app works without it via rule-based fallback)

### Run Commands

```bash
# 1. Clone the repository
git clone <repo-url>
cd community-guardian

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional for AI features)
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# 4. Start the development server
npm run dev

# 5. Open in browser
# → http://localhost:3000
```

### Test Commands

```bash
# Run all tests (14 tests: happy path + edge cases)
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🎯 Problem Understanding

### The Problem
As digital and physical security threats become more complex, individuals struggle to keep up with relevant safety information. Information is scattered across news sites and social media, leading to **alert fatigue** or unnecessary anxiety without actionable steps.

### My Solution: Community Guardian
A **"Community Guardian"** platform that:
1. **Aggregates** community safety alerts from multiple sources
2. **Filters noise** using AI (OpenAI) or rule-based heuristics to separate venting/complaints from genuine threats
3. **Provides actionable safety digests** — calm, empowering summaries instead of anxiety-inducing raw feeds
4. **Generates proactive defense checklists** tailored to specific threat categories

### Why This Scenario?
I chose Scenario 3 because it aligns directly with **Palo Alto Networks' mission** in cybersecurity. The platform demonstrates core security concepts (threat categorization, noise filtering, proactive defense) in a practical, user-facing application.

---

## ⚙️ Technical Stack

| Component | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server-side API routes + React client in one project |
| **Frontend** | React 19 | Component-based UI with hooks |
| **Styling** | Vanilla CSS (Custom Properties) | Maximum control, no dependencies, dark cybersecurity theme |
| **AI Engine** | OpenAI GPT-3.5-turbo | Fast, cost-effective for categorization/summarization |
| **Fallback Engine** | Custom Rule-Based NLP | Keyword analysis, heuristics for when AI is unavailable |
| **Testing** | Jest | 14 tests covering happy path + edge cases |
| **Data** | Synthetic JSON | 15 curated alerts with noise/signal mix |

---

## 🏗 Architecture

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
│   │   ├── globals.css               # Design system (CSS custom properties)
│   │   └── page.js                   # Main application (Dashboard, Alerts, Digest)
│   └── lib/
│       └── aiService.js              # AI + Rule-based fallback engine
├── data/
│   └── synthetic_alerts.json         # 15 synthetic community alerts
├── __tests__/
│   └── aiService.test.js             # 14 tests (happy path + edge cases)
├── .env.example                      # Environment variable template
└── README.md                         # This file
```

---

## ✅ Requirements Checklist

### 1. Core Flow (Create + View + Update + Filter/Search)
- ✅ **Create**: "Report Alert" modal with full form validation
- ✅ **View**: Dashboard overview, full alert list, detailed alert view
- ✅ **Update**: Edit alert title/description from detail view
- ✅ **Search/Filter**: Text search + category filter + severity filter + noise toggle

### 2. AI Integration + Fallback
- ✅ **AI**: OpenAI GPT-3.5-turbo for noise detection, categorization, summarization, and defense checklist generation
- ✅ **Fallback**: Complete rule-based engine using keyword analysis and heuristics
- ✅ **Transparency**: UI clearly indicates whether AI or fallback is active (header status badge + per-analysis labels)
- ✅ **Graceful degradation**: App works 100% without an API key

### 3. Basic Quality
- ✅ **Input validation**: Client-side + server-side validation on all forms
- ✅ **Error messages**: Clear validation errors, toast notifications for success/failure
- ✅ **14 tests**: 5 happy path + 9 edge cases (empty input, extreme length, unknown categories, mixed signals, etc.)

### 4. Data Safety
- ✅ **Synthetic data only**: 15 hand-crafted alerts in `data/synthetic_alerts.json`
- ✅ **No live scraping**: All data is local

### 5. Security
- ✅ **No committed API keys**: Using `.env.local` (gitignored)
- ✅ **`.env.example`** provided with placeholder values

---

## 🤖 AI Features Deep Dive

### Noise-to-Signal Filtering
The core AI feature analyzes each alert to determine if it's **actionable signal** or **noise/venting**.

**AI Mode** (OpenAI available):
- Sends alert text to GPT-3.5-turbo with a structured prompt
- Returns: `isNoise`, `category`, `severity`, `summary`, `confidence`

**Fallback Mode** (No API key / API error):
- Counts noise keywords (omg, lol, annoying, etc.) vs actionable keywords (breach, phishing, alert, etc.)
- Analyzes text patterns (excessive punctuation, CAPS ratio)
- Assigns category via keyword matching against 7 categories

### Proactive Defense Checklists
For each alert, the system generates a **5-step actionable defense checklist**:
- **AI Mode**: GPT generates context-specific steps based on the alert
- **Fallback Mode**: Pre-curated expert checklists for each category (cyber, scam, theft, etc.)

### Safety Digest
Aggregates all verified alerts into a **calm, empowering summary**:
- Counts critical items needing attention
- Identifies top concern categories
- Provides reassuring overall assessment

---

## 🎨 Design Decisions

### Dark Cybersecurity Theme
- Color palette inspired by security operations centers
- High contrast for readability in extended use
- Severity-colored indicators (red=critical, orange=high, yellow=medium, green=low)

### Noise Filtering UX
- Noise alerts are visually dimmed with dashed borders (not hidden by default)
- Toggle allows users to show/hide noise — gives users control
- Each analysis shows whether AI or rules were used (transparency)

### Empowering, Not Alarming
- Safety Digest provides calm summaries, not raw threat feeds
- Defense checklists give users concrete actions, reducing anxiety
- Verified vs. unverified status helps users assess information quality

---

## 🔮 Future Enhancements

If given more time, I would build:

1. **Real-time alerts** via WebSocket/Server-Sent Events
2. **Location-based filtering** with geocoding and map visualization
3. **Safe Circles** — encrypted group sharing for emergencies
4. **User authentication** and personalized alert preferences
5. **Push notifications** for critical severity alerts
6. **Historical trend analysis** — identify patterns over weeks/months
7. **Database persistence** (PostgreSQL/MongoDB instead of in-memory)
8. **Dark/Light theme toggle** with system preference detection
9. **Mobile PWA** — installable app with offline support
10. **Community voting** — users can upvote/downvote alert validity

---

## 🤖 AI Disclosure

| Question | Answer |
|---|---|
| Did you use an AI assistant? | Yes — GitHub Copilot and Gemini for code scaffolding and documentation |
| How did you verify suggestions? | Manual code review, running the app, and writing comprehensive tests |
| Example of rejected suggestion | AI suggested using a heavyweight state management library (Redux). I rejected this because React's built-in `useState`/`useCallback` hooks are sufficient for this prototype's scope, keeping the codebase lean and maintainable. |

---

## ⚖️ Tradeoffs & Prioritization

### What I cut to stay within 4-6 hours:
- **Database persistence**: Used in-memory store (resets on server restart). Acceptable for prototype.
- **Authentication**: No user accounts. Focus was on core safety features.
- **Real-time updates**: Polling-based instead of WebSocket.
- **Map visualization**: Location is text-only in this version.
- **Comprehensive E2E tests**: Focused on unit tests for the AI engine.

### What I would build next:
1. Database persistence (PostgreSQL)
2. User authentication & preferences
3. WebSocket real-time updates
4. Map-based alert visualization
5. Mobile-responsive PWA

### Known limitations:
- In-memory data store resets on server restart
- Noise analysis makes sequential API calls (could batch for performance)
- No pagination on alert list (fine for 15 items, not for 1000+)
- OpenAI fallback is keyword-based (less nuanced than LLM analysis)

---

## 🎥 Video Presentation

> [Video Link — YouTube/Vimeo] _(To be added before submission)_

The 5-7 minute video covers:
1. Problem overview and solution design
2. Live demo: Dashboard → Alert detail → AI analysis → Noise filtering
3. Technical stack walkthrough
4. AI integration with fallback demonstration
5. Test suite execution
6. Key learnings and future enhancements

---

## 📜 License

MIT — Built for Palo Alto Networks Case Study Challenge
