// ── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = "owner" | "manager" | "employee"

export interface AppUser {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  jobTitle?: string
  department?: string
  avatar?: string
  managerId?: string
  employmentType?: string
  startDate?: string
  phone?: string
  workLocation?: string
  connecteamAccount?: "A" | "B" | null
  isActive: boolean
  createdAt: string
}

// ── Employee / Directory ──────────────────────────────────────────────────────

export interface Employee extends AppUser {
  ssn?: string           // stored encrypted, never returned to client
  dob?: string
  homeAddress?: string
  personalEmail?: string
  ecName?: string
  ecPhone?: string
  ecRelationship?: string
  flsaStatus?: string
  eeoCategory?: string
  payRate?: number
  rateType?: string
  payFrequency?: string
  paymentMethod?: string
  simpleIRA?: boolean
  iraContributionPct?: number
  flexPTO?: boolean
  i9Verified?: boolean
  onboardingComplete?: boolean
  checklistProgress?: number
}

// ── Enrollment / Onboarding ───────────────────────────────────────────────────

export interface EnrollmentForm {
  // Personal
  firstName: string; middleName: string; lastName: string; preferredName: string
  dob: string; ssn: string; personalEmail: string; phone: string; homeAddress: string
  ecName: string; ecPhone: string; ecRelationship: string
  // Employment
  jobTitle: string; department: string; employmentType: string; startDate: string
  workLocation: string; manager: string; workEmail: string; hoursPerWeek: string
  flsaStatus: string; eeoCategory: string
  // I-9
  citizenStatus: string; uscisNumber: string; workAuthExpiry: string
  listADoc: string; docNumber: string; issuingAuthority: string
  docExpiry: string; verificationDate: string
  listBDocs: string[]; listCDocs: string[]
  i9RepName: string; i9RepTitle: string; i9BizName: string; i9BizAddress: string
  i9Certified: boolean
  // Pay & Tax
  payRate: string; rateType: string; payFrequency: string; paymentMethod: string
  bankRouting: string; bankAccount: string; accountType: string
  fedFilingStatus: string; multipleJobs: string; dependentsCredit: string
  otherIncome: string; extraWithholding: string; fedExempt: string
  riFilingStatus: string; riAllowances: string; riExtraWithholding: string; riExempt: string
  maFilingStatus: string; maPersonalExemption: string; maDependents: string
  maAge65: string; maBlind: string; maExtraWithholding: string; maExempt: string
  // Benefits
  simpleIRA: boolean; iraContributionPct: string; iraBeneficiary: string; iraBeneficiaryRel: string
  flexPTO: boolean; ptoStartDate: string; ptoPlan: string
  // Signature
  sigTypedName: string; sigDate: string; sigDrawnData: string
  sigEmpName: string; sigEmpTitle: string
}

// ── Scheduling ────────────────────────────────────────────────────────────────

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  location: string
  department: string
  status: "scheduled" | "completed" | "absent" | "pending"
  connecteamAccount?: "A" | "B"
  notes?: string
}

// ── Time Tracking ─────────────────────────────────────────────────────────────

export interface TimeEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string
  clockOut?: string
  totalHours?: number
  breaks?: number
  status: "active" | "completed" | "approved" | "flagged"
  connecteamAccount?: "A" | "B"
}

// ── PTO & Leave ───────────────────────────────────────────────────────────────

export type LeaveType = "vacation" | "sick" | "personal" | "bereavement" | "unpaid"
export type LeaveStatus = "pending" | "approved" | "denied" | "cancelled"

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  approverId?: string
  approverName?: string
  approvedAt?: string
  notes?: string
  createdAt: string
}

export interface PTOBalance {
  employeeId: string
  year: number
  totalDays: number
  usedDays: number
  pendingDays: number
  remainingDays: number
}

// ── Performance ───────────────────────────────────────────────────────────────

export type ReviewStatus = "draft" | "in_progress" | "submitted" | "completed"

export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  reviewerId: string
  reviewerName: string
  period: string
  dueDate: string
  status: ReviewStatus
  ratings: Record<string, number>
  overallRating?: number
  strengths?: string
  improvements?: string
  goals?: string
  employeeComments?: string
  createdAt: string
}

export interface Goal {
  id: string
  employeeId: string
  title: string
  description: string
  dueDate: string
  progress: number
  status: "active" | "completed" | "overdue"
  createdAt: string
}

// ── Documents ─────────────────────────────────────────────────────────────────

export type DocCategory = "tax" | "onboarding" | "policy" | "benefits" | "contract" | "other"
export type DocStatus = "pending_signature" | "signed" | "archived"

export interface Document {
  id: string
  employeeId?: string
  name: string
  category: DocCategory
  status: DocStatus
  fileUrl?: string
  fileSize?: number
  uploadedBy: string
  uploadedAt: string
  signedAt?: string
  signedBy?: string
  expiresAt?: string
}

// ── Announcements ─────────────────────────────────────────────────────────────

export type AnnouncementPriority = "low" | "normal" | "high" | "urgent"

export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  authorId: string
  authorName: string
  targetRoles?: UserRole[]
  targetDepartments?: string[]
  pinned: boolean
  readBy: string[]
  publishedAt: string
  expiresAt?: string
}

// ── Connecteam ────────────────────────────────────────────────────────────────

export interface ConnecteamSyncStatus {
  account: "A" | "B"
  lastSync: string
  status: "connected" | "error" | "syncing"
  employeeCount: number
  department: string
  error?: string
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

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
