"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import type { ConnecteamSyncResult, ConnecteamUser, ConnecteamShift, ConnecteamTimeEntry, ConnecteamTimeClock, ConnecteamScheduler } from "./connecteam"
import { MOCK_EMPLOYEES, MOCK_SHIFTS, MOCK_TIME_ENTRIES, MOCK_CONNECTEAM_STATUS, type Employee, type Shift, type TimeEntry } from "./data"

export interface ConnecteamData {
  // Raw API data
  accounts: ConnecteamSyncResult[]
  
  // Merged employee list (Connecteam users enriched with local data)
  employees: Employee[]
  
  // Shifts from Connecteam
  shifts: Shift[]
  
  // Time entries from Connecteam  
  timeEntries: TimeEntry[]
  
  // Time clocks and schedulers
  timeClocks: { account: "A" | "B"; clocks: ConnecteamTimeClock[] }[]
  schedulers: { account: "A" | "B"; schedulers: ConnecteamScheduler[] }[]
  
  // Status
  isLoading: boolean
  isSyncing: boolean
  lastSync: Date | null
  isLive: boolean
  
  // Actions
  sync: () => Promise<void>
  refresh: () => Promise<void>
}

const ConnecteamContext = createContext<ConnecteamData | null>(null)

function mergeConnecteamUsers(apiAccounts: ConnecteamSyncResult[]): Employee[] {
  const employees: Employee[] = []
  
  for (const account of apiAccounts) {
    if (account.status !== "connected" || account.users.length === 0) continue
    
    for (const user of account.users) {
      // Try to find matching mock employee to get additional data
      const mockMatch = MOCK_EMPLOYEES.find(
        e => e.email.toLowerCase() === user.email?.toLowerCase() ||
             (e.firstName.toLowerCase() === user.firstName.toLowerCase() && 
              e.lastName.toLowerCase() === user.lastName.toLowerCase())
      )
      
      employees.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "",
        phone: user.phone || mockMatch?.phone || "",
        role: mockMatch?.role || "employee",
        jobTitle: mockMatch?.jobTitle || user.role || "Employee",
        department: mockMatch?.department || (account.account === "A" ? "Operations" : "Support"),
        employmentType: mockMatch?.employmentType || "Full-time hourly",
        startDate: mockMatch?.startDate || new Date().toISOString().split("T")[0],
        status: (user.status === "active" ? "active" : "inactive") as "active" | "inactive" | "onboarding",
        manager: mockMatch?.manager || "—",
        location: mockMatch?.location || (account.account === "A" ? "Providence, RI" : "Boston, MA"),
        workLocation: mockMatch?.workLocation,
        payRate: mockMatch?.payRate || 20,
        rateType: mockMatch?.rateType || "Hourly",
        connecteamAccount: account.account,
        onboardingComplete: mockMatch?.onboardingComplete ?? true,
        checklistProgress: mockMatch?.checklistProgress,
        i9Verified: mockMatch?.i9Verified,
      })
    }
  }
  
  return employees
}

function mergeConnecteamShifts(apiAccounts: ConnecteamSyncResult[], employees: Employee[]): Shift[] {
  const shifts: Shift[] = []
  
  for (const account of apiAccounts) {
    if (account.status !== "connected") continue
    
    for (const shift of account.shifts) {
      const employee = employees.find(e => e.id === shift.userId)
      const startDate = new Date(shift.startTime)
      const endDate = new Date(shift.endTime)
      
      shifts.push({
        id: shift.id,
        employeeId: shift.userId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : "Unknown",
        date: startDate.toISOString().split("T")[0],
        startTime: startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        endTime: endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        department: employee?.department || (account.account === "A" ? "Operations" : "Support"),
        location: shift.location || employee?.location || "",
        status: shift.status === "completed" ? "completed" : "scheduled",
        connecteamAccount: account.account,
      })
    }
  }
  
  return shifts
}

function mergeConnecteamTimeEntries(apiAccounts: ConnecteamSyncResult[], employees: Employee[]): TimeEntry[] {
  const entries: TimeEntry[] = []
  
  for (const account of apiAccounts) {
    if (account.status !== "connected") continue
    
    for (const entry of account.timeEntries) {
      const employee = employees.find(e => e.id === entry.userId)
      const clockInDate = new Date(entry.clockIn)
      const clockOutDate = entry.clockOut ? new Date(entry.clockOut) : undefined
      
      entries.push({
        id: entry.id,
        employeeId: entry.userId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : "Unknown",
        date: clockInDate.toISOString().split("T")[0],
        clockIn: clockInDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        clockOut: clockOutDate?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        hours: entry.hours || entry.totalHours,
        status: entry.status,
        connecteamAccount: account.account,
      })
    }
  }
  
  return entries
}

export function ConnecteamProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ConnecteamSyncResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  
  const sync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch("/api/connecteam/sync", { method: "POST" })
      const data = await res.json()
      if (data.accounts) {
        setAccounts(data.accounts)
        setLastSync(new Date())
      }
    } catch (error) {
      console.error("Failed to sync Connecteam data:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [])
  
  const refresh = useCallback(async () => {
    await sync()
  }, [sync])
  
  // Auto-sync on mount
  useEffect(() => {
    const init = async () => {
      await sync()
      setIsLoading(false)
    }
    init()
  }, [sync])
  
  // Derive merged data
  const isLive = accounts.some(a => a.status === "connected" && a.users.length > 0)
  
  const employees = isLive 
    ? mergeConnecteamUsers(accounts) 
    : MOCK_EMPLOYEES
    
  const shifts = isLive 
    ? mergeConnecteamShifts(accounts, employees)
    : MOCK_SHIFTS
    
  const timeEntries = isLive
    ? mergeConnecteamTimeEntries(accounts, employees)
    : MOCK_TIME_ENTRIES
    
  const timeClocks = accounts.map(a => ({
    account: a.account,
    clocks: a.timeClocks || [],
  }))
  
  const schedulers = accounts.map(a => ({
    account: a.account,
    schedulers: a.schedulers || [],
  }))
  
  const value: ConnecteamData = {
    accounts,
    employees,
    shifts,
    timeEntries,
    timeClocks,
    schedulers,
    isLoading,
    isSyncing,
    lastSync,
    isLive,
    sync,
    refresh,
  }
  
  return (
    <ConnecteamContext.Provider value={value}>
      {children}
    </ConnecteamContext.Provider>
  )
}

export function useConnecteam(): ConnecteamData {
  const context = useContext(ConnecteamContext)
  if (!context) {
    throw new Error("useConnecteam must be used within a ConnecteamProvider")
  }
  return context
}

// Helper hook to get employees by account
export function useEmployeesByAccount(account?: "A" | "B") {
  const { employees } = useConnecteam()
  if (!account) return employees
  return employees.filter(e => e.connecteamAccount === account)
}

// Helper hook to get shifts by account
export function useShiftsByAccount(account?: "A" | "B") {
  const { shifts } = useConnecteam()
  if (!account) return shifts
  return shifts.filter(s => s.connecteamAccount === account)
}

// Helper hook to get time entries by account
export function useTimeEntriesByAccount(account?: "A" | "B") {
  const { timeEntries } = useConnecteam()
  if (!account) return timeEntries
  return timeEntries.filter(t => t.connecteamAccount === account)
}
