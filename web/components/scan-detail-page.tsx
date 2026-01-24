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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Price</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{price}</p>
            </div>
          </Card>

          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">24h Trend</p>
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

          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Risk Level</p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${config.bg} ${config.text} border ${config.border}`}>
                <span className={`w-2 h-2 rounded-full ${config.text === 'text-success' ? 'bg-success' : config.text === 'text-warning' ? 'bg-warning' : 'bg-destructive'}`} />
                {config.label}
              </div>
            </div>
          </Card>

          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Confidence</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">{confidence}</span>
                <span className="text-lg font-bold text-primary/70">%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Large Chart Section */}
        <Card className="bg-card border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
            <h2 className="text-xl font-bold text-foreground">Price Chart - 7 Days</h2>
          </div>
          <div className="p-6">
            <ChartPlaceholder title="Price Movement" height={400} />
          </div>
        </Card>

        {/* AI Analysis & Tags Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-foreground">AI Analysis</h2>

            {/* Main Insight Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] -mr-20 -mt-20" />
              <div className="relative p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 ring-1 ring-primary/30 flex-shrink-0 flex items-center justify-center">
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
            <div className="space-y-3">
              <div className="flex gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20 transition-all hover:bg-accent/10 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Technical Strength</p>
                  <p className="text-xs text-muted-foreground mt-1">RSI at 72 indicates strong momentum, approaching overbought conditions</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-success/5 border border-success/20 transition-all hover:bg-success/10 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Fundamental Alignment</p>
                  <p className="text-xs text-muted-foreground mt-1">Earnings growth and revenue trends support positive price action</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-warning/5 border border-warning/20 transition-all hover:bg-warning/10 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Market Sentiment</p>
                  <p className="text-xs text-muted-foreground mt-1">Institutional buying patterns detected, retail interest rising</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Analysis Tags</h3>
              <Card className="bg-muted/30 border border-border/50 p-5">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Confidence Breakdown */}
            <Card className="bg-muted/30 border border-border/50 p-5">
              <h4 className="text-sm font-bold text-foreground mb-4">Confidence Breakdown</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Technical</span>
                    <span className="text-xs font-bold text-success">95%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success to-success/70 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Sentiment</span>
                    <span className="text-xs font-bold text-accent">88%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Fundamental</span>
                    <span className="text-xs font-bold text-primary">92%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Stocks Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">Intelligent Recommendations</h2>
            <p className="text-muted-foreground text-sm">AI-powered suggestions based on sector correlation and risk profile</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarStocks.map((stock) => {
              const stockRiskConfig = riskConfig[stock.riskLevel]
              const stockIsPositive = stock.trend === 'up'
              const volatilityConfig = {
                'Low': { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'Low Vol' },
                'Medium': { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'Med Vol' },
                'High': { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', label: 'High Vol' },
              }
              const volConfig = volatilityConfig[stock.volatility]

              return (
                <Card key={stock.symbol} className="group bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden card-hover">
                  <div className="p-5 h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4 pb-4 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                          <span className="text-xs font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{stock.symbol}</h3>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex gap-2 mb-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stockRiskConfig.bg} ${stockRiskConfig.text} border ${stockRiskConfig.border} whitespace-nowrap`}>
                        {stockRiskConfig.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${volConfig.bg} ${volConfig.text} border ${volConfig.border} whitespace-nowrap`}>
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
                              <TrendingUp className="w-3.5 h-3.5 text-success" />
                              <span className="text-sm font-bold text-success">{stock.trendPercent}</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
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
                    <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-primary">Why suggested:</span> {stock.whySuggested}
                      </p>
                    </div>

                    {/* Small Chart */}
                    <div className="pt-3 border-t border-border/30 mb-4 mt-auto">
                      <div className="h-10 flex items-end justify-center gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary/50 to-primary/20 rounded-t-sm"
                            style={{ height: `${30 + Math.random() * 50}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      View Analysis
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 px-6 py-3.5 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors font-semibold">
            Add to Watchlist
          </button>
          <button className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}
