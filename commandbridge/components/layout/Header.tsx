"use client"

import { Bell, Search, HelpCircle } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  notificationCount?: number
}

export default function Header({ title, subtitle, actions, notificationCount = 0 }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
      {/* Title (with mobile left padding for hamburger) */}
      <div className="flex-1 pl-10 lg:pl-0">
        <h1 className="text-lg font-bold text-navy-900 font-display leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 h-9 w-56">
        <Search size={14} className="text-slate-400 flex-shrink-0" />
        <input
          placeholder="Search…"
          className="bg-transparent text-sm text-slate-700 w-full outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {actions}
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-slate-300 transition-colors">
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        <button className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-slate-300 transition-colors">
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  )
}
