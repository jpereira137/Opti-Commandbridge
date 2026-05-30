import { NextResponse } from "next/server"
import { syncAllAccounts, syncAccount, hasApiKey, type ConnecteamAccount } from "@/lib/connecteam"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const account = searchParams.get("account") as ConnecteamAccount | null

  try {
    if (account) {
      // Sync single account
      if (!hasApiKey(account)) {
        return NextResponse.json(
          { error: `No API key configured for account ${account}` },
          { status: 400 }
        )
      }
      const result = await syncAccount(account)
      return NextResponse.json(result)
    }

    // Sync both accounts
    const results = await syncAllAccounts()
    return NextResponse.json({ accounts: results })
  } catch (error) {
    console.error("[Connecteam API] Sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Force sync endpoint
  try {
    const results = await syncAllAccounts()
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
  }
}
