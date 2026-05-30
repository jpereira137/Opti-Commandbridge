"use client"

import { Clock, Check, AlertCircle } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, Avatar } from "@/components/ui"
import { MOCK_TIME_ENTRIES, getStatusColor } from "@/lib/data"

export default function TimeTrackingPage() {
  const activeEntries = MOCK_TIME_ENTRIES.filter(t => t.status === "active")
  const pendingApproval = MOCK_TIME_ENTRIES.filter(t => t.status === "pending")
  const approved = MOCK_TIME_ENTRIES.filter(t => t.status === "approved")

  return (
    <div className="animate-in">
      <Header
        title="Time Tracking"
        subtitle="Review and approve employee timesheets"
        notificationCount={pendingApproval.length}
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Currently clocked in", value: activeEntries.length, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Pending approval", value: pendingApproval.length, color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Approved today", value: approved.length, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Total hours today", value: MOCK_TIME_ENTRIES.reduce((s, t) => s + (t.hours || 0), 0).toFixed(1), color: "bg-slate-50 text-slate-600 border-slate-200" },
          ].map(s => (
            <Card key={s.label} className={`p-4 border ${s.color}`}>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Active clocks */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-green-600" />
              Currently clocked in
            </h3>
            <span className="badge bg-green-100 text-green-700">{activeEntries.length} active</span>
          </div>
          <div className="divide-y divide-slate-50">
            {activeEntries.map(entry => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <Avatar name={entry.employeeName} size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{entry.employeeName}</p>
                  <p className="text-xs text-slate-500">Clocked in at {entry.clockIn}</p>
                </div>
                <span className={`badge ${getStatusColor(entry.status)} capitalize`}>{entry.status}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending approval */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              Pending approval
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingApproval.map(entry => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <Avatar name={entry.employeeName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{entry.employeeName}</p>
                  <p className="text-xs text-slate-500">{entry.date} · {entry.clockIn} – {entry.clockOut}</p>
                </div>
                <p className="text-sm font-medium text-slate-700">{entry.hours?.toFixed(1)}h</p>
                <Button variant="primary" size="sm"><Check size={12} /> Approve</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
