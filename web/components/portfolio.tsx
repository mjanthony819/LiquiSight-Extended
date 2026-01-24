'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  Settings,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useCallback, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis, Tooltip, Sector } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { mockHoldings, mockPortfolioSeries, mockTransactions } from '@/lib/mock-portfolio'

export default function Portfolio() {
  const totals = useMemo(() => {
    const totalValue = mockHoldings.reduce((sum, h) => sum + h.shares * h.price, 0)
    const totalCost = mockHoldings.reduce((sum, h) => sum + h.shares * h.avgCost, 0)
    const pnl = totalValue - totalCost
    const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0

    const dayMovePct =
      totalValue > 0
        ? mockHoldings.reduce((sum, h) => sum + (h.shares * h.price * h.dayChangePct) / 100, 0) / totalValue * 100
        : 0

    const aiRisk = (() => {
      const weighted = mockHoldings.reduce((sum, h) => sum + (h.shares * h.price) * h.confidence, 0)
      return totalValue > 0 ? Math.round(weighted / totalValue) : 0
    })()

    return { totalValue, pnl, pnlPct, dayMovePct, aiRisk }
  }, [])

  const allocation = useMemo(() => {
    const bySector = new Map<string, number>()
    for (const h of mockHoldings) {
      bySector.set(h.sector, (bySector.get(h.sector) ?? 0) + h.shares * h.price)
    }
    return Array.from(bySector.entries())
      .map(([sector, value]) => ({ sector, value }))
      .sort((a, b) => b.value - a.value)
  }, [])

  const [activePieIndex, setActivePieIndex] = useState(0)

  const LineChartTooltip = useCallback(({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border/60 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium text-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-foreground">${Number(entry.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }, [])

  const renderActiveShape = useCallback((props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={innerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.5}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground text-sm font-bold">
          {payload.sector}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-xs">
          {(percent * 100).toFixed(1)}%
        </text>
      </g>
    )
  }, [])

  const topHolding = mockHoldings
    .slice()
    .sort((a, b) => b.shares * b.price - a.shares * a.price)[0]

  const formatMoney = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2 })

  const formatPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="relative p-6 space-y-6 overflow-hidden">
        {/* Ambient background (similar feel to reference image) */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-32 -right-28 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">My Portfolio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mock portfolio data with LiquiSight AI risk signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur px-4 py-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">AI Risk Score</p>
              <div className="mt-1 flex items-center gap-2">
                <ShieldAlert className={cn('h-4 w-4', totals.aiRisk >= 80 ? 'text-success' : totals.aiRisk >= 65 ? 'text-warning' : 'text-destructive')} />
                <span className="text-sm font-semibold text-foreground">{totals.aiRisk}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats (like the chips in the reference) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border/50 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <p className="text-2xl font-bold text-foreground">${formatMoney(totals.totalValue)}</p>
                <p className={cn('text-sm font-semibold', totals.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                  {formatPct(totals.pnlPct)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total value across holdings</p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <p className="text-2xl font-bold text-foreground">{formatPct(totals.dayMovePct)}</p>
                <div className={cn('inline-flex items-center gap-1 text-sm font-semibold', totals.dayMovePct >= 0 ? 'text-success' : 'text-destructive')}>
                  {totals.dayMovePct >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  Intraday
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Weighted move across positions</p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                Top Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <p className="text-2xl font-bold text-foreground">{topHolding?.symbol}</p>
                <p className="text-sm font-semibold text-muted-foreground">${formatMoney((topHolding?.shares ?? 0) * (topHolding?.price ?? 0))}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Largest by market value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left: chart + goals */}
          <div className="xl:col-span-8 space-y-6">
            <Card className="border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Portfolio Growth</CardTitle>
                <p className="text-xs text-muted-foreground">Portfolio vs benchmark + cash buffer</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ChartContainer
                  className="h-[320px] w-full"
                  config={{
                    portfolio: { label: 'Portfolio', theme: { light: 'hsl(262 83% 58%)', dark: 'hsl(263 70% 60%)' } },
                    benchmark: { label: 'Benchmark', theme: { light: 'hsl(220 9% 46%)', dark: 'hsl(215 14% 50%)' } },
                    cash: { label: 'Cash', theme: { light: 'hsl(173 80% 40%)', dark: 'hsl(172 66% 50%)' } },
                  }}
                >
                  <LineChart data={mockPortfolioSeries} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                    <defs>
                      <filter id="portfolioGlow">
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
                      tickMargin={10}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                    <Tooltip
                      content={LineChartTooltip}
                      cursor={{
                        stroke: 'hsl(var(--primary))',
                        strokeWidth: 1,
                        strokeDasharray: '4 4',
                        strokeOpacity: 0.4,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="var(--color-benchmark)"
                      strokeWidth={2}
                      dot={false}
                      opacity={0.6}
                      activeDot={{ r: 5, fill: 'var(--color-benchmark)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="cash"
                      name="Cash"
                      stroke="var(--color-cash)"
                      strokeWidth={2}
                      dot={false}
                      opacity={0.75}
                      activeDot={{ r: 5, fill: 'var(--color-cash)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      name="Portfolio"
                      stroke="var(--color-portfolio)"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 7,
                        fill: 'var(--color-portfolio)',
                        stroke: 'hsl(var(--background))',
                        strokeWidth: 3,
                        filter: 'url(#portfolioGlow)',
                      }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ChartContainer>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(262_83%_58%)] dark:bg-[hsl(263_70%_60%)]" />
                    <span className="text-xs font-medium text-muted-foreground">Portfolio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(220_9%_46%)] dark:bg-[hsl(215_14%_50%)]" />
                    <span className="text-xs font-medium text-muted-foreground">Benchmark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(173_80%_40%)] dark:bg-[hsl(172_66%_50%)]" />
                    <span className="text-xs font-medium text-muted-foreground">Cash</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border/50 bg-card/60 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Goals</CardTitle>
                  <p className="text-xs text-muted-foreground">Track targets</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-foreground">Emergency Fund</p>
                      <p className="text-muted-foreground font-semibold">78%</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted/40 overflow-hidden">
                      <div className="h-full w-[78%] bg-primary rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-foreground">Monthly Investing</p>
                      <p className="text-muted-foreground font-semibold">97%</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted/40 overflow-hidden">
                      <div className="h-full w-[97%] bg-accent rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Other Savings</CardTitle>
                  <p className="text-xs text-muted-foreground">Auto allocations</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    className="h-[160px] w-full"
                    config={{
                      savings: { label: 'Savings', theme: { light: 'hsl(173 80% 40%)', dark: 'hsl(172 66% 50%)' } },
                    }}
                  >
                    <AreaChart
                      data={mockPortfolioSeries.map((p) => ({ label: p.label, v: Math.round(p.cash / 100) }))}
                      margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-savings)" stopOpacity={0.45} />
                          <stop offset="50%" stopColor="var(--color-savings)" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="var(--color-savings)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="bg-popover/95 backdrop-blur-md border border-border/60 rounded-lg px-3 py-2 shadow-lg">
                              <p className="text-xs text-muted-foreground">{payload[0]?.payload?.label}</p>
                              <p className="text-sm font-bold text-foreground">${payload[0]?.value?.toLocaleString()}</p>
                            </div>
                          )
                        }}
                        cursor={{
                          stroke: 'hsl(173 80% 40%)',
                          strokeWidth: 1,
                          strokeDasharray: '3 3',
                          strokeOpacity: 0.5,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="var(--color-savings)"
                        fill="url(#fillSavings)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: 'var(--color-savings)',
                          stroke: 'hsl(var(--background))',
                          strokeWidth: 2,
                        }}
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: allocation + transactions */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/30 border border-border/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground">DU</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">Demo User</p>
                      <p className="text-xs text-muted-foreground truncate">liquisight portfolio sandbox</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button type="button" className="h-9 w-9 rounded-xl border border-border/40 bg-background/40 hover:bg-muted/20 transition-colors flex items-center justify-center">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button type="button" className="h-9 w-9 rounded-xl border border-border/40 bg-background/40 hover:bg-muted/20 transition-colors flex items-center justify-center">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border/40 bg-gradient-to-br from-background/30 via-background/10 to-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Portfolio Card</p>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">${formatMoney(totals.totalValue)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Top holding: {topHolding?.symbol}</p>
                    <p className={cn('text-xs font-semibold', totals.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                      {formatPct(totals.pnlPct)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border border-border/50 bg-card/60 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Allocation</CardTitle>
                <p className="text-xs text-muted-foreground">By sector • Hover to explore</p>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <ChartContainer
                  className="h-[180px] w-[180px]"
                  config={{
                    tech: { label: 'Tech', theme: { light: 'hsl(262 83% 58%)', dark: 'hsl(263 70% 60%)' } },
                    finance: { label: 'Finance', theme: { light: 'hsl(173 80% 40%)', dark: 'hsl(172 66% 50%)' } },
                    auto: { label: 'Auto', theme: { light: 'hsl(0 84% 60%)', dark: 'hsl(0 72% 55%)' } },
                    hedge: { label: 'Hedge', theme: { light: 'hsl(220 9% 46%)', dark: 'hsl(215 14% 50%)' } },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={allocation}
                      dataKey="value"
                      nameKey="sector"
                      innerRadius={50}
                      outerRadius={75}
                      stroke="none"
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {allocation.map((a) => {
                        const key = a.sector.toLowerCase()
                        const color =
                          key === 'tech'
                            ? 'var(--color-tech)'
                            : key === 'finance'
                              ? 'var(--color-finance)'
                              : key === 'auto'
                                ? 'var(--color-auto)'
                                : 'var(--color-hedge)'
                        return <Cell key={a.sector} fill={color} className="transition-all duration-200 hover:opacity-90" />
                      })}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="flex-1 space-y-2">
                  {allocation.slice(0, 4).map((a, idx) => {
                    const pct = (a.value / totals.totalValue) * 100
                    const isActive = idx === activePieIndex
                    return (
                      <button
                        key={a.sector}
                        type="button"
                        className={cn(
                          'w-full flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-all duration-200',
                          isActive ? 'bg-muted/40 scale-[1.02]' : 'hover:bg-muted/20'
                        )}
                        onMouseEnter={() => setActivePieIndex(idx)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full transition-transform"
                            style={{
                              backgroundColor:
                                a.sector.toLowerCase() === 'tech' ? 'hsl(262 83% 58%)' :
                                a.sector.toLowerCase() === 'finance' ? 'hsl(173 80% 40%)' :
                                a.sector.toLowerCase() === 'auto' ? 'hsl(0 84% 60%)' : 'hsl(220 9% 46%)',
                              transform: isActive ? 'scale(1.3)' : 'scale(1)',
                            }}
                          />
                          <p className={cn('text-sm font-semibold', isActive ? 'text-foreground' : 'text-muted-foreground')}>{a.sector}</p>
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">{pct.toFixed(1)}%</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card/60 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Last Transactions</CardTitle>
                <p className="text-xs text-muted-foreground">Mock activity</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/40 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.type} {t.symbol}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.timestamp}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">${formatMoney(t.amount)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Holdings table */}
        <Card className="border border-border/50 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Holdings</CardTitle>
            <p className="text-xs text-muted-foreground">AI signal + risk derived from scans (mock)</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Day</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHoldings.map((h) => {
                  const value = h.shares * h.price
                  const dayCls = h.dayChangePct >= 0 ? 'text-success' : 'text-destructive'
                  const totalCls = h.totalChangePct >= 0 ? 'text-success' : 'text-destructive'
                  const SignalIcon = h.aiSignal === 'Bullish' ? TrendingUp : h.aiSignal === 'Bearish' ? TrendingDown : ShieldAlert

                  const riskPill =
                    h.riskLevel === 'low'
                      ? 'bg-success/10 text-success border-success/20'
                      : h.riskLevel === 'medium'
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'

                  return (
                    <TableRow key={h.symbol}>
                      <TableCell className="font-semibold text-foreground">{h.symbol}</TableCell>
                      <TableCell className="text-muted-foreground">{h.name}</TableCell>
                      <TableCell className="text-muted-foreground">{h.sector}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">${formatMoney(value)}</TableCell>
                      <TableCell className={cn('text-right font-semibold', dayCls)}>{formatPct(h.dayChangePct)}</TableCell>
                      <TableCell className={cn('text-right font-semibold', totalCls)}>{formatPct(h.totalChangePct)}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn('inline-flex items-center gap-1 rounded-xl border px-2 py-1 text-xs font-semibold', riskPill)}>
                          <SignalIcon className="h-3.5 w-3.5" />
                          {h.aiSignal} • {h.confidence}%
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
