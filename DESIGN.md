# 🛡 Community Guardian — Design Documentation

## 1. Executive Summary

Community Guardian is an AI-powered community safety platform designed to solve the problem of **alert fatigue** — where individuals are overwhelmed by scattered, unfiltered safety information from multiple sources. The platform aggregates community safety alerts, uses AI to filter noise from actionable signals, and presents calm, empowering safety digests with proactive defense checklists.

---

## 2. Design Philosophy

### 2.1 Core Principles

1. **Empowerment over Anxiety**: Traditional safety platforms bombard users with raw threat data. Community Guardian provides curated, actionable summaries that empower users to take specific steps rather than causing panic.

2. **Noise-to-Signal Filtering**: Inspired by security operations center (SOC) practices, the platform separates genuine threats from social media venting, general complaints, and irrelevant posts.

3. **Graceful AI Degradation**: The AI system is designed to fail gracefully. When OpenAI is unavailable, the system seamlessly switches to a rule-based engine that provides comparable (though less nuanced) analysis. Users are always informed of which mode is active.

4. **Progressive Disclosure**: Information is layered — dashboard stats → alert cards → full detail with AI analysis. Users can dive as deep as they need without being overwhelmed.

### 2.2 Alignment with Palo Alto Networks

The platform mirrors core cybersecurity concepts central to Palo Alto Networks' mission:
- **Threat categorization** (cyber, scam, breach, infrastructure, weather)
- **Severity-based triage** (critical → info)
- **Proactive defense** (actionable checklists per threat type)
- **Signal filtering** (reducing noise to focus on real threats)

---

## 3. Technical Architecture

### 3.1 System Design

```
┌──────────────────────────────────────────────┐
│                  Frontend (React)             │
│  Dashboard │ Alert List │ Detail │ Digest     │
│  ┌─────────────────────────────────────┐      │
│  │  Noise Toggle  │  Search  │ Filter  │      │
│  └─────────────────────────────────────┘      │
└──────────────┬───────────────────────────────┘
               │ REST API
┌──────────────┴───────────────────────────────┐
│              Next.js API Routes               │
│  /api/alerts     │  /api/alerts/:id           │
│  /api/analyze    │                            │
└──────┬───────────┴───────────────────────────┘
       │
┌──────┴─────────────────────────────────────┐
│           AI Analysis Engine                │
│  ┌──────────────┐ ┌───────────────────────┐ │
│  │  OpenAI API  │ │ Rule-Based Fallback   │ │
│  │  (Primary)   │ │ (Secondary)           │ │
│  │              │ │                       │ │
│  │  GPT-3.5     │ │ Keyword Analysis      │ │
│  │  Turbo       │ │ Pattern Matching      │ │
│  │              │ │ Heuristic Scoring     │ │
│  └──────┬───────┘ └──────────┬────────────┘ │
│         │ API Error/Missing  │              │
│         └────────────────────┘              │
└─────────────────────────────────────────────┘
        │
┌───────┴────────────────────────────────────┐
│        Data Layer (In-Memory Store)         │
│  synthetic_alerts.json → alertsStore[]      │
└────────────────────────────────────────────┘
```

### 3.2 Technology Choices

| Technology | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 16 | Unified frontend + API in App Router. Server components for performance. Industry standard. |
| **AI Provider** | OpenAI GPT-3.5-turbo | Fast response times (~300ms), cost-effective ($0.0015/1K tokens), excellent at structured JSON output. |
| **Fallback** | Custom NLP Engine | Zero external dependencies. Keyword-based analysis with scoring heuristics. Guarantees the app always works. |
| **Styling** | Vanilla CSS Variables | No CSS framework overhead. Custom properties enable consistent theming. Full design control. |
| **Testing** | Jest | De facto standard for JavaScript testing. Lightweight, fast execution (<1s for all tests). |
| **Data Store** | In-Memory Array | Acceptable for prototype. Mimics database CRUD operations. Easy to swap for PostgreSQL/MongoDB later. |

### 3.3 API Design

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/alerts` | GET | List alerts with optional filters (category, severity, search, status) |
| `/api/alerts` | POST | Create new alert with validation |
| `/api/alerts/:id` | GET | Get single alert by ID |
| `/api/alerts/:id` | PUT | Update alert fields |
| `/api/alerts/:id` | DELETE | Delete alert |
| `/api/analyze` | POST | AI analysis (actions: `analyze`, `checklist`, `digest`) |

---

## 4. AI Integration Design

### 4.1 Three AI Capabilities

**1. Noise Detection & Analysis**
- Input: Alert title + description
- Output: `isNoise` (boolean), `category`, `severity`, `summary`, `confidence`
- Use Case: Automatically dimming/hiding social media venting and complaints

**2. Defense Checklist Generation**
- Input: Alert category + optional context
- Output: 5 actionable defense steps
- Use Case: Giving users concrete actions to take in response to threats

**3. Safety Digest Generation**
- Input: Array of all alerts
- Output: Calm, empowering summary with critical count, categories, and assessment
- Use Case: Daily/weekly snapshot of community safety status

### 4.2 Fallback Architecture

The fallback system uses a **dual-engine pattern**:

```
Request → Try OpenAI API
            ├── Success → Return AI response (method: "ai")
            └── Failure → Run Rule-Based Engine (method: "rule-based")
                           └── Return fallback response with reason
```

**Noise Detection Fallback Algorithm:**
1. Score against 15 noise keywords (+1 per match): "omg", "annoying", "terrible", etc.
2. Score against 21 actionable keywords (+2 per match): "breach", "phishing", "alert", etc.
3. Penalize excessive punctuation (>3 exclamation marks = +2 noise)
4. Penalize high CAPS ratio (>30% = +1 noise)
5. Penalize very short texts with no signal keywords
6. Compare: `isNoise = noiseScore > signalScore`

**Categorization Fallback:**
- Matches text against 7 category keyword dictionaries
- Selects category with highest keyword match count
- Confidence = min(0.9, matchCount × 0.25)

### 4.3 Transparency & Trust

The system ensures users always know how analysis was performed:
- **Header badge**: "AI Active" (green) or "Fallback Mode" (yellow)
- **Per-analysis labels**: "🤖 AI Analysis" or "⚙️ Rule-Based Analysis"
- **Fallback reason**: Displayed in analysis footer (e.g., "No API key configured")

---

## 5. UX Design Decisions

### 5.1 Dashboard-First Approach
Users see a quick overview with stats (total alerts, critical count, verified count, noise filtered) before diving into details. This reduces cognitive load.

### 5.2 Three-View Navigation
- **Dashboard**: Overview + recent alerts (default view)
- **All Alerts**: Full searchable/filterable list
- **Safety Digest**: AI-generated summary view

### 5.3 Visual Severity System
| Severity | Color | Left Border |
|---|---|---|
| Critical | Red | 🔴 |
| High | Orange | 🟠 |
| Medium | Yellow | 🟡 |
| Low | Green | 🟢 |
| Info | Cyan | 🔵 |

### 5.4 Noise Visualization
- Noise alerts are not hidden by default — they are **dimmed** (50% opacity, dashed border)
- Users can toggle noise filtering on/off
- This gives users transparency and control over the filtering

---

## 6. Data Model

### Alert Schema
```json
{
  "id": "string (unique)",
  "title": "string (min 5 chars)",
  "description": "string (min 10 chars)",
  "category": "enum: cyber_threat | data_breach | scam | theft | infrastructure | weather | community_event | noise | general",
  "severity": "enum: critical | high | medium | low | info",
  "source": "string",
  "location": "string",
  "timestamp": "ISO 8601",
  "status": "enum: verified | unverified",
  "actionable": "boolean",
  "tags": "string[]"
}
```

### Synthetic Dataset
The included dataset (`data/synthetic_alerts.json`) contains 15 alerts designed to demonstrate:
- **Diverse categories**: 3 cyber threats, 2 data breaches, 2 scams, 2 thefts, 2 infrastructure, 1 weather, 1 community event, and 3 noise/general posts
- **Mixed severity**: 4 critical, 3 high, 3 medium, 4 low, 1 info
- **Noise examples**: Dog barking complaint, town venting post, WiFi complaint — to demonstrate the noise filtering feature

---

## 7. Security Considerations

1. **API Key Protection**: OpenAI key stored in `.env.local` (gitignored). `.env.example` with placeholder provided.
2. **Input Validation**: All user inputs validated server-side (length checks, required fields, type checks).
3. **No Live Data**: Only synthetic data used. No scraping or real personal information.
4. **CORS**: Next.js API routes are same-origin by default.
5. **Error Handling**: API errors never expose stack traces or internal details to clients.

---

## 8. Testing Strategy

### Test Coverage

| Category | Tests | Description |
|---|---|---|
| **Happy Path** | 5 | Verify core functionality works correctly with expected inputs |
| **Edge Cases** | 9 | Verify system handles boundary conditions gracefully |

### Key Test Scenarios
- ✅ Actionable alerts identified as NOT noise
- ✅ Venting/noise correctly flagged
- ✅ Phishing text categorized as `cyber_threat`
- ✅ Non-empty summaries generated
- ✅ Correct defense checklists for known categories
- ✅ Empty string input handled without crash
- ✅ Symbol-only input handled gracefully
- ✅ Extremely long text doesn't crash and summary is truncated
- ✅ Unknown categories fall back to general
- ✅ Empty alerts array produces valid digest
- ✅ Mixed noise/signal text correctly classified by dominant signal
- ✅ Category name formatter handles unknown categories
- ✅ Severity weight returns 0 for unknown levels

---

## 9. Performance Considerations

- **API Route Caching**: In-memory store provides O(1) reads after initial load
- **Client-Side State**: React hooks manage state efficiently without Redux overhead
- **Lazy Analysis**: Noise analysis runs asynchronously after initial page load
- **CSS Custom Properties**: No CSS-in-JS runtime overhead

---

## 10. Accessibility

- Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<form>`)
- All interactive elements have unique IDs for testing
- Form inputs have associated labels
- Color is not the sole indicator of status (text labels accompany all color indicators)
- Keyboard-navigable modal (ESC to close)
- High contrast text on dark background (WCAG AA compliant ratios)

---

*Document prepared for Palo Alto Networks New Grad SWE Case Study Challenge*
