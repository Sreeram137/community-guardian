# 🛡️ SafeSignal

**An AI-powered community safety dashboard that cuts through the noise and gives people what they actually need — clear alerts, practical defense steps, and a calm summary of what's happening around them.**

![Next.js](https://img.shields.io/badge/Next.js_16-000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=000)
![OpenAI](https://img.shields.io/badge/OpenAI_GPT--3.5-412991?style=for-the-badge&logo=openai&logoColor=fff)
![Tests](https://img.shields.io/badge/14_Tests_Passing-22c55e?style=for-the-badge)

---

## 👤 Candidate Info

| | |
|---|---|
| **Name** | Sriram Bandi |
| **Scenario** | Scenario 3 — Community Safety & Digital Wellness |
| **Time** | ~6 hours |

---

## 🎥 Video Demo

> 📹 **[Watch the walkthrough on YouTube →](https://youtube.com)** *(link coming before deadline)*

Covers: problem overview → architecture → live demo → AI vs fallback → tests → tradeoffs

---

## 🚀 Quick Start

```bash
git clone https://github.com/Sreeram137/safe-signal.git
cd safe-signal
npm install
npm run dev
# → http://localhost:3000
```

**Optional** — enable AI features:
```bash
cp .env.example .env.local
# add your OpenAI API key to .env.local
```

**Run tests:**
```bash
npm test    # 14 tests, runs in < 1 second
```

> 💡 No API key? No problem. The app runs fully on a rule-based fallback engine.

---

## 🎯 The Problem

Safety information is everywhere — social media, news sites, neighborhood apps, government advisories — but it's messy. People either miss real threats buried under noise, or they see too much unfiltered stuff and just get anxious. There's no easy way to tell what actually matters and what to do about it.

This is basically the same challenge security operations centers deal with — separating signal from noise. I wanted to bring that idea down to the community level.

## 💡 The Solution

SafeSignal works like a neighborhood-level SOC:

| What it does | How |
|---|---|
| 🔍 **Filters noise from real threats** | AI analyzes each alert's text to classify it as signal or noise |
| 📊 **Categorizes and triages** | 7 categories × 5 severity levels, sorted by urgency |
| 🛡️ **Generates defense checklists** | 5 actionable steps per threat — not just "be careful" |
| 📝 **Creates safety digests** | Calm, empowering summaries instead of raw threat feeds |
| 📍 **Filters by location** | 13 real Buffalo, NY neighborhoods |
| ⚡ **Monitors in real-time** | Live activity feed + threat level gauge |

---

## ⚙️ Tech Stack

| Layer | Tech | Why I chose it |
|---|---|---|
| 🖥️ Framework | **Next.js 16** | Frontend + API routes in one project |
| ⚛️ Frontend | **React 19** | Hooks are enough — no Redux overhead |
| 🎨 Styling | **Vanilla CSS** | ~1800 lines of custom design. Full control. |
| 🤖 AI | **OpenAI GPT-3.5** | Fast, cheap, great at structured JSON |
| 🔧 Fallback | **Custom NLP engine** | Keyword scoring + heuristics. Zero deps. |
| 🧪 Testing | **Jest** | 14 tests in < 1s |
| 🎬 Animation | **HTML5 Canvas** | GPU-accelerated network mesh background |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│            React Frontend                    │
│  Dashboard · Alerts · Digest · Live Feed    │
│  Threat Meter · Location Filter             │
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────┴──────────────────────────┐
│          Next.js API Routes                  │
│  /api/alerts (CRUD)  ·  /api/analyze (AI)   │
└────────┬─────────────────────┬──────────────┘
         │                     │
   ┌─────┴──────┐    ┌────────┴────────┐
   │  OpenAI    │    │  Rule-Based     │
   │  GPT-3.5   │───▶│  Fallback       │
   │  (primary) │fail│  (secondary)    │
   └────────────┘    └─────────────────┘
         │                     │
   ┌─────┴─────────────────────┴──────┐
   │    In-Memory Data Store           │
   │    15 synthetic alerts            │
   └──────────────────────────────────┘
```

### 📂 Project Structure

```
safe-signal/
├── src/app/
│   ├── page.js               → main app (~1400 lines)
│   ├── globals.css            → design system (~1800 lines)
│   ├── layout.js              → root layout + SEO
│   └── api/
│       ├── alerts/route.js    → GET, POST
│       ├── alerts/[id]/route.js → GET, PUT, DELETE
│       └── analyze/route.js   → AI analysis
├── src/lib/aiService.js       → AI + fallback engine
├── data/synthetic_alerts.json → 15 Buffalo, NY alerts
└── __tests__/aiService.test.js → 14 tests
```

---

## 🤖 AI Deep Dive

### Three Capabilities

| # | Feature | Input | Output |
|---|---|---|---|
| 1 | 🔍 **Noise Detection** | Alert text | `isNoise`, category, severity, summary, confidence |
| 2 | 🛡️ **Defense Checklist** | Threat category | 5 specific actionable steps |
| 3 | 📝 **Safety Digest** | All alerts | Calm community summary |

### Fallback Engine

When OpenAI isn't available, the app switches automatically to a rule-based engine I built:

```
Text Input
  │
  ├── Score against 15 noise keywords    (+1 each)
  ├── Score against 21 signal keywords   (+2 each)
  ├── Check punctuation patterns         (+2 if excessive)
  ├── Check CAPS ratio                   (+1 if >30%)
  │
  └── noise score > signal score  →  classified as noise
```

### 🔒 Transparency

Users always know what's happening:
- 🟢 Header badge shows **"AI Active"** or 🟡 **"Fallback Mode"**
- Every analysis labels its method and confidence score
- Fallback explains *why* it activated (no key, API error, etc.)

---

## ✨ Key Features

### 🌐 Animated Cyber Background
Canvas-rendered network mesh — 60 floating nodes with dynamic connections and a sweeping scan beam. Gives the whole app a SOC command center feel.

### 📊 Threat Level Meter
Real-time gauge scoring the community from 0–100 based on alert severities.
- 🟢 **LOW** → 🟡 **GUARDED** → 🟠 **ELEVATED** → 🔴 **CRITICAL**

### ⚡ Live Activity Feed
Simulated network events updating every 5 seconds with slide-in animations — firewall blocks, scans, VPN connections.

### 🔇 Noise Toggle
Noise alerts get **dimmed** (not hidden). Toggle them on or off. I didn't want to hide information from users — that's their choice.

### 📍 Location Selector
Filter by 13 real Buffalo, NY neighborhoods — Elmwood Village, Allentown, Delaware Park, Downtown, and more.

### 📝 Full CRUD
Create → Read → Update → Delete → Search → Filter by category, severity, location, text.

---

## 🧪 Tests

14 tests — 5 happy path, 9 edge cases. All targeting the fallback engine since that's the most critical module.

```
PASS  __tests__/aiService.test.js

 ✅ Noise Detection — Happy Path
   ✓ actionable alert → NOT noise
   ✓ venting text → IS noise
   ✓ phishing → cyber_threat category
   ✓ summary is non-empty
   ✓ checklist returns for known category

 ✅ Edge Cases
   ✓ empty string doesn't crash
   ✓ symbols-only input handled
   ✓ very long text doesn't crash
   ✓ unknown category → graceful fallback
   ✓ empty alerts → valid digest
   ✓ mixed noise+signal → correct classification
   ✓ unknown category name → handled
   ✓ unknown severity → returns 0
   ✓ excessive punctuation → penalized

 14 passed · 0 failed · 0.3s
```

---

## ⚖️ Responsible AI

| Principle | What I did |
|---|---|
| 🔍 **Transparency** | Every analysis shows its method (AI vs rules) and confidence |
| 🎛️ **User control** | Noise toggle — users decide what to see |
| 🚫 **No automation** | AI advises, never takes action |
| 🔐 **Security** | API keys in `.env.local` (gitignored), server-side validation |
| 📊 **Synthetic data only** | No real people, no real incidents |
| ⚠️ **Bias awareness** | Keyword fallback may have cultural bias — that's why the toggle exists |
| 🔄 **Always works** | Full functionality without any API key |

---

## 🔀 Tradeoffs

### What I cut (time constraints)

| Cut | Why it's okay for a prototype |
|---|---|
| Database | In-memory works for demo, easy to swap later |
| Auth | Focus was on safety + AI features |
| WebSocket | Polling + simulated feed shows the concept |
| Map view | Location filter covers the use case |
| E2E tests | Unit tests on the AI engine cover the riskiest code |

### What I'd build next
1. 🗄️ PostgreSQL persistence
2. 🔑 User auth + personalized preferences
3. 📡 WebSocket real-time updates
4. 🗺️ Interactive map with geocoded pins
5. 👥 Community voting on alert validity
6. 📱 Mobile PWA with offline support

---

## 🔧 AI Tools Disclosure

I used Copilot and Gemini for scaffolding and debugging. Reviewed all output manually, tested everything in the browser, and wrote my own test suite to validate the logic. Example: rejected a suggestion to use Redux — hooks were more than enough here.

---

## 📜 License

MIT
