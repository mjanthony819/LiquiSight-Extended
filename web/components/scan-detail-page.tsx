'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Bookmark, Share2, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ChartPlaceholder from '@/components/chart-placeholder'
import { useScans } from '@/context/scans-context'

interface ScanDetailPageProps {
  symbol?: string
  name?: string
  price?: string
  trend?: 'up' | 'down'
  trendPercent?: string
  riskLevel?: 'low' | 'medium' | 'high'
  confidence?: number
  onBack?: () => void
}

export default function ScanDetailPage({
  symbol: symbolProp,
  name: nameProp,
  price = '$185.92',
  trend: trendProp,
  trendPercent: trendPercentProp,
  riskLevel: riskLevelProp,
  confidence: confidenceProp,
  onBack,
}: ScanDetailPageProps) {
  const { scans } = useScans()
  const [isSaved, setIsSaved] = useState(false)

  // Look up scan from context if symbol is provided
  const scan = symbolProp ? scans.find((s) => s.symbol === symbolProp) : null
  const symbol = scan?.symbol || symbolProp || 'AAPL'
  const name = scan?.name || nameProp || 'Apple Inc.'
  const trend = (scan?.trend || trendProp || 'up') as 'up' | 'down'
  const trendPercent = scan?.trendPercent || trendPercentProp || '+5.2%'
  const riskLevel = (scan?.riskLevel || riskLevelProp || 'low') as 'low' | 'medium' | 'high'
  const confidence = scan?.confidence || confidenceProp || 92

  const riskConfig = {
    low: { bg: 'bg-success/10', text: 'text-success', label: 'Low Risk', border: 'border-success/20' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Risk', border: 'border-warning/20' },
    high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Risk', border: 'border-destructive/20' },
  }

  const config = riskConfig[riskLevel]
  const isPositive = trend === 'up'

  const tags = [
    'Strong Momentum',
    'Possible Breakout',
    'Low Volatility',
    'Oversold Recovery',
  ]

  const similarStocks = [
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp.', 
      trend: 'up' as const, 
      trendPercent: '+3.8%', 
      riskLevel: 'low' as const, 
      confidence: 88,
      volatility: 'Low' as const,
      whySuggested: 'Similar tech sector exposure with comparable market cap and growth trajectory'
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corp.', 
      trend: 'up' as const, 
      trendPercent: '+8.3%', 
      riskLevel: 'medium' as const, 
      confidence: 85,
      volatility: 'Medium' as const,
      whySuggested: 'Shares similar AI/tech momentum with strong institutional backing'
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet Inc.', 
      trend: 'down' as const, 
      trendPercent: '-1.2%', 
      riskLevel: 'medium' as const, 
      confidence: 81,
      volatility: 'Low' as const,
      whySuggested: 'Large-cap tech with diversified revenue streams and proven resilience'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{symbol}</h1>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition ${
                isSaved ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-foreground'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border border-border">
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Current Price</p>
              <p className="text-3xl font-bold text-foreground">{price}</p>
            </div>
          </Card>

          <Card className="bg-card border border-border">
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-2">24h Trend</p>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="text-2xl font-bold text-success">{trendPercent}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-destructive" />
                    <span className="text-2xl font-bold text-destructive">{trendPercent}</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className={`bg-card border border-border`}>
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Risk Level</p>
              <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${config.bg} ${config.text}`}>
                {config.label}
              </div>
            </div>
          </Card>

          <Card className="bg-card border border-border">
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-2">AI Confidence</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{confidence}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Large Chart Section */}
        <Card className="bg-card border border-border mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Price Chart - 7 Days</h2>
          </div>
          <div className="p-6">
            <ChartPlaceholder title="Price Movement" height={400} />
          </div>
        </Card>

        {/* AI Analysis & Tags Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Analysis */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">AI Analysis</h2>

              {/* Main Insight Card */}
              <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/40 mb-6">
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2">Strong Buy Signal</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {symbol} is showing strong positive momentum with multiple technical indicators aligning. The stock has broken through key resistance levels and is consolidating above the 50-day moving average. AI analysis suggests continuation of the uptrend with potential for further gains.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Additional Insights */}
              <div className="space-y-4">
                <div className="flex gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Technical Strength</p>
                    <p className="text-xs text-muted-foreground mt-1">RSI at 72 indicates strong momentum, approaching overbought conditions</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Fundamental Alignment</p>
                    <p className="text-xs text-muted-foreground mt-1">Earnings growth and revenue trends support positive price action</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Market Sentiment</p>
                    <p className="text-xs text-muted-foreground mt-1">Institutional buying patterns detected, retail interest rising</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Analysis Tags</h3>
            <Card className="bg-muted/50 border border-border p-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Confidence Breakdown */}
            <Card className="bg-muted/50 border border-border p-6 mt-6">
              <h4 className="text-sm font-bold text-foreground mb-4">Confidence Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Technical</span>
                    <span className="text-xs font-bold text-foreground">95%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Sentiment</span>
                    <span className="text-xs font-bold text-foreground">88%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Fundamental</span>
                    <span className="text-xs font-bold text-foreground">92%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Stocks Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Intelligent Recommendations</h2>
            <p className="text-muted-foreground text-sm">AI-powered suggestions based on sector correlation and risk profile</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarStocks.map((stock) => {
              const stockRiskConfig = riskConfig[stock.riskLevel]
              const stockIsPositive = stock.trend === 'up'
              const volatilityConfig = {
                'Low': { bg: 'bg-success/10', text: 'text-success', label: '🟢 Low Volatility' },
                'Medium': { bg: 'bg-warning/10', text: 'text-warning', label: '🟡 Medium Volatility' },
                'High': { bg: 'bg-destructive/10', text: 'text-destructive', label: '🔴 High Volatility' },
              }
              const volConfig = volatilityConfig[stock.volatility]

              return (
                <Card key={stock.symbol} className="bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">{stock.symbol}</h3>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex gap-2 mb-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stockRiskConfig.bg} ${stockRiskConfig.text} whitespace-nowrap`}>
                        {stockRiskConfig.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${volConfig.bg} ${volConfig.text} whitespace-nowrap`}>
                        {volConfig.label}
                      </span>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Trend</span>
                        <div className="flex items-center gap-1">
                          {stockIsPositive ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-success" />
                              <span className="text-sm font-bold text-success">{stock.trendPercent}</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-destructive" />
                              <span className="text-sm font-bold text-destructive">{stock.trendPercent}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <span className="text-sm font-bold text-primary">{stock.confidence}%</span>
                      </div>
                    </div>

                    {/* Why Suggested Card */}
                    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">💡 Why suggested:</span> {stock.whySuggested}
                      </p>
                    </div>

                    {/* Small Chart */}
                    <div className="pt-4 border-t border-border mb-4">
                      <div className="h-12 flex items-end justify-center gap-1 mb-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary to-primary/40 rounded opacity-70"
                            style={{ height: `${30 + Math.random() * 40}%` }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">7-day trend</p>
                    </div>

                    {/* CTA */}
                    <button className="w-full px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      View Analysis
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition font-semibold">
            Add to Watchlist
          </button>
          <button className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}
