'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Sparkles, Search, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'

export default function ScanHistory() {
  const { scans, removeScan } = useScans()
  const [query, setQuery] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-success" />
    }
    if (trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-destructive" />
    }
    return <BarChart3 className="w-4 h-4 text-muted-foreground" />
  }

  const getTrendLabel = (trend: string) => {
    if (trend === 'up') return 'Uptrend'
    if (trend === 'down') return 'Downtrend'
    return 'Sideways'
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-success/10 text-success border-success/20',
      medium: 'bg-accent/10 text-accent border-accent/20',
      high: 'bg-destructive/10 text-destructive border-destructive/20',
    }
    const label = risk.charAt(0).toUpperCase() + risk.slice(1)
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${colors[risk as keyof typeof colors] || colors.medium}`}>
        {label} Risk
      </div>
    )
  }

  const totalScans = scans.length
  const avgConfidence =
    totalScans === 0
      ? 0
      : scans.reduce((sum, s) => sum + s.confidence, 0) / totalScans

  const normalizedQuery = query.trim().toLowerCase()
  const filteredScans = normalizedQuery
    ? scans.filter((scan) => {
        const haystack = `${scan.symbol} ${scan.name} ${scan.trend} ${scan.riskLevel} ${scan.explanation}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : scans

  function handleDelete(id: string, name: string) {
    setDeleteError(null)
    const confirmed = window.confirm(`Delete scan for "${name}"? This cannot be undone.`)
    if (!confirmed) return
    removeScan(id)
  }

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mt-40" />
        
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Scan <span className="gradient-text">History</span></h1>
              <p className="text-muted-foreground">View all AI financial scans and analyses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Scans</p>
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">{totalScans}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Insights Generated</p>
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">{totalScans}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Avg Confidence</p>
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">{avgConfidence.toFixed(1)}%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-success/10 ring-1 ring-success/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by stock, trend, risk, or text..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          {query.trim() ? (
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Showing <span className="font-semibold text-foreground">{filteredScans.length}</span> of {totalScans}
            </p>
          ) : null}
        </div>

        {deleteError ? (
          <Card className="bg-card border border-destructive/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-destructive">{deleteError}</p>
              <button
                type="button"
                onClick={() => setDeleteError(null)}
                className="text-xs font-semibold text-destructive hover:opacity-80"
              >
                Dismiss
              </button>
            </div>
          </Card>
        ) : null}

        {/* Scan Cards */}
        <div className="space-y-3">
          {filteredScans.length === 0 ? (
            <Card className="bg-card border border-border/50 p-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No matching scans</h3>
              <p className="text-muted-foreground">
                {totalScans === 0 ? 'Start analyzing charts to see your history here.' : 'Try a different search term.'}
              </p>
            </Card>
          ) : (
            filteredScans.map((scan) => (
              <Card
                key={scan.id}
                className="group bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden card-hover"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-bold text-primary">{scan.symbol}</span>
                        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {scan.name}
                        </h3>
                        {getRiskBadge(scan.riskLevel)}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {getTrendIcon(scan.trend)}
                          {getTrendLabel(scan.trend)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{scan.explanation}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(scan.id, scan.name)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition"
                          aria-label={`Delete scan for ${scan.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                      <p className="text-2xl font-bold text-primary">{scan.confidence}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Trend</p>
                        <p className="font-semibold text-card-foreground">{getTrendLabel(scan.trend)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                        <p className="font-semibold text-card-foreground">{scan.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
