'use client'

import { BarChart3, History, Zap, ChevronRight, Sparkles, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout?: () => void
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'history', label: 'Scan History', icon: History },
  ]

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col relative overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -ml-16 -mb-16" />

      {/* Logo Section */}
      <div className="relative p-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">LiquiSight</h1>
            <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">AI Copilot</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">Navigation</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'}`} />
              </button>
            )
          })}
        </div>
      </nav>

      {/* Quick Action */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onNavigate('new-scan')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">New AI Scan</span>
        </button>
      </div>

      {/* Footer */}
      <div className="relative p-4 border-t border-sidebar-border/50">
        {/* Logout Button */}
        <button
          onClick={() => {
            onLogout?.()
            signOut({ callbackUrl: '/' })
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/10 rounded-xl transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
