'use client'

import { useState } from 'react'
import { ScansProvider } from '@/context/scans-context'
import Sidebar from '@/components/sidebar'
import Dashboard from '@/components/dashboard'
import Portfolio from '@/components/portfolio'
import ScanHistory from '@/components/scan-history'
import NewScan from '@/components/new-scan'
import ScanDetailPage from '@/components/scan-detail-page' // Import ScanDetailPage

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)

  const renderPage = () => {
    switch (currentPage) {
      case 'portfolio':
        return <Portfolio />
      case 'history':
        return <ScanHistory />
      case 'new-scan':
        return <NewScan onBack={() => setCurrentPage('dashboard')} />
      case 'scan-detail':
        return selectedSymbol ? (
          <ScanDetailPage symbol={selectedSymbol} onBack={() => setCurrentPage('dashboard')} />
        ) : null
      default:
        return (
          <Dashboard
            onOpenNewScan={() => setCurrentPage('new-scan')}
            onScanSelect={(symbol) => {
              setSelectedSymbol(symbol)
              setCurrentPage('scan-detail')
            }}
          />
        )
    }
  }

  return (
    <ScansProvider>
      <div className="flex h-screen bg-background">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </ScansProvider>
  )
}
