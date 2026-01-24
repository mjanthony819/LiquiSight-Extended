'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ChartPlaceholder from '@/components/chart-placeholder'
import StockScanCard from '@/components/stock-scan-card'
import ScanFilters from '@/components/scan-filters'
import ScanDetailModal from '@/components/scan-detail-modal'
import { useScans } from '@/context/scans-context'

export default function Portfolio() {
  const { scans } = useScans()
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [selectedScan, setSelectedScan] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Transform context scans to match the card format
  const transformedScans = scans.map((scan) => ({
    symbol: scan.symbol,
    name: scan.name,
    trend: scan.trend as const,
    trendPercent: scan.trendPercent,
    riskLevel: scan.riskLevel as const,
    confidence: scan.confidence,
  }))

  // Filter scans based on search and risk level
  const filteredScans = transformedScans.filter((scan) => {
    const matchesSearch =
      scan.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === 'all' || scan.riskLevel === riskFilter
    return matchesSearch && matchesRisk
  })

  const handleScanClick = (scan: any) => {
    setSelectedScan(scan)
    setIsDetailOpen(true)
  }

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 45, value: '$7,425', change: '+5.2%', isPositive: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, value: '$12,540', change: '+3.8%', isPositive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 25, value: '$3,125', change: '-1.2%', isPositive: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 18, value: '$4,410', change: '+12.5%', isPositive: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 22, value: '$3,960', change: '+8.3%', isPositive: true },
    { symbol: 'META', name: 'Meta Platforms', shares: 35, value: '$11,095', change: '+15.2%', isPositive: true },
  ]

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -ml-40 -mt-40" />
        
        <div className="relative px-8 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Portfolio & <span className="gradient-text">AI Scans</span></h1>
          <p className="text-muted-foreground">Explore AI-powered stock analysis and find investment opportunities.</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Holdings</p>
              <p className="text-3xl font-bold text-card-foreground mb-3 tracking-tight">$42,555</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                +6.8% from last week
              </div>
            </div>
          </Card>
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Diversification</p>
              <p className="text-3xl font-bold text-card-foreground mb-3 tracking-tight">85%</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Well diversified
              </div>
            </div>
          </Card>
          <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">YTD Return</p>
              <p className="text-3xl font-bold text-card-foreground mb-3 tracking-tight">+18.5%</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Outperforming S&P 500
              </div>
            </div>
          </Card>
        </div>

        {/* AI Stock Scans Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">AI Stock Scans</h2>
            <p className="text-sm text-muted-foreground">Machine learning-powered analysis for {scans.length} stocks</p>
          </div>

        {/* Filters */}
        <ScanFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
        />

          {/* Results Count */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-semibold rounded-md">{filteredScans.length}</span>
            <span className="text-sm text-muted-foreground">of {transformedScans.length} scans</span>
          </div>

          {/* Grid of Scan Cards */}
          {filteredScans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredScans.map((scan) => (
                <StockScanCard
                  key={scan.symbol}
                  {...scan}
                  onClick={() => handleScanClick(scan)}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border/50">
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-3">No scans found matching your filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setRiskFilter('all')
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-semibold"
                >
                  Clear filters
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main allocation chart */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border/50 overflow-hidden card-hover">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
                <h2 className="text-lg font-semibold text-card-foreground">Sector Allocation</h2>
              </div>
              <ChartPlaceholder title="Sector Distribution" height={350} />
            </Card>
          </div>

          {/* Performance chart */}
          <div>
            <Card className="bg-card border border-border/50 h-full overflow-hidden card-hover">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
                <h2 className="text-lg font-semibold text-card-foreground">Performance</h2>
              </div>
              <ChartPlaceholder title="Monthly Returns" height={350} />
            </Card>
          </div>
        </div>

        {/* Holdings Table */}
        <Card className="bg-card border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
            <h2 className="text-lg font-semibold text-card-foreground">Your Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/30 bg-muted/20">
                <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-semibold">Symbol</th>
                  <th className="text-left px-6 py-4 font-semibold">Company</th>
                  <th className="text-left px-6 py-4 font-semibold">Shares</th>
                  <th className="text-right px-6 py-4 font-semibold">Value</th>
                  <th className="text-right px-6 py-4 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/20 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                          <span className="text-[10px] font-bold text-primary">{holding.symbol.slice(0, 2)}</span>
                        </div>
                        <span className="font-semibold text-card-foreground">{holding.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{holding.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{holding.shares}</td>
                    <td className="px-6 py-4 text-right font-semibold text-card-foreground">{holding.value}</td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        holding.isPositive 
                          ? 'bg-success/10 text-success border border-success/20' 
                          : 'bg-destructive/10 text-destructive border border-destructive/20'
                      }`}>
                        {holding.isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {holding.change}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Scan Detail Modal */}
      {selectedScan && (
        <ScanDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          scan={selectedScan}
        />
      )}
    </div>
  )
}
