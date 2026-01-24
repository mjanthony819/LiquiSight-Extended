'use client'

import { TrendingUp, TrendingDown, Clock, ChevronRight } from 'lucide-react'
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
  if (confidence >= 90) return 'bg-success/10 text-success'
  if (confidence >= 80) return 'bg-primary/10 text-primary'
  return 'bg-warning/10 text-warning'
}

interface RecentScansProps {
  onScanClick?: (symbol: string) => void
  maxItems?: number
}

export default function RecentScans({ onScanClick, maxItems = 6 }: RecentScansProps) {
  const { scans } = useScans()
  const displayedScans = scans.slice(0, maxItems)

  return (
    <Card className="bg-card border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Recent AI Scans</h2>
        <p className="text-sm text-muted-foreground mt-1">Latest financial analysis results</p>
      </div>

      <div className="divide-y divide-border">
        {displayedScans.map((scan) => {
          const TrendIcon = scan.trend === 'up' ? TrendingUp : TrendingDown
          const trendColor = scan.trend === 'up' ? 'text-success' : 'text-destructive'

          return (
            <button
              key={scan.id}
              onClick={() => onScanClick?.(scan.symbol)}
              className="w-full p-4 hover:bg-secondary/5 transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Stock Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-card-foreground group-hover:text-primary transition">{scan.symbol}</p>
                      <p className="text-sm text-muted-foreground truncate">{scan.name}</p>
                    </div>
                    <div className={`${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Middle: Risk & Confidence */}
                <div className="flex items-center gap-3">
                  {/* Risk Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRiskColor(scan.riskLevel)}`}
                  >
                    {scan.riskLevel.charAt(0).toUpperCase() + scan.riskLevel.slice(1)} Risk
                  </div>

                  {/* Confidence Score */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getConfidenceColor(scan.confidence)}`}>
                    {scan.confidence}%
                  </div>
                </div>

                {/* Right: Timestamp & Arrow */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{scan.timestamp}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* View All Link */}
      <div className="p-4 border-t border-border bg-secondary/5 text-center">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all scans →
        </button>
      </div>
    </Card>
  )
}
