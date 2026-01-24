'use client'

import { useSession, signOut } from 'next-auth/react'
import { useMemo } from 'react'
import {
  User,
  Mail,
  Calendar,
  Shield,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  BarChart3,
  History,
  TrendingUp,
  AlertTriangle,
  Settings,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Card } from '@/components/ui/card'
import { useScans } from '@/context/scans-context'

export default function Profile() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { scans } = useScans()

  const stats = useMemo(() => {
    const total = scans.length
    const highRisk = scans.filter((s) => s.riskLevel === 'high').length
    const avgConfidence = total ? Math.round(scans.reduce((sum, s) => sum + s.confidence, 0) / total) : 0
    const bullish = scans.filter((s) => s.trend === 'up').length
    const bearish = scans.filter((s) => s.trend === 'down').length
    return { total, highRisk, avgConfidence, bullish, bearish }
  }, [scans])

  const user = session?.user

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(scans, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'liquisight-scans.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 border border-border/50">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted border-2 border-primary/20">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground truncate">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{user?.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
                  <Shield className="w-3 h-3" />
                  Pro Member
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted/50 border border-border/50 rounded-full px-2.5 py-1">
                  <Calendar className="w-3 h-3" />
                  Joined Jan 2026
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Scans</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.bullish}</p>
                <p className="text-xs text-muted-foreground">Bullish Scans</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.highRisk}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <History className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </h3>
          </div>

          <div className="divide-y divide-border/50">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Appearance</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 border border-border/50 transition-colors"
              >
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Get alerts for high-risk scans</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                  id="notifications"
                />
                <label
                  htmlFor="notifications"
                  className="w-11 h-6 bg-muted rounded-full cursor-pointer peer-checked:bg-primary transition-colors flex items-center peer-checked:justify-end justify-start p-1"
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </label>
              </div>
            </div>

            {/* Export Data */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Export Scan Data</p>
                  <p className="text-xs text-muted-foreground">Download all your scans as JSON</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Browser Extension */}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Browser Extension</p>
                  <p className="text-xs text-muted-foreground">Analyze charts from any trading platform</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border border-destructive/30 overflow-hidden">
          <div className="p-4 border-b border-destructive/20 bg-destructive/5">
            <h3 className="font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h3>
          </div>

          <div className="divide-y divide-border/50">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Sign Out</p>
                  <p className="text-xs text-muted-foreground">Log out of your account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive" />
            </button>

            <button
              className="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors text-left opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">LiquiSight v1.0.0 • AI Financial Copilot</p>
        </div>
      </div>
    </div>
  )
}
