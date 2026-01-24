'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Scan {
  id: string
  symbol: string
  name: string
  trend: 'up' | 'down' | 'sideways'
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  explanation: string
  timestamp: string
}

interface ScansContextType {
  scans: Scan[]
  addScan: (scan: Omit<Scan, 'id' | 'timestamp'>) => void
  removeScan: (id: string) => void
}

const ScansContext = createContext<ScansContextType | undefined>(undefined)

// Comprehensive mock scans for presentation
const MOCK_SCANS: Scan[] = [
  {
    id: 'scan-001',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    trend: 'up',
    riskLevel: 'low',
    confidence: 92,
    explanation: 'Strong bullish momentum with MACD crossover confirmed. RSI at 62 indicates room for upside. Support established at $182. AI detected ascending triangle pattern with high probability breakout.',
    timestamp: '2 min ago',
  },
  {
    id: 'scan-002',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    trend: 'up',
    riskLevel: 'medium',
    confidence: 87,
    explanation: 'AI chip demand driving sustained uptrend. Volume surge on breakout above $750. Fibonacci extension targets $820. Watch for profit-taking near resistance.',
    timestamp: '15 min ago',
  },
  {
    id: 'scan-003',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    trend: 'down',
    riskLevel: 'high',
    confidence: 78,
    explanation: 'Bearish divergence on daily RSI. Price rejected at 200-day MA. Support at $195 critical—break below triggers sell signal. High volatility expected around earnings.',
    timestamp: '32 min ago',
  },
  {
    id: 'scan-004',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    trend: 'up',
    riskLevel: 'low',
    confidence: 89,
    explanation: 'Steady accumulation pattern. Cloud revenue growth supporting fundamentals. Cup-and-handle formation nearing completion. AI integration narrative strengthening.',
    timestamp: '1 hour ago',
  },
  {
    id: 'scan-005',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    trend: 'sideways',
    riskLevel: 'medium',
    confidence: 71,
    explanation: 'Consolidating in $175-$185 range. AWS growth steady but retail margins under pressure. Wait for directional breakout before positioning.',
    timestamp: '2 hours ago',
  },
  {
    id: 'scan-006',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    trend: 'up',
    riskLevel: 'low',
    confidence: 85,
    explanation: 'Ad revenue recovery accelerating. Reality Labs losses narrowing. Bullish flag pattern on weekly chart. Next target $540.',
    timestamp: '3 hours ago',
  },
  {
    id: 'scan-007',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    trend: 'up',
    riskLevel: 'low',
    confidence: 83,
    explanation: 'Search dominance intact despite AI competition fears. YouTube and Cloud segments growing. Dividend initiation positive for sentiment.',
    timestamp: '4 hours ago',
  },
  {
    id: 'scan-008',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    trend: 'sideways',
    riskLevel: 'medium',
    confidence: 68,
    explanation: 'Interest rate uncertainty causing range-bound action. Strong balance sheet but net interest margin compression ahead. Hold for dividend.',
    timestamp: '5 hours ago',
  },
  {
    id: 'scan-009',
    symbol: 'V',
    name: 'Visa Inc.',
    trend: 'up',
    riskLevel: 'low',
    confidence: 81,
    explanation: 'Travel spending recovery driving transaction volume. Cross-border fees surging. Technical breakout above $285 confirmed.',
    timestamp: '6 hours ago',
  },
  {
    id: 'scan-010',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    trend: 'up',
    riskLevel: 'medium',
    confidence: 79,
    explanation: 'MI300 AI accelerator gaining traction. Data center market share expanding. Elevated P/E but growth justifies premium.',
    timestamp: '8 hours ago',
  },
  {
    id: 'scan-011',
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    trend: 'down',
    riskLevel: 'medium',
    confidence: 74,
    explanation: 'Enterprise software spending slowdown impacting growth. Activist pressure for cost cuts. Key support at $245—watch closely.',
    timestamp: '12 hours ago',
  },
  {
    id: 'scan-012',
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    trend: 'sideways',
    riskLevel: 'high',
    confidence: 65,
    explanation: 'Streaming losses weighing on profitability. Parks segment strong but cyclical risks. Avoid until clearer direction emerges.',
    timestamp: '1 day ago',
  },
  {
    id: 'scan-013',
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    trend: 'up',
    riskLevel: 'medium',
    confidence: 76,
    explanation: 'Password sharing crackdown boosting subscriber growth. Ad-tier gaining traction. Content slate looks strong for H2.',
    timestamp: '1 day ago',
  },
  {
    id: 'scan-014',
    symbol: 'BA',
    name: 'Boeing Company',
    trend: 'down',
    riskLevel: 'high',
    confidence: 72,
    explanation: 'Quality control issues impacting deliveries. FAA scrutiny ongoing. Avoid until safety concerns fully addressed.',
    timestamp: '2 days ago',
  },
  {
    id: 'scan-015',
    symbol: 'GS',
    name: 'Goldman Sachs',
    trend: 'up',
    riskLevel: 'medium',
    confidence: 77,
    explanation: 'Investment banking recovery underway. Trading revenues solid. Marcus consumer pivot stabilizing.',
    timestamp: '2 days ago',
  },
]

export function ScansProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<Scan[]>(MOCK_SCANS)

  const addScan = (scan: Omit<Scan, 'id' | 'timestamp'>) => {
    const newScan: Scan = {
      ...scan,
      id: `scan-${Date.now()}`,
      timestamp: 'just now',
    }
    setScans((prev) => [newScan, ...prev])
  }

  const removeScan = (id: string) => {
    setScans((prev) => prev.filter((scan) => scan.id !== id))
  }

  return <ScansContext.Provider value={{ scans, addScan, removeScan }}>{children}</ScansContext.Provider>
}

export function useScans() {
  const context = useContext(ScansContext)
  if (!context) {
    throw new Error('useScans must be used within a ScansProvider')
  }
  return context
}
