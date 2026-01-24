'use client'

import { TrendingUp, TrendingDown, Clock, ChevronRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'

function getRiskColor(risk: string) {
  switch (risk) {
    case 'high':
      return 'bg-destructive/10 text-destructive border border-destructive/20'
    case 'medium':
      return 'bg-warning/10 text-warning border border-warning/20'
    case 'low':
      return 'bg-success/10 text-success border border-success/20'
    default:
      return 'bg-muted/10 text-muted-foreground'
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 90) return 'bg-success/10 text-success border border-success/20'
  if (confidence >= 80) return 'bg-primary/10 text-primary border border-primary/20'
  return 'bg-warning/10 text-warning border border-warning/20'
}

interface RecentScansProps {
  onScanClick?: (symbol: string) => void
  maxItems?: number
}

export default function RecentScans({ onScanClick, maxItems = 6 }: RecentScansProps) {
  const { scans } = useScans()
  const displayedScans = scans.slice(0, maxItems)

  return (
    <Card className="bg-card border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center ring-1 ring-accent/20">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Recent AI Scans</h2>
              <p className="text-sm text-muted-foreground">Latest financial analysis results</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
            <span className="text-xs font-semibold text-accent">{scans.length} Total</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {displayedScans.map((scan, index) => {
          const TrendIcon = scan.trend === 'up' ? TrendingUp : TrendingDown
          const trendColor = scan.trend === 'up' ? 'text-success' : 'text-destructive'

          return (
            <button
              key={scan.id}
              onClick={() => onScanClick?.(scan.symbol)}
              className="w-full p-4 hover:bg-muted/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Stock Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20 flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{scan.symbol.slice(0, 2)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{scan.symbol}</p>
                      <div className={`${trendColor} flex items-center gap-1`}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{scan.trendPercent}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{scan.name}</p>
                  </div>
                </div>

                {/* Middle: Risk & Confidence */}
                <div className="hidden md:flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${getRiskColor(scan.riskLevel)}`}>
                    {scan.riskLevel.charAt(0).toUpperCase() + scan.riskLevel.slice(1)}
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${getConfidenceColor(scan.confidence)}`}>
                    {scan.confidence}%
                  </div>
                </div>

                {/* Right: Timestamp & Arrow */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{scan.timestamp}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* View All Link */}
      <div className="p-4 border-t border-border/30 bg-muted/10">
        <button className="w-full py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2 group">
          <span>View all scans</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </Card>
  )
}
