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
    <Card className="bg-card border border-border">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className={`text-xs font-medium ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {change}
        </p>
      </div>
    </Card>
  )
}
