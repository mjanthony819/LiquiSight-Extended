'use client'

import { ArrowDownRight, ArrowUpRight, Minus, Plus, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState, useCallback } from 'react'
import { ThemeToggle } from './theme-toggle'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface DashboardProps {
  onOpenNewScan?: () => void
  onScanSelect?: (symbol: string) => void
}

export default function Dashboard({ onOpenNewScan, onScanSelect }: DashboardProps) {
  const { scans } = useScans()
  const [activeRange, setActiveRange] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'MAX'>('1D')

  const summary = useMemo(() => {
    const total = scans.length
    const avgConfidence = total ? Math.round(scans.reduce((sum, s) => sum + s.confidence, 0) / total) : 0
    const highRisk = scans.filter((s) => s.riskLevel === 'high').length
    const mediumRisk = scans.filter((s) => s.riskLevel === 'medium').length
    const lowRisk = scans.filter((s) => s.riskLevel === 'low').length
    const latest = scans[0] ?? null
    return { total, avgConfidence, highRisk, mediumRisk, lowRisk, latest }
  }, [scans])

  const marketCards = useMemo(
    () => [
      { name: 'S&P 500', symbol: 'SPX', value: 5892.45, change: 42.18, pct: 0.72, direction: 'up' as const },
      { name: 'NASDAQ 100', symbol: 'NDX', value: 21248.72, change: 185.34, pct: 0.88, direction: 'up' as const },
      { name: 'DOW JONES', symbol: 'DJI', value: 44524.40, change: -28.95, pct: -0.07, direction: 'down' as const },
      { name: 'RUSSELL 2000', symbol: 'RUT', value: 2287.15, change: 18.62, pct: 0.82, direction: 'up' as const },
      { name: 'VIX INDEX', symbol: 'VIX', value: 14.82, change: -0.94, pct: -5.96, direction: 'down' as const },
    ],
    [],
  )

  const discoverCards = useMemo(
    () => [
      { title: 'Apple Inc.', ticker: 'AAPL', value: 189.22, change: 1.24, sparkline: [12, 14, 11, 15, 13, 16, 14, 17, 15, 18] },
      { title: 'NVIDIA Corp', ticker: 'NVDA', value: 754.55, change: 2.18, sparkline: [10, 12, 15, 13, 17, 16, 19, 18, 22, 24] },
      { title: 'Microsoft', ticker: 'MSFT', value: 392.30, change: 0.82, sparkline: [14, 13, 15, 14, 16, 15, 17, 16, 18, 17] },
      { title: 'Amazon', ticker: 'AMZN', value: 178.42, change: -0.45, sparkline: [18, 17, 16, 17, 15, 16, 14, 15, 14, 13] },
      { title: 'Alphabet', ticker: 'GOOGL', value: 175.85, change: 0.92, sparkline: [11, 13, 12, 14, 13, 15, 14, 16, 15, 17] },
      { title: 'Meta Platforms', ticker: 'META', value: 512.60, change: 1.65, sparkline: [13, 14, 16, 15, 18, 17, 20, 19, 22, 21] },
      { title: 'Tesla Inc.', ticker: 'TSLA', value: 219.12, change: -1.87, sparkline: [22, 20, 21, 18, 19, 16, 17, 15, 14, 12] },
      { title: 'AMD', ticker: 'AMD', value: 162.45, change: 3.24, sparkline: [8, 10, 9, 12, 11, 14, 13, 16, 15, 19] },
    ],
    [],
  )

  const watchlistRows = useMemo(() => {
    if (scans.length) {
      return scans.slice(0, 6).map((s) => {
        const base = 100 + (s.confidence - 75) * 1.2
        const delta = (s.trend === 'up' ? 1 : s.trend === 'down' ? -1 : 0) * (2 + (s.riskLevel === 'high' ? 2 : 0))
        return {
          id: s.id,
          name: s.symbol,
          subtitle: s.name,
          price: Math.max(10, base * 10),
          change: delta,
          score: s.confidence,
          trend: s.trend,
        }
      })
    }

    return [
      { id: 'aapl', name: 'AAPL', subtitle: 'Apple Inc.', price: 189.22, change: 2.45, score: 92, trend: 'up' as const },
      { id: 'nvda', name: 'NVDA', subtitle: 'NVIDIA Corporation', price: 754.55, change: 12.80, score: 87, trend: 'up' as const },
      { id: 'tsla', name: 'TSLA', subtitle: 'Tesla Inc.', price: 219.12, change: -4.32, score: 78, trend: 'down' as const },
      { id: 'msft', name: 'MSFT', subtitle: 'Microsoft Corp', price: 392.30, change: 3.18, score: 89, trend: 'up' as const },
      { id: 'amzn', name: 'AMZN', subtitle: 'Amazon.com Inc.', price: 178.42, change: 0.85, score: 71, trend: 'sideways' as const },
      { id: 'meta', name: 'META', subtitle: 'Meta Platforms', price: 512.60, change: 8.42, score: 85, trend: 'up' as const },
    ]
  }, [scans])

  const chartData = useMemo(() => {
    // Generate realistic price data based on selected time range
    const rangeConfig = {
      '1D': { points: 78, base: 44524, volatility: 180, timeFormat: (i: number) => `${(9 + Math.floor(i / 12)).toString().padStart(2, '0')}:${((i % 12) * 5).toString().padStart(2, '00')}` },
      '5D': { points: 65, base: 44200, volatility: 450, timeFormat: (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][Math.floor(i / 13)] || '' },
      '1M': { points: 22, base: 43800, volatility: 800, timeFormat: (i: number) => `Jan ${i + 1}` },
      '6M': { points: 26, base: 41200, volatility: 2400, timeFormat: (i: number) => ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][Math.floor(i / 5)] || '' },
      '1Y': { points: 52, base: 38500, volatility: 4500, timeFormat: (i: number) => ['Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Jan'][Math.floor(i / 8)] || '' },
      'MAX': { points: 60, base: 28000, volatility: 8000, timeFormat: (i: number) => ['2020', '2021', '2022', '2023', '2024', '2025'][Math.floor(i / 10)] || '' },
    }
    const config = rangeConfig[activeRange]
    
    // Generate smooth trending data with realistic fluctuations
    let priceA = config.base
    let priceB = config.base * 0.92
    const trend = 0.0018 // Slight upward trend
    
    return Array.from({ length: config.points }).map((_, i) => {
      const t = i / (config.points - 1)
      // Add momentum-based movement with mean reversion
      const noise1 = (Math.random() - 0.48) * config.volatility * 0.15
      const noise2 = (Math.random() - 0.52) * config.volatility * 0.12
      const wave1 = Math.sin(t * Math.PI * 2.5) * config.volatility * 0.35
      const wave2 = Math.cos(t * Math.PI * 1.8) * config.volatility * 0.28
      
      priceA = priceA * (1 + trend) + noise1 + wave1 * 0.02
      priceB = priceB * (1 + trend * 0.8) + noise2 + wave2 * 0.015
      
      const showLabel = config.points <= 30 ? i % 3 === 0 : i % Math.ceil(config.points / 8) === 0
      return {
        label: showLabel ? config.timeFormat(i) : '',
        time: config.timeFormat(i),
        a: Math.round(priceA),
        b: Math.round(priceB),
      }
    })
  }, [activeRange])

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border/60 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-muted-foreground mb-2">{payload[0]?.payload?.time || label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium text-foreground">{entry.name === 'a' ? 'DOW Jones' : 'S&P 500'}</span>
            </div>
            <span className="text-sm font-bold text-foreground">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }, [])

  const activeMarketTitle = summary.latest?.symbol ? `${summary.latest.symbol} • AI Scan` : 'DJI-INDEX'
  const headlineValue = summary.latest?.confidence ? `${summary.latest.confidence}%` : '44,524.40'
  const headlineMeta = summary.latest
    ? `${summary.latest.timestamp} • Risk ${summary.latest.riskLevel} • ${summary.latest.trend}`
    : 'Jun 9, 4:00:05 PM UTC-4 • INWEXJX DISCLAIMER'

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Minimal title row (header strip removed) */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              Dashboard
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                Scan-driven
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Markets overview, charts, and watchlist.</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => onOpenNewScan?.()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-95 transition"
            >
              <Plus className="w-4 h-4" />
              New Scan
            </button>
          </div>
        </div>

        {/* Market strip */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {marketCards.map((c) => (
            <Card key={c.name} className="p-4 border border-border/50 bg-card/70 backdrop-blur">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {c.name}
              </p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {c.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{c.symbol}</p>
                <div
                  className={`text-xs font-semibold inline-flex items-center gap-1 ${
                    c.direction === 'up' ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {c.direction === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {`${c.change > 0 ? '+' : ''}${c.change.toFixed(2)} ${c.pct > 0 ? '+' : ''}${c.pct.toFixed(2)}%`}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main grid: chart + discover */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Chart panel */}
          <Card className="xl:col-span-8 border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
            <div className="p-6 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Home • {activeMarketTitle}</p>
                  <div className="flex items-end gap-3 mt-2 flex-wrap">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{headlineValue}</h2>
                    <p className="text-xs text-muted-foreground pb-1">{headlineMeta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-muted/20 border border-border/50 p-1">
                  {(['1D', '5D', '1M', '6M', '1Y', 'MAX'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setActiveRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeRange === r
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-3 pb-4">
              <ChartContainer
                className="h-[320px] w-full px-3"
                config={{
                  a: { label: 'DOW Jones', theme: { light: 'hsl(142 76% 36%)', dark: 'hsl(142 70% 45%)' } },
                  b: { label: 'S&P 500', theme: { light: 'hsl(221 83% 53%)', dark: 'hsl(217 91% 60%)' } },
                }}
              >
                <AreaChart
                  data={chartData}
                  margin={{ left: 0, right: 8, top: 10, bottom: 0 }}
                  onMouseMove={(e) => e?.activeTooltipIndex !== undefined && setActiveIndex(e.activeTooltipIndex)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <defs>
                    <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-a)" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="var(--color-a)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="var(--color-a)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-b)" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="var(--color-b)" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="var(--color-b)" stopOpacity={0.02} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickMargin={10}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    hide
                    domain={['dataMin - 500', 'dataMax + 500']}
                  />
                  <Tooltip
                    content={CustomTooltip}
                    cursor={{
                      stroke: 'hsl(var(--primary))',
                      strokeWidth: 1,
                      strokeDasharray: '4 4',
                      strokeOpacity: 0.5,
                    }}
                  />
                  <Area
                    type="monotoneX"
                    dataKey="b"
                    stroke="var(--color-b)"
                    fill="url(#fillB)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: 'var(--color-b)',
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 3,
                      filter: 'url(#glow)',
                    }}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                  <Area
                    type="monotoneX"
                    dataKey="a"
                    stroke="var(--color-a)"
                    fill="url(#fillA)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: 'var(--color-a)',
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 3,
                      filter: 'url(#glow)',
                    }}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ChartContainer>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(142_76%_36%)] dark:bg-[hsl(142_70%_45%)]" />
                  <span className="text-xs font-medium text-muted-foreground">DOW Jones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(221_83%_53%)] dark:bg-[hsl(217_91%_60%)]" />
                  <span className="text-xs font-medium text-muted-foreground">S&P 500</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Discover panel */}
          <Card className="xl:col-span-4 border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Discover more</p>
                  <p className="text-xs text-muted-foreground">You may be interested in</p>
                </div>
                <button type="button" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  View all
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              {discoverCards.map((c) => {
                const isPositive = c.change >= 0
                const sparkPath = c.sparkline
                  .map((v, i) => {
                    const x = (i / (c.sparkline.length - 1)) * 100
                    const minV = Math.min(...c.sparkline)
                    const maxV = Math.max(...c.sparkline)
                    const range = maxV - minV || 1
                    const y = 28 - ((v - minV) / range) * 24
                    return `${i === 0 ? 'M' : 'L'}${x} ${y}`
                  })
                  .join(' ')
                const lastPoint = c.sparkline[c.sparkline.length - 1]
                const minV = Math.min(...c.sparkline)
                const maxV = Math.max(...c.sparkline)
                const range = maxV - minV || 1
                const lastY = 28 - ((lastPoint - minV) / range) * 24

                return (
                  <button
                    key={`${c.ticker}-${c.title}`}
                    type="button"
                    onClick={() => onScanSelect?.(c.ticker)}
                    className="group text-left rounded-2xl border border-border/50 bg-background/40 hover:bg-muted/30 hover:border-primary/30 transition-all duration-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{c.title}</p>
                      <span className="text-[10px] font-semibold text-muted-foreground rounded-md bg-muted/30 border border-border/50 px-1.5 py-0.5">
                        {c.ticker}
                      </span>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-sm font-bold text-foreground">${c.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      <span className={`text-[11px] font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                        {isPositive ? '+' : ''}{c.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="mt-3 h-8 w-full">
                      <svg viewBox="0 0 100 32" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`spark-${c.ticker}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isPositive ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={isPositive ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <path
                          d={`${sparkPath} L100 32 L0 32 Z`}
                          fill={`url(#spark-${c.ticker})`}
                        />
                        <path
                          d={sparkPath}
                          fill="none"
                          stroke={isPositive ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-all duration-300"
                        />
                        <circle
                          cx="100"
                          cy={lastY}
                          r="3"
                          fill={isPositive ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'}
                          className="animate-pulse"
                        />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Watchlist table */}
        <Card className="border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Watchlist</p>
              <p className="text-xs text-muted-foreground">Based on your recent scans</p>
            </div>
            <div className="text-xs text-muted-foreground">{summary.total} scans</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border/30">
                  <th className="py-3 px-4 text-left font-semibold"> </th>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-right font-semibold">Price</th>
                  <th className="py-3 px-4 text-right font-semibold">Change</th>
                  <th className="py-3 px-4 text-right font-semibold">Score</th>
                  <th className="py-3 px-4 text-right font-semibold"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {watchlistRows.map((row) => {
                  const Trend = row.trend === 'up' ? TrendingUp : row.trend === 'down' ? TrendingDown : Minus
                  const changeColor = row.change >= 0 ? 'text-success' : 'text-destructive'
                  return (
                    <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="accent-primary" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{row.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{row.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{row.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">
                        {row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${changeColor}`}>
                        {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-muted/20 border border-border/50 px-3 py-1 text-xs font-semibold text-foreground">
                          <Trend className={`w-3.5 h-3.5 ${row.trend === 'up' ? 'text-success' : row.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`} />
                          {row.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onScanSelect?.(row.name)}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

