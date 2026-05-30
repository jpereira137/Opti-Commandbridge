"use client"

import Sidebar from "@/components/layout/Sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-[240px]">
        {children}
      </main>
    </div>
  )
}
