import { clsx } from "clsx"

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-white border border-slate-200 rounded-xl shadow-card", className)}>
      {children}
    </div>
  )
}

// ── Metric Card ───────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string | number
  icon: React.FC<{ size?: number; className?: string }>
  color?: "blue" | "red" | "green" | "amber" | "purple"
  change?: string
  changePositive?: boolean
}
export function MetricCard({ label, value, icon: Icon, color = "blue", change, changePositive }: MetricCardProps) {
  const colors = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   ring: "ring-blue-100"   },
    red:    { bg: "bg-red-50",    icon: "text-red-600",    ring: "ring-red-100"    },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  ring: "ring-green-100"  },
    amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  ring: "ring-amber-100"  },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", ring: "ring-purple-100" },
  }
  const c = colors[color]
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-navy-900 font-display">{value}</p>
          {change && (
            <p className={clsx("text-xs mt-1 font-medium", changePositive ? "text-green-600" : "text-red-500")}>
              {change}
            </p>
          )}
        </div>
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center ring-4", c.bg, c.ring)}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode
  className?: string
}
export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={clsx("badge", className)}>
      {children}
    </span>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}
export function Button({ variant = "secondary", size = "md", className, children, ...props }: ButtonProps) {
  const variants = {
    primary:   "bg-navy-900 text-white hover:bg-navy-800 border-navy-900",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border-slate-200",
    ghost:     "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
    danger:    "bg-red-600 text-white hover:bg-red-700 border-red-600",
  }
  const sizes = {
    sm: "h-8  px-3 text-xs",
    md: "h-9  px-4 text-sm",
    lg: "h-10 px-5 text-sm",
  }
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center gap-2 font-medium rounded-lg border transition-all cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant], sizes[size], className
      )}
    >
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  hint?: string
}
export function Input({ label, required, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          "h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600",
          "placeholder:text-slate-300 transition-all w-full",
          className
        )}
      />
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  children: React.ReactNode
}
export function Select({ label, required, className, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          className={clsx(
            "h-10 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm w-full",
            "focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600",
            "cursor-pointer transition-all",
            className
          )}
        >
          {children}
        </select>
        <svg className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx("text-xs font-bold text-slate-500 uppercase tracking-widest mb-3", className)}>
      {children}
    </h3>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = "md", className }: { name: string; size?: "sm"|"md"|"lg"; className?: string }) {
  const initials = name.split(" ").map(n => n[0] || "").slice(0,2).join("").toUpperCase()
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" }
  return (
    <div className={clsx("rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center flex-shrink-0", sizes[size], className)}>
      {initials}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.FC<{ size?: number; className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="font-semibold text-slate-700 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "blue", className }: {
  value: number; max?: number; color?: "blue"|"green"|"red"|"amber"; className?: string
}) {
  const pct = Math.round((value / max) * 100)
  const colors = { blue: "bg-blue-600", green: "bg-green-500", red: "bg-red-500", amber: "bg-amber-500" }
  return (
    <div className={clsx("h-2 bg-slate-100 rounded-full overflow-hidden", className)}>
      <div
        className={clsx("h-full rounded-full transition-all duration-500", colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label?: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative w-10 h-6 rounded-full transition-colors",
          checked ? "bg-navy-900" : "bg-slate-200"
        )}
      >
        <div className={clsx(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
          checked ? "left-5" : "left-1"
        )} />
      </div>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  )
}

// ── Status Dot ────────────────────────────────────────────────────────────────
export function StatusDot({ status }: { status: "active"|"inactive"|"pending"|"error" }) {
  const colors = {
    active:   "bg-green-500",
    inactive: "bg-slate-300",
    pending:  "bg-amber-500",
    error:    "bg-red-500",
  }
  return <span className={clsx("inline-block w-2 h-2 rounded-full", colors[status])} />
}

// ── Info Box ──────────────────────────────────────────────────────────────────
export function InfoBox({ type = "info", children, className }: {
  type?: "info"|"warning"|"success"|"error"
  children: React.ReactNode
  className?: string
}) {
  const styles = {
    info:    "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error:   "bg-red-50 border-red-200 text-red-800",
  }
  return (
    <div className={clsx("flex gap-2.5 p-3 rounded-lg border text-xs leading-relaxed", styles[type], className)}>
      {children}
    </div>
  )
}
