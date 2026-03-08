# 🛡️ SafeSignal — Design Document

---

## 1. 📌 Overview

SafeSignal is a community safety platform that aggregates local threat alerts, uses AI to separate real threats from noise, and delivers calm, actionable information. Instead of overwhelming people with raw data, it filters, categorizes, and generates practical defense steps.

The UI is designed around a **cybersecurity operations center aesthetic** — dark theme, animated network visualization, real-time monitoring — making the experience feel professional and immersive.

---

## 2. 🧠 Design Philosophy

### Empowerment over anxiety
Most safety tools just dump threat data on you. SafeSignal curates it. The safety digest gives a calm summary. Defense checklists give specific steps. The tone throughout is reassuring, not alarming.

### Always works
If OpenAI is down or there's no API key, the app automatically switches to a rule-based fallback engine. No errors, no broken states. The user just sees a yellow badge instead of a green one.

### Show your work
Every analysis labels itself — AI or rule-based — with a confidence score. If the fallback activated, it tells you why. Users shouldn't have to guess how decisions were made.

### Don't hide things
Noise alerts get dimmed (opacity + dashed border), not deleted. There's a toggle. Filtering is a user choice, not an app decision.

---

## 3. 🏗️ Architecture

Three layers, kept simple on purpose:

```
┌──────────────────────────────────────────┐
│  🖥️  React Frontend                      │
│  Dashboard · Alerts · Digest             │
│  Threat Meter · Live Feed · Location     │
└──────────────┬───────────────────────────┘
               │ REST
┌──────────────┴───────────────────────────┐
│  ⚙️  Next.js API Routes                   │
│  /api/alerts (CRUD)                      │
│  /api/analyze (AI dispatch)              │
└──────┬─────────────────┬─────────────────┘
       │                 │
  ┌────┴─────┐    ┌──────┴──────┐
  │ 🤖 OpenAI │    │ 🔧 Fallback │
  │ (primary) │───▶│ (secondary) │
  └──────────┘fail└─────────────┘
       │                 │
  ┌────┴─────────────────┴─────┐
  │ 💾 In-Memory Store          │
  │ 15 synthetic alerts         │
  └────────────────────────────┘
```

### 📡 API Endpoints

| Route | Methods | Purpose |
|---|---|---|
| `/api/alerts` | `GET`, `POST` | List (with filters) + create |
| `/api/alerts/:id` | `GET`, `PUT`, `DELETE` | Single alert operations |
| `/api/analyze` | `POST` | AI analysis — `analyze`, `checklist`, `digest` |

All inputs are validated server-side. Errors return standard HTTP status codes with clean messages.

---

## 4. 🤖 AI System

### Three capabilities

| # | What | Input | Output |
|---|---|---|---|
| 1 | 🔍 Noise detection | Alert text | noise/signal, category, severity, summary, confidence |
| 2 | 🛡️ Defense checklist | Threat category | 5 actionable steps |
| 3 | 📝 Safety digest | All alerts | Calm community summary |

### The fallback engine

Built a scoring system that works without any API:

**Noise detection:**
- 15 noise keywords (`omg`, `annoying`, `ugh`...) → +1 each
- 21 signal keywords (`breach`, `phishing`, `alert`...) → +2 each
- Excessive `!!!` → +2 noise
- High CAPS ratio (>30%) → +1 noise
- Short text with no signal → +1 noise
- **Decision:** `noise > signal` → classified as noise

**Category detection:**
- 7 keyword dictionaries (cyber, breach, scam, theft, infrastructure, weather, community)
- Match count per category → highest wins
- Confidence scales with number of matches

**Defense checklists:**
- Pre-written 5-step checklists for each category
- Sourced from security best practices
- Categories covered: cyber threats, data breaches, scams, theft, infrastructure, weather, general

The fallback isn't as smart as GPT, but it handles common cases well and responds in under 1ms.

---

## 5. 🎨 Visual Design

### Color system

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0a0e1a` | 🌑 Deep midnight background |
| `--bg-card` | `#1a2035` | 🃏 Card surfaces |
| `--accent-primary` | `#3b82f6` | 🔵 Primary actions |
| `--accent-secondary` | `#8b5cf6` | 🟣 Gradient accents |
| `--color-critical` | `#ef4444` | 🔴 Critical alerts |
| `--color-high` | `#f97316` | 🟠 High severity |
| `--color-medium` | `#eab308` | 🟡 Medium severity |
| `--color-low` | `#22c55e` | 🟢 Low severity |

### Animations

| Element | Method | Performance |
|---|---|---|
| 🌐 Network mesh | HTML5 Canvas, 60 particles | GPU-accelerated, ~60fps |
| 📡 Scan beam | Canvas gradient | Same render loop |
| ✨ Header line | CSS keyframes | Hardware-accelerated |
| 💫 Logo pulse | CSS box-shadow | Minimal CPU |
| 🎴 Card glow | CSS conic-gradient | On-hover only |
| ⚡ Feed items | CSS slide-in | Triggered on insert |
| 📊 Threat bar | CSS transition (1s) | Smooth cubic-bezier |

### Information layers

The UI has four depth levels so people can go as deep as they want:

1. **🏠 Glanceable** — Stat cards + threat meter (2-second overview)
2. **📋 Scannable** — Alert cards with severity, category, location
3. **🔎 Detailed** — Full alert with AI analysis + defense checklist
4. **📰 Summary** — Safety digest for the whole community

---

## 6. 📦 Data Model

### Alert schema

```
{
  id            → unique string
  title         → min 5 chars
  description   → min 10 chars
  category      → cyber_threat | data_breach | scam | theft | 
                   infrastructure | weather | community_event | 
                   noise | general
  severity      → critical | high | medium | low | info
  source        → e.g. "Community Report", "Police Blotter"
  location      → Buffalo, NY neighborhood
  timestamp     → ISO 8601
  status        → verified | unverified
  actionable    → boolean
  tags          → string array
}
```

### Sample data

15 alerts across Buffalo, NY neighborhoods. Designed to test the full range:

| Category | # | Examples |
|---|---|---|
| 🔐 Cyber Threat | 3 | Phishing, ransomware, WiFi vulnerability |
| 📊 Data Breach | 1 | Healthcare records exposed |
| 💰 Scam | 2 | IRS calls, fake utility workers |
| 📦 Theft | 2 | Package theft, vehicle break-ins |
| 🏗️ Infrastructure | 2 | Water main, street lights |
| 🌨️ Weather | 1 | Lake effect snow |
| 🤝 Community | 1 | CPR training event |
| 📢 Noise | 3 | Dog barking, WiFi rant, general venting |

---

## 7. 🔐 Security

| Area | Approach |
|---|---|
| 🔑 API keys | `.env.local` (gitignored), `.env.example` with placeholders |
| ✅ Validation | Server-side on all inputs — length, type, required checks |
| 🚫 Data | Synthetic only — no real people, no real incidents |
| 🌐 CORS | Same-origin (Next.js default) |
| ⚠️ Errors | Sanitized messages, no stack traces exposed |

---

## 8. 🧪 Testing Strategy

14 tests total — focused on the fallback engine since that's the most critical and complex module.

**5 happy path tests:**
- ✅ Actionable alert → not noise
- ✅ Venting → noise
- ✅ Phishing → cyber_threat
- ✅ Summary generates
- ✅ Checklist returns

**9 edge cases:**
- ✅ Empty string
- ✅ Symbols only
- ✅ Very long text (500 repetitions)
- ✅ Unknown category
- ✅ Empty alerts array
- ✅ Mixed noise + signal text
- ✅ Unknown category name
- ✅ Unknown severity weight
- ✅ Excessive punctuation

All execute in **0.3 seconds**.

---

## 9. ⚡ Performance

| Area | Approach |
|---|---|
| 💾 Data access | In-memory → O(1) after initial load |
| ⚛️ State | React hooks only — no state library runtime |
| 🎬 Canvas | `requestAnimationFrame` — pauses when tab is inactive |
| 🎨 CSS | Hardware-accelerated properties (`transform`, `opacity`) |
| 🤖 Analysis | Async — doesn't block initial render |

---

## 10. ♿ Accessibility

- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<form>`)
- All interactive elements have unique IDs
- Form inputs have labels
- Color is never the only indicator — text labels always accompany
- Keyboard-navigable modal (ESC to close)
- High contrast text (WCAG AA)

---

## 11. ⚖️ Ethics & Limitations

### What the AI does
- Provides analysis and recommendations
- Generates suggested defense steps
- Creates summary assessments

### What it does NOT do
- ❌ Never takes automated action
- ❌ Never hides information (noise is dimmed, not deleted)
- ❌ Never stores or trains on user data

### Known limitations
- 📦 In-memory store resets on restart
- 🔄 Sequential AI calls (not batched)
- 📃 No pagination (fine for 15 alerts)
- 🌍 Keyword fallback may have cultural bias
- 🔑 No user auth

---

*Sriram Bandi · Scenario 3: Community Safety & Digital Wellness*
