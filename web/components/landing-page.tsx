'use client'

import { useState, useEffect } from 'react'
import { Zap, Search, ChevronDown, BarChart3, Shield, Sparkles, TrendingUp, Bot } from 'lucide-react'
import { useTheme } from 'next-themes'
import LoginModal from './login-modal'
import { ThemeToggle } from './theme-toggle'

interface LandingPageProps {
  onLogin: () => void
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || theme === 'dark'

  const navItems = ['Features', 'Pricing', 'About', 'Contact']

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models analyze market patterns in real-time',
    },
    {
      icon: BarChart3,
      title: 'Smart Portfolio Tracking',
      description: 'Track all your investments in one unified dashboard',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Intelligent risk scoring to protect your investments',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Get actionable insights powered by financial AI',
    },
  ]

  return (
    <div className={isDark ? "min-h-screen bg-[#06080d]" : "min-h-screen bg-slate-50"}>
      {/* Header */}
      <header className={isDark 
        ? "sticky top-0 z-50 bg-[#06080d]/80 backdrop-blur-xl border-b border-white/10"
        : "sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      }>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-gray-900"}>LiquiSight</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  className={isDark 
                    ? "text-gray-400 hover:text-white font-medium transition-colors"
                    : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                >
                  {item}
                </button>
              ))}
              <button className={isDark 
                ? "flex items-center gap-1 text-gray-400 hover:text-white font-medium transition-colors"
                : "flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              }>
                More
                <ChevronDown className="w-4 h-4" />
              </button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className={isDark 
                ? "hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10"
                : "hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl border border-gray-200"
              }>
                <Search className={isDark ? "w-4 h-4 text-gray-500" : "w-4 h-4 text-gray-400"} />
                <input
                  type="text"
                  placeholder="Search LiquiSight..."
                  className={isDark 
                    ? "bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-40"
                    : "bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-40"
                  }
                />
              </div>

              {/* Theme Toggle Slider */}
              <ThemeToggle />

              {/* Login Button */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Login/Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className={isDark 
          ? "absolute inset-0 bg-gradient-to-b from-[#0a0f1a] to-[#06080d]"
          : "absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50"
        } />
        <div className={isDark 
          ? "absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] opacity-60"
          : "absolute top-20 left-1/4 w-96 h-96 bg-indigo-400/30 rounded-full blur-[120px] opacity-60"
        } />
        <div className={isDark 
          ? "absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] opacity-60"
          : "absolute top-40 right-1/4 w-80 h-80 bg-cyan-400/30 rounded-full blur-[100px] opacity-60"
        } />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className={isDark 
              ? "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8"
              : "inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 border border-indigo-200 rounded-full mb-8"
            }>
              <Sparkles className={isDark ? "w-4 h-4 text-indigo-400" : "w-4 h-4 text-indigo-600"} />
              <span className={isDark ? "text-sm font-medium text-indigo-300" : "text-sm font-medium text-indigo-700"}>AI-Powered Financial Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className={isDark 
              ? "text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
              : "text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6"
            }>
              See beyond the
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                market noise
              </span>
            </h1>

            {/* Subtitle */}
            <p className={isDark 
              ? "text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              : "text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            }>
              Built for smart investors who want AI-powered insights, real-time analysis, and intelligent portfolio management.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]"
            >
              Get started
            </button>

            <p className={isDark ? "mt-4 text-sm text-gray-500" : "mt-4 text-sm text-gray-500"}>Free to start • No credit card required</p>
          </div>

          {/* Hero Illustration */}
          <div className="mt-20 relative">
            <div className={isDark 
              ? "absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-transparent z-10 pointer-events-none"
              : "absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none"
            } />
            
            {/* Isometric City-like Illustration with Charts */}
            <div className="flex justify-center items-end gap-4 h-64 md:h-80">
              {/* Buildings as chart bars */}
              <div className="relative group">
                <div className={isDark 
                  ? "w-16 md:w-24 h-32 md:h-48 bg-gradient-to-t from-indigo-600/40 to-indigo-500/20 rounded-t-lg border border-indigo-500/30 shadow-lg transform perspective-1000 rotate-y-12 skew-y-1"
                  : "w-16 md:w-24 h-32 md:h-48 bg-gradient-to-t from-indigo-400/50 to-indigo-300/30 rounded-t-lg border border-indigo-300 shadow-lg transform perspective-1000 rotate-y-12 skew-y-1"
                } />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-500 rounded-lg opacity-80" />
              </div>
              
              <div className="relative">
                <div className={isDark 
                  ? "w-20 md:w-32 h-44 md:h-64 bg-gradient-to-t from-cyan-600/40 to-cyan-500/20 rounded-t-lg border border-cyan-500/30 shadow-lg"
                  : "w-20 md:w-32 h-44 md:h-64 bg-gradient-to-t from-cyan-400/50 to-cyan-300/30 rounded-t-lg border border-cyan-300 shadow-lg"
                } />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-1">
                  <div className="w-12 h-1 bg-cyan-400 rounded" />
                  <div className="w-8 h-1 bg-cyan-400 rounded" />
                  <div className="w-10 h-1 bg-cyan-400 rounded" />
                </div>
              </div>
              
              <div className="relative">
                <div className={isDark 
                  ? "w-24 md:w-40 h-52 md:h-72 bg-gradient-to-t from-indigo-600/50 to-indigo-500/30 rounded-t-lg border border-indigo-500/40 shadow-xl"
                  : "w-24 md:w-40 h-52 md:h-72 bg-gradient-to-t from-indigo-400/60 to-indigo-300/40 rounded-t-lg border border-indigo-300 shadow-xl"
                } />
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <div className={isDark 
                    ? "w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    : "w-16 h-16 bg-white/60 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white"
                  }>
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className={isDark 
                  ? "w-20 md:w-32 h-40 md:h-56 bg-gradient-to-t from-purple-600/40 to-purple-500/20 rounded-t-lg border border-purple-500/30 shadow-lg"
                  : "w-20 md:w-32 h-40 md:h-56 bg-gradient-to-t from-purple-400/50 to-purple-300/30 rounded-t-lg border border-purple-300 shadow-lg"
                } />
                <div className="absolute -top-6 right-0">
                  <div className={isDark 
                    ? "px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] font-semibold text-emerald-400"
                    : "px-2 py-1 bg-emerald-100 border border-emerald-200 rounded text-[10px] font-semibold text-emerald-600"
                  }>
                    +12.5%
                  </div>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <div className={isDark 
                  ? "w-16 md:w-24 h-28 md:h-40 bg-gradient-to-t from-cyan-600/40 to-cyan-500/20 rounded-t-lg border border-cyan-500/30 shadow-lg"
                  : "w-16 md:w-24 h-28 md:h-40 bg-gradient-to-t from-cyan-400/50 to-cyan-300/30 rounded-t-lg border border-cyan-300 shadow-lg"
                } />
              </div>
              
              <div className="relative hidden lg:block">
                <div className={isDark 
                  ? "w-20 h-52 bg-gradient-to-t from-indigo-600/40 to-indigo-500/20 rounded-t-lg border border-indigo-500/30 shadow-lg"
                  : "w-20 h-52 bg-gradient-to-t from-indigo-400/50 to-indigo-300/30 rounded-t-lg border border-indigo-300 shadow-lg"
                } />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={isDark ? "py-24 bg-[#0a0f1a]" : "py-24 bg-white"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={isDark 
              ? "text-3xl md:text-4xl font-bold text-white mb-4"
              : "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            }>
              Everything you need to invest smarter
            </h2>
            <p className={isDark 
              ? "text-lg text-gray-400 max-w-2xl mx-auto"
              : "text-lg text-gray-600 max-w-2xl mx-auto"
            }>
              Powerful AI tools designed to give you an edge in the market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={isDark 
                    ? "group p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300"
                    : "group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all duration-300"
                  }
                >
                  <div className={isDark 
                    ? "w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    : "w-12 h-12 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  }>
                    <Icon className={isDark ? "w-6 h-6 text-indigo-400" : "w-6 h-6 text-indigo-600"} />
                  </div>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-2" : "text-lg font-semibold text-gray-900 mb-2"}>{feature.title}</h3>
                  <p className={isDark ? "text-gray-400 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed"}>{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={isDark ? "py-24" : "py-24 bg-slate-50"}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={isDark 
            ? "text-3xl md:text-4xl font-bold text-white mb-6"
            : "text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          }>
            Ready to transform your investing?
          </h2>
          <p className={isDark 
            ? "text-lg text-gray-400 mb-10"
            : "text-lg text-gray-600 mb-10"
          }>
            Join thousands of investors using AI to make smarter decisions.
          </p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
          >
            Start for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={isDark 
        ? "py-8 border-t border-white/10"
        : "py-8 border-t border-gray-200 bg-white"
      }>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}>LiquiSight</span>
            </div>
            <p className="text-sm text-gray-500">© 2026 LiquiSight. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={onLogin}
      />
    </div>
  )
}
