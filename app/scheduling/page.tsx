"use client"

import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, Avatar } from "@/components/ui"
import { MOCK_SHIFTS, getStatusColor } from "@/lib/data"

export default function SchedulingPage() {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const todayShifts = MOCK_SHIFTS.filter(s => s.date === todayStr)

  return (
    <div className="animate-in">
      <Header
        title="Scheduling"
        subtitle="Manage employee shifts and schedules"
        actions={
          <Button variant="primary" size="sm"><Plus size={14} /> Add shift</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Week navigation */}
        <Card className="p-4 flex items-center justify-between">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft size={18} className="text-slate-500" />
          </button>
          <div className="text-center">
            <h3 className="font-semibold text-slate-800">
              {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <p className="text-xs text-slate-500">Week of {today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight size={18} className="text-slate-500" />
          </button>
        </Card>

        {/* Today&apos;s shifts */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-600" />
              Today&apos;s shifts
            </h3>
            <span className="badge bg-blue-100 text-blue-700">{todayShifts.length} scheduled</span>
          </div>
          {todayShifts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <CalendarDays size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No shifts scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {todayShifts.map(shift => (
                <div key={shift.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <Avatar name={shift.employeeName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{shift.employeeName}</p>
                    <p className="text-xs text-slate-500">{shift.department} · {shift.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{shift.startTime} – {shift.endTime}</p>
                  </div>
                  <span className={`badge ${getStatusColor(shift.status)} capitalize`}>{shift.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
