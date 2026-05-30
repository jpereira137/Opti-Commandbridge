import { NextResponse } from "next/server"
import { hasApiKey, getConfiguredAccounts } from "@/lib/connecteam"

export async function GET() {
  const configuredAccounts = getConfiguredAccounts()
  
  return NextResponse.json({
    accountA: {
      configured: hasApiKey("A"),
      envVar: "CONNECTEAM_API_KEY_1",
    },
    accountB: {
      configured: hasApiKey("B"),
      envVar: "CONNECTEAM_API_KEY_2",
    },
    configuredAccounts,
    allConfigured: configuredAccounts.length === 2,
  })
}
