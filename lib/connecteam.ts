// Connecteam API integration
// Uses API keys stored in environment variables: CONNECTEAM_API_KEY_1 and CONNECTEAM_API_KEY_2

const BASE_URL = "https://api.connecteam.com"

// Rate limiting: delay between requests to avoid 429 errors
const REQUEST_DELAY_MS = 2000  // 2 seconds between requests
const MAX_RETRIES = 5
const RETRY_DELAY_MS = 10000   // Start with 10 second retry delay (exponential)

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

export interface ConnecteamTimeClock {
  id: number
  name: string
  isArchived: boolean
}

export interface ConnecteamScheduler {
  schedulerId: number
  name: string
  isArchived: boolean
  timezone: string
}

export interface ConnecteamShift {
  id: string
  shiftId?: number
  userId: string
  startTime: string
  endTime: string
  jobTitle?: string
  location?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
}

export interface ConnecteamTimeEntry {
  id: string
  activityId?: number
  userId: string
  clockIn: string
  clockOut?: string
  totalHours?: number
  hours?: number
  status: "active" | "completed" | "pending" | "approved"
}

export interface ConnecteamSyncResult {
  account: ConnecteamAccount
  status: "connected" | "error" | "rate_limited"
  users: ConnecteamUser[]
  shifts: ConnecteamShift[]
  timeEntries: ConnecteamTimeEntry[]
  timeClocks: ConnecteamTimeClock[]
  schedulers: ConnecteamScheduler[]
  lastSync: string
  error?: string
}

function getApiKey(account: ConnecteamAccount): string | undefined {
  return account === "A" 
    ? process.env.CONNECTEAM_API_KEY_1 
    : process.env.CONNECTEAM_API_KEY_2
}

// Helper to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchFromConnecteam<T>(
  endpoint: string, 
  apiKey: string,
  options?: RequestInit,
  retryCount = 0
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  console.log(`[Connecteam] Fetching: ${url}`)
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "X-API-KEY": apiKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  // Handle rate limiting with retry
  if (response.status === 429 && retryCount < MAX_RETRIES) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || String(RETRY_DELAY_MS / 1000), 10)
    const waitTime = (retryAfter * 1000) || (RETRY_DELAY_MS * Math.pow(2, retryCount))
    console.log(`[Connecteam] Rate limited, waiting ${waitTime}ms before retry ${retryCount + 1}/${MAX_RETRIES}`)
    await delay(waitTime)
    return fetchFromConnecteam<T>(endpoint, apiKey, options, retryCount + 1)
  }

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[Connecteam] API error (${response.status}):`, errorText)
    throw new Error(`Connecteam API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return data
}

// Test connection with /me endpoint
export async function testConnection(account: ConnecteamAccount): Promise<{ success: boolean; error?: string }> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    return { success: false, error: `No API key configured for account ${account}` }
  }

  try {
    await fetchFromConnecteam<unknown>("/me", apiKey)
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

export async function getUsers(account: ConnecteamAccount): Promise<ConnecteamUser[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const data = await fetchFromConnecteam<{ data?: { users?: Array<{
      userId: number
      firstName: string
      lastName: string
      email?: string
      phoneNumber?: string
      isActive: boolean
    }> } }>(
      "/users/v1/users",
      apiKey
    )
    
    const users = data.data?.users || []
    return users.map(u => ({
      id: String(u.userId),
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      phone: u.phoneNumber,
      status: u.isActive ? "active" : "inactive",
    }))
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch users for account ${account}:`, error)
    throw error
  }
}

export async function getTimeClocks(account: ConnecteamAccount): Promise<ConnecteamTimeClock[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const data = await fetchFromConnecteam<{ data?: { timeClocks?: Array<{
      id: number
      name: string
      isArchived: boolean
    }> } }>(
      "/time-clock/v1/time-clocks",
      apiKey
    )
    return data.data?.timeClocks || []
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch time clocks for account ${account}:`, error)
    throw error
  }
}

export async function getSchedulers(account: ConnecteamAccount): Promise<ConnecteamScheduler[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const data = await fetchFromConnecteam<{ data?: { schedulers?: Array<{
      schedulerId: number
      name: string
      isArchived: boolean
      timezone: string
    }> } }>(
      "/scheduler/v1/schedulers",
      apiKey
    )
    return data.data?.schedulers || []
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch schedulers for account ${account}:`, error)
    throw error
  }
}

export async function getTimeActivities(
  account: ConnecteamAccount, 
  timeClockId: number,
  startDate: string, 
  endDate: string
): Promise<ConnecteamTimeEntry[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
    })
    
    const data = await fetchFromConnecteam<{ data?: { timeActivities?: Array<{
      activityId: number
      userId: number
      clockInTimestamp?: number
      clockOutTimestamp?: number
      totalSeconds?: number
      activityType: string
    }> } }>(
      `/time-clock/v1/time-clocks/${timeClockId}/time-activities?${params.toString()}`,
      apiKey
    )
    
    const activities = data.data?.timeActivities || []
    return activities.map(a => ({
      id: String(a.activityId),
      activityId: a.activityId,
      userId: String(a.userId),
      clockIn: a.clockInTimestamp ? new Date(a.clockInTimestamp * 1000).toISOString() : "",
      clockOut: a.clockOutTimestamp ? new Date(a.clockOutTimestamp * 1000).toISOString() : undefined,
      totalHours: a.totalSeconds ? a.totalSeconds / 3600 : undefined,
      hours: a.totalSeconds ? a.totalSeconds / 3600 : undefined,
      status: a.clockOutTimestamp ? "completed" as const : "active" as const,
    }))
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch time activities for account ${account}:`, error)
    throw error
  }
}

export async function getShifts(
  account: ConnecteamAccount, 
  schedulerId: number,
  startTime: number, 
  endTime: number
): Promise<ConnecteamShift[]> {
  const apiKey = getApiKey(account)
  if (!apiKey) {
    throw new Error(`No API key configured for Connecteam account ${account}`)
  }

  try {
    const params = new URLSearchParams({
      startTime: String(startTime),
      endTime: String(endTime),
    })
    
    const data = await fetchFromConnecteam<{ data?: { shifts?: Array<{
      shiftId?: number
      id?: number
      userId?: number
      assignedUserIds?: number[]
      startTime: number
      endTime: number
      jobName?: string
      jobTitle?: string
      locationName?: string
      status?: string
    }> } }>(
      `/scheduler/v1/schedulers/${schedulerId}/shifts?${params.toString()}`,
      apiKey
    )
    
    const shifts = data.data?.shifts || []
    return shifts.map(s => ({
      id: String(s.shiftId || s.id || Math.random()),
      shiftId: s.shiftId || s.id,
      userId: String(s.userId || s.assignedUserIds?.[0] || ""),
      startTime: new Date(s.startTime * 1000).toISOString(),
      endTime: new Date(s.endTime * 1000).toISOString(),
      jobTitle: s.jobName || s.jobTitle,
      location: s.locationName,
      status: "scheduled" as const,
    }))
  } catch (error) {
    console.error(`[Connecteam] Failed to fetch shifts for account ${account}:`, error)
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
      timeClocks: [],
      schedulers: [],
      lastSync: new Date().toISOString(),
      error: `No API key configured for account ${account}`,
    }
  }

  try {
    // First, test the connection
    const connectionTest = await testConnection(account)
    if (!connectionTest.success) {
      return {
        account,
        status: "error",
        users: [],
        shifts: [],
        timeEntries: [],
        timeClocks: [],
        schedulers: [],
        lastSync: new Date().toISOString(),
        error: connectionTest.error,
      }
    }

    // Fetch data SEQUENTIALLY to avoid rate limiting
    // Add delay between each request
    await delay(REQUEST_DELAY_MS)
    const users = await getUsers(account).catch(e => { 
      console.error("[Connecteam] Users fetch failed:", e)
      return [] as ConnecteamUser[] 
    })
    
    await delay(REQUEST_DELAY_MS)
    const timeClocks = await getTimeClocks(account).catch(e => { 
      console.error("[Connecteam] Time clocks fetch failed:", e)
      return [] as ConnecteamTimeClock[] 
    })
    
    await delay(REQUEST_DELAY_MS)
    const schedulers = await getSchedulers(account).catch(e => { 
      console.error("[Connecteam] Schedulers fetch failed:", e)
      return [] as ConnecteamScheduler[] 
    })

    // Date ranges for time activities (YYYY-MM-DD format)
    const today = new Date()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const startDateStr = weekAgo.toISOString().split("T")[0]
    const endDateStr = today.toISOString().split("T")[0]

    // Unix timestamps for shifts (seconds)
    const weekAhead = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const startTimestamp = Math.floor(today.getTime() / 1000)
    const endTimestamp = Math.floor(weekAhead.getTime() / 1000)

    // Fetch time entries from all active time clocks SEQUENTIALLY
    const timeEntries: ConnecteamTimeEntry[] = []
    for (const tc of timeClocks.filter(tc => !tc.isArchived)) {
      await delay(REQUEST_DELAY_MS)
      try {
        const entries = await getTimeActivities(account, tc.id, startDateStr, endDateStr)
        timeEntries.push(...entries)
      } catch (e) {
        console.error(`[Connecteam] Time activities fetch failed for clock ${tc.id}:`, e)
      }
    }

    // Fetch shifts from all active schedulers SEQUENTIALLY
    const shifts: ConnecteamShift[] = []
    for (const s of schedulers.filter(s => !s.isArchived)) {
      await delay(REQUEST_DELAY_MS)
      try {
        const schShifts = await getShifts(account, s.schedulerId, startTimestamp, endTimestamp)
        shifts.push(...schShifts)
      } catch (e) {
        console.error(`[Connecteam] Shifts fetch failed for scheduler ${s.schedulerId}:`, e)
      }
    }

    return {
      account,
      status: "connected",
      users,
      shifts,
      timeEntries,
      timeClocks,
      schedulers,
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
      timeClocks: [],
      schedulers: [],
      lastSync: new Date().toISOString(),
      error: message,
    }
  }
}

export async function syncAllAccounts(): Promise<ConnecteamSyncResult[]> {
  // Sync accounts SEQUENTIALLY to avoid rate limiting
  const resultA = await syncAccount("A")
  await delay(REQUEST_DELAY_MS * 2) // Extra delay between accounts
  const resultB = await syncAccount("B")
  return [resultA, resultB]
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
