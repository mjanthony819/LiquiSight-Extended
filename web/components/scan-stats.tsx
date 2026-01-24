'use client'

import { BarChart3, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ScanStats() {
  const stats = [
    {
      label: 'Total Scans',
      value: '1,247',
      change: '+145 this week',
      icon: BarChart3,
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      label: 'High-Risk Scans',
      value: '23',
      change: 'Require attention',
      icon: AlertTriangle,
      color: 'destructive',
      gradient: 'from-destructive/20 to-destructive/5',
    },
    {
      label: 'Medium-Risk Scans',
      value: '87',
      change: 'Monitor & review',
      icon: AlertCircle,
      color: 'warning',
      gradient: 'from-warning/20 to-warning/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="group bg-card border border-border/50 overflow-hidden card-hover relative">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${
                    stat.color === 'destructive' ? 'text-destructive' : 
                    stat.color === 'warning' ? 'text-warning' : 'text-foreground'
                  } tracking-tight`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}/10 ring-1 ring-${stat.color}/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-3.5 h-3.5 text-${stat.color === 'primary' ? 'success' : 'muted-foreground'}`} />
                <p className="text-xs text-muted-foreground font-medium">{stat.change}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
