'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ScansProvider } from '@/context/scans-context'
import Sidebar from '@/components/sidebar'
import Dashboard from '@/components/dashboard'
import ScanHistory from '@/components/scan-history'
import NewScan from '@/components/new-scan'
import LandingPage from '@/components/landing-page'

export default function Home() {
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = () => {
    // This is now handled by NextAuth - the session will update automatically
  }

  const handleLogout = () => {
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <ScanHistory />
      case 'new-scan':
        return <NewScan onBack={() => setCurrentPage('dashboard')} />
      default:
        return (
          <Dashboard
            onOpenNewScan={() => setCurrentPage('new-scan')}
          />
        )
    }
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!session) {
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
