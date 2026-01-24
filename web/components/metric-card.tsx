'use client'

import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  change: string
  isPositive: boolean
  icon: LucideIcon
}

export default function MetricCard({
  label,
  value,
  change,
  isPositive,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card className="group bg-card border border-border/50 overflow-hidden card-hover relative">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
            <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-1 ring-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
          isPositive 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-success' : 'bg-destructive'}`} />
          {change}
        </div>
      </div>
    </Card>
  )
}
