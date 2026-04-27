# 🚨 CrisisSync — AI-Powered Hotel Crisis Coordination

Real-time emergency detection, AI triage, and coordinated response for hospitality venues.

## Quick Start

```bash
# 1. Install all dependencies
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Set your Gemini API key
#    Edit backend/.env and replace your_key_here with a valid key

# 3. Run the app
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Google Gemini 1.5 Flash |
| Realtime | Socket.io |
| Data | In-memory (resets on restart) |

## Features

- **Guest SOS** — One-tap emergency reporting with room & description
- **AI Triage** — Gemini classifies type, severity, zone, and generates instructions
- **Staff Dashboard** — Live incident feed with filter tabs and resolve actions
- **Manager Overview** — Stats, severity distribution, 911 briefing generation
- **Responder Console** — 911-flagged incidents with timeline and AI briefings
- **Real-time Sync** — All views update instantly via WebSocket

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/sos` | Submit emergency (triggers AI triage) |
| GET | `/api/incidents` | List all incidents |
| PATCH | `/api/incidents/:id/resolve` | Mark incident resolved |
| POST | `/api/briefing/:id` | Generate 911 responder briefing |

## Roles

Switch between roles using the tab bar — no auth required:

- 🧑 **Guest** — Send SOS reports
- 👷 **Staff** — View tasks & instructions
- 📊 **Manager** — Full overview + briefing generation
- 🚒 **Responder** — 911-flagged incidents + briefings
