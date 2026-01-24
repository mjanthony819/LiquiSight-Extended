'use client'

import { Search, Filter } from 'lucide-react'

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
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by stock name or symbol..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
      </div>

      {/* Risk Level Filter */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter by Risk Level</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all' as const, label: 'All Stocks' },
            { value: 'low' as const, label: 'Low Risk', colorClass: 'bg-success/10 text-success border-success/20 hover:bg-success/20' },
            { value: 'medium' as const, label: 'Medium Risk', colorClass: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' },
            { value: 'high' as const, label: 'High Risk', colorClass: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onRiskFilterChange(option.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                riskFilter === option.value
                  ? option.value === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                    : option.colorClass
                  : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
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
