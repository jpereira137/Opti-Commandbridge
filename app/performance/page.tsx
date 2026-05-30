"use client"

import { Star, TrendingUp } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Avatar } from "@/components/ui"
import { MOCK_REVIEWS, MOCK_EMPLOYEES, getStatusColor } from "@/lib/data"

export default function PerformancePage() {
  return (
    <div className="animate-in">
      <Header
        title="Performance"
        subtitle="Track employee performance and reviews"
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending reviews", value: MOCK_REVIEWS.filter(r => r.status === "draft").length, color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Submitted", value: MOCK_REVIEWS.filter(r => r.status === "submitted").length, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Acknowledged", value: MOCK_REVIEWS.filter(r => r.status === "acknowledged").length, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Avg rating", value: "3.5", color: "bg-slate-50 text-slate-600 border-slate-200" },
          ].map(s => (
            <Card key={s.label} className={`p-4 border ${s.color}`}>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Reviews table */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              Recent reviews
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_REVIEWS.map(review => {
              const emp = MOCK_EMPLOYEES.find(e => e.id === review.employeeId)
              if (!emp) return null
              return (
                <div key={review.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500">{review.period}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className={i <= review.overallRating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className={`badge ${getStatusColor(review.status)} capitalize`}>{review.status}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
