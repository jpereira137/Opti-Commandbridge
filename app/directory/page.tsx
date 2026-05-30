"use client"

import { useState } from "react"
import { Users, Search, Plus, Mail, Phone, MapPin, Zap, ChevronRight, RefreshCw } from "lucide-react"
import Header from "@/components/layout/Header"
import Link from "next/link"
import { Card, Button, Avatar, EmptyState } from "@/components/ui"
import { getDeptColor, formatPay } from "@/lib/data"
import type { Employee } from "@/lib/data"
import { useConnecteam } from "@/lib/connecteam-context"

export default function DirectoryPage() {
  const { employees, isLive, isSyncing, sync } = useConnecteam()
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("All")
  const [view, setView] = useState<"grid"|"list">("grid")

  const depts = ["All", ...Array.from(new Set(employees.map(e => e.department || "")))]

  const filtered = employees.filter(emp => {
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) ||
      emp.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === "All" || emp.department === deptFilter
    return matchSearch && matchDept
  })

  return (
    <div className="animate-in">
      <Header
        title="Employee directory"
        subtitle={`${employees.length} employees across 2 Connecteam accounts${isLive ? " (Live)" : " (Demo)"}`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={sync} disabled={isSyncing}>
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync"}
            </Button>
            <Link href="/onboarding">
              <Button variant="primary" size="sm"><Plus size={14} /> Add employee</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 flex-1 max-w-xs">
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <input
              placeholder="Search by name, title, department…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 w-full outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-1.5">
            {depts.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className={`h-9 px-3 text-xs font-medium rounded-lg border transition-all ${
                  deptFilter === d
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {(["grid","list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-all ${
                  view === v ? "bg-navy-900 text-white border-navy-900" : "bg-white border-slate-200 text-slate-500"
                }`}>
                {v === "grid"
                  ? <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/></svg>
                  : <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                }
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No employees found" description="Try adjusting your search or filters." />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(emp => <EmployeeCard key={emp.id} emp={emp} />)}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.map(emp => <EmployeeRow key={emp.id} emp={emp} />)}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function EmployeeCard({ emp }: { emp: Employee }) {
  const deptColor = getDeptColor(emp.department)
  return (
    <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={`${emp.firstName} ${emp.lastName}`} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 group-hover:text-navy-900 transition-colors">
            {emp.firstName} {emp.lastName}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{emp.jobTitle}</p>
          <span className={`badge mt-1.5 ${deptColor}`}>{emp.department}</span>
        </div>
        {emp.connecteamAccount && (
          <span className="badge bg-amber-100 text-amber-800 flex items-center gap-1">
            <Zap size={9} /> {emp.connecteamAccount}
          </span>
        )}
      </div>
      <div className="space-y-1.5 text-xs text-slate-500">
        {emp.location && (
          <div className="flex items-center gap-1.5"><MapPin size={11} />{emp.location}</div>
        )}
        {emp.phone && (
          <div className="flex items-center gap-1.5"><Phone size={11} />{emp.phone}</div>
        )}
        <div className="flex items-center gap-1.5"><Mail size={11} />{emp.email}</div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className={`badge text-[10px] ${emp.onboardingComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {emp.onboardingComplete ? "✓ Onboarded" : "In progress"}
        </span>
        <span className="text-xs font-medium text-slate-700">
          {formatPay(emp.payRate, emp.rateType)}
        </span>
      </div>
    </Card>
  )
}

function EmployeeRow({ emp }: { emp: Employee }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
      <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{emp.firstName} {emp.lastName}</p>
        <p className="text-xs text-slate-500">{emp.jobTitle}</p>
      </div>
      <span className={`badge hidden sm:inline-flex ${getDeptColor(emp.department)}`}>{emp.department}</span>
      <span className="text-xs text-slate-500 hidden md:block w-28 truncate">{emp.location}</span>
      <span className="text-xs font-medium text-slate-700 hidden lg:block w-24">{formatPay(emp.payRate, emp.rateType)}</span>
      {emp.connecteamAccount && (
        <span className="badge bg-amber-100 text-amber-800 hidden md:inline-flex items-center gap-1">
          <Zap size={9} /> {emp.connecteamAccount}
        </span>
      )}
      <span className={`badge text-[10px] ${emp.onboardingComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
        {emp.onboardingComplete ? "✓" : "…"}
      </span>
      <ChevronRight size={14} className="text-slate-300" />
    </div>
  )
}
