import { NextResponse } from "next/server"
import { syncAllAccounts, syncAccount, hasApiKey, type ConnecteamAccount } from "@/lib/connecteam"

// Server-side mutex to prevent concurrent sync requests
let syncInProgress = false
let lastSyncTime = 0
const MIN_SYNC_INTERVAL_MS = 60000 // Minimum 60 seconds between syncs

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const account = searchParams.get("account") as ConnecteamAccount | null

  // Check if sync is already in progress
  if (syncInProgress) {
    return NextResponse.json(
      { error: "Sync already in progress, please wait" },
      { status: 429 }
    )
  }

  // Check if we're respecting the minimum sync interval
  const timeSinceLastSync = Date.now() - lastSyncTime
  if (timeSinceLastSync < MIN_SYNC_INTERVAL_MS) {
    const waitTime = Math.ceil((MIN_SYNC_INTERVAL_MS - timeSinceLastSync) / 1000)
    return NextResponse.json(
      { error: `Please wait ${waitTime} seconds before syncing again` },
      { status: 429 }
    )
  }

  try {
    syncInProgress = true
    
    if (account) {
      // Sync single account
      if (!hasApiKey(account)) {
        return NextResponse.json(
          { error: `No API key configured for account ${account}` },
          { status: 400 }
        )
      }
      const result = await syncAccount(account)
      lastSyncTime = Date.now()
      return NextResponse.json(result)
    }

    // Sync both accounts
    const results = await syncAllAccounts()
    lastSyncTime = Date.now()
    return NextResponse.json({ accounts: results })
  } catch (error) {
    console.error("[Connecteam API] Sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync" },
      { status: 500 }
    )
  } finally {
    syncInProgress = false
  }
}

export async function POST(request: Request) {
  // Check if sync is already in progress
  if (syncInProgress) {
    return NextResponse.json(
      { error: "Sync already in progress, please wait" },
      { status: 429 }
    )
  }

  // Check if we're respecting the minimum sync interval
  const timeSinceLastSync = Date.now() - lastSyncTime
  if (timeSinceLastSync < MIN_SYNC_INTERVAL_MS) {
    const waitTime = Math.ceil((MIN_SYNC_INTERVAL_MS - timeSinceLastSync) / 1000)
    return NextResponse.json(
      { error: `Please wait ${waitTime} seconds before syncing again` },
      { status: 429 }
    )
  }

  // Force sync endpoint
  try {
    syncInProgress = true
    const results = await syncAllAccounts()
    lastSyncTime = Date.now()
    return NextResponse.json({ 
      success: true, 
      accounts: results,
      syncedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("[Connecteam API] Force sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync" },
      { status: 500 }
    )
  } finally {
    syncInProgress = false
  }
}
