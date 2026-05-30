"use client"

import { useState, useEffect, useCallback } from "react"
import { Zap, RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Users, Clock, Calendar, Settings, Loader2, XCircle } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button, InfoBox } from "@/components/ui"
import { MOCK_CONNECTEAM_STATUS, MOCK_EMPLOYEES, MOCK_SHIFTS, MOCK_TIME_ENTRIES } from "@/lib/data"
import { formatDistanceToNow } from "date-fns"

interface ApiStatus {
  accountA: { configured: boolean; envVar: string }
  accountB: { configured: boolean; envVar: string }
  allConfigured: boolean
}

interface SyncResult {
  account: "A" | "B"
  status: "connected" | "error" | "rate_limited"
  users: Array<{ id: string; firstName: string; lastName: string; email: string }>
  shifts: Array<{ id: string; userId: string; startTime: string; endTime: string }>
  timeEntries: Array<{ id: string; userId: string; clockIn: string; clockOut?: string; status: string; hours?: number }>
  timeClocks: Array<{ id: number; name: string; isArchived: boolean }>
  schedulers: Array<{ schedulerId: number; name: string; isArchived: boolean; timezone: string }>
  lastSync: string
  error?: string
}

export default function ConnecteamPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [syncResults, setSyncResults] = useState<SyncResult[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fallback to mock data when API isn't connected
  const acctA = MOCK_EMPLOYEES.filter(e => e.connecteamAccount === "A")
  const acctB = MOCK_EMPLOYEES.filter(e => e.connecteamAccount === "B")
  const activeA = MOCK_TIME_ENTRIES.filter(t => t.connecteamAccount === "A" && t.status === "active")
  const activeB = MOCK_TIME_ENTRIES.filter(t => t.connecteamAccount === "B" && t.status === "active")

  const checkApiStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/connecteam/status")
      const data = await res.json()
      setApiStatus(data)
    } catch (error) {
      console.error("[v0] Failed to check API status:", error)
    }
  }, [])

  const syncData = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch("/api/connecteam/sync", { method: "POST" })
      const data = await res.json()
      if (data.accounts) {
        setSyncResults(data.accounts)
        setLastSyncTime(new Date())
      }
    } catch (error) {
      console.error("[v0] Failed to sync:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await checkApiStatus()
      setIsLoading(false)
      setMounted(true)
    }
    init()
  }, [checkApiStatus])
  
  const formatSyncTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr)) + " ago"
  }

  // Get data for each account - use API data if available, fallback to mock
  const getAccountData = (account: "A" | "B") => {
    const apiResult = syncResults.find(r => r.account === account)
    const mockStatus = MOCK_CONNECTEAM_STATUS.find(s => s.account === account)
    const mockEmps = account === "A" ? acctA : acctB
    const mockActive = account === "A" ? activeA : activeB
    const mockShifts = MOCK_SHIFTS.filter(s => s.connecteamAccount === account)

    if (apiResult && apiResult.status === "connected") {
      return {
        status: "connected" as const,
        users: apiResult.users,
        employeeCount: apiResult.users.length,
        activeCount: apiResult.timeEntries.filter(t => t.status === "active").length,
        shiftsToday: apiResult.shifts.filter(s => s.startTime.startsWith(new Date().toISOString().split("T")[0])).length,
        totalShifts: apiResult.shifts.length,
        totalTimeEntries: apiResult.timeEntries.length,
        timeClocks: apiResult.timeClocks || [],
        schedulers: apiResult.schedulers || [],
        lastSync: apiResult.lastSync,
        isLive: true,
        error: undefined,
      }
    }

    if (apiResult && (apiResult.status === "error" || apiResult.status === "rate_limited")) {
      return {
        status: apiResult.status as "error" | "rate_limited",
        users: [],
        employeeCount: 0,
        activeCount: 0,
        shiftsToday: 0,
        totalShifts: 0,
        totalTimeEntries: 0,
        timeClocks: [],
        schedulers: [],
        lastSync: apiResult.lastSync,
        isLive: false,
        error: apiResult.error,
      }
    }

    // Fallback to mock data
    return {
      status: (mockStatus?.status || "connected") as "connected" | "error" | "rate_limited",
      users: mockEmps.map(e => ({ id: e.id, firstName: e.firstName, lastName: e.lastName, email: e.email })),
      employeeCount: mockEmps.length,
      activeCount: mockActive.length,
      shiftsToday: mockShifts.filter(s => s.date === new Date().toISOString().split("T")[0]).length,
      totalShifts: mockShifts.length,
      totalTimeEntries: mockActive.length,
      timeClocks: [],
      schedulers: [],
      lastSync: mockStatus?.lastSync || new Date().toISOString(),
      isLive: false,
      error: undefined,
    }
  }

  if (isLoading) {
    return (
      <div className="animate-in flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
      </div>
    )
  }

  return (
    <div className="animate-in">
      <Header
        title="Connecteam Integration"
        subtitle="Live data from both Connecteam accounts pulled into CommandBridge"
        actions={
          <Button 
            variant="primary" 
            size="sm" 
            onClick={syncData}
            disabled={isSyncing}
          >
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {isSyncing ? "Syncing..." : "Sync now"}
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* API Status Banner */}
        {apiStatus && apiStatus.allConfigured ? (
          <InfoBox type="success" className="flex gap-2.5">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
            <span>
              Both Connecteam API keys are configured. 
              {lastSyncTime && mounted && ` Last synced ${formatDistanceToNow(lastSyncTime)} ago.`}
              {!lastSyncTime && " Click \"Sync now\" to fetch live data."}
            </span>
          </InfoBox>
        ) : apiStatus && (apiStatus.accountA.configured || apiStatus.accountB.configured) ? (
          <InfoBox type="warning" className="flex gap-2.5">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <span>
              Only {apiStatus.accountA.configured ? "Account A" : "Account B"} API key is configured. 
              Add the missing key in your Vercel environment variables.
            </span>
          </InfoBox>
        ) : (
          <InfoBox type="info" className="flex gap-2.5">
            <Zap size={14} className="flex-shrink-0 mt-0.5 text-blue-600" />
            <span>
              Connecteam API keys not configured. Add <code className="font-mono bg-blue-100 px-1 rounded text-[11px]">CONNECTEAM_API_KEY_1</code> and <code className="font-mono bg-blue-100 px-1 rounded text-[11px]">CONNECTEAM_API_KEY_2</code> to your Vercel environment variables.
              Currently showing demo data.
            </span>
          </InfoBox>
        )}

        {/* Two account cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(["A", "B"] as const).map(account => {
            const data = getAccountData(account)
            const mockStatus = MOCK_CONNECTEAM_STATUS.find(s => s.account === account)
            const isConfigured = apiStatus ? (account === "A" ? apiStatus.accountA.configured : apiStatus.accountB.configured) : false

            return (
              <Card key={account} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Zap size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Connecteam — Account {account}</h3>
                      <p className="text-xs text-slate-500">{mockStatus?.department || (account === "A" ? "Providence operations" : "Boston operations")}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                    data.status === "connected" 
                      ? "bg-green-100 text-green-700" 
                      : data.status === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {data.status === "connected" ? (
                      <CheckCircle2 size={11} />
                    ) : data.status === "error" ? (
                      <XCircle size={11} />
                    ) : (
                      <AlertCircle size={11} />
                    )}
                    {data.isLive ? "Live" : isConfigured ? data.status : "Demo"}
                  </div>
                </div>

                {data.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <strong>Error:</strong> {data.error}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Employees", value: data.employeeCount, icon: Users },
                    { label: "Clocked in", value: data.activeCount, icon: Clock },
                    { label: "Shifts (7 days)", value: data.totalShifts, icon: Calendar },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <m.icon size={14} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-slate-800 font-display">{m.value}</p>
                      <p className="text-[10px] text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Time Clocks & Schedulers */}
                {data.isLive && (data.timeClocks.length > 0 || data.schedulers.length > 0) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 mb-2">Connected Resources</p>
                    {data.timeClocks.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] text-blue-600 font-medium">Time Clocks:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.timeClocks.filter(tc => !tc.isArchived).map(tc => (
                            <span key={tc.id} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {tc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {data.schedulers.length > 0 && (
                      <div>
                        <p className="text-[10px] text-blue-600 font-medium">Schedulers:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.schedulers.filter(s => !s.isArchived).map(s => (
                            <span key={s.schedulerId} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Employee list */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Employees on this account {!data.isLive && "(Demo)"}
                  </p>
                  {data.users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-navy-100 text-navy-800 text-[10px] font-bold flex items-center justify-center">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${data.activeCount > 0 ? "bg-green-500" : "bg-slate-200"}`} />
                    </div>
                  ))}
                  {data.users.length > 5 && (
                    <p className="text-xs text-slate-400 pt-2">+{data.users.length - 5} more employees</p>
                  )}
                  {data.users.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 text-center">No employees found</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>
                    {data.isLive ? "Live data" : "Demo data"} · Last synced {formatSyncTime(data.lastSync)}
                  </span>
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
            API Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["A", "B"] as const).map(acc => {
              const isConfigured = apiStatus ? (acc === "A" ? apiStatus.accountA.configured : apiStatus.accountB.configured) : false
              const envVar = acc === "A" ? "CONNECTEAM_API_KEY_1" : "CONNECTEAM_API_KEY_2"
              
              return (
                <div key={acc} className={`p-4 rounded-xl border ${isConfigured ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-600">Account {acc} — API key</p>
                    {isConfigured ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-green-700">
                        <CheckCircle2 size={10} /> Configured
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <AlertCircle size={10} /> Not set
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={isConfigured ? "••••••••••••••••••••••••" : ""}
                      placeholder="Not configured"
                      readOnly
                      className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Environment variable: <code className="font-mono bg-slate-100 px-1 rounded">{envVar}</code>
                  </p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>How to configure:</strong>
            <ol className="mt-2 space-y-1 list-decimal list-inside">
              <li>Log into Connecteam → Settings → API & Webhooks → Generate new API key</li>
              <li>In v0, click the settings icon (top right) → Vars</li>
              <li>Add <code className="font-mono bg-amber-100 px-1 rounded">CONNECTEAM_API_KEY_1</code> for Account A</li>
              <li>Add <code className="font-mono bg-amber-100 px-1 rounded">CONNECTEAM_API_KEY_2</code> for Account B</li>
              <li>Click "Sync now" to fetch live data</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  )
}
