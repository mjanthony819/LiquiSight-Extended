'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, Search, ChevronDown, BarChart3, Shield, Sparkles, TrendingUp, Bot,
  Eye, Brain, Gauge, Chrome, History, Briefcase, Upload, Cpu, LineChart,
  Check, X, Menu, ArrowRight, Play
} from 'lucide-react'
import { useTheme } from 'next-themes'
import LoginModal from './login-modal'
import { ThemeToggle } from './theme-toggle'

interface LandingPageProps {
  onLogin: () => void
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || theme === 'dark'

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'How it Works', action: () => scrollToSection('how-it-works') },
    { label: 'Pricing', action: () => scrollToSection('pricing') },
    { label: 'Demo', action: () => scrollToSection('demo') },
  ]

  const features = [
    {
      icon: Eye,
      title: 'Visual Chart Scanning',
      description: 'Upload or capture any chart — our AI reads patterns like a seasoned analyst.',
    },
    {
      icon: Brain,
      title: 'AI Trend & Risk Detection',
      description: 'Detects trends, support/resistance levels, and potential risks automatically.',
    },
    {
      icon: Gauge,
      title: 'Confidence-Based Insights',
      description: 'Every insight comes with a confidence score so you know what to trust.',
    },
    {
      icon: Chrome,
      title: 'Copilot Browser Extension',
      description: 'Analyze charts directly from any trading platform with our browser extension.',
    },
    {
      icon: History,
      title: 'Scan History',
      description: 'Review all your past analyses and track how predictions performed.',
    },
    {
      icon: Briefcase,
      title: 'Portfolio View',
      description: 'Organize and monitor all your tracked assets in one unified dashboard.',
    },
  ]

  const howItWorks = [
    {
      step: 1,
      icon: Upload,
      title: 'Upload or Capture',
      description: 'Open the copilot extension or upload a chart image directly.',
    },
    {
      step: 2,
      icon: Cpu,
      title: 'AI Analyzes',
      description: 'Our vision AI scans the chart for patterns, trends, and signals.',
    },
    {
      step: 3,
      icon: LineChart,
      title: 'Structured Insight',
      description: 'Backend returns actionable insights with confidence scores.',
    },
    {
      step: 4,
      icon: BarChart3,
      title: 'View in Dashboard',
      description: 'Results appear in your dashboard with full analysis details.',
    },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      subtitle: 'Demo',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out LiquiSight',
      features: [
        { included: true, text: '5 scans per day' },
        { included: true, text: 'Basic chart analysis' },
        { included: true, text: 'Scan history (7 days)' },
        { included: false, text: 'Browser extension' },
        { included: false, text: 'Priority support' },
        { included: false, text: 'API access' },
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      subtitle: 'Trader',
      price: '$29',
      period: '/month',
      description: 'For serious traders who need more power',
      features: [
        { included: true, text: 'Unlimited scans' },
        { included: true, text: 'Advanced AI analysis' },
        { included: true, text: 'Full scan history' },
        { included: true, text: 'Browser extension' },
        { included: true, text: 'Priority support' },
        { included: false, text: 'API access' },
      ],
      cta: 'Get Pro',
      popular: true,
    },
    {
      name: 'Team',
      subtitle: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and institutions',
      features: [
        { included: true, text: 'Everything in Pro' },
        { included: true, text: 'Team collaboration' },
        { included: true, text: 'Custom integrations' },
        { included: true, text: 'API access' },
        { included: true, text: 'Dedicated support' },
        { included: true, text: 'SLA guarantee' },
      ],
      cta: 'Contact Sales',
      popular: false,
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={isDark 
                    ? "text-gray-400 hover:text-white font-medium transition-colors"
                    : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Login Button */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className={isDark 
                  ? "hidden sm:block px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                  : "hidden sm:block px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                }
              >
                Login
              </button>

              {/* Get Started CTA */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={isDark 
                  ? "md:hidden p-2 text-gray-400 hover:text-white"
                  : "md:hidden p-2 text-gray-600 hover:text-gray-900"
                }
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={isDark 
              ? "md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
              : "md:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
            }>
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={isDark 
                      ? "text-left text-gray-400 hover:text-white font-medium py-2 transition-colors"
                      : "text-left text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
                    }
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                  className={isDark 
                    ? "text-left text-gray-400 hover:text-white font-medium py-2 transition-colors"
                    : "text-left text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
                  }
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                  className="mt-2 w-full px-5 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
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
              <span className={isDark ? "text-sm font-medium text-indigo-300" : "text-sm font-medium text-indigo-700"}>AI-Powered Chart Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className={isDark 
              ? "text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
              : "text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6"
            }>
              See beyond the
              <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                market noise
              </span>
            </h1>

            {/* Subtitle */}
            <p className={isDark 
              ? "text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              : "text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            }>
              Upload any chart and let our AI analyze patterns, detect trends, and deliver confidence-scored insights in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]"
              >
                Get started free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className={isDark 
                  ? "inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-lg rounded-xl transition-all"
                  : "inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-xl transition-all shadow-sm"
                }
              >
                <Play className="w-5 h-5" />
                Watch demo
              </button>
            </div>

            <p className={isDark ? "mt-6 text-sm text-gray-500" : "mt-6 text-sm text-gray-500"}>No credit card required • Free tier available</p>
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
      <section id="features" className={isDark ? "py-24 bg-[#0a0f1a]" : "py-24 bg-white"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={isDark 
              ? "inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
              : "inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full mb-4"
            }>
              <span className={isDark ? "text-xs font-medium text-indigo-400" : "text-xs font-medium text-indigo-600"}>FEATURES</span>
            </div>
            <h2 className={isDark 
              ? "text-3xl md:text-4xl font-bold text-white mb-4"
              : "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            }>
              AI-native tools for modern traders
            </h2>
            <p className={isDark 
              ? "text-lg text-gray-400 max-w-2xl mx-auto"
              : "text-lg text-gray-600 max-w-2xl mx-auto"
            }>
              Everything you need to analyze charts and make informed decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* How it Works Section */}
      <section id="how-it-works" className={isDark ? "py-24 bg-[#06080d]" : "py-24 bg-slate-50"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={isDark 
              ? "inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4"
              : "inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 rounded-full mb-4"
            }>
              <span className={isDark ? "text-xs font-medium text-cyan-400" : "text-xs font-medium text-cyan-600"}>HOW IT WORKS</span>
            </div>
            <h2 className={isDark 
              ? "text-3xl md:text-4xl font-bold text-white mb-4"
              : "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            }>
              From chart to insight in seconds
            </h2>
            <p className={isDark 
              ? "text-lg text-gray-400 max-w-2xl mx-auto"
              : "text-lg text-gray-600 max-w-2xl mx-auto"
            }>
              A simple 4-step workflow to get AI-powered chart analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className={isDark 
                      ? "hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent"
                      : "hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-indigo-300 to-transparent"
                    } />
                  )}
                  
                  <div className={isDark 
                    ? "relative p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                    : "relative p-6 bg-white rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                  }>
                    {/* Step number */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    
                    <div className={isDark 
                      ? "w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4 mt-2"
                      : "w-12 h-12 bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 mt-2"
                    }>
                      <Icon className={isDark ? "w-6 h-6 text-cyan-400" : "w-6 h-6 text-cyan-600"} />
                    </div>
                    <h3 className={isDark ? "text-lg font-semibold text-white mb-2" : "text-lg font-semibold text-gray-900 mb-2"}>{step.title}</h3>
                    <p className={isDark ? "text-gray-400 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed"}>{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className={isDark ? "py-24 bg-[#0a0f1a]" : "py-24 bg-white"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={isDark 
              ? "inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
              : "inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-200 rounded-full mb-4"
            }>
              <span className={isDark ? "text-xs font-medium text-purple-400" : "text-xs font-medium text-purple-600"}>PREVIEW</span>
            </div>
            <h2 className={isDark 
              ? "text-3xl md:text-4xl font-bold text-white mb-4"
              : "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            }>
              See LiquiSight in action
            </h2>
            <p className={isDark 
              ? "text-lg text-gray-400 max-w-2xl mx-auto"
              : "text-lg text-gray-600 max-w-2xl mx-auto"
            }>
              Upload a chart and watch our AI deliver real-time insights
            </p>
          </div>

          {/* Demo Preview */}
          <div className={isDark 
            ? "relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            : "relative max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-xl"
          }>
            {/* Demo Header */}
            <div className={isDark 
              ? "flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10"
              : "flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200"
            }>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className={isDark ? "text-xs text-gray-500 ml-2" : "text-xs text-gray-400 ml-2"}>LiquiSight Dashboard</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-6">
              {/* Upload Zone */}
              <div className={isDark 
                ? "p-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-center"
                : "p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center"
              }>
                <Upload className={isDark ? "w-10 h-10 text-indigo-400 mb-3" : "w-10 h-10 text-indigo-500 mb-3"} />
                <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Drop chart here</p>
                <p className={isDark ? "text-xs text-gray-500 mt-1" : "text-xs text-gray-400 mt-1"}>or click to upload</p>
              </div>

              {/* AI Processing */}
              <div className={isDark 
                ? "p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20"
                : "p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-200"
              }>
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className={isDark ? "w-5 h-5 text-cyan-400" : "w-5 h-5 text-cyan-600"} />
                  <span className={isDark ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-900"}>AI Analysis</span>
                </div>
                <div className="space-y-2">
                  <div className={isDark ? "h-2 bg-white/10 rounded-full overflow-hidden" : "h-2 bg-gray-200 rounded-full overflow-hidden"}>
                    <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <p className={isDark ? "text-xs text-gray-500" : "text-xs text-gray-400"}>Detecting patterns...</p>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className={isDark ? "text-xs text-gray-400" : "text-xs text-gray-600"}>Trend identified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className={isDark ? "text-xs text-gray-400" : "text-xs text-gray-600"}>Support levels found</span>
                  </div>
                </div>
              </div>

              {/* Insight Card */}
              <div className={isDark 
                ? "p-6 rounded-xl bg-white/5 border border-white/10"
                : "p-6 rounded-xl bg-white border border-gray-200 shadow-sm"
              }>
                <div className="flex items-center justify-between mb-4">
                  <span className={isDark ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-900"}>Insight</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">High Confidence</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={isDark ? "text-xs text-gray-500" : "text-xs text-gray-400"}>Direction</p>
                    <p className={isDark ? "text-sm text-white font-medium" : "text-sm text-gray-900 font-medium"}>Bullish</p>
                  </div>
                  <div>
                    <p className={isDark ? "text-xs text-gray-500" : "text-xs text-gray-400"}>Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className={isDark ? "flex-1 h-2 bg-white/10 rounded-full" : "flex-1 h-2 bg-gray-200 rounded-full"}>
                        <div className="h-full w-[87%] bg-emerald-500 rounded-full" />
                      </div>
                      <span className={isDark ? "text-sm text-white font-medium" : "text-sm text-gray-900 font-medium"}>87%</span>
                    </div>
                  </div>
                  <div>
                    <p className={isDark ? "text-xs text-gray-500" : "text-xs text-gray-400"}>Key Pattern</p>
                    <p className={isDark ? "text-sm text-white font-medium" : "text-sm text-gray-900 font-medium"}>Double Bottom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={isDark ? "py-24 bg-[#06080d]" : "py-24 bg-slate-50"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={isDark 
              ? "inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4"
              : "inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full mb-4"
            }>
              <span className={isDark ? "text-xs font-medium text-emerald-400" : "text-xs font-medium text-emerald-600"}>PRICING</span>
            </div>
            <h2 className={isDark 
              ? "text-3xl md:text-4xl font-bold text-white mb-4"
              : "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            }>
              Simple, transparent pricing
            </h2>
            <p className={isDark 
              ? "text-lg text-gray-400 max-w-2xl mx-auto"
              : "text-lg text-gray-600 max-w-2xl mx-auto"
            }>
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? isDark
                      ? "bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-2 border-indigo-500/50 scale-105"
                      : "bg-gradient-to-b from-indigo-50 to-purple-50 border-2 border-indigo-400 scale-105 shadow-xl"
                    : isDark
                      ? "bg-white/5 border border-white/10 hover:border-white/20"
                      : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className={isDark ? "text-sm text-gray-500" : "text-sm text-gray-400"}>{plan.subtitle}</p>
                  <h3 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className={isDark ? "text-4xl font-bold text-white" : "text-4xl font-bold text-gray-900"}>{plan.price}</span>
                  <span className={isDark ? "text-gray-500" : "text-gray-400"}>{plan.period}</span>
                </div>

                <p className={isDark ? "text-sm text-gray-400 mb-6" : "text-sm text-gray-600 mb-6"}>{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className={isDark ? "w-5 h-5 text-gray-600 flex-shrink-0" : "w-5 h-5 text-gray-300 flex-shrink-0"} />
                      )}
                      <span className={feature.included 
                        ? isDark ? "text-sm text-gray-300" : "text-sm text-gray-700"
                        : isDark ? "text-sm text-gray-600" : "text-sm text-gray-400"
                      }>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                      : isDark
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={isDark ? "py-24 bg-[#0a0f1a]" : "py-24 bg-white"}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={isDark 
            ? "text-3xl md:text-4xl font-bold text-white mb-6"
            : "text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          }>
            Ready to see beyond the noise?
          </h2>
          <p className={isDark 
            ? "text-lg text-gray-400 mb-10"
            : "text-lg text-gray-600 mb-10"
          }>
            Join traders and students using AI to analyze charts smarter, not harder.
          </p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
          >
            Start for free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={isDark 
        ? "py-12 border-t border-white/10"
        : "py-12 border-t border-gray-200 bg-slate-50"
      }>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}>LiquiSight</span>
              </div>
              <p className={isDark ? "text-sm text-gray-500" : "text-sm text-gray-500"}>
                AI-powered chart analysis for modern traders.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Demo', 'Extension'].map(item => (
                  <li key={item}>
                    <button className={isDark ? "text-sm text-gray-500 hover:text-white transition-colors" : "text-sm text-gray-500 hover:text-gray-900 transition-colors"}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}>
                    <button className={isDark ? "text-sm text-gray-500 hover:text-white transition-colors" : "text-sm text-gray-500 hover:text-gray-900 transition-colors"}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Legal</h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security'].map(item => (
                  <li key={item}>
                    <button className={isDark ? "text-sm text-gray-500 hover:text-white transition-colors" : "text-sm text-gray-500 hover:text-gray-900 transition-colors"}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={isDark ? "pt-8 border-t border-white/10" : "pt-8 border-t border-gray-200"}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">© 2026 LiquiSight. All rights reserved.</p>
              <p className="text-sm text-gray-500">Built for the future of trading.</p>
            </div>
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
