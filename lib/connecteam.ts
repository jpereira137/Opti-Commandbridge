// Connecteam API integration
// Uses API keys stored in environment variables: CONNECTEAM_API_KEY_1 and CONNECTEAM_API_KEY_2

const BASE_URL = "https://api.connecteam.com"

export type ConnecteamAccount = "A" | "B"

export interface ConnecteamUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role?: string
  status?: string
  createdAt?: string
}

export interface ConnecteamShift {
  id: string
  userId: string
  startTime: string
  endTime: string
  jobTitle?: string
  location?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
}

export interface ConnecteamTimeEntry {
  id: string
  userId: string
  clockIn: string
  clockOut?: string
  totalHours?: number
  status: "active" | "completed"
}

export interface ConnecteamSyncResult {
  account: ConnecteamAccount
  status: "connected" | "error" | "rate_limited"
  users: ConnecteamUser[]
  shifts: ConnecteamShift[]
  timeEntries: ConnecteamTimeEntry[]
  lastSync: string
  error?: string
}

function getApiKey(account: ConnecteamAccount): string | undefined {
  return account === "A" 
    ? process.env.CONNECTEAM_API_KEY_1 
    : process.env.CONNECTEAM_API_KEY_2
}

async function fetchFromConnecteam<T>(
  endpoint: string, 
  apiKey: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Connecteam API error (${response.status}): ${errorText}`)
  }

  return response.json()
}

export async function getUsers(account: ConnecteamAccount): Promise<ConnecteamUser[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const data = await fetchFromConnecteam<{ data: ConnecteamUser[] }>(
      "/users/v1/users",
      apiKey
    )
    return data.data || []
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch users for account ${account}:`, error)
    throw error
  }
}

export async function getShifts(account: ConnecteamAccount, startDate?: string, endDate?: string): Promise<ConnecteamShift[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  const params = new URLSearchParams()
  if (startDate) params.set("start_date", startDate)
  if (endDate) params.set("end_date", endDate)

  try {
    const data = await fetchFromConnecteam<{ data: ConnecteamShift[] }>(
      `/scheduler/v1/shifts?${params.toString()}`,
      apiKey
    )
    return data.data || []
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch shifts for account ${account}:`, error)
    throw error
  }
}

export async function getTimeEntries(account: ConnecteamAccount, startDate?: string, endDate?: string): Promise<ConnecteamTimeEntry[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  const params = new URLSearchParams()
  if (startDate) params.set("start_date", startDate)
  if (endDate) params.set("end_date", endDate)

  try {
    const data = await fetchFromConnecteam<{ data: ConnecteamTimeEntry[] }>(
      `/timeclock/v1/entries?${params.toString()}`,
      apiKey
    )
    return data.data || []
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch time entries for account ${account}:`, error)
    throw error
  }
}

export async function syncAccount(account: ConnecteamAccount): Promise<ConnecteamSyncResult> {
  const apiKey = getApiKey(account)
  
  if (!apiKey) {
    return {
      account,
      status: "error",
      users: [],
      shifts: [],
      timeEntries: [],
      lastSync: new Date().toISOString(),
      error: `No API key configured for account ${account}`,
    }
  }

  try {
    // Fetch all data in parallel
    const today = new Date().toISOString().split("T")[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const weekAhead = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const [users, shifts, timeEntries] = await Promise.all([
      getUsers(account),
      getShifts(account, today, weekAhead),
      getTimeEntries(account, weekAgo, today),
    ])

    return {
      account,
      status: "connected",
      users,
      shifts,
      timeEntries,
      lastSync: new Date().toISOString(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return {
      account,
      status: message.includes("429") ? "rate_limited" : "error",
      users: [],
      shifts: [],
      timeEntries: [],
      lastSync: new Date().toISOString(),
      error: message,
    }
  }
}

export async function syncAllAccounts(): Promise<ConnecteamSyncResult[]> {
  const results = await Promise.all([
    syncAccount("A"),
    syncAccount("B"),
  ])
  return results
}

export function hasApiKey(account: ConnecteamAccount): boolean {
  return !!getApiKey(account)
}

export function getConfiguredAccounts(): ConnecteamAccount[] {
  const accounts: ConnecteamAccount[] = []
  if (process.env.CONNECTEAM_API_KEY_1) accounts.push("A")
  if (process.env.CONNECTEAM_API_KEY_2) accounts.push("B")
  return accounts
}
