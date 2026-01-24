'use client'

import { Sparkles, Send, Download, CreditCard, Plus, ChevronRight, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './theme-toggle'

interface DashboardProps {
  onOpenNewScan?: () => void
  onScanSelect?: (symbol: string) => void
}

export default function Dashboard({ onOpenNewScan, onScanSelect }: DashboardProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const transactions = [
    { name: 'NVIDIA Corp', type: 'Buy', amount: '+$2,450', time: '2 hours ago', positive: true },
    { name: 'Apple Inc', type: 'Dividend', amount: '+$89.50', time: '5 hours ago', positive: true },
    { name: 'Tesla Inc', type: 'Sell', amount: '-$1,200', time: 'Yesterday', positive: false },
  ]

  const isDark = mounted && theme === 'dark'

  // Theme-aware styles
  const styles = {
    container: isDark 
      ? "flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1a]"
      : "flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200",
    blurOrb1: isDark ? "bg-orange-500/20" : "bg-orange-400/30",
    blurOrb2: isDark ? "bg-cyan-500/20" : "bg-cyan-400/30",
    blurOrb3: isDark ? "bg-purple-500/10" : "bg-purple-400/20",
    mainCard: isDark 
      ? "bg-white/[0.05] backdrop-blur-3xl rounded-3xl border border-white/[0.15] p-6 min-h-[calc(100vh-3rem)] shadow-2xl shadow-black/50"
      : "bg-white/70 backdrop-blur-3xl rounded-3xl border border-white/80 p-6 min-h-[calc(100vh-3rem)] shadow-2xl shadow-gray-200/50",
    heading: isDark ? "text-white" : "text-gray-900",
    subtext: isDark ? "text-gray-400" : "text-gray-500",
    mutedText: isDark ? "text-gray-500" : "text-gray-400",
    statCard: isDark 
      ? "bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.15] shadow-lg shadow-black/20 hover:bg-white/[0.12] transition-all duration-300"
      : "bg-white/80 backdrop-blur-2xl rounded-2xl p-4 border border-gray-100 shadow-lg shadow-gray-200/50 hover:bg-white hover:shadow-xl transition-all duration-300",
    chartCard: isDark 
      ? "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.12] overflow-hidden shadow-xl shadow-orange-900/10"
      : "bg-gradient-to-br from-orange-50 via-amber-50/50 to-white backdrop-blur-2xl rounded-2xl border border-orange-100/50 overflow-hidden shadow-xl shadow-orange-100/30",
    glassCard: isDark 
      ? "bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.15] shadow-lg shadow-black/20 hover:bg-white/[0.1] transition-all duration-300"
      : "bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-200/50 hover:bg-white hover:shadow-xl transition-all duration-300",
    progressBg: isDark ? "bg-white/[0.08]" : "bg-gray-100",
    badge: isDark 
      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
      : "bg-orange-100 text-orange-600",
    badgeGreen: isDark 
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-emerald-100 text-emerald-600",
    actionBtn: isDark 
      ? "bg-white/[0.1] backdrop-blur-xl border border-white/[0.1] group-hover:bg-orange-500/20 group-hover:border-orange-500/30"
      : "bg-gray-50 border border-gray-200 group-hover:bg-orange-50 group-hover:border-orange-300 shadow-sm",
    actionIcon: isDark ? "text-gray-400 group-hover:text-orange-400" : "text-gray-500 group-hover:text-orange-500",
    txRow: isDark ? "hover:bg-white/[0.05]" : "hover:bg-gray-50",
    txIcon: isDark 
      ? "bg-white/[0.1] backdrop-blur-xl border border-white/[0.1]"
      : "bg-gray-100 border border-gray-200",
    txIconText: isDark ? "text-gray-300" : "text-gray-600",
    barInactive: isDark ? "bg-orange-500/30" : "bg-orange-200",
    chartBtn: isDark 
      ? "bg-white/[0.1] backdrop-blur-xl rounded-full text-sm text-gray-300 border border-white/[0.15] hover:bg-white/[0.15]"
      : "bg-white backdrop-blur-xl rounded-full text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm",
    waveGray: isDark ? "rgba(255,255,255,0.4)" : "rgba(100,100,100,0.3)",
  }

  if (!mounted) {
    return <div className="flex-1 min-h-screen bg-gray-900" />
  }

  return (
    <div className={styles.container}>
      {/* Background blur elements */}
      <div className={`absolute top-20 left-20 w-96 h-96 ${styles.blurOrb1} rounded-full blur-[150px]`}></div>
      <div className={`absolute bottom-20 right-20 w-80 h-80 ${styles.blurOrb2} rounded-full blur-[120px]`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${styles.blurOrb3} rounded-full blur-[200px]`}></div>
      
      {/* Main Content Area with Glass Effect */}
      <div className="relative p-6">
        <div className={styles.mainCard}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-2xl font-semibold ${styles.heading} flex items-center gap-3`}>
                My Dashboard
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-300"></span>
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme Toggle Slider */}
              <ThemeToggle />
              <button
                onClick={onOpenNewScan}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-orange-500/30"
              >
                <Sparkles className="w-4 h-4" />
                New Scan
              </button>
            </div>
          </div>

          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={styles.statCard}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                <span className={`text-xs ${styles.subtext}`}>Total Balance</span>
              </div>
              <p className={`text-2xl font-semibold ${styles.heading}`}>$675,993.98</p>
            </div>
            <div className={styles.statCard}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                <span className={`text-xs ${styles.subtext}`}>Earnings</span>
              </div>
              <p className={`text-2xl font-semibold ${styles.heading}`}>$998,993.98</p>
            </div>
            <div className={styles.statCard}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
                <span className={`text-xs ${styles.subtext}`}>Expenses</span>
              </div>
              <p className={`text-2xl font-semibold ${styles.heading}`}>$28,993.98</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Chart */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Statistics Card */}
              <div className={styles.chartCard}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-medium ${styles.heading}`}>Statistic</h3>
                    <button className={`px-4 py-1.5 ${styles.chartBtn} transition`}>
                      All Transactions
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-sm ${styles.subtext} mb-1`}>Top Contributor</p>
                    <p className={`text-xs ${styles.mutedText}`}>Top half year Earning and Expense source</p>
                  </div>

                  {/* Floating tooltip */}
                  <div className="relative mb-2">
                    <div className="absolute left-1/4 -top-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                      <span className="font-semibold">$89.8K</span>
                    </div>
                  </div>

                  {/* Wave Chart */}
                  <div className="h-44 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                      {/* Orange wave */}
                      <path 
                        d="M0 80 Q50 60 100 70 T200 50 T300 65 T400 45" 
                        fill="none" 
                        stroke="#f97316" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      {/* Gray wave */}
                      <path 
                        d="M0 70 Q50 90 100 75 T200 85 T300 60 T400 70" 
                        fill="none" 
                        stroke={styles.waveGray}
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      {/* Cyan wave */}
                      <path 
                        d="M0 90 Q50 70 100 85 T200 65 T300 80 T400 55" 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className={`flex justify-between text-xs ${styles.mutedText} mt-2`}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Goals and Savings */}
              <div className="grid grid-cols-2 gap-5">
                {/* Goals */}
                <div className={styles.glassCard}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-base font-medium ${styles.heading}`}>Goals</h3>
                    <button className={`text-xs ${styles.subtext} flex items-center gap-1 hover:text-orange-500 transition`}>
                      Add Goals <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-semibold ${styles.heading}`}>78%</span>
                      </div>
                      <div className={`h-2 ${styles.progressBg} rounded-full overflow-hidden`}>
                        <div className="h-full w-[78%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-sm"></div>
                      </div>
                      <p className={`text-xs ${styles.mutedText} mt-1`}>Portfolio Target</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-semibold ${styles.heading}`}>97%</span>
                      </div>
                      <div className={`h-2 ${styles.progressBg} rounded-full overflow-hidden`}>
                        <div className="h-full w-[97%] bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-sm"></div>
                      </div>
                      <p className={`text-xs ${styles.mutedText} mt-1`}>Monthly Savings</p>
                    </div>
                  </div>
                </div>

                {/* Other Savings */}
                <div className={styles.glassCard}>
                  <h3 className={`text-base font-medium ${styles.heading} mb-4`}>Other Savings</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className={`text-xs ${styles.subtext} mb-1`}>Investment Returns</p>
                      <p className={`text-xl font-semibold ${styles.heading}`}>$439,283.0</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 ${styles.badgeGreen} text-xs rounded-full font-medium`}>+14.5%</span>
                    </div>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-1.5 h-16">
                      {[45, 65, 55, 80, 70, 90].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-4 rounded-t shadow-sm ${i >= 4 ? 'bg-orange-500' : styles.barInactive}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile & Card */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              {/* User Profile Card */}
              <div className={`${styles.glassCard} text-center`}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <User className="w-8 h-8 text-white" />
                </div>
                <span className={`inline-block px-3 py-1 ${styles.badge} text-xs rounded-full mb-2 font-medium`}>Pro Investor</span>
                <h4 className={`${styles.heading} font-medium`}>Welcome Back</h4>
                
                {/* Quick Actions */}
                <div className="flex justify-center gap-4 mt-4">
                  {[
                    { icon: Send, label: 'Transfer' },
                    { icon: Download, label: 'Receive' },
                    { icon: CreditCard, label: 'Cards' },
                    { icon: Plus, label: 'Top Up' },
                  ].map((action) => (
                    <button key={action.label} className="flex flex-col items-center gap-1 group">
                      <div className={`w-10 h-10 rounded-xl ${styles.actionBtn} flex items-center justify-center transition-all`}>
                        <action.icon className={`w-4 h-4 ${styles.actionIcon}`} />
                      </div>
                      <span className={`text-[10px] ${styles.mutedText}`}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credit Card Display */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 backdrop-blur-2xl rounded-2xl p-5 border border-gray-700 overflow-hidden shadow-xl">
                  {/* Card background pattern */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/40 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl"></div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs text-gray-400 font-medium tracking-wider">VISA</span>
                      <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded opacity-80"></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Total Balance</p>
                    <p className="text-2xl font-bold text-white">$675,989.0</p>
                  </div>
                </div>
              </div>

              {/* Last Transactions */}
              <div className={styles.glassCard}>
                <h3 className={`text-base font-medium ${styles.heading} mb-4`}>Last Transaction</h3>
                <div className="space-y-3">
                  {transactions.map((tx, i) => (
                    <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-xl ${styles.txRow} transition-all cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${styles.txIcon} flex items-center justify-center`}>
                          <span className={`text-xs font-medium ${styles.txIconText}`}>{tx.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className={`text-sm ${styles.heading}`}>{tx.name}</p>
                          <p className={`text-xs ${styles.mutedText}`}>{tx.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${tx.positive ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-500')}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <button className={`w-full mt-4 py-2.5 text-sm ${styles.subtext} hover:text-orange-500 flex items-center justify-center gap-2 transition`}>
                  See all transactions <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
