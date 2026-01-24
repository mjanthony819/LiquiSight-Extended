'use client'

import { useState, useEffect } from 'react'
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { LiquiLogoIcon } from './liqui-logo'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen) return null

  const isDark = mounted && theme === 'dark'

  const handleContinue = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onLogin()
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    onLogin()
  }

  // Theme-aware styles
  const styles = {
    backdrop: isDark ? "bg-black/50 backdrop-blur-sm" : "bg-black/30 backdrop-blur-sm",
    modal: isDark 
      ? "bg-[#0d1117] rounded-3xl shadow-2xl border border-white/10"
      : "bg-white rounded-3xl shadow-2xl border border-gray-200",
    rightPanel: isDark ? "bg-[#0d1117]" : "bg-white",
    closeBtn: isDark 
      ? "text-gray-500 hover:text-gray-300 hover:bg-white/10"
      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
    heading: isDark ? "text-white" : "text-gray-900",
    subtext: isDark ? "text-gray-400" : "text-gray-500",
    googleBtn: isDark 
      ? "bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 text-white"
      : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700",
    divider: isDark ? "bg-white/20" : "bg-gray-200",
    dividerText: isDark ? "text-gray-500" : "text-gray-400",
    label: isDark ? "text-gray-300" : "text-gray-700",
    input: isDark 
      ? "bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:ring-indigo-500"
      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500",
    inputIcon: isDark ? "text-gray-500" : "text-gray-400",
    termsLink: isDark ? "text-indigo-400" : "text-indigo-600",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${styles.backdrop}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-4xl ${styles.modal} overflow-hidden flex animate-in zoom-in-95 fade-in duration-200`}>
        {/* Left Panel - Branding */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 50 Q 25 30, 50 50 T 100 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <path
                    d="M0 70 Q 25 50, 50 70 T 100 70"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M0 30 Q 25 10, 50 30 T 100 30"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                <LiquiLogoIcon size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">LiquiSight</span>
            </div>

            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Smart, AI-Powered
              <br />
              Investing.
            </h2>
            <p className="text-indigo-100 text-lg">
              Get insights that matter with our advanced financial AI.
            </p>
          </div>

          {/* Bottom decoration */}
          <div className="relative z-10">
            <div className="w-12 h-1 bg-white/50 rounded mb-4" />
            <p className="text-indigo-200 text-sm">Trusted by 10,000+ investors</p>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-2xl rotate-12" />
          <div className="absolute bottom-32 right-20 w-12 h-12 bg-cyan-400/30 rounded-xl -rotate-6" />
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-purple-300/20 rounded-lg rotate-45" />
        </div>

        {/* Right Panel - Login Form */}
        <div className={`w-full md:w-1/2 p-8 md:p-12 relative ${styles.rightPanel}`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 ${styles.closeBtn} rounded-lg transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-sm mx-auto">
            <h2 className={`text-2xl font-bold ${styles.heading} mb-2`}>Welcome to LiquiSight</h2>
            <p className={`${styles.subtext} mb-8`}>Sign in to access your dashboard</p>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 ${styles.googleBtn} rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className={`flex-1 h-px ${styles.divider}`} />
              <span className={`text-sm ${styles.dividerText}`}>Or</span>
              <div className={`flex-1 h-px ${styles.divider}`} />
            </div>

            {/* Email Input */}
            <div className="space-y-2 mb-6">
              <label className={`block text-sm font-medium ${styles.label}`}>
                Your Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${styles.inputIcon}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3 ${styles.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-indigo-500/25"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Terms */}
            <p className={`mt-6 text-center text-xs ${styles.subtext} leading-relaxed`}>
              By proceeding, I agree to{' '}
              <a href="#" className={`${styles.termsLink} hover:underline`}>
                T&C
              </a>
              ,{' '}
              <a href="#" className={`${styles.termsLink} hover:underline`}>
                Privacy Policy
              </a>{' '}
              &{' '}
              <a href="#" className={`${styles.termsLink} hover:underline`}>
                Tariff Rates
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
