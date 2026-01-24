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
      title: 'Scan-First Dashboard',
      description: 'A clean dashboard built entirely from real scan history—no fake portfolio widgets.',
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
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        { text: '5 scans per day', included: true },
        { text: 'Basic chart analysis', included: true },
        { text: 'Browser extension', included: true },
        { text: 'Scan history (7 days)', included: true },
        { text: 'Priority support', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious traders',
      features: [
        { text: 'Unlimited scans', included: true },
        { text: 'Advanced AI analysis', included: true },
        { text: 'Browser extension', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Priority support', included: true },
        { text: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and institutions',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Custom AI models', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Full API access', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <div className={isDark ? "min-h-screen bg-[#0a0f1a]" : "min-h-screen bg-slate-50"}>
      {/* Navigation */}
      <nav className={isDark 
        ? "fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5"
        : "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      }>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-gray-900"}>LiquiSight</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
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
          </div>

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
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={isDark 
              ? "absolute top-16 left-0 right-0 bg-[#0a0f1a] border-b border-white/5 md:hidden"
              : "absolute top-16 left-0 right-0 bg-white border-b border-gray-200 md:hidden"
            }>
              <div className="flex flex-col p-4 gap-2">
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
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className={isDark 
            ? "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8"
            : "inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
          }>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className={isDark ? "text-sm font-medium text-indigo-300" : "text-sm font-medium text-indigo-600"}>AI-Powered Chart Analysis</span>
          </div>

          {/* Headline */}
          <h1 className={isDark 
            ? "text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            : "text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6"
          }>
            Your AI Copilot for
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"> Smarter Trading</span>
          </h1>

          {/* Subheadline */}
          <p className={isDark 
            ? "text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            : "text-xl text-gray-600 max-w-2xl mx-auto mb-10"
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

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-600"}>85% accuracy rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <span className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Powered by GPT-4 Vision</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={isDark 
              ? "text-4xl font-bold text-white mb-4"
              : "text-4xl font-bold text-gray-900 mb-4"
            }>
              Everything you need to trade smarter
            </h2>
            <p className={isDark ? "text-lg text-gray-400" : "text-lg text-gray-600"}>
              Powerful features designed for modern traders and investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={isDark 
                    ? "p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all group"
                    : "p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all group"
                  }
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={isDark ? "text-xl font-semibold text-white mb-2" : "text-xl font-semibold text-gray-900 mb-2"}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={isDark 
        ? "py-20 px-6 bg-white/[0.02]"
        : "py-20 px-6 bg-gray-100"
      }>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={isDark 
              ? "text-4xl font-bold text-white mb-4"
              : "text-4xl font-bold text-gray-900 mb-4"
            }>
              How it works
            </h2>
            <p className={isDark ? "text-lg text-gray-400" : "text-lg text-gray-600"}>
              Get actionable insights in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className={isDark 
                      ? "hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-500/50 to-transparent"
                      : "hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-300 to-transparent"
                    } />
                  )}
                  
                  <div className="text-center">
                    <div className="relative inline-flex mb-6">
                      <div className={isDark 
                        ? "w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center"
                        : "w-24 h-24 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center"
                      }>
                        <Icon className="w-10 h-10 text-indigo-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <h3 className={isDark ? "text-xl font-semibold text-white mb-2" : "text-xl font-semibold text-gray-900 mb-2"}>
                      {step.title}
                    </h3>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={isDark 
              ? "text-4xl font-bold text-white mb-4"
              : "text-4xl font-bold text-gray-900 mb-4"
            }>
              See it in action
            </h2>
            <p className={isDark ? "text-lg text-gray-400" : "text-lg text-gray-600"}>
              Watch how LiquiSight analyzes charts in real-time.
            </p>
          </div>

          {/* Demo Placeholder */}
          <div className={isDark 
            ? "aspect-video max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center"
            : "aspect-video max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg"
          }>
            <div className="text-center">
              <div className={isDark 
                ? "w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-indigo-500/30 transition-colors"
                : "w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-indigo-200 transition-colors"
              }>
                <Play className="w-8 h-8 text-indigo-500 ml-1" />
              </div>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Click to play demo video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={isDark 
        ? "py-20 px-6 bg-white/[0.02]"
        : "py-20 px-6 bg-gray-100"
      }>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={isDark 
              ? "text-4xl font-bold text-white mb-4"
              : "text-4xl font-bold text-gray-900 mb-4"
            }>
              Simple, transparent pricing
            </h2>
            <p className={isDark ? "text-lg text-gray-400" : "text-lg text-gray-600"}>
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/50'
                    : isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <h3 className={isDark ? "text-2xl font-bold text-white mb-2" : "text-2xl font-bold text-gray-900 mb-2"}>
                  {plan.name}
                </h3>
                <p className={isDark ? "text-gray-400 mb-6" : "text-gray-600 mb-6"}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={isDark ? "text-4xl font-bold text-white" : "text-4xl font-bold text-gray-900"}>
                    {plan.price}
                  </span>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500" />
                      )}
                      <span className={feature.included 
                        ? (isDark ? "text-gray-300" : "text-gray-700")
                        : "text-gray-500"
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
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className={isDark 
            ? "text-4xl font-bold text-white mb-6"
            : "text-4xl font-bold text-gray-900 mb-6"
          }>
            Ready to trade smarter?
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-gray-900"}>LiquiSight</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered chart analysis for smarter trading decisions.
              </p>
            </div>

            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-500 hover:text-gray-300">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-500 hover:text-gray-300">Pricing</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Extension</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">About</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={isDark ? "font-semibold text-white mb-4" : "font-semibold text-gray-900 mb-4"}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300">Security</a></li>
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
