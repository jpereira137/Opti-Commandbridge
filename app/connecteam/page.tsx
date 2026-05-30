"use client"

import { Zap, RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Users, Clock, Calendar, Settings } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, MetricCard, InfoBox } from "@/components/ui"
import { MOCK_CONNECTEAM_STATUS, MOCK_EMPLOYEES, MOCK_SHIFTS, MOCK_TIME_ENTRIES } from "@/lib/data"
import { formatDistanceToNow } from "date-fns"

export default function ConnecteamPage() {
  const acctA = MOCK_EMPLOYEES.filter(e => e.connecteamAccount === "A")
  const acctB = MOCK_EMPLOYEES.filter(e => e.connecteamAccount === "B")
  const activeA = MOCK_TIME_ENTRIES.filter(t => t.connecteamAccount === "A" && t.status === "active")
  const activeB = MOCK_TIME_ENTRIES.filter(t => t.connecteamAccount === "B" && t.status === "active")

  return (
    <div className="animate-in">
      <Header
        title="Connecteam integration"
        subtitle="Live data from both Connecteam accounts pulled into CommandBridge"
        actions={
          <Button variant="primary" size="sm"><RefreshCw size={14} /> Sync now</Button>
        }
      />

      <div className="p-6 space-y-6">
        <InfoBox type="info" className="flex gap-2.5">
          <Zap size={14} className="flex-shrink-0 mt-0.5 text-blue-600" />
          <span>CommandBridge pulls scheduling, time tracking, and employee data from both Connecteam accounts every 15 minutes. To configure API keys, go to Settings → Integrations.</span>
        </InfoBox>

        {/* Two account cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_CONNECTEAM_STATUS.map(ct => {
            const emps = ct.account === "A" ? acctA : acctB
            const active = ct.account === "A" ? activeA : activeB
            const shifts = MOCK_SHIFTS.filter(s => s.connecteamAccount === ct.account)
            return (
              <Card key={ct.account} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Zap size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Connecteam — Account {ct.account}</h3>
                      <p className="text-xs text-slate-500">{ct.department}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                    ct.status === "connected" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {ct.status === "connected" ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                    {ct.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Employees", value: ct.employeeCount, icon: Users },
                    { label: "Clocked in", value: active.length, icon: Clock },
                    { label: "Shifts today", value: shifts.filter(s => s.date === new Date().toISOString().split("T")[0]).length, icon: Calendar },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <m.icon size={14} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-slate-800 font-display">{m.value}</p>
                      <p className="text-[10px] text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Employee list */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees on this account</p>
                  {emps.map(emp => (
                    <div key={emp.id} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-navy-100 text-navy-800 text-[10px] font-bold flex items-center justify-center">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700">{emp.firstName} {emp.lastName}</p>
                        <p className="text-[10px] text-slate-400">{emp.jobTitle}</p>
                      </div>
                      {active.find(t => t.employeeId === emp.id) ? (
                        <span className="w-2 h-2 rounded-full bg-green-500 pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>Last synced {formatDistanceToNow(new Date(ct.lastSync))} ago</span>
                  <a href="https://app.connecteam.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-navy-700 hover:underline font-medium">
                    Open in Connecteam <ExternalLink size={10} />
                  </a>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Integration config */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Settings size={16} className="text-slate-500" />
            API configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["A","B"].map(acc => (
              <div key={acc} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-3">Account {acc} — API key</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="sk_connecteam_••••••••••••••••"
                    readOnly
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-mono"
                  />
                  <Button variant="secondary" size="sm">Edit</Button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Store your Connecteam API key in Supabase secrets → CONNECTEAM_KEY_{acc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>How to get your Connecteam API key:</strong> Log into Connecteam → Settings → API & Webhooks → Generate new API key. Add it to your Vercel environment variables as <code className="font-mono bg-amber-100 px-1 rounded">CONNECTEAM_API_KEY_A</code> and <code className="font-mono bg-amber-100 px-1 rounded">CONNECTEAM_API_KEY_B</code>.
          </div>
        </Card>
      </div>
    </div>
  )
}
