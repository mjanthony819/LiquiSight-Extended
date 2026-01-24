'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ChartPlaceholder from '@/components/chart-placeholder'

interface StockScanCardProps {
  symbol: string
  name: string
  trend: 'up' | 'down'
  trendPercent: string
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  onClick?: () => void
}

export default function StockScanCard({
  symbol,
  name,
  trend,
  trendPercent,
  riskLevel,
  confidence,
  onClick,
}: StockScanCardProps) {
  const riskConfig = {
    low: { bg: 'bg-success/10', text: 'text-success', label: 'Low Risk' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Risk' },
    high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Risk' },
  }

  const config = riskConfig[riskLevel]
  const isPositive = trend === 'up'

  return (
    <Card
      onClick={onClick}
      className="bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-primary">{symbol}</p>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
          <div
            className={`px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text}`}
          >
            {config.label}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <ChartPlaceholder height={180} title="" />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="space-y-3">
          {/* Trend */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Trend</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <>
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-success">{trendPercent}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">{trendPercent}</span>
                </>
              )}
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    confidence >= 90
                      ? 'bg-success'
                      : confidence >= 75
                        ? 'bg-accent'
                        : 'bg-warning'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-card-foreground">{confidence}%</span>
            </div>
          </div>

          {/* View Details Button */}
          <button className="w-full mt-3 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground">
            View Analysis
          </button>
        </div>
      </div>
    </Card>
  )
}
