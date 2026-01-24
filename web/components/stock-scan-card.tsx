'use client'

import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
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
    low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'Low' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'Medium' },
    high: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', label: 'High' },
  }

  const config = riskConfig[riskLevel]
  const isPositive = trend === 'up'

  return (
    <Card
      onClick={onClick}
      className="group bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden card-hover"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30 bg-gradient-to-r from-muted/20 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <span className="text-xs font-bold text-primary">{symbol.slice(0, 2)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground group-hover:text-primary transition-colors">{symbol}</p>
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ChartPlaceholder height={140} title="" />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 bg-muted/5">
        <div className="space-y-3">
          {/* Trend & Confidence Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <>
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-bold text-success">{trendPercent}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-bold text-destructive">{trendPercent}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    confidence >= 90
                      ? 'bg-success'
                      : confidence >= 75
                        ? 'bg-primary'
                        : 'bg-warning'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-xs font-bold text-card-foreground">{confidence}%</span>
            </div>
          </div>

          {/* View Details Button */}
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground">
            <span>View Analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </Card>
  )
}
