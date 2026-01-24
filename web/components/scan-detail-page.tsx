'use client'

import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'

interface ScanDetailPageProps {
  symbol: string
  onBack?: () => void
}

export default function ScanDetailPage({ symbol, onBack }: ScanDetailPageProps) {
  const { scans } = useScans()
  const scan = scans.find((s) => s.symbol === symbol)

  if (!scan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{symbol}</h1>
              <p className="text-sm text-muted-foreground">Scan not found</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <Card className="bg-card border border-border/50 p-6">
            <p className="text-muted-foreground">
              This scan isn’t available in your current session. Go back and run a new scan.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const TrendIcon = scan.trend === 'up' ? TrendingUp : scan.trend === 'down' ? TrendingDown : Minus
  const trendLabel = scan.trend === 'up' ? 'Uptrend' : scan.trend === 'down' ? 'Downtrend' : 'Sideways'

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{scan.symbol}</h1>
            <p className="text-sm text-muted-foreground">{scan.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border border-border/50 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Trend</p>
            <div className="flex items-center gap-2">
              <TrendIcon className="w-4 h-4" />
              <p className="text-lg font-semibold text-foreground">{trendLabel}</p>
            </div>
          </Card>
          <Card className="bg-card border border-border/50 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Risk</p>
            <p className="text-lg font-semibold text-foreground">{scan.riskLevel.toUpperCase()}</p>
          </Card>
          <Card className="bg-card border border-border/50 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Confidence</p>
            <p className="text-lg font-semibold text-foreground">{scan.confidence}%</p>
          </Card>
        </div>

        <Card className="bg-card border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
            <h2 className="text-lg font-semibold text-foreground">AI Explanation</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">{scan.explanation}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
