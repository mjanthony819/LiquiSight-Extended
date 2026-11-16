'use client'

import { BarChart3, History, Zap, ChevronRight, Sparkles, User, Wallet } from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout?: () => void
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  // Default user for demo
  const user = { name: 'Demo User', email: 'demo@liquisight.com', image: null }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'history', label: 'Scan History', icon: History },
  ]

  return (
    <div className="hidden md:flex w-72 bg-sidebar border-r border-sidebar-border flex-col relative overflow-hidden">
      {/* Background gradient decoration */}

      {/* Logo Section */}
      <div className="relative p-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="display text-xl text-sidebar-foreground tracking-tight">LiquiSight</h1>
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
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground  shadow-primary/25'
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded transition-all duration-200  shadow-accent/20 hover:shadow-accent/30 hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">New AI Scan</span>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="relative p-4 border-t border-sidebar-border/50">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 ${
            currentPage === 'profile'
              ? 'bg-primary/10 border border-primary/20'
              : 'hover:bg-sidebar-accent/10'
          }`}
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border/50 flex-shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'View profile'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}
