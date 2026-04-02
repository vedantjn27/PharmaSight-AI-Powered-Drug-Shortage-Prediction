'use client'

import Link from 'next/link'
import { useAppStore } from '@/store/appStore'
import { Moon, Sun, AlertTriangle, Zap } from 'lucide-react'
import { useEffect } from 'react'

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, emergencyMode, setEmergencyMode, backendHealthy } = useAppStore()

  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">PharmaSight</span>
          </div>
        </Link>

        {/* Center - Status */}
        <div className="flex items-center gap-4">
          {!backendHealthy && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-red/10 border border-status-red/20 text-status-red text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Backend Offline</span>
            </div>
          )}
          {emergencyMode && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-amber/10 border border-status-amber/20 text-status-amber text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Demo Mode</span>
            </div>
          )}
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-4">
          {/* Emergency Button */}
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              emergencyMode
                ? 'bg-status-amber/10 border border-status-amber/30 text-status-amber hover:bg-status-amber/20'
                : 'bg-primary-500/10 border border-primary-500/30 text-primary-500 hover:bg-primary-500/20'
            }`}
            title={emergencyMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          >
            {emergencyMode ? '🎬' : '🚨'} Demo
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 transition-all"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-accent-amber" />
            ) : (
              <Moon className="w-5 h-5 text-accent-purple" />
            )}
          </button>

          {/* Back Button */}
          <Link href="/">
            <button className="px-4 py-2 rounded-lg border border-primary-500/20 text-foreground hover:bg-primary-500/10 transition-all text-sm font-semibold">
              Back
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
