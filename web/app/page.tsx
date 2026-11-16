'use client'

import { useState } from 'react'
import { ScansProvider } from '@/context/scans-context'
import Sidebar from '@/components/sidebar'
import Dashboard from '@/components/dashboard'
import ScanHistory from '@/components/scan-history'
import NewScan from '@/components/new-scan'
import Profile from '@/components/profile'
import LandingPage from '@/components/landing-page'
import Portfolio from '@/components/portfolio'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <ScanHistory />
      case 'new-scan':
        return <NewScan onBack={() => setCurrentPage('dashboard')} />
      case 'profile':
        return <Profile />
      case 'portfolio':
        return <Portfolio />
      default:
        return (
          <Dashboard
            onOpenNewScan={() => setCurrentPage('new-scan')}
          />
        )
    }
  }

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />
  }

  const mobileNav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'history', label: 'History' },
    { id: 'new-scan', label: 'New Scan' },
  ]

  return (
    <ScansProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden flex flex-wrap items-center gap-1 px-3 py-2 border-b border-sidebar-border bg-sidebar flex-shrink-0">
            <span className="display text-lg text-sidebar-foreground mr-2 whitespace-nowrap">LiquiSight</span>
            {mobileNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                  currentPage === item.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <main className="flex-1 overflow-auto scroll-smooth">
            {renderPage()}
          </main>
        </div>
      </div>
    </ScansProvider>
  )
}
