"use client"

import { BarChart3, TrendingUp, Users, Clock, Calendar } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, MetricCard } from "@/components/ui"
import { MOCK_EMPLOYEES, MOCK_TIME_ENTRIES, MOCK_SHIFTS, getDashboardMetrics } from "@/lib/data"

export default function AnalyticsPage() {
  const metrics = getDashboardMetrics()
  const hourlyEmps = MOCK_EMPLOYEES.filter(e => e.rateType === "Hourly")
  const salaryEmps = MOCK_EMPLOYEES.filter(e => e.rateType !== "Hourly")

  return (
    <div className="animate-in">
      <Header
        title="Analytics"
        subtitle="Workforce insights and metrics"
      />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total employees" value={metrics.totalEmployees} icon={Users} color="blue" />
          <MetricCard label="Hourly workers" value={hourlyEmps.length} icon={Clock} color="green" />
          <MetricCard label="Salaried staff" value={salaryEmps.length} icon={TrendingUp} color="purple" />
          <MetricCard label="Shifts this week" value={MOCK_SHIFTS.length} icon={Calendar} color="amber" />
        </div>

        {/* Charts placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              Headcount by department
            </h3>
            <div className="space-y-3">
              {Object.entries(
                MOCK_EMPLOYEES.reduce((acc, e) => {
                  acc[e.department] = (acc[e.department] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-24">{dept}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / MOCK_EMPLOYEES.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-6">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              Hours logged this week
            </h3>
            <div className="space-y-3">
              {MOCK_TIME_ENTRIES.filter(t => t.hours).slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-32 truncate">{entry.employeeName}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${((entry.hours || 0) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10">{entry.hours?.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
