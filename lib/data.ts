export type EmpStatus = "active" | "inactive" | "onboarding"
export type UserRole = "owner" | "manager" | "employee"

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  jobTitle: string
  department: string
  employmentType: string
  startDate: string
  status: EmpStatus
  manager: string
  location: string
  workLocation?: string
  payRate: number
  rateType: string
  connecteamAccount: "A" | "B"
  onboardingComplete?: boolean
  checklistProgress?: number
  i9Verified?: boolean
}

export interface PTOBalance {
  employeeId: string
  year: number
  totalDays: number
  usedDays: number
  pendingDays: number
  remainingDays: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: "vacation" | "sick" | "personal" | "bereavement" | "unpaid"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "denied" | "cancelled"
  approvedAt?: string
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  department: string
  location: string
  status: "scheduled" | "completed" | "missed" | "pending"
  connecteamAccount: "A" | "B"
}

export interface PTORequest {
  id: string
  employeeId: string
  employeeName: string
  type: "vacation" | "sick" | "personal" | "bereavement"
  startDate: string
  endDate: string
  days: number
  status: "pending" | "approved" | "denied"
  note: string
  submittedDate: string
}

export interface TimeEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string
  clockOut?: string
  hours?: number
  status: "active" | "completed" | "approved" | "pending" | "flagged"
  connecteamAccount: "A" | "B"
}

export interface Announcement {
  id: string
  title: string
  body: string
  authorName: string
  audience: "all" | "dept-a" | "dept-b"
  publishedAt: string
  readBy: string[]
  pinned: boolean
}

export interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  period: string
  overallRating: number
  status: "draft" | "submitted" | "acknowledged"
  goals: { id: string; title: string; progress: number; due: string }[]
  submittedAt?: string
}

export interface Document {
  id: string
  name: string
  category: string
  uploadedBy: string
  uploadedAt: string
  size: string
  signatureRequired: boolean
  signedBy: string[]
  url: string
}

export interface ConnecteamStatus {
  account: "A" | "B"
  department: string
  employeeCount: number
  lastSync: string
  status: "connected" | "error" | "syncing"
}

export interface DashboardMetrics {
  totalEmployees: number
  activeToday: number
  pendingPTO: number
  pendingOnboarding: number
  openShifts: number
  upcomingReviews: number
  documentsToSign: number
  announcements: number
}

// Mock Owner
export const MOCK_OWNER: Employee = {
  id: "owner1",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@optisolutions.com",
  phone: "(401) 555-0001",
  role: "owner",
  jobTitle: "Owner",
  department: "Executive",
  employmentType: "Full-time salaried",
  startDate: "2018-01-01",
  status: "active",
  manager: "—",
  location: "Providence, RI",
  payRate: 150000,
  rateType: "Annual salary",
  connecteamAccount: "A",
  onboardingComplete: true,
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", firstName: "Sarah", lastName: "Marchetti", email: "s.marchetti@optisolutions.com", phone: "(401) 555-0101", role: "manager", jobTitle: "Operations Manager", department: "Operations", employmentType: "Full-time salaried", startDate: "2021-03-15", status: "active", manager: "—", location: "Providence, RI", workLocation: "Providence, RI", payRate: 72000, rateType: "Annual salary", connecteamAccount: "A", onboardingComplete: true },
  { id: "e2", firstName: "David", lastName: "Chen", email: "d.chen@optisolutions.com", phone: "(401) 555-0102", role: "employee", jobTitle: "Field Technician", department: "Operations", employmentType: "Full-time hourly", startDate: "2022-07-01", status: "active", manager: "Sarah Marchetti", location: "Providence, RI", workLocation: "Providence, RI", payRate: 24.50, rateType: "Hourly", connecteamAccount: "A", onboardingComplete: true },
  { id: "e3", firstName: "Jasmine", lastName: "Rivera", email: "j.rivera@optisolutions.com", phone: "(617) 555-0103", role: "manager", jobTitle: "HR Specialist", department: "HR", employmentType: "Full-time salaried", startDate: "2020-11-08", status: "active", manager: "—", location: "Boston, MA", workLocation: "Boston, MA", payRate: 65000, rateType: "Annual salary", connecteamAccount: "B", onboardingComplete: true },
  { id: "e4", firstName: "Marcus", lastName: "Thompson", email: "m.thompson@optisolutions.com", phone: "(401) 555-0104", role: "employee", jobTitle: "Field Technician", department: "Operations", employmentType: "Full-time hourly", startDate: "2023-01-23", status: "active", manager: "Sarah Marchetti", location: "Providence, RI", workLocation: "Providence, RI", payRate: 22.00, rateType: "Hourly", connecteamAccount: "A", onboardingComplete: true },
  { id: "e5", firstName: "Priya", lastName: "Nair", email: "p.nair@optisolutions.com", phone: "(617) 555-0105", role: "employee", jobTitle: "Customer Success", department: "Support", employmentType: "Full-time salaried", startDate: "2022-04-11", status: "active", manager: "Jasmine Rivera", location: "Boston, MA", workLocation: "Boston, MA", payRate: 58000, rateType: "Annual salary", connecteamAccount: "B", onboardingComplete: true },
  { id: "e6", firstName: "Tyler", lastName: "Okafor", email: "t.okafor@optisolutions.com", phone: "(401) 555-0106", role: "employee", jobTitle: "Field Technician", department: "Operations", employmentType: "Part-time hourly", startDate: "2023-09-05", status: "active", manager: "Sarah Marchetti", location: "Providence, RI", workLocation: "Providence, RI", payRate: 19.00, rateType: "Hourly", connecteamAccount: "A", onboardingComplete: true },
  { id: "e7", firstName: "Amanda", lastName: "Walsh", email: "a.walsh@optisolutions.com", phone: "(617) 555-0107", role: "employee", jobTitle: "Billing Coordinator", department: "Finance", employmentType: "Full-time salaried", startDate: "2021-06-14", status: "active", manager: "Jasmine Rivera", location: "Boston, MA", workLocation: "Boston, MA", payRate: 55000, rateType: "Annual salary", connecteamAccount: "B", onboardingComplete: true },
  { id: "e8", firstName: "Kevin", lastName: "Santos", email: "k.santos@optisolutions.com", phone: "(401) 555-0108", role: "employee", jobTitle: "Field Technician", department: "Operations", employmentType: "Full-time hourly", startDate: "2024-02-19", status: "onboarding", manager: "Sarah Marchetti", location: "Providence, RI", workLocation: "Providence, RI", payRate: 22.00, rateType: "Hourly", connecteamAccount: "A", onboardingComplete: false, checklistProgress: 12, i9Verified: false },
  { id: "e9", firstName: "Diane", lastName: "Park", email: "d.park@optisolutions.com", phone: "(617) 555-0109", role: "employee", jobTitle: "Support Specialist", department: "Support", employmentType: "Full-time hourly", startDate: "2023-05-30", status: "active", manager: "Priya Nair", location: "Boston, MA", workLocation: "Boston, MA", payRate: 20.50, rateType: "Hourly", connecteamAccount: "B", onboardingComplete: true },
  { id: "e10", firstName: "Luis", lastName: "Gomez", email: "l.gomez@optisolutions.com", phone: "(401) 555-0110", role: "employee", jobTitle: "Field Technician", department: "Operations", employmentType: "Seasonal", startDate: "2024-05-01", status: "onboarding", manager: "Sarah Marchetti", location: "Providence, RI", workLocation: "Providence, RI", payRate: 18.00, rateType: "Hourly", connecteamAccount: "A", onboardingComplete: false, checklistProgress: 6, i9Verified: true },
]

export const MOCK_SHIFTS: Shift[] = [
  { id: "s1", employeeId: "e2", employeeName: "David Chen", date: new Date().toISOString().split("T")[0], startTime: "08:00", endTime: "16:00", department: "Operations", location: "Providence, RI", status: "scheduled", connecteamAccount: "A" },
  { id: "s2", employeeId: "e4", employeeName: "Marcus Thompson", date: new Date().toISOString().split("T")[0], startTime: "09:00", endTime: "17:00", department: "Operations", location: "Providence, RI", status: "scheduled", connecteamAccount: "A" },
  { id: "s3", employeeId: "e6", employeeName: "Tyler Okafor", date: new Date().toISOString().split("T")[0], startTime: "12:00", endTime: "18:00", department: "Operations", location: "Providence, RI", status: "scheduled", connecteamAccount: "A" },
  { id: "s4", employeeId: "e5", employeeName: "Priya Nair", date: new Date().toISOString().split("T")[0], startTime: "08:30", endTime: "16:30", department: "Support", location: "Boston, MA", status: "scheduled", connecteamAccount: "B" },
  { id: "s5", employeeId: "e9", employeeName: "Diane Park", date: new Date().toISOString().split("T")[0], startTime: "10:00", endTime: "18:00", department: "Support", location: "Boston, MA", status: "pending", connecteamAccount: "B" },
  { id: "s6", employeeId: "e10", employeeName: "Luis Gomez", date: new Date().toISOString().split("T")[0], startTime: "07:00", endTime: "15:00", department: "Operations", location: "Providence, RI", status: "scheduled", connecteamAccount: "A" },
  { id: "s7", employeeId: "e7", employeeName: "Amanda Walsh", date: new Date().toISOString().split("T")[0], startTime: "09:00", endTime: "17:00", department: "Finance", location: "Boston, MA", status: "completed", connecteamAccount: "B" },
]

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  { id: "t1", employeeId: "e2", employeeName: "David Chen", date: new Date().toISOString().split("T")[0], clockIn: "08:02", clockOut: undefined, hours: undefined, status: "active", connecteamAccount: "A" },
  { id: "t2", employeeId: "e4", employeeName: "Marcus Thompson", date: new Date().toISOString().split("T")[0], clockIn: "09:01", clockOut: undefined, hours: undefined, status: "active", connecteamAccount: "A" },
  { id: "t3", employeeId: "e6", employeeName: "Tyler Okafor", date: "2026-05-27", clockIn: "12:00", clockOut: "18:00", hours: 6.0, status: "pending", connecteamAccount: "A" },
  { id: "t4", employeeId: "e5", employeeName: "Priya Nair", date: "2026-05-27", clockIn: "08:35", clockOut: "16:40", hours: 8.1, status: "approved", connecteamAccount: "B" },
  { id: "t5", employeeId: "e9", employeeName: "Diane Park", date: "2026-05-27", clockIn: "10:00", clockOut: "18:05", hours: 8.1, status: "pending", connecteamAccount: "B" },
]

export const MOCK_PTO_REQUESTS: PTORequest[] = [
  { id: "p1", employeeId: "e2", employeeName: "David Chen", type: "vacation", startDate: "2026-06-15", endDate: "2026-06-19", days: 5, status: "pending", note: "Family trip", submittedDate: "2026-05-20" },
  { id: "p2", employeeId: "e5", employeeName: "Priya Nair", type: "sick", startDate: "2026-05-30", endDate: "2026-05-30", days: 1, status: "approved", note: "Doctor appointment", submittedDate: "2026-05-29" },
  { id: "p3", employeeId: "e9", employeeName: "Diane Park", type: "personal", startDate: "2026-06-03", endDate: "2026-06-03", days: 1, status: "pending", note: "Personal errand", submittedDate: "2026-05-28" },
  { id: "p4", employeeId: "e4", employeeName: "Marcus Thompson", type: "vacation", startDate: "2026-07-04", endDate: "2026-07-08", days: 5, status: "approved", note: "Fourth of July week", submittedDate: "2026-05-15" },
]

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Welcome to CommandBridge!", body: "We are excited to launch OptiSolutions CommandBridge — your new central hub for HR, payroll, scheduling, and team management.", authorName: "Jasmine Rivera", audience: "all", publishedAt: "2026-05-28T09:00:00Z", readBy: ["e1", "e2", "e3", "e4", "e5"], pinned: true },
  { id: "a2", title: "Q2 performance reviews due June 15", body: "All managers: Q2 performance reviews must be submitted by June 15.", authorName: "Jasmine Rivera", audience: "all", publishedAt: "2026-05-25T14:00:00Z", readBy: ["e1", "e3", "e7"], pinned: false },
  { id: "a3", title: "Operations team: updated shift schedule June 1", body: "Effective June 1, all Operations team members will follow the updated shift rotation.", authorName: "Sarah Marchetti", audience: "dept-a", publishedAt: "2026-05-22T11:00:00Z", readBy: ["e2", "e4", "e6"], pinned: false },
]

export const MOCK_CONNECTEAM_STATUS: ConnecteamStatus[] = [
  { account: "A", department: "Operations (Providence)", employeeCount: 6, lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), status: "connected" },
  { account: "B", department: "Support & Admin (Boston)", employeeCount: 4, lastSync: new Date(Date.now() - 45 * 60 * 1000).toISOString(), status: "connected" },
]

export const MOCK_DOCUMENTS: Document[] = [
  { id: "d1", name: "Employee Handbook 2026", category: "Policy", uploadedBy: "Jasmine Rivera", uploadedAt: "2026-01-02", size: "2.4 MB", signatureRequired: true, signedBy: ["e1", "e2", "e3", "e4", "e5", "e6", "e7"], url: "#" },
  { id: "d2", name: "SIMPLE IRA Plan Summary", category: "Benefits", uploadedBy: "Jasmine Rivera", uploadedAt: "2026-01-15", size: "1.1 MB", signatureRequired: false, signedBy: [], url: "#" },
  { id: "d3", name: "PTO Policy — Flexible Bank", category: "Policy", uploadedBy: "Jasmine Rivera", uploadedAt: "2026-02-01", size: "412 KB", signatureRequired: true, signedBy: ["e1", "e2", "e3", "e4", "e5"], url: "#" },
]

export const MOCK_REVIEWS: PerformanceReview[] = [
  { id: "r1", employeeId: "e2", reviewerId: "e1", period: "Q1 2026", overallRating: 4, status: "acknowledged", goals: [{ id: "g1", title: "Complete 95% of assigned tickets on time", progress: 92, due: "2026-03-31" }], submittedAt: "2026-04-05" },
  { id: "r2", employeeId: "e4", reviewerId: "e1", period: "Q1 2026", overallRating: 3, status: "submitted", goals: [{ id: "g3", title: "Reduce callback rate by 10%", progress: 65, due: "2026-03-31" }], submittedAt: "2026-04-08" },
]

// Helper functions
export function getDashboardMetrics(): DashboardMetrics {
  const pendingPTO = MOCK_PTO_REQUESTS.filter(r => r.status === "pending").length
  const pendingOnboarding = MOCK_EMPLOYEES.filter(e => !e.onboardingComplete).length
  const documentsToSign = MOCK_DOCUMENTS.filter(d => d.signatureRequired && d.signedBy.length < MOCK_EMPLOYEES.length).length
  const upcomingReviews = MOCK_REVIEWS.filter(r => r.status === "draft" || r.status === "submitted").length

  return {
    totalEmployees: MOCK_EMPLOYEES.length,
    activeToday: MOCK_TIME_ENTRIES.filter(t => t.status === "active").length,
    pendingPTO,
    pendingOnboarding,
    openShifts: MOCK_SHIFTS.filter(s => s.status === "scheduled").length,
    upcomingReviews,
    documentsToSign,
    announcements: MOCK_ANNOUNCEMENTS.length,
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    acknowledged: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    scheduled: "bg-blue-100 text-blue-700",
    onboarding: "bg-amber-100 text-amber-700",
    draft: "bg-slate-100 text-slate-600",
    submitted: "bg-blue-100 text-blue-700",
    denied: "bg-red-100 text-red-700",
    missed: "bg-red-100 text-red-700",
    error: "bg-red-100 text-red-700",
    inactive: "bg-slate-100 text-slate-500",
  }
  return colors[status] || "bg-slate-100 text-slate-600"
}

export function formatPay(rate: number, type: string): string {
  return type === "Hourly" ? `$${rate.toFixed(2)}/hr` : `$${rate.toLocaleString()}/yr`
}

export function getEmployee(id: string): Employee | undefined {
  return MOCK_EMPLOYEES.find(e => e.id === id)
}

export function fullName(e: Employee): string {
  return `${e.firstName} ${e.lastName}`
}

export function initials(e: Employee): string {
  return `${e.firstName[0]}${e.lastName[0]}`.toUpperCase()
}

export function getDeptColor(dept: string | undefined): string {
  const colors: Record<string, string> = {
    Operations: "bg-blue-100 text-blue-800",
    HR: "bg-purple-100 text-purple-800",
    Support: "bg-green-100 text-green-800",
    Finance: "bg-amber-100 text-amber-800",
    Executive: "bg-navy-100 text-navy-800",
  }
  return colors[dept || ""] || "bg-slate-100 text-slate-600"
}

export const MOCK_PTO_BALANCES: PTOBalance[] = [
  { employeeId: "e1", year: 2026, totalDays: 20, usedDays: 5, pendingDays: 0, remainingDays: 15 },
  { employeeId: "e2", year: 2026, totalDays: 15, usedDays: 3, pendingDays: 5, remainingDays: 7 },
  { employeeId: "e3", year: 2026, totalDays: 20, usedDays: 8, pendingDays: 0, remainingDays: 12 },
  { employeeId: "e4", year: 2026, totalDays: 15, usedDays: 2, pendingDays: 5, remainingDays: 8 },
  { employeeId: "e5", year: 2026, totalDays: 15, usedDays: 4, pendingDays: 0, remainingDays: 11 },
  { employeeId: "e6", year: 2026, totalDays: 10, usedDays: 1, pendingDays: 0, remainingDays: 9 },
  { employeeId: "e7", year: 2026, totalDays: 15, usedDays: 6, pendingDays: 0, remainingDays: 9 },
  { employeeId: "e9", year: 2026, totalDays: 15, usedDays: 2, pendingDays: 1, remainingDays: 12 },
]
