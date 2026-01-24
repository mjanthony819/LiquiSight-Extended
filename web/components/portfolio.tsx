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
    <div className="flex-1 bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio & AI Scans</h1>
        <p className="text-muted-foreground">Explore AI-powered stock analysis and find investment opportunities.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Holdings</p>
            <p className="text-3xl font-bold text-card-foreground mb-4">$42,555</p>
            <p className="text-xs text-success font-medium">+6.8% from last week</p>
          </div>
        </Card>
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Diversification</p>
            <p className="text-3xl font-bold text-card-foreground mb-4">85%</p>
            <p className="text-xs text-muted-foreground font-medium">Well diversified</p>
          </div>
        </Card>
        <Card className="bg-card border border-border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-2">YTD Return</p>
            <p className="text-3xl font-bold text-card-foreground mb-4">+18.5%</p>
            <p className="text-xs text-success font-medium">Outperforming S&P 500</p>
          </div>
        </Card>
      </div>

      {/* AI Stock Scans Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">AI Stock Scans</h2>
          <p className="text-muted-foreground">Machine learning-powered analysis for {scans.length} stocks</p>
        </div>

        {/* Filters */}
        <ScanFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
        />

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredScans.length} of {transformedScans.length} scans
        </div>

        {/* Grid of Scan Cards */}
        {filteredScans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScans.map((scan) => (
              <StockScanCard
                key={scan.symbol}
                {...scan}
                onClick={() => handleScanClick(scan)}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-card border border-border">
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-2">No scans found matching your filters</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRiskFilter('all')
                }}
                className="text-primary hover:underline text-sm font-medium mt-2"
              >
                Clear filters
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main allocation chart */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Sector Allocation</h2>
            </div>
            <ChartPlaceholder title="Sector Distribution" height={350} />
          </Card>
        </div>

        {/* Performance chart */}
        <div>
          <Card className="bg-card border border-border h-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Performance</h2>
            </div>
            <ChartPlaceholder title="Monthly Returns" height={350} />
          </Card>
        </div>
      </div>

      {/* Holdings Table */}
      <Card className="bg-card border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Your Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-sm text-muted-foreground">
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
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-card-foreground">{holding.symbol}</td>
                  <td className="px-6 py-4 text-card-foreground">{holding.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{holding.shares}</td>
                  <td className="px-6 py-4 text-right font-semibold text-card-foreground">{holding.value}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {holding.isPositive ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-success" />
                          <span className="text-success font-medium text-sm">{holding.change}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-destructive" />
                          <span className="text-destructive font-medium text-sm">{holding.change}</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
