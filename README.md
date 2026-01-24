# LiquiSight

Visual Finance Copilot for analyzing stock charts and managing a lightweight portfolio across a browser extension, FastAPI backend, and Next.js dashboard.[page:2]

## Architecture Overview

LiquiSight is a monorepo with three main runtime components and supporting pitch materials:[page:2]

```
visual-finance/
├── extension/   # Chrome extension (side panel, page scraping, user actions)
├── backend/     # FastAPI service with AI-driven analysis endpoints
├── web/         # Next.js dashboard + portfolio UI
├── ppt/         # Pitch / design slides
└── README.md
```
Extension: Captures finance-related context from the browser (e.g., chart pages, ticker info) and can send it to the backend.[page:2]

Backend: FastAPI app exposing an /analyze endpoint that runs AI models over chart/market data.[page:1]

Web: Next.js App Router app for running analyses, viewing results, and managing a simple portfolio.[page:1]

Features
Run AI-powered analysis on stock charts or symbols.

Get structured insights: trend, risk, confidence, and explanation.[page:1]

View recent analyses and (optionally) portfolio-related data in a web UI.

Use a Chrome extension to bring context from real trading/research sites directly into LiquiSight.[page:1]

Tech Stack
Backend: Python, FastAPI, uvicorn.[page:1]

Web: Next.js (TypeScript), React.[page:1]

Extension: Chrome extension (MV3-style structure), HTML/JS/CSS.[page:1]

AI: Pluggable LLM providers via keys configured in .env (OpenAI, Gemini, OpenRouter, etc.).[page:1]

Infra / tooling: Node.js + pnpm/npm, environment-based configuration via root .env.[page:1]

Project Structure
See top-level layout:[page:2]

text
backend/     # AI + API (FastAPI)
extension/   # Chrome extension
web/         # Next.js dashboard + portfolio
ppt/         # Pitch slides and diagrams
.env.example # Root env template shared across services
Each subfolder has its own README with setup or domain-specific notes.[page:2]

Getting Started
1. Prerequisites
Python 3.10+ for the backend.

Node.js (LTS) and pnpm or npm for the web app.[page:1]

Chrome (or Chromium-based browser) for the extension.

2. Environment Configuration
LiquiSight uses a single root environment file for all components:[page:2]

Copy the example env file:

bash
cp .env.example .env
Fill in provider keys:

LLM providers: OpenAI / Gemini / OpenRouter.

Database / auth: e.g., Supabase keys, if used.

Any other required secrets referenced by backend or web code.[page:2]

All services read from the root .env automatically.[page:2]

Running the Services
Backend – FastAPI AI API
From the repo root:[page:2]

bash
py -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
Exposes HTTP endpoints defined in backend/main.py and related modules.[page:1]

The main analysis endpoint is /analyze (JSON in, JSON out). See backend/contract.md for the exact schema.[page:1]

Example (pseudo) request contract:[page:1]

text
POST /analyze
Content-Type: application/json

{
  "input": "chart or ticker payload"
}
Example response contract:[page:1]

json
{
  "stock_name": "AAPL",
  "trend": "Uptrend",
  "risk": "Medium",
  "confidence": 0.76,
  "explanation": "Model-generated narrative..."
}
Web – Next.js Dashboard
From the web/ directory:[page:2]

bash
pnpm dev
# or
npm run dev
Runs the dashboard on the default Next.js dev port (usually http://localhost:3000).[page:2]

Uses the backend API (e.g., http://localhost:8000/analyze) based on env configuration.[page:1]

High-level flows:

Home page: UI to trigger /analyze and render the result.[page:1]

Additional views: history/portfolio if implemented in the app/ structure.[page:1]

Extension – Chrome
Build or ensure dependencies for the extension, if required.

In Chrome:

Go to chrome://extensions.

Enable Developer mode.

Click Load unpacked and select the extension/ folder.[page:1]

This loads the LiquiSight side panel / extension UI.

API Contract (High Level)
The backend contract is documented in backend/contract.md and treated as the source of truth for integration.[page:1]

Key object shape returned by the main analysis endpoint:[page:1]

ts
type AnalysisResult = {
  stock_name: string;
  trend: string;
  risk: string;
  confidence: number;   // 0–1
  explanation: string;
};
Any frontend client (web or extension) should:

Send the request body shape defined in contract.md.

Consume the response as above without renaming fields.[page:1]

Development Notes for SDEs
Monorepo with shared configuration: root .env is intentionally used by backend, web, and extension to avoid drift.[page:2]

The backend is stateless HTTP; scale by running more uvicorn workers or containerizing the app.

The web app uses the Next.js App Router and app/-based routing for pages and API routes.[page:1]

The extension can be enhanced to:

Detect symbols from broker/research pages.

Send data directly to the backend (e.g., POST /analyze) and show inline results.[page:1]

Roadmap / Ideas
Improve analysis prompts and models for multi-asset and multi-timeframe views.

Persist user history and portfolio to a database (e.g., Supabase) behind the existing API layer.

Enhance extension UX (page overlays, interactive tooltips).
