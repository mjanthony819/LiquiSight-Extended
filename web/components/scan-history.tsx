'use client'

import { useState, useEffect } from 'react'
import { Zap, TrendingUp, TrendingDown, AlertCircle, CheckCircle, BarChart3, Sparkles, Search, ArrowUpRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fetchLatestScans, ScanRecord } from '@/lib/analyze'

export default function ScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    async function loadScans() {
      setIsLoading(true)
      setLoadError(false)
      try {
        const data = await fetchLatestScans(10)
        setScans(data)
      } catch (err) {
        console.error('Failed to load scans:', err)
        setLoadError(true)
      }
      setIsLoading(false)
    }
    loadScans()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'Uptrend') {
      return <TrendingUp className="w-4 h-4 text-success" />
    }
    if (trend === 'Downtrend') {
      return <TrendingDown className="w-4 h-4 text-destructive" />
    }
    return <BarChart3 className="w-4 h-4 text-muted-foreground" />
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      Low: 'bg-success/10 text-success border-success/20',
      Medium: 'bg-accent/10 text-accent border-accent/20',
      High: 'bg-destructive/10 text-destructive border-destructive/20',
    }
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${colors[risk as keyof typeof colors] || colors.Medium}`}>
        {risk} Risk
      </div>
    )
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
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">247</p>
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
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">1,340</p>
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
                  <p className="text-3xl font-bold text-card-foreground tracking-tight">88.4%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-success/10 ring-1 ring-success/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              All Scans
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium hover:bg-muted transition-colors">
              Completed
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium hover:bg-muted transition-colors">
              In Progress
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search scans..."
              className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Scan Cards */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : loadError ? (
            <Card className="bg-card border border-border/50 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Unable to load scans</h3>
              <p className="text-muted-foreground">Database connection unavailable. Scans will be stored locally.</p>
            </Card>
          ) : scans.length === 0 ? (
            <Card className="bg-card border border-border/50 p-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No scans yet</h3>
              <p className="text-muted-foreground">Start analyzing charts to see your history here.</p>
            </Card>
          ) : (
            scans.map((scan) => (
              <Card
                key={scan.id}
                className="group bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden card-hover"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {scan.stock_name}
                        </h3>
                        {getRiskBadge(scan.risk)}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {getTrendIcon(scan.trend)}
                          {scan.trend}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{scan.explanation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                      <p className="text-2xl font-bold text-primary">{Math.round(scan.confidence * 100)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Trend</p>
                        <p className="font-semibold text-card-foreground">{scan.trend}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                        <p className="font-semibold text-card-foreground">{formatDate(scan.created_at)}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-semibold group-hover:bg-primary group-hover:text-primary-foreground">
                      View Details
                      <ArrowUpRight className="w-4 h-4 opacity-70" />
                    </button>
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
