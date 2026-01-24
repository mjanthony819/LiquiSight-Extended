'use client'

import { Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ScanHistory() {
  const scans = [
    {
      id: 1,
      title: 'Market Volatility Analysis',
      description: 'Detected unusual trading patterns in tech sector',
      status: 'completed',
      insights: 5,
      date: '2 hours ago',
      confidence: '92%',
    },
    {
      id: 2,
      title: 'Portfolio Risk Assessment',
      description: 'Comprehensive risk analysis across all holdings',
      status: 'completed',
      insights: 8,
      date: '4 hours ago',
      confidence: '88%',
    },
    {
      id: 3,
      title: 'Sector Trend Detection',
      description: 'Identified emerging opportunities in renewable energy',
      status: 'completed',
      insights: 3,
      date: '1 day ago',
      confidence: '85%',
    },
    {
      id: 4,
      title: 'Earnings Analysis',
      description: 'Analyzed Q3 earnings reports from major companies',
      status: 'in-progress',
      insights: 12,
      date: 'Running now',
      confidence: '76%',
    },
    {
      id: 5,
      title: 'Sentiment Analysis',
      description: 'Market sentiment tracking from news and social media',
      status: 'completed',
      insights: 6,
      date: '2 days ago',
      confidence: '91%',
    },
    {
      id: 6,
      title: 'Correlation Study',
      description: 'Analyzed asset correlations for optimal diversification',
      status: 'completed',
      insights: 4,
      date: '3 days ago',
      confidence: '87%',
    },
  ]

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-success" />
    }
    return <Zap className="w-5 h-5 text-accent animate-pulse" />
  }

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Completed'
    return 'In Progress'
  }

  return (
    <div className="flex-1 bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Scan History</h1>
        <p className="text-muted-foreground">View all AI financial scans and analyses.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Scans</p>
            <p className="text-3xl font-bold text-card-foreground">247</p>
          </div>
        </Card>
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Insights Generated</p>
            <p className="text-3xl font-bold text-card-foreground">1,340</p>
          </div>
        </Card>
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Avg Confidence</p>
            <p className="text-3xl font-bold text-card-foreground">88.4%</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
            All Scans
          </button>
          <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition">
            Completed
          </button>
          <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition">
            In Progress
          </button>
        </div>
        <input
          type="text"
          placeholder="Search scans..."
          className="px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Scan Cards */}
      <div className="space-y-4">
        {scans.map((scan) => (
          <Card
            key={scan.id}
            className="bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground">{scan.title}</h3>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(scan.status)}
                      <span className="text-xs font-medium text-muted-foreground">
                        {getStatusLabel(scan.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{scan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-card-foreground">{scan.confidence}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Insights</p>
                    <p className="font-semibold text-card-foreground">{scan.insights}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-semibold text-card-foreground">{scan.date}</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
