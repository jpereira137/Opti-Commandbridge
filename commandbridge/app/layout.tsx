import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["300","400","500","600","700"] })

export const metadata: Metadata = {
  title: "CommandBridge — OptiSolutions",
  description: "OptiSolutions CommandBridge — employee management hub",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
