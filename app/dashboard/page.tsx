"use client"

import {
  Users, UserPlus, Clock, CalendarCheck, Star, FileText,
  Megaphone, AlertTriangle, CheckCircle2, Zap, TrendingUp,
  Calendar, ArrowRight, RefreshCw
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import { MetricCard, Card, Badge, Avatar, Button, ProgressBar, StatusDot } from "@/components/ui"
import {
  MOCK_EMPLOYEES, MOCK_PTO_REQUESTS, MOCK_ANNOUNCEMENTS,
  MOCK_TIME_ENTRIES, MOCK_SHIFTS, MOCK_CONNECTEAM_STATUS,
  getDashboardMetrics, getStatusColor, formatPay
} from "@/lib/data"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const metrics = getDashboardMetrics()
  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })
  const activeEntries = MOCK_TIME_ENTRIES.filter(t => t.status === "active")
  const pendingPTO = MOCK_PTO_REQUESTS.filter(r => r.status === "pending")
  const incompleteOnboarding = MOCK_EMPLOYEES.filter(e => !e.onboardingComplete)
  const todayShifts = MOCK_SHIFTS.filter(s => s.date === new Date().toISOString().split("T")[0])

  return (
    <div className="animate-in">
      <Header
        title="CommandBridge"
        subtitle={today}
        notificationCount={metrics.pendingPTO + metrics.documentsToSign}
        actions={
          <Button variant="primary" size="sm">
            <UserPlus size={14} /> New hire
          </Button>
        }
      />

      <div className="p-6 space-y-6">

        {/* Welcome banner */}
        <div className="bg-navy-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold font-display text-lg">Good morning, Alex 👋</h2>
            <p className="text-white/60 text-sm mt-0.5">
              You have <span className="text-white font-medium">{metrics.pendingPTO} PTO requests</span> and <span className="text-white font-medium">{metrics.documentsToSign} document</span> awaiting your action.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Link href="/pto">
              <Button variant="secondary" size="sm">Review PTO</Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="secondary" size="sm">Onboard hire</Button>
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total employees" value={metrics.totalEmployees} icon={Users} color="blue" change="+1 this month" changePositive />
          <MetricCard label="Clocked in now" value={activeEntries.length} icon={Clock} color="green" />
          <MetricCard label="Pending PTO" value={metrics.pendingPTO} icon={CalendarCheck} color="amber" />
          <MetricCard label="Onboarding" value={metrics.pendingOnboarding} icon={UserPlus} color="red" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Shifts today" value={todayShifts.length} icon={Calendar} color="blue" />
          <MetricCard label="Open reviews" value={metrics.upcomingReviews} icon={Star} color="purple" />
          <MetricCard label="Docs to sign" value={metrics.documentsToSign} icon={FileText} color="amber" />
          <MetricCard label="Announcements" value={metrics.announcements} icon={Megaphone} color="blue" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Activity + Onboarding */}
          <div className="lg:col-span-2 space-y-6">

            {/* Currently clocked in */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Clock size={16} className="text-green-600" />
                  Clocked in today
                </h3>
                <Link href="/time-tracking" className="text-xs text-navy-700 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={11} />
                </Link>
              </div>
              {activeEntries.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No one clocked in right now</p>
              ) : (
                <div className="space-y-3">
                  {activeEntries.map(entry => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <Avatar name={entry.employeeName} size="sm" className="bg-green-100 text-green-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{entry.employeeName}</p>
                        <p className="text-xs text-slate-500">Clocked in {entry.clockIn}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                        <StatusDot status="active" />
                        Live
                      </div>
                      <span className="badge bg-green-100 text-green-800">{entry.connecteamAccount === "A" ? "Acct A" : "Acct B"}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Pending PTO */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <CalendarCheck size={16} className="text-amber-600" />
                  PTO requests pending approval
                </h3>
                <Link href="/pto" className="text-xs text-navy-700 hover:underline flex items-center gap-1">
                  Manage all <ArrowRight size={11} />
                </Link>
              </div>
              {pendingPTO.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No pending PTO requests</p>
              ) : (
                <div className="space-y-2">
                  {pendingPTO.map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <Avatar name={req.employeeName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{req.employeeName}</p>
                        <p className="text-xs text-slate-500 capitalize">
                          {req.type} · {req.startDate} – {req.endDate} · {req.days}d
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="h-7 px-3 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Approve</button>
                        <button className="h-7 px-3 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Deny</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Onboarding in progress */}
            {incompleteOnboarding.length > 0 && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <UserPlus size={16} className="text-red-600" />
                    Onboarding in progress
                  </h3>
                  <Link href="/onboarding" className="text-xs text-navy-700 hover:underline flex items-center gap-1">
                    View all <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {incompleteOnboarding.map(emp => {
                    const pct = Math.round(((emp.checklistProgress || 0) / 18) * 100)
                    return (
                      <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                        <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-500 mb-1.5">{emp.jobTitle} · {emp.department}</p>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={pct} color={pct < 50 ? "red" : "amber"} className="flex-1" />
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{emp.checklistProgress}/18</span>
                          </div>
                        </div>
                        {!emp.i9Verified && (
                          <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertTriangle size={9} /> I-9
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right: Connecteam status + Announcements + Today's shifts */}
          <div className="space-y-6">

            {/* Connecteam sync */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Zap size={15} className="text-amber-600" />
                  Connecteam sync
                </h3>
                <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                  <RefreshCw size={11} /> Sync now
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_CONNECTEAM_STATUS.map(ct => (
                  <div key={ct.account} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ct.status === "connected" ? "bg-green-500" : "bg-red-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">Account {ct.account}</p>
                      <p className="text-[11px] text-slate-500 truncate">{ct.department}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ct.employeeCount} employees · synced {formatDistanceToNow(new Date(ct.lastSync))} ago
                      </p>
                    </div>
                    <span className={`badge ${ct.status === "connected" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {ct.status}
                    </span>
                  </div>
                ))}
                <Link href="/connecteam" className="block text-center text-xs text-navy-700 hover:underline pt-1">
                  Manage integration →
                </Link>
              </div>
            </Card>

            {/* Today's schedule */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar size={15} className="text-blue-600" />
                  Today's shifts
                </h3>
                <Link href="/scheduling" className="text-xs text-navy-700 hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {todayShifts.slice(0,4).map(shift => (
                  <div key={shift.id} className="flex items-center gap-2.5 py-1.5 border-b border-slate-50 last:border-0">
                    <Avatar name={shift.employeeName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{shift.employeeName}</p>
                      <p className="text-[10px] text-slate-400">{shift.startTime}–{shift.endTime}</p>
                    </div>
                    <span className={`badge text-[10px] ${getStatusColor(shift.status)}`}>
                      {shift.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Latest announcements */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Megaphone size={15} className="text-navy-700" />
                  Announcements
                </h3>
                <Link href="/announcements" className="text-xs text-navy-700 hover:underline">All</Link>
              </div>
              <div className="space-y-3">
                {MOCK_ANNOUNCEMENTS.slice(0,3).map(ann => (
                  <div key={ann.id} className="group cursor-pointer">
                    <div className="flex items-start gap-2">
                      {ann.pinned && <span className="text-red-600 flex-shrink-0 mt-0.5">📌</span>}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-navy-900 transition-colors line-clamp-1">{ann.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ann.authorName} · {new Date(ann.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>

        {/* Quick actions footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add new employee", href: "/onboarding", icon: UserPlus, color: "bg-navy-900 text-white" },
            { label: "Approve PTO requests", href: "/pto", icon: CalendarCheck, color: "bg-amber-50 text-amber-800 border border-amber-200" },
            { label: "View reports", href: "/reports", icon: TrendingUp, color: "bg-blue-50 text-blue-800 border border-blue-200" },
            { label: "Post announcement", href: "/announcements", icon: Megaphone, color: "bg-slate-100 text-slate-700" },
          ].map(action => (
            <Link key={action.href} href={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-all hover:opacity-90 ${action.color}`}
            >
              <action.icon size={16} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
