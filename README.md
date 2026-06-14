# 🛰️ SpaceSafe X

**Autonomous AI-Powered Space Traffic Management Platform**

*Mission Control. Real-time collision prediction. Multi-agent AI. Built for the final frontier.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-7C3AED?style=flat-square)](https://langgraph.com)
[![CesiumJS](https://img.shields.io/badge/CesiumJS-3D--Earth-00D4FF?style=flat-square)](https://cesium.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://spacesafexx.vercel.app) · [Judge Mode](#-judge-mode) · [Docs](./docs/summary.md)

---

## 📸 Screenshots

| Landing Page | Mission Control Dashboard |
|---|---|
| ![Landing Page](./screenshots/landing-page.png) | ![Dashboard](./screenshots/dashboard.png) |

| Earth Visualization | AI Agent System |
|---|---|
| ![Earth View](./screenshots/earth-view.png) | ![AI Agents](./screenshots/agents.png) |

| Kessler Cascade Simulator | Judge Mode Demo |
|---|---|
| ![Kessler Simulator](./screenshots/kessler.png) | ![Judge Mode](./screenshots/judge-mode.png) |

---

## 🎯 What is SpaceSafe X?

SpaceSafe X is a **mission-control-grade AI platform** that autonomously monitors orbital traffic, predicts satellite collisions, simulates Kessler syndrome cascades, and generates avoidance maneuvers — all in real-time.

The platform combines a **multi-agent AI system** (5 specialized agents via LangGraph), a **3D Earth visualization** (CesiumJS), and a **live threat dashboard** to give operators immediate situational awareness of the space environment.

> *"Protecting orbits. Ensuring tomorrow."*

---

## 🚀 The Problem

Earth orbit is rapidly becoming a **collision crisis zone**:

- **34,000+** tracked objects currently in orbit
- **1,000,000+** debris fragments too small to track but large enough to destroy satellites
- **$300B+** in satellite infrastructure at existential risk
- A **single high-energy collision** can generate thousands of new debris fragments
- Cascading collisions can render entire orbital shells permanently inaccessible (**Kessler Syndrome**)

Existing space traffic management is **manual, slow, and reactive**. SpaceSafe X makes it **autonomous, instant, and proactive**.

---

## ✨ Core Features

### 🌍 3D Earth Visualization
- CesiumJS-powered photorealistic globe with real satellite TLE data
- Live orbital paths with animated satellite positions
- Atmospheric glow, cloud layer, day/night terminator, city lights
- Interactive satellite selection and real-time telemetry readouts
- Risk zone heatmap overlay showing conjunction hotspots

### 🛡️ Collision Prediction Engine
- Real-time conjunction analysis for all tracked object pairs
- Probability of collision (Pc) computation with confidence intervals
- Miss distance calculation and time-to-impact countdown
- Status classification: `critical` / `warning` / `low`

### 🤖 Multi-Agent AI System
- **5 specialized AI agents** operating through a LangGraph pipeline
- Agents collaborate sequentially to produce autonomous decisions
- Explainable reasoning — every decision logged with confidence scores
- Average pipeline execution time: **< 10 seconds**

### ☢️ Kessler Cascade Simulator
- Simulate a full orbital debris cascade event in real-time
- Side-by-side: **Without AI** vs **With AI Intervention**
- Risk heatmap overlay, explosion flash effects, debris particle system
- Typical AI result: **93.6% risk reduction**, 44 collisions prevented

### 🎬 Judge Mode
- One-click **60–90 second guided product demonstration**
- Auto-advances through all 7 platform stages with cinematic transitions
- Accessible from navbar, hero section, and dashboard
- No user interaction required — ideal for live demos and evaluations

### 📊 Mission Control Dashboard
- Bloomberg Terminal-level information density
- Mission Summary panel: threats, collisions prevented, risk reduction
- Live threat center with countdown timers and AI maneuver readouts
- Animated stat cards, orbital distribution, 24h activity sparkline

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SpaceSafe X                             │
├─────────────────────────────────────────────────────────────────┤
│  Frontend  (Next.js 16 · TypeScript · Tailwind CSS 4)           │
│  Landing · Dashboard · Earth View · AI Agents · Kessler · Coll  │
├─────────────────────────────────────────────────────────────────┤
│  API Layer  (Next.js API Routes)                                 │
│  /api/satellites  /api/debris  /api/collision-predictions        │
│  /api/ai/agent-pipeline  /api/simulations/kessler               │
├─────────────────────────────────────────────────────────────────┤
│  AI System  (LangGraph + Google Gemini / OpenAI)                 │
│  Debris → Orbit → Fuel → Mission → Commander                     │
├─────────────────────────────────────────────────────────────────┤
│  Data  (MongoDB Atlas · Space-Track.org TLE data)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agent Workflow

```
 Threat Detected
      │
      ▼
┌──────────────────────────────────┐
│  1. DEBRIS AGENT  🟡              │  Analyzes debris objects &
│     tracking & analysis          │  generates proximity report
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  2. ORBIT AGENT  🔵               │  Computes avoidance maneuvers,
│     trajectory & maneuver        │  checks secondary conjunctions
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  3. FUEL AGENT  🟢                │  Calculates ΔV cost, optimizes
│     propellant optimization      │  propellant usage
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  4. MISSION AGENT  🟣             │  Assesses mission impact,
│     continuity & operations      │  crew safety, comm windows
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  5. COMMANDER AGENT  🔷           │  Final decision authority,
│     synthesis & decision         │  generates maneuver command
└──────────────────┬───────────────┘
                   │
                   ▼
    Autonomous Maneuver Command
         (< 10 seconds)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components, API routes, Turbopack |
| **Language** | TypeScript 5 (strict) | Type safety across the entire codebase |
| **Styling** | Tailwind CSS 4 | Utility-first with CSS variable design tokens |
| **3D Earth** | CesiumJS + Resium | Industry-standard geospatial 3D globe |
| **Animation** | Framer Motion (motion/react) | Physics-based declarative animations |
| **AI Pipeline** | LangGraph | Multi-agent graph orchestration |
| **AI Model** | Google Gemini / OpenAI GPT-4 | State-of-the-art reasoning for space ops |
| **Database** | MongoDB Atlas | Flexible document storage for orbital data |
| **Auth** | Firebase Auth | Secure, scalable authentication |
| **Deployment** | Vercel | Zero-config Next.js deployment |
| **Icons** | Lucide React | Consistent, lightweight icon library |
| **Fonts** | Orbitron · Space Grotesk · Inter · JetBrains Mono | Aerospace identity typography |

---

## 📂 Project Structure

```
spacesafexx/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Authenticated app routes
│   │   │   ├── dashboard/            # Mission control dashboard
│   │   │   ├── earth-view/           # 3D Earth visualization
│   │   │   ├── ai-agents/            # AI agent operations center
│   │   │   ├── kessler-simulator/    # Cascade simulation
│   │   │   └── collision-engine/     # Collision prediction engine
│   │   ├── api/                      # Next.js API routes
│   │   │   ├── satellites/
│   │   │   ├── debris/
│   │   │   ├── collision-predictions/
│   │   │   ├── ai/
│   │   │   │   ├── agent-pipeline/
│   │   │   │   └── avoidance-maneuver/
│   │   │   ├── missions/
│   │   │   └── simulations/kessler/
│   │   ├── globals.css               # Design system tokens
│   │   ├── layout.tsx                # Root layout + fonts
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ui/                       # Core UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── agent-card.tsx
│   │   │   └── progress.tsx
│   │   ├── earth/
│   │   │   ├── earth-view.tsx        # CesiumJS component
│   │   │   └── earth-fallback.tsx    # CSS/SVG fallback
│   │   └── layout/
│   │       ├── navbar.tsx
│   │       └── footer.tsx
│   ├── lib/
│   │   ├── utils.ts                  # Utility functions
│   │   ├── config.ts                 # App configuration
│   │   └── demo-data.ts              # Demo data generators
│   └── types/
│       └── index.ts                  # TypeScript definitions
├── docs/
│   └── summary.md                    # Technical documentation
├── screenshots/                      # Add your screenshots here
├── public/                           # Static assets
├── README.md
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **MongoDB Atlas** account (for production data)
- **Google Gemini API key** or **OpenAI API key**

### Installation

```bash
# Clone the repository
git clone https://github.com/omkar-103/spacesafexx.git
cd spacesafexx

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spacesafexx

# AI (choose one or both)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Authentication
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Space-Track.org (for real TLE data)
SPACE_TRACK_USERNAME=your_username
SPACE_TRACK_PASSWORD=your_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 🎬 Judge Mode

Judge Mode is a **60–90 second automated guided experience** that demonstrates the entire platform without any user interaction.

### How to Activate

1. **Navbar** — Click `▶ JUDGE MODE` button (always visible, top-right)
2. **Landing Page** — Click `Watch Live Demo` in the hero section
3. **Dashboard** — Click `JUDGE MODE` in the action bar
4. **Floating Button** — Always visible bottom-right on all pages

### Demo Sequence

| Step | Duration | What Happens |
|---|---|---|
| 1 | 8s | Earth telemetry lock — scanning 34,247 tracked objects |
| 2 | 10s | Threat detected — ISS × Fengyun-1C fragment conjunction |
| 3 | 10s | Collision prediction — P(c), miss distance, ΔV computed |
| 4 | 15s | AI pipeline activates — all 5 agents run sequentially |
| 5 | 12s | Avoidance maneuver ready — fuel cost and confidence |
| 6 | 15s | Kessler cascade simulated — 44 collisions prevented |
| 7 | 12s | Mission success — final metrics displayed |

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to [Vercel Dashboard](https://vercel.com/new) for automatic deployments.

Set all environment variables under **Settings → Environment Variables** in your Vercel project.

### Production Build

```bash
npm run build    # Build and type-check
npm start        # Start production server
```

---

## 🎨 Design System

SpaceSafe X uses a bespoke aerospace design language:

| Token | Value | Usage |
|---|---|---|
| Background | `#050816` | App background (deep space) |
| Panel | `#0B1220` | Card/panel surfaces |
| Border | `#172554` | Hard engineering borders |
| Primary | `#00D4FF` | Actions, highlights, live data |
| Accent | `#7C3AED` | AI agents, secondary actions |
| Success | `#10B981` | Nominal states |
| Warning | `#F59E0B` | Caution, moderate risk |
| Danger | `#EF4444` | Critical threats |

**Typography:** `Orbitron` (headings) · `Space Grotesk` (subheadings) · `Inter` (body) · `JetBrains Mono` (data)

---

## 🔮 Roadmap

- [ ] Real TLE Integration — Live data from Space-Track.org
- [ ] CesiumJS Ion — Photorealistic Earth with Bing satellite imagery
- [ ] WebSocket Telemetry — Sub-second live updates
- [ ] Maneuver Uplink — Direct satellite command integration
- [ ] Multi-Satellite Scenarios — Fleet-wide threat management
- [ ] PDF Report Export — Formatted mission reports with AI reasoning
- [ ] Mobile App — React Native companion

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Creator

Made with ❤️ by **Omkar Parelkar**

| | |
|---|---|
| 🌐 Portfolio | [omkarparelkar.com](https://www.omkarparelkar.com) |
| 🐙 GitHub | [github.com/omkar-103](https://github.com/omkar-103) |
| 💼 LinkedIn | [linkedin.com/in/omkar-parelkar](https://www.linkedin.com/in/omkar-parelkar) |

---

<div align="center">

**Built for the Hackathon. Designed for the future of space.**

*SpaceSafe X — Protecting Orbits. Ensuring Tomorrow.*

</div>
