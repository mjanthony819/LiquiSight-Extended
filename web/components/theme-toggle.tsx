'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        isDark
          ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
          : 'bg-gray-200 shadow-inner'
      }`}
      aria-label="Toggle theme"
    >
      {/* Slider knob */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark
            ? 'left-[calc(100%-26px)] bg-gray-900'
            : 'left-0.5 bg-white shadow-md'
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
