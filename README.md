# 🕹️ Microskill Arcade

> **Version 1.0** | Evidence-based microlearning platform delivering 5–15 minute skill acquisition sessions across typing, languages, math, and coding with adaptive difficulty, spaced repetition scheduling, and retention analytics.

App Demo: https://microskillversion-10.vercel.app/
---

## 🚀 About The Project

Microskill Arcade solves the "infinite grind" problem of traditional e-learning by replacing passive consumption with high-engagement, science-backed micro-sessions.

### Key Differentiators

* **Science-Backed Algorithm:** Uses a spaced repetition scheduler combined with confidence calibration (not generic gamification).
* **Session-Based UX:** Optimized for 5–15 minute natural endpoints.
* **Measurable Retention:** Targets >80% 30-day recall benchmarks.
* **Transparent Mastery:** Built on composite scores (Accuracy + Calibration + Consistency) rather than opaque "levels."

---

## 🎮 Skill Categories & Game Types

| Category | Key Metrics | Core Game Types |
| --- | --- | --- |
| **Typing** | WPM, Accuracy %, Key Error Rate | Keystroke Rhythm, Word Sprint, Autocorrect Hunt |
| **Languages** | Receptive/Productive Fluency %, Confidence Alignment | Translation Match, Conversation Snippet, Vocabulary Duel, Phrase Builder |
| **Mathematics** | Calculation Speed, Accuracy %, Problem-Solving Time | Calculation Sprint, Pattern Vault, Problem Solver, Equation Builder |
| **Coding** | Syntax Accuracy %, Algorithm Efficiency, Debug Speed | Syntax Puzzle, Algorithm Visualizer, Bug Bounty, API Challenge |

---

## 🧠 Retention Science Engine

* **Spaced Repetition:** Dynamic intervals shifting from 1 day up to 90 days based on mastery levels, historical decay rates, and actual accuracy.
* **Confidence Calibration:** Tracks the delta between user-stated confidence (1–5 scale) and actual performance to fine-tune review intervals.
* **Mastery Formula:**

$$\text{Mastery} = (\text{Accuracy} \times 0.6) + (\text{Confidence Calibration} \times 0.3) + (\text{Consistency} \times 0.1)$$



---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| **Frontend (Web)** | React 18 + TypeScript + Vite | Type safety, fast HMR, modern tooling |
| **Frontend (Mobile)** | React Native / Expo | Cross-platform code sharing (iOS & Android) |
| **Backend** | Node.js (Express/Fastify) or Python (FastAPI) | Developer velocity & microservice-friendliness |
| **Database** | PostgreSQL + Redis | ACID compliance for records + low-latency caching for sessions |
| **Auth** | Auth0 / Firebase Auth | Outsourced security complexity, multi-provider support |
| **Analytics & Observability** | PostHog & Datadog | Product cohort tracking, APM, and error monitoring |

---

## 🗄️ Database Schema Overview

The core persistent layer (`PostgreSQL`) relies on the following foundational tables:

* `users`: Profile data, account tiers (`free`, `premium`, `team`), and preferences.
* `skills`: Master categories (`typing`, `language`, `math`, `coding`).
* `concepts`: Granular learning nodes (e.g., *Spanish Present Tense*, *Python Loops*).
* `game_sessions`: Atomic play events logging duration, difficulty level, and aggregate accuracy.
* `review_schedules`: Spaced repetition tracking mapping users to specific concepts and next-review dates.
* `answer_history`: Granular answer-level telemetry (response time, confidence, correctness).

---

## ⚙️ Getting Started (Development Setup)

### Prerequisites

* Node.js (v18+) or Python (v3.10+)
* PostgreSQL & Redis instances running locally or via Docker
* pnpm or npm

### Installation & Local Run

1. **Clone the repository**
```bash
git clone https://github.com/your-org/microskill-arcade.git
cd microskill-arcade

```


2. **Configure Environment Variables**
Copy `.env.example` to `.env` and fill out your database strings, Redis URLs, and Auth credentials.
3. **Install Dependencies**
```bash
# For web frontend & node backend workspace
npm install

```


4. **Run Database Migrations**
```bash
npm run db:migrate

```


5. **Start Development Server**
```bash
npm run dev

```



---

## 🗺️ Roadmap

* **Phase 1: MVP (Months 1–4)**
* Single skill (Typing), 2 game types, basic spaced repetition scheduler, minimal dashboard, and PWA support.


* **Phase 2: Expansion (Months 5–8)**
* Integration of Language, Math, and Coding domains; advanced confidence tracking; mobile application release.


* **Phase 3: Scale & Monetization (Months 9–12)**
* Premium tier rollout, team/school administrative dashboards, and LMS integrations (Canvas, Blackboard).



---

## 📄 License & Compliance

* **Data Privacy:** Fully GDPR-compliant with user-initiated JSON data exports and full account deletion requests.
* **Terms:** Proprietary / Internal Use (Version 1.0).
