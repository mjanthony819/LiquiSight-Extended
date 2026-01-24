'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Upload, Zap, ArrowRight, AlertCircle, Loader2, ArrowLeft, Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'
import { analyzeAndSave } from '@/lib/analyze'
import { emitScansUpdated } from '@/lib/scans-events'

interface NewScanProps {
  onBack?: () => void
}

export default function NewScan({ onBack }: NewScanProps) {
  const { addScan } = useScans()
  const [isWaiting, setIsWaiting] = useState(true)
  const [stockName, setStockName] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [resultType, setResultType] = useState<'success' | 'save-error' | 'analysis-error'>('success')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!stockName || !uploadedImage || !uploadedFile) return

    setIsAnalyzing(true)
    setResultMessage(null)
    setResultType('success')

    try {
      const { result, saved, error } = await analyzeAndSave(uploadedFile, stockName)

      const symbol = (result.stock_name || stockName).split(' ')[0].toUpperCase()
      const trend = result.trend === 'Downtrend' ? 'down' : result.trend === 'Sideways' ? 'sideways' : 'up'
      const riskLevel = result.risk.toLowerCase() as 'low' | 'medium' | 'high'
      const confidence = Math.round(result.confidence * 100)

      addScan({
        symbol,
        name: result.stock_name || stockName,
        trend,
        riskLevel,
        confidence,
        explanation: result.explanation,
      })

      if (!saved) {
        setResultType('save-error')
        setResultMessage(error ?? 'Failed to save scan to Supabase')
      }

      if (saved) {
        emitScansUpdated()
      }

      setShowSuccess(true)
      setStockName('')
      setUploadedImage(null)
      setUploadedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      if (saved) {
        setTimeout(() => {
          onBack?.()
        }, 2000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setResultType('analysis-error')
      setResultMessage(message)
      setShowSuccess(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-success/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center shadow-2xl shadow-success/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            {resultType === 'analysis-error'
              ? 'Scan Failed'
              : resultType === 'save-error'
                ? 'Scan Completed (Not Saved)'
                : 'Scan Complete!'}
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {resultType === 'analysis-error'
              ? 'The analysis request failed. Please check the backend and try again.'
              : resultType === 'save-error'
                ? 'Your analysis was added locally, but saving to Supabase failed.'
                : 'Your analysis has been saved and added to the dashboard. Redirecting...'}
          </p>

          {resultMessage && resultType !== 'success' && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-left">
              <p className="text-sm font-semibold text-foreground mb-1">
                {resultType === 'analysis-error' ? 'Analysis error' : 'Save error'}
              </p>
              <p className="text-xs text-muted-foreground break-words">{resultMessage}</p>
            </div>
          )}
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-success to-accent rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        
        <div className="relative px-8 py-10">
          {onBack && (
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Dashboard
            </button>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">AI Scan Center</h1>
              <p className="text-muted-foreground">Choose your analysis method</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-12">
        {/* SECTION 1: COPILOT MODE (PRIMARY) */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Browser Extension Scan</h2>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">Recommended</span>
            </div>
            <p className="text-muted-foreground text-sm ml-8">
              Use our browser extension to scan any stock chart directly from your screen.
            </p>
          </div>

          {/* Large Copilot Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 rounded-2xl blur-2xl opacity-50" />
            
            <Card className="relative bg-gradient-to-br from-card via-card to-card/80 border border-primary/30 hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-[80px] -ml-30 -mb-30" />

              <div className="relative p-10 text-center">
                {/* Status indicator */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40 flex items-center justify-center">
                      {isWaiting ? (
                        <div className="w-10 h-10 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
                      ) : (
                        <Zap className="w-10 h-10 text-primary" />
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                  {isWaiting ? 'Waiting for Copilot...' : 'Copilot Ready'}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  {isWaiting
                    ? 'Open the LiquiSight browser extension and select any stock chart to analyze it instantly.'
                    : 'Your copilot is active and monitoring your browser for chart scans.'}
                </p>

                <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]">
                  <Zap className="w-5 h-5" />
                  Open Extension
                </button>

                <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
                  {isWaiting ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                      Listening for scans... Make sure the extension is installed
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Extension is active and monitoring
                    </>
                  )}
                </p>
              </div>
            </Card>
          </div>

          {/* Info box */}
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold">Fastest Way to Analyze</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                The copilot extension enables instant chart recognition and analysis without leaving your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider px-4 py-2 bg-muted/30 rounded-full">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* SECTION 2: MANUAL SCAN */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">2</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Manual Upload</h2>
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-semibold rounded-full">Demo Mode</span>
            </div>
            <p className="text-muted-foreground text-sm ml-8">
              Upload a stock chart image manually for analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload Field */}
            <Card className="bg-card border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <ImageIcon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Upload Chart Image</h3>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Drag and drop or click to select a stock chart image (PNG, JPG)
                </p>

                {uploadedImage ? (
                  <div className="mb-4">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded chart"
                      className="w-full h-48 object-cover rounded-xl border border-border mb-3"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null)
                        setUploadedFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Clear image
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-block px-6 py-2.5 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
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

            {/* Stock Name & Analyze */}
            <div className="flex flex-col">
              <Card className="bg-card border border-border p-6 flex-1">
                <label className="block text-sm font-semibold text-foreground mb-3">Stock Name or Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., AAPL, Apple Inc., TSLA"
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">Enter the stock ticker or company name</p>

                <button
                  onClick={handleAnalyze}
                  disabled={!stockName || !uploadedImage || isAnalyzing}
                  className="mt-6 w-full px-6 py-3.5 bg-gradient-to-r from-muted to-muted/80 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground font-semibold rounded-xl border border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
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
                  Demo mode — For production, use the browser extension
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-5 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-foreground font-semibold">AI Analysis Disclaimer</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              LiquiSight provides technical analysis and market insights for informational purposes. Always conduct your own research and consult with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
