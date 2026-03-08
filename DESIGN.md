# Community Guardian — Design Doc

## Overview

Community Guardian is a community safety platform that aggregates local alerts, filters out noise using AI, and gives people actionable information instead of just scaring them. The idea is basically a neighborhood-level security operations center.

The main goal was to solve alert fatigue — where people are overwhelmed by scattered safety info from too many sources and either miss real threats or just get anxious.

---

## Design Choices

A few things I prioritized:

**Helpful, not scary.** Most safety apps just throw raw threat data at you. I wanted this to feel more like a calm briefing. The safety digest summarizes everything in a reassuring way, and defense checklists give you actual steps instead of just "be careful."

**Always works.** If the OpenAI API is down or you don't have a key, the app switches to a rule-based engine automatically. You always know which mode is active because there's a badge in the header.

**Don't hide things.** Noise alerts get dimmed (lower opacity, dashed border) but they're still there. Users can toggle them. I didn't want to make filtering decisions for people without giving them control.

**Show your work.** Every analysis says whether it came from AI or the fallback engine, plus a confidence score. If the fallback kicked in, it tells you why.

---

## Architecture

Three layers:

**Frontend** — React components for the dashboard, alert cards, detail views, threat meter, live feed, and the animated background.

**API** — Next.js API routes for CRUD operations on alerts and dispatching AI analysis. All inputs validated server-side.

**AI Engine** — Tries OpenAI first. On failure, falls back to a keyword-scoring engine I built.

```
React Frontend
    ↓
Next.js API Routes
    ↓
AI Engine
    ├── OpenAI (primary)
    └── Rule-based fallback (secondary)
    ↓
In-memory data store
```

### API Endpoints

| Route | Methods | What it does |
|---|---|---|
| /api/alerts | GET, POST | List with filters, create new |
| /api/alerts/:id | GET, PUT, DELETE | Single alert operations |
| /api/analyze | POST | AI analysis (analyze, checklist, digest) |

---

## AI System

Three capabilities:

**Noise Detection** — Takes alert text, returns whether it's noise, what category it is, severity, a summary, and confidence. The AI prompt asks for structured JSON.

**Defense Checklists** — Given a category (cyber_threat, scam, etc.), generates 5 practical defense steps. Fallback has pre-written checklists for each category.

**Safety Digest** — Takes all alerts and produces a calm summary with critical counts and top concerns.

### How the Fallback Works

The noise detection fallback scores text two ways:

- Noise keywords (15 words like "omg", "annoying", "ugh") — each match adds 1 point
- Signal keywords (21 words like "breach", "phishing", "emergency") — each match adds 2 points
- Too many exclamation marks → +2 noise
- High caps ratio → +1 noise
- Short text with no signal keywords → +1 noise

If noise score > signal score, it's classified as noise.

Category detection matches text against 7 keyword dictionaries and picks the best match. Confidence scales with match count.

It's not as smart as GPT but it handles the common cases well enough.

---

## Visual Design

Dark theme inspired by security dashboards. Navy background with blue and purple accents.

Key visual elements:
- Canvas-rendered network mesh (60 floating nodes with connections)
- Threat level meter with gradient bar (green → red based on alert severities)
- Live activity feed showing simulated network events
- Scanning animations on the header
- Glow effects on stat cards when you hover
- Color-coded severity borders on alert cards

The design has four information layers:
1. Stat cards + threat meter — get the picture in 2 seconds
2. Alert cards — scan titles, severities, locations
3. Alert detail — full description, AI analysis, checklist
4. Safety digest — community-wide summary

---

## Data Model

Each alert has:
- id, title, description
- category (cyber_threat, data_breach, scam, theft, infrastructure, weather, community_event, noise, general)
- severity (critical, high, medium, low, info)
- source, location, timestamp
- status (verified/unverified)
- actionable (boolean)
- tags (array)

The sample data has 15 alerts set in Buffalo, NY neighborhoods. Mix of real threats (phishing, ransomware, break-ins) and noise (dog barking complaints, WiFi venting) to test the filtering.

---

## Security

- API keys in .env.local, gitignored
- Server-side input validation on all routes
- All data is synthetic — no real people or incidents
- Errors don't expose internals to the client
- Same-origin API routes (no CORS issues)

---

## Testing

14 tests total against the fallback engine:

5 happy path:
- Actionable alert → not noise
- Venting text → noise
- Phishing text → cyber_threat
- Summary is non-empty
- Checklist returns for known category

9 edge cases:
- Empty string
- Symbols only
- Very long text
- Unknown category
- Empty alerts array
- Mixed signal + noise text
- Unknown category name formatting
- Unknown severity weight
- Excessive punctuation

All pass in under a second.

---

## What I'd Improve

With more time:
- Replace in-memory store with a real database
- Add user accounts and preferences
- WebSocket for real-time updates
- Map view with geocoded pins
- Community voting on alerts
- Mobile PWA
- Better pagination
- Batch AI calls instead of sequential

---

## Ethical Stuff

The AI only provides suggestions — it never takes action automatically. Noise alerts are dimmed, not removed. All data is fake. The fallback engine's keyword approach might have some bias in how it classifies "noise" across different writing styles, which is why giving users the toggle to override is important.
