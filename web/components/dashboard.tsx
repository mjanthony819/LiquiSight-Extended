'use client'

import { TrendingUp, TrendingDown, AlertCircle, Zap, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import MetricCard from '@/components/metric-card'
import ChartPlaceholder from '@/components/chart-placeholder'
import ScanStats from '@/components/scan-stats'
import RecentScans from '@/components/recent-scans'

interface DashboardProps {
  onOpenNewScan?: () => void
  onScanSelect?: (symbol: string) => void
}

export default function Dashboard({ onOpenNewScan, onScanSelect }: DashboardProps) {
  return (
    <div className="flex-1 bg-background p-8">
      {/* Header with CTA Button */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Copilot Dashboard</h1>
          <p className="text-muted-foreground">Real-time financial analysis and portfolio intelligence powered by machine learning.</p>
        </div>
        <button
          onClick={onOpenNewScan}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25 whitespace-nowrap flex-shrink-0"
        >
          <Sparkles className="w-5 h-5" />
          New Scan
        </button>
      </div>

      {/* Scan Statistics */}
      <ScanStats />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Portfolio Value"
          value="$234,567"
          change="+12.5%"
          isPositive={true}
          icon={TrendingUp}
        />
        <MetricCard
          label="24h Change"
          value="+$3,450"
          change="+5.2%"
          isPositive={true}
          icon={TrendingUp}
        />
        <MetricCard
          label="Risk Score"
          value="32/100"
          change="Moderate"
          isPositive={true}
          icon={AlertCircle}
        />
        <MetricCard
          label="AI Opportunities"
          value="7"
          change="New today"
          isPositive={true}
          icon={Zap}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Portfolio Performance</h2>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <ChartPlaceholder title="Performance Chart" height={300} />
          </Card>
        </div>

        {/* Asset Allocation */}
        <div>
          <Card className="bg-card border border-border h-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Asset Allocation</h2>
            </div>
            <ChartPlaceholder title="Distribution" height={300} />
          </Card>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="mb-6">
        <RecentScans onScanClick={onScanSelect} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card className="bg-card border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">AI Insights</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Rebalancing Opportunity</p>
                <p className="text-xs text-muted-foreground">Your tech allocation is 3% over target</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Market Alert</p>
                <p className="text-xs text-muted-foreground">Rising interest rates detected in reports</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
              <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Strong Performer</p>
                <p className="text-xs text-muted-foreground">Green energy stocks gaining momentum</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Market Summary */}
        <Card className="bg-card border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Market Summary</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">S&P 500</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">5,432</span>
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">+1.2%</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">NASDAQ</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">17,245</span>
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">+0.8%</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">EUROSTOXX</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">4,128</span>
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">-0.3%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">BTC/USD</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">$67,234</span>
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">+3.5%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
