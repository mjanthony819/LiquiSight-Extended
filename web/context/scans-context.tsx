'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Scan {
  id: string
  symbol: string
  name: string
  trend: 'up' | 'down'
  trendPercent: string
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  timestamp: string
}

interface ScansContextType {
  scans: Scan[]
  addScan: (scan: Omit<Scan, 'id' | 'timestamp'>) => void
  removeScan: (id: string) => void
}

const ScansContext = createContext<ScansContextType | undefined>(undefined)

export function ScansProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<Scan[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      trend: 'up',
      trendPercent: '+5.2%',
      riskLevel: 'low',
      confidence: 94,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      trend: 'down',
      trendPercent: '-2.3%',
      riskLevel: 'high',
      confidence: 87,
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      trend: 'up',
      trendPercent: '+3.8%',
      riskLevel: 'low',
      confidence: 91,
      timestamp: '6 hours ago',
    },
  ])

  const addScan = (scan: Omit<Scan, 'id' | 'timestamp'>) => {
    const newScan: Scan = {
      ...scan,
      id: Date.now().toString(),
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
