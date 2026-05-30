"use client"

import { useState } from "react"
import { CalendarCheck, Plus, Check, X } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, Avatar, EmptyState } from "@/components/ui"
import { MOCK_PTO_REQUESTS, MOCK_PTO_BALANCES, MOCK_EMPLOYEES, getStatusColor } from "@/lib/data"

const TYPE_COLORS: Record<string,string> = {
  vacation:    "bg-blue-100 text-blue-800",
  sick:        "bg-red-100 text-red-800",
  personal:    "bg-purple-100 text-purple-800",
  bereavement: "bg-gray-100 text-gray-700",
  unpaid:      "bg-orange-100 text-orange-800",
}

export default function PTOPage() {
  const [requests, setRequests] = useState(MOCK_PTO_REQUESTS)
  const [filter, setFilter] = useState<"all"|"pending"|"approved"|"denied">("all")

  const filtered = requests.filter(r => filter === "all" || r.status === filter)
  const pending = requests.filter(r => r.status === "pending").length

  const approve = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as const } : r))
  const deny = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "denied" as const } : r))

  return (
    <div className="animate-in">
      <Header
        title="PTO & Leave"
        subtitle="Manage time-off requests and balances"
        notificationCount={pending}
        actions={
          <Button variant="primary" size="sm"><Plus size={14} /> New request</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: requests.filter(r=>r.status==="pending").length, color: "bg-amber-50 border-amber-200 text-amber-700" },
            { label: "Approved this month", value: requests.filter(r=>r.status==="approved").length, color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Total days out", value: requests.filter(r=>r.status==="approved").reduce((s,r)=>s+r.days,0), color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Denied", value: requests.filter(r=>r.status==="denied").length, color: "bg-red-50 border-red-200 text-red-700" },
          ].map(s => (
            <Card key={s.label} className={`p-4 border ${s.color.split(" ").slice(1).join(" ")}`}>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* PTO Balances */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Employee PTO balances — 2026</h3>
          <div className="space-y-3">
            {MOCK_PTO_BALANCES.map(bal => {
              const emp = MOCK_EMPLOYEES.find(e => e.id === bal.employeeId)
              if (!emp) return null
              const usedPct = Math.round((bal.usedDays / Math.max(bal.totalDays, 1)) * 100)
              return (
                <div key={bal.employeeId} className="flex items-center gap-4">
                  <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                  <div className="w-28 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{emp.firstName} {emp.lastName}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{bal.usedDays} used</span>
                      <span>{bal.remainingDays} remaining of {bal.totalDays}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${usedPct > 80 ? "bg-red-500" : "bg-blue-500"}`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                  {bal.pendingDays > 0 && (
                    <span className="badge bg-amber-100 text-amber-700 text-[10px] whitespace-nowrap">+{bal.pendingDays}d pending</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Requests table */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Leave requests</h3>
            <div className="flex gap-1">
              {(["all","pending","approved","denied"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`h-7 px-3 text-xs font-medium rounded-lg capitalize transition-all ${
                    filter === f ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={CalendarCheck} title="No requests found" description="No leave requests match the selected filter." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(req => (
                <div key={req.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <Avatar name={req.employeeName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{req.employeeName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.note}</p>
                  </div>
                  <span className={`badge ${TYPE_COLORS[req.type] || "bg-gray-100 text-gray-700"} capitalize`}>{req.type}</span>
                  <div className="text-xs text-slate-500 text-right hidden sm:block w-32">
                    <p>{req.startDate}</p>
                    {req.endDate !== req.startDate && <p className="text-slate-400">to {req.endDate}</p>}
                    <p className="font-medium text-slate-700">{req.days} day{req.days > 1 ? "s" : ""}</p>
                  </div>
                  <span className={`badge ${getStatusColor(req.status)} capitalize`}>{req.status}</span>
                  {req.status === "pending" && (
                    <div className="flex gap-1.5">
                      <button onClick={() => approve(req.id)}
                        className="w-7 h-7 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center transition-colors">
                        <Check size={13} />
                      </button>
                      <button onClick={() => deny(req.id)}
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
