
'use client'

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { fetchLatestScans, ScanRecord } from '@/lib/analyze'
import { onScansUpdated } from '@/lib/scans-events'

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

export function ScansProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ScanRecord[]>([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await fetchLatestScans(25)
        if (isMounted) setRecords(data)
      } catch (err) {
        console.warn('Failed to load scans for context:', err)
        if (isMounted) setRecords([])
      }
    }

    load()
    const unsubscribe = onScansUpdated(() => {
      load()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const scans = useMemo<Scan[]>(() => {
    const now = new Date()

    function formatRelative(dateString: string) {
      const date = new Date(dateString)
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'just now'
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      return `${diffDays} days ago`
    }

    return records.map((r) => {
      const symbol = (r.stock_name || '').trim().split(/\s+/)[0]?.toUpperCase() || '—'
      const trend =
        r.trend === 'Downtrend' ? 'down' : r.trend === 'Sideways' ? 'sideways' : 'up'

      return {
        id: r.id,
        symbol,
        name: r.stock_name,
        trend,
        riskLevel: r.risk.toLowerCase() as 'low' | 'medium' | 'high',
        confidence: Math.round(r.confidence * 100),
        explanation: r.explanation,
        timestamp: formatRelative(r.created_at),
      }
    })
  }, [records])

  const addScan = (scan: Omit<Scan, 'id' | 'timestamp'>) => {
    const newScan: Scan = {
      ...scan,
      id: Date.now().toString(),
      timestamp: 'just now',
    }
    setRecords((prev) => {
      const synthetic: ScanRecord = {
        id: newScan.id,
        stock_name: newScan.name,
        trend: newScan.trend === 'down' ? 'Downtrend' : newScan.trend === 'sideways' ? 'Sideways' : 'Uptrend',
        risk: (newScan.riskLevel.charAt(0).toUpperCase() + newScan.riskLevel.slice(1)) as ScanRecord['risk'],
        confidence: newScan.confidence / 100,
        explanation: newScan.explanation,
        user_id: null,
        created_at: new Date().toISOString(),
      }
      return [synthetic, ...prev]
    })
  }

  const removeScan = (id: string) => {
    setRecords((prev) => prev.filter((scan) => scan.id !== id))
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
