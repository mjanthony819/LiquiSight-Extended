'use client'

import { Search } from 'lucide-react'

interface ScanFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  riskFilter: 'all' | 'low' | 'medium' | 'high'
  onRiskFilterChange: (value: 'all' | 'low' | 'medium' | 'high') => void
}

export default function ScanFilters({
  searchTerm,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
}: ScanFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by stock name or symbol..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      {/* Risk Level Filter */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">Filter by Risk Level</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all' as const, label: 'All Stocks' },
            { value: 'low' as const, label: 'Low Risk', color: 'success' },
            { value: 'medium' as const, label: 'Medium Risk', color: 'warning' },
            { value: 'high' as const, label: 'High Risk', color: 'destructive' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onRiskFilterChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                riskFilter === option.value
                  ? option.value === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : `bg-${option.color}/20 text-${option.color} border border-${option.color}/30`
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
