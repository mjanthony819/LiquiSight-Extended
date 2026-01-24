'use client'

import { BarChart3 } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  height?: number
}

export default function ChartPlaceholder({ title, height = 250 }: ChartPlaceholderProps) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-px h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-border/50"></div>
          ))}
        </div>
      </div>

      {/* Placeholder content */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="flex gap-1 mt-1">
          <div className="w-1 h-12 bg-chart-1 rounded opacity-60"></div>
          <div className="w-1 h-8 bg-chart-2 rounded opacity-60"></div>
          <div className="w-1 h-14 bg-chart-3 rounded opacity-60"></div>
          <div className="w-1 h-10 bg-chart-4 rounded opacity-60"></div>
          <div className="w-1 h-12 bg-chart-5 rounded opacity-60"></div>
        </div>
      </div>
    </div>
  )
}
