# 🛡 Community Guardian — Design Documentation

## 1. Executive Summary

Community Guardian is an AI-powered community safety platform designed to solve the problem of **alert fatigue** — where individuals are overwhelmed by scattered, unfiltered safety information from multiple sources. The platform aggregates community safety alerts, uses AI to filter noise from actionable signals, and presents calm, empowering safety digests with proactive defense checklists.

The application features an immersive **cybersecurity operations center** aesthetic with animated network visualizations, real-time threat monitoring, and a live activity feed — demonstrating core security concepts (threat categorization, noise filtering, proactive defense) in a practical, user-facing application.

---

## 2. Design Philosophy

### 2.1 Core Principles

1. **Empowerment over Anxiety**: Traditional safety platforms bombard users with raw threat data. Community Guardian provides curated, actionable summaries that empower users to take specific steps rather than causing panic.

2. **Noise-to-Signal Filtering**: Inspired by Security Operations Center (SOC) practices, the platform separates genuine threats from social media venting, general complaints, and irrelevant posts — the same fundamental challenge Palo Alto Networks solves at enterprise scale.

3. **Graceful AI Degradation (Defense-in-Depth)**: The AI system is designed to fail gracefully. When OpenAI is unavailable, the system seamlessly switches to a rule-based engine that provides comparable analysis. Users are always informed of which mode is active. This mirrors the defense-in-depth philosophy central to cybersecurity.

4. **Progressive Disclosure**: Information is layered — dashboard stats → alert cards → full detail with AI analysis → defense checklists. Users can dive as deep as they need without being overwhelmed.

5. **Transparency**: Every AI analysis clearly states its method (AI vs. rule-based), confidence level, and reasoning. Users are never left guessing how decisions were made.

### 2.2 Alignment with Palo Alto Networks

The platform mirrors core cybersecurity concepts central to Palo Alto Networks' mission:

| PANW Concept | Community Guardian Implementation |
|---|---|
| **Threat categorization** | 7 alert categories (cyber_threat, data_breach, scam, theft, infrastructure, weather, community_event) |
| **Severity-based triage** | 5-level triage (Critical → Info) with color-coded indicators |
| **Proactive defense** | Actionable 5-step checklists per threat category |
| **Noise filtering** | AI + rule-based dual engine to separate signal from noise |
| **Defense-in-depth** | Primary AI with automatic fallback to rule-based engine |
| **Real-time monitoring** | Live network activity feed + threat level meter |
| **SOC aesthetics** | Dark theme, network visualization, scanning effects |

---

## 3. Technical Architecture

### 3.1 System Design

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  CyberBackground    │  ThreatLevelMeter             │ │
│  │  (60 canvas nodes   │  (real-time score 0-100       │ │
│  │  + scanning beam)   │  + gradient bar)              │ │
│  ├─────────────────────┤───────────────────────────────┤ │
│  │  Dashboard  │  All Alerts  │  Safety Digest         │ │
│  │  (4 stats   │  (Search +   │  (AI-generated         │ │
│  │  + recent)  │  3 filters)  │  empowering summary)   │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  LocationSelector   │  LiveActivityFeed             │ │
│  │  (13 Buffalo, NY    │  (16 event types, 5s cycle,   │ │
│  │  neighborhoods)     │  slide-in animations)         │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────┬────────────────────────────────────────┘
                  │  REST API
┌─────────────────┴────────────────────────────────────────┐
│              Next.js 16 API Routes                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  /api/alerts (GET, POST)                            │ │
│  │  /api/alerts/:id (GET, PUT, DELETE)                 │ │
│  │  /api/analyze (POST) → dispatch to AI engine        │ │
│  │  Server-side validation on all inputs               │ │
│  └─────────────────────────────────────────────────────┘ │
└─────┬────────────────────────────────────┬───────────────┘
      │                                    │
┌─────┴──────────────────┐   ┌────────────┴──────────────┐
│   OpenAI GPT-3.5-turbo │   │  Rule-Based Fallback      │
│   (Primary Engine)     │   │  (Secondary Engine)       │
│                        │   │                            │
│  • analyzeAlert()      │   │  • detectNoiseRuleBased()  │
│  • generateChecklist() │──▶│  • categorizeFallback()    │
│  • generateDigest()    │err│  • summarizeFallback()     │
│                        │   │  • getDefenseChecklist()   │
│  Structured JSON output│   │  • generateDigestFallback()│
│  ~300ms response time  │   │  <1ms response time        │
└────────────────────────┘   └───────────────────────────┘
      │                              │
┌─────┴──────────────────────────────┴──────────────────┐
│          In-Memory Data Store                          │
│   synthetic_alerts.json → alertsStore[] (15 alerts)   │
│   Locations: 13 Buffalo, NY neighborhoods             │
└───────────────────────────────────────────────────────┘
```

### 3.2 Technology Choices

| Technology | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Unified frontend + API in one project. Server-side rendering. Industry standard React framework. |
| **AI Provider** | OpenAI GPT-3.5-turbo | Fast (~300ms), cost-effective ($0.0015/1K tokens), excellent structured JSON output. |
| **Fallback** | Custom Rule-Based NLP | Zero dependencies. Keyword scoring + heuristic analysis. Guarantees the app always works. |
| **Styling** | Vanilla CSS Custom Properties | No framework overhead. 1800+ lines of hand-crafted design system with full control. |
| **Animation** | HTML5 Canvas API | GPU-accelerated particle rendering. No external animation library needed. |
| **Testing** | Jest | Standard JS testing. 14 tests execute in <1 second. |
| **Data Store** | In-Memory Array | Acceptable for prototype. Easy to swap for PostgreSQL/MongoDB. |

### 3.3 Component Architecture

| Component | Lines | Purpose |
|---|---|---|
| `CyberBackground` | ~100 | Canvas-rendered network mesh with 60 particles, connections, and scan beam |
| `ThreatLevelMeter` | ~40 | Real-time threat score gauge with animated gradient bar |
| `LiveActivityFeed` | ~50 | Simulated cyber event feed with 5-second auto-refresh |
| `LocationSelector` | ~80 | Glassmorphism dropdown with 13 Buffalo neighborhoods + custom input |
| `AlertCard` | ~40 | Alert preview card with severity border, metadata, and noise indicator |
| `AlertDetail` | ~180 | Full alert view with AI analysis, checklist, and edit capabilities |
| `CreateAlertModal` | ~100 | Form modal with validation for reporting new alerts |
| `SafetyDigest` | ~100 | AI/rule-based community safety summary |
| `CommunityGuardian` | ~300 | Main orchestrator with state management and data fetching |

---

## 4. AI Integration Design

### 4.1 Three AI Capabilities

**1. Noise Detection & Analysis**
- **Input**: Alert title + description
- **Output**: `{ isNoise, category, severity, summary, confidence }`
- **Purpose**: Automatically identify and dim social media venting vs. genuine threats
- **AI Prompt**: Structured system prompt requesting JSON output with specific fields
- **Fallback**: Dual keyword scoring (15 noise vs. 21 actionable keywords) + pattern analysis

**2. Proactive Defense Checklist**
- **Input**: Alert category + optional context
- **Output**: 5 actionable defense steps
- **Purpose**: Give users concrete steps to protect themselves
- **AI Prompt**: Category-aware prompt requesting practical, specific steps
- **Fallback**: Pre-curated expert checklists for 7 categories (cyber, scam, theft, infrastructure, weather, community, general)

**3. Safety Digest**
- **Input**: Array of all community alerts
- **Output**: Calm, empowering community safety summary
- **Purpose**: Daily/weekly snapshot replacing anxiety-inducing raw feeds
- **AI Prompt**: Instructed to be reassuring and actionable, not alarming
- **Fallback**: Rule-based aggregation (severity counts, category identification, actionable items)

### 4.2 Fallback Algorithm Details

**Noise Detection Scoring:**
```
noiseScore = 0
signalScore = 0

For each word in text:
  if word ∈ NOISE_KEYWORDS (15 words):     noiseScore += 1
  if word ∈ ACTIONABLE_KEYWORDS (21 words): signalScore += 2

if exclamationMarks > 3:  noiseScore += 2
if capsRatio > 0.30:      noiseScore += 1
if textLength < 20 && signalScore == 0: noiseScore += 2

isNoise = noiseScore > signalScore
confidence = min(0.85, abs(noiseScore - signalScore) × 0.15)
```

**Category Detection:**
- 7 keyword dictionaries (12 keywords each for cyber_threat, 6 for weather, etc.)
- Match count per category → highest match wins
- Confidence = min(0.9, matchCount × 0.25)

### 4.3 Transparency & Trust Mechanisms

| Mechanism | Location | Purpose |
|---|---|---|
| Header status badge | Top right | Shows "🟢 AI Active" or "🟡 Fallback Mode" |
| Per-analysis label | Alert detail view | Shows "🤖 AI Analysis" or "⚙️ Rule-Based Analysis" |
| Confidence score | Analysis section | Numeric confidence (0.0–1.0) |
| Fallback reason | Analysis footer | Explains why fallback was used |
| Toggle control | Dashboard | Users choose to show/hide noise alerts |

---

## 5. Visual Design System

### 5.1 Cybersecurity Operations Center Aesthetic

The design is inspired by real SOC consoles, creating an immersive "command center" experience:

**Color Palette:**
| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0a0e1a` | Page background (deep midnight) |
| `--bg-card` | `#1a2035` | Card surfaces |
| `--accent-primary` | `#3b82f6` | Primary actions, links |
| `--accent-secondary` | `#8b5cf6` | Secondary accents, gradients |
| `--color-critical` | `#ef4444` | Critical severity |
| `--color-high` | `#f97316` | High severity |
| `--color-medium` | `#eab308` | Medium severity |
| `--color-low` | `#22c55e` | Low severity, success |

**Animation System:**
| Animation | Method | Performance |
|---|---|---|
| Network mesh | HTML5 Canvas (60 particles) | GPU-accelerated, ~60fps |
| Scanning beam | Canvas gradient overlay | Runs in same render loop |
| Header scan line | CSS `@keyframes` | Hardware-accelerated |
| Logo pulse | CSS box-shadow animation | Minimal CPU |
| Stat card glow | CSS conic-gradient + transition | On-hover only |
| Live feed items | CSS slide-in animation | Triggered on insertion |
| Threat meter bar | CSS transition (1s cubic-bezier) | Smooth interpolation |

### 5.2 Information Hierarchy

1. **Level 1 — Glanceable**: Threat meter + 4 stat cards (2 seconds to understand status)
2. **Level 2 — Scannable**: Alert cards with severity borders, category badges, timestamps
3. **Level 3 — Detailed**: Full alert view with AI analysis, defense checklist, edit capability
4. **Level 4 — Summary**: Safety Digest for overall community assessment

---

## 6. Data Model

### Alert Schema

```json
{
  "id": "string (unique, e.g. 'alert-001')",
  "title": "string (min 5 chars, max 200 chars)",
  "description": "string (min 10 chars)",
  "category": "enum: cyber_threat | data_breach | scam | theft | infrastructure | weather | community_event | noise | general",
  "severity": "enum: critical | high | medium | low | info",
  "source": "string (e.g. 'Community Report', 'Police Blotter')",
  "location": "string (e.g. 'Elmwood Village', 'Delaware Park')",
  "timestamp": "ISO 8601 datetime",
  "status": "enum: verified | unverified",
  "actionable": "boolean",
  "tags": "string[] (e.g. ['phishing', 'email', 'business'])"
}
```

### Synthetic Dataset Design

15 alerts set in **Buffalo, NY** designed to demonstrate:

| Category | Count | Examples |
|---|---|---|
| Cyber Threat | 3 | Phishing emails, ransomware, WiFi vulnerability |
| Data Breach | 1 | Healthcare data breach |
| Scam | 2 | IRS scam calls, fake utility workers |
| Theft | 2 | Package theft, vehicle break-ins |
| Infrastructure | 2 | Water main break, street light outage |
| Weather | 1 | Lake effect snow warning |
| Community | 1 | CPR training event |
| General/Noise | 3 | Dog barking, town venting, WiFi complaint |

**Location coverage**: Elmwood Village, Allentown, North Buffalo, University District, Delaware Park, Downtown Buffalo, South Buffalo, Kaisertown, and metro-wide alerts.

---

## 7. Security Considerations

| Area | Implementation |
|---|---|
| **API Key Protection** | Stored in `.env.local` (gitignored). `.env.example` with placeholders provided. |
| **Input Validation** | Server-side validation on all API routes (length checks, required fields, type validation). |
| **No Real Data** | Only synthetic alerts. No scraping, no real personal information, no real network data. |
| **CORS** | Next.js API routes are same-origin by default — no cross-origin risk. |
| **Error Handling** | API errors never expose stack traces or internal details. Sanitized error messages only. |
| **No Credentials in Git** | `.gitignore` covers `.env.local`, `node_modules`, and build artifacts. |

---

## 8. Testing Strategy

### 8.1 Test Coverage

| Category | Tests | Description |
|---|---|---|
| **Happy Path** | 5 | Core functionality with expected inputs |
| **Edge Cases** | 9 | Boundary conditions, error handling, graceful degradation |

### 8.2 Test Scenarios

| # | Test | Type | What It Validates |
|---|---|---|---|
| 1 | Actionable alert → NOT noise | Happy | Core noise detection accuracy |
| 2 | Venting text → IS noise | Happy | Noise keyword scoring works |
| 3 | Phishing text → cyber_threat | Happy | Category detection accuracy |
| 4 | Non-empty summary generated | Happy | Summarization produces output |
| 5 | Defense checklist for known category | Happy | Checklist retrieval works |
| 6 | Empty string input | Edge | No crash on empty input |
| 7 | Symbols-only input | Edge | Handles garbage input gracefully |
| 8 | Extremely long text | Edge | No crash, summary truncated |
| 9 | Unknown category fallback | Edge | Falls back to 'general' checklist |
| 10 | Empty alerts array digest | Edge | Valid digest from empty data |
| 11 | Mixed noise+signal text | Edge | Dominant signal wins classification |
| 12 | Unknown category name | Edge | Formatter handles gracefully |
| 13 | Unknown severity weight | Edge | Returns 0, doesn't crash |
| 14 | Excessive punctuation | Edge | Pattern analysis penalizes noise |

---

## 9. Performance Considerations

| Area | Approach |
|---|---|
| **In-memory data** | O(1) reads after JSON load — no database query overhead |
| **Client state** | React hooks only — no Redux/MobX runtime overhead |
| **Canvas rendering** | `requestAnimationFrame` loop — GPU-accelerated, pauses when tab inactive |
| **CSS animations** | Hardware-accelerated (`transform`, `opacity`, `box-shadow`) |
| **Lazy analysis** | Noise analysis runs asynchronously after initial page load |
| **CSS Custom Properties** | No CSS-in-JS runtime — all styles resolved at parse time |
| **Component design** | 1400+ lines in single file — eliminates module resolution overhead for prototype |

---

## 10. Accessibility

- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<form>`, `<button>`
- All interactive elements have unique `id` attributes for testing
- Form inputs have associated labels
- Color is never the sole indicator — text labels accompany all colored indicators
- Keyboard-navigable modal (ESC to close)
- High contrast text on dark background (WCAG AA compliant ratios)
- Reduced motion: Canvas animations are lightweight and non-distracting

---

## 11. Responsible AI Considerations

### What the AI Does
- Provides **analysis and recommendations** for alert classification
- Generates **suggested defense steps** for users to consider
- Creates **summary assessments** of community safety

### What the AI Does NOT Do
- **Never takes automated action** — all AI output is advisory
- **Never hides information** — noise alerts are dimmed, not deleted
- **Never stores or trains on user data** — each API call is stateless

### Bias Awareness
- Keyword-based fallback may have cultural/linguistic bias in "noise" classification
- AI model (GPT-3.5) may reflect training data biases in threat assessment
- Mitigation: Users can toggle noise filtering and see all alerts regardless

### Data Ethics
- All data is synthetic — no real individuals or incidents referenced
- Buffalo, NY locations are real neighborhoods but alerts are fictional
- No personally identifiable information (PII) in any alert

---

*Design document prepared for the Palo Alto Networks New Grad SWE Case Study Challenge*
*Candidate: Sriram Bandi | Scenario 3: Community Safety & Digital Wellness*
