"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import { MOCK_OWNER } from "@/lib/data"
import type { UserRole } from "@/types"

// In production this comes from Supabase auth session.
// For demo, you can switch role here to test different views.
const DEMO_ROLE: UserRole = "owner"
const DEMO_USER = MOCK_OWNER

export default function AppShell({ children }: { children: React.ReactNode }) {
  const badges = {
    "/onboarding": 2,
    "/pto": 2,
    "/documents": 1,
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        role={DEMO_ROLE}
        userName={`${DEMO_USER.firstName} ${DEMO_USER.lastName}`}
        userTitle={DEMO_USER.jobTitle}
        badges={badges}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
