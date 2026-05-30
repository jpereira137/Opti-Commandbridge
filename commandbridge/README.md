# OptiSolutions CommandBridge

Complete employee management platform built with Next.js 14, Tailwind CSS, and TypeScript.

## Modules
- Dashboard — KPIs, shifts today, pending PTO, quick actions
- Employee Directory — table + card view, search, department filter
- Payroll Onboarding — full 7-step iSolved wizard (Personal → Employment → I-9 → Pay & Tax → Benefits → Signature → Checklist)
- Scheduling — weekly shift calendar, per-Connecteam-account filter
- Time Tracking — timesheet entries, approve/deny, CSV export
- PTO & Leave — request management, approve/deny, type filter
- Performance — reviews with star ratings, goal progress bars
- Documents — file list, signature tracking, upload
- Announcements — post editor, audience targeting (all / account 1 / account 2)
- Analytics — headcount, hours, PTO, performance charts
- Connecteam — dual-account status, API key config, employee lists

## Brand colors
- Navy: #1B2B4B
- Red: #C0392B

## Quick start
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel
```bash
npx vercel
```
Or push to GitHub and import at vercel.com/new

## Connect Connecteam
Replace mock data in lib/data.ts with real API calls:
- Connecteam API docs: https://developers.connecteam.com
- Store API keys in .env.local as CONNECTEAM_API_KEY_1 and CONNECTEAM_API_KEY_2

## Connect iSolved
Wire up the onboarding form submission in app/(app)/onboarding/page.tsx
Replace the alert() on "Complete enrollment" with a fetch() POST to iSolved's API.

## v0 instructions
Paste any page file into v0.dev for visual editing, then deploy to Vercel.
