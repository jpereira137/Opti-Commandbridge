"use client"

import { UserPlus, Clock, FileCheck, CheckCircle2 } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, Avatar, ProgressBar } from "@/components/ui"
import { MOCK_EMPLOYEES } from "@/lib/data"

export default function OnboardingPage() {
  const newHires = MOCK_EMPLOYEES.filter(e => !e.onboardingComplete)

  return (
    <div className="animate-in">
      <Header
        title="Payroll Onboarding"
        subtitle={`${newHires.length} employees in progress`}
        actions={
          <Button variant="primary" size="sm"><UserPlus size={14} /> Start new hire</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "In progress", value: newHires.length, icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Completed this month", value: 3, icon: CheckCircle2, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Awaiting docs", value: 1, icon: FileCheck, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Total onboarded", value: MOCK_EMPLOYEES.filter(e => e.onboardingComplete).length, icon: UserPlus, color: "bg-slate-50 text-slate-600 border-slate-200" },
          ].map(s => (
            <Card key={s.label} className={`p-4 border ${s.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-2xl font-bold font-display">{s.value}</p>
            </Card>
          ))}
        </div>

        {/* In-progress table */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Onboarding in progress</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {newHires.map(emp => (
              <div key={emp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-slate-500">{emp.jobTitle} · {emp.department}</p>
                </div>
                <div className="w-32 hidden sm:block">
                  <ProgressBar value={emp.checklistProgress || 0} max={100} size="sm" />
                  <p className="text-[10px] text-slate-400 mt-1">{emp.checklistProgress || 0}% complete</p>
                </div>
                <span className={`badge text-[10px] ${emp.i9Verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {emp.i9Verified ? "I-9 verified" : "I-9 pending"}
                </span>
                <Button variant="secondary" size="sm">Continue</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
