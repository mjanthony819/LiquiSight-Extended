'use client'

import { BarChart3, History, Wallet, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'history', label: 'Scan History', icon: History },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">LiquiSight</h1>
            <p className="text-xs text-muted-foreground">AI Financial Copilot</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="bg-sidebar-accent/10 p-3 rounded-lg">
          <p className="text-xs font-semibold text-sidebar-accent mb-1">Pro Plan</p>
          <p className="text-xs text-muted-foreground">Upgrade for advanced insights</p>
        </div>
      </div>
    </div>
  )
}
