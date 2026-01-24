'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Upload, Zap, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'

interface NewScanProps {
  onBack?: () => void
}

export default function NewScan({ onBack }: NewScanProps) {
  const { addScan } = useScans()
  const [isWaiting, setIsWaiting] = useState(true)
  const [stockName, setStockName] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    if (stockName && uploadedImage) {
      setIsAnalyzing(true)
      // Simulate analysis delay
      setTimeout(() => {
        // Generate random data for demo purposes
        const trendDirection = Math.random() > 0.5 ? 'up' : 'down'
        const trendPercent = Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15)}%` : `-${Math.floor(Math.random() * 10)}%`
        const riskLevels = ['low', 'medium', 'high'] as const
        const riskLevel = riskLevels[Math.floor(Math.random() * 3)]
        const confidence = 70 + Math.floor(Math.random() * 25)

        // Extract symbol (first part before space)
        const symbol = stockName.split(' ')[0].toUpperCase()

        addScan({
          symbol,
          name: stockName,
          trend: trendDirection as 'up' | 'down',
          trendPercent,
          riskLevel,
          confidence,
        })

        setIsAnalyzing(false)
        setShowSuccess(true)
        setStockName('')
        setUploadedImage(null)
        if (fileInputRef.current) fileInputRef.current.value = ''

        // Auto redirect after success
        setTimeout(() => {
          onBack?.()
        }, 2000)
      }, 2000)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex-1 bg-background p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-success/10 border-2 border-success flex items-center justify-center animate-scale-pulse">
              <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Scan Complete!</h2>
          <p className="text-muted-foreground mb-6">Your analysis has been added to the dashboard and portfolio. Redirecting...</p>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ animation: 'width 2s ease-in-out' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background p-8">
      {/* Header with Back Button */}
      <div className="mb-12">
        {onBack && (
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 text-sm font-medium mb-4 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        )}
        <h1 className="text-4xl font-bold text-foreground mb-2">AI Copilot Control Center</h1>
        <p className="text-muted-foreground">Choose how you want to analyze your stock charts</p>
      </div>

      {/* SECTION 1: COPILOT MODE (PRIMARY) */}
      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Scan with Copilot (Browser Extension)</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Use our browser extension to scan any stock chart directly from your screen. Results will automatically appear in your portfolio.
          </p>
        </div>

        {/* Large Copilot Card */}
        <div className="relative">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 rounded-2xl blur-2xl opacity-40" />
          
          <Card className="relative bg-gradient-to-br from-card to-card/80 border border-primary/30 hover:border-primary/50 transition-all overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -ml-40 -mb-40" />

            <div className="relative p-12 text-center">
              {/* Status indicator */}
              <div className="mb-6 flex justify-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    {isWaiting ? (
                      <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    ) : (
                      <Zap className="w-8 h-8 text-primary" />
                    )}
                  </div>
                </div>
              </div>

              {/* Main text */}
              <h3 className="text-3xl font-bold text-foreground mb-3">
                {isWaiting ? 'Waiting for Copilot Scan...' : 'Copilot Ready'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {isWaiting
                  ? 'Open the LiquiSight browser extension and select any stock chart to analyze it instantly.'
                  : 'Your copilot is active and monitoring your browser for chart scans.'}
              </p>

              {/* Primary CTA */}
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25">
                <Zap className="w-5 h-5" />
                Open Extension
              </button>

              {/* Status text */}
              <p className="text-xs text-muted-foreground mt-6">
                {isWaiting
                  ? '⏳ Listening for scans... Make sure the extension is installed'
                  : '✓ Extension is active and monitoring'}
              </p>
            </div>
          </Card>
        </div>

        {/* Info box below copilot */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Fastest Way to Analyze</p>
            <p className="text-xs text-muted-foreground mt-1">
              The copilot extension enables instant chart recognition and analysis without leaving your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase font-semibold">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* SECTION 2: MANUAL SCAN DEMO MODE (SECONDARY) */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Manual Scan (Demo Mode)</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Fallback option: Upload a stock chart image manually for analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
          {/* Image Upload Field */}
          <div>
            <Card className="bg-card border-2 border-dashed border-border hover:border-primary/50 transition-all h-full">
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Upload Chart Image</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Drag and drop or click to select a stock chart image (PNG, JPG)
                </p>

                {uploadedImage ? (
                  <div className="mb-4">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded chart"
                      className="w-full h-48 object-cover rounded-lg border border-border mb-3"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear image
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-block px-6 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition mb-3"
                  >
                    Choose File
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </Card>
          </div>

          {/* Stock Name & Analyze */}
          <div className="flex flex-col">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">Stock Name or Symbol</label>
              <input
                type="text"
                placeholder="e.g., AAPL, Apple Inc., TSLA"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <p className="text-xs text-muted-foreground mt-2">Enter the stock ticker or company name</p>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!stockName || !uploadedImage || isAnalyzing}
              className="mt-auto px-6 py-3 bg-secondary text-foreground font-semibold rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Chart
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              This mode is for demo purposes. For production analysis, use the Copilot extension above.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 bg-accent/5 border border-accent/20 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground font-medium">AI Analysis Disclaimer</p>
          <p className="text-xs text-muted-foreground mt-1">
            LiquiSight provides technical analysis and market insights for informational purposes. Always conduct your own research and consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
