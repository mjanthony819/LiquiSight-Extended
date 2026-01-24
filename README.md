# LiquiSight
Visual Finance Copilot

## Project Structure

```
visual-finance/
├── extension/        # Chrome extension
├── backend/          # AI + API
├── web/              # Dashboard + portfolio
├── ppt/              # Pitch slides
└── README.md
```

## Components

### 📦 Extension
Chrome extension for browser-based financial data capture and visualization.

### 🤖 Backend
AI-powered API services for financial analysis and data processing.

### 🌐 Web
Dashboard and portfolio management web application.

### 📊 PPT
Pitch decks and presentation materials.

## Getting Started

Each component has its own README with specific setup instructions. Navigate to the respective directories for more details.

## Unified Environment Variables

This repo uses a single environment file at the repo root:

- Copy `.env.example` to `.env`
- Fill in your keys (OpenAI / Gemini / OpenRouter, Supabase, etc.)

The services are configured to read from the root `.env` automatically.

### Run the AI API (FastAPI)

From the repo root:

- `py -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000`

### Run the Web Dashboard (Next.js)

From `web/`:

- `pnpm dev` (or `npm run dev`)

### Extension

Load the `extension/` folder as an unpacked extension in Chrome.
