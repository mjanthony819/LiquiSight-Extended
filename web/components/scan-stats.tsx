'use client'

import { BarChart3, AlertTriangle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ScanStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Scans */}
      <Card className="bg-card border border-border">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Scans</p>
              <p className="text-3xl font-bold text-foreground mt-2">1,247</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">+145 this week</p>
        </div>
      </Card>

      {/* High-Risk Scans */}
      <Card className="bg-card border border-border">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">High-Risk Scans</p>
              <p className="text-3xl font-bold text-destructive mt-2">23</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Require immediate attention</p>
        </div>
      </Card>

      {/* Medium-Risk Scans */}
      <Card className="bg-card border border-border">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Medium-Risk Scans</p>
              <p className="text-3xl font-bold text-warning mt-2">87</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Monitor & review</p>
        </div>
      </Card>
    </div>
  )
}
