'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback } from 'react'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = useCallback(() => {
    if (isTransitioning) return

    const current = resolvedTheme ?? theme
    const newTheme = current === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)

    // Keep the knob animation feeling "locked in" and prevent rapid toggles.
    // Do NOT use a full-screen overlay (user requested no screen-cover flash).
    setIsTransitioning(true)
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    window.setTimeout(() => setIsTransitioning(false), prefersReducedMotion ? 0 : 320)
  }, [theme, resolvedTheme, setTheme, isTransitioning])

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
    )
  }

  const isDark = (resolvedTheme ?? theme) === 'dark'

  return (
    <button
      onClick={handleThemeChange}
      disabled={isTransitioning}
      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ease-out ${
        isDark
          ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
          : 'bg-gray-200 shadow-inner'
      }`}
      aria-label="Toggle theme"
    >
      {/* Slider knob */}
      <div
        className={`absolute left-0.5 top-0.5 w-6 h-6 rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.2,0,0,1)] flex items-center justify-center will-change-transform ${
          isDark
            ? 'translate-x-7 bg-gray-900'
            : 'translate-x-0 bg-white shadow-md'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  )
}
