'use client'

import { AlertTriangle, ShieldAlert, Sparkles, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { ThemeToggle } from './theme-toggle'
import { Card } from '@/components/ui/card'
import RecentScans from '@/components/recent-scans'
import { useScans } from '@/context/scans-context'

interface DashboardProps {
  onOpenNewScan?: () => void
  onScanSelect?: (symbol: string) => void
}

export default function Dashboard({ onOpenNewScan, onScanSelect }: DashboardProps) {
  const { scans } = useScans()

  const summary = useMemo(() => {
    const total = scans.length
    const avgConfidence = total ? Math.round(scans.reduce((sum, s) => sum + s.confidence, 0) / total) : 0
    const highRisk = scans.filter((s) => s.riskLevel === 'high').length
    const mediumRisk = scans.filter((s) => s.riskLevel === 'medium').length
    const lowRisk = scans.filter((s) => s.riskLevel === 'low').length
    const latest = scans[0] ?? null
    return { total, avgConfidence, highRisk, mediumRisk, lowRisk, latest }
  }, [scans])

  const TrendIcon = summary.latest?.trend === 'up' ? TrendingUp : summary.latest?.trend === 'down' ? TrendingDown : Minus
  const trendLabel = summary.latest?.trend === 'up' ? 'Uptrend' : summary.latest?.trend === 'down' ? 'Downtrend' : 'Sideways'
  const trendColor = summary.latest?.trend === 'up' ? 'text-success' : summary.latest?.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              Dashboard
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                Scan-driven
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Your latest chart analyses and risk signals.</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => onOpenNewScan?.()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-95 transition"
            >
              <Plus className="w-4 h-4" />
              New Scan
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total scans</p>
            <p className="text-3xl font-bold text-foreground mt-2">{summary.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Stored in Supabase</p>
          </Card>

          <Card className="p-5 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg confidence</p>
            <p className="text-3xl font-bold text-foreground mt-2">{summary.avgConfidence}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across recent scans</p>
          </Card>

          <Card className="p-5 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">High risk</p>
            <p className="text-3xl font-bold text-destructive mt-2">{summary.highRisk}</p>
            <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
          </Card>

          <Card className="p-5 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk mix</p>
            <p className="text-sm font-semibold text-foreground mt-2">Low {summary.lowRisk} • Med {summary.mediumRisk} • High {summary.highRisk}</p>
            <p className="text-xs text-muted-foreground mt-1">From scan history</p>
          </Card>
        </div>

        {/* Latest scan */}
        <Card className="p-6 border border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">Latest scan</h2>
              {!summary.latest ? (
                <p className="text-sm text-muted-foreground mt-1">No scans yet. Run your first scan to populate the dashboard.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{summary.latest.symbol}</span>
                    <span className={`text-xs font-semibold ${trendColor} inline-flex items-center gap-1`}>
                      <TrendIcon className="w-4 h-4" />
                      {trendLabel}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">Risk: {summary.latest.riskLevel}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">Confidence: {summary.latest.confidence}%</span>
                    <span className="text-xs text-muted-foreground">{summary.latest.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{summary.latest.explanation}</p>
                </div>
              )}
            </div>

            {summary.latest && (
              <button
                type="button"
                onClick={() => onScanSelect?.(summary.latest!.symbol)}
                className="inline-flex items-center gap-2 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/50 px-4 py-2 text-sm font-semibold text-foreground transition"
              >
                Details
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card>

        {/* Recent scans list */}
        <RecentScans onScanClick={onScanSelect} maxItems={8} />

        {summary.total === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            Add scans from “New Scan” to see real metrics.
          </div>
        )}
      </div>
    </div>
  )
}

