# Community Guardian

A community safety dashboard that pulls in local alerts, uses AI to figure out what's actually worth paying attention to, and gives you steps to stay safe. Built with Next.js and OpenAI.

---

## About

| | |
|---|---|
| **Name** | Sriram Bandi |
| **Scenario** | Scenario 3 — Community Safety & Digital Wellness |
| **Time Spent** | Around 6 hours |

---

## Video Demo

> [Watch on YouTube](https://youtube.com) — *(link coming soon)*

---

## Getting Started

You need Node.js 18+ and npm. The OpenAI key is optional — everything works without it using a rule-based fallback.

```bash
git clone https://github.com/Sreeram137/community-guardian.git
cd community-guardian
npm install

# if you want AI features
cp .env.example .env.local
# put your OpenAI key in .env.local

npm run dev
# go to http://localhost:3000
```

Run tests:
```bash
npm test
```

---

## The Problem

Safety info is scattered everywhere — social media, local news, neighborhood apps, government sites. People either miss real threats because they're buried under noise, or they see too much and just get stressed. I wanted to build something that filters out the noise and gives you a clear picture of what's going on with steps you can actually take.

## What It Does

- Pulls in community alerts and shows them on a dashboard with severity levels
- AI figures out which alerts are real threats vs people just venting online
- Generates defense checklists — actual steps to protect yourself
- Creates a safety digest — a calm summary instead of a scary raw feed
- Lets you filter by neighborhood (Buffalo, NY areas)
- Has a threat level meter that scores overall community safety
- Shows a live activity feed with network events
- Full CRUD — create, edit, delete, search, filter alerts

---

## Tech

| | |
|---|---|
| Next.js 16 | Frontend + API in one project |
| React 19 | Just hooks, no Redux needed |
| Vanilla CSS | ~1800 lines, full control over the design |
| OpenAI GPT-3.5 | For noise detection, categorization, checklists |
| Rule-based fallback | Keyword scoring when there's no API key |
| Jest | 14 tests |
| Canvas | Animated network background |

---

## How It's Structured

```
community-guardian/
├── src/app/
│   ├── page.js                   # main app
│   ├── globals.css               # styles
│   ├── layout.js                 # root layout
│   └── api/
│       ├── alerts/route.js       # list + create alerts
│       ├── alerts/[id]/route.js  # get, update, delete
│       └── analyze/route.js      # AI analysis
├── src/lib/aiService.js          # AI engine + fallback
├── data/synthetic_alerts.json    # 15 sample alerts
└── __tests__/aiService.test.js   # tests
```

The architecture is straightforward. React frontend talks to Next.js API routes. The analysis endpoint tries OpenAI first, and if that fails (no key, error, rate limit), it switches to a rule-based engine I built that uses keyword matching and scoring heuristics.

---

## AI Features

Three main things happen on the AI side:

**Noise detection** — looks at an alert's text and decides if it's an actual threat or someone complaining. Returns noise/signal classification, category, severity, summary, and confidence.

**Defense checklists** — given a threat category, generates 5 practical steps. The fallback has checklists I put together from security best practices for each category.

**Safety digest** — takes all alerts and writes a summary that's informative but not scary.

The fallback works by scoring text against noise keywords (omg, annoying, ugh — 15 total) and signal keywords (breach, phishing, alert — 21 total). Signal words count double. It also checks for excessive punctuation and caps. If noise score beats signal score, it's noise.

The header shows whether AI or fallback is active, and every analysis says how it was done.

---

## What It Looks Like

The UI has a dark cybersecurity theme. There's a canvas-based animated background with network nodes, a threat level meter that scores the community from 0-100, and a live feed that simulates network events updating every 5 seconds.

Alert cards show severity with color-coded borders. Noise alerts get dimmed but not hidden — you can toggle them on and off. I didn't want to hide info from people.

The dashboard has four stat cards (total alerts, critical count, verified count, noise filtered), then the threat meter, then recent alerts, then the live feed at the bottom.

---

## Tests

14 tests — 5 happy path, 9 edge cases. All targeting the fallback engine since that's the most critical piece.

```
PASS  __tests__/aiService.test.js
  ✓ actionable alert identified as NOT noise
  ✓ venting/noise correctly flagged
  ✓ phishing text → cyber_threat category
  ✓ non-empty summary generated
  ✓ defense checklist works for known categories
  ✓ empty string doesn't crash
  ✓ symbols-only input handled
  ✓ very long text doesn't crash
  ✓ unknown category falls back gracefully
  ✓ empty alerts array → valid digest
  ✓ mixed noise+signal text classified correctly
  ✓ unknown category name handled
  ✓ unknown severity returns 0
  ✓ excessive punctuation penalized

14 passed, 0 failed
```

---

## Responsible AI

- AI advises, it doesn't decide. Noise alerts are dimmed, not deleted.
- All data is synthetic. No real people or incidents.
- You always know if AI or the fallback made the call.
- App works fully without any API key.
- Keyword-based fallback might not catch everything — that's why the toggle exists.
- API keys are in .env.local (gitignored), never committed.

---

## Tradeoffs

Had about 6 hours so I cut some stuff:

- No database — using in-memory store, resets on restart
- No user accounts — focused on the safety features
- No real websockets — polling + simulated feed
- No map view — locations are text-based
- Unit tests only — focused on the AI engine

With more time I'd add:
- Database persistence
- User auth and preferences
- WebSocket real-time updates
- Interactive map
- Community voting on alerts
- Mobile PWA

---

## AI Tools

I used Copilot and Gemini for help with scaffolding and debugging. Reviewed everything manually, tested in the browser, and wrote the test suite myself. Rejected Redux suggestion — hooks were enough for this.

---

MIT License
