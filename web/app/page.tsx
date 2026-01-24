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

  return (
    <ScansProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto scroll-smooth">
          {renderPage()}
        </main>
      </div>
    </ScansProvider>
  )
}
