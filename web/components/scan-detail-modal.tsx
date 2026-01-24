'use client'

import { X, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ChartPlaceholder from '@/components/chart-placeholder'

interface ScanDetailModalProps {
  isOpen: boolean
  onClose: () => void
  scan: {
    symbol: string
    name: string
    trend: 'up' | 'down'
    trendPercent: string
    riskLevel: 'low' | 'medium' | 'high'
    confidence: number
    price?: string
    priceChange?: string
  }
}

export default function ScanDetailModal({ isOpen, onClose, scan }: ScanDetailModalProps) {
  if (!isOpen) return null

  const riskConfig = {
    low: { bg: 'bg-success/10', text: 'text-success', label: 'Low Risk' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Risk' },
    high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Risk' },
  }

  const config = riskConfig[scan.riskLevel]
  const isPositive = scan.trend === 'up'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg bg-card border border-border shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{scan.symbol}</h2>
            <p className="text-sm text-muted-foreground">{scan.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50 border border-border">
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="text-2xl font-bold text-foreground">{scan.price || '$125.48'}</p>
              </div>
            </Card>
            <Card className="bg-muted/50 border border-border">
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-2xl font-bold text-success">{scan.trendPercent}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-destructive" />
                      <span className="text-2xl font-bold text-destructive">{scan.trendPercent}</span>
                    </>
                  )}
                </div>
              </div>
            </Card>
            <Card className="bg-muted/50 border border-border">
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${config.bg} ${config.text}`}>
                  {config.label}
                </div>
              </div>
            </Card>
          </div>

          {/* Confidence Score */}
          <Card className="bg-muted/50 border border-border">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">AI Confidence Score</p>
                <span className="text-2xl font-bold text-primary">{scan.confidence}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    scan.confidence >= 90
                      ? 'bg-success'
                      : scan.confidence >= 75
                        ? 'bg-accent'
                        : 'bg-warning'
                  }`}
                  style={{ width: `${scan.confidence}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {scan.confidence >= 90
                  ? 'Very High Confidence'
                  : scan.confidence >= 75
                    ? 'High Confidence'
                    : 'Moderate Confidence'}
              </p>
            </div>
          </Card>

          {/* Price Chart */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">7-Day Price Chart</h3>
            <Card className="bg-muted/30 border border-border">
              <div className="p-6">
                <ChartPlaceholder height={250} title="" />
              </div>
            </Card>
          </div>

          {/* Technical Analysis */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Technical Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50 border border-border">
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Moving Average (50D)</p>
                  <p className="text-lg font-bold text-foreground">$122.34</p>
                  <p className="text-xs text-success mt-1">↑ 2.5% above MA</p>
                </div>
              </Card>
              <Card className="bg-muted/50 border border-border">
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Relative Strength Index</p>
                  <p className="text-lg font-bold text-foreground">72.5</p>
                  <p className="text-xs text-warning mt-1">⚠ Approaching overbought</p>
                </div>
              </Card>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Insights</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-foreground font-medium">Strong Buy Signal</p>
                <p className="text-xs text-muted-foreground mt-1">Pattern recognition indicates positive momentum</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-foreground font-medium">Fundamental Strength</p>
                <p className="text-xs text-muted-foreground mt-1">Earnings and financial metrics are positive</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-foreground font-medium">Market Sentiment Mixed</p>
                <p className="text-xs text-muted-foreground mt-1">Investor sentiment is cautious but improving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-border bg-muted/30 flex gap-3">
          <button className="flex-1 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition font-medium">
            Save to Watchlist
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}
