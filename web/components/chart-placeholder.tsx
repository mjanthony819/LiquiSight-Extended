'use client'

import { BarChart3, TrendingUp } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  height?: number
}

export default function ChartPlaceholder({ title, height = 250 }: ChartPlaceholderProps) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/20 via-transparent to-muted/10 relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-px h-full w-full">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="border border-foreground/10 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-card to-transparent" />

      {/* Simulated chart lines */}
      <div className="absolute bottom-12 left-8 right-8 h-24 flex items-end gap-1">
        {Array.from({ length: 24 }).map((_, i) => {
          const heights = [40, 55, 45, 70, 60, 75, 65, 80, 70, 85, 75, 90, 80, 75, 85, 95, 88, 92, 85, 90, 88, 95, 92, 98]
          return (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 rounded-t-sm transition-all duration-300 hover:from-primary/60 hover:to-primary/20"
              style={{ height: `${heights[i]}%` }}
            />
          )
        })}
      </div>

      {/* Trend line */}
      <svg className="absolute bottom-12 left-8 right-8 h-24 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M 0 70 Q 50 60 100 55 T 200 40 T 300 30 T 400 25 T 500 15 T 600 10"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="drop-shadow-lg"
        />
      </svg>

      {/* Placeholder content */}
      {title && (
        <div className="relative flex flex-col items-center gap-2 mb-16">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
        </div>
      )}
    </div>
  )
}
